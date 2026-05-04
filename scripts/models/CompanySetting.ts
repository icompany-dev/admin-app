import _ from 'lodash'
import type { IModel } from "./IModel"

export class CompanySetting implements IModel<CompanySetting> {
  id: string = ''
  annualReturnDay: number | null = null
  annualReturnMonth: number | null = null
  auditDay: number | null = null
  auditMonth: number | null = null
  epfNumber: string | null = null
  taxCodeNumber: string | null = null
  epf: object | null = null
  socso: object | null = null
  tax: object | null = null
  trademark: object | null = null
  createdAt: string | null = null
  updatedAt: string | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CompanySetting) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.annualReturnDay = data.annual_return_day ?? null
    this.annualReturnMonth = data.annual_return_month ?? null
    this.auditDay = data.audit_day ?? null
    this.auditMonth = data.audit_month ?? null
    this.epfNumber = data.epf_number ?? null
    this.taxCodeNumber = data.tax_code_number ?? null
    this.epf = data.epf ? _.cloneDeep(data.epf) : null
    this.socso = data.socso ? _.cloneDeep(data.socso) : null
    this.tax = data.tax ? _.cloneDeep(data.tax) : null
    this.trademark = data.trademark
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
  }
  
  clone(data: CompanySetting): void {
    this.id = data.id
    this.annualReturnDay = data.annualReturnDay
    this.annualReturnMonth = data.annualReturnMonth
    this.auditDay = data.auditDay
    this.auditMonth = data.auditMonth
    this.epfNumber = data.epfNumber
    this.taxCodeNumber = data.taxCodeNumber
    this.epf = data.epf ? _.cloneDeep(data.epf) : null
    this.socso = data.socso ? _.cloneDeep(data.socso) : null
    this.tax = data.tax ? _.cloneDeep(data.tax) : null
    this.trademark = data.trademark
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }
  
  getRequestBody(): object {
    // At the moment, we don't allow the users to change the values here
    return {}
  }
}