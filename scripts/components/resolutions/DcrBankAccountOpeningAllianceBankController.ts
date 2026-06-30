import { CompanyBankAccountOpening } from "~/scripts/models/CompanyBankAccountOpening"
import { ResolutionController } from "./ResolutionController"
import { StringUtil } from "~/scripts/utils/String"
import { Company } from "~/scripts/models/Company"
import { BankBranch } from "~/scripts/models/BankBranch"
import { Bank } from "~/scripts/models/Bank"
import { ObjectUtil } from "~/scripts/utils/Object"
import { Director } from "~/scripts/models/Director"
import { CompanyBankSignatory } from "~/scripts/models/CompanyBankSignatory"
import type { User } from "~/scripts/models/User"
import { OnlineBanking } from "~/scripts/types/banks/OnlineBanking"
import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { BankConstants } from "~/scripts/constants/Banks"
import { SecretaryInformation } from "~/scripts/constants/SecretaryInformation"
import type { State } from "~/scripts/models/Location"
import { AllianceBankApplicationDetails } from "~/scripts/types/banks/AllianceBankApplicationDetails"

export class DcrBankAccountOpeningAllianceBankController extends ResolutionController<CompanyBankAccountOpening> {
  companyBankAccountOpeningRepository = useCompanyBankAccountOpeningStore()
  companyRepository = useCompanyStore()
  documentTemplateRepository = useDocumentTemplateStore()
  bankRepository = useBankStore()

  private bankId: string = BankConstants.ALLIANCE_BANK_DETAIL.id
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

  additionalCssClass: string = "dcr-alliance-bank"

  allianceBankApplicationDetails = ref<AllianceBankApplicationDetails>(new AllianceBankApplicationDetails())

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

    this.signatoryPlaceholders.value = [
      new CompanyBankSignatory(),
      new CompanyBankSignatory(),
      new CompanyBankSignatory(),
      new CompanyBankSignatory(),
    ]

    this.onlineAccessPersons.value = [
      new OnlineBanking(),
      new OnlineBanking(),
      new OnlineBanking(),
      new OnlineBanking(),
    ]

    this.signatureStartOnPage.value = 3
    this.maxSignatureOnFirstPage.value = 6
    this.maxSignatureOnOtherPages.value = 6
  }

  async fetchApplication(id: string): Promise<void> {
    let response = await this.companyBankAccountOpeningRepository.fetch(id)
    if (!this.companyBankAccountOpeningRepository.error && response !== null) {
      this.application.value = new CompanyBankAccountOpening(response)
      let companyRepository = useCompanyStore()
      let companyResponse = await companyRepository.fetch(this.application.value.companyId)
      this.application.value.company = new Company(companyResponse)

      this.application.value.signatories.forEach((s: CompanyBankSignatory, index: number) => {
        this.signatoryPlaceholders.value[index] = s
      })

      if (this.application.value.paidAt !== this.application.value.updatedAt) {
        this.selectedBranchId.value = this.application.value.bankBranchId
      }

      this.application.value.onlineBanking.forEach((ob: OnlineBanking, index: number) => {
        this.onlineAccessPersons.value[index] = ob
      })

      this.allianceBankApplicationDetails.value = new AllianceBankApplicationDetails(
        this.application.value.allianceBankApplicationDetails
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

  async fetchDocumentTemplate(): Promise<void> {
    // do nothing
  }

  setContent(): void {
    if (!this.application.value) {
      return
    }

    if (
      this.application.value.allianceBankApplicationDetails === null ||
      this.application.value.allianceBankApplicationDetails.bizSmartAuthorisedRepresentatives.length <= 0
    ) {
      this.allianceBankApplicationDetails.value.bizSmartAuthorisedRepresentatives = this.getDefaultSignatories()
      this.allianceBankApplicationDetails.value.bizXpressAuthorisedRepresentatives = this.getDefaultSignatories()
    } else {
      this.allianceBankApplicationDetails.value = new AllianceBankApplicationDetails(
        this.application.value.allianceBankApplicationDetails
      )
    }

    if (this.allianceBankApplicationDetails.value.bizSmartAuthorisedRepresentatives.length <= 0) {
      this.allianceBankApplicationDetails.value.bizSmartAuthorisedRepresentatives = [
        new CompanyBankSignatory(),
        new CompanyBankSignatory(),
        new CompanyBankSignatory(),
        new CompanyBankSignatory(),
      ]
    }

    if (this.allianceBankApplicationDetails.value.bizXpressAuthorisedRepresentatives.length <= 0) {
      this.allianceBankApplicationDetails.value.bizXpressAuthorisedRepresentatives = [
        new CompanyBankSignatory(),
        new CompanyBankSignatory(),
        new CompanyBankSignatory(),
        new CompanyBankSignatory(),
      ]
    }
  }

  async otherDataInitiation(): Promise<void> {
    await Promise.all([this.fetchBank(), this.fetchDirectors()])
  }

  async fetchDirectors(): Promise<void> {
    try {
      let response = await this.directorRepository.fetchAllForCompany(this.companyId.value)

      this.directors.value = response.map((d: Director) => {
        return new Director(d)
      })

      this.signaturePlaceholders.value = this.directors.value.map((d: Director) => {
        return d.name
      })

      this.signaturePlaceholders.value.splice(1, 0, SecretaryInformation.SECRETARY_NAME)
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

  getDefaultSignatories(): CompanyBankSignatory[] {
    return this.directors.value.map((d: Director) => {
      let newSignatory = new CompanyBankSignatory()
      newSignatory.name = d.name
      newSignatory.designation = "COMPANY DIRECTOR"
      newSignatory.identification = d.identification
      newSignatory.type = d.identificationType
      newSignatory.role = "maker"

      return newSignatory
    })
  }

  onSignatoryTypeChanged(selectedValue: string): void {
    if (!this.application.value) {
      return
    }

    this.application.value.signatoryType = selectedValue
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

  isProductSelected(product: string): boolean {
    return this.allianceBankApplicationDetails.value.selectedProducts.includes(product)
  }

  onProductClicked(product: string): void {
    if (this.isProductSelected(product)) {
      this.allianceBankApplicationDetails.value.selectedProducts =
        this.allianceBankApplicationDetails.value.selectedProducts.filter((s: string) => {
          return s !== product
        })
    } else {
      this.allianceBankApplicationDetails.value.selectedProducts.push(product)
    }

    this.emitEvents("updated")
  }

  //Biz Smart
  onAddBizSmartAuthoriseRepresentative(): void {
    this.allianceBankApplicationDetails.value.bizSmartAuthorisedRepresentatives.push(new CompanyBankSignatory())
  }

  onRemoveBizSmartAuthoriseRepresentatince(index: number): void {
    this.allianceBankApplicationDetails.value.bizSmartAuthorisedRepresentatives.splice(index, 1)

    if (this.allianceBankApplicationDetails.value.bizSmartMandateCount > this.bizSmartMandateCount) {
      this.allianceBankApplicationDetails.value.bizSmartMandateCount = this.bizSmartMandateCount
    }

    this.emitEvents("updated")
  }

  onBizSmartMandateClicked(mandate: string): void {
    this.allianceBankApplicationDetails.value.bizSmartMandateType = mandate
    this.emitEvents("updated")
  }

  isBizSmartMandate(mandate: string): boolean {
    return this.allianceBankApplicationDetails.value.bizSmartMandateType === mandate
  }

  directorDataListForBizSmart(index: number): string[] {
    let selectedNames = this.allianceBankApplicationDetails.value.bizSmartAuthorisedRepresentatives
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

  isBizSmartReadOnlyField(signatory: CompanyBankSignatory): boolean {
    return this.directors.value.some((d: Director) => {
      return d.name === signatory.name
    })
  }

  get bizSmartMandateCount(): number {
    return this.allianceBankApplicationDetails.value.bizSmartAuthorisedRepresentatives.filter(
      (cbs: CompanyBankSignatory) => {
        return !StringUtil.isNullOrEmpty(cbs.name)
      }
    ).length
  }

  // Biz Xpress
  onAddBizXpressAuthoriseRepresentative(): void {
    this.allianceBankApplicationDetails.value.bizXpressAuthorisedRepresentatives.push(new CompanyBankSignatory())
  }

  onRemoveBizXpressAuthoriseRepresentatince(index: number): void {
    this.allianceBankApplicationDetails.value.bizXpressAuthorisedRepresentatives.splice(index, 1)

    if (this.allianceBankApplicationDetails.value.bizXpressMandateCount > this.bizXpressMandateCount) {
      this.allianceBankApplicationDetails.value.bizXpressMandateCount = this.bizXpressMandateCount
    }

    this.emitEvents("updated")
  }

  onBizXpressMandateClicked(mandate: string): void {
    this.allianceBankApplicationDetails.value.bizXpressMandateType = mandate
    this.emitEvents("updated")
  }

  isBizXpressMandate(mandate: string): boolean {
    return this.allianceBankApplicationDetails.value.bizXpressMandateType === mandate
  }

  directorDataListForBizXpress(index: number): string[] {
    let selectedNames = this.allianceBankApplicationDetails.value.bizXpressAuthorisedRepresentatives
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

  isBizXpressReadOnlyField(signatory: CompanyBankSignatory): boolean {
    return this.directors.value.some((d: Director) => {
      return d.name === signatory.name
    })
  }

  get bizXpressMandateCount(): number {
    return this.allianceBankApplicationDetails.value.bizXpressAuthorisedRepresentatives.filter(
      (cbs: CompanyBankSignatory) => {
        return !StringUtil.isNullOrEmpty(cbs.name)
      }
    ).length
  }

  //Shared function for all
  onSignatoryNameChange(signatory: CompanyBankSignatory): void {
    signatory.name = signatory.name ? signatory.name.trim().toUpperCase() : ""

    let matchedDirector = this.directors.value.find((d: Director) => {
      return d.name === signatory.name
    })

    if (!matchedDirector) {
      signatory.identification = ""
      signatory.type = ""
      signatory.nationality = ""
      signatory.designation = ""
      signatory.email = ""
      signatory.phone = ""

      this.emitEvents("updated")
      return
    }

    signatory.identification = matchedDirector.identification
    signatory.type = matchedDirector.identificationType
    signatory.nationality = matchedDirector.identificationType === "ic" ? "MALAYSIA" : ""
    signatory.designation = "COMPANY DIRECTOR"
    signatory.role = "maker"
    signatory.email = matchedDirector.email
    signatory.phone = matchedDirector.phone

    this.emitEvents("updated")
  }

  totalPages(): number {
    if (this.directors.value.length <= 5) {
      return 3
    }

    let extras = this.directors.value.length - 5
    let additionalSignaturePages = Math.ceil(extras / this.maxSignatureOnOtherPages.value)

    return 3 + extras
  }

  getSignatureNamesOnPage(page: number): string[] {
    let start = (page - this.signatureStartOnPage.value) * this.maxSignatureOnOtherPages.value
    let end = start + this.maxSignatureOnOtherPages.value

    return this.signaturePlaceholders.value.slice(start, end)
  }

  get additionalPages(): number[] {
    let length = this.totalPages() - 3
    if (length <= 0) {
      return []
    }

    return Array.from({ length: 1 }, (_, i) => 4 + i)
  }

  getBranchId(): string {
    return this.selectedBranchId.value
  }

  getAuthorisedPersonsForOnlineBanking(): OnlineBanking[] {
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

  getOtherDetails(): any {
    if (!this.application.value) {
      return null
    }

    return this.allianceBankApplicationDetails.value
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
}
