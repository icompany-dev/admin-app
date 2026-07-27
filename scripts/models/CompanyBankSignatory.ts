import { StringUtil } from "~/scripts/utils/String"

export class CompanyBankSignatory {
  id: string = ""
  name: string | null = null
  nationality: string | null = null //HLB requires this
  designation: string | null = null //HLB requires this
  email: string | null = null //HLB requires this
  phone: string | null = null //HLB requires this
  type: string | null = null
  identification: string | null = null
  role: string | null = null
  updatedAt: string | null = null
  createdAt: string | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CompanyBankSignatory) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.name = data.name
    this.nationality = data.nationality
    this.designation = data.designation
    this.email = data.email
    this.phone = data.phone
    this.type = data.type
    this.identification = data.identification
    this.role = data.role
    this.updatedAt = data.updated_at
    this.createdAt = data.created_at
  }

  clone(data: CompanyBankSignatory): void {
    this.id = data.id
    this.name = data.name
    this.nationality = data.nationality
    this.designation = data.designation
    this.email = data.email
    this.phone = data.phone
    this.type = data.type
    this.identification = data.identification
    this.role = data.role
    this.updatedAt = data.updatedAt
    this.createdAt = data.createdAt
  }

  getRequestBody(): object {
    return {
      name: this.name,
      nationality: this.nationality,
      designation: this.designation,
      email: this.email,
      phone: this.phone,
      type: this.type,
      identification: this.identification,
      role: this.role,
    }
  }

  canCreate(): boolean {
    return (
      !StringUtil.isNullOrEmpty(this.name) &&
      !StringUtil.isNullOrEmpty(this.type) &&
      !StringUtil.isNullOrEmpty(this.identification) &&
      !StringUtil.isNullOrEmpty(this.role)
    )
  }
}
