import { StringUtil } from "../utils/String"
import { Error } from "../library/Error"

export class PaymentNotice {
  id: string = ""
  entityType: string = ""
  entityId: string = ""
  servicePricingId: string = ""
  servicePricing: string = ""
  deadline: string = ""
  target: string = ""
  targetId: string = ""
  remarks: string = "-"
  status: string = "pending"
  notifiedAt: string = ""
  notifiedBy: string = ""
  acknowledgedAt: string = ""
  acknowledgedBy: string = ""
  paidAt: string = ""
  paidBy: string = ""
  createdAt: string = ""
  updatedAt: string = ""
  deletedAt: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof PaymentNotice) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id ?? ""
    this.entityType = data.entity_type ?? ""
    this.entityId = data.entity_id ?? ""
    this.servicePricingId = data.service_pricing_id ?? ""
    this.servicePricing = data.service_pricing ?? ""
    this.deadline = data.deadline ?? ""
    this.target = data.target ?? ""
    this.targetId = data.target_id ?? ""
    this.remarks = data.remarks ?? ""
    this.status = data.status ?? ""
    this.notifiedAt = data.notified_at ?? ""
    this.notifiedBy = data.notified_by ?? ""
    this.acknowledgedAt = data.acknowledged_at ?? ""
    this.acknowledgedBy = data.acknowledged_by ?? ""
    this.paidAt = data.paid_at ?? ""
    this.paidBy = data.paid_by ?? ""
    this.createdAt = data.created_at ?? ""
    this.updatedAt = data.updated_at ?? ""
    this.deletedAt = data.deleted_at ?? ""
  }

  clone(data: PaymentNotice): void {
    this.id = data.id
    this.entityType = data.entityType
    this.entityId = data.entityId
    this.servicePricingId = data.servicePricingId
    this.servicePricing = data.servicePricing
    this.deadline = data.deadline
    this.target = data.target
    this.targetId = data.targetId
    this.remarks = data.remarks
    this.status = data.status
    this.notifiedAt = data.notifiedAt
    this.notifiedBy = data.notifiedBy
    this.acknowledgedAt = data.acknowledgedAt
    this.acknowledgedBy = data.acknowledgedBy
    this.paidAt = data.paidAt
    this.paidBy = data.paidBy
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
    this.deletedAt = data.deletedAt
  }

  getRequestBody(): object {
    return {
      entity_type: this.entityType,
      entity_id: this.entityId,
      service_pricing_id: this.servicePricingId,
      deadline: this.deadline,
      target: this.target,
      target_id: this.targetId,
      remarks: this.remarks,
      status: this.status,
      notified_at: this.notifiedAt,
      notified_by: this.notifiedBy,
      acknowledged_at: this.acknowledgedAt,
      acknowledged_by: this.acknowledgedBy,
    }
  }

  canSubmit(): boolean {
    return (
      !StringUtil.isNullOrEmpty(this.entityType) &&
      !StringUtil.isNullOrEmpty(this.entityId) &&
      !StringUtil.isNullOrEmpty(this.servicePricingId) &&
      !StringUtil.isNullOrEmpty(this.target) &&
      !StringUtil.isNullOrEmpty(this.targetId)
    )
  }

  async create(repository: ReturnType<typeof usePaymentNoticeStore>): Promise<void> {
    if (!this.canSubmit()) {
      let error: Error = new Error()
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.create(data)
    if (repository.error) {
      let error: Error = new Error()
      error.setForCUD()
      throw error
    }

    this.convertFromResponse(response)
  }

  async update(repository: ReturnType<typeof usePaymentNoticeStore>): Promise<void> {
    if (!this.canSubmit() || StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error()
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.update(this.id, data)
    if (repository.error) {
      let error: Error = new Error()
      error.setForCUD()
      throw error
    }

    this.convertFromResponse(response)
  }

  async remove(repository: ReturnType<typeof usePaymentNoticeStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error()
      error.setForIncompleteData()
      throw error
    }

    const response = await repository.remove(this.id)
    if (repository.error) {
      let error: Error = new Error()
      error.setForCUD()
      throw error
    }

    return response
  }

  async notify(repository: ReturnType<typeof usePaymentNoticeStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error()
      error.setForIncompleteData()
      throw error
    }

    const response = await repository.notify(this.id)
  }
}
