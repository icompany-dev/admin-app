import { CompanyLoanApplication } from "./CompanyLoanApplication"

export class CompanyTekunApplication extends CompanyLoanApplication {
  override applicationDetails: CompanyTekunApplicationDetails = new CompanyTekunApplicationDetails()

  constructor(data: any | null = null) {
    super(data)

    this.loanProvider = "tekun" // this is fixed. cannot change
  }

  override setApplicationDetails(data: any): void {
    this.applicationDetails = new CompanyTekunApplicationDetails(data.application_details)
  }

  override getRequestBody(): object {
    return {
      company_id: this.companyId,
      loan_provider: this.loanProvider,
      application_details: this.applicationDetails.getRequestBody(),
    }
  }
}

export class CompanyTekunApplicationDetails {
  authorisedPerson: string = ""
  documentDate: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CompanyTekunApplicationDetails) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.authorisedPerson = data.authorised_person ?? ""
    this.documentDate = data.document_date ?? ""
  }

  clone(data: CompanyTekunApplicationDetails): void {
    this.authorisedPerson = data.authorisedPerson
    this.documentDate = data.documentDate
  }

  getRequestBody(): object {
    return {
      authorised_person: this.authorisedPerson,
      document_date: this.documentDate,
    }
  }
}
