import { Application } from "./Application"
import type { IModelApplication } from "./IModelApplication"
import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"

export class CompanyOfficialSeal
  extends Application
  implements IModelApplication<CompanyOfficialSeal, ReturnType<typeof useCompanyOfficialSealStore>>
{
  refNo: string = ""
  location: string = "" // name of country
  authorisedPersons: string = "" //single name
  withdrawnAt: string = ""

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyOfficialSeal) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.refNo = data.ref_no ?? ""
    this.location = data.location ?? ""
    this.authorisedPersons = data.authorised_persons ?? ""
    this.withdrawnAt = data.withdrawn_at ?? ""
  }

  cloneDetails(data: CompanyOfficialSeal): void {
    super.clone(data)
    this.refNo = data.refNo
    this.location = data.location
    this.authorisedPersons = data.authorisedPersons
    this.withdrawnAt = data.withdrawnAt
  }

  canSubmit(): boolean {
    return (
      !StringUtil.isNullOrEmpty(this.companyId) &&
      !StringUtil.isNullOrEmpty(this.location) &&
      !StringUtil.isNullOrEmpty(this.authorisedPersons)
    )
  }

  getRequestBody(): object {
    return {
      company_id: this.companyId,
      location: this.location,
      authorised_persons: this.authorisedPersons,
      status: this.status,
    }
  }

  async create(repository: ReturnType<typeof useCompanyOfficialSealStore>): Promise<void> {
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

  async update(repository: ReturnType<typeof useCompanyOfficialSealStore>): Promise<void> {
    if (!this.canSubmit() || StringUtil.isNullOrEmpty(this.id)) {
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

  async remove(repository: ReturnType<typeof useCompanyOfficialSealStore>): Promise<void> {
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
