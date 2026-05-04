import { FormDocument } from "~/scripts/models/FormDocument"

export class FormDocumentBundleMapping {
  id: string = ""
  bundleId: string = ""
  formDocumentId: string = ""
  formDocument: FormDocument = new FormDocument()
  isOptional: boolean = false
  createdAt: string | null = null
  updatedAt: string | null = null
  deletedAt: string | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof FormDocumentBundleMapping) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.bundleId = data.bundle_id
    this.formDocumentId = data.form_document_id
    this.formDocument = new FormDocument(data.form_document)
    this.isOptional = data.is_optional
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
    this.deletedAt = data.deleted_at
  }

  clone(data: FormDocumentBundleMapping): void {
    this.id = data.id
    this.bundleId = data.bundleId
    this.formDocumentId = data.formDocumentId
    this.formDocument = new FormDocument(data.formDocument)
    this.isOptional = data.isOptional
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
    this.deletedAt = data.deletedAt
  }
}
