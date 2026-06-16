import { CompanyShareholderAllotment } from "~/scripts/models/CompanyShareholderAllotment"
import { CompanyShareIssuance } from "~/scripts/models/CompanyShareIssuance"
import { CompanyServiceController } from "./CompanyServiceController"
import { Error } from "~/scripts/library/Error"
import { StringUtil } from "~/scripts/utils/String"
import { CompanyConstants } from "~/scripts/constants/Company"
import { PaymentConstants } from "~/scripts/constants/Payment"
import { StatusConstants } from "~/scripts/constants/Status"
import { Filter } from "~/scripts/library/Filter"
import { PropsCompanyServiceWrapper } from "~/scripts/props/PropsCompanyServiceWrapper"
import { ViewMode } from "~/scripts/constants/ViewMode"
import { EmitMessages } from "~/scripts/constants/EmitMessages"
import { MakePayment } from "~/scripts/library/MakePayment"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { ServicePricing } from "~/scripts/models/ServicePricing"
import { PaymentCartItem } from "~/scripts/models/PaymentCartItem"
import { SignatureGroup } from "~/scripts/models/SignatureGroup"
import { Shareholder } from "~/scripts/models/Shareholder"
import { ObjectUtil } from "~/scripts/utils/Object"

export class AllotNewSharesServiceController extends CompanyServiceController<CompanyShareholderAllotment> {
  companyShareholderAllotment = ref<CompanyShareholderAllotment>(new CompanyShareholderAllotment())
  companyShareIssuanceId: Ref<string> = ref<string>("")
  companyShareIssuance = ref<CompanyShareIssuance>(new CompanyShareIssuance())

  companyShareIssuanceRepository = useCompanyShareIssuanceStore()

  wrapperRef: any | null = null

  private priceIdForLessThan1001: string = "2532bb00-7e39-4930-96f2-05f28bbc2b22"
  private priceIdForLessThan499K: string = "2624004f-24a5-43bb-aaa3-a7d288ed036f"
  private priceIdForMoreThan500K: string = "64485542-8629-4a3a-a476-7ea7a2c899e2"
  private servicePricing = ref<ServicePricing>(new ServicePricing())

  constructor(companyId: string, viewType: string, emitEvents: any | null) {
    super(companyId, true, true, CompanyShareholderAllotment, useCompanyShareholderAllotmentStore(), emitEvents)
    this.target = CompanyConstants.TARGET_SHAREHOLDER_ALLOTMENT_OF_SHARES
    this.setViewType(viewType)
    this.initializeData()
  }

  async initializeData(): Promise<void> {
    if (this.isLoading.value) {
      return
    }

    this.isLoading.value = true

    if (this.viewType.value !== ViewMode.Past) {
      await Promise.all([this.fetchRespondedShareIssuance(), this.fetchOngoingApplication()])

      if (this.hasOngoingApplication.value) {
        if (this.companyShareholderAllotment.value.shareAllotTos.length <= 0) {
          this.companyShareholderAllotment.value.setDataFromIssuance(
            this.companyShareIssuance.value as CompanyShareIssuance
          )
          this.companyShareIssuance.value.allotmentId = this.companyShareholderAllotment.value.id
          await Promise.all([
            this.companyShareholderAllotment.value.update(useCompanyShareholderAllotmentStore()),
            this.companyShareIssuance.value.update(useCompanyShareIssuanceStore()),
          ])
        } else {
          if (StringUtil.isNullOrEmpty(this.companyShareIssuance.value.allotmentId)) {
            this.companyShareIssuance.value.allotmentId = this.companyShareholderAllotment.value.id
            this.companyShareIssuance.value.update(useCompanyShareIssuanceStore())
          }
        }
      }
    } else {
      this.isInPreviewMode.value = true
      await Promise.all([this.companyServiceInitializer.setPastApplications()])
      this.hasPastApplications.value = this.companyServiceInitializer.pastApplications.length > 0
      this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, this.hasPastApplications.value)
    }

    await this.fetchPrice()
    this.init(this.companyShareholderAllotment.value as CompanyShareholderAllotment)
    this.isLoading.value = false
  }

  override async fetchPrice(): Promise<void> {
    try {
      let servicePricingId =
        this.companyShareholderAllotment.value.sharesAllotted <= 1000
          ? this.priceIdForLessThan1001
          : this.companyShareholderAllotment.value.sharesAllotted < 500000
            ? this.priceIdForLessThan499K
            : this.priceIdForMoreThan500K

      let repository = useServicePricingStore()
      let response = await repository.fetch(servicePricingId)
      if (repository.error !== null) {
        throw repository.error
      }

      if (!response) {
        return
      }

      let servicePricing = new ServicePricing(response)
      this.servicePricing.value = new ServicePricing(response)

      this.price.value = Number(servicePricing.baseGrandTotal)
    } catch (e) {
      this.price.value = 299
    }
  }

  async fetchOngoingApplication(): Promise<void> {
    try {
      let apiRecord = await this.repository.fetchAll(this.ongoingFilter)
      if (this.repository.error !== null) {
        throw this.repository.error
      }

      if (apiRecord.totalRecords <= 0) {
        this.companyShareholderAllotment.value = new CompanyShareholderAllotment()
        this.companyShareholderAllotment.value.companyId = this.companyId
        this.viewType.value = ViewMode.New
        this.hasOngoingApplication.value = false
        return
      }

      this.companyShareholderAllotment.value = new CompanyShareholderAllotment(apiRecord.data[0])
      this.isInPreviewMode.value = false
      this.hasOngoingApplication.value = true
      this.viewType.value = ViewMode.Existing
    } catch (error) {
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage: Error = new Error("", "")
        errorMessage.setForFetchOngoing()
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
        return
      }

      let lastApplication = new CompanyShareholderAllotment(apiRecord.data[0])
      this.lastApplicationDate.value = this.time.formatDateOnlyFull(lastApplication.updatedAt)
      this.hasPastApplications.value = true
      this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, true)
    } catch (error) {
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage: Error = new Error("", "")
        errorMessage.setForFetchLatest()
        errorMessage.handle()
      }
    }
  }

  async fetchRespondedShareIssuance(): Promise<void> {
    try {
      let filter = new Filter()
      filter.companyId = this.companyId
      filter.sortOrder = "desc"
      filter.orderBy = "created_at"
      let response = await this.companyShareIssuanceRepository.fetchAll(filter)
      if (this.companyShareIssuanceRepository.error !== null) {
        throw this.companyShareIssuanceRepository.error
      }

      if (response.data.length <= 0) {
        this.companyShareIssuanceId.value = ""
        this.companyShareIssuance.value = new CompanyShareIssuance()
        this.companyShareIssuance.value.companyId = this.companyId
        this.emitEvents(EmitMessages.MISSING_STEP)
        return
      }

      this.companyShareIssuanceId.value = response.data[0].id
      this.companyShareIssuance.value = new CompanyShareIssuance(response.data[0])
      if (!this.companyShareIssuance.value.canIssue()) {
        this.emitEvents(EmitMessages.MISSING_STEP)
        return
      }
    } catch (error) {
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage: Error = new Error("", "")
        errorMessage.setForFetchOngoing()
        errorMessage.handle()
      }
    }
  }

  setApplicationData(applicationData: CompanyShareholderAllotment): void {
    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(applicationData)
    }

    if (this.mcrRef) {
      this.mcrRef.updateApplicationContent(applicationData)
    }
  }

  async onApplicationUpdated(application: CompanyShareholderAllotment): Promise<void> {
    await this.fetchOngoingApplication()

    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(this.companyShareholderAllotment.value)
    }

    if (this.mcrRef) {
      this.mcrRef.updateApplicationContent(this.companyShareholderAllotment.value)
    }
  }

  getCompanyShareholderAllotment(): CompanyShareholderAllotment {
    return this.companyShareholderAllotment.value as CompanyShareholderAllotment
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
        this.companyShareholderAllotment.value.id
      )
      await makePayment.setPaymentCart()

      // need to change the prices according to amount of shares
      let paymentCartItem = makePayment.paymentCart.items.find((pci: PaymentCartItem) => {
        return pci.targetType === this.target && pci.targetId === this.companyShareholderAllotment.value.id
      })
      if (paymentCartItem) {
        paymentCartItem.servicePricingId = this.servicePricing.value.id
        paymentCartItem.servicePricing = new ServicePricing(this.servicePricing.value)
      }

      this.emitEvents("pay", makePayment.paymentCart)
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error("", "")
        errorMessage.setForMakePayment()
        errorMessage.handle()
      }
    } finally {
      this.isSubmitting.value = false
    }
  }

  async submitApplication(): Promise<void> {
    if (
      !StringUtil.isNullOrEmpty(this.companyShareIssuanceId.value) &&
      this.companyShareIssuance.value.status !== StatusConstants.ISSUED
    ) {
      await this.companyShareIssuanceRepository.issue(this.companyShareIssuanceId.value)
    }

    if (this.dcrRef) {
      this.companyShareholderAllotment.value = this.dcrRef.getApplication()
    } else {
      this.companyShareholderAllotment.value = this.mcrRef.getApplication()
    }

    // NOTE: We create empty (no breakdown on allotees) when making payment
    if (StringUtil.isNullOrEmpty(this.companyShareholderAllotment.value.id)) {
      this.companyShareholderAllotment.value.companyId = this.companyId
      await this.companyShareholderAllotment.value.create(useCompanyShareholderAllotmentStore())
    } else {
      await this.companyShareholderAllotment.value.update(useCompanyShareholderAllotmentStore())
    }
  }

  async onProceedClicked(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyShareholderAllotment.value.id) && !this.hasPaid()) {
      await this.makePayment()
      return
    }

    if (this.wrapperRef) {
      this.wrapperRef.enlarge()
    }
  }

  setWrapperRef(wrapperRef: any | null): void {
    this.wrapperRef = wrapperRef

    this.setOptionButtons()
  }

  setOptionButtons(): void {
    if (!this.wrapperRef) {
      return
    }

    let label = this.language.isMalay() ? "Peruntuk Saham Baharu" : "Allot New Shares"
  }

  helpTitle(): string {
    return this.language.isMalay() ? "Peruntuk Saham Baharu" : "Allot New Shares"
  }

  helpDescription(): string {
    //TODO: Get the copywriting for this
    if (this.language.isMalay()) {
      return `Apabila sesebuah syarikat menukar alamat perniagaan atau cawangan, syarikat
        tersebut perlu memberitahu SSM (Suruhanjaya Syarikat Malaysia) mengenai
        perubahan itu dalam tempoh empat belas hari dari tarikh kuat kuasa perubahan.
        Perkara ini dilakukan melalui borang khusus untuk "Pemberitahuan Pertukaran
        Alamat Perniagaan/Cawangan dan/atau Jenis Perniagaan".
        <br><br>
        Pemberitahuan pertukaran alamat perniagaan hendaklah dibuat dalam borang dan
        cara yang ditetapkan oleh Arahan Amalan SSM 2/2017. Merupakan suatu kesalahan
        di bawah Seksyen 591 Akta Syarikat 2016 untuk memberikan maklumat palsu atau
        mengelirukan kepada Pendaftar.`
    }

    return `When a company changes its business or branch address, it must notify
      SSM of the change within fourteen days from the effective date of the change.
      This is done through a specific form for "Notification of Change in the
      Business/Branch Address and/or Nature of Business".
      <br><br>
      The notification of change in business address is to be done in the form
      and manner specified by SSM's Practice Directive 2/2017. It is an offense
      under Section 591 of the Companies Act 2016 to provide false or misleading
      information to the Registrar.`
  }

  slipCaseTitle(): string {
    return this.language.isMalay() ? "Resolusi: Peruntukkan Saham" : "Resolution: Propose Allotment of Shares"
  }

  slipCaseContentPoints(): string[] {
    if (this.language.isMalay()) {
      return [
        "Di bawah Seksyen 78 Akta Syarikat 2016, hanya Pengarah yang mempunyai kuasa untuk mencadangkan dan meluluskan umpukan saham.",
        "Resolusi Cadangan Umpukan Saham adalah <b>langkah wajib yang pertama</b>. Ia belum menerbitkan sebarang saham lagi — ia sekadar memberi kuasa kepada Syarikat untuk memulakan proses umpukan dan menyediakan Notis Hak Pradip bagi pemegang saham sedia ada.",
        "Dengan meluluskan resolusi ini, Lembaga Pengarah mengesahkan hasratnya untuk mewujudkan saham baharu dan membenarkan proses tersebut diteruskan ke langkah seterusnya.",
      ]
    }

    return [
      "Under Section 78 of the Companies Act 2016, only Directors have the authority to propose and approve an allotment of shares.",
      "The Resolution to Propose Allotment of Shares is the <b>first required step</b>. It does not issue any shares yet — it simply authorises the Company to begin the allotment process and to prepare the Notice of Pre-Emptive Rights for existing shareholders.",
      "By passing this resolution, the Board of Directors confirm its intention to create new shares and allows the process to proceed to the next step.",
    ]
  }

  override backLabel(): string {
    return this.language.isMalay() ? "Kembali" : "Back"
  }

  //PASCA Status
  isMajorityReached(): boolean {
    if (!this.application.value) {
      return false
    }

    // This is a special reso
    let totalShares = this.shareholders.value.reduce((total: number, shareholder: Shareholder) => {
      return total + Number(shareholder.ordinaryShares) + Number(shareholder.preferenceShares)
    }, 0)

    let totalSigned = this.shareholders.value
      .filter((shareholder: Shareholder) => {
        if (!this.application.value) {
          return
        }

        let hasSigned = this.application.value.signatureGroups.find((sg: SignatureGroup) => {
          return sg.email === shareholder.email && sg.group?.target === "shareholder"
        })

        return hasSigned
      })
      .reduce((total: number, shareholder: Shareholder) => {
        return total + Number(shareholder.ordinaryShares) + Number(shareholder.preferenceShares)
      }, 0)

    let percentage = Math.ceil((totalSigned / totalShares) * 100)

    return percentage >= 50
  }

  override isStepStatusVisible(): boolean {
    if (!this.application.value) {
      return false
    }

    return this.application.value.paidAt !== null && this.isMajorityReached()
  }

  signatureDate(): string {
    if (!this.application.value) {
      return ""
    }

    if (this.application.value.signatureGroups.length <= 0) {
      return ""
    }

    if (this.isMajorityReached()) {
      let shareholderSignatures = this.application.value.signatureGroups.filter((sg: SignatureGroup) => {
        return sg.group?.target === "shareholder"
      })

      if (shareholderSignatures.length > 0) {
        let sorted = ObjectUtil.sort<SignatureGroup>(shareholderSignatures, "createdAt", "desc")

        return this.time.formatDateOnlyShort(sorted[0].createdAt ?? "")
      }
    }

    if (this.hasSigned()) {
      return this.userSignatureDate()
    }

    return ""
  }

  override processingLabel(): string {
    return this.language.isMalay() ? "Menunggu Respons" : "Awaiting Responses"
  }

  get serviceWrapperProps() {
    let application =
      this.viewType.value === ViewMode.New ? new CompanyShareholderAllotment() : this.companyShareholderAllotment.value

    let showPasca = this.viewType.value === ViewMode.Existing

    return new PropsCompanyServiceWrapper(
      this.companyShareholderAllotment.value,
      this.companyId,
      this.target,
      this.slipCaseTitle(),
      this.viewType.value,
      this.hasOngoingApplication.value,
      this.hasPastApplications.value,
      this.companyShareholderAllotment.value.id,
      this.currentPage.value,
      this.totalPages.value,
      "DCR",
      showPasca,
      this.hasPaid(),
      this.price.value,
      this.isMajorityReached(),
      this.hasSigned(),
      this.signatureDate(),
      this.hasDcr.value,
      this.hasMcr.value,
      this.totalNumberOfDirectors.value,
      this.totalNumberOfShareholders.value,
      false,
      true,
      this.backLabel(),
      this.payLabel(),
      this.hoveredButtonLabel(),
      this.isInPreviewMode.value,
      this.isSubmitting.value,
      CompanyShareholderAllotment,
      useCompanyShareholderAllotmentStore(),
      false,
      true
    )
  }

  get resolutionDocumentProps() {
    return new PropsResolutionDocument<CompanyShareholderAllotment>(
      this.companyId,
      this.companyShareholderAllotment.value.id,
      this.getCompanyShareholderAllotment(),
      this.showWatermark(),
      this.watermarkText(),
      this.isInPreviewMode.value,
      false
    )
  }

  override loaderLabel(): string {
    return this.language.isMalay() ? "Sedang Menyediakan" : "Preparing Your"
  }

  override loaderSublabel(): string {
    return this.language.isMalay() ? "Resolusi Anda" : "Resolution"
  }
}
