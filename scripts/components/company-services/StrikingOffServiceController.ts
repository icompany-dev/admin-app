import { CompanyStrikingOffResolution } from "~/scripts/models/CompanyStrikingOffResolution"
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
import { StrikingOffPreparation } from "~/scripts/types/StrikingOffPreparation"
import { ServicePricing } from "~/scripts/models/ServicePricing"
import { PaymentCartItem } from "~/scripts/models/PaymentCartItem"
import type { SignatureGroup } from "~/scripts/models/SignatureGroup"
import { StatusConstants } from "~/scripts/constants/Status"
import { CompanyBankAccountClosure } from "~/scripts/models/CompanyBankAccountClosure"
import { CompanyBank } from "~/scripts/models/CompanyBank"
import { Filter } from "~/scripts/library/Filter"
import { ServicePricingMandatory } from "~/scripts/models/ServicePricingMandatory"
import { ServicePricingBreakdown } from "~/scripts/models/ServicePricingBreakdown"
import { Company } from "~/scripts/models/Company"

export class StrikingOffServiceController extends CompanyServiceController<CompanyStrikingOffResolution> {
  companyStrikingOffResolution = ref<CompanyStrikingOffResolution>(new CompanyStrikingOffResolution())
  bankAccountClosureApplications = ref<CompanyBankAccountClosure[]>([])
  companyBanks = ref<CompanyBank[]>([])
  company = ref<Company>(new Company())

  wrapperRef: any | null = null
  preparationStrikingOffRef: any | null = null

  strikingOffPreparation: Ref<StrikingOffPreparation> = ref<StrikingOffPreparation>(new StrikingOffPreparation())

  isShowBankAccountClosure: Ref<boolean> = ref<boolean>(false)
  isShowingBankAccountClosure: Ref<boolean> = ref<boolean>(false)

  isShowManagementAccount: Ref<boolean> = ref<boolean>(false)
  isShowingManagementAccount: Ref<boolean> = ref<boolean>(false)

  constructor(companyId: string, viewType: string, emitEvents: any | null) {
    super(companyId, true, false, CompanyStrikingOffResolution, useCompanyStrikingOffResolutionStore(), emitEvents)
    this.target = CompanyConstants.TARGET_STRIKING_OFF_RESOLUTION
    this.setViewType(viewType)
    this.initializeData()
  }

  async initializeData(): Promise<void> {
    this.isLoading.value = true

    if (this.viewType.value !== ViewMode.Past) {
      await Promise.all([
        this.fetchPrice(),
        this.fetchOngoingApplication(),
        this.fetchOngoingBankClosureApplications(),
        this.fetchCompanyBanks(),
        this.fetchCompany(),
      ])

      if (this.hasOngoingApplication.value) {
        this.viewType.value = ViewMode.Existing
        this.emitEvents(EmitMessages.GO_TO_EXISTING)
        this.isInPreviewMode.value = false
      } else {
        this.viewType.value = ViewMode.New
        this.emitEvents(EmitMessages.GO_TO_NEW)
        this.isInPreviewMode.value = true
      }
    } else {
      this.isInPreviewMode.value = true
      await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setPastApplications()])
      this.hasPastApplications.value = this.companyServiceInitializer.pastApplications.length > 0
      this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, this.hasPastApplications.value)
    }

    this.init(this.companyStrikingOffResolution.value as CompanyStrikingOffResolution)

    this.isLoading.value = false
  }

  async fetchOngoingApplication(): Promise<void> {
    try {
      let response = await this.repository.ongoing(this.companyId)
      if (this.repository.error !== null) {
        throw this.repository.error
      }

      if (!response || (Array.isArray(response) && response.length <= 0)) {
        this.companyStrikingOffResolution.value = new CompanyStrikingOffResolution()
        this.companyStrikingOffResolution.value.companyId = this.companyId
        this.hasOngoingApplication.value = false
        return
      }

      this.companyStrikingOffResolution.value = new CompanyStrikingOffResolution(response)
      this.isInPreviewMode.value = false
      this.hasOngoingApplication.value = true

      try {
        let preparationData = JSON.parse(this.companyStrikingOffResolution.value.preparationData)
        this.strikingOffPreparation.value = new StrikingOffPreparation(preparationData)
      } catch (e) {
        this.strikingOffPreparation.value = new StrikingOffPreparation()
      }
    } catch (error) {
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage = new Error(Error.ERROR_TYPE_API, "Unable to fetch registered address amendment for company")
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

      let lastApplication = new CompanyStrikingOffResolution(apiRecord.data[0])
      this.lastApplicationDate.value = this.time.formatDateOnlyFull(lastApplication.updatedAt)
      this.hasPastApplications.value = true
      this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, true)
    } catch (error) {
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage = new Error(Error.ERROR_TYPE_API, "Unable to fetch striking off resolution for company")
        errorMessage.handle()
      }
    }
  }

  async fetchCompany(): Promise<void> {
    let repository = useCompanyStore()
    let response = await repository.fetch(this.companyId)
    this.company.value = new Company(response)
  }

  async fetchCompanyBanks(): Promise<void> {
    try {
      let repository = useCompanyBankStore()
      let filter = new Filter()
      filter.companyId = this.companyId

      let response = await repository.fetchAll(filter)
      this.companyBanks.value = response.data.map((d: any) => {
        return new CompanyBank(d)
      })
    } catch (e) {
      this.companyBanks.value = []
    }
  }

  async fetchOngoingBankClosureApplications(): Promise<void> {
    try {
      let repository = useCompanyBankAccountClosureStore()
      let response = await repository.fetchAll(this.ongoingFilter)

      this.bankAccountClosureApplications.value = response.data.map((a: any) => {
        return new CompanyBankAccountClosure(a)
      })
    } catch (e) {
      console.error(e)
    }
  }

  setPreparationStrikingOffRef(preparationStrikingOffRef: any): void {
    this.preparationStrikingOffRef = preparationStrikingOffRef
  }

  async onApplicationUpdated(application: CompanyStrikingOffResolution): Promise<void> {
    await this.fetchOngoingApplication()

    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(this.companyStrikingOffResolution.value)
    }
  }

  setApplicationData(applicationData: CompanyStrikingOffResolution): void {
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

      if (StringUtil.isNullOrEmpty(this.companyStrikingOffResolution.value.id)) {
        await this.submitApplication()
      }

      // things to add
      let servicePricingPromises = []
      let totalToAddToBreakdown = 0
      if (!this.strikingOffPreparation.value.hasCeasedOrNeverCommenceBusinessAndOperations) {
        totalToAddToBreakdown += 200
      }

      if (!this.strikingOffPreparation.value.hasNoAssetsAndLiabilities) {
        totalToAddToBreakdown += 200
      }

      if (!this.strikingOffPreparation.value.hasNoOutstandingChargesWithAnyFinancialInstitution) {
        totalToAddToBreakdown += 200
      }

      if (!this.strikingOffPreparation.value.hasNoOutstandingTaxLiabilities) {
        totalToAddToBreakdown += 200
      }

      if (!this.strikingOffPreparation.value.hasNotBeenInvolvedInAnyPendingLegalProceedings) {
        totalToAddToBreakdown += 200
      }

      if (!this.strikingOffPreparation.value.hasObtainedTheConsentOfShareholdersAndDirectors) {
        totalToAddToBreakdown += 200
      }

      if (!this.strikingOffPreparation.value.hasNoOutstandingStatutoryComplianceIssuesWhichMayPreventStrikingOff) {
        totalToAddToBreakdown += 200
      }

      let numberOfManagementAccountItems = 0
      if (!this.strikingOffPreparation.value.hasPreparedManagementAccounts) {
        numberOfManagementAccountItems += 1
      }

      let bankAccountServicePricing = new ServicePricing()
      if (!this.strikingOffPreparation.value.hasClosedAllBankAccounts) {
        numberOfManagementAccountItems += 1

        let repository = useServicePricingStore()
        let promise = repository.fetch("3d157f42-8226-4775-908d-c033c6dbbb8e").then((response) => {
          bankAccountServicePricing = new ServicePricing(response)
        })
        servicePricingPromises.push(promise)
      }

      if (!this.strikingOffPreparation.value.hasClearedAssets) {
        numberOfManagementAccountItems += 1
      }

      if (!this.strikingOffPreparation.value.hasClearedLiabilities) {
        numberOfManagementAccountItems += 1
      }

      let totalForManagementAccount = 0
      let managementAccountServicePricing = new ServicePricing()
      if (numberOfManagementAccountItems > 0) {
        if (numberOfManagementAccountItems < 3) {
          totalForManagementAccount = 300
        }

        if (numberOfManagementAccountItems === 3) {
          totalForManagementAccount = 600
        }

        if (numberOfManagementAccountItems > 3) {
          totalForManagementAccount = 900
        }

        let repository = useServicePricingStore()
        let promise = repository.fetch("ebb1cec7-0eb3-4cec-af9b-aaa9e2ebe5e7").then((response) => {
          managementAccountServicePricing = new ServicePricing(response)
        })
        servicePricingPromises.push(promise)
      }

      await Promise.all(servicePricingPromises)

      let makePayment = new MakePayment(
        PaymentConstants.PAYMENT_CART_ENTITY_TYPE_COMPANY,
        this.companyId,
        this.target,
        this.companyStrikingOffResolution.value.id
      )
      await makePayment.setPaymentCart()

      if (totalToAddToBreakdown > 0 || numberOfManagementAccountItems > 0) {
        let paymentCartItem = makePayment.paymentCart.items.find((pci: PaymentCartItem) => {
          return pci.targetType === this.target && pci.targetId === this.companyStrikingOffResolution.value.id
        })

        if (paymentCartItem) {
          if (paymentCartItem.servicePricing.breakdowns.length > 0) {
            paymentCartItem.servicePricing.breakdowns[0].price += totalToAddToBreakdown
          } else {
            let newBreakdown = new ServicePricingBreakdown()
            newBreakdown.id = "d227cfbf-2c3e-46f4-b8eb-2a0a2b76b99d"
            newBreakdown.servicePricingId = "f786c62c-053d-4ae5-9e4c-8f86f6bcb7d7"
            newBreakdown.orderNumber = 1
            newBreakdown.itemName = "Striking Off"
            newBreakdown.price = totalToAddToBreakdown
            paymentCartItem.servicePricing.breakdowns.push(newBreakdown)
          }

          if (numberOfManagementAccountItems > 0) {
            if (!StringUtil.isNullOrEmpty(managementAccountServicePricing.id)) {
              let newMandatoryServicePricing = new ServicePricingMandatory()
              newMandatoryServicePricing.basePrice = totalForManagementAccount
              newMandatoryServicePricing.mandatoryServiceId = managementAccountServicePricing.id
              newMandatoryServicePricing.mandatoryServicePrice = managementAccountServicePricing
              newMandatoryServicePricing.mandatoryServicePrice.baseGrandTotal = totalForManagementAccount

              paymentCartItem.servicePricing.mandatoryServices.push(newMandatoryServicePricing)
            }

            if (!StringUtil.isNullOrEmpty(bankAccountServicePricing.id)) {
              let newMandatoryServicePricing = new ServicePricingMandatory()
              newMandatoryServicePricing.basePrice = 50
              newMandatoryServicePricing.mandatoryServiceId = bankAccountServicePricing.id
              newMandatoryServicePricing.mandatoryServicePrice = bankAccountServicePricing
              newMandatoryServicePricing.mandatoryServicePrice.baseGrandTotal = 50

              paymentCartItem.servicePricing.mandatoryServices.push(newMandatoryServicePricing)
            }
          }
        }
      }

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
    if (StringUtil.isNullOrEmpty(this.companyStrikingOffResolution.value.id)) {
      this.companyStrikingOffResolution.value.companyId = this.companyId
      this.companyStrikingOffResolution.value.applicant.id = this.currentUser.value.id
      this.companyStrikingOffResolution.value.preparationData = JSON.stringify(this.strikingOffPreparation.value)
      await this.companyStrikingOffResolution.value.create(useCompanyStrikingOffResolutionStore())
    } else {
      await this.companyStrikingOffResolution.value.update(useCompanyStrikingOffResolutionStore())
    }
  }

  async onProceedClicked(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyStrikingOffResolution.value.id) || !this.hasPaid()) {
      if (this.preparationStrikingOffRef) {
        this.preparationStrikingOffRef.show()
      }
      return
    }

    if (this.wrapperRef) {
      this.wrapperRef.enlarge()
    }
  }

  async handleMakePayment(data: StrikingOffPreparation): Promise<void> {
    this.strikingOffPreparation.value = new StrikingOffPreparation(data)

    await this.makePayment()
  }

  onShowBankAccountClosureClicked(): void {
    this.isShowBankAccountClosure.value = true
    setTimeout(() => {
      this.isShowingBankAccountClosure.value = true
    }, 500)
  }

  onCloseBankAccountClosureClicked(): void {
    this.isShowBankAccountClosure.value = false
    this.isShowingBankAccountClosure.value = false
  }

  onShowManagementAccountClicked(): void {
    this.isShowManagementAccount.value = true
    setTimeout(() => {
      this.isShowingManagementAccount.value = true
    }, 500)
  }

  onCloseManagementAccountClicked(): void {
    this.isShowManagementAccount.value = false
    this.isShowingManagementAccount.value = false
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
      : "Learn More: Application for Striking Off under Section 550"
  }

  alertContent(): string {
    if (this.language.isMalay()) {
      return `
        <p>
          Di bawah Seksyen 550 Akta Syarikat 2016, 
          <span class='glossary' id='strike-off'>permohonan pemotongan nama</span> 
          ialah permintaan sukarela yang dikemukakan kepada Suruhanjaya Syarikat 
          Malaysia (SSM) untuk menutup sesebuah syarikat secara sepenuhnya. 
          Prosedur ini direka khas untuk syarikat yang tidak lagi beroperasi, 
          tidak aktif, atau dorman yang tidak mempunyai niat untuk menjalankan 
          perniagaan pada masa hadapan. Alih-alih melalui proses likuidasi atau 
          penggulungan yang rasmi, kompleks, dan memakan kos yang tinggi, pengarah 
          atau pemegang saham syarikat boleh memohon kepada SSM untuk mengeluarkan 
          nama syarikat daripada daftar rasmi.
        </p>
        <p>
          Untuk layak mengemukakan permohonan ini, syarikat mestilah memenuhi 
          syarat-syarat ketat yang ditetapkan oleh SSM bagi melindungi kepentingan 
          awam dan pemiutang. Ini bermakna syarikat tersebut mestilah tidak mempunyai 
          aset, tiada baki liabiliti, dan tiada tunggakan hutang cukai atau kompaun 
          yang perlu dibayar kepada SSM atau Lembaga Hasil Dalam Negeri (LHDN). 
          Selain itu, syarikat juga mestilah tidak terlibat dalam sebarang prosiding 
          undang-undang yang sedang berjalan, sama ada di dalam atau di luar Malaysia. 
          Sebaik sahaja SSM meluluskan permintaan tersebut dan proses berkenaan selesai, 
          syarikat itu akan dibubarkan dan kewujudan sahnya dari segi undang-undang 
          ditamatkan secara rasmi.
        </p>
      `
    }

    return `
      <p>
        Under Section 550 of the Companies Act 2016, an Application to 
        <span class='glossary' id='strike-off'>Strike Off</span> is a 
        voluntary request made to the Companies Commission of Malaysia (SSM) to close 
        down a company completely. This procedure is designed for defunct, inactive, or 
        dormant companies that have no intention of carrying on business in the future. 
        Instead of going through a formal, complex, and costly liquidation or winding-up 
        process, the company directors or shareholders can apply to SSM to have the 
        company’s name removed from the official register.
      </p>
      <p>
        To be eligible for this application, the company must fulfill strict conditions 
        set by SSM to protect public interests and creditors. This means the company must 
        have no assets, no remaining liabilities, and no outstanding tax debts or compounds 
        due to SSM or the Inland Revenue Board (LHDN). Additionally, it must not be 
        involved in any ongoing legal proceedings inside or outside Malaysia. Once SSM 
        approves the request and the process is complete, the company is dissolved, and 
        its legal existence officially ends.
      </p>
    `
  }

  slipCaseTitle(): string {
    return this.language.isMalay()
      ? "Permohonan Pembatalan Nama bawah Seksyen 550"
      : "Application for Striking Off under Section 550"
  }

  override loaderLabel(): string {
    return this.language.isMalay() ? "Sedang Menyediakan" : "Preparing the"
  }

  override loaderSublabel(): string {
    return this.language.isMalay() ? "Dokumen Pembatalan Nama" : "Documents for Striking Off"
  }

  // pasca region
  get directorLabel(): string {
    return this.language.isMalay() ? "Pengarah" : "Directors"
  }

  get totalDirectorsSignature(): number {
    return this.companyStrikingOffResolution.value.signatureGroups.filter((sg: SignatureGroup) => {
      return sg.group?.target === "director"
    }).length
  }

  get directorRanges(): number[] {
    return Array.from({ length: this.totalNumberOfDirectors.value }, (_, i) => i)
  }

  get shareholderLabel(): string {
    return this.language.isMalay() ? "Pemegang Saham" : "Members"
  }

  get totalShareholdersSignature(): number {
    return this.companyStrikingOffResolution.value.signatureGroups.filter((sg: SignatureGroup) => {
      return sg.group?.target === "shareholder"
    }).length
  }

  get shareholderRanges(): number[] {
    return Array.from({ length: this.totalNumberOfShareholders.value }, (_, i) => i)
  }

  get applicantLabel(): string {
    return this.language.isMalay() ? "Pengarah Bertanggungjawab" : "Responsible Director"
  }

  get applicantName(): string {
    return this.companyStrikingOffResolution.value.applicant.name
  }

  get status(): string {
    if (this.companyStrikingOffResolution.value.status === StatusConstants.PAID) {
      return this.language.isMalay() ? "Menunggu Dokumen Sokongan" : "Pending Supporting Documents"
    }

    if (this.companyStrikingOffResolution.value.status === StatusConstants.DOCUMENTS_RECEIVED) {
      return this.language.isMalay() ? "Menunggu Pengesahan" : "Pending Verification"
    }

    if (this.companyStrikingOffResolution.value.status === StatusConstants.SUBMITTED) {
      return this.language.isMalay() ? "Diserah kepada SSM" : "Submitted to SSM"
    }

    if (this.companyStrikingOffResolution.value.status === StatusConstants.REJECTED) {
      return this.language.isMalay() ? "Ditolak kepada SSM" : "Rejected by SSM"
    }

    if (this.companyStrikingOffResolution.value.status === StatusConstants.PENDING_GAZETTE) {
      return this.language.isMalay() ? "Menunggu Gazet" : "Pending Gazette"
    }

    return this.language.isMalay() ? "Dalam Tempoh Gazet" : "Gzaette Period Running"
  }

  get bankAccountClosureLabel(): string {
    return this.language.isMalay()
      ? "Menunggu Pengesahan Penutupan Bank Account"
      : "Pending Confirmation of Closure of Bank Account"
  }

  get initiateBankAccountClosureLabel(): string {
    return this.language.isMalay() ? "Tutup Akaun" : "Close Account"
  }

  get isPendingBankAccountClosures(): boolean {
    if (this.strikingOffPreparation.value.hasClosedAllBankAccounts) {
      return false
    }

    return (
      this.bankAccountClosureApplications.value.length <= 0 ||
      this.bankAccountClosureApplications.value.every((d: any) => {
        let data = new CompanyBankAccountClosure(d)
        return data.status !== StatusConstants.DELIVERED
      })
    )
  }

  get isManagementAccountRequired(): boolean {
    return (
      !this.strikingOffPreparation.value.hasPreparedManagementAccounts ||
      !this.strikingOffPreparation.value.hasClosedAllBankAccounts ||
      !this.strikingOffPreparation.value.hasClearedAssets ||
      !this.strikingOffPreparation.value.hasClearedLiabilities
    )
  }

  get managementAccountLabel(): string {
    return this.language.isMalay() ? "Penyediaan Akaun Pengurusan" : "Preparation of Management Account"
  }

  get managementAccountButtonLabel(): string {
    return this.language.isMalay() ? "Sediakan" : "Prepare"
  }

  get isShowHiddenDocuments(): boolean {
    return this.isShowBankAccountClosure.value || this.isShowManagementAccount.value
  }

  get isShowingHiddenDocuments(): boolean {
    return this.isShowingBankAccountClosure.value || this.isShowingManagementAccount.value
  }

  get isShowBankAccountClosureDocument(): boolean {
    return this.isShowBankAccountClosure.value || !this.isShowHiddenDocuments
  }

  get isShowManagementAccountDocument(): boolean {
    return this.isShowManagementAccount.value || !this.isShowHiddenDocuments
  }

  get serviceWrapperProps() {
    let isInPreviewMode = this.viewType.value === ViewMode.New ? true : false
    let showPasca = this.viewType.value === ViewMode.Existing

    let props = new PropsCompanyServiceWrapper(
      this.companyStrikingOffResolution.value,
      this.companyId,
      this.target,
      this.slipCaseTitle(),
      this.viewType.value,
      this.hasOngoingApplication.value,
      this.hasPastApplications.value,
      this.companyStrikingOffResolution.value.id,
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
      CompanyStrikingOffResolution,
      useCompanyStrikingOffResolutionStore(),
      false,
      false,
      true
    )

    props.serviceWrapperProps.financialYearStartDate = this.financialYearStartDate
    props.serviceWrapperProps.financialYearEndDate = this.financialYearEndDate

    return props
  }

  get resolutionDocumentProps() {
    return new PropsResolutionDocument<CompanyStrikingOffResolution>(
      this.companyId,
      this.companyStrikingOffResolution.value.id,
      null,
      this.showWatermark(),
      this.watermarkText(),
      this.isInPreviewMode.value,
      false
    )
  }

  get financialYearEndDate(): string {
    let dayjs = useDayjs()
    let applicationDate = dayjs(this.companyStrikingOffResolution.value.createdAt ?? "").endOf("day")
    let endOfMonth = dayjs(this.companyStrikingOffResolution.value.createdAt ?? "").endOf("month")

    if (applicationDate.isSame(endOfMonth)) {
      return endOfMonth.format("YYYY-MM-DD")
    }

    let endDate = endOfMonth.subtract(1, "month").endOf("month")

    return endDate.format("YYYY-MM-DD")
  }

  get financialYearStartDate(): string {
    let dayjs = useDayjs()

    let endDate = this.financialYearEndDate
    let oneYearAgo = dayjs(endDate).subtract(1, "year").add(1, "day")

    let incorporatedAt = dayjs(this.company.value.incorporatedAt).startOf("day")

    if (oneYearAgo.isBefore(incorporatedAt)) {
      return incorporatedAt.format("YYYY-MM-DD")
    }

    return oneYearAgo.format("YYYY-MM-DD")
  }
}
