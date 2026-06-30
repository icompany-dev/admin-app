import { CompanyDelegationOfAuthority } from "~/scripts/models/CompanyDelegationOfAuthority"
import { CompanyDelegateAuthorityTo } from "~/scripts/models/CompanyDelegateAuthorityTo"
import { useCompanyDelegationOfAuthorityStore } from "~/stores/CompanyDelegationOfAuthorities"
import { useCompanyStore } from "#imports"
import { ResolutionController } from "./ResolutionController"
import { Company } from "~/scripts/models/Company"
import { Director } from "~/scripts/models/Director"
import { Shareholder } from "~/scripts/models/Shareholder"
import { StringUtil } from "~/scripts/utils/String"
import { CompanyDelegationOfAuthorityConstant } from "~/scripts/constants/CompanyDelegationOfAuthority"
import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

export class DcrDelegationOfAuthorityController extends ResolutionController<CompanyDelegationOfAuthority> {
  companyDelegationOfAuthorityRepository = useCompanyDelegationOfAuthorityStore()
  companyRepository = useCompanyStore()
  maxDelegateTos = 3
  thirdParty = "THIRD_PARTY"

  directors: Ref<Director[]> = ref<Director[]>([])
  shareholders: Ref<Shareholder[]> = ref<Shareholder[]>([])
  designationOptions = CompanyDelegationOfAuthorityConstant.DESIGNATION_OPTIONS
  scopeOfAuthorityOptions = CompanyDelegationOfAuthorityConstant.SCOPE_OF_AUTHORITY_OPTIONS

  selectionState = reactive(new Map<CompanyDelegateAuthorityTo, string>())
  delegationWarningPopupRef: any | null = null

  constructor(props: IPropsResolutionDocument<CompanyDelegationOfAuthority>, emitEvents: any | null) {
    super(
      props.companyId,
      props.applicationId,
      props.application,
      CompanyDelegationOfAuthority,
      props.isInPreviewMode,
      true,
      false,
      props.showWatermark,
      props.watermarkText,
      emitEvents
    )
  }

  async fetchApplication(id: string): Promise<void> {
    try {
      let response = await this.companyDelegationOfAuthorityRepository.fetch(id)
      if (!this.companyDelegationOfAuthorityRepository.error && response) {
        this.application.value = new CompanyDelegationOfAuthority(response)
      } else {
        console.error("Error fetching delegation of authority application")
      }
    } catch (error) {
      console.error("Error fetching application:", error)
    }
    this.setResolution()
  }

  async otherDataInitiation(): Promise<void> {
    await Promise.all([this.fetchDirectors(), this.fetchShareholders()])
  }

  async fetchDirectors(): Promise<void> {
    try {
      await this.directorRepository.fetchAllForCompany(this.companyId.value)
      this.directors.value = this.directorRepository.directors.map((d) => {
        return new Director(d)
      })
    } catch (error) {
      console.error("Error fetching directors:", error)
      this.directors.value = []
    }
  }

  async fetchShareholders(): Promise<void> {
    try {
      await this.shareholderRepository.fetchAllForCompany(this.companyId.value)
      this.shareholders.value = this.shareholderRepository.shareholders.map((s) => {
        return new Shareholder(s)
      })
    } catch (error) {
      console.error("Error fetching shareholders:", error)
      this.shareholders.value = []
    }
  }

  async setApplication(): Promise<void> {
    try {
      let response = await this.companyRepository.fetch(this.companyId.value)
      if (!this.companyRepository.error && response) {
        this.application.value = new CompanyDelegationOfAuthority()
        this.application.value.companyId = this.companyId.value
        this.application.value.company = new Company(response)
      } else {
        console.error("Error fetching company data")
      }
    } catch (error) {
      console.error("Error setting application:", error)
    }
    this.setResolution()
  }

  async fetchDocumentTemplate(): Promise<void> {
    //do nothing
  }

  setContent(): void {
    // do nothing
  }

  setResolution(): void {
    if (this.application.value && this.application.value.delegateTos.length === 0) {
      this.application.value.delegateTos.push(new CompanyDelegateAuthorityTo())
    }

    this.updateSignatureSetup()
  }

  setDelegationWarningPopupRef(delegationWarningPopupRef: any | null): void {
    this.delegationWarningPopupRef = delegationWarningPopupRef
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

  onAddMoreClicked(): void {
    if (!this.delegationWarningPopupRef) {
      return
    }

    this.delegationWarningPopupRef.show()
  }

  addDelegateTo(): void {
    if (!this.application.value) {
      return
    }

    if (this.application.value.delegateTos.length >= this.maxDelegateTos) {
      return
    }

    this.application.value.delegateTos.push(new CompanyDelegateAuthorityTo())
    this.updateSignatureSetup()
  }

  removeDelegateTo(index: number): void {
    if (!this.application.value) {
      return
    }

    if (this.application.value.delegateTos.length <= 1) {
      return
    }

    this.application.value.delegateTos.splice(index, 1)
    this.updateSignatureSetup()
  }

  canAddMoreDelegateTos(): boolean {
    if (!this.application.value) {
      return false
    }

    return this.isDocumentEditable() && this.application.value.delegateTos.length < this.maxDelegateTos
  }

  canRemoveDelegateTo(): boolean {
    if (!this.application.value) {
      return false
    }

    return this.isDocumentEditable() && this.application.value.delegateTos.length > 1
  }

  getDesignationOptionsForDelegateTo(delegateTo: CompanyDelegateAuthorityTo): string[] {
    if (StringUtil.isNullOrEmpty(delegateTo.name)) {
      return this.designationOptions.filter((option) => option !== "Director")
    }

    const isDirector = this.directors.value.some(
      (director) => director.name?.toUpperCase() === delegateTo.name.toUpperCase()
    )

    if (isDirector) {
      return this.designationOptions
    }

    return this.designationOptions.filter((option) => option !== "Director")
  }

  handleNameChanged(delegateTo: CompanyDelegateAuthorityTo): void {
    delegateTo.name = delegateTo.name.toUpperCase()

    if (StringUtil.isNullOrEmpty(delegateTo.designation)) {
      const isDirector = this.directors.value.some(
        (director) => director.name?.toUpperCase() === delegateTo.name.toUpperCase()
      )

      if (isDirector) {
        delegateTo.designation = "Director"
      }
    }
  }

  hasConstitution(): boolean {
    if (!this.application.value) {
      return false
    }
    return this.application.value.company?.hasConstitution ?? false
  }

  isDocumentOverflow(): boolean {
    if (!this.application.value) {
      return false
    }

    if (this.isDocumentEditable()) {
      return this.application.value.delegateTos.length > 2
    }

    return this.application.value.delegateTos.some((delegate) => {
      return delegate.scopeOfAuthority.length >= 3
    })
  }

  getDelegateTosByPage(page: number): CompanyDelegateAuthorityTo[] {
    if (!this.application.value) {
      return []
    }

    const maxOnFirstPage = this.isDocumentOverflow() ? 2 : 3

    return page === 1
      ? this.application.value.delegateTos.slice(0, maxOnFirstPage)
      : this.application.value.delegateTos.slice(maxOnFirstPage)
  }

  getOriginalIndex(pageIndex: number, isSecondPage: boolean = false): number {
    if (!isSecondPage) {
      return pageIndex
    }
    return 2 + pageIndex
  }

  updateSignatureSetup(): void {
    if (!this.application.value) {
      this.signatureStartOnPage.value = 1
      return
    }

    this.signatureStartOnPage.value = this.isDocumentOverflow() ? 2 : 1
    this.maxSignatureOnFirstPage.value = !this.isDocumentOverflow() ? 4 : 2
  }

  getPersonSelection(delegateTo: CompanyDelegateAuthorityTo): string {
    if (StringUtil.isNullOrEmpty(delegateTo.name)) {
      if (this.selectionState.get(delegateTo) === this.thirdParty) {
        return this.thirdParty
      }
      return ""
    }

    const isDirector = this.directors.value.some(
      (director) => director.name?.toUpperCase() === delegateTo.name.toUpperCase()
    )

    if (isDirector) {
      return delegateTo.name.toUpperCase()
    }

    const isShareholder = this.shareholders.value.some(
      (shareholder) => shareholder.name?.toUpperCase() === delegateTo.name.toUpperCase()
    )

    if (isShareholder) {
      return delegateTo.name.toUpperCase()
    }

    return this.thirdParty
  }

  handlePersonSelectionChanged(delegateTo: CompanyDelegateAuthorityTo, selectedValue: string): void {
    if (selectedValue === this.thirdParty) {
      this.selectionState.set(delegateTo, this.thirdParty)
      delegateTo.name = ""
      delegateTo.designation = ""
    } else if (selectedValue === "") {
      this.selectionState.delete(delegateTo)
      delegateTo.name = ""
      delegateTo.designation = ""
    } else {
      this.selectionState.delete(delegateTo)
      delegateTo.name = selectedValue

      const isDirector = this.directors.value.some(
        (director) => director.name?.toUpperCase() === selectedValue.toUpperCase()
      )

      if (isDirector) {
        delegateTo.designation = "Director"
      } else {
        const isShareholder = this.shareholders.value.some(
          (shareholder) => shareholder.name?.toUpperCase() === selectedValue.toUpperCase()
        )
        if (isShareholder) {
          delegateTo.designation = "Shareholder"
        } else {
          delegateTo.designation = ""
        }
      }
    }

    this.updateSignatureSetup()
  }

  //copywriting
  delegateToName(delegateTo: CompanyDelegateAuthorityTo): string {
    if (this.isInPreviewMode.value) {
      return "FULL NAME OF AUTHORISED PERSON"
    }

    return delegateTo.name.toUpperCase()
  }

  delegateToDesignation(delegateTo: CompanyDelegateAuthorityTo): string {
    if (this.isInPreviewMode.value) {
      return "DESIGNATION OF AUTHORISED PERSON"
    }

    return delegateTo.designation.toUpperCase()
  }

  delegateToScopeOfAuthority(delegateTo: CompanyDelegateAuthorityTo): string {
    if (this.isInPreviewMode.value) {
      // return this.scopeOfAuthorityOptions.join("<br>")
      return "SCOPE OF AUTHORITY GRANTED"
    }

    return delegateTo.scopeOfAuthority.join("<br>")
  }
}
