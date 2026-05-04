import type { IModel } from "./IModel"

export class SearchCompliance implements IModel<SearchCompliance> {
  annualReturnCompliances: AnnualReturnCompliance[] = []
  financialStatementCompliances: FinancialStatementsCompliance[] = []
  subscriptionCompliances: SubscriptionCompliance[] = []

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof SearchCompliance) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.annualReturnCompliances = data.annual_return_compliance !== null && Array.isArray(data.annual_return_compliance)
      ? data.annual_return_compliance.map((arc: any) => {
        return new AnnualReturnCompliance(arc)
      })
      : []

    this.financialStatementCompliances = data.financial_statements_compliance !== null && Array.isArray(data.financial_statements_compliance)
      ? data.financial_statements_compliance.map((fsc: any) => {
        return new FinancialStatementsCompliance(fsc)
      })
      : []

    this.subscriptionCompliances = data.subscriptions.length !== null && Array.isArray(data.subscriptions)
      ? data.subscriptions.map((sc: any) => {
        return new SubscriptionCompliance(sc)
      })
      : []
  }

  clone(data: SearchCompliance): void {
    this.annualReturnCompliances = data.annualReturnCompliances
      .map((arc) => {
        return new AnnualReturnCompliance(arc)
      })

    this.financialStatementCompliances = data.financialStatementCompliances
      .map((fsc) => {
        return new FinancialStatementsCompliance(fsc)
      })
    
    this.subscriptionCompliances = data.subscriptionCompliances
      .map((sc) => {
        return new SubscriptionCompliance(sc)
      })
  }

  getRequestBody(): object {
    return {}
  }
}

export class AnnualReturnCompliance implements IModel<AnnualReturnCompliance> {
  companyId: string = ""
  companyName: string = ""
  registrationNumberOld: string = ""
  registrationNumberNew: string = ""
  incorporatedAt: string | null = null
  annualReturnDue: number[] = []


  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof AnnualReturnCompliance) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.companyId = data.company_id ?? ''
    this.companyName = data.company_name ?? ''
    this.registrationNumberOld = data.registration_number_old ?? ''
    this.registrationNumberNew = data.registration_number_new ?? ''
    this.incorporatedAt  = data.incorporated_at ?? null
    this.annualReturnDue = data.annual_return_due.length > 0
      ? data.annual_return_due.map((year: number) => {
        return year
      })
      : []
  }

  clone(data: AnnualReturnCompliance): void {
    this.companyId = data.companyId
    this.companyName = data.companyName
    this.registrationNumberOld = data.registrationNumberOld
    this.registrationNumberNew = data.registrationNumberNew
    this.incorporatedAt = data.incorporatedAt
    this.annualReturnDue = data.annualReturnDue.length > 0
      ? data.annualReturnDue.map((year: number) => {
        return year
      })
      : []
  }

  getRequestBody(): object {
    return {}
  }
}

export class FinancialStatementsCompliance implements IModel<FinancialStatementsCompliance> {
  companyId: string = ""
  companyName: string = ""
  registrationNumberOld: string = ""
  registrationNumberNew: string = ""
  incorporatedAt: string | null = null
  hasSetFye: boolean = false
  financialYearEnd: string | null = null
  financialStatementsDue: number[] = []

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof FinancialStatementsCompliance) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.companyId = data.company_id
    this.companyName = data.company_name
    this.registrationNumberOld = data.registration_number_old
    this.registrationNumberNew = data.registration_number_new
    this.incorporatedAt = data.incorporated_at
    this.hasSetFye = data.has_set_fye ?? false
    this.financialYearEnd = data.financial_year_end
    this.financialStatementsDue = data.financial_statements_due
  }

  clone(data: FinancialStatementsCompliance): void {
    this.companyId = data.companyId
    this.companyName = data.companyName
    this.registrationNumberOld = data.registrationNumberOld
    this.registrationNumberNew = data.registrationNumberNew
    this.incorporatedAt = data.incorporatedAt
    this.hasSetFye = data.hasSetFye
    this.financialYearEnd = data.financialYearEnd
    this.financialStatementsDue = data.financialStatementsDue
  }

  getRequestBody(): object {
    return {}
  }
}

export class SubscriptionCompliance implements IModel<SubscriptionCompliance> {
  companyId: string = ""
  companyName: string = ""
  registrationNumberOld: string = ""
  registrationNumberNew: string = ""
  incorporatedAt: string | null = null
  subscriptionEndDate: string | null = null
  status: string = ''
  isExpired: boolean = false


  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof SubscriptionCompliance) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.companyId = data.company_id
    this.companyName = data.company_name
    this.registrationNumberOld = data.registration_number_old
    this.registrationNumberNew = data.registration_number_new
    this.incorporatedAt = data.incorporated_at
    this.subscriptionEndDate = data.subscription_end_date
    this.status = data.status
    this.isExpired = data.is_expired
  }

  clone(data: SubscriptionCompliance): void {
    this.companyId = data.companyId
    this.companyName = data.companyName
    this.registrationNumberOld = data.registrationNumberOld
    this.registrationNumberNew = data.registrationNumberNew
    this.incorporatedAt = data.incorporatedAt
    this.subscriptionEndDate = data.subscriptionEndDate
    this.status = data.status
    this.isExpired = data.isExpired
  }

  getRequestBody(): object {
    return {}
  }
}
