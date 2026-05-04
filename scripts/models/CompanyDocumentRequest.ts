import { StatusConstants } from "../constants/Status"
import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"
import { Company } from "./Company"
import { CompanyDocumentRequestItem } from "./CompanyDocumentRequestItem"
import { User } from "./User"

export class CompanyDocumentRequest {
  id: string = ""
  companyId: string = ""
  company: Company = new Company()
  isCtcRequired: boolean = false
  isSsmCtcRequired: boolean = false
  isPriority: boolean = false
  items: CompanyDocumentRequestItem[] = []
  deliveryMethod: string = ""
  trackingUrl: string = ""
  trackingNumber: string = ""
  status: string = StatusConstants.DRAFT
  paidAt: string | null = null
  paidById: string | null = null
  paidBy: User | null = null
  shippedAt: string | null = null
  completedAt: string | null = null
  createdAt: string | null = null
  updatedAt: string | null = null
  deletedAt: string | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CompanyDocumentRequest) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.companyId = data.company_id
    this.company = new Company(data.company)
    this.isCtcRequired = data.is_ctc_required
    this.isSsmCtcRequired = data.is_ssm_ctc_required
    this.isPriority = data.is_priority
    this.items =
      data.items && Array.isArray(data.items)
        ? data.items.map((d: any) => {
            return new CompanyDocumentRequestItem(d)
          })
        : []
    this.deliveryMethod = data.delivery_method
    this.trackingUrl = data.tracking_url
    this.trackingNumber = data.tracking_number
    this.status = data.status
    this.paidAt = data.paid_at
    this.paidById = data.paid_by_id
    this.paidBy = data.paid_by
    this.shippedAt = data.shipped_at
    this.completedAt = data.completed_at
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
    this.deletedAt = data.deleted_at
  }

  clone(data: CompanyDocumentRequest): void {
    this.id = data.id
    this.companyId = data.companyId
    this.company = data.company
    this.isCtcRequired = data.isCtcRequired
    this.isSsmCtcRequired = data.isSsmCtcRequired
    this.isPriority = data.isPriority
    this.items = data.items.map((d: CompanyDocumentRequestItem) => {
      return new CompanyDocumentRequestItem(d)
    })
    this.deliveryMethod = data.deliveryMethod
    this.trackingUrl = data.trackingUrl
    this.trackingNumber = data.trackingNumber
    this.status = data.status
    this.paidAt = data.paidAt
    this.paidById = data.paidById
    this.paidBy = data.paidBy
    this.shippedAt = data.shippedAt
    this.completedAt = data.completedAt
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
    this.deletedAt = data.deletedAt
  }

  getRequestBody(): object {
    return {
      company_id: this.companyId,
      items: this.items.map((d: CompanyDocumentRequestItem) => {
        return d.getRequestBody()
      }),
      is_ctc_required: this.isCtcRequired,
      is_ssm_ctc_required: this.isSsmCtcRequired,
      is_priority: this.isPriority,
      status: this.status,
    }
  }

  canSubmit(): boolean {
    return !StringUtil.isNullOrEmpty(this.companyId) && this.items.length > 0
  }

  async create(repository: ReturnType<typeof useCompanyDocumentRequestStore>): Promise<void> {
    if (!this.canSubmit()) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.create(data)
    if (repository.error) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponse(response)
  }

  async update(repository: ReturnType<typeof useCompanyDocumentRequestStore>): Promise<void> {
    if (!this.canSubmit() || StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.update(this.id, data)
    if (repository.error) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponse(response)
  }

  async remove(repository: ReturnType<typeof useCompanyDocumentRequestStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    const response = await repository.remove(this.id)
    if (repository.error) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    return response
  }
}
