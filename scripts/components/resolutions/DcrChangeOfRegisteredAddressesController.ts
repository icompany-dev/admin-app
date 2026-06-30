import { CompanyAmendmentRegisteredAddress } from "~/scripts/models/CompanyAmendmentRegisteredAddress"
import { ResolutionController } from "./ResolutionController"
import { useCompanyAmendmentRegisteredAddressStore } from "~/stores/CompanyAmendmentRegisteredAddresses"
import { useCompanyStore } from "#imports"
import { Company } from "~/scripts/models/Company"
import { City, Country, State } from "~/scripts/models/Location"
import { StringUtil } from "~/scripts/utils/String"
import { ObjectUtil } from "~/scripts/utils/Object"
import { SignatureGroup } from "~/scripts/models/SignatureGroup"
import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

export class DcrChangeOfRegisteredAddressesController extends ResolutionController<CompanyAmendmentRegisteredAddress> {
  companyAmendmentRegisteredAddressRepository = useCompanyAmendmentRegisteredAddressStore()
  companyRepository = useCompanyStore()

  constructor(props: IPropsResolutionDocument<CompanyAmendmentRegisteredAddress>, emitEvents: any | null) {
    super(
      props.companyId,
      props.applicationId,
      props.application,
      CompanyAmendmentRegisteredAddress,
      props.isInPreviewMode,
      true,
      false,
      props.showWatermark,
      props.watermarkText,
      emitEvents
    )
  }

  async fetchApplication(id: string): Promise<void> {
    let response = await this.companyAmendmentRegisteredAddressRepository.fetch(id)
    if (!this.companyAmendmentRegisteredAddressRepository.error) {
      this.application.value = new CompanyAmendmentRegisteredAddress(response)
      this.initializeData()
    }
  }

  async setApplication(): Promise<void> {
    let company = await this.companyRepository.fetch(this.companyId.value)
    if (!this.companyRepository.error) {
      this.application.value = new CompanyAmendmentRegisteredAddress()
      this.application.value.companyId = this.companyId.value
      this.application.value.company = new Company(company)
      this.initializeData()
    }
  }

  async fetchDocumentTemplate(): Promise<void> {
    // do nothing
  }

  async otherDataInitiation(): Promise<void> {
    // do nothing
  }

  setContent(): void {
    //
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
      this.application.value = new CompanyAmendmentRegisteredAddress()
    }

    this.application.value.newRegisteredAddressLocation.addressLine1 = newVal
  }

  handleAddressLine2Change(newVal: string): void {
    if (!this.application.value) {
      this.application.value = new CompanyAmendmentRegisteredAddress()
    }

    this.application.value.newRegisteredAddressLocation.addressLine2 = newVal
  }

  handlePostcodeChange(newVal: string): void {
    if (!this.application.value) {
      this.application.value = new CompanyAmendmentRegisteredAddress()
    }

    this.application.value.newRegisteredAddressLocation.postcode = newVal
  }

  handleCityChange(newVal: City): void {
    if (!this.application.value) {
      this.application.value = new CompanyAmendmentRegisteredAddress()
    }

    this.application.value.newRegisteredAddressLocation.city = new City(newVal)
  }

  handleStateChange(newVal: State): void {
    if (!this.application.value) {
      this.application.value = new CompanyAmendmentRegisteredAddress()
    }

    this.application.value.newRegisteredAddressLocation.state = new State(newVal)
  }

  handleCountryChange(newVal: Country): void {
    if (!this.application.value) {
      this.application.value = new CompanyAmendmentRegisteredAddress()
    }

    this.application.value.newRegisteredAddressLocation.country = new Country(newVal)
  }

  getOldAddress(): string {
    if (!this.application.value) {
      return ""
    }

    if (!StringUtil.isNullOrEmpty(this.application.value.oldRegisteredAddressLocation.id)) {
      return this.application.value.oldRegisteredAddressLocation.getMultilineAddress()
    }

    return this.application.value.company?.registeredAddressLocation?.getMultilineAddress() ?? ""
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

    return this.application.value.newRegisteredAddressLocation.getMultilineAddress()
  }

  signatureDate(): string {
    if (!this.application.value) {
      return `<span class="placeholder">to be determined by iCompany</span>`
    }

    let time = useLocalTime()

    if (this.application.value.signatureGroups.length <= 0) {
      return `<span class="placeholder">to be determined by iCompany</span>`
    }

    let sorted = ObjectUtil.sort<SignatureGroup>(this.application.value.signatureGroups, "createdAt", "desc")

    return time.formatDateOnlyFull(sorted[0].createdAt ?? "")
  }
}
