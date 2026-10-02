import { CompanyBankAccountOpening } from "~/scripts/models/CompanyBankAccountOpening"
import { ResolutionController } from "./ResolutionController"
import { DocumentTemplate } from "~/scripts/models/DocumentTemplate"
import { StringUtil } from "~/scripts/utils/String"
import { Company } from "~/scripts/models/Company"
import { BankBranch } from "~/scripts/models/BankBranch"
import { Bank } from "~/scripts/models/Bank"
import { Error } from "~/scripts/library/Error"
import { TemplateProcessor } from "~/scripts/library/TemplateProcessor"
import { ObjectUtil } from "~/scripts/utils/Object"
import { Director } from "~/scripts/models/Director"
import { CompanyBankSignatory } from "~/scripts/models/CompanyBankSignatory"
import type { User } from "~/scripts/models/User"
import { OnlineBanking } from "~/scripts/types/banks/OnlineBanking"
import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { PropsResolution } from "~/scripts/props/PropsResolution"
import type { SignatureItem } from "~/scripts/types/SignatureItem"
import { BankConstants } from "~/scripts/constants/Banks"
import { SecretaryInformation } from "~/scripts/constants/SecretaryInformation"
import type { State } from "~/scripts/models/Location"
import { OpenBankAccountResolutionController } from "./OpenBankAccountResolutionController"

export class DcrBankAccountOpeningCimbBankController extends OpenBankAccountResolutionController<CompanyBankAccountOpening> {
  companyBankAccountOpeningRepository = useCompanyBankAccountOpeningStore()
  companyRepository = useCompanyStore()
  documentTemplateRepository = useDocumentTemplateStore()
  bankRepository = useBankStore()

  private bankId: string = BankConstants.CIMB_DETAIL.id
  bank = ref<Bank>(new Bank())
  bankBranches = ref<BankBranch[]>([])

  directors = ref<Director[]>([])
  directorUsers = ref<User[]>([])
  signatories = ref<CompanyBankSignatory[]>([])

  selectedBranchId: Ref<string> = ref<string>("")
  onlineAccessPersons: Ref<OnlineBanking[]> = ref<OnlineBanking[]>([])

  signatoryPlaceholders = ref<CompanyBankSignatory[]>([])
  signaturePlaceholders = ref<string[]>([])

  isShowBranchOptions: Ref<boolean> = ref<boolean>(false)
  searchBranch: Ref<string> = ref<string>("")

  additionalCssClass: string = "cimb-application-form"

  nonDirectorBankSignatoryRef: any | null = null

  constructor(props: IPropsResolutionDocument<CompanyBankAccountOpening>, emitEvents: any | null) {
    super(
      props.companyId,
      props.application,
      CompanyBankAccountOpening,
      props.isInPreviewMode,
      props.showWatermark,
      props.watermarkText,
      emitEvents
    )

    this.isDcr.value = true
    // this.bankId.value = props.bankId

    this.signatureStartOnPage.value = 2
    this.maxSignatureOnFirstPage.value = 2
    this.maxSignatureOnOtherPages.value = 6

    this.getPersonsToSign()
  }

  setNonDirectorBankSignatoryRef(nonDirectorBankSignatoryRef: any): void {
    this.nonDirectorBankSignatoryRef = nonDirectorBankSignatoryRef
  }

  async fetchApplication(id: string): Promise<void> {
    let response = await this.companyBankAccountOpeningRepository.fetch(id)
    if (!this.companyBankAccountOpeningRepository.error && response !== null) {
      this.application.value = new CompanyBankAccountOpening(response)

      if (this.application.value.companyId === this.companyDataManager.companyId) {
        this.application.value.company = new Company(this.companyDataManager.company)
      } else {
        let companyRepository = useCompanyStore()
        let companyResponse = await companyRepository.fetch(this.application.value.companyId)
        this.application.value.company = new Company(companyResponse)
      }

      this.application.value.signatories.forEach((s: CompanyBankSignatory, index: number) => {
        this.signatoryPlaceholders.value[index] = s
      })

      if (this.application.value.paidAt !== this.application.value.updatedAt) {
        this.selectedBranchId.value = this.application.value.bankBranchId
      }

      this.initializeData()
    }
  }

  async setApplication(): Promise<void> {
    if (this.application.value && !StringUtil.isNullOrEmpty(this.application.value.id)) {
      return
    }

    this.application.value = new CompanyBankAccountOpening()
    this.application.value.companyId = this.companyId.value

    if (this.companyId.value === this.companyDataManager.companyId) {
      this.application.value.company = new Company(this.companyDataManager.company)
    } else {
      let response = await this.companyRepository.fetch(this.companyId.value)
      if (!this.companyRepository.error) {
        this.application.value.company = new Company(response)
      }
    }

    this.application.value.bankId = this.bankId
    // Set bank on application if already fetched
    if (this.bank.value?.id) {
      this.application.value.bank = this.bank.value
    }
    this.initializeData()
  }

  async fetchDocumentTemplate(): Promise<void> {
    // do nothing
  }

  setContent(): void {
    this.signaturePlaceholders.value = this.directors.value.map((d: Director) => {
      return d.name
    })

    this.signaturePlaceholders.value.splice(1, 0, SecretaryInformation.SECRETARY_NAME_LIST[1].name)

    this.signatoryPlaceholders.value = []
    if (this.application.value !== null) {
      if (this.application.value.signatories.length > 0) {
        this.signatoryPlaceholders.value = this.application.value.signatories.map((s: CompanyBankSignatory) => {
          return new CompanyBankSignatory(s)
        })
      }
    }

    if (this.signatoryPlaceholders.value.length <= 0) {
      this.directorUsers.value.forEach((u: User) => {
        let signatory = new CompanyBankSignatory()
        signatory.name = u.name
        signatory.type = u.detail?.identificationType ?? "ic"
        signatory.designation = "COMPANY DIRECTOR"
        signatory.identification = u.detail?.identification ?? ""
        signatory.nationality = u.detail?.citizenship.toUpperCase() ?? ""
        signatory.email = u.email
        signatory.phone = u.phone
        signatory.role = "maker"

        this.signatoryPlaceholders.value.push(signatory)
      })
    }
  }

  async otherDataInitiation(): Promise<void> {
    await Promise.all([this.fetchBank(), this.fetchDirectors()])
  }

  async fetchDirectors(): Promise<void> {
    try {
      if (this.companyId.value === this.companyDataManager.companyId) {
        this.directors.value = this.companyDataManager.directors.map((d: Director) => {
          return new Director(d)
        })
      } else {
        let response = await this.directorRepository.fetchAllForCompany(this.companyId.value)
        this.directors.value = response.map((d: Director) => {
          return new Director(d)
        })
      }

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

  onAddAnotherSignatoryClicked(): void {
    if (this.nonDirectorBankSignatoryRef) {
      this.nonDirectorBankSignatoryRef.show()
    }
  }

  onAddSignatory(): void {
    this.signatoryPlaceholders.value.push(new CompanyBankSignatory())
  }

  onSignatoryTypeChanged(selectedValue: string): void {
    if (!this.application.value) {
      return
    }

    this.application.value.signatoryType = selectedValue
    this.emitEvents("updated")
  }

  isSignatoryTypeSelected(type: string): boolean {
    if (!this.application.value || StringUtil.isNullOrEmpty(this.application.value.signatoryType)) {
      return false
    }

    return this.application.value.signatoryType === type
  }

  onSelectedBranchChanged(): void {
    if (!this.application.value) {
      return
    }

    this.application.value.bankBranchId = this.selectedBranchId.value
    this.emitEvents("updated")
  }

  getCompanySignatoryOnPage(page: number): CompanyBankSignatory[] {
    let start = (page - 3) * 7
    let end = start + 7

    return this.signatoryPlaceholders.value.slice(start, end)
  }

  getSignatureOnCurrentPage(page: number): SignatureItem[] {
    if (page < this.signatureStartOnPage.value) {
      return []
    }

    if (page === this.signatureStartOnPage.value) {
      console.log(this.signatureItems.value)
      return this.signatureItems.value.slice(0, this.maxSignatureOnFirstPage.value)
    }

    const offsetPage = this.signatureStartOnPage.value + 1
    const skip = (page - offsetPage) * this.maxSignatureOnOtherPages.value + this.maxSignatureOnFirstPage.value
    const lastIndex = Math.min(this.signatureItems.value.length, skip + this.maxSignatureOnOtherPages.value)

    return this.signatureItems.value.slice(skip, lastIndex)
  }

  getSignatureOnLastAuthoriseSignatoryPage(): string[] {
    if (!this.isShowSignaturesOnLastSignatoryPage) {
      return []
    }

    let numberOfRows = this.numberOfSignatureRowsOnSignatoryPage
    let start = 0
    let lastIndex = numberOfRows * 2
    if (lastIndex >= this.signaturePlaceholders.value.length) {
      return this.signaturePlaceholders.value
    }

    return this.signaturePlaceholders.value.slice(start, lastIndex)
  }

  getSignaturesOnPage(page: number): string[] {
    let start = (page - this.signaturePage) * 8 + this.getSignatureOnLastAuthoriseSignatoryPage().length
    let end = start + 8

    return this.signaturePlaceholders.value.slice(start, end)
  }

  totalPages(): number {
    return 3
  }

  getBranchId(): string {
    return this.selectedBranchId.value
  }

  getAuthorisedPersonsForOnlineBanking(): OnlineBanking[] {
    if (!this.application.value) {
      return []
    }

    return this.application.value?.onlineBanking || []
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

    return this.application.value.signatories || []
  }

  getBranchesInState(stateId: number): BankBranch[] {
    let branches: BankBranch[] = this.bankBranches.value.filter((b: BankBranch) => {
      return (
        b.stateId === stateId &&
        (StringUtil.isNullOrEmpty(this.searchBranch.value) ||
          b.name.toLowerCase().includes(this.searchBranch.value.toLowerCase()) ||
          b.state.name.toLowerCase().includes(this.searchBranch.value.toLowerCase()))
      )
    })

    return ObjectUtil.sort<BankBranch>(branches, "name", "asc")
  }

  onBranchOptionClicked(): void {
    this.isShowBranchOptions.value = !this.isShowBranchOptions.value
    this.searchBranch.value = ""
  }

  onBranchOptionSelected(branchId: string): void {
    this.selectedBranchId.value = branchId
    this.isShowBranchOptions.value = false
    this.searchBranch.value = ""
    this.onSelectedBranchChanged()
  }

  get loaderLabel(): string {
    return "Preparing Your"
  }

  get loaderSublabel(): string {
    return "Resolution"
  }

  get branchStates(): State[] {
    let states = this.bankBranches.value
      .filter((b: BankBranch) => {
        return (
          StringUtil.isNullOrEmpty(this.searchBranch.value) ||
          b.name.toLowerCase().includes(this.searchBranch.value.toLowerCase()) ||
          b.state.name.toLowerCase().includes(this.searchBranch.value.toLowerCase())
        )
      })
      .map((b: BankBranch) => {
        return b.state
      })

    let uniqueStates: State[] = []
    states.forEach((s: State) => {
      if (!uniqueStates.some((us: State) => us.id === s.id)) {
        uniqueStates.push(s)
      }
    })

    return ObjectUtil.sort<State>(uniqueStates, "name", "asc")
  }

  get selectedBranch(): BankBranch | null {
    if (!this.application.value || StringUtil.isNullOrEmpty(this.application.value.bankBranchId)) {
      return null
    }

    let branch = this.bankBranches.value.find((b: BankBranch) => {
      return b.id === this.application.value?.bankBranchId
    })

    return branch ?? null
  }

  get selectedBranchName(): string {
    return this.selectedBranch?.name ?? "YOUR SELECTED BRANCH"
  }

  get isBranchPlaceholder(): boolean {
    return this.selectedBranch === null
  }

  get authorisedSignatoryPages(): number[] {
    let length = Math.ceil(this.signatoryPlaceholders.value.length / 7)

    return Array.from({ length: length }, (_, i) => 3 + i)
  }

  get signaturePage(): number {
    return this.authorisedSignatoryPages.length + 3
  }

  get numberOfSignatureRowsOnSignatoryPage(): number {
    let numberOfSignatoryOnPage = this.getCompanySignatoryOnPage(
      this.authorisedSignatoryPages[this.authorisedSignatoryPages.length - 1]
    ).length

    let numberOfSignatureRowsOnSignatoryPage = 5 - numberOfSignatoryOnPage
    if (numberOfSignatureRowsOnSignatoryPage < 0) {
      numberOfSignatureRowsOnSignatoryPage = 0
    }

    return numberOfSignatureRowsOnSignatoryPage
  }

  get signaturePages(): number[] {
    let numberOfRows = Math.ceil((this.directors.value.length + 1) / 2)

    let numberOfRowsToDisplay = numberOfRows - this.numberOfSignatureRowsOnSignatoryPage

    let numberOfPages = Math.ceil(numberOfRowsToDisplay / 8)

    return Array.from({ length: numberOfPages }, (_, i) => this.signaturePage + i)
  }

  get isShowSignaturesOnLastSignatoryPage(): boolean {
    let numberOfSignatoryOnPage = this.getCompanySignatoryOnPage(
      this.authorisedSignatoryPages[this.authorisedSignatoryPages.length - 1]
    ).length

    return numberOfSignatoryOnPage <= 5
  }
}
