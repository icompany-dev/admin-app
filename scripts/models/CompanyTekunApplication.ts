import { CompanyLoanApplication } from "./CompanyLoanApplication"

export class CompanyTekunApplication extends CompanyLoanApplication {
  constructor(data: any | null = null) {
    super(data)

    this.loanProvider = "tekun" // this is fixed. cannot change
  }

  override setApplicationDetails(data: any): void {
    this.applicationDetails = new CompanyTekunApplicationDetails(data)
  }

  override getRequestBody(): object {
    return {
      company_id: this.companyId,
      loan_provider: this.loanProvider,
      application_details: this.applicationDetails ? this.applicationDetails.getRequestBody() : null,
      status: this.status,
    }
  }
}

export class CompanyTekunApplicationDetails {
  address: string = ""
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
    this.address = data.address ?? ""
    this.authorisedPerson = data.authorised_person ? data.authorised_person : (data.authorisedPerson ?? "")
    this.documentDate = data.document_date ? data.document_date : (data.documentDate ?? "")
  }

  clone(data: CompanyTekunApplicationDetails): void {
    this.address = data.address
    this.authorisedPerson = data.authorisedPerson
    this.documentDate = data.documentDate
  }

  getRequestBody(): object {
    return {
      address: this.address,
      authorised_person: this.authorisedPerson,
      document_date: this.documentDate,
    }
  }
}
