import { useCompanyAmendmentRegisteredAddressStore } from "~/stores/CompanyAmendmentRegisteredAddresses"
import { Application } from "./Application"
import { File } from "./File"
import type { IModelApplication } from "./IModelApplication"
import { Location } from "./Location"
import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"

export class CompanyAmendmentRegisteredAddress
  extends Application
  implements
    IModelApplication<CompanyAmendmentRegisteredAddress, ReturnType<typeof useCompanyAmendmentRegisteredAddressStore>>
{
  refNo: string = ""
  oldRegisteredAddressLocation: Location = new Location()
  newRegisteredAddressLocation: Location = new Location()
  tenancyAgreement: File | null = null

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyAmendmentRegisteredAddress) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.refNo = data.ref_no ?? ""
    this.oldRegisteredAddressLocation = new Location(data.from_address ?? null)
    this.newRegisteredAddressLocation = new Location(data.to_address ?? null)
    this.tenancyAgreement = data.tenancy_agreement ? new File(data.tenancy_agreement) : null
  }

  cloneDetails(data: CompanyAmendmentRegisteredAddress): void {
    super.clone(data)
    this.refNo = data.refNo
    this.oldRegisteredAddressLocation = new Location(data.oldRegisteredAddressLocation)
    this.newRegisteredAddressLocation = new Location(data.newRegisteredAddressLocation)
    this.tenancyAgreement = data.tenancyAgreement ? new File(data.tenancyAgreement) : null
  }

  getRequestBody(): object {
    return {
      company_id: this.companyId,
      to_address: this.newRegisteredAddressLocation.getRequestBody(),
      tenancy_agreement_id: this.tenancyAgreement?.id ?? null,
    }
  }

  canSubmit(): boolean {
    return !StringUtil.isNullOrEmpty(this.companyId)
  }

  async create(repository: ReturnType<typeof useCompanyAmendmentRegisteredAddressStore>): Promise<void> {
    if (!this.canSubmit()) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.create(data)
    if (repository.error) {
      let error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponseDetails(response)
  }

  async update(repository: ReturnType<typeof useCompanyAmendmentRegisteredAddressStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id) || !this.canSubmit()) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.update(this.id, data)
    if (repository.error) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponseDetails(response)
  }

  async remove(repository: ReturnType<typeof useCompanyAmendmentRegisteredAddressStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    const response = await repository.remove(this.id)
    if (repository.error) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    return response
  }
}
