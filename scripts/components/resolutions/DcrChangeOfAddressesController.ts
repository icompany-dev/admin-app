import { CompanyAmendmentAddress } from "~/scripts/models/CompanyAmendmentAddress"
import { ResolutionController } from "./ResolutionController"
import { useCompanyAmendmentAddressStore } from "#imports"
import { useCompanyStore } from "#imports"
import { Company } from "~/scripts/models/Company"
import { Location, City, Country, State } from "~/scripts/models/Location"
import { StringUtil } from "~/scripts/utils/String"
import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

export class DcrChangeOfAddressesController extends ResolutionController<CompanyAmendmentAddress> {
  companyAmendmentAddressRepository = useCompanyAmendmentAddressStore()
  companyRepository = useCompanyStore()

  constructor(props: IPropsResolutionDocument<CompanyAmendmentAddress>, emitEvents: any | null) {
    super(
      props.companyId,
      props.applicationId,
      props.application,
      CompanyAmendmentAddress,
      props.isInPreviewMode,
      true,
      false,
      props.showWatermark,
      props.watermarkText,
      emitEvents
    )

    this.signatureStartOnPage.value = 1
    this.maxSignatureOnFirstPage.value = 2
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
    let response = await this.companyAmendmentAddressRepository.fetch(id)
    if (!this.companyAmendmentAddressRepository.error) {
      this.application.value = new CompanyAmendmentAddress(response)

      this.initializeData()
    }
  }

  async setApplication(): Promise<void> {
    let company = await this.companyRepository.fetch(this.companyId.value)
    if (!this.companyRepository.error) {
      this.application.value = new CompanyAmendmentAddress()
      this.application.value.companyId = this.companyId.value
      this.application.value.company = new Company(company)
      this.initializeData()
    }
  }

  async otherDataInitiation(): Promise<void> {
    // not applicable
  }

  async fetchDocumentTemplate(): Promise<void> {
    // Not applicable
  }

  setContent(): void {
    // Not applicable
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

  handleAddressLine1Change(newVal: string): void {
    if (!this.application.value) {
      this.application.value = new CompanyAmendmentAddress()
    }

    this.application.value.businessAddressLocation.addressLine1 = newVal.toUpperCase()
  }

  handleAddressLine2Change(newVal: string): void {
    if (!this.application.value) {
      this.application.value = new CompanyAmendmentAddress()
    }

    this.application.value.businessAddressLocation.addressLine2 = newVal.toUpperCase()
  }

  handlePostcodeChange(newVal: string): void {
    if (!this.application.value) {
      this.application.value = new CompanyAmendmentAddress()
    }

    this.application.value.businessAddressLocation.postcode = newVal
  }

  handleCityChange(newVal: City): void {
    if (!this.application.value) {
      this.application.value = new CompanyAmendmentAddress()
    }

    this.application.value.businessAddressLocation.city = new City(newVal)
  }

  handleStateChange(newVal: State): void {
    if (!this.application.value) {
      this.application.value = new CompanyAmendmentAddress()
    }

    this.application.value.businessAddressLocation.state = new State(newVal)
  }

  handleCountryChange(newVal: Country): void {
    if (!this.application.value) {
      this.application.value = new CompanyAmendmentAddress()
    }

    this.application.value.businessAddressLocation.country = new Country(newVal)
  }

  getNewAddress(): string {
    if (!this.application.value) {
      return ""
    }

    if (this.isInPreviewMode.value) {
      return `
        YOUR ADDRESS LINE 1<br>
        YOUR ADDRESS LINE 2<br>
        YOUR POSTCODE YOUR CITY<br>
        YOUR STATE YOUR COUNTRY
      `
    }

    return this.application.value.businessAddressLocation.getMultilineAddress()
  }

  getOldAddress(): string {
    if (!this.application.value?.company?.businessAddressLocation) {
      return ""
    }

    return this.application.value.company.businessAddressLocation.getMultilineAddress()
  }

  hasPreviousAddress(): boolean {
    if (!this.application.value?.company?.businessAddressLocation) {
      return false
    }

    return this.application.value.company.businessAddressLocation.canCreate()
  }

  get location(): Location {
    if (!this.application.value || !this.application.value.businessAddressLocation) {
      return new Location()
    }

    return this.application.value.businessAddressLocation
  }
}
