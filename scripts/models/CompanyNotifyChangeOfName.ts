import { Application } from "./Application"
import type { IModelApplication } from "./IModelApplication"
import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"

export class CompanyNotifyChangeOfName
  extends Application
  implements IModelApplication<CompanyNotifyChangeOfName, ReturnType<typeof useCompanyNotifyChangeOfNameStore>>
{
  documentDate: string = ""
  toName: string = "The Branch Manager"
  bankName: string = ""
  branchName: string = ""
  branchAddress: string = ""
  previousName: string = ""
  currentName: string = ""
  registrationNumber: string = ""
  bankAccountNumber: string = ""
  directorName: string = ""

  constructor(data: any | null = null) {
    super()
    if (!data) {
      return
    }

    if (data instanceof CompanyNotifyChangeOfName) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.documentDate = data.document_date
    this.toName = data.to_name
    this.bankName = data.bank_name
    this.branchName = data.branch_name
    this.branchAddress = data.branch_address
    this.previousName = data.previous_name
    this.currentName = data.current_name
    this.registrationNumber = data.registration_number
    this.bankAccountNumber = data.bank_account_number
    this.directorName = data.director_name
  }

  cloneDetails(data: CompanyNotifyChangeOfName): void {
    super.clone(data)
    this.documentDate = data.documentDate
    this.toName = data.toName
    this.bankName = data.bankName
    this.branchName = data.branchName
    this.branchAddress = data.branchAddress
    this.previousName = data.previousName
    this.currentName = data.currentName
    this.registrationNumber = data.registrationNumber
    this.bankAccountNumber = data.bankAccountNumber
    this.directorName = data.directorName
  }

  getRequestBody(): object {
    return {
      company_id: this.companyId,
      document_date: this.documentDate,
      to_name: this.toName,
      bank_name: this.bankName,
      branch_name: this.branchName,
      branch_address: this.branchAddress,
      previous_name: this.previousName,
      current_name: this.currentName,
      registration_number: this.registrationNumber,
      bank_account_number: this.bankAccountNumber,
      director_name: this.directorName,
      status: this.status,
    }
  }

  canSubmit(): boolean {
    return (
      !StringUtil.isNullOrEmpty(this.companyId) &&
      !StringUtil.isNullOrEmpty(this.toName) &&
      !StringUtil.isNullOrEmpty(this.bankName) &&
      !StringUtil.isNullOrEmpty(this.branchName) &&
      !StringUtil.isNullOrEmpty(this.branchAddress) &&
      !StringUtil.isNullOrEmpty(this.previousName) &&
      !StringUtil.isNullOrEmpty(this.currentName) &&
      !StringUtil.isNullOrEmpty(this.registrationNumber) &&
      !StringUtil.isNullOrEmpty(this.bankAccountNumber) &&
      !StringUtil.isNullOrEmpty(this.directorName)
    )
  }

  async create(repository: ReturnType<typeof useCompanyNotifyChangeOfNameStore>): Promise<void> {
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

  async update(repository: ReturnType<typeof useCompanyNotifyChangeOfNameStore>): Promise<void> {
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

  async remove(repository: ReturnType<typeof useCompanyNotifyChangeOfNameStore>): Promise<void> {
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
