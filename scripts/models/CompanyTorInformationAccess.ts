export class CompanyTorInformationAccess {
  id: string = ""
  companyTermsOfReferenceId: string = ""
  canAccessCompanyInformation: boolean = false
  canRequestClarification: boolean = false
  canAccessRecordsFromCosec: boolean = false
  createdAt: string | null = null
  updatedAt: string | null = null
  deletedAt: string | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CompanyTorInformationAccess) {
      this.clone(data)
    } else {
      this.convertFromResponse
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.companyTermsOfReferenceId = data.tor_id
    this.canAccessCompanyInformation = data.can_access_company_information
    this.canRequestClarification = data.can_request_clarification
    this.canAccessRecordsFromCosec = data.can_access_records_from_cosec
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
    this.deletedAt = data.deleted_at
  }

  clone(data: CompanyTorInformationAccess): void {
    this.id = data.id
    this.companyTermsOfReferenceId = data.companyTermsOfReferenceId
    this.canAccessCompanyInformation = data.canAccessCompanyInformation
    this.canRequestClarification = data.canRequestClarification
    this.canAccessRecordsFromCosec = data.canAccessRecordsFromCosec
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
    this.deletedAt = data.deletedAt
  }

  getRequestBody(): object {
    return {
      id: this.id,
      tor_id: this.companyTermsOfReferenceId,
      can_access_company_information: this.canAccessCompanyInformation,
      can_request_clarification: this.canRequestClarification,
      can_access_records_from_cosec: this.canAccessRecordsFromCosec,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
      deleted_at: this.deletedAt,
    }
  }
}
