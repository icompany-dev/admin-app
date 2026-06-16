import { CompanyDelegationOfAuthority } from "~/scripts/models/CompanyDelegationOfAuthority"
import { CompanyServiceController } from "./CompanyServiceController"
import { Error } from "~/scripts/library/Error"
import { StringUtil } from "~/scripts/utils/String"
import { CompanyConstants } from "~/scripts/constants/Company"
import { PropsCompanyServiceWrapper } from "~/scripts/props/PropsCompanyServiceWrapper"
import { EmitMessages } from "~/scripts/constants/EmitMessages"
import { ViewMode } from "~/scripts/constants/ViewMode"
import { PaymentConstants } from "~/scripts/constants/Payment"
import { MakePayment } from "~/scripts/library/MakePayment"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

export class DelegationOfAuthorityServiceController extends CompanyServiceController<CompanyDelegationOfAuthority> {
  companyDelegationOfAuthority = ref<CompanyDelegationOfAuthority>(new CompanyDelegationOfAuthority())

  wrapperRef: any | null = null

  constructor(companyId: string, viewType: string, emitEvents: any | null) {
    super(companyId, true, false, CompanyDelegationOfAuthority, useCompanyDelegationOfAuthorityStore(), emitEvents)
    this.target = CompanyConstants.TARGET_DELEGATION_OF_AUTHORITY
    this.setViewType(viewType)
    this.initializeData()
  }

  async initializeData(): Promise<void> {
    switch (this.viewType.value) {
      case ViewMode.New:
        this.isInPreviewMode.value = true
        this.companyDelegationOfAuthority.value = new CompanyDelegationOfAuthority(
          this.companyServiceInitializer.newApplication
        )
        await this.fetchPrice()
        break
      case ViewMode.Existing:
        this.isInPreviewMode.value = false
        await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setExistingApplication()])
        if (this.companyServiceInitializer.existingApplication) {
          this.hasOngoingApplication.value = true
        } else {
          this.hasOngoingApplication.value = false
        }
        this.companyDelegationOfAuthority.value = new CompanyDelegationOfAuthority(
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

    this.init(this.companyDelegationOfAuthority.value as CompanyDelegationOfAuthority)
  }

  async fetchOngoingApplication(): Promise<void> {
    try {
      let apiRecord = await this.repository.fetchAll(this.ongoingFilter)
      if (this.repository.error !== null) {
        throw this.repository.error
      }

      if (apiRecord.totalRecords <= 0) {
        this.companyDelegationOfAuthority.value = new CompanyDelegationOfAuthority()
        this.companyDelegationOfAuthority.value.companyId = this.companyId
        return
      }

      this.companyDelegationOfAuthority.value = new CompanyDelegationOfAuthority(apiRecord.data[0])
      this.isInPreviewMode.value = false
      this.hasOngoingApplication.value = true
    } catch (error) {
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage = new Error(Error.ERROR_TYPE_API, "Unable to fetch ongoing application for company")
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

      let lastApplication = new CompanyDelegationOfAuthority(apiRecord.data[0])
      this.lastApplicationDate.value = this.time.formatDateOnlyFull(lastApplication.updatedAt)
      this.hasPastApplications.value = true
      this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, true)
    } catch (error) {
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage = new Error(Error.ERROR_TYPE_API, "Unable to fetch latest submission for company")
        errorMessage.handle()
      }
    }
  }

  async onApplicationUpdated(application: CompanyDelegationOfAuthority): Promise<void> {
    await this.fetchOngoingApplication()

    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(this.companyDelegationOfAuthority.value)
    }
  }

  setApplicationData(applicationData: CompanyDelegationOfAuthority): void {
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

      await this.submitApplication()
      let makePayment = new MakePayment(
        PaymentConstants.PAYMENT_CART_ENTITY_TYPE_COMPANY,
        this.companyId,
        this.target,
        this.companyDelegationOfAuthority.value.id
      )
      await makePayment.setPaymentCart()

      this.emitEvents("pay", makePayment.paymentCart)
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        console.error(e)
        let error: Error = new Error(Error.ERROR_TYPE_API, "Unable to proceed with payment. Please try again")
        error.handle()
      }
    } finally {
      this.isSubmitting.value = false
    }
  }

  async submitApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyDelegationOfAuthority.value.id)) {
      this.companyDelegationOfAuthority.value.companyId = this.companyId
      await this.companyDelegationOfAuthority.value.create(useCompanyDelegationOfAuthorityStore())
    } else {
      await this.companyDelegationOfAuthority.value.update(useCompanyDelegationOfAuthorityStore())
    }
  }

  async onProceedClicked(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyDelegationOfAuthority.value.id)) {
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
    return this.language.isMalay() ? "Perwakilan Kuasa" : "Delegation of Authority"
  }

  slipCaseTitle(): string {
    return this.language.isMalay() ? "Resolusi: Perwakilan Kuasa" : "Resolution: Delegation of Authority"
  }

  helpDescription(): string {
    if (this.language.isMalay()) {
      return `
        Perwakilan Kuasa membolehkan Lembaga Pengarah mewakilkan kuasa tertentu secara rasmi kepada pengarah, jawatankuasa, pegawai, atau orang yang diberikuasa demi kecekapan operasi.
        <br><br>
        Di bawah Seksyen 216 Akta Syarikat 2016, Lembaga Pengarah boleh mewakilkan kuasanya, namun perwakilan tersebut tidak melepaskan Pengarah daripada tugas atau tanggungjawab statutori mereka. Lembaga Pengarah tetap bertanggungjawab ke atas semua tindakan yang dilakukan di bawah kuasa yang diwakilkan tersebut.
        <br><br>
        Perwakilan kuasa biasanya digunakan untuk: 
        <ul> 
          <li>
            keputusan operasi harian
          </li>
          <li>
            pelaksanaan dokumen dan kontrak
          </li>
          <li>
            had kewangan atau pentadbiran yang ditetapkan
          </li>
        </ul> 
        Sebarang perwakilan hendaklah direkodkan dengan jelas, ditentukan skopnya, serta tertakluk kepada syarat-syarat atau pembatalan oleh Lembaga Pengarah pada bila-bila masa, selaras dengan Akta dan Perlembagaan Syarikat (jika ada).`
    }

    return `
      Delegation of Authority allows the Board of Directors to formally delegate specific powers to a director, committee, officer, or authorised person for operational efficiency.
      <br><br>
      Under Section 216 of the Companies Act 2016, the Board may delegate its powers, but such delegation does not absolve the Directors of their statutory duties or responsibilities. The Board remains accountable for all acts done under the delegated authority.
      <br><br>
      Delegation is typically used for:
      <ul>
        <li>
          day-to-day operational decisions
        </li>
        <li>
          execution of documents and contracts
        </li>
        <li>
          defined financial or administrative limits
        </li>
      </ul>
      Any delegation should be clearly recorded, scoped, and subject to conditions or revocation by the Board at any time, in accordance with the Act and the Company’s Constitution (if any).`
  }

  alertTitle(): string {
    return this.language.isMalay() ? "Maklumat Lanjut: Perwakilan Kuasa" : "Learn More: Delegation of Authority"
  }

  alertContent(): string {
    if (this.language.isMalay()) {
      return `
        <p>
          <span class='glossary' id='delegation-of-authority'>Perwakilan Kuasan</span> merujuk kepada proses di mana 
          Lembaga Pengarah memberi kuasa kepada seseorang Pengarah, pegawai, atau individu tertentu untuk bertindak 
          bagi pihak syarikat dalam skop yang ditetapkan. Di bawah Seksyen 216 Akta Syarikat 2016, para Pengarah boleh 
          mewakilkan mana-mana kuasa mereka kepada jawatankuasa, Pengarah, pegawai, atau orang lain, tertakluk kepada 
          sebarang had atau syarat yang dikenakan oleh Lembaga Pengarah.
        </p>
        <p>
          Pewakilan tersebut mestilah jelas, spesifik, dan didokumentasikan, termasuk skop kuasa, had, dan tempoh 
          (jika ada). Ini bagi memastikan tindakan yang diambil adalah diberikuasa dengan sewajarnya dan berada dalam 
          sempadan yang ditetapkan oleh syarikat. Pewakilan Kuasa tidak memindahkan tanggungjawab. Lembaga Pengarah 
          tetap bertanggungjawab sepenuhnya ke atas keputusan dan tindakan yang dijalankan di bawah pewakilan tersebut.
        </p>
        <p>
          Aplikasi ini memudahkan penyediaan Resolusi yang diperlukan untuk merekod dan menetapkan kuasa wakil secara 
          rasmi bagi tujuan operasi atau transaksi.
          Anda diingatkan bahawa sebarang tindakan yang diambil di luar skop yang dibenarkan mungkin tidak sah dan 
          boleh mendedahkan individu serta syarikat kepada risiko undang-undang dan tadbir urus.
        </p>
        <p>
          <b>Rujukan:</b> Seksyen 216 Akta Syarikat 2016.
        </p>
      `
    }

    return `
      <p>
        <span class='glossary' id='delegation-of-authority'>Delegation of Authority</span> refers to the process where 
        the Board of Directors authorises a Director, officer, or specific individual to act on behalf of the company 
        within a defined scope. Under Section 216 of the Companies Act 2016, the Directors may delegate any of their 
        powers to committees, Directors, officers, or other persons, subject to any limitations or conditions imposed by the Board.
      </p>
      <p>
        The delegation must be clear, specific, and documented, including the scope of authority, limitations, and duration 
        (if any). This ensures that actions taken are properly authorised and within the boundaries set by the company. Delegation 
        of Authority does not transfer responsibility. The Board remains ultimately responsible for the decisions and actions 
        carried out under such delegation.
      </p>
      <p>
        This Application facilitates the preparation of the necessary Resolution to formally record and define the delegated 
        authority for operational or transactional purposes.
        <br>
        You are reminded that any action taken outside the authorised scope may be invalid and may expose the individual and 
        the company to legal and governance risks.
      </p>
      <p>
        <b>Reference:</b> Section 216 of the Companies Act 2016
      </p>
    `
  }

  override backLabel(): string {
    return this.language.isMalay() ? "Kembali" : "Back"
  }

  get serviceWrapperProps() {
    let application =
      this.viewType.value === ViewMode.New
        ? new CompanyDelegationOfAuthority()
        : this.companyDelegationOfAuthority.value
    if (this.viewType.value === ViewMode.New) {
      application.companyId = this.companyId
    }

    let isInPreviewMode = this.viewType.value === ViewMode.New ? true : false
    let showPasca = this.viewType.value === ViewMode.Existing

    return new PropsCompanyServiceWrapper(
      application,
      this.companyId,
      this.target,
      this.slipCaseTitle(),
      this.viewType.value,
      this.hasOngoingApplication.value,
      this.hasPastApplications.value,
      application.id,
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
      CompanyDelegationOfAuthority,
      useCompanyDelegationOfAuthorityStore()
    )
  }

  get resolutionDocumentProps() {
    return new PropsResolutionDocument<CompanyDelegationOfAuthority>(
      this.companyId,
      this.companyDelegationOfAuthority.value.id,
      null,
      this.showWatermark(),
      this.watermarkText(),
      this.isInPreviewMode.value,
      false
    )
  }
}
