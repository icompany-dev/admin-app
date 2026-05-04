import { Application } from "./Application"
import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"
import type { IModelApplication } from "./IModelApplication"

export class CompanyDividendDeclaration
  extends Application
  implements IModelApplication<CompanyDividendDeclaration, ReturnType<typeof useCompanyDividendDeclarationStore>>
{
  refNo: string = ""
  dividendType: string = "Interim"
  shareType: string = "Ordinary"
  pricePerShare: number = 0
  amountInWords: string = ""
  amount: number = 0
  financialYearEndDate: string = ""
  dateOfRegisterOfMembers: string = ""
  dividendPaymentDate: string = ""
  dividendPaymentMethod: string = "Bank Transfer"

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyDividendDeclaration) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.refNo = data.ref_no ?? ""
    this.dividendType = data.dividend_type ?? "Interim"
    this.shareType = data.share_type ?? "Ordinary"
    this.pricePerShare = data.price_per_share ?? 0
    this.amountInWords = data.amount_in_words ?? ""
    this.amount = data.amount ?? 0
    this.financialYearEndDate = data.financial_year_end_date ?? ""
    this.dateOfRegisterOfMembers = data.date_of_register_of_members ?? ""
    this.dividendPaymentDate = data.dividend_payment_date ?? ""
    this.dividendPaymentMethod = data.dividend_payment_method ?? "Bank Transfer"
  }

  cloneDetails(data: CompanyDividendDeclaration): void {
    super.clone(data)
    this.refNo = data.refNo
    this.dividendType = data.dividendType
    this.shareType = data.shareType
    this.pricePerShare = data.pricePerShare
    this.amountInWords = data.amountInWords
    this.amount = data.amount
    this.financialYearEndDate = data.financialYearEndDate
    this.dateOfRegisterOfMembers = data.dateOfRegisterOfMembers
    this.dividendPaymentDate = data.dividendPaymentDate
    this.dividendPaymentMethod = data.dividendPaymentMethod
  }

  getRequestBody(): object {
    return {
      company_id: this.companyId,
      dividend_type: this.dividendType,
      share_type: this.shareType,
      price_per_share: this.pricePerShare,
      amount_in_words: this.amountInWords,
      amount: this.amount,
      financial_year_end: this.financialYearEndDate,
      date_of_registered_members: this.dateOfRegisterOfMembers,
      dividend_payment_date: this.dividendPaymentDate,
      dividend_payment_method: this.dividendPaymentMethod,
    }
  }

  canSubmit(): boolean {
    return true
  }

  async create(repository: ReturnType<typeof useCompanyDividendDeclarationStore>): Promise<void> {
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

  async update(repository: ReturnType<typeof useCompanyDividendDeclarationStore>): Promise<void> {
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

  async remove(repository: ReturnType<typeof useCompanyDividendDeclarationStore>): Promise<void> {
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
