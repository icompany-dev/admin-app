import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"
import { Application } from "./Application"
import type { IModelApplication } from "./IModelApplication"

export class CompanyDirectorLoan
  extends Application
  implements IModelApplication<CompanyDirectorLoan, ReturnType<typeof useCompanyDirectorLoanStore>>
{
  refNo: string = ""
  hasConstitution: string = ""
  isSoleShareholder: string = ""
  loanAmount: number = 0.0
  directorIds: string[] = []
  directorNames: string[] = []
  initiatedBy: string = ""
  withdrawnAt: string = ""
  withdrawnBy: string = ""

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyDirectorLoan) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.refNo = data.ref_no
    this.hasConstitution = data.has_constitution
    this.isSoleShareholder = data.is_sole_shareholder
    this.loanAmount = Number(data.loan_amount)
    this.directorIds = data.director_ids ?? []
    this.directorNames = data.director_names ?? []
    this.initiatedBy = data.initiated_by
    this.withdrawnAt = data.withdrawn_at
    this.withdrawnBy = data.withdrawn_by
  }

  cloneDetails(data: CompanyDirectorLoan): void {
    super.clone(data)
    this.refNo = data.refNo
    this.hasConstitution = data.hasConstitution
    this.isSoleShareholder = data.isSoleShareholder
    this.loanAmount = Number(data.loanAmount)
    this.directorIds = data.directorIds
    this.directorNames = data.directorNames
    this.initiatedBy = data.initiatedBy
    this.withdrawnAt = data.withdrawnAt
    this.withdrawnBy = data.withdrawnBy
  }

  getRequestBody(): object {
    return {
      company_id: this.companyId,
      loan_amount: this.loanAmount,
      director_ids: this.directorIds,
      director_names: this.directorNames,
      status: this.status,
    }
  }

  canSubmit(): boolean {
    return !StringUtil.isNullOrEmpty(this.companyId) && this.directorNames.length > 0 && this.loanAmount > 0
  }

  async create(repository: ReturnType<typeof useCompanyDirectorLoanStore>): Promise<void> {
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

  async update(repository: ReturnType<typeof useCompanyDirectorLoanStore>): Promise<void> {
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

  async remove(repository: ReturnType<typeof useCompanyDirectorLoanStore>): Promise<void> {
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
