import { File } from "./File"

export class CompanyStrikingOffDocument {
  companyId: string = ""
  strikingOffId: string = ""
  type: string = ""
  file: File = new File()
  createdAt: string | null = null
  updatedAt: string | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CompanyStrikingOffDocument) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.companyId = data.company_id
    this.strikingOffId = data.striking_off_id
    this.type = data.type
    this.file = new File(data.file)
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
  }

  clone(data: CompanyStrikingOffDocument): void {
    this.companyId = data.companyId
    this.strikingOffId = data.strikingOffId
    this.type = data.type
    this.file = new File(data.file)
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }
}
