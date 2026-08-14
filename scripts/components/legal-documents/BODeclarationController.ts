import { CompanyBODeclaration } from "~/scripts/models/CompanyBODeclaration"
import { Shareholder } from "~/scripts/models/Shareholder"
import { User } from "~/scripts/models/User"
import { SignatureItem } from "~/scripts/types/SignatureItem"
import { PaperOrientation } from "~/scripts/constants/Paper"
import { SdnBhdLegalDocumentController } from "./SdnBhdLegalDocumentController"
import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"
import { useCompanyBODeclarationStore } from "~/stores/CompanyBODeclarations"
import { useShareholderStore } from "~/stores/Shareholders"
import { useLocalTime } from "~/composables/useLocalTime"
import { CurrentUser } from "~/scripts/utils/CurrentUser"
import { StatusConstants } from "~/scripts/constants/Status"
import { StringUtil } from "~/scripts/utils/String"
import type { CriteriaType, OwnershipType } from "~/scripts/constants/BODeclarations"
import type { Gender } from "~/scripts/constants/UserProfile"
import { Company } from "~/scripts/models/Company"

export class BODeclarationController extends SdnBhdLegalDocumentController {
  applicationId: Ref<string> = ref<string>("")
  application = ref<CompanyBODeclaration>(new CompanyBODeclaration())

  shareholderId = ref<string | null>(null)
  isLoading = ref<boolean>(false)

  shareholder = ref<Shareholder>(new Shareholder())
  user = ref<User>(new User())
  isBeneficialOwner = ref<boolean | null>(null)
  signatureItems = ref<SignatureItem[]>([])
  signatureItem = ref<SignatureItem>(
    new SignatureItem(null, false, true, false, "SHAREHOLDER NAME", "", "Shareholder", false)
  )

  shareholderRepository = useShareholderStore()
  repository = useCompanyBODeclarationStore()
  time = useLocalTime()

  emitEvents: any
  documentRef: any | null = null
  nonBeneficialOwnerRef: any | null = null

  additionalCssClass: string = "legal-documents bo-disclosure print"

  //handle for external bo
  declarationId: Ref<string> = ref<string>("")
  externalBoEmailAddress: Ref<string> = ref<string>("")

  constructor(
    companyId: string,
    shareholderId: string | null,
    declarationId: string,
    externalBoEmailAddress: string,
    isInPreviewMode: boolean,
    emitEvents: any
  ) {
    super("Beneficial Ownership Declaration", companyId, PaperOrientation.Portrait)

    this.shareholderId.value = shareholderId
    this.emitEvents = emitEvents
    this.declarationId.value = declarationId
    this.externalBoEmailAddress.value = externalBoEmailAddress
    this.isInPreviewMode.value = isInPreviewMode

    if (
      !StringUtil.isNullOrEmpty(this.declarationId.value) &&
      !StringUtil.isNullOrEmpty(this.externalBoEmailAddress.value)
    ) {
      this.initializeForExternal()
    } else {
      this.initialize()
    }
  }

  async setDeclarationId(declarationId: string): Promise<void> {
    this.declarationId.value = declarationId
    await this.initializeForExternal()
  }

  async setExternalBoEmailAddress(externalBoEmailAddress: string): Promise<void> {
    this.externalBoEmailAddress.value = externalBoEmailAddress
    await this.initializeForExternal()
  }

  async setShareholderId(shareholderId: string): Promise<void> {
    this.shareholderId.value = shareholderId
    await Promise.all([this.fetchShareholder(), this.fetchExistingDeclaration()])

    this.setSignatureItem()
  }

  setNonBeneficialOwnerRef(nonBeneficialOwnerRef: any): void {
    this.nonBeneficialOwnerRef = nonBeneficialOwnerRef
  }

  async initialize(): Promise<void> {
    this.isLoading.value = true

    try {
      this.user.value = await CurrentUser.get()

      await Promise.all([this.fetchShareholder(), this.fetchExistingDeclaration()])

      if (!this.application.value.id) {
        this.populateFromUser()
      }
      this.setSignatureItem()
    } catch (error) {
      console.error("Error initializing BO declaration:", error)
    } finally {
      this.isLoading.value = false
    }
  }

  async initializeForExternal(): Promise<void> {
    if (
      StringUtil.isNullOrEmpty(this.declarationId.value) ||
      StringUtil.isNullOrEmpty(this.externalBoEmailAddress.value) ||
      this.isLoading.value
    ) {
      return
    }

    try {
      this.isLoading.value = true
      let response = await this.repository.fetchForExternal(this.declarationId.value, this.externalBoEmailAddress.value)
      if (this.repository.error !== null) {
        throw this.repository.error
      }

      this.application.value = new CompanyBODeclaration(response)
      this.company.value = new Company(this.application.value.company)

      this.setSignatureItem()
    } catch (e) {
      //issues handle?
    } finally {
      this.isLoading.value = false
    }
  }

  async fetchShareholder(): Promise<void> {
    if (!this.shareholderId.value) {
      return
    }

    const shareholder = await this.shareholderRepository.fetch(this.shareholderId.value)
    if (shareholder) {
      this.shareholder.value = new Shareholder(shareholder)
      let userRepository = useUserStore()
      let userShareholderResponse = await userRepository.fetch(this.shareholder.value.userId ?? "")
      this.shareholder.value.user = new User(userShareholderResponse)
      return
    }

    try {
      let response = await this.shareholderRepository.fetchAllForCompany(this.companyId.value)
      if (response.length <= 0) {
        return
      }

      this.shareholder.value = new Shareholder(response[0])
      let userShareholder = await this.shareholder.value.getRegisteredUser(useUserStore())
      this.shareholder.value.user = new User(userShareholder)
    } catch (error) {
      console.error("Error fetching shareholder:", error)
    }
  }

  async fetchExistingDeclaration(): Promise<void> {
    if (!this.shareholderId.value) {
      return
    }

    const existingDeclaration = await this.repository.fetchByShareholderId(this.shareholderId.value)
    if (existingDeclaration) {
      this.application.value = existingDeclaration
      this.applicationId.value = existingDeclaration.id
      this.isBeneficialOwner.value = existingDeclaration.isBeneficialOwner
    }
  }

  populateFromUser(): void {
    if (StringUtil.isNullOrEmpty(this.shareholder.value.id)) {
      return
    }

    const user =
      !StringUtil.isNullOrEmpty(this.shareholder.value.id) && this.shareholder.value.user !== null
        ? new User(this.shareholder.value.user)
        : new User(this.user.value)
    const userDetail = user.detail

    this.application.value.companyId = this.companyId.value
    this.application.value.shareholderId = this.shareholderId.value || ""
    this.application.value.fullName = user.name
    this.application.value.emailAddress = user.email
    this.application.value.phone = user.phone

    if (this.shareholder.value) {
      let time = useLocalTime()
      this.application.value.dateOfAppointment = time.formatDateOnlySystem(this.shareholder.value.dateAppointed ?? "")
    }

    if (userDetail) {
      this.application.value.residentialAddress = userDetail.location?.getOnelineAddress() ?? ""
      this.application.value.nationality = userDetail.citizenship || ""
      this.application.value.race = userDetail.race || ""
      this.application.value.gender = userDetail.gender || ""
      this.application.value.identificationType = userDetail.identificationType || ""
      this.application.value.identificationNumber = userDetail.identification || ""
    }

    this.application.value.position = "Shareholder"
  }

  isExternalBO(): boolean {
    return (
      !StringUtil.isNullOrEmpty(this.declarationId.value) &&
      !StringUtil.isNullOrEmpty(this.externalBoEmailAddress.value)
    )
  }

  isFieldEditable(): boolean {
    if (this.isExternalBO()) {
      return this.isDocumentEditable()
    }

    return this.isDocumentEditable() && !this.application.value.isBeneficialOwner
  }

  shareholderName(): string {
    if (!StringUtil.isNullOrEmpty(this.application.value.fullName)) {
      return this.application.value.fullName
    }

    return this.shareholder.value?.name || this.user.value?.name || ""
  }

  showShareholderName(): boolean {
    if (this.isDocumentEditable()) {
      return !this.isExternalBO()
    }

    return true
  }

  isDocumentEditable(): boolean {
    if (this.isInPreviewMode.value) {
      return false
    }

    return StringUtil.isNullOrEmpty(this.application.value.signatureFileId)
  }

  onIsBeneficialOwnerChanged(isBeneficialOwner: boolean): void {
    this.application.value.isBeneficialOwner = isBeneficialOwner
    this.isBeneficialOwner.value = isBeneficialOwner

    if (isBeneficialOwner) {
      this.populateFromUser()
    } else {
      if (this.nonBeneficialOwnerRef) {
        this.nonBeneficialOwnerRef.show()
      }

      this.clearData()
    }

    this.setSignatureItem()
  }

  onGenderClicked(gender: Gender): void {
    this.application.value.gender = gender
  }

  isGenderChecked(gender: Gender): boolean {
    return this.application.value.gender === gender
  }

  setOwnershipType(type: OwnershipType): void {
    this.application.value.typeOfOwnership = type
    // @ts-ignore
    this.application.value.criteriaType = ""
  }

  setCriteriaType(type: CriteriaType): void {
    this.application.value.criteriaType = type
  }

  isOwnershipType(type: string): boolean {
    return this.application.value.typeOfOwnership === type
  }

  isCriteriaType(type: string): boolean {
    return this.application.value.criteriaType === type
  }

  clearData(): void {
    this.application.value.fullName = ""
    this.application.value.residentialAddress = ""
    this.application.value.emailAddress = ""
    this.application.value.phone = ""
    this.application.value.nationality = ""
    this.application.value.dateOfBirth = ""
    this.application.value.race = ""
    this.application.value.gender = ""
    this.application.value.identificationType = ""
    this.application.value.identificationNumber = ""
    this.application.value.position = ""
    this.application.value.dateOfAppointment = ""
  }

  onResponseChanged(): void {
    if (this.isBeneficialOwner.value !== null) {
      this.application.value.isBeneficialOwner = this.isBeneficialOwner.value
    }
    this.setSignatureItem()
  }

  maxDate(): string {
    const today = new Date()
    return today.toISOString().split("T")[0]
  }

  formatDate(date: string): string {
    if (!date) {
      return ""
    }
    return this.time.formatDateOnlyFull(date).toUpperCase()
  }

  hasSigned(): boolean {
    return !StringUtil.isNullOrEmpty(this.application.value.signatureFileId)
  }

  setSignatureItem(): void {
    let canEdit = !this.isInPreviewMode.value && this.user.value.id === this.shareholder.value.userId

    let name = this.shareholder.value.user?.name ?? ""
    let email = this.shareholder.value.user?.email ?? ""

    if (this.isExternalBO()) {
      canEdit = !this.isInPreviewMode.value
      name = this.application.value.fullName
      email = this.application.value.emailAddress
    }

    this.signatureItem.value = new SignatureItem(
      this.application.value.signatureFile?.url ?? null,
      !StringUtil.isNullOrEmpty(this.application.value.signatureFileId),
      canEdit,
      false,
      name,
      email,
      this.application.value.isBeneficialOwner ? "Beneficial Owner" : "Shareholder",
      false
    )
  }

  signatureTitle(): string {
    return this.application.value.isBeneficialOwner ? "Beneficial Owner" : "Shareholder"
  }

  totalPages(): number {
    return this.application.value.isBeneficialOwner ? 3 : 1
  }

  declarationDate(): string {
    if (StringUtil.isNullOrEmpty(this.application.value.signatureFileId)) {
      return "To be determined by iCompany"
    }

    return this.time.formatDateOnlyFull(this.application.value.signatureFile?.createdAt ?? "")
  }

  async getPdfElements(): Promise<HTMLElement[]> {
    if (!this.documentRef) {
      return []
    }

    return await PdfPaperUtil.getPdfElements(this.documentRef as HTMLElement)
  }

  setDocumentRef(documentRef: any): void {
    this.documentRef = documentRef
  }

  getApplicationData(): CompanyBODeclaration {
    return new CompanyBODeclaration(this.application.value)
  }
}
