import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"
import { Application } from "./Application"
import type { IModelApplication } from "./IModelApplication"

export class CompanyDirectorPayment
  extends Application
  implements IModelApplication<CompanyDirectorPayment, ReturnType<typeof useCompanyDirectorPaymentStore>>
{
  typeOfPayment: string | null = ""
  amount: number = 0
  financialYearEndDate: string | null = ""
  expireAt: string | null = ""

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyDirectorPayment) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.typeOfPayment = data.type_of_payment ?? null
    this.amount = Number(data.amount) ?? null
    this.financialYearEndDate = data.financial_year_end_date ?? null
    this.expireAt = data.expire_at ?? null
  }

  cloneDetails(data: CompanyDirectorPayment): void {
    super.clone(data)
    this.typeOfPayment = data.typeOfPayment
    this.amount = data.amount
    this.financialYearEndDate = data.financialYearEndDate
    this.expireAt = data.expireAt
  }

  getRequestBody(): object {
    return {
      company_id: this.companyId,
      type_of_payment: this.typeOfPayment,
      amount: this.amount,
      financial_year_end_date: this.financialYearEndDate,
      expire_at: this.expireAt,
      status: this.status,
    }
  }

  canSubmit(): boolean {
    return (
      !StringUtil.isNullOrEmpty(this.companyId) &&
      !StringUtil.isNullOrEmpty(this.financialYearEndDate) &&
      this.amount > 0
    )
  }

  async create(repository: ReturnType<typeof useCompanyDirectorPaymentStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId)) {
      let error = new Error()
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.create(data)
    if (repository.error) {
      let error = new Error()
      error.setForCUD()
      throw error
    }

    this.convertFromResponseDetails(response)
  }

  async update(repository: ReturnType<typeof useCompanyDirectorPaymentStore>): Promise<void> {
    if (!this.canSubmit() || StringUtil.isNullOrEmpty(this.id)) {
      let error = new Error()
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.update(this.id, data)
    if (repository.error) {
      let error = new Error()
      error.setForCUD()
      throw error
    }

    this.convertFromResponseDetails(response)
  }

  async remove(repository: ReturnType<typeof useCompanyDirectorPaymentStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error = new Error()
      error.setForCUD()
      throw error
    }

    const response = await repository.remove(this.id)
    if (repository.error) {
      let error = new Error()
      error.setForCUD()
      throw error
    }

    return response
  }
}
