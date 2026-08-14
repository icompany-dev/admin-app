import { SdnBhdLegalDocumentController } from "./SdnBhdLegalDocumentController"
import { PaperOrientation } from "~/scripts/constants/Paper"
import { SignatureItem } from "~/scripts/types/SignatureItem"
import { Director } from "~/scripts/models/Director"
import { Error } from "~/scripts/library/Error"
import { CurrentUser } from "~/scripts/utils/CurrentUser"
import { User } from "~/scripts/models/User"
import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"
import { CompanyTermOfReference } from "~/scripts/models/CompanyTermOfReference"
import { StatusConstants } from "~/scripts/constants/Status"
import { StringUtil } from "~/scripts/utils/String"
import type { SignatureGroup } from "~/scripts/models/SignatureGroup"
import type { RefSymbol } from "@vue/reactivity"

export class TermsOfReferencesController extends SdnBhdLegalDocumentController {
  applicationId: Ref<string | null> = ref<string | null>(null)
  application = ref<CompanyTermOfReference>(new CompanyTermOfReference())

  directors = ref<Director[]>([])
  currentUser = ref<User>(new User())
  signatureItems = ref<SignatureItem[]>([])

  directorRepository = useDirectorStore()

  emitEvents: any | null = null
  documentRef: any | null = null

  additionalCssClass: string = "legal-document terms-of-reference"

  constructor(companyId: string, emitEvents: any | null) {
    super("Terms of Reference", companyId, PaperOrientation.Portrait)
    this.emitEvents = emitEvents
    this.initializeData()
  }

  async initializeData(): Promise<void> {
    await this.setUser()
    await this.fetchDirectors()
    this.setSignatureItems()
  }

  async setUser(): Promise<void> {
    this.currentUser.value = await CurrentUser.get()
  }

  setDocumentRef(documentRef: any): void {
    this.documentRef = documentRef
  }

  async fetchDirectors(): Promise<void> {
    try {
      const response = await this.directorRepository.fetchAllForCompany(this.companyId.value)
      if (this.directorRepository.error !== null) {
        throw this.directorRepository.error
      }

      this.directors.value = response.map((d: any) => new Director(d))
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error: Error = new Error(
          Error.ERROR_TYPE_API,
          "Unable to fetch directors for company. Please refresh the page and try again."
        )
        error.handle()
      }
    }
  }

  setSignatureItems(): void {
    this.signatureItems.value = this.directors.value
      .filter((d: Director) => {
        return !d.isResignationInProgress
      })
      .map((director: Director) => {
        let signatureGroup =
          this.application.value.signatureGroups.find((sg: SignatureGroup) => {
            return sg.email === director.email
          }) ?? null

        let signatureFile = signatureGroup?.signature
        return new SignatureItem(
          signatureFile?.url ?? null,
          signatureFile !== null,
          !this.isInPreviewMode.value && director.email === this.currentUser.value.email,
          false,
          director.name,
          director.email,
          "Director",
          false
        )
      })
  }

  signatureTitle(): string {
    const title = this.signatureItems.value.length > 1 ? "Board of" : "Sole"
    return this.signatureItems.value.length > 1 ? `${title} Directors` : `${title} Director`
  }

  async getLetterPdfElements(): Promise<HTMLElement[]> {
    if (!this.documentRef) {
      return []
    }

    return await PdfPaperUtil.getPdfElements(this.documentRef as HTMLElement)
  }

  getData(): any {
    return {
      companyId: this.companyId.value,
      directors: this.directors.value,
    }
  }

  isDocumentEditable(): boolean {
    if (this.isInPreviewMode.value) {
      return false
    }

    if (this.application.value && this.application.value.signatureGroups.length > 0) {
      return false
    }

    return (
      this.application.value !== null &&
      (StringUtil.isNullOrEmpty(this.application.value.id) ||
        this.application.value.status === StatusConstants.DRAFT ||
        this.application.value.status === StatusConstants.PENDING ||
        this.application.value.status === StatusConstants.PAID)
    )
  }

  maxSignatureOnFirstPage(): number {
    return this.isDocumentEditable() ? 2 : 6
  }

  maxSignatureOnOtherPages(): number {
    return 6
  }

  signatureStartPage(): number {
    return 4
  }

  totalPages(): number {
    let basicContent = 4
    let pagesForSignature = Math.ceil(
      (this.signatureItems.value.length - this.maxSignatureOnFirstPage()) / this.maxSignatureOnOtherPages()
    )
    return basicContent + pagesForSignature
  }

  rangeOfOtherPage(): number[] {
    let totalBasicContent = 4
    let startPage = totalBasicContent + 1
    let totalOtherPages = this.totalPages() - totalBasicContent
    return Array.from({ length: totalOtherPages }, (_, i) => i + startPage)
  }

  hasConstitution(): boolean {
    return this.company.value.hasConstitution
  }

  getAuthorityIncludeResolutionsOfMembers(): string {
    return this.application.value.authorityIncludeResolutionsOfMembers
      ? `including, Resolutions of Members; in general meeting.`
      : `.`
  }

  getAuthorityAcceptReservedMatters(): string {
    return this.application.value.authorityAcceptReservedMatters
      ? `except certain matters which are expressly under Reserved Matters for Members.`
      : `.`
  }

  getEffectiveDateText(): string {
    if (
      this.application.value.isEffectiveDateCustom &&
      !StringUtil.isNullOrEmpty(this.application.value.effectiveDate)
    ) {
      let time = useLocalTime()
      let effectiveDate = time.formatDateOnlyFull(this.application.value.effectiveDate)
      return `from: ${effectiveDate}`
    } else if (this.application.value.isEffectiveOnLastSignature) {
      return `from the date of this Term of Reference`
    } else if (this.application.value.isEffectiveOnFirstSignature) {
      return `since the incorporation date of this Company`
    }

    return "since the incorporation date of this Company"
  }

  getEffectiveAppointmentText(): string {
    if (this.application.value.ceasesUntilDirectorChange) {
      return `shall cease to be of any effect if any of the Director resigned, removed, death and cessation of office for whatever reason.`
    }
    return `shall continue in force regardless of change in the composition of the Board.`
  }

  getConfidentialityObligationText(): string {
    if (this.application.value.confidentialityDuringTenureOnly) {
      return `only continue during the Director's tenure`
    }

    return "survive resignation, removal, death or Cessation of office"
  }

  getSecretProfitText(): string {
    let parts: string[] = []

    if (this.application.value.secretProfitDisclosureRequired) {
      parts.push("be disclosed to the Board")
    }

    if (this.application.value.secretProfitReturnRequired) {
      parts.push("be accounted for and returned to the Company")
    }

    return `${parts.join("; and ").trim()}.`
  }

  getDirectInterestText(): string {
    let parts: string[] = []

    if (this.application.value.declareConflictInterest) {
      parts.push("declare the nature and extent of such interest")
    }

    if (this.application.value.abstainFromVotingOnConflict) {
      parts.push("abstain from deliveration and voting, where required")
    }

    if (this.application.value.ensureDisclosureInMinute) {
      parts.push("ensure such disclosure is properly minuted")
    }

    let lastPart = parts.pop()

    return `${parts.join("; ").trim()} and ${lastPart}.`
  }

  getBoardAssuranceOnInterestText(): string {
    let parts: string[] = []

    if (this.application.value.isEnsureAllTransactionsDisclosed) {
      parts.push("all related party transactions are disclosed")
    }

    if (this.application.value.isEnsureApprovalsObtained) {
      parts.push("all approvals are obtained where required")
    }

    if (this.application.value.isEnsureTransactionsTerms) {
      parts.push("transactions are on arm’s-length terms unless otherwise approved")
    }

    let lastPart = parts.pop()

    return `${parts.join("; ").trim()} and ${lastPart}.`
  }

  getBoardInformationReliance(): string {
    let parts: string[] = []

    if (this.application.value.relianceOnManagement) {
      parts.push("information prepared by Management or Employees")
    }

    if (this.application.value.relianceOnProfessionals) {
      parts.push("professional advice from auditors, lawyers or advisers")
    }

    if (this.application.value.relianceOnDigitalAndAi) {
      parts.push("information provided from artificial intelligence and other digital platforms")
    }

    let lastPart = parts.pop()

    return `${parts.join("; ").trim()} and ${lastPart}.`
  }

  getAccessToInformationText(): string {
    let parts: string[] = []

    if (this.application.value.timelyAccessToInfo) {
      parts.push("timely access to Company information")
    }

    if (this.application.value.requestClarification) {
      parts.push("request clarification or additional documentation")
    }

    if (this.application.value.accessCompanySecretaryRecords) {
      parts.push("access records maintained by the Company Secretary")
    }

    let lastPart = parts.pop()

    return `${parts.join("; ").trim()} and ${lastPart}.`
  }

  getApplication(): CompanyTermOfReference {
    return new CompanyTermOfReference(this.application.value)
  }

  async updateApplicationContent(updatedApplicationData: CompanyTermOfReference): Promise<void> {
    this.application.value.cloneDetails(updatedApplicationData)
    await this.setSignatureItems()
  }

  // document functions
  onIsEffectiveDateCustom(): void {
    if (this.application.value.isEffectiveDateCustom) {
      this.application.value.isEffectiveOnLastSignature = false
      this.application.value.isEffectiveOnFirstSignature = false
    } else {
      this.application.value.effectiveDate = ""
    }
  }

  onIsEffectiveOnLastSignature(): void {
    if (this.application.value.isEffectiveOnLastSignature) {
      this.application.value.isEffectiveDateCustom = false
      this.application.value.isEffectiveOnFirstSignature = false
      this.application.value.effectiveDate = ""
    }
  }

  onIsEffectiveOnFirstSignature(): void {
    if (this.application.value.isEffectiveOnFirstSignature) {
      this.application.value.isEffectiveDateCustom = false
      this.application.value.isEffectiveOnLastSignature = false
      this.application.value.effectiveDate = ""
    }
  }

  onContinueRegardlessOfChangeChanged(): void {
    this.application.value.ceasesUntilDirectorChange = !this.application.value.continueRegardlessOfChange
  }

  onCeasesUntilDirectorChangeChanged(): void {
    this.application.value.continueRegardlessOfChange = !this.application.value.ceasesUntilDirectorChange
  }

  onConfidentialityDuringTenureOnlyChanged(): void {
    this.application.value.confidentialitySurvivesCessation = !this.application.value.confidentialityDuringTenureOnly
  }

  onConfidentialitySurvivesCessationChanged(): void {
    this.application.value.confidentialityDuringTenureOnly = !this.application.value.confidentialitySurvivesCessation
  }

  getSignatureOnPage(page: number): SignatureItem[] {
    if (page < this.signatureStartPage()) {
      return []
    }

    if (page === this.signatureStartPage()) {
      return this.signatureItems.value.slice(0, this.maxSignatureOnFirstPage())
    }

    const offsetPage = this.signatureStartPage() + 1
    const skip = (page - offsetPage) * this.maxSignatureOnOtherPages() + this.maxSignatureOnFirstPage()
    const lastIndex = Math.min(this.signatureItems.value.length, skip + this.maxSignatureOnOtherPages())

    return this.signatureItems.value.slice(skip, lastIndex)
  }
}
