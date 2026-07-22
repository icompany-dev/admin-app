import { CompanyConstants } from "../constants/Company"
import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"
import { Application } from "./Application"
import { CompanyBranch } from "./CompanyBranch"
import type { IModelApplication } from "./IModelApplication"
import { Location } from "./Location"
import { useCompanyAmendmentBranchStore } from "~/stores/CompanyAmendmentBranches"

export class CompanyAmendmentBranch
  extends Application
  implements IModelApplication<CompanyAmendmentBranch, ReturnType<typeof useCompanyAmendmentBranchStore>>
{
  refNo: string = ""
  type: string = CompanyConstants.AMENDMENT_BRANCH_TYPE_ADD
  name: string = "Branch Name"
  description: string | null = null
  location: Location = new Location()
  companyBranchId: string | null = null
  companyBranchToChange: CompanyBranch | null = null

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyAmendmentBranch) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.refNo = data.refNo
    this.type = data.type
    this.name = data.name
    this.description = data.description
    this.location = new Location(data.location)
    this.companyBranchToChange = data.company_branch ? new CompanyBranch(data.company_branch) : null
    this.companyBranchId = data.company_branch?.id ?? null
  }

  cloneDetails(data: CompanyAmendmentBranch): void {
    super.clone(data)
    this.refNo = data.refNo
    this.type = data.type
    this.name = data.name
    this.description = data.description
    this.location = new Location(data.location)
    this.companyBranchToChange = data.companyBranchToChange ? new CompanyBranch(data.companyBranchToChange) : null
    this.companyBranchId = data.companyBranchId
  }

  getRequestBody(): object {
    let data: any = {
      company_id: this.companyId,
      type: this.type,
    }

    switch (this.type) {
      case CompanyConstants.AMENDMENT_BRANCH_TYPE_ADD:
        if (this.location.canCreate()) {
          data.location = this.location.getRequestBody()
        }
        if (!StringUtil.isNullOrEmpty(this.location.addressLine1)) {
          data.name = this.location.addressLine1
        }
        return data
      case CompanyConstants.AMENDMENT_BRANCH_TYPE_REMOVE:
        if (!StringUtil.isNullOrEmpty(this.companyBranchToChange?.location?.addressLine1 ?? "")) {
          data.name = this.companyBranchToChange?.location?.addressLine1 ?? ""
        }
        if (!StringUtil.isNullOrEmpty(this.companyBranchId ?? "")) {
          data.company_branch_id = this.companyBranchId
        }
        return data
      case CompanyConstants.AMENDMENT_BRANCH_TYPE_CHANGE:
        if (this.location.canCreate()) {
          data.location = this.location.getRequestBody()
        }
        if (!StringUtil.isNullOrEmpty(this.location.addressLine1)) {
          data.name = this.location.addressLine1
        }
        if (!StringUtil.isNullOrEmpty(this.companyBranchId ?? "")) {
          data.company_branch_id = this.companyBranchId
        }
        return data
      default:
        if (this.location.canCreate()) {
          data.location = this.location.getRequestBody()
        }
        if (!StringUtil.isNullOrEmpty(this.location.addressLine1)) {
          data.name = this.location.addressLine1
        }
        if (!StringUtil.isNullOrEmpty(this.companyBranchId ?? "")) {
          data.company_branch_id = this.companyBranchId
        }
        return data
    }
  }

  canSubmit(): boolean {
    if (StringUtil.isNullOrEmpty(this.type) || StringUtil.isNullOrEmpty(this.companyId)) {
      return false
    }

    switch (this.type) {
      case CompanyConstants.AMENDMENT_BRANCH_TYPE_ADD:
        return this.location.canCreate()
      case CompanyConstants.AMENDMENT_BRANCH_TYPE_REMOVE:
        return !StringUtil.isNullOrEmpty(this.companyBranchId)
      case CompanyConstants.AMENDMENT_BRANCH_TYPE_CHANGE:
        return this.location.canCreate() && !StringUtil.isNullOrEmpty(this.companyBranchId)
      default:
        return false
    }
  }

  getTypeName(): string {
    switch (this.type) {
      case CompanyConstants.AMENDMENT_BRANCH_TYPE_ADD:
        return CompanyConstants.AMENDMENT_BRANCH_TYPE_ADD_LABEL
      case CompanyConstants.AMENDMENT_BRANCH_TYPE_CHANGE:
        return CompanyConstants.AMENDMENT_BRANCH_TYPE_CHANGE_LABEL
      case CompanyConstants.AMENDMENT_BRANCH_TYPE_REMOVE:
        return CompanyConstants.AMENDMENT_BRANCH_TYPE_REMOVE_LABEL
      default:
        return CompanyConstants.AMENDMENT_BRANCH_TYPE_ADD_LABEL
    }
  }

  async create(repository: ReturnType<typeof useCompanyAmendmentBranchStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId)) {
      let error: Error = new Error()
      error.setForIncompleteData()
      throw error
    }

    let data = {
      company_id: this.companyId,
      type: this.type,
      name: this.name,
    }
    const response = await repository.create(data)
    if (repository.error) {
      let error: Error = new Error()
      error.setForCUD()
      throw error
    }

    this.convertFromResponseDetails(response)
  }

  async update(repository: ReturnType<typeof useCompanyAmendmentBranchStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id) || !this.canSubmit()) {
      let error: Error = new Error()
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.update(this.id, data)
    if (repository.error) {
      let error: Error = new Error()
      error.setForCUD()
      throw error
    }

    this.convertFromResponseDetails(response)
  }

  async remove(repository: ReturnType<typeof useCompanyAmendmentBranchStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error()
      error.setForIncompleteData()
      throw error
    }

    const response = await repository.remove(this.id)
    if (repository.error) {
      let error: Error = new Error()
      error.setForCUD()
      throw error
    }

    return response
  }
}
