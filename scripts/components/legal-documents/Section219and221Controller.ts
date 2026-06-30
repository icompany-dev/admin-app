import { PaperOrientation } from "~/scripts/constants/Paper"
import { SdnBhdLegalDocumentController } from "./SdnBhdLegalDocumentController"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { Director } from "~/scripts/models/Director"
import { User } from "~/scripts/models/User"
import { Shareholder } from "~/scripts/models/Shareholder"
import { ShareholdingType } from "~/scripts/constants/Shareholder"
import { NumberUtil } from "~/scripts/utils/Number"
import { DirectorDeclarationConflictOfInterest } from "~/scripts/models/DirectorDeclarationConflictOfInterest"
import { StatusConstants } from "~/scripts/constants/Status"
import { DirectorDeclarationConflictOfInterestDisclosure } from "~/scripts/models/DirectorDeclarationConflictOfInterestDisclosure"
import { DirectorDeclarationConflictOfInterestProperty } from "~/scripts/models/DirectorDeclarationConflictOfInterestProperty"
import { SignatureItem } from "~/scripts/types/SignatureItem"
import { CurrentUser } from "~/scripts/utils/CurrentUser"
import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"

export class Section219and221Controller extends SdnBhdLegalDocumentController {
  applicationId: Ref<string | null> = ref<string | null>(null)
  application = ref<DirectorDeclarationConflictOfInterest>(new DirectorDeclarationConflictOfInterest())
  directorId: Ref<string> = ref<string>("")

  director: Ref<Director> = ref<Director>(new Director())
  user: Ref<User> = ref<User>(new User())

  signatureItem = ref<SignatureItem>(new SignatureItem(null, false, false, false, "", "", "", true))

  repository = useDirectorDeclarationConflictOfInterestStore()
  directorRepository = useDirectorStore()
  shareholderRepository = useShareholderStore()
  dayjs = useDayjs()
  time = useLocalTime()

  shareholdersOfCompany: Ref<Shareholder[]> = ref<Shareholder[]>([])

  documentRef: any | null = null

  constructor(companyId: string, directorId: string, applicationId: string | null) {
    super("Notice Pursuant to Section 219 & 221 of the Companies Act, 2016", companyId, PaperOrientation.Landscape)

    this.applicationId.value = applicationId
    this.directorId.value = directorId
    this.initiateData()
    this.fetchShareholders()
  }

  setDocumentRef(documentRef: any): void {
    this.documentRef = documentRef
  }

  async getPdfElements(): Promise<HTMLElement[]> {
    if (!this.documentRef) {
      return []
    }

    return await PdfPaperUtil.getPdfElements(this.documentRef as HTMLElement)
  }

  async initiateData(): Promise<void> {
    await Promise.all([this.setUser(), this.fetchApplication(), this.fetchDirector()])

    if (StringUtil.isNullOrEmpty(this.directorId.value)) {
      this.directorId.value = this.application.value.directorId
      await this.fetchDirector()
    }

    this.setApplicationUserDetails()
  }

  override setIsInPreviewMode(isInPreviewMode: boolean): void {
    this.isInPreviewMode.value = isInPreviewMode

    this.setSignatureItem()
  }

  async setApplicationId(applicationId: string): Promise<void> {
    this.applicationId.value = applicationId
    await this.fetchApplication()

    if (StringUtil.isNullOrEmpty(this.directorId.value)) {
      this.directorId.value = this.application.value.directorId
      await this.fetchDirector()
    }

    this.setApplicationUserDetails()
  }

  async setDirectorId(directorId: string): Promise<void> {
    this.directorId.value = directorId
    await this.fetchDirector()
    this.setApplicationUserDetails()
  }

  async setUser(): Promise<void> {
    this.user.value = await CurrentUser.get()
  }

  async fetchDirector(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.directorId.value)) {
      return
    }

    try {
      const response = await this.directorRepository.fetch(this.directorId.value)
      if (this.directorRepository.error !== null) {
        throw this.directorRepository.error
      }
      this.director.value = new Director(response)
      let userRepository = useUserStore()
      let userResponse = await userRepository.fetch(this.director.value.userId ?? "")
      this.director.value.user = new User(userResponse)
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error: Error = new Error(
          Error.ERROR_TYPE_API,
          "Unable to fetch details of director. Please refresh the page and try again."
        )
        error.handle()
      }
    }
  }

  async fetchShareholders(): Promise<void> {
    try {
      this.shareholdersOfCompany.value = []
      const response = await this.shareholderRepository.fetchAllForCompany(this.companyId.value)
      if (this.shareholderRepository.error !== null) {
        throw this.shareholderRepository.error
      }

      this.shareholdersOfCompany.value = response.map((s: any) => {
        return new Shareholder(s)
      })
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error: Error = new Error(
          Error.ERROR_TYPE_API,
          "Unable to fetch details of shareholders. Please refresh the page and try again."
        )
        error.handle()
      }
    }
  }

  async fetchApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.applicationId.value)) {
      this.application.value = new DirectorDeclarationConflictOfInterest()
      this.application.value.companyId = this.companyId.value
      this.application.value.directorshipsInOtherCompanies = Array(4).fill("")
      return
    }

    try {
      let response = await this.repository.fetch(this.applicationId.value ?? "")
      if (this.repository.error !== null) {
        throw this.repository.error
      }

      this.application.value = new DirectorDeclarationConflictOfInterest(response)
      if (this.application.value.directorshipsInOtherCompanies.length < 4) {
        let balance = 4 - this.application.value.directorshipsInOtherCompanies.length
        this.application.value.directorshipsInOtherCompanies =
          this.application.value.directorshipsInOtherCompanies.concat(Array(balance).fill(""))
      }
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error("", "")
        error.setForFetch()
        error.handle()
      }
    }
  }

  shareholderOfCompany(): Shareholder | null {
    if (!this.director.value.user) {
      return null
    }

    return (
      this.shareholdersOfCompany.value.find((s: Shareholder) => {
        return s.email === this.director.value.user?.email
      }) ?? null
    )
  }

  isShareholderOfCompany(): boolean {
    return this.shareholderOfCompany() !== null
  }

  isDocumentEditable(): boolean {
    if (this.isInPreviewMode.value) {
      return false
    }

    if (
      this.user.value.id !== this.director.value.userId &&
      this.user.value.email !== this.application.value.emailAddress
    ) {
      return false
    }

    return (
      StringUtil.isNullOrEmpty(this.application.value.signatureId) &&
      this.application.value.status !== StatusConstants.DRAFT
    )
  }

  setApplicationUserDetails(): void {
    this.setSignatureItem()

    nextTick(() => {
      this.application.value.name = this.name()
      this.application.value.nationality = this.nationality()
      this.application.value.race = this.race()
      this.application.value.residentialAddress = this.residentialAddress()
      this.application.value.identificationType = this.isIdentificationTypeNRIC() ? "ic" : "passport"
      this.application.value.identificationNumber = this.identificationNumber()
      this.application.value.dateOfBirth = this.isDocumentEditable()
        ? this.dayjs(this.dateOfBirth()).format("yyyy-mm-dd")
        : this.dateOfBirth()
      this.application.value.businessAddress = this.businessAddress()
      this.application.value.businessOccupation = this.businessOccupation()
      this.application.value.emailAddress = this.emailAddress()

      if (this.application.value.disclosureOfInterests.length <= 0) {
        this.addDisclosure()
        this.addDisclosure()
      }

      if (this.application.value.disclosureOfInterests.length < 2) {
        this.addDisclosure()
      }

      if (this.application.value.propertiesPossessed.length <= 0) {
        this.addProperties()
        this.addProperties()
      }

      if (this.application.value.propertiesPossessed.length < 2) {
        this.addProperties()
      }
    })
  }

  addDisclosure(): void {
    this.application.value.disclosureOfInterests.push(new DirectorDeclarationConflictOfInterestDisclosure())
  }

  canRemoveDisclosure(index: number): boolean {
    return this.isDocumentEditable() && index > 0 && index === this.application.value.disclosureOfInterests.length - 1
  }

  removeDisclosure(): void {
    if (this.application.value.disclosureOfInterests.length <= 1) {
      return
    }

    this.application.value.disclosureOfInterests.pop()
  }

  addProperties(): void {
    this.application.value.propertiesPossessed.push(new DirectorDeclarationConflictOfInterestProperty())
  }

  canRemoveProperties(index: number): boolean {
    return this.isDocumentEditable() && index > 0 && index === this.application.value.propertiesPossessed.length - 1
  }

  removeProperties(): void {
    if (this.application.value.propertiesPossessed.length <= 1) {
      return
    }

    this.application.value.propertiesPossessed.pop()
  }

  setSignatureItem(): void {
    let signatureUrl = this.application.value.signature?.url ?? null
    this.signatureItem.value = new SignatureItem(
      signatureUrl,
      signatureUrl !== null,
      this.isDocumentEditable(),
      false,
      this.name(),
      this.emailAddress(),
      "Director",
      false
    )
  }

  // Document Content
  registrationNumber(): string {
    return `${this.company.value.registrationNumberNew} (${this.company.value.registrationNumberOld})`
  }

  name(): string {
    if (!StringUtil.isNullOrEmpty(this.application.value.name)) {
      return this.application.value.name
    }

    if (!this.director.value.user) {
      return "-"
    }

    return this.director.value.user.name
  }

  nationality(): string {
    if (!StringUtil.isNullOrEmpty(this.application.value.nationality)) {
      return this.application.value.nationality
    }

    if (!this.director.value.user || !this.director.value.user.detail) {
      return "-"
    }

    let detail = this.director.value.user.detail
    let nationality = detail.citizenship

    return nationality
  }

  race(): string {
    if (!StringUtil.isNullOrEmpty(this.application.value.race)) {
      return this.application.value.race
    }

    if (!this.director.value.user || !this.director.value.user.detail) {
      return "-"
    }

    let detail = this.director.value.user.detail

    return StringUtil.isNullOrEmpty(detail.race) || detail.race === "others" ? detail.customRace : detail.race
  }

  nationalityRace(): string {
    if (!StringUtil.isNullOrEmpty(this.application.value.nationality)) {
      let nationality = this.application.value.nationality
      if (!nationality.includes("malaysia")) {
        return nationality
      }

      return `${nationality} / ${this.application.value.race}`
    }

    if (!this.director.value.user || !this.director.value.user.detail) {
      return "-"
    }

    let detail = this.director.value.user.detail
    let nationality = detail.citizenship
    if (!nationality.includes("malaysia")) {
      return nationality
    }

    let race = StringUtil.isNullOrEmpty(detail.race) || detail.race === "others" ? detail.customRace : detail.race

    return `${nationality} / ${race}`
  }

  residentialAddress(): string {
    if (!StringUtil.isNullOrEmpty(this.application.value.residentialAddress)) {
      return this.application.value.residentialAddress
    }

    if (!this.director.value.user || !this.director.value.user.detail) {
      return "-"
    }

    let detail = this.director.value.user.detail
    let address = detail.location
    if (!address) {
      return "-"
    }

    return address?.getOnelineAddress() ?? "-"
  }

  isIdentificationTypeNRIC(): boolean {
    if (!StringUtil.isNullOrEmpty(this.application.value.id)) {
      return this.application.value.identificationType === "ic"
    }

    if (!this.director.value.user || !this.director.value.user.detail) {
      return false
    }

    return this.director.value.user.detail.identificationType === "ic"
  }

  identificationNumber(): string {
    if (!StringUtil.isNullOrEmpty(this.application.value.identificationNumber)) {
      return this.application.value.identificationNumber
    }

    if (!this.director.value.user || !this.director.value.user.detail) {
      return "-"
    }

    let identification = this.director.value.user.detail.identification
    if (!this.isIdentificationTypeNRIC()) {
      return identification
    }

    return `${identification.substring(0, 6)}-${identification.substring(6, 8)}-${identification.substring(8)}`
  }

  dateOfBirth(): string {
    if (!StringUtil.isNullOrEmpty(this.application.value.dateOfBirth)) {
      let dayjs = useDayjs()
      return dayjs(this.application.value.dateOfBirth).format("D MMMM YYYY")
    }

    if (!this.isIdentificationTypeNRIC()) {
      return ""
    }

    let identification = this.identificationNumber()
    if (identification === "-") {
      return ""
    }

    let currentYear = this.dayjs().year()
    let firstTwoNumber = currentYear.toString().substring(0, 2)
    let yearOfBirthString = `${firstTwoNumber}${identification.substring(0, 2)}`
    let yearOfBirth = parseInt(yearOfBirthString)
    if (yearOfBirth > currentYear) {
      yearOfBirth = yearOfBirth - 100
    }

    let birthMonth = identification.substring(2, 4)
    let birthDate = identification.substring(4, 2)

    return this.time.formatDateOnlyFull(`${yearOfBirth}-${birthMonth}-${birthDate}`)
  }

  passportExpiryDate(): string {
    if (StringUtil.isNullOrEmpty(this.application.value.id)) {
      return "-"
    }

    if (!this.isIdentificationTypeNRIC()) {
      return "-"
    }

    let dayjs = useDayjs()
    return dayjs(this.application.value.passportExpiryDate).format("D MMMM YYYY")
  }

  businessOccupation(): string {
    if (!StringUtil.isNullOrEmpty(this.application.value.businessOccupation)) {
      return this.application.value.businessOccupation
    }

    return "Director"
  }

  businessAddress(): string {
    if (!StringUtil.isNullOrEmpty(this.application.value.businessAddress)) {
      return this.application.value.businessAddress
    }

    if (!this.company.value.businessAddressLocation) {
      return "-"
    }

    return this.company.value.businessAddressLocation?.getMultilineAddress()
  }

  emailAddress(): string {
    if (!StringUtil.isNullOrEmpty(this.application.value.emailAddress)) {
      return this.application.value.emailAddress
    }

    return this.director.value.user?.email ?? "-"
  }

  dateOfAppointment(): string {
    if (!this.director.value.dateAppointed) {
      return ""
    }

    return this.time.formatDateOnlyFull(this.director.value.dateAppointed)
  }

  sharesRegisteredAsBeneficialOwner(): string {
    let shareholder = this.shareholderOfCompany()
    if (!shareholder) {
      return "-"
    }

    if (shareholder.type === ShareholdingType.Representative) {
      return "-"
    }

    return NumberUtil.thousandSeparator(shareholder.ordinaryShares)
  }

  sharesRegisteredAsBeneficialOwnerOthers(): string {
    if (this.application.value.shareholdingInCompanyAtAppointment.noSharesAsBoUnderOthers <= 0) {
      return "-"
    }
    let noOfShares = NumberUtil.thousandSeparator(
      this.application.value.shareholdingInCompanyAtAppointment.noSharesAsBoUnderOthers
    )

    return `${noOfShares}<br>(${this.application.value.shareholdingInCompanyAtAppointment.nameOfSharesAsBoUnderOthers})`
  }

  sharesRegisteredAsNominee(): string {
    if (this.application.value.shareholdingInCompanyAtAppointment.noOfSharesAsNominee <= 0) {
      return "-"
    }
    let noOfShares = NumberUtil.thousandSeparator(
      this.application.value.shareholdingInCompanyAtAppointment.noOfSharesAsNominee
    )

    return `${noOfShares}<br>(${this.application.value.shareholdingInCompanyAtAppointment.nameOfSharesAsNominee})`
  }

  sharesHeldByCorporation(): string {
    let shareholder = this.shareholderOfCompany()
    if (!shareholder) {
      return "-"
    }

    if (shareholder.type === ShareholdingType.Individual) {
      return "-"
    }

    return NumberUtil.thousandSeparator(shareholder.ordinaryShares)
  }

  nameOfCorporation(): string {
    let shareholder = this.shareholderOfCompany()
    if (!shareholder) {
      return ""
    }

    if (shareholder.type === ShareholdingType.Individual) {
      return ""
    }

    return `<br>(${shareholder.company?.getFullName() ?? ""})`
  }

  sharesInRelatedCompanyAsBO(): string {
    if (this.application.value.shareholdingInRelatedCompanyAtAppointment.noSharesAsBoUnderName <= 0) {
      return "-"
    }
    return NumberUtil.thousandSeparator(
      this.application.value.shareholdingInRelatedCompanyAtAppointment.noSharesAsBoUnderName
    )
  }

  sharesInRelatedCompanyAsBOOthers(): string {
    if (this.application.value.shareholdingInRelatedCompanyAtAppointment.noSharesAsBoUnderOthers <= 0) {
      return "-"
    }
    let noOfShares = NumberUtil.thousandSeparator(
      this.application.value.shareholdingInRelatedCompanyAtAppointment.noSharesAsBoUnderOthers
    )

    return `${noOfShares}<br>(${this.application.value.shareholdingInRelatedCompanyAtAppointment.nameOfSharesAsBoUnderOthers})`
  }

  sharesInRelatedCompanyAsNominee(): string {
    if (this.application.value.shareholdingInRelatedCompanyAtAppointment.noOfSharesAsNominee <= 0) {
      return "-"
    }
    let noOfShares = NumberUtil.thousandSeparator(
      this.application.value.shareholdingInRelatedCompanyAtAppointment.noOfSharesAsNominee
    )

    return `${noOfShares}<br>(${this.application.value.shareholdingInRelatedCompanyAtAppointment.nameOfSharesAsNominee})`
  }

  sharesInRelatedCompanyHeldByCorporation(): string {
    if (this.application.value.shareholdingInRelatedCompanyAtAppointment.noOfSharesByCorporation <= 0) {
      return "-"
    }
    let noOfShares = NumberUtil.thousandSeparator(
      this.application.value.shareholdingInRelatedCompanyAtAppointment.noOfSharesByCorporation
    )

    return `${noOfShares}<br>(${this.application.value.shareholdingInRelatedCompanyAtAppointment.nameOfSharesByCorporation})`
  }

  dateOfTransactionForSharesInCompanyFurtherAcquired(): string {
    if (StringUtil.isNullOrEmpty(this.application.value.shareholdingInCompanyFurtherAcquired.dateOfTransaction)) {
      return "-"
    }

    return this.time.formatDateOnlyFull(
      this.application.value.shareholdingInCompanyFurtherAcquired.dateOfTransaction ?? ""
    )
  }

  priceOrOtherConsiderationForSharesInCompanyFurtherAcquired(): string {
    if (this.application.value.shareholdingInCompanyFurtherAcquired.priceOrOtherConsideration === null) {
      return "-"
    }

    return NumberUtil.thousandSeparator(
      this.application.value.shareholdingInCompanyFurtherAcquired.priceOrOtherConsideration
    )
  }

  sharesInCompanyFurtherAcquiredAsBO(): string {
    if (this.application.value.shareholdingInCompanyFurtherAcquired.noSharesAsBoUnderName <= 0) {
      return "-"
    }
    return NumberUtil.thousandSeparator(
      this.application.value.shareholdingInCompanyFurtherAcquired.noSharesAsBoUnderName
    )
  }

  sharesInCompanyFurtherAcquiredAsBOOthers(): string {
    if (this.application.value.shareholdingInCompanyFurtherAcquired.noSharesAsBoUnderOthers <= 0) {
      return "-"
    }
    let noOfShares = NumberUtil.thousandSeparator(
      this.application.value.shareholdingInCompanyFurtherAcquired.noSharesAsBoUnderOthers
    )

    return `${noOfShares}<br>(${this.application.value.shareholdingInCompanyFurtherAcquired.nameOfSharesAsBoUnderOthers})`
  }

  sharesInCompanyFurtherAcquiredAsNominee(): string {
    if (this.application.value.shareholdingInCompanyFurtherAcquired.noOfSharesAsNominee <= 0) {
      return "-"
    }
    let noOfShares = NumberUtil.thousandSeparator(
      this.application.value.shareholdingInCompanyFurtherAcquired.noOfSharesAsNominee
    )

    return `${noOfShares}<br>(${this.application.value.shareholdingInCompanyFurtherAcquired.nameOfSharesAsNominee})`
  }

  sharesInCompanyFurtherAcquiredHeldByCorporation(): string {
    if (this.application.value.shareholdingInCompanyFurtherAcquired.noOfSharesByCorporation <= 0) {
      return "-"
    }
    let noOfShares = NumberUtil.thousandSeparator(
      this.application.value.shareholdingInCompanyFurtherAcquired.noOfSharesByCorporation
    )

    return `${noOfShares}<br>(${this.application.value.shareholdingInCompanyFurtherAcquired.nameOfSharesByCorporation})`
  }

  dateOfTransactionForSharesInRelatedCompanyFurtherAcquired(): string {
    if (
      StringUtil.isNullOrEmpty(this.application.value.shareholdingInRelatedCompanyFurtherAcquired.dateOfTransaction)
    ) {
      return "-"
    }

    return this.time.formatDateOnlyFull(
      this.application.value.shareholdingInRelatedCompanyFurtherAcquired.dateOfTransaction ?? ""
    )
  }

  priceOrOtherConsiderationForSharesInRelatedCompanyFurtherAcquired(): string {
    if (this.application.value.shareholdingInRelatedCompanyFurtherAcquired.priceOrOtherConsideration === null) {
      return "-"
    }

    return NumberUtil.thousandSeparator(
      this.application.value.shareholdingInRelatedCompanyFurtherAcquired.priceOrOtherConsideration
    )
  }

  sharesInRelatedCompanyFurtherAcquiredAsBO(): string {
    if (this.application.value.shareholdingInRelatedCompanyFurtherAcquired.noSharesAsBoUnderName <= 0) {
      return "-"
    }
    return NumberUtil.thousandSeparator(
      this.application.value.shareholdingInRelatedCompanyFurtherAcquired.noSharesAsBoUnderName
    )
  }

  sharesInRelatedCompanyFurtherAcquiredAsBOOthers(): string {
    if (this.application.value.shareholdingInRelatedCompanyFurtherAcquired.noSharesAsBoUnderOthers <= 0) {
      return "-"
    }
    let noOfShares = NumberUtil.thousandSeparator(
      this.application.value.shareholdingInRelatedCompanyFurtherAcquired.noSharesAsBoUnderOthers
    )

    return `${noOfShares}<br>(${this.application.value.shareholdingInRelatedCompanyFurtherAcquired.nameOfSharesAsBoUnderOthers})`
  }

  sharesInRelatedCompanyFurtherAcquiredAsNominee(): string {
    if (this.application.value.shareholdingInRelatedCompanyFurtherAcquired.noOfSharesAsNominee <= 0) {
      return "-"
    }
    let noOfShares = NumberUtil.thousandSeparator(
      this.application.value.shareholdingInRelatedCompanyFurtherAcquired.noOfSharesAsNominee
    )

    return `${noOfShares}<br>(${this.application.value.shareholdingInRelatedCompanyFurtherAcquired.nameOfSharesAsNominee})`
  }

  sharesInRelatedCompanyFurtherAcquiredHeldByCorporation(): string {
    if (this.application.value.shareholdingInRelatedCompanyFurtherAcquired.noOfSharesByCorporation <= 0) {
      return "-"
    }
    let noOfShares = NumberUtil.thousandSeparator(
      this.application.value.shareholdingInRelatedCompanyFurtherAcquired.noOfSharesByCorporation
    )

    return `${noOfShares}<br>(${this.application.value.shareholdingInRelatedCompanyFurtherAcquired.nameOfSharesByCorporation})`
  }

  dateOfTransactionForSharesInCompanyDisposed(): string {
    if (StringUtil.isNullOrEmpty(this.application.value.shareholdingInCompanyDisposed.dateOfTransaction)) {
      return "-"
    }

    return this.time.formatDateOnlyFull(this.application.value.shareholdingInCompanyDisposed.dateOfTransaction ?? "")
  }

  priceOrOtherConsiderationForSharesInCompanyDisposed(): string {
    if (this.application.value.shareholdingInCompanyDisposed.priceOrOtherConsideration === null) {
      return "-"
    }

    return NumberUtil.thousandSeparator(this.application.value.shareholdingInCompanyDisposed.priceOrOtherConsideration)
  }

  sharesInCompanyDisposedAsBO(): string {
    if (this.application.value.shareholdingInCompanyDisposed.noSharesAsBoUnderName <= 0) {
      return "-"
    }
    return NumberUtil.thousandSeparator(this.application.value.shareholdingInCompanyDisposed.noSharesAsBoUnderName)
  }

  sharesInCompanyDisposedAsBOOthers(): string {
    if (this.application.value.shareholdingInCompanyDisposed.noSharesAsBoUnderOthers <= 0) {
      return "-"
    }
    let noOfShares = NumberUtil.thousandSeparator(
      this.application.value.shareholdingInCompanyDisposed.noSharesAsBoUnderOthers
    )

    return `${noOfShares}<br>(${this.application.value.shareholdingInCompanyDisposed.nameOfSharesAsBoUnderOthers})`
  }

  sharesInCompanyDisposedAsNominee(): string {
    if (this.application.value.shareholdingInCompanyDisposed.noOfSharesAsNominee <= 0) {
      return "-"
    }
    let noOfShares = NumberUtil.thousandSeparator(
      this.application.value.shareholdingInCompanyDisposed.noOfSharesAsNominee
    )

    return `${noOfShares}<br>(${this.application.value.shareholdingInCompanyDisposed.nameOfSharesAsNominee})`
  }

  sharesInCompanyDisposedHeldByCorporation(): string {
    if (this.application.value.shareholdingInCompanyDisposed.noOfSharesByCorporation <= 0) {
      return "-"
    }
    let noOfShares = NumberUtil.thousandSeparator(
      this.application.value.shareholdingInCompanyDisposed.noOfSharesByCorporation
    )

    return `${noOfShares}<br>(${this.application.value.shareholdingInCompanyDisposed.nameOfSharesByCorporation})`
  }

  dateOfTransactionForSharesInRelatedCompanyDisposed(): string {
    if (StringUtil.isNullOrEmpty(this.application.value.shareholdingInRelatedCompanyDisposed.dateOfTransaction)) {
      return "-"
    }

    return this.time.formatDateOnlyFull(
      this.application.value.shareholdingInRelatedCompanyDisposed.dateOfTransaction ?? ""
    )
  }

  priceOrOtherConsiderationForSharesInRelatedCompanyDisposed(): string {
    if (this.application.value.shareholdingInRelatedCompanyDisposed.priceOrOtherConsideration === null) {
      return "-"
    }

    return NumberUtil.thousandSeparator(
      this.application.value.shareholdingInRelatedCompanyDisposed.priceOrOtherConsideration
    )
  }

  sharesInRelatedCompanyDisposedAsBO(): string {
    if (this.application.value.shareholdingInRelatedCompanyDisposed.noSharesAsBoUnderName <= 0) {
      return "-"
    }
    return NumberUtil.thousandSeparator(
      this.application.value.shareholdingInRelatedCompanyDisposed.noSharesAsBoUnderName
    )
  }

  sharesInRelatedCompanyDisposedAsBOOthers(): string {
    if (this.application.value.shareholdingInRelatedCompanyDisposed.noSharesAsBoUnderOthers <= 0) {
      return "-"
    }
    let noOfShares = NumberUtil.thousandSeparator(
      this.application.value.shareholdingInRelatedCompanyDisposed.noSharesAsBoUnderOthers
    )

    return `${noOfShares}<br>(${this.application.value.shareholdingInRelatedCompanyDisposed.nameOfSharesAsBoUnderOthers})`
  }

  sharesInRelatedCompanyDisposedAsNominee(): string {
    if (this.application.value.shareholdingInRelatedCompanyDisposed.noOfSharesAsNominee <= 0) {
      return "-"
    }
    let noOfShares = NumberUtil.thousandSeparator(
      this.application.value.shareholdingInRelatedCompanyDisposed.noOfSharesAsNominee
    )

    return `${noOfShares}<br>(${this.application.value.shareholdingInRelatedCompanyDisposed.nameOfSharesAsNominee})`
  }

  sharesInRelatedCompanyDisposedHeldByCorporation(): string {
    if (this.application.value.shareholdingInRelatedCompanyDisposed.noOfSharesByCorporation <= 0) {
      return "-"
    }
    let noOfShares = NumberUtil.thousandSeparator(
      this.application.value.shareholdingInRelatedCompanyDisposed.noOfSharesByCorporation
    )

    return `${noOfShares}<br>(${this.application.value.shareholdingInRelatedCompanyDisposed.nameOfSharesByCorporation})`
  }

  getApplicationData(): DirectorDeclarationConflictOfInterest {
    return new DirectorDeclarationConflictOfInterest(this.application.value)
  }
}
