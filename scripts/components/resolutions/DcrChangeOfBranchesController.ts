import { CompanyAmendmentBranch } from "~/scripts/models/CompanyAmendmentBranch"
import { ResolutionController } from "./ResolutionController"
import { useCompanyAmendmentBranchStore } from "#imports"
import { useCompanyBranchStore } from "#imports"
import { useCompanyStore } from "#imports"
import { Company } from "~/scripts/models/Company"
import { City, Country, State } from "~/scripts/models/Location"
import { SelectOption } from "~/scripts/types/SelectOption"
import { CompanyConstants } from "~/scripts/constants/Company"
import { Filter } from "~/scripts/library/Filter"
import { CompanyBranch } from "~/scripts/models/CompanyBranch"
import { StringUtil } from "~/scripts/utils/String"
import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

export class DcrChangeOfBranchesController extends ResolutionController<CompanyAmendmentBranch> {
  companyAmendmentBranchRepository = useCompanyAmendmentBranchStore()
  companyBranchRepository = useCompanyBranchStore()
  companyRepository = useCompanyStore()
  companyBranches = ref<CompanyBranch[]>([])
  applicationType = ref<string>(CompanyConstants.AMENDMENT_BRANCH_TYPE_ADD)
  selectedBranchId = ref<string[]>([])

  typeOptions: Ref<SelectOption[]> = ref<SelectOption[]>([
    new SelectOption(
      CompanyConstants.AMENDMENT_BRANCH_TYPE_ADD,
      CompanyConstants.AMENDMENT_BRANCH_TYPE_ADD,
      CompanyConstants.AMENDMENT_BRANCH_TYPE_ADD_LABEL
    ),
    new SelectOption(
      CompanyConstants.AMENDMENT_BRANCH_TYPE_CHANGE,
      CompanyConstants.AMENDMENT_BRANCH_TYPE_CHANGE,
      CompanyConstants.AMENDMENT_BRANCH_TYPE_CHANGE_LABEL
    ),
    new SelectOption(
      CompanyConstants.AMENDMENT_BRANCH_TYPE_REMOVE,
      CompanyConstants.AMENDMENT_BRANCH_TYPE_REMOVE,
      CompanyConstants.AMENDMENT_BRANCH_TYPE_REMOVE_LABEL
    ),
  ])

  constructor(props: IPropsResolutionDocument<CompanyAmendmentBranch>, emitEvents: any | null) {
    super(
      props.companyId,
      props.applicationId,
      props.application,
      CompanyAmendmentBranch,
      props.isInPreviewMode,
      true,
      false,
      props.showWatermark,
      props.watermarkText,
      emitEvents
    )

    this.signatureStartOnPage.value = 1
    this.maxSignatureOnFirstPage.value = 4
    this.maxSignatureOnOtherPages.value = 6
  }

  async setApplicationId(id: string | null): Promise<void> {
    if (StringUtil.isNullOrEmpty(id)) {
      await this.setApplication()
      return
    } else {
      await this.fetchApplication(id ?? "")
    }
  }

  async fetchApplication(id: string): Promise<void> {
    let response = await this.companyAmendmentBranchRepository.fetch(id)
    if (!this.companyAmendmentBranchRepository.error) {
      this.application.value = new CompanyAmendmentBranch(response)
      this.applicationType.value = this.application.value.type
      if (this.application.value.companyBranchId) {
        this.selectedBranchId.value = [this.application.value.companyBranchId]
      }

      this.handleTypeChange()
      this.initializeData()
    }
  }

  async fetchExistingCompanyBranches(): Promise<void> {
    let filter = new Filter()
    filter.companyId = this.companyId.value
    filter.takeAll = true
    await this.companyBranchRepository.fetchAll(filter)
    if (!this.companyBranchRepository.error) {
      this.companyBranches.value = this.companyBranchRepository.companyBranches.map((branch) => {
        return new CompanyBranch(branch)
      })
    }
  }

  async otherDataInitiation(): Promise<void> {
    await this.fetchExistingCompanyBranches()
  }

  async setApplication(): Promise<void> {
    let response = await this.companyRepository.fetch(this.companyId.value)
    if (!this.companyRepository.error) {
      this.application.value = new CompanyAmendmentBranch()
      this.application.value.companyId = this.companyId.value
      this.application.value.company = new Company(response)
      this.applicationType.value = this.application.value.type
      this.handleTypeChange()
      this.initializeData()
    }
  }

  async fetchDocumentTemplate(): Promise<void> {
    //do nothing
  }

  setContent(): void {
    // do nothing2
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

  resolutionContentLine(): string {
    if (!this.application.value) {
      return "addition of the following branch address of the Company"
    }

    if (this.application.value.type === CompanyConstants.AMENDMENT_BRANCH_TYPE_CHANGE) {
      return "change of business branch address of the Company from"
    }

    return `${this.application.value.getTypeName()} of the following branch address of the Company`
  }

  isAmendmentTypeChange(): boolean {
    if (!this.application.value) {
      return false
    }

    return this.application.value.type === CompanyConstants.AMENDMENT_BRANCH_TYPE_CHANGE
  }

  isToChangeBranchSelected(): boolean {
    if (!this.application.value) {
      return false
    }

    return this.application.value.companyBranchId !== null
  }

  isAddressEditable(): boolean {
    return this.isDocumentEditable() && this.application.value?.type !== CompanyConstants.AMENDMENT_BRANCH_TYPE_REMOVE
  }

  isTypeOptionDisabled(option: SelectOption): boolean {
    if (this.companyBranches.value.length > 0) {
      return false
    }

    return option.value !== CompanyConstants.AMENDMENT_BRANCH_TYPE_ADD
  }

  isBranchOptionHidden(branchId: string): boolean {
    if (this.selectedBranchId.value.length <= 0) {
      return false
    }

    return !this.selectedBranchId.value.includes(branchId)
  }

  isShowBranchSelection(): boolean {
    if (!this.application.value) {
      return false
    }

    return (
      this.isAddressEditable() &&
      (this.application.value.type === CompanyConstants.AMENDMENT_BRANCH_TYPE_CHANGE ||
        this.application.value.type === CompanyConstants.AMENDMENT_BRANCH_TYPE_REMOVE)
    )
  }

  isShowBranchAddressForm(): boolean {
    if (!this.isAddressEditable()) {
      return false
    }

    if (!this.application.value) {
      return true
    }

    return this.application.value.type !== CompanyConstants.AMENDMENT_BRANCH_TYPE_REMOVE
  }

  isShowExistingAddress(): boolean {
    if (!this.application.value) {
      return false
    }

    return (
      !this.isAddressEditable() &&
      (this.application.value.type === CompanyConstants.AMENDMENT_BRANCH_TYPE_CHANGE ||
        this.application.value.type === CompanyConstants.AMENDMENT_BRANCH_TYPE_REMOVE)
    )
  }

  isShowNewAddress(): boolean {
    if (!this.application.value) {
      return false
    }

    return (
      !this.isAddressEditable() &&
      (this.application.value.type === CompanyConstants.AMENDMENT_BRANCH_TYPE_ADD ||
        this.application.value.type === CompanyConstants.AMENDMENT_BRANCH_TYPE_CHANGE)
    )
  }

  handleTypeChange(): void {
    if (!this.application.value) {
      return
    }

    this.application.value.type = this.applicationType.value
    this.selectedBranchId.value = []
    this.application.value.companyBranchId = null
    this.application.value.companyBranchToChange = null

    this.maxSignatureOnFirstPage.value =
      this.applicationType.value === CompanyConstants.AMENDMENT_BRANCH_TYPE_CHANGE ? 2 : 4

    if (
      // predefine branch changes
      this.applicationType.value === CompanyConstants.AMENDMENT_BRANCH_TYPE_CHANGE ||
      this.applicationType.value === CompanyConstants.AMENDMENT_BRANCH_TYPE_REMOVE
    ) {
      if (this.companyBranches.value.length === 1) {
        const firstBranch = this.companyBranches.value[0]
        this.application.value.companyBranchId = firstBranch.id
        this.application.value.companyBranchToChange = new CompanyBranch(firstBranch)
      }
    }
  }

  handleFromBranchChange(): void {
    if (!this.application.value) {
      return
    }

    if (this.selectedBranchId.value.length <= 0) {
      this.application.value.companyBranchId = null
      this.application.value.companyBranchToChange = null
      return
    }

    const branchId = this.selectedBranchId.value[0]
    const branch = this.companyBranches.value.find((b) => {
      return b.id === branchId
    })

    if (branch) {
      this.application.value.companyBranchId = branchId
      this.application.value.companyBranchToChange = new CompanyBranch(branch)
    }
  }

  handleAddressLine1Change(newVal: string): void {
    if (!this.application.value) {
      this.application.value = new CompanyAmendmentBranch()
    }

    this.application.value.location.addressLine1 = newVal
  }

  handleAddressLine2Change(newVal: string): void {
    if (!this.application.value) {
      this.application.value = new CompanyAmendmentBranch()
    }

    this.application.value.location.addressLine2 = newVal
  }

  handlePostcodeChange(newVal: string): void {
    if (!this.application.value) {
      this.application.value = new CompanyAmendmentBranch()
    }

    this.application.value.location.postcode = newVal
  }

  handleCityChange(newVal: City): void {
    if (!this.application.value) {
      this.application.value = new CompanyAmendmentBranch()
    }

    this.application.value.location.city = new City(newVal)
  }

  handleStateChange(newVal: State): void {
    if (!this.application.value) {
      this.application.value = new CompanyAmendmentBranch()
    }

    this.application.value.location.state = new State(newVal)
  }

  handleCountryChange(newVal: Country): void {
    if (!this.application.value) {
      this.application.value = new CompanyAmendmentBranch()
    }

    this.application.value.location.country = new Country(newVal)
  }

  getCompanyBranchToChangeAddress(): string {
    if (this.isInPreviewMode.value) {
      return `
        YOUR BRANCH ADDRESS LINE 1<br>
        YOUR BRANCH ADDRESS LINE 2<br>
        YOUR BRANCH POSTCODE CITY<br>
        YOUR BRANCH STATE COUNTRY
      `
    }

    if (!this.application.value) {
      return ""
    }

    if (!this.application.value.companyBranchToChange) {
      return ""
    }

    return this.application.value.companyBranchToChange.location.getMultilineAddress()
  }

  getNewAddress(): string {
    if (this.isInPreviewMode.value) {
      return `
        YOUR NEW BRANCH ADDRESS LINE 1<br>
        YOUR NEW BRANCH ADDRESS LINE 2<br>
        YOUR NEW BRANCH POSTCODE CITY<br>
        YOUR NEW BRANCH STATE COUNTRY
      `
    }

    if (!this.application.value) {
      return ""
    }

    return this.application.value.location.getMultilineAddress()
  }
}
