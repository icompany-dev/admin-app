import { useCompanyAmendmentAddressStore } from "~/stores/CompanyAmendmentAddresses"
import { Application } from "./Application"
import { File } from "./File"
import type { IModelApplication } from "./IModelApplication"
import { Location } from "./Location"
import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"

export class CompanyAmendmentAddress
  extends Application
  implements IModelApplication<CompanyAmendmentAddress, ReturnType<typeof useCompanyAmendmentAddressStore>>
{
  refNo: string = ""
  businessAddressLocation: Location = new Location()
  tenancyAgreement: File | null = null

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyAmendmentAddress) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.refNo = data.ref_no ?? ""
    this.businessAddressLocation = new Location(data.business_address_location ?? null)
    this.tenancyAgreement = data.tenancy_agreement ? new File(data.tenancy_agreement) : null
  }

  cloneDetails(data: CompanyAmendmentAddress): void {
    super.clone(data)
    this.refNo = data.refNo
    this.businessAddressLocation = new Location(data.businessAddressLocation)
    this.tenancyAgreement = data.tenancyAgreement ? new File(data.tenancyAgreement) : null
  }

  getRequestBody(): object {
    let data: any = {
      company_id: this.companyId,
    }

    if (this.businessAddressLocation.canCreate()) {
      data.business_address_location = this.businessAddressLocation.getRequestBody()
    }

    if (!StringUtil.isNullOrEmpty(this.tenancyAgreement?.id ?? "")) {
      data.tenancy_agreement_id = this.tenancyAgreement?.id
    }

    return data
  }

  canSubmit(): boolean {
    return !StringUtil.isNullOrEmpty(this.companyId)
    //return this.businessAddressLocation.canCreate()
  }

  async create(repository: ReturnType<typeof useCompanyAmendmentAddressStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.create(data)
    if (repository.error) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponseDetails(response)
  }

  async update(repository: ReturnType<typeof useCompanyAmendmentAddressStore>): Promise<void> {
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

  async remove(repository: ReturnType<typeof useCompanyAmendmentAddressStore>): Promise<void> {
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
