export class AdminToDo {
  id: string = "" // this is an application id
  type: string = ""
  customType: string = ""
  name: string = ""
  companyName: string = ""
  companyId: string = ""
  signatureStatus: string = ""
  otherDetails: string = ""
  status: string = ""
  paidAt: string = ""
  createdAt: string = ""
  updatedAt: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof AdminToDo) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.type = data.type
    this.customType = data.custom_type
    this.name = data.name
    this.companyName = data.company_name
    this.companyId = data.company_id
    this.signatureStatus = data.signature_status
    this.otherDetails = data.other_details
    this.status = data.status
    this.paidAt = data.paid_at
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
  }

  clone(data: AdminToDo): void {
    this.id = data.id
    this.type = data.type
    this.customType = data.customType
    this.name = data.name
    this.companyName = data.companyName
    this.companyId = data.companyId
    this.signatureStatus = data.signatureStatus
    this.otherDetails = data.otherDetails
    this.status = data.status
    this.paidAt = data.paidAt
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }
}
