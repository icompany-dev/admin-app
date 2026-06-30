import { CompanyBankAccountOpening } from "~/scripts/models/CompanyBankAccountOpening"
import { ResolutionController } from "./ResolutionController"
import { DocumentTemplate } from "~/scripts/models/DocumentTemplate"
import { StringUtil } from "~/scripts/utils/String"
import { Company } from "~/scripts/models/Company"
import { BankBranch } from "~/scripts/models/BankBranch"
import { Bank } from "~/scripts/models/Bank"
import { Error } from "~/scripts/library/Error"
import { ObjectUtil } from "~/scripts/utils/Object"
import { Director } from "~/scripts/models/Director"
import { CompanyBankSignatory } from "~/scripts/models/CompanyBankSignatory"
import type { User } from "~/scripts/models/User"
import { OnlineBanking } from "~/scripts/types/banks/OnlineBanking"
import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { PropsResolution } from "~/scripts/props/PropsResolution"
import type { SignatureItem } from "~/scripts/types/SignatureItem"
import { BankConstants } from "~/scripts/constants/Banks"
import { AffinBankApplicationDetails } from "~/scripts/types/banks/AffinBankApplicationDetails"
import { SecretaryInformation } from "~/scripts/constants/SecretaryInformation"

export class DcrBankAccountOpeningAffinBankController extends ResolutionController<CompanyBankAccountOpening> {
  companyBankAccountOpeningRepository = useCompanyBankAccountOpeningStore()
  companyRepository = useCompanyStore()
  documentTemplateRepository = useDocumentTemplateStore()
  bankRepository = useBankStore()

  directors = ref<Director[]>([])
  directorUsers = ref<User[]>([])
  signatories = ref<CompanyBankSignatory[]>([])

  documentTemplate = ref<DocumentTemplate>(new DocumentTemplate())
  resolutionContent = ref<string>("")
  originalContent = ref<string>("")

  bankId: string = BankConstants.AFFIN_BANK_DETAIL.id

  company: Ref<Company> = ref<Company>(new Company())
  bank = ref<Bank>(new Bank())
  bankBranches = ref<BankBranch[]>([])

  bankBranchSearchText = ref<string>("")
  showBranchOption = ref<boolean>(false)

  // Editable fields
  selectedBranchId = ref<string>("")
  onlineAccessPersons: Ref<OnlineBanking[]> = ref<OnlineBanking[]>([])

  time = useLocalTime()

  additionalCssClass: string = "dcr-affin-bank"

  nonDirectorBankSignatoryRef: any | null = null

  affinBankApplicationDetails = ref<AffinBankApplicationDetails>(new AffinBankApplicationDetails())

  signaturePlaceholders: Ref<string[]> = ref<string[]>([])

  constructor(props: IPropsResolutionDocument<CompanyBankAccountOpening>, emitEvents: any | null) {
    super(
      props.companyId,
      props.applicationId,
      props.application,
      CompanyBankAccountOpening,
      props.isInPreviewMode,
      true,
      false,
      props.showWatermark,
      props.watermarkText,
      emitEvents
    )
  }

  setNonDirectorBankSignatoryRef(nonDirectorBankSignatoryRef: any): void {
    this.nonDirectorBankSignatoryRef = nonDirectorBankSignatoryRef
  }

  async otherDataInitiation(): Promise<void> {
    await Promise.all([this.fetchCompany(), this.fetchBank(), this.fetchDirectors()])
  }

  async fetchDirectors(): Promise<void> {
    try {
      let response = await this.directorRepository.fetchAllForCompany(this.companyId.value)

      this.directors.value = response.map((d: Director) => {
        return new Director(d)
      })

      for (let i = 0; i < this.directors.value.length; i++) {
        let director = this.directors.value[i]
        let user = await director.getRegisteredUser(useUserStore())
        if (!user) {
          continue
        }
        this.directorUsers.value.push(user)
      }
    } catch (e) {
      console.error("Failed to fetch directors:", e)
    }
  }

  async fetchCompany(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId.value)) {
      return
    }

    try {
      let response = await this.companyRepository.fetch(this.companyId.value)
      if (this.companyRepository.error !== null) {
        throw this.companyRepository.error
      }

      this.company.value = new Company(response)
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error: Error = new Error(
          Error.ERROR_TYPE_API,
          "Unable to fetch details of company. Please refresh the page and try again."
        )
        error.handle()
      }
    }
  }

  async fetchBank(): Promise<void> {
    try {
      let response = await this.bankRepository.fetch(this.bankId)
      if (!this.bankRepository.error && response) {
        this.bank.value = new Bank(response)
        if (this.application.value) {
          this.application.value.bank = this.bank.value
        }

        this.bankBranches.value = this.bank.value.branches.map((b: BankBranch) => {
          return new BankBranch(b)
        })

        this.bankBranches.value = ObjectUtil.sort<BankBranch>(this.bankBranches.value, "stateId", "asc")
      }
    } catch (e) {
      console.error("Failed to fetch bank:", e)
    }
  }

  async fetchApplication(id: string): Promise<void> {
    let response = await this.companyBankAccountOpeningRepository.fetch(id)
    if (!this.companyBankAccountOpeningRepository.error && response !== null) {
      this.application.value = new CompanyBankAccountOpening(response)
      let companyRepository = useCompanyStore()
      let companyResponse = await companyRepository.fetch(this.application.value.companyId)
      this.application.value.company = new Company(companyResponse)
      this.selectedBranchId.value = this.application.value.bankBranchId
      this.affinBankApplicationDetails.value = new AffinBankApplicationDetails(
        this.application.value.affinBankApplicationDetails
      )
      this.initializeData()
    }
  }

  async setApplication(): Promise<void> {
    if (this.application.value && !StringUtil.isNullOrEmpty(this.application.value.id)) {
      return
    }

    let response = await this.companyRepository.fetch(this.companyId.value)
    let company = new Company(response)
    if (!this.companyRepository.error) {
      this.application.value = new CompanyBankAccountOpening()
      this.application.value.companyId = this.companyId.value
      this.application.value.company = new Company(company)
      this.application.value.bankId = this.bankId
      // Set bank on application if already fetched
      if (this.bank.value?.id) {
        this.application.value.bank = this.bank.value
      }
      this.initializeData()
    }
  }

  updateMaxSignatureOnFirstPage(): void {
    this.maxSignatureOnFirstPage.value = 2

    const totalRows = this.signatories.value.length + this.onlineAccessPersons.value.length
    if (totalRows >= 4) {
      this.maxSignatureOnFirstPage.value = 0
    }
  }

  async fetchDocumentTemplate(): Promise<void> {
    // do nothing
  }

  setContent(): void {
    if (!this.application.value) {
      return
    }

    if (this.application.value.signatories.length > 0) {
      this.signatories.value = this.application.value.signatories.map((cbs: CompanyBankSignatory) => {
        return new CompanyBankSignatory(cbs)
      })
    } else {
      this.signatories.value = this.directorUsers.value.map((d: User) => {
        let newSignatory = new CompanyBankSignatory()
        newSignatory.name = d.name
        newSignatory.role = "maker"
        newSignatory.designation = d.detail?.gender === "male" ? "Mr" : "Mrs"
        newSignatory.identification = d.detail?.identification ?? ""
        newSignatory.type = d.detail?.identificationType ?? ""

        return newSignatory
      })
    }

    if (this.application.value.onlineBanking.length > 0) {
      this.onlineAccessPersons.value = this.application.value.onlineBanking.map((ob: OnlineBanking) => {
        return new OnlineBanking(ob)
      })
    } else {
      this.onlineAccessPersons.value = this.directorUsers.value.map((d: User) => {
        let newOnlineBanking = new OnlineBanking()
        newOnlineBanking.name = d.name
        newOnlineBanking.role = "maker"
        newOnlineBanking.designation = d.detail?.gender === "male" ? "Mr" : "Mrs"
        newOnlineBanking.identification = d.detail?.identification ?? ""

        return newOnlineBanking
      })
    }

    if (this.affinBankApplicationDetails.value.systemAdministratorApprovers.length <= 0) {
      let administrator = new OnlineBanking()
      administrator.role = "system-administrator"

      let approver = new OnlineBanking()
      approver.role = "system-approver"

      this.affinBankApplicationDetails.value.systemAdministratorApprovers.push(administrator)
      this.affinBankApplicationDetails.value.systemAdministratorApprovers.push(approver)
    }

    this.signaturePlaceholders.value = this.directors.value.map((d: Director) => {
      return d.name
    })
    this.signaturePlaceholders.value.splice(1, 0, SecretaryInformation.SECRETARY_NAME)
    this.signaturePlaceholders.value.splice(2, 0, "Company Stamp")
  }

  getContent(): string {
    // do nothing
    return ""
  }

  totalPages(): number {
    if (this.directorRepository.isLoading || this.signatureItems.value.length <= 0) {
      return 1
    }

    return (
      this.signatureStartOnPage.value +
      Math.ceil(
        (this.signatureItems.value.length - this.maxSignatureOnFirstPage.value) / this.maxSignatureOnOtherPages.value
      )
    )
  }

  override async updateApplicationContent(updatedApplicationData: CompanyBankAccountOpening): Promise<void> {
    if (!this.application.value) {
      this.application.value = new CompanyBankAccountOpening()
    }

    this.application.value.cloneDetails(updatedApplicationData)
    this.setContent()
    await this.getPersonsToSign()
  }

  // Handler
  onBranchSelected(selectedBranchId: string): void {
    this.selectedBranchId.value = selectedBranchId

    this.emitEvents("updated")
  }

  onSignatoryTypeClicked(type: string): void {
    if (!this.application.value || !this.isDocumentEditable()) {
      return
    }

    this.application.value.signatoryType = type

    this.emitEvents("updated")
  }

  isSignatoryTypeSelected(type: string): boolean {
    if (!this.application.value) {
      return false
    }

    return this.application.value.signatoryType === type
  }

  directorDataListForSignatories(index: number): string[] {
    let selectedNames = this.signatories.value
      .filter((s: CompanyBankSignatory, i: number) => {
        return i !== index && !StringUtil.isNullOrEmpty(s.name)
      })
      .map((d: CompanyBankSignatory) => {
        return d.name
      })

    let directorNames = this.directors.value
      .filter((d: Director) => {
        return !selectedNames.includes(d.name)
      })
      .map((d: Director) => {
        return d.name
      })

    return directorNames
  }

  onSignatoryDesignationClicked(signatory: CompanyBankSignatory, value: string): void {
    signatory.designation = value
    this.onSignatoryUpdated()
  }

  isSignatoryDesignation(signatory: CompanyBankSignatory, value: string): boolean {
    return signatory.designation === value
  }

  onAddMoreSignatoryClicked(): void {
    if (this.nonDirectorBankSignatoryRef) {
      this.nonDirectorBankSignatoryRef.show()
      return
    }

    this.onAddMoreSignatory()
  }

  onAddMoreSignatory(): void {
    this.signatories.value.push(new CompanyBankSignatory())
  }

  onRemoveSignatory(index: number): void {
    this.signatories.value.splice(index, 1)

    this.onSignatoryUpdated()
  }

  onSignatoryNameUpdated(signatory: CompanyBankSignatory): void {
    let matchedDirector = this.directors.value.find((d: Director) => {
      return d.name === signatory.name
    })

    if (!matchedDirector) {
      signatory.nationality = ""
      signatory.designation = ""
      signatory.email = ""
      signatory.phone = ""
      signatory.type = ""
      signatory.identification = ""
      signatory.role = "maker"

      this.onSignatoryUpdated()

      return
    }

    signatory.nationality = matchedDirector.identificationType === "ic" ? "Malaysian" : ""
    signatory.designation = "Director"
    signatory.email = matchedDirector.email
    signatory.phone = matchedDirector.phone
    signatory.type = matchedDirector.identificationType
    signatory.identification = matchedDirector.identification
    signatory.role = "maker"

    this.onSignatoryUpdated()
  }

  onSignatoryUpdated(): void {
    if (!this.application.value) {
      return
    }

    this.application.value.signatories = this.signatories.value.map((cbs: CompanyBankSignatory) => {
      return new CompanyBankSignatory(cbs)
    })

    this.emitEvents("updated")
  }

  directorDataListforOnlineBanking(index: number): string[] {
    let selectedNames = this.onlineAccessPersons.value
      .filter((s: OnlineBanking, i: number) => {
        return i !== index && !StringUtil.isNullOrEmpty(s.name)
      })
      .map((d: OnlineBanking) => {
        return d.name
      })

    let directorNames = this.directors.value
      .filter((d: Director) => {
        return !selectedNames.includes(d.name)
      })
      .map((d: Director) => {
        return d.name
      })

    return directorNames
  }

  onOnlineBankingDesignationClicked(onlineBanking: OnlineBanking, value: string): void {
    onlineBanking.designation = value
    this.onOnlineBankingUpdated()
  }

  isOnlineBankingDesignation(onlineBanking: OnlineBanking, value: string): boolean {
    return onlineBanking.designation === value
  }

  onAddMoreOnlineBanking(): void {
    this.onlineAccessPersons.value.push(new OnlineBanking())
  }

  onRemoveOnlineBanking(index: number): void {
    this.onlineAccessPersons.value.splice(index, 1)

    this.onOnlineBankingUpdated()
  }

  onOnlineBankingNameUpdated(onlineBanking: OnlineBanking): void {
    let matchedDirector = this.directors.value.find((d: Director) => {
      return d.name === onlineBanking.name
    })

    if (!matchedDirector) {
      onlineBanking.designation = ""
      onlineBanking.identification = ""
      onlineBanking.role = "maker"

      this.onOnlineBankingUpdated()

      return
    }

    onlineBanking.designation = "Director"
    onlineBanking.role = "maker"
    onlineBanking.identification = matchedDirector.identification ?? ""

    this.onOnlineBankingUpdated()
  }

  onOnlineBankingUpdated(): void {
    if (!this.application.value) {
      return
    }

    this.application.value.onlineBanking = this.onlineAccessPersons.value.map((cbs: OnlineBanking) => {
      return new OnlineBanking(cbs)
    })

    this.emitEvents("updated")
  }

  onAddSystemAdministratorApprover(): void {
    let newSystemAdministratorApprovers = new OnlineBanking()
    newSystemAdministratorApprovers.role = "system-administrator"

    this.affinBankApplicationDetails.value.systemAdministratorApprovers.push(newSystemAdministratorApprovers)
  }

  onRemoveSystemAdministratorApprover(index: number): void {
    this.affinBankApplicationDetails.value.systemAdministratorApprovers.splice(index, 1)
    this.onAdministratorApproverUpdated()
  }

  onAdministratorApproverNameUpdated(adminApprover: OnlineBanking): void {
    let matchedDirector = this.directors.value.find((d: Director) => {
      return d.name === adminApprover.name
    })

    if (!matchedDirector) {
      adminApprover.identification = ""

      this.onOnlineBankingUpdated()

      return
    }

    adminApprover.identification = matchedDirector.identification ?? ""

    this.onOnlineBankingUpdated()
  }

  onAdministratorApproverUpdated(): void {
    if (!this.application.value) {
      return
    }

    this.application.value.affinBankApplicationDetails = new AffinBankApplicationDetails(
      this.affinBankApplicationDetails.value
    )

    this.emitEvents("updated")
  }

  onCurrentBankingSignatoryTypeClicked(type: string): void {
    this.affinBankApplicationDetails.value.currentBankingSignatoryType = type
    if (type !== "others") {
      this.affinBankApplicationDetails.value.currentBankingSignatoryTypeOther = ""
    }

    this.emitEvents("updated")
  }

  isCurrentBankingSignatoryType(type: string): boolean {
    return this.affinBankApplicationDetails.value.currentBankingSignatoryType === type
  }

  onOnlineBankingSignatoryTypeClicked(type: string): void {
    this.affinBankApplicationDetails.value.onlineBankingSignatoryType = type
    if (type !== "others") {
      this.affinBankApplicationDetails.value.onlineBankingSignatoryTypeOther = ""
    }

    this.emitEvents("updated")
  }

  isOnlineBankingSignatoryType(type: string): boolean {
    return this.affinBankApplicationDetails.value.onlineBankingSignatoryType === type
  }

  getSignaturesOnPage(page: number): string[] {
    if (page === this.firstPageSignature) {
      return this.signaturePlaceholders.value.slice(0, this.numberSignaturesOnFirstPage)
    }

    let skip = (page - (this.firstPageSignature + 1)) * 18 + this.numberSignaturesOnFirstPage

    return this.signaturePlaceholders.value.slice(skip, 18)
  }

  getBranchId(): string {
    return this.selectedBranchId.value
  }

  getAuthorisedPersonsForOnlineBanking(): OnlineBanking[] {
    return this.onlineAccessPersons.value
  }

  getSignatoryType(): string {
    if (!this.application.value) {
      return ""
    }

    return this.application.value.signatoryType ?? ""
  }

  getSignatories(): CompanyBankSignatory[] {
    if (!this.application.value) {
      return []
    }

    return this.signatories.value || []
  }

  getOtherDetails(): any {
    if (!this.application.value) {
      return null
    }

    return this.affinBankApplicationDetails.value
  }

  get loaderLabel(): string {
    return "Preparing Your"
  }

  get loaderSublabel(): string {
    return "Resolution"
  }

  get resolutionPropsForBank() {
    this.signatureItems.value.forEach((si: SignatureItem) => {
      si.isSignatureEditable = false
    })

    return new PropsResolution(
      this.companyName(), //companyName
      this.registrationNumberOld(), //registrationNumberOld
      this.registrationNumberNew(), //registrationNumberNew
      this.resolutionTitle(), //resolutionTitle
      "", //resolutionName
      this.signatureTitle(), //signatureTitle
      this.signatureItems.value, //signatureItems
      this.resolutionDate(), //resolutionDate
      this.totalPages(), //totalPages
      this.signatureStartOnPage.value, //signatureStartOnPage
      this.maxSignatureOnFirstPage.value, //maxSignatureOnFirstPage
      this.maxSignatureOnOtherPages.value, //maxSignatureOnOtherPage
      this.hasAccompanyingDocument.value, //hasAccompanyingDocument
      this.isDcr.value, //isDcr
      this.showWatermark.value, //showWatermark
      this.watermarkText.value, //watermarkText
      [], //contentPages
      this.isUsingTemplate.value, //isUsingTemplate
      this.isLoading.value, //isLoading
      true,
      "Wet Ink Required"
    )
  }

  get authorisedSignatorySigningLimit(): string {
    if (this.isInPreviewMode.value) {
      return "Details of Signing Limit"
    }

    return this.affinBankApplicationDetails.value.authorisedSignatorySigningLimit
  }

  get onlineBankingSigningLimit(): string {
    if (this.isInPreviewMode.value) {
      return "Details of Signing Limit"
    }

    return this.affinBankApplicationDetails.value.onlineBankingSigningLimit
  }

  get isAdministratorDetailsOnPage2(): boolean {
    let totalSignatories = this.signatories.value.length + this.onlineAccessPersons.value.length

    if (totalSignatories <= 2) {
      return this.affinBankApplicationDetails.value.systemAdministratorApprovers.length <= 7
    }

    if (totalSignatories <= 4) {
      return this.affinBankApplicationDetails.value.systemAdministratorApprovers.length <= 2
    }

    totalSignatories = totalSignatories + this.affinBankApplicationDetails.value.systemAdministratorApprovers.length

    return totalSignatories <= 4
  }

  get firstPageSignature(): number {
    return this.affinBankApplicationDetails.value.systemAdministratorApprovers.length <= 3 ? 3 : 4
  }

  get numberOfSignatureRows(): number {
    return Math.ceil(this.signaturePlaceholders.value.length / 3)
  }

  get numberSignaturesOnFirstPage(): number {
    if (this.firstPageSignature === 4) {
      return 18
    }

    let totalRowsOnFirstPage = 2

    if (!this.isAdministratorDetailsOnPage2) {
      let totalRowsToLetGo = Math.ceil(this.affinBankApplicationDetails.value.systemAdministratorApprovers.length / 3)
      totalRowsOnFirstPage = totalRowsOnFirstPage - totalRowsToLetGo
    }

    let totalRows = Math.max(totalRowsOnFirstPage, 0)

    return totalRows * 3
  }

  get numberOfSignaturePages(): number {
    let totalRowsOnOnePage = 6
    let totalRowsOnFirstPage = 2

    if (!this.isAdministratorDetailsOnPage2) {
      let totalRowsToLetGo = Math.ceil(this.affinBankApplicationDetails.value.systemAdministratorApprovers.length / 3)
      totalRowsOnFirstPage = totalRowsOnFirstPage - totalRowsToLetGo
    }

    if (totalRowsOnFirstPage <= 0) {
      return Math.ceil(this.numberOfSignatureRows / totalRowsOnOnePage)
    }

    let remaining = this.numberOfSignatureRows - totalRowsOnFirstPage

    return Math.ceil(remaining / totalRowsOnOnePage) + 1
  }

  get otherSignaturePages(): number[] {
    if (this.numberOfSignaturePages <= 1 && this.firstPageSignature === 3) {
      return []
    }

    if (this.firstPageSignature === 4 && this.numberOfSignaturePages <= 1) {
      return [1]
    }

    return new Array(this.numberOfSignaturePages - 1)
  }

  get tagPositionForTransferLimit(): string {
    if (this.isAdministratorDetailsOnPage2) {
      return ""
    }

    let top = this.affinBankApplicationDetails.value.systemAdministratorApprovers.length * 29 + 350

    return `top: ${top}px;`
  }

  get tagPositionForAuthorisedSignatories(): string {
    let top = this.signatories.value.length * 61 + 200

    return `top: ${top}px;`
  }

  get tagPositionForAuthorisedOnlineBanking(): string {
    let top = this.signatories.value.length * 61 + 200 + this.onlineAccessPersons.value.length * 61 + 150

    return `top: ${top}px;`
  }

  get branchName(): string {
    if (!this.application.value || StringUtil.isNullOrEmpty(this.application.value.bankBranchId)) {
      return ""
    }

    return `${this.application.value.bankBranch.name} (${this.application.value.bankBranch.address.toUpperCase()})`
  }

  get signatoryTypeLabel(): string {
    if (!this.application.value) {
      return "Signatory Type"
    }

    if (this.application.value.signatoryType === "jointly") {
      return "jointly"
    }

    if (this.application.value.signatoryType === "any-two") {
      return "any two"
    }

    return "any requirements"
  }
}
