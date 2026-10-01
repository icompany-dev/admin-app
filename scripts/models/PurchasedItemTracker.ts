import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"

export class PurchasedItemTracker {
  id: string = ""
  targetType: string = ""
  targetId: string = ""
  target: any = null
  paymentOrderItemId: string = ""
  deliveryDetails: string = ""
  itemName: string = ""
  isThirdPartyPurchase: boolean = false
  paidAt: string = ""
  orderedAt: string = ""
  readiedAt: string = ""
  deliveredAt: string = ""
  deliveryAddress: string = ""
  trackingNumber: string = ""
  trackingUrl: string = ""
  status: string = "paid"
  createdAt: string = ""
  updatedAt: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof PurchasedItemTracker) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id ?? ""
    this.targetType = data.target_type ?? ""
    this.targetId = data.target_id ?? ""
    this.target = data.target ?? null
    this.paymentOrderItemId = data.payment_order_item_id ?? ""
    this.deliveryDetails = data.delivery_details ?? ""
    this.itemName = data.item_name ?? ""
    this.isThirdPartyPurchase = data.is_third_party_purchase ?? false
    this.paidAt = data.paid_at ?? ""
    this.orderedAt = data.ordered_at ?? ""
    this.readiedAt = data.readied_at ?? ""
    this.deliveredAt = data.delivered_at ?? ""
    this.deliveryAddress = data.delivery_address ?? ""
    this.trackingNumber = data.tracking_number ?? ""
    this.trackingUrl = data.tracking_url ?? ""
    this.status = data.status ?? ""
    this.createdAt = data.created_at ?? ""
    this.updatedAt = data.updated_at ?? ""
  }

  clone(data: any): void {
    this.id = data.id
    this.targetType = data.targetType
    this.targetId = data.targetId
    this.target = data.target
    this.paymentOrderItemId = data.paymentOrderItemId
    this.deliveryDetails = data.deliveryDetails
    this.itemName = data.itemName
    this.isThirdPartyPurchase = data.isThirdPartyPurchase
    this.paidAt = data.paidAt
    this.orderedAt = data.orderedAt
    this.readiedAt = data.readiedAt
    this.deliveredAt = data.deliveredAt
    this.deliveryAddress = data.deliveryAddress
    this.trackingNumber = data.trackingNumber
    this.trackingUrl = data.trackingUrl
    this.status = data.status
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  getRequestBody(): object {
    return {
      target_type: this.targetType,
      target_id: this.targetId,
      payment_order_item_id: this.paymentOrderItemId,
      delivery_details: this.deliveryDetails,
      item_name: this.itemName,
      is_third_party_purchase: this.isThirdPartyPurchase,
      paid_at: this.paidAt,
      ordered_at: this.orderedAt,
      readied_at: this.readiedAt,
      delivered_at: this.deliveredAt,
      delivery_address: this.deliveryAddress,
      tracking_number: this.trackingNumber,
      tracking_url: this.trackingUrl,
      status: this.status,
    }
  }

  canSubmit(): boolean {
    return (
      !StringUtil.isNullOrEmpty(this.targetType) &&
      !StringUtil.isNullOrEmpty(this.targetId) &&
      !StringUtil.isNullOrEmpty(this.paymentOrderItemId) &&
      !StringUtil.isNullOrEmpty(this.itemName) &&
      !StringUtil.isNullOrEmpty(this.paidAt) &&
      !StringUtil.isNullOrEmpty(this.status)
    )
  }

  async create(repository: ReturnType<typeof usePurchasedItemTrackerStore>): Promise<void> {
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

  async update(repository: ReturnType<typeof usePurchasedItemTrackerStore>): Promise<void> {
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

  async remove(repository: ReturnType<typeof usePurchasedItemTrackerStore>): Promise<void> {
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
}
