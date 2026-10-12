import { DocumentHandoverItem } from "./DocumentHandoverItem"
import { File } from "./File"
import { StringUtil } from "../utils/String"
import { Error } from "~/scripts/library/Error"

export class DocumentHandover {
  id: string = ""
  target: any | null = null // this is morphed, depending on the target
  targetType: string = ""
  targetId: string = ""
  items: DocumentHandoverItem[] = []
  isApiConnectionAvailable: boolean = false
  responsiblePerson: string = ""
  signatureId: string | null = null
  signature: File | null = null
  status: string = ""
  createdAt: string = ""
  updatedAt: string = ""
  deletedAt: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof DocumentHandover) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.target = data.target
    this.targetType = data.target_type
    this.targetId = data.target_id
    this.items =
      data.items && Array.isArray(data.items)
        ? data.items.map((d: any) => {
            return new DocumentHandoverItem(d)
          })
        : []
    this.isApiConnectionAvailable = data.is_api_connection_available ?? false
    this.responsiblePerson = data.responsible_person ?? ""
    this.signatureId = data.signature_id
    this.signature = data.signature ? new File(data.signature) : null
    this.status = data.status
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
    this.deletedAt = data.deleted_at
  }

  clone(data: DocumentHandover): void {
    this.id = data.id
    this.target = data.target
    this.targetType = data.targetType
    this.targetId = data.targetId
    this.items = data.items.map((d: DocumentHandoverItem) => {
      return new DocumentHandoverItem(d)
    })
    this.isApiConnectionAvailable = data.isApiConnectionAvailable
    this.responsiblePerson = data.responsiblePerson
    this.signatureId = data.signatureId
    this.signature = data.signature ? new File(data.signature) : null
    this.status = data.status
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
    this.deletedAt = data.deletedAt
  }

  getRequestBody(): object {
    return {
      target_type: this.targetType,
      target_id: this.targetId,
      items: this.items.map((d: DocumentHandoverItem) => {
        return d.getRequestBody()
      }),
      is_api_connection_available: this.isApiConnectionAvailable,
      responsible_person: this.responsiblePerson,
      signature_id: this.signatureId,
      status: this.status,
    }
  }

  canSubmit(): boolean {
    return !StringUtil.isNullOrEmpty(this.targetType) && !StringUtil.isNullOrEmpty(this.targetId)
  }

  async create(repository: ReturnType<typeof useDocumentHandoverStore>): Promise<void> {
    if (this.canSubmit()) {
      let error = new Error()
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.create(data)
    if (repository.error) {
      let error = new Error()
      error.setForCUD()
      throw error
    }

    this.convertFromResponse(response)
  }

  async update(repository: ReturnType<typeof useDocumentHandoverStore>): Promise<void> {
    if (!this.canSubmit() || StringUtil.isNullOrEmpty(this.id)) {
      let error = new Error()
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.update(this.id, data)
    if (repository.error) {
      let error = new Error()
      error.setForCUD()
      throw error
    }

    this.convertFromResponse(response)
  }

  async remove(repository: ReturnType<typeof useDocumentHandoverStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error = new Error()
      error.setForCUD()
      throw error
    }

    const response = await repository.remove(this.id)
    if (repository.error) {
      let error = new Error()

      throw error
    }

    return response
  }
}
