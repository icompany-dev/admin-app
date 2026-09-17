import { CompanyAssetPurchase } from "~/scripts/models/CompanyAssetPurchase"
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
import { StatusConstants } from "~/scripts/constants/Status"

export class PurchaseAssetServiceController extends CompanyServiceController<CompanyAssetPurchase> {
  companyAssetPurchase = ref<CompanyAssetPurchase>(new CompanyAssetPurchase())

  constructor(companyId: string, viewType: string, emitEvents: any | null) {
    super(companyId, true, false, CompanyAssetPurchase, useCompanyAssetPurchaseStore(), emitEvents)
    this.target = CompanyConstants.TARGET_PURCHASE_ASSET
    this.setViewType(viewType)
    this.initializeData()
  }

  async initializeData(): Promise<void> {
    this.isLoading.value = true

    switch (this.viewType.value) {
      case ViewMode.New:
        this.isInPreviewMode.value = true
        this.companyAssetPurchase.value = new CompanyAssetPurchase(this.companyServiceInitializer.newApplication)
        await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setExistingApplication()])
        if (this.companyServiceInitializer.existingApplication) {
          this.viewType.value = ViewMode.Existing
          this.hasOngoingApplication.value = true
          this.isInPreviewMode.value = false
          this.companyAssetPurchase.value = new CompanyAssetPurchase(this.companyServiceInitializer.existingApplication)
        }
        break
      case ViewMode.Existing:
        this.isInPreviewMode.value = false
        await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setExistingApplication()])
        if (this.companyServiceInitializer.existingApplication) {
          this.hasOngoingApplication.value = true
        } else {
          this.hasOngoingApplication.value = false
          this.emitEvents(EmitMessages.GO_TO_NEW)
        }
        this.companyAssetPurchase.value = new CompanyAssetPurchase(this.companyServiceInitializer.existingApplication)
        break
      case ViewMode.Past:
        this.isInPreviewMode.value = true
        await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setPastApplications()])
        this.hasPastApplications.value = this.companyServiceInitializer.pastApplications.length > 0
        this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, this.hasPastApplications.value)
        break
    }

    await this.init(this.companyAssetPurchase.value as CompanyAssetPurchase)
    this.isLoading.value = false
  }

  async fetchOngoingApplication(): Promise<void> {
    try {
      let apiRecord = await this.repository.fetchAll(this.ongoingFilter)
      if (this.repository.error !== null) {
        throw this.repository.error
      }

      if (apiRecord.totalRecords <= 0) {
        this.companyAssetPurchase.value = new CompanyAssetPurchase()
        this.companyAssetPurchase.value.companyId = this.companyId
        this.hasOngoingApplication.value = false
        return
      }

      this.companyAssetPurchase.value = new CompanyAssetPurchase(apiRecord.data[0])
      this.isInPreviewMode.value = false
      this.hasOngoingApplication.value = true
    } catch (error) {
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage = new Error()
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

      let lastApplication = new CompanyAssetPurchase(apiRecord.data[0])
      this.lastApplicationDate.value = this.time.formatDateOnlyFull(lastApplication.updatedAt)
      this.hasPastApplications.value = true
      this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, true)
    } catch (error) {
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage = new Error()
        errorMessage.setForFetch()
        errorMessage.handle()
      }
    }
  }

  async onApplicationUpdated(application: CompanyAssetPurchase): Promise<void> {
    await this.fetchOngoingApplication()

    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(this.companyAssetPurchase.value)
    }
  }

  setApplicationData(applicationData: CompanyAssetPurchase): void {
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

      if (StringUtil.isNullOrEmpty(this.companyAssetPurchase.value.id)) {
        await this.submitApplication()
      }

      let makePayment = new MakePayment(
        PaymentConstants.PAYMENT_CART_ENTITY_TYPE_COMPANY,
        this.companyId,
        this.target,
        this.companyAssetPurchase.value.id
      )
      await makePayment.setPaymentCart()

      this.emitEvents("pay", makePayment.paymentCart)
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        console.error(e)
        let errorMessage = new Error()
        errorMessage.setForPaymentDetails()
        errorMessage.handle()
      }
    } finally {
      this.isSubmitting.value = false
    }
  }

  async submitApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyAssetPurchase.value.id)) {
      this.companyAssetPurchase.value.companyId = this.companyId
      await this.companyAssetPurchase.value.create(useCompanyAssetPurchaseStore())
    } else {
      await this.companyAssetPurchase.value.update(useCompanyAssetPurchaseStore())
    }
  }

  async onProceedClicked(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyAssetPurchase.value.id) || !this.hasPaid()) {
      this.makePayment()
      return
    }

    // if (this.wrapperRef) {
    //   this.wrapperRef.enlarge()
    // }
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
      ? "Maklumat Lanjut: Pembelian Aset Syarikat"
      : "Learn More: Purchase of Company Asset"
  }

  alertContent(): string {
    if (this.language.isMalay()) {
      return `
      Lorem Ipsum...
      `
    }

    return `
      Lorem Ipsum...
    `
  }

  slipCaseTitle(): string {
    return this.language.isMalay() ? "Resolusi: Pembelian Aset" : "Resolution: Purchase of Asset"
  }

  get serviceWrapperProps() {
    let showPasca =
      this.viewType.value === ViewMode.Existing && this.companyAssetPurchase.value.status !== StatusConstants.COMPLETED

    let props = new PropsCompanyServiceWrapper(
      this.companyAssetPurchase.value,
      this.companyId,
      this.target,
      this.slipCaseTitle(),
      this.viewType.value,
      this.hasOngoingApplication.value,
      this.hasPastApplications.value,
      this.companyAssetPurchase.value.id,
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
      this.haveAllSigned(),
      true,
      this.backLabel(),
      this.payLabel(),
      this.hoveredButtonLabel(),
      this.isInPreviewMode.value,
      this.isSubmitting.value,
      CompanyAssetPurchase,
      useCompanyAssetPurchaseStore()
    )

    // props.isSubmittingDocument = this.isUpdatingDocument.value

    return props
  }

  get resolutionDocumentProps() {
    let props = new PropsResolutionDocument<CompanyAssetPurchase>(
      this.companyId,
      this.companyAssetPurchase.value.id,
      null,
      this.showWatermark(),
      this.watermarkText(),
      this.isInPreviewMode.value,
      false
    )

    // props.isShowTag = this.isShowTags

    return props
  }

  get status(): string {
    if (!this.haveAllSigned()) {
      return this.language.isMalay() ? "Menunggu Tindakan Pengarah Lain" : "Awaiting Responses from Other Directors"
    }

    return this.language.isMalay() ? "Semua Tandatangan Diterima" : "All Signatures Received"
  }
}
