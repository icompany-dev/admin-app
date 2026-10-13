import { SwitchOutDocumentTypes } from "../constants/SwitchOuts"

export class DocumentHandoverItem {
  id: string = ""
  handoverId: string = ""
  documentName: string = ""
  documentType: string = SwitchOutDocumentTypes.StatutoryRecords
  isIncoming: string = ""
  remarks: string = ""
  createdAt: string = ""
  updatedAt: string = ""
  deletedAt: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof DocumentHandoverItem) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.handoverId = data.handover_id
    this.documentName = data.document_name
    this.documentType = data.document_type
    this.isIncoming = data.is_incoming
    this.remarks = data.remarks
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
    this.deletedAt = data.deleted_at
  }

  clone(data: DocumentHandoverItem): void {
    this.id = data.id
    this.handoverId = data.handoverId
    this.documentName = data.documentName
    this.documentType = data.documentType
    this.isIncoming = data.isIncoming
    this.remarks = data.remarks
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
    this.deletedAt = data.deletedAt
  }

  getRequestBody(): object {
    return {
      handover_id: this.handoverId,
      document_name: this.documentName,
      document_type: this.documentType,
      is_incoming: this.isIncoming,
      remarks: this.remarks,
    }
  }
}
