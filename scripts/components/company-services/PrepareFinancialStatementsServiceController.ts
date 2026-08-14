import { SignatureGroupConstants } from "~/scripts/constants/SignatureGroups"
import { StatusConstants } from "~/scripts/constants/Status"
import { ViewMode } from "~/scripts/constants/ViewMode"
import { Error } from "~/scripts/library/Error"
import { Filter } from "~/scripts/library/Filter"
import type { Application } from "~/scripts/models/Application"
import { Director } from "~/scripts/models/Director"
import { Shareholder } from "~/scripts/models/Shareholder"
import type { SignatureGroup } from "~/scripts/models/SignatureGroup"
import { User } from "~/scripts/models/User"
import { CurrentUser } from "~/scripts/utils/CurrentUser"
import { StringUtil } from "~/scripts/utils/String"
import { ServicePricing } from "~/scripts/models/ServicePricing"
import { CompanyServiceInitializer } from "~/scripts/library/CompanyServiceInitializer"
import type { IRepositoryStore } from "~/scripts/models/IRepositoryStore"
import { CompanySetFinancialYearEnd } from "~/scripts/models/CompanySetFinancialYearEnd"
import { CompanyServiceController } from "./CompanyServiceController"
import { CompanyConstants } from "~/scripts/constants/Company"
import { PropsCompanyServiceWrapper } from "~/scripts/props/PropsCompanyServiceWrapper"
import { EmitMessages } from "~/scripts/constants/EmitMessages"
import { FinancialYearEndConstants } from "~/scripts/constants/FinancialYearEnds"
import { Compliance } from "~/scripts/library/Compliance"
import { CompanyFinancialStatementAuthorisedPerson } from "~/scripts/models/CompanyFinancialStatementAuthorisedPerson"

export class PrepareFinancialStatementServiceController {
  companyId: string = ""
  currentUser = ref<User>(new User())
  price: Ref<number> = ref<number>(299)

  router = useRouter()
  language = useLanguage()
  time = useLocalTime()
  dayjs = useDayjs()
  directorRepository = useDirectorStore()
  shareholderRepository = useShareholderStore()

  setFyeRepository = useCompanySetFinancialYearEndStore()
  appointResponsiblePersonRepository = useCompanyFinancialStatementAuthorisedPersonStore()
  // appointAuditorRepository = useCompanySetFinancialYearEndStore()

  eventManager = useEventManagerStore()

  isADirector = ref<boolean>(false)
  isAShareholder = ref<boolean>(false)

  directors = ref<Director[]>([])
  shareholders = ref<Shareholder[]>([])

  totalNumberOfDirectors = ref<number>(0)
  totalNumberOfShareholders = ref<number>(0)

  isInPreviewMode = ref<boolean>(true)
  isShrouded = ref<boolean>(true)
  documentViewMode = ref<string>(ViewMode.Shrouded)

  showSetFYE: Ref<boolean> = ref<boolean>(false)
  showAppointResponsiblePerson: Ref<boolean> = ref<boolean>(false)
  showAppointAuditor: Ref<boolean> = ref<boolean>(false)

  viewType = ref<string>(ViewMode.New)
  hasOngoingApplication: Ref<boolean> = ref<boolean>(false)
  hasPastApplications: Ref<boolean> = ref<boolean>(false)

  setFyeRef: any | null = null
  appointResponsiblePersonRef: any | null = null
  appointAuditorRef: any | null = null
  wrapperRef: any | null = null

  companySetFinancialYearEnd = ref<CompanySetFinancialYearEnd>(new CompanySetFinancialYearEnd())
  setFyeApplicationType: Ref<string> = ref<string>(FinancialYearEndConstants.AMENDMENT_TYPE_SET)

  companyFinancialStatementAuthorisedPerson = ref<CompanyFinancialStatementAuthorisedPerson>(
    new CompanyFinancialStatementAuthorisedPerson()
  )

  isPartOfBundle = ref<boolean>(false)
  hasMoreThanOneDirector = ref<boolean>(false)

  fyeCompanyServiceInitializer: CompanyServiceInitializer<CompanySetFinancialYearEnd>
  appointResponsiblePersonCompanyServiceInitializer: CompanyServiceInitializer<CompanyFinancialStatementAuthorisedPerson>

  totalPages: Ref<number> = ref<number>(1)
  currentPage: Ref<number> = ref<number>(1)

  target: string = ""

  emitEvents: any | null = null

  isSubmitting: Ref<boolean> = ref<boolean>(false)

  constructor(
    companyId: string,
    showSetFYE: boolean,
    showAppointResponsiblePerson: boolean,
    showAppointAuditor: boolean,
    isPartOfBundle: boolean,
    hasMoreThanOneDirector: boolean,
    viewType: string,
    emitEvents: any | null
  ) {
    this.companyId = companyId
    this.emitEvents = emitEvents
    this.target = CompanyConstants.TARGET_SET_FINANCIAL_YEAR_END // need to change this!!

    this.setViewType(viewType)
    this.setIsPartOfBundle(isPartOfBundle)
    this.setHasMoreThanOneDirector(hasMoreThanOneDirector)
    this.showSetFYE.value = showSetFYE
    this.showAppointResponsiblePerson.value = showAppointResponsiblePerson
    this.showAppointAuditor.value = showAppointAuditor

    this.fyeCompanyServiceInitializer = new CompanyServiceInitializer(
      this.companyId,
      CompanySetFinancialYearEnd,
      this.setFyeRepository
    )
    this.appointResponsiblePersonCompanyServiceInitializer = new CompanyServiceInitializer(
      this.companyId,
      CompanyFinancialStatementAuthorisedPerson,
      this.appointResponsiblePersonRepository
    )

    this.init()
    this.initializeData()
  }

  setWrapperRef(wrapperRef: any | null): void {
    this.wrapperRef = wrapperRef
  }

  setIsPartOfBundle(isPartOfBundle: boolean): void {
    this.isPartOfBundle.value = isPartOfBundle
  }

  setHasMoreThanOneDirector(hasMoreThanOneDirector: boolean): void {
    this.hasMoreThanOneDirector.value = hasMoreThanOneDirector
  }

  setShowSetFYE(showSetFYE: boolean): void {
    this.showSetFYE.value = showSetFYE
    this.initializeData()
  }

  setShowAppointResponsiblePerson(showAppointResponsiblePerson: boolean): void {
    this.showAppointResponsiblePerson.value = showAppointResponsiblePerson
    this.initializeData()
  }

  setShowAppointAuditor(showAppointAuditor: boolean): void {
    this.showAppointAuditor.value = showAppointAuditor
    this.initializeData()
  }

  setViewType(viewType: string): void {
    this.viewType.value = viewType
    this.initializeData()
  }

  setSetFyeRef(setFyeRef: any): void {
    this.setFyeRef = setFyeRef
  }

  setAppointResponsiblePersonRef(appointResponsiblePersonRef: any): void {
    this.appointResponsiblePersonRef = appointResponsiblePersonRef
  }

  setAppointAuditorRef(appointAuditorRef: any): void {
    this.appointAuditorRef = appointAuditorRef
  }

  async init(): Promise<void> {
    this.currentUser.value = await CurrentUser.get()
    await Promise.all([this.fetchDirectors(), this.fetchShareholders()])
  }

  async fetchDirectors(): Promise<void> {
    try {
      let response = await this.directorRepository.fetchAllForCompany(this.companyId)
      if (this.directorRepository.error !== null) {
        throw this.directorRepository.error
      }

      this.directors.value = response.map((d: any) => {
        return new Director(d)
      })
      this.totalNumberOfDirectors.value = this.directors.value.length
      this.isADirector.value = this.directors.value.some((director: Director) => {
        return director.email === this.currentUser.value.email
      })
    } catch (error) {
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage: Error = new Error("", "")
        errorMessage.setForFetchAll()
        errorMessage.handle()
      }
    }
  }

  async fetchShareholders(): Promise<void> {
    try {
      let response = await this.shareholderRepository.fetchAllForCompany(this.companyId)
      if (this.shareholderRepository.error !== null) {
        throw this.shareholderRepository.error
      }

      this.shareholders.value = response.map((s: any) => {
        return new Shareholder(s)
      })
      this.totalNumberOfShareholders.value = this.shareholders.value.length
      this.isAShareholder.value = this.shareholders.value.some((shareholder: Shareholder) => {
        return shareholder.email === this.currentUser.value.email
      })
    } catch (error) {
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage: Error = new Error("", "")
        errorMessage.setForFetchAll()
        errorMessage.handle()
      }
    }
  }

  async initializeData(): Promise<void> {
    let promises = [this.fetchPrice()]
    if (this.showSetFYE.value) {
      promises.push(this.initializeSetFye())
    }

    if (this.showAppointResponsiblePerson.value) {
      promises.push(this.initializeAppointResponsiblePerson())
    }

    await Promise.all(promises)
  }

  async initializeSetFye(): Promise<void> {
    switch (this.viewType.value) {
      case ViewMode.New:
        let compliance = new Compliance("")
        compliance.companyId = this.companyId
        await compliance.init()

        this.setFyeApplicationType.value = compliance.hasSetFinancialYearEnd
          ? FinancialYearEndConstants.AMENDMENT_TYPE_CHANGE
          : FinancialYearEndConstants.AMENDMENT_TYPE_SET
        this.isInPreviewMode.value = true
        this.companySetFinancialYearEnd.value = new CompanySetFinancialYearEnd(
          this.fyeCompanyServiceInitializer.newApplication
        )
        this.companySetFinancialYearEnd.value.type = this.setFyeApplicationType.value
        await this.fyeCompanyServiceInitializer.setExistingApplication()
        if (this.fyeCompanyServiceInitializer.existingApplication) {
          this.hasOngoingApplication.value = true
          this.setViewType(ViewMode.Existing) // this service will not have split existing and new application views
        }
        break
      case ViewMode.Existing:
        this.isInPreviewMode.value = false
        await this.fyeCompanyServiceInitializer.setExistingApplication()
        if (this.fyeCompanyServiceInitializer.existingApplication) {
          this.hasOngoingApplication.value = true
        } else {
          this.hasOngoingApplication.value = false
        }
        this.companySetFinancialYearEnd.value = new CompanySetFinancialYearEnd(
          this.fyeCompanyServiceInitializer.existingApplication
        )
        break
      case ViewMode.Past:
        this.isInPreviewMode.value = true
        await this.fyeCompanyServiceInitializer.setPastApplications()
        this.hasPastApplications.value = this.fyeCompanyServiceInitializer.pastApplications.length > 0
        this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, this.hasPastApplications.value)
        break
    }
  }

  async initializeAppointResponsiblePerson(): Promise<void> {
    switch (this.viewType.value) {
      case ViewMode.New:
        this.isInPreviewMode.value = true
        this.companyFinancialStatementAuthorisedPerson.value = new CompanyFinancialStatementAuthorisedPerson(
          this.appointResponsiblePersonCompanyServiceInitializer.newApplication
        )
        await this.appointResponsiblePersonCompanyServiceInitializer.setExistingApplication()
        if (this.appointResponsiblePersonCompanyServiceInitializer.existingApplication) {
          this.hasOngoingApplication.value = true
          this.setViewType(ViewMode.Existing) // this service will not have split existing and new application views
        }
        break
      case ViewMode.Existing:
        this.isInPreviewMode.value = false
        await this.appointResponsiblePersonCompanyServiceInitializer.setExistingApplication()
        if (this.appointResponsiblePersonCompanyServiceInitializer.existingApplication) {
          this.hasOngoingApplication.value = true
        } else {
          this.hasOngoingApplication.value = false
        }
        this.companyFinancialStatementAuthorisedPerson.value = new CompanyFinancialStatementAuthorisedPerson(
          this.appointResponsiblePersonCompanyServiceInitializer.existingApplication
        )
        break
      case ViewMode.Past:
        this.isInPreviewMode.value = true
        await this.appointResponsiblePersonCompanyServiceInitializer.setPastApplications()
        this.hasPastApplications.value =
          this.appointResponsiblePersonCompanyServiceInitializer.pastApplications.length > 0
        this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, this.hasPastApplications.value)
        break
    }
  }

  async fetchPrice(): Promise<void> {
    try {
      let repository = useServicePricingStore()
      let response = await repository.fetchDefault(CompanyConstants.TARGET_SET_FINANCIAL_YEAR_END) // This will need to change to this bundle price
      if (repository.error !== null) {
        throw repository.error
      }

      if (!response) {
        return
      }

      let servicePricing = new ServicePricing(response)

      this.price.value = Number(servicePricing.baseGrandTotal)
    } catch (e) {
      this.price.value = 299
    }
  }

  async setTotalPages(): Promise<void> {
    await nextTick()

    this.totalPages.value = 1

    let parentComponent = document.querySelector(".documents") as HTMLElement
    if (!parentComponent) {
      return
    }
    let allPapers = parentComponent.querySelectorAll(".paper-wrapper")

    this.totalPages.value = allPapers.length
  }

  // Display functions
  handleDoneLoading(): void {
    nextTick(() => {
      this.setTotalPages()
      this.handleDisplayedPage()
    })
  }

  handleDisplayedPage(): void {
    let parentComponent = document.querySelector(".documents") as HTMLElement
    if (!parentComponent) {
      return
    }
    let allPapers = parentComponent.querySelectorAll(".paper-wrapper")

    if (this.documentViewMode.value === ViewMode.Preview || this.documentViewMode.value === ViewMode.Enlarged) {
      allPapers.forEach((paper: Element) => {
        let paperElement = paper as HTMLElement
        paperElement.style.display = "block"
      })
      return
    }

    let page = this.currentPage.value
    allPapers.forEach((paper: Element, index: number) => {
      let paperElement = paper as HTMLElement
      if (index + 1 === page) {
        paperElement.style.display = "block"
      } else {
        paperElement.style.display = "none"
      }
    })
  }

  handleScroll(): void {
    this.handleDisplayedPage()
  }

  goToPage(page: number): void {
    this.currentPage.value = page
    this.handleDisplayedPage()
  }

  hasPaid(): boolean {
    let isSetFyePaid =
      this.companySetFinancialYearEnd.value.status !== StatusConstants.DRAFT &&
      this.companySetFinancialYearEnd.value.status !== StatusConstants.PENDING

    let isAppointResponsiblePersonPaid =
      this.companyFinancialStatementAuthorisedPerson.value.status !== StatusConstants.DRAFT &&
      this.companyFinancialStatementAuthorisedPerson.value.status !== StatusConstants.PENDING

    return isSetFyePaid && isAppointResponsiblePersonPaid
  }

  ctaLabel(): string {
    if (!this.hasPaid()) {
      return this.language.isMalay() ? "Bayar" : "Pay"
    }

    return this.language.isMalay() ? "Teruskan" : "Proceed"
  }

  backLabel(): string {
    return this.language.isMalay() ? "Kembali" : "Back"
  }

  onBackButtonClicked(): void {
    this.router.back()
  }

  async onProceedClicked(): Promise<void> {
    if (!StringUtil.isNullOrEmpty(this.companySetFinancialYearEnd.value.id) && !this.hasPaid()) {
      this.emitEvents("pay")
      return
    }

    if (this.wrapperRef) {
      this.wrapperRef.enlarge()
    }
  }
  onViewModeChanged(viewMode: string): void {
    this.documentViewMode.value = viewMode
    this.emitEvents("viewModeChanged", viewMode)
    nextTick(() => {
      this.handleDisplayedPage()
    })
  }

  onWrapperMinimized(applicationData: any): void {
    // How do we handle this with three different documents? initialize all again?
    // this.companySetFinancialYearEnd.value = new CompanySetFinancialYearEnd(applicationData)
    // if (this.dcrRef) {
    //   this.dcrRef.updateApplicationContent(this.companySetFinancialYearEnd.value)
    // }
  }

  showWatermark(): boolean {
    if (this.documentViewMode.value === ViewMode.Shrouded) {
      return false
    }

    const hasNotSignedFye = this.showSetFYE.value && this.companySetFinancialYearEnd.value.signatureGroups.length <= 0
    const hasNotSignedAppointResponsiblePerson =
      this.showAppointResponsiblePerson.value &&
      this.companyFinancialStatementAuthorisedPerson.value.signatureGroups.length <= 0

    return this.isInPreviewMode.value || hasNotSignedFye || hasNotSignedAppointResponsiblePerson
  }

  hasSigned(): boolean {
    const hasNotSignedFye = this.showSetFYE.value && this.companySetFinancialYearEnd.value.signatureGroups.length <= 0
    const hasNotSignedAppointResponsiblePerson =
      this.showAppointResponsiblePerson.value &&
      this.companyFinancialStatementAuthorisedPerson.value.signatureGroups.length <= 0

    return !hasNotSignedFye && !hasNotSignedAppointResponsiblePerson
  }

  isInPreview(): boolean {
    const setFyeInPreview = this.showSetFYE.value && StringUtil.isNullOrEmpty(this.companySetFinancialYearEnd.value.id)
    const appointResponsiblePersonInPreview =
      this.showAppointResponsiblePerson.value &&
      StringUtil.isNullOrEmpty(this.companyFinancialStatementAuthorisedPerson.value.id)

    return this.isInPreviewMode.value || setFyeInPreview || appointResponsiblePersonInPreview
  }

  watermarkText(): string {
    if (this.isInPreview()) {
      return "PREVIEW"
    }

    if (!this.hasSigned()) {
      return "DRAFT"
    }

    return ""
  }

  isStepStatusVisible(): boolean {
    return this.hasPaid() && !this.isInPreview()
  }

  isSubmittedToSSM(): boolean {
    const hasSubmittedFye =
      !this.showSetFYE.value || (this.showSetFYE.value && this.companySetFinancialYearEnd.value.submittedAt !== null)
    const hasSubmittedAppointResponsiblePerson =
      !this.showAppointResponsiblePerson.value ||
      (this.showAppointResponsiblePerson.value &&
        this.companyFinancialStatementAuthorisedPerson.value.submittedAt !== null)
    return hasSubmittedFye && hasSubmittedAppointResponsiblePerson
  }

  processingLabel(): string {
    return this.language.isMalay() ? "Sedang Diproses" : "Processing"
  }

  submittedToSsmLabel(): string {
    return this.language.isMalay() ? "Diserahkan kepada SSM" : "Submitted to SSM"
  }

  payForAccessLabel(): string {
    return this.language.isMalay() ? "Bayar untuk Akses" : "Pay for Access"
  }

  showCornerButton(): boolean {
    return this.viewType.value === ViewMode.New
  }

  getSubmissionDate(): string {
    if (!this.isSubmittedToSSM()) {
      return ""
    }

    let setFyeSubmittedAt = null
    if (this.showSetFYE.value) {
      setFyeSubmittedAt = this.companySetFinancialYearEnd.value.submittedAt
    }

    let appointResponsiblePersonSubmittedAt = null
    if (this.showAppointResponsiblePerson.value) {
      appointResponsiblePersonSubmittedAt = this.companyFinancialStatementAuthorisedPerson.value.submittedAt
    }

    if (setFyeSubmittedAt === null && appointResponsiblePersonSubmittedAt === null) {
      return ""
    } else if (setFyeSubmittedAt !== null && appointResponsiblePersonSubmittedAt === null) {
      return this.time.formatDateOnlyShort(setFyeSubmittedAt.toString())
    } else if (setFyeSubmittedAt === null && appointResponsiblePersonSubmittedAt !== null) {
      return this.time.formatDateOnlyShort(appointResponsiblePersonSubmittedAt.toString())
    } else {
      let latestDate = this.dayjs(setFyeSubmittedAt).isAfter(this.dayjs(appointResponsiblePersonSubmittedAt))
        ? setFyeSubmittedAt
        : appointResponsiblePersonSubmittedAt

      if (!latestDate) {
        return ""
      }
      return this.time.formatDateOnlyShort(latestDate.toString())
    }
  }

  onPayForAccess(): void {
    // TODO pay for access here
    console.log("On Pay For Access")
  }

  payLabel(): string {
    return this.language.isMalay() ? "Tambah ke Beg" : "Add to Bag"
  }

  slipCaseTitle(): string {
    let items = []
    if (this.showSetFYE.value) {
      items.push(
        this.language.isMalay()
          ? "Resolusi untuk Tetapan Tarikh Akhir Tahun Kewangan"
          : "Resolution to Set Financial Year End"
      )
    }

    if (this.hasMoreThanOneDirector.value && this.showAppointResponsiblePerson.value) {
      items.push(
        this.language.isMalay()
          ? "Resolusi untuk Pelantikan Pengarah Bertanggungjawab"
          : "Resolution to Appoint Responsible Director"
      )
    }

    if (this.showAppointAuditor.value) {
      items.push(
        this.language.isMalay() ? "Resolusi untuk Pelantikan Juruaudit" : "Resolution to Appoint Auditor & Audit Firm"
      )
    }

    let list = `
      <ul>
        <li>${items.join("</li><li>")}</li>
      </ul>
    `

    return list
  }

  haveAllSigned(): boolean {
    let allSignedFye = true
    if (this.showSetFYE.value) {
      allSignedFye =
        this.companySetFinancialYearEnd.value.signatureGroups.filter((sg: SignatureGroup) => {
          return sg.group !== null && sg.group.target === SignatureGroupConstants.GROUP_DIRECTOR
        }).length >= this.totalNumberOfDirectors.value
    }

    let allSignedAppointResponsiblePerson = true
    if (this.showAppointResponsiblePerson.value) {
      allSignedAppointResponsiblePerson =
        this.companyFinancialStatementAuthorisedPerson.value.signatureGroups.filter((sg: SignatureGroup) => {
          return sg.group !== null && sg.group.target === SignatureGroupConstants.GROUP_DIRECTOR
        }).length >= this.totalNumberOfDirectors.value
    }

    return allSignedFye && allSignedAppointResponsiblePerson
  }

  userSignatureDate(): string {
    if (!this.hasSigned() || !this.isADirector.value) {
      return ""
    }

    let setFyeSignature = null
    if (this.showSetFYE.value) {
      setFyeSignature = this.companySetFinancialYearEnd.value.signatureGroups.find((sg: SignatureGroup) => {
        return this.currentUser.value.email === sg.email
      })
    }

    let setAppointResponsiblePersonSignature = null
    if (this.showAppointResponsiblePerson.value) {
      setAppointResponsiblePersonSignature = this.companyFinancialStatementAuthorisedPerson.value.signatureGroups.find(
        (sg: SignatureGroup) => {
          return this.currentUser.value.email === sg.email
        }
      )
    }

    if (!setFyeSignature || !setAppointResponsiblePersonSignature) {
      return ""
    }

    let signatureGroup = this.dayjs(setFyeSignature.createdAt).isAfter(
      this.dayjs(setAppointResponsiblePersonSignature.createdAt)
    )
      ? setFyeSignature
      : setAppointResponsiblePersonSignature

    return this.time.formatDateOnlyShort(signatureGroup.createdAt ?? "")
  }

  hoveredButtonLabel(): string {
    return this.language.isMalay() ? `dari RM${this.price.value}` : `from RM${this.price.value}`
  }

  async handlePostDelete(): Promise<void> {
    if (this.eventManager.isItemRemovedFromCart) {
      await this.initializeData()
      this.eventManager.setIsItemRemovedFromCart(false)
    }
  }

  get serviceWrapperProps() {
    let application =
      this.viewType.value === ViewMode.New ? new CompanySetFinancialYearEnd() : this.companySetFinancialYearEnd.value
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
      true,
      true,
      this.totalNumberOfDirectors.value,
      this.totalNumberOfShareholders.value,
      false,
      true,
      this.backLabel(),
      this.payLabel(),
      this.hoveredButtonLabel(),
      isInPreviewMode,
      this.isSubmitting.value,
      CompanySetFinancialYearEnd,
      useCompanySetFinancialYearEndStore()
    )
  }
}
