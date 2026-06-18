import { File } from "./File"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"

export class CompanyNameReservation {
  id: string = ""
  amendmentId: string = ""
  proposedName: string = ""
  nameType: string = ""
  description: string = ""
  supportingDocumentId: string = ""
  supportingDocument: File | null = null
  status: string = ""
  paidAt: string = ""
  submittedAt: string = ""
  approvedAt: string = ""
  rejectedAt: string = ""
  rejectionReason: string = ""
  createdAt: string = ""
  updatedAt: string = ""
  deletedAt: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CompanyNameReservation) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.amendmentId = data.amendment_id
    this.proposedName = data.proposed_name
    this.nameType = data.name_type
    this.description = data.description
    this.supportingDocumentId = data.supporting_document_id
    this.supportingDocument = data.supporting_document ? new File(data.supporting_document) : null
    this.status = data.status
    this.paidAt = data.paid_at
    this.submittedAt = data.submitted_at
    this.approvedAt = data.approved_at
    this.rejectedAt = data.rejected_at
    this.rejectionReason = data.rejection_reason
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
    this.deletedAt = data.deleted_at
  }

  clone(data: CompanyNameReservation): void {
    this.id = data.id
    this.amendmentId = data.amendmentId
    this.proposedName = data.proposedName
    this.nameType = data.nameType
    this.description = data.description
    this.supportingDocumentId = data.supportingDocumentId
    this.supportingDocument = data.supportingDocument ? new File(data.supportingDocument) : null
    this.status = data.status
    this.paidAt = data.paidAt
    this.submittedAt = data.submittedAt
    this.approvedAt = data.approvedAt
    this.rejectedAt = data.rejectedAt
    this.rejectionReason = data.rejectionReason
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
    this.deletedAt = data.deletedAt
  }

  getRequestBody(): object {
    return {
      amendment_id: this.amendmentId,
      proposed_name: this.proposedName,
      name_type: this.nameType,
      description: this.description,
      supporting_document_id: this.supportingDocumentId,
      status: this.status,
    }
  }

  canSubmit(): boolean {
    return !StringUtil.isNullOrEmpty(this.amendmentId)
  }

  async create(repository: ReturnType<typeof useCompanyNameReservationStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.amendmentId)) {
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

  async update(repository: ReturnType<typeof useCompanyNameReservationStore>): Promise<void> {
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

  async remove(repository: ReturnType<typeof useCompanyNameReservationStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error = new Error()
      error.setForIncompleteData()
      throw error
    }

    const response = await repository.remove(this.id)
    if (repository.error) {
      let error = new Error()
      error.setForCUD()
      throw error
    }

    return response
  }
}
