import { CompanySection47 } from "~/scripts/models/CompanySection47"
import { ResolutionController } from "./ResolutionController"
import { useCompanySection47Store } from "#imports"
import { useCompanyStore } from "#imports"
import { Company } from "~/scripts/models/Company"
import { City, Country, State } from "~/scripts/models/Location"
import { StringUtil } from "~/scripts/utils/String"

export class DcrSection47Controller extends ResolutionController<CompanySection47> {
  companySection47Repository = useCompanySection47Store()
  companyRepository = useCompanyStore()
  signatureStartOnPage = ref<number>(1)
  maxSignatureOnFirstPage = ref<number>(4)
  maxSignatureOnOtherPages = ref<number>(6)

  constructor(
    companyId: string,
    applicationId: string | null,
    application: CompanySection47 | null,
    isInPreviewMode: boolean,
    emitEvents: any | null
  ) {
    super(companyId, application, CompanySection47, isInPreviewMode, emitEvents)
    this.isDcr.value = true

    if (!StringUtil.isNullOrEmpty(applicationId)) {
      this.fetchApplication(applicationId ?? "")
    } else {
      this.setApplication()
    }
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
    let response = await this.companySection47Repository.fetch(id)
    if (!this.companySection47Repository.error) {
      this.application.value = new CompanySection47(response)
    }
    this.initializeData()
  }

  async setApplication(): Promise<void> {
    let response = await this.companyRepository.fetch(this.companyId.value)
    if (!this.companyRepository.error) {
      this.application.value = new CompanySection47()
      this.application.value.companyId = this.companyId.value
      this.application.value.company = new Company(response)
    }
    this.initializeData()
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

  isAddressEditable(): boolean {
    return this.isDocumentEditable() && !this.application.value?.isLocationUnknown
  }

  isShowAddressForm(): boolean {
    if (!this.isAddressEditable()) {
      return false
    }

    if (!this.application.value) {
      return true
    }

    return !this.application.value.isLocationUnknown
  }

  getOptionList() {
    return [
      { id: "", label: `Notice under Section 15 of the Companies Act 2016 ("the Act").` },
      { id: "", label: `The Company's constitution (if applicable).` },
      { id: "", label: `Any certificates issued under the Act or corresponding previous written law.` },
      {
        id: "",
        label: `All registers, books, records and other documents that the Company is required to keep under the Act.`,
      },
      { id: "", label: `Board and Board Committees meeting minutes.` },
      { id: "", label: `Copies of members' written communications.` },
      { id: "", label: `Copies of financial reports, including group's consolidated financial reports.` },
      { id: "", label: `Company's accounting records required by Section 245 of the Act.` },
      { id: "", label: `Copies of documents showing any charges required by Section 357 of the Act.` },
      { id: "", label: `Any other documents as the Registrar requires the Company to keep.` },
    ]
  }

  handleAddressLine1Change(newVal: string): void {
    if (!this.application.value) {
      this.application.value = new CompanySection47()
    }

    this.application.value.location.addressLine1 = newVal
  }

  handleAddressLine2Change(newVal: string): void {
    if (!this.application.value) {
      this.application.value = new CompanySection47()
    }

    this.application.value.location.addressLine2 = newVal
  }

  handlePostcodeChange(newVal: string): void {
    if (!this.application.value) {
      this.application.value = new CompanySection47()
    }

    this.application.value.location.postcode = newVal
  }

  handleCityChange(newVal: City): void {
    if (!this.application.value) {
      this.application.value = new CompanySection47()
    }

    this.application.value.location.city = new City(newVal)
  }

  handleStateChange(newVal: State): void {
    if (!this.application.value) {
      this.application.value = new CompanySection47()
    }

    this.application.value.location.state = new State(newVal)
  }

  handleCountryChange(newVal: Country): void {
    if (!this.application.value) {
      this.application.value = new CompanySection47()
    }

    this.application.value.location.country = new Country(newVal)
  }

  getNewAddress(): string {
    if (!this.application.value) {
      return ""
    }

    return this.application.value.location.getMultilineAddress()
  }

  getContentCopywriting(): string {
    if (this.application.value?.isLocationUnknown) {
      return `be kept at a location that will be disclosed in the future, which is other than at the registered office of the Company with immediate effect.`
    } else {
      return `be kept at the place indicated below which is other than at the registered office of the Company with immediate effect.`
    }
  }
}
