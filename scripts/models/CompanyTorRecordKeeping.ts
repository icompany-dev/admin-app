export class CompanyTorRecordKeeping {
  id: string = ""
  companyTermsOfReferenceId: string = ""
  isMinutesWithDeliberations: boolean = false
  isElectronicRecordsAcceptable: boolean = false
  createdAt: string | null = null
  updatedAt: string | null = null
  deletedAt: string | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CompanyTorRecordKeeping) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.companyTermsOfReferenceId = data.tor_id
    this.isMinutesWithDeliberations = data.is_minutes_with_deliberations
    this.isElectronicRecordsAcceptable = data.is_electronic_records_acceptable
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
    this.deletedAt = data.deleted_at
  }

  clone(data: CompanyTorRecordKeeping): void {
    this.id = data.id
    this.companyTermsOfReferenceId = data.companyTermsOfReferenceId
    this.isMinutesWithDeliberations = data.isMinutesWithDeliberations
    this.isElectronicRecordsAcceptable = data.isElectronicRecordsAcceptable
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
    this.deletedAt = data.deletedAt
  }

  getRequestBody(): object {
    return {
      tor_id: this.companyTermsOfReferenceId,
      is_minutes_with_deliberations: this.isMinutesWithDeliberations,
      is_electronic_records_acceptable: this.isElectronicRecordsAcceptable,
    }
  }
}
