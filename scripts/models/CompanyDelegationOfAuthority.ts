import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"
import { Application } from "./Application"
import { CompanyDelegateAuthorityTo } from "./CompanyDelegateAuthorityTo"
import type { IModelApplication } from "./IModelApplication"

export class CompanyDelegationOfAuthority
  extends Application
  implements IModelApplication<CompanyDelegationOfAuthority, ReturnType<typeof useCompanyDelegationOfAuthorityStore>>
{
  initiatorId: string = ""
  delegateTos: CompanyDelegateAuthorityTo[] = []

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyDelegationOfAuthority) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.initiatorId = data.initiator_id ?? ""
    this.delegateTos =
      data.delegate_tos.length > 0 ? data.delegate_tos.map((dt: any) => new CompanyDelegateAuthorityTo(dt)) : []
  }

  cloneDetails(data: CompanyDelegationOfAuthority): void {
    super.clone(data)
    this.initiatorId = data.initiatorId
    this.delegateTos = data.delegateTos.map((dt: CompanyDelegateAuthorityTo) => {
      return new CompanyDelegateAuthorityTo(dt)
    })
  }

  getRequestBody(): object {
    let data: any = {
      company_id: this.companyId,
      delegate_tos: this.delegateTos.map((dt: CompanyDelegateAuthorityTo) => {
        return dt.getRequestBody()
      }),
    }

    return data
  }

  canSubmit(): boolean {
    return (
      !StringUtil.isNullOrEmpty(this.companyId) &&
      this.delegateTos.length > 0 &&
      this.delegateTos.every((dt: CompanyDelegateAuthorityTo) => {
        return dt.canSubmit()
      })
    )
  }

  async create(repository: ReturnType<typeof useCompanyDelegationOfAuthorityStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId)) {
      let error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.create(data)
    if (repository.error) {
      let error = new Error(Error.ERROR_TYPE_API, repository.error)
      throw error
    }

    this.convertFromResponseDetails(response)
  }

  async update(repository: ReturnType<typeof useCompanyDelegationOfAuthorityStore>): Promise<void> {
    if (!this.canSubmit() || StringUtil.isNullOrEmpty(this.id)) {
      let error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.update(this.id, data)
    if (repository.error) {
      let error = new Error(Error.ERROR_TYPE_API, repository.error)
      throw error
    }

    this.convertFromResponseDetails(response)
  }

  async remove(repository: ReturnType<typeof useCompanyDelegationOfAuthorityStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error = new Error(
        Error.ERROR_TYPE_DATA,
        "Application ID is empty. Please create the application before removing."
      )
      throw error
    }

    const response = await repository.remove(this.id)
    if (repository.error) {
      let error = new Error(Error.ERROR_TYPE_API, repository.error)
      throw error
    }

    return response
  }
}
