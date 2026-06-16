import { CompanyNotifyChangeOfName } from "~/scripts/models/CompanyNotifyChangeOfName"
import { CompanyServiceController } from "./CompanyServiceController"
import { Error } from "~/scripts/library/Error"
import { StringUtil } from "~/scripts/utils/String"
import { CompanyConstants } from "~/scripts/constants/Company"
import { PaymentConstants } from "~/scripts/constants/Payment"
import { PropsCompanyServiceWrapper } from "~/scripts/props/PropsCompanyServiceWrapper"
import { EmitMessages } from "~/scripts/constants/EmitMessages"
import { ViewMode } from "~/scripts/constants/ViewMode"
import { MakePayment } from "~/scripts/library/MakePayment"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

export class NotifyBankChangeOfCompanyNameServiceController extends CompanyServiceController<CompanyNotifyChangeOfName> {
  companyNotifyChangeOfName = ref<CompanyNotifyChangeOfName>(new CompanyNotifyChangeOfName())

  wrapperRef: any | null = null

  constructor(companyId: string, viewType: string, emitEvents: any | null) {
    super(companyId, true, false, CompanyNotifyChangeOfName, useCompanyNotifyChangeOfNameStore(), emitEvents)
    this.target = CompanyConstants.TARGET_NOTIFY_CHANGE_OF_NAME
    this.setViewType(viewType)
    this.initializeData()
  }

  async initializeData(): Promise<void> {
    switch (this.viewType.value) {
      case ViewMode.New:
        this.isInPreviewMode.value = true
        this.companyNotifyChangeOfName.value = new CompanyNotifyChangeOfName(
          this.companyServiceInitializer.newApplication
        )
        await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setExistingApplication()])
        if (this.companyServiceInitializer.existingApplication) {
          this.hasOngoingApplication.value = true
          this.companyNotifyChangeOfName.value = new CompanyNotifyChangeOfName(
            this.companyServiceInitializer.existingApplication
          )
        }
        break
      case ViewMode.Existing:
        this.isInPreviewMode.value = false
        await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setExistingApplication()])
        if (this.companyServiceInitializer.existingApplication) {
          this.hasOngoingApplication.value = true
        } else {
          this.hasOngoingApplication.value = false
        }
        this.companyNotifyChangeOfName.value = new CompanyNotifyChangeOfName(
          this.companyServiceInitializer.existingApplication
        )
        break
      case ViewMode.Past:
        this.isInPreviewMode.value = true
        await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setPastApplications()])
        this.hasPastApplications.value = this.companyServiceInitializer.pastApplications.length > 0
        this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, this.hasPastApplications.value)
        break
    }

    this.init(this.companyNotifyChangeOfName.value as CompanyNotifyChangeOfName)
  }

  async fetchOngoingApplication(): Promise<void> {
    try {
      let apiRecord = await this.repository.fetchAll(this.ongoingFilter)
      if (this.repository.error !== null) {
        throw this.repository.error
      }

      if (apiRecord.totalRecords <= 0) {
        this.companyNotifyChangeOfName.value = new CompanyNotifyChangeOfName()
        this.companyNotifyChangeOfName.value.companyId = this.companyId
        this.hasOngoingApplication.value = false
        return
      }

      this.companyNotifyChangeOfName.value = new CompanyNotifyChangeOfName(apiRecord.data[0])
      this.isInPreviewMode.value = false
      this.hasOngoingApplication.value = true
    } catch (error) {
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage = new Error("", "")
        errorMessage.setForFetch()
        errorMessage.handle()
      }
    }
  }

  async fetchPreviousSubmission(): Promise<void> {
    try {
      let apiRecord = await this.repository.fetchAll(this.lastSubmissionFilter)
      if (this.repository.error !== null) {
        throw this.repository.error
      }

      if (apiRecord.totalRecords <= 0) {
        this.hasSubmittedBefore.value = false
        this.lastApplicationDate.value = ""
        this.hasPastApplications.value = false
        this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, false)
        return
      }

      let lastApplication = new CompanyNotifyChangeOfName(apiRecord.data[0])
      this.lastApplicationDate.value = this.time.formatDateOnlyFull(lastApplication.updatedAt)
      this.hasPastApplications.value = true
      this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, true)
    } catch (error) {
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage = new Error("", "")
        errorMessage.setForFetch()
        errorMessage.handle()
      }
    }
  }

  async onApplicationUpdated(application: CompanyNotifyChangeOfName): Promise<void> {
    await this.fetchOngoingApplication()

    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(this.companyNotifyChangeOfName.value)
    }
  }

  setApplicationData(applicationData: CompanyNotifyChangeOfName): void {
    if (!applicationData) {
      return
    }

    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(applicationData)
    }
  }

  async makePayment(): Promise<void> {
    if (this.isSubmitting.value) {
      return
    }

    try {
      this.isSubmitting.value = true

      if (StringUtil.isNullOrEmpty(this.companyNotifyChangeOfName.value.id)) {
        await this.submitApplication()
      }

      let makePayment = new MakePayment(
        PaymentConstants.PAYMENT_CART_ENTITY_TYPE_COMPANY,
        this.companyId,
        this.target,
        this.companyNotifyChangeOfName.value.id
      )
      await makePayment.setPaymentCart()

      this.emitEvents("pay", makePayment.paymentCart)
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage = new Error("", "")
        errorMessage.setForMakePayment()
        errorMessage.handle()
      }
    } finally {
      this.isSubmitting.value = false
    }
  }

  async submitApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyNotifyChangeOfName.value.id)) {
      this.companyNotifyChangeOfName.value.companyId = this.companyId
      await this.companyNotifyChangeOfName.value.create(useCompanyNotifyChangeOfNameStore())
    } else {
      await this.companyNotifyChangeOfName.value.update(useCompanyNotifyChangeOfNameStore())
    }
  }

  async onProceedClicked(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyNotifyChangeOfName.value.id) || !this.hasPaid()) {
      this.makePayment()
      return
    }

    if (this.wrapperRef) {
      this.wrapperRef.enlarge()
    }
  }

  setWrapperRef(wrapperRef: any | null): void {
    this.wrapperRef = wrapperRef
  }

  helpTitle(): string {
    return this.language.isMalay() ? "Tukar Alamat Berdaftar" : "Change Registered Address"
  }

  helpDescription(): string {
    if (this.language.isMalay()) {
      return `Apabila sesebuah syarikat menukar alamat berdaftar, syarikat
        tersebut perlu memberitahu SSM (Suruhanjaya Syarikat Malaysia) mengenai
        perubahan itu dalam tempoh empat belas hari dari tarikh kuat kuasa perubahan.
        <br><br>
        Alamat berdaftar adalah alamat rasmi syarikat yang didaftarkan dengan SSM,
        di mana semua surat-menyurat rasmi dan notis undang-undang akan dihantar.
        Pemberitahuan pertukaran alamat berdaftar hendaklah dibuat dalam borang dan
        cara yang ditetapkan oleh Arahan Amalan SSM. Merupakan suatu kesalahan
        di bawah Seksyen 591 Akta Syarikat 2016 untuk memberikan maklumat palsu atau
        mengelirukan kepada Pendaftar.`
    }

    return `When a company changes its registered address, it must notify
      SSM (Companies Commission of Malaysia) of the change within fourteen days
      from the effective date of the change.
      <br><br>
      The registered address is the company's official address registered with SSM,
      where all official correspondence and legal notices will be sent.
      The notification of change in registered address is to be done in the form
      and manner specified by SSM's Practice Directive. It is an offense
      under Section 591 of the Companies Act 2016 to provide false or misleading
      information to the Registrar.`
  }

  alertTitle(): string {
    return this.language.isMalay()
      ? "Metera Syarikat bagi Penyempurnaan Dokumen"
      : "Company Seal for Executing a Document"
  }

  alertContentFirstPart(): string {
    return this.language.isMalay() ? "Penggunaan" : "The use of"
  }

  alertContentTriggerWord(): string {
    return this.language.isMalay() ? "Metera Am atau Metera Korporat" : "Common Seal or Corporate Seal"
  }

  alertContentLastPart(): string {
    if (this.language.isMalay()) {
      return `
        telah wujud sebelum Akta Syarikat 2016 dan kini tidak lagi diwajibkan. Ia berasal dari zaman pertengahan 
        awal, di mana meterai diiktiraf sebagai kaedah rasmi untuk mengesahkan dokumen bagi menggantikan 
        tandatangan dan, secara mengejutkan, ia masih digunakan sekali-sekala sehingga hari ini.
        <br><br>
        Bagi tujuan tadbir urus dan kawalan, kami mengesyorkan agar setiap penggunaan Meterai Am direkodkan 
        dengan betul, termasuk lokasi simpanan, pengguna yang diberi kuasa, serta tujuan Meterai Am tersebut 
        dimaktubkan.
      `
    }

    return `
      predates the Companies Act 2016 and is no longer mandatory. It traces its origins to early medieval 
      times, when seals were recognised as a formal method of authenticating documents in place of a 
      signature and, surprisingly, are still occasionally used today.
      <br><br>
      For governance and control purposes, we recommend that every use of the Common Seal be properly 
      recorded, including the custody location, authorised user and the purpose for which the Common Seal 
      was affixed.
    `
  }

  tooltipTitle(): string {
    return this.language.isMalay() ? "Kenapa guna Metera Am?" : "Why Use a Common Seal?"
  }

  tooltipContent(): string {
    if (this.language.isMalay()) {
      return `
        Meterai Am tidak lagi diwajibkan di bawah Akta Syarikat 2016, namun banyak bank, peguam, dan 
        institusi masih memintanya semasa penyempurnaan dokumen atas faktor polisi dalaman, prosedur 
        warisan, dan amalan pengurusan risiko. Dalam sesetengah keadaan, ia juga berfungsi sebagai 
        mekanisme kawalan dalaman bagi memastikan dokumen disempurnakan dengan 'sewajarnya', seolah-olah 
        Seksyen 66(2) Akta tersebut tidak wujud. Sampaikan perkara ini kepada pegawai bank anda—mari kita 
        hentikan penggunaan Meterai Am.
        <br><br>
        Kadangkala, dalam dunia korporat, jika sesuatu perkara itu boleh dirumitkan, ia pasti akan 
        berlaku, dan kita semua amat maklum bahawa birokrasi jarang sekali datang dalam bentuk yang 
        ringkas.
      `
    }

    return `
      The Common Seal is no longer mandatory under the Companies Act 2016, but many banks, 
      lawyers and institutions still request it when executing documents due to internal policies, 
      legacy procedures and risk management practices. In some cases, it also serves as an internal 
      control mechanism to ensure documents are ‘properly’ executed as if Section 66(2) of the 
      Act does not exist. Convey this to your bankers, let’s do away with Common Seal.
      <br><br>
      Sometimes, in corporate life, if something can be made complicated, it will be and we all
      know far too well that bureaucracy rarely travel light
    `
  }

  slipCaseTitle(): string {
    return this.language.isMalay() ? "Makluman Penukaran Nama kepada Bank" : "Notify Bank of Change of Name"
  }

  get serviceWrapperProps() {
    let isInPreviewMode = this.viewType.value === ViewMode.New ? true : false
    let showPasca = this.viewType.value === ViewMode.Existing

    return new PropsCompanyServiceWrapper(
      this.companyNotifyChangeOfName.value,
      this.companyId,
      this.target,
      this.slipCaseTitle(),
      this.viewType.value,
      this.hasOngoingApplication.value,
      this.hasPastApplications.value,
      this.companyNotifyChangeOfName.value.id,
      this.currentPage.value,
      this.totalPages.value,
      "DCR",
      showPasca,
      this.hasPaid(),
      this.price.value,
      this.haveAllSigned(),
      this.hasSigned(),
      this.userSignatureDate(),
      this.hasDcr.value,
      this.hasMcr.value,
      this.totalNumberOfDirectors.value,
      this.totalNumberOfShareholders.value,
      false,
      true,
      this.backLabel(),
      this.payLabel(),
      this.hoveredButtonLabel(),
      isInPreviewMode,
      this.isSubmitting.value,
      CompanyNotifyChangeOfName,
      useCompanyNotifyChangeOfNameStore()
    )
  }

  get resolutionDocumentProps() {
    return new PropsResolutionDocument<CompanyNotifyChangeOfName>(
      this.companyId,
      this.companyNotifyChangeOfName.value.id,
      null,
      this.showWatermark(),
      this.watermarkText(),
      this.isInPreviewMode.value,
      false
    )
  }
}
