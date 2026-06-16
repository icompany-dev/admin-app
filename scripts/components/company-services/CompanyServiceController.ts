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
import { CompanyConstants } from "~/scripts/constants/Company"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { ActionTrayElement, ActionTrayLabel } from "~/scripts/types/action-trays/ActionTrayElement"

export abstract class CompanyServiceController<T> {
  companyId: string = ""
  target: string = ""
  application = ref<Application | null>(null)
  hasDcr = ref<boolean>(false)
  hasMcr = ref<boolean>(false)
  ongoingFilter: Filter = new Filter()
  lastSubmissionFilter: Filter = new Filter()

  currentUser = ref<User>(new User())

  price: Ref<number> = ref<number>(299)

  router = useRouter()
  language = useLanguage()
  time = useLocalTime()
  dayjs = useDayjs()
  directorRepository = useDirectorStore()
  shareholderRepository = useShareholderStore()

  eventManager = useEventManagerStore()

  isADirector = ref<boolean>(false)
  isAShareholder = ref<boolean>(false)

  directors = ref<Director[]>([])
  shareholders = ref<Shareholder[]>([])

  totalNumberOfDirectors = ref<number>(0)
  totalNumberOfShareholders = ref<number>(0)

  hasSubmittedBefore = ref<boolean>(false)
  lastApplicationDate = ref<string>("")

  emitEvents: any | null = null

  dcrRef: any | null = null
  mcrRef: any | null = null

  currentPage = ref<number>(1)
  totalPages = ref<number>(0)

  isInPreviewMode = ref<boolean>(true)
  isShrouded = ref<boolean>(true)
  documentViewMode = ref<string>(ViewMode.Shrouded)

  isSubmitting = ref<boolean>(false)

  viewType = ref<string>(ViewMode.New)
  hasOngoingApplication: Ref<boolean> = ref<boolean>(false)
  hasPastApplications: Ref<boolean> = ref<boolean>(false)

  companyServiceInitializer: CompanyServiceInitializer<T>
  repository: IRepositoryStore
  itemClassType: new (data: any) => T

  isShowDocumentOptions: Ref<boolean> = ref<boolean>(false)

  actionTrayElements = ref<ActionTrayElement[]>([])
  isShowInfo: Ref<boolean> = ref<boolean>(false)

  isLoading: Ref<boolean> = ref<boolean>(false)

  constructor(
    companyId: string,
    hasDcr: boolean,
    hasMcr: boolean,
    itemClassType: new (data: any) => T,
    repository: IRepositoryStore | null,
    emitEvents: any | null
  ) {
    this.companyId = companyId
    this.hasDcr.value = hasDcr
    this.hasMcr.value = hasMcr
    this.emitEvents = emitEvents

    // Set this filter to take the latest
    this.ongoingFilter.take = 1
    this.ongoingFilter.sortOrder = "desc"
    this.ongoingFilter.orderBy = "created_at"
    this.ongoingFilter.companyId = this.companyId
    this.ongoingFilter.statuses = [StatusConstants.PAID]

    this.lastSubmissionFilter.take = 1
    this.lastSubmissionFilter.statuses = [StatusConstants.CONVERTED]
    this.lastSubmissionFilter.sortOrder = "desc"
    this.lastSubmissionFilter.orderBy = "created_at"
    this.lastSubmissionFilter.includeDeleted = true
    this.lastSubmissionFilter.companyId = this.companyId

    if (repository !== null) {
      this.repository = repository
    } else {
      this.repository = useCompanyAmendmentNameStore() //Set this as default until we find better way to handle
    }
    this.itemClassType = itemClassType
    this.companyServiceInitializer = new CompanyServiceInitializer(this.companyId, itemClassType, this.repository)

    this.setActionTrayElements()
  }

  setDcrRef(dcrRef: any): void {
    this.dcrRef = dcrRef
  }

  setMcrRef(mcrRef: any): void {
    this.mcrRef = mcrRef
  }

  setViewType(viewType: string): void {
    this.viewType.value = viewType
    this.initializeData()
  }

  abstract initializeData(): Promise<void>

  async init(application: Application): Promise<void> {
    this.setApplication(application)
    this.currentUser.value = await CurrentUser.get()
    await Promise.all([this.fetchDirectors(), this.fetchShareholders(), this.fetchPrice()])
  }

  setApplication(application: Application) {
    this.application.value = application
  }

  async fetchPrice(): Promise<void> {
    try {
      let repository = useServicePricingStore()
      let response = await repository.fetchDefault(this.target)
      if (repository.error !== null) {
        throw repository.error
      }

      if (!response) {
        return
      }

      let servicePricing = new ServicePricing(response)

      let handlingFees = Number(servicePricing.config.handlingFees) ?? 0.0

      this.price.value = Number(servicePricing.baseGrandTotal) + handlingFees
    } catch (e) {
      this.price.value = 299
    }
  }

  async fetchDirectors(): Promise<void> {
    if (!this.application.value) {
      return
    }

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
    if (!this.application.value) {
      return
    }

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

  hasPaid(): boolean {
    if (!this.application.value) {
      return false
    }

    return (
      this.application.value.status !== StatusConstants.DRAFT &&
      this.application.value.status !== StatusConstants.PENDING
    )
  }

  signatureRequired(): boolean {
    return (this.isADirector.value && this.hasDcr.value) || (this.isAShareholder.value && this.hasMcr.value)
  }

  hasSigned(): boolean {
    if (!this.signatureRequired() || !this.application.value) {
      return true
    }

    return this.application.value.signatureGroups.some((sg: SignatureGroup) => {
      return this.currentUser.value.email === sg.email
    })
  }

  userSignatureDate(): string {
    if (!this.hasSigned() || !this.application.value) {
      return ""
    }

    let signatureGroup: SignatureGroup | undefined = this.application.value.signatureGroups.find(
      (sg: SignatureGroup) => {
        return this.currentUser.value.email === sg.email
      }
    )
    if (!signatureGroup) {
      return ""
    }

    return this.time.formatDateOnlyShort(signatureGroup.createdAt ?? "")
  }

  haveAllSigned(): boolean {
    if (!this.application.value || this.application.value.signatureGroups.length <= 0) {
      return false
    }

    let hasAllDirectorsSigned = true
    let hasAllShareholdersSigned = true

    if (this.hasDcr.value) {
      hasAllDirectorsSigned =
        this.application.value.signatureGroups.filter((sg: SignatureGroup) => {
          return sg.group !== null && sg.group.target === SignatureGroupConstants.GROUP_DIRECTOR
        }).length >= this.totalNumberOfDirectors.value
    }

    if (this.hasMcr.value) {
      hasAllShareholdersSigned =
        this.application.value.signatureGroups.filter((sg: SignatureGroup) => {
          return sg.group !== null && sg.group.target === SignatureGroupConstants.GROUP_SHAREHOLDER
        }).length >= this.totalNumberOfShareholders.value
    }

    return hasAllDirectorsSigned && hasAllShareholdersSigned
  }

  lastSignatureDate(): string {
    if (!this.application.value) {
      return ""
    }

    return this.application.value.signatureGroups
      .filter((sg: SignatureGroup) => {
        return sg.createdAt !== null
      })
      .map((sg: SignatureGroup) => {
        return sg.createdAt
      })
      .reduce((latest: string, current: string | null) => {
        if (!current) {
          return latest
        }
        return this.dayjs(current).isAfter(this.dayjs(latest)) ? this.time.formatDateOnlyShort(current) : latest
      }, "")
  }

  showCtaAndBackButtons(): boolean {
    return !this.application.value || StringUtil.isNullOrEmpty(this.application.value.id) || !this.hasPaid()
  }

  ctaLabel(): string {
    if (!this.application.value) {
      return this.language.isMalay() ? "Teruskan" : "Proceed"
    }

    if (StringUtil.isNullOrEmpty(this.application.value.id)) {
      return this.language.isMalay() ? "Teruskan" : "Proceed"
    }

    if (!this.hasPaid()) {
      return this.language.isMalay() ? "Bayar" : "Pay"
    }

    return ""
  }

  backLabel(): string {
    return this.language.isMalay() ? "Kembali" : "Back"
  }

  onBackButtonClicked(): void {
    if (this.isSubmitting.value) {
      return
    }

    this.router.back()
  }

  onPayForAccess(): void {
    // TODO pay for access here
  }

  async setTotalPages(): Promise<void> {
    await nextTick()

    let totalDcrPages: number = this.hasDcr.value ? 1 : 0
    let totalMcrPages: number = this.hasMcr.value ? 1 : 0

    if (this.dcrRef) {
      totalDcrPages = this.dcrRef.totalPages()
    }

    if (this.mcrRef) {
      totalMcrPages = this.mcrRef.totalPages() + 1 // always have accompanying data
    }

    this.totalPages.value = totalDcrPages + totalMcrPages
  }

  setActionTrayElements(): void {
    this.actionTrayElements.value = [
      new ActionTrayElement("2-0", this.onBackButtonClicked.bind(this), {
        label: new ActionTrayLabel("Back", "Kembali"),
        iconClass: "fa-solid fa-arrow-left",
        isIconStart: true,
      }),
      new ActionTrayElement("2-1", this.onMoreInfoClicked.bind(this), {
        label: new ActionTrayLabel("Learn More", "Maklumat Lanjut"),
      }),
    ]
  }

  onMoreInfoClicked(): void {
    this.isShowInfo.value = !this.isShowInfo.value
    this.eventManager.setIsDisablePage(this.isShowInfo.value)
  }

  showActionTray(): boolean {
    return this.viewType.value === ViewMode.Existing
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

    let prefix = "dcr"
    let page = this.currentPage.value
    if (this.dcrRef) {
      if (this.currentPage.value > this.dcrRef.totalPages()) {
        prefix = "mcr"
        page = this.currentPage.value - this.dcrRef.totalPages()
      }
    } else {
      prefix = "mcr"
    }

    let paperIdToDisplay = `${prefix}-${page}`

    allPapers.forEach((paper: Element) => {
      if (!paper.id) {
        return
      }

      let paperElement = paper as HTMLElement
      if (paper.id === paperIdToDisplay) {
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

  onPreview(): void {
    this.isInPreviewMode.value = true
    this.documentViewMode.value = ViewMode.Preview
    this.handleDisplayedPage()
  }

  onShrouded(): void {
    // this.isInPreviewMode.value = true
  }

  onViewModeChanged(viewMode: string): void {
    this.documentViewMode.value = viewMode
    this.emitEvents("viewModeChanged", viewMode)
    nextTick(() => {
      this.handleDisplayedPage()
    })
  }

  onDocumentOptionsClicked(): void {
    this.isShowDocumentOptions.value = !this.isShowDocumentOptions.value
  }

  showWatermark(): boolean {
    if (this.documentViewMode.value === ViewMode.Shrouded) {
      return false
    }

    if (this.application.value === null) {
      return false
    }

    if (this.application.value.status === StatusConstants.READY) {
      return true
    }

    return (
      this.isInPreviewMode.value ||
      (this.application.value !== null &&
        this.application.value !== undefined &&
        this.application.value.signatureGroups.length <= 0)
    )
  }

  watermarkText(): string {
    if (!this.application.value) {
      return ""
    }

    // exception because BO declaration follows different path
    if (this.target === CompanyConstants.TARGET_BO_DECLARATION) {
      return "DRAFT"
    }

    if (this.isInPreviewMode.value || StringUtil.isNullOrEmpty(this.application.value.id)) {
      return "PREVIEW"
    }

    if (this.application.value.status === StatusConstants.READY) {
      return "READY FOR DELIVERY"
    }

    if (this.application.value.signatureGroups.length <= 0) {
      return "DRAFT"
    }

    return ""
  }

  isStepStatusVisible(): boolean {
    if (!this.application.value) {
      return false
    }

    return (
      this.application.value.paidAt !== null &&
      (this.hasSigned() || this.haveAllSigned()) &&
      this.application.value.status !== StatusConstants.SUBMITTED
    )
  }

  isSubmittedToSSM(): boolean {
    if (!this.application.value) {
      return false
    }

    return this.application.value.submittedAt !== null
  }

  getSubmissionDate(): string {
    if (!this.application.value) {
      return ""
    }

    if (!this.application.value.submittedAt || StringUtil.isNullOrEmpty(this.application.value.submittedAt)) {
      return ""
    }
    return this.time.formatDateOnlyShort(this.application.value.submittedAt.toString())
  }

  onGlossaryLinkClicked(event: Event): void {
    let target = event.target as HTMLElement

    let id = target.id ?? null
    if (!id) {
      return
    }

    let keyword = id.replaceAll("-", " ")

    this.eventManager.setGlossarySearchText(keyword)
    this.eventManager.setIsShowGlossary(true)
    this.isShowInfo.value = false
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

  payLabel(): string {
    return this.language.isMalay() ? "Tambah ke Beg" : "Add to Bag"
  }

  hoveredButtonLabel(): string {
    return this.language.isMalay() ? `dari RM${this.price.value}` : `from RM${this.price.value}`
  }

  documentOptionsLabel(): string {
    return this.language.isMalay() ? "Dokumen" : "Documents"
  }

  learnMoreLabel(): string {
    return this.language.isMalay() ? "Maklumat Lanjut" : "Learn More"
  }

  loaderLabel(): string {
    if (this.viewType.value !== ViewMode.New) {
      return this.language.isMalay() ? "Sedang Memaut" : "Retrieving Your"
    }

    return this.language.isMalay() ? "Sedang Menyediakan" : "Preparing Your"
  }

  loaderSublabel(): string {
    switch (this.viewType.value) {
      case ViewMode.New:
        return this.language.isMalay() ? "Permohonan Anda" : "Application"
      case ViewMode.Existing:
        return this.language.isMalay() ? "Permohonan Anda" : "Existing Application"
      case ViewMode.Past:
        return this.language.isMalay() ? "Permohonan yang Lepas" : "Past Applications"
    }

    return this.language.isMalay() ? "Permohonan Anda" : "Application"
  }

  async handlePostDelete(): Promise<void> {
    if (this.eventManager.isItemRemovedFromCart) {
      await this.initializeData()
      this.eventManager.setIsItemRemovedFromCart(false)
    }
  }

  async handleRevoke(): Promise<void> {
    //
  }
}
