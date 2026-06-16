import { Application } from "~/scripts/models/Application"
import { StringUtil } from "../utils/String"
import { Error } from "../library/Error"
import type { IModelApplication } from "./IModelApplication"

export class CompanyLoanApplication
  extends Application
  implements IModelApplication<CompanyLoanApplication, ReturnType<typeof useCompanyLoanApplicationStore>>
{
  loanProvider: string = ""
  applicationDetails: any = null
  initiatedBy: string = ""
  shippedAt: string = ""
  trackingUrl: string = ""
  trackingNumber: string = ""

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyLoanApplication) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.loanProvider = data.loan_provider
    this.initiatedBy = data.initiated_by
    this.shippedAt = data.shipped_at
    this.trackingUrl = data.tracking_url
    this.trackingNumber = data.tracking_number

    this.setApplicationDetails(data.application_details)
  }

  cloneDetails(data: CompanyLoanApplication): void {
    super.clone(data)
    this.loanProvider = data.loanProvider
    this.initiatedBy = data.initiatedBy
    this.shippedAt = data.shippedAt
    this.trackingUrl = data.trackingUrl
    this.trackingNumber = data.trackingNumber

    this.setApplicationDetails(data.applicationDetails)
  }

  setApplicationDetails(applicationDetails: any): void {
    this.applicationDetails = applicationDetails
  }

  getRequestBody(): object {
    return {
      company_id: this.companyId,
      loan_provider: this.loanProvider,
      application_details: null,
    }
  }

  canSubmit(): boolean {
    return !StringUtil.isNullOrEmpty(this.companyId) && !StringUtil.isNullOrEmpty(this.loanProvider)
  }

  async create(repository: ReturnType<typeof useCompanyLoanApplicationStore>): Promise<void> {
    if (!this.canSubmit()) {
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

  async update(repository: ReturnType<typeof useCompanyLoanApplicationStore>): Promise<void> {
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

  async remove(repository: ReturnType<typeof useCompanyLoanApplicationStore>): Promise<void> {
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
