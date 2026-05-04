import { PaymentConstants } from "../constants/Payment"
import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"
import { BillingInfo } from "./BillingInfo"
import { DeliveryInfo } from "./DeliveryInfo"
import type { IModel } from "./IModel"
import { PaymentCartItem } from "./PaymentCartItem"
import { User } from "./User"

export class PaymentCart implements IModel<PaymentCart> {
  id: string = ""
  entityType: string | null = null
  entityId: string | null = null
  billingInfo: BillingInfo = new BillingInfo()
  deliveryInfo: DeliveryInfo = new DeliveryInfo()
  total: number = 0.0
  totalSst: number = 0.0
  totalDst: number = 0.0
  items: PaymentCartItem[] = []
  status: string = PaymentConstants.PAYMENT_CART_STATUS_PENDING
  assignTo: User | null = null
  createdAt: string = ""
  updatedAt: string = ""

  //UI values, not from database
  entityName: string = ""
  entityNameType: string = ""

  redirectUrl: string = `${window.location.origin}/transactions` //redirect to transactions page

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof PaymentCart) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.entityType = data.entity_type.toLowerCase()
    this.entityId = data.entity_id
    this.billingInfo = new BillingInfo(data)
    this.deliveryInfo = new DeliveryInfo(data)
    this.total = data.total
    this.totalSst = data.total_sst
    this.totalDst = data.total_dst
    this.items =
      data.items && Array.isArray(data.items)
        ? data.items.map((item: any) => {
            return new PaymentCartItem(item)
          })
        : []
    this.status = data.status
    this.assignTo = data.assign_to !== null ? new User(data.assign_to) : null
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
  }

  clone(data: PaymentCart): void {
    this.id = data.id
    this.entityType = data.entityType
    this.entityId = data.entityId
    this.billingInfo = new BillingInfo(data.billingInfo)
    this.deliveryInfo = new DeliveryInfo(data.deliveryInfo)
    this.total = data.total
    this.totalSst = data.totalSst
    this.totalDst = data.totalDst
    this.items =
      data.items && Array.isArray(data.items)
        ? data.items.map((item: PaymentCartItem) => {
            return new PaymentCartItem(item)
          })
        : []
    this.status = data.status
    this.assignTo = data.assignTo !== null ? new User(data.assignTo) : null
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt

    this.entityName = data.entityName
    this.entityNameType = data.entityNameType

    this.redirectUrl = data.redirectUrl
  }

  getRequestBody(): object {
    return {
      entity_type: this.entityType,
      entity_id: this.entityId,
      ...this.billingInfo.getRequestBody(),
      delivery: this.deliveryInfo.getRequestBody(),
      total: this.total,
      items: this.items.map((item: PaymentCartItem) => {
        return item.getRequestBody()
      }),
    }
  }

  canSubmit(): boolean {
    return (
      !StringUtil.isNullOrEmpty(this.entityType) &&
      !StringUtil.isNullOrEmpty(this.entityId) &&
      this.billingInfo.canSubmit() &&
      this.deliveryInfo.canSubmit() &&
      this.items.every((item: PaymentCartItem) => {
        return item.canSubmit()
      })
    )
  }

  isItemInCart(targetType: string, targetId: string): boolean {
    return this.items.some((item: PaymentCartItem) => {
      return item.targetType === targetType && item.targetId === targetId
    })
  }

  async create(repository: ReturnType<typeof usePaymentCartStore>): Promise<void> {
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

  async update(repository: ReturnType<typeof usePaymentCartStore>): Promise<void> {
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

  async remove(repository: ReturnType<typeof usePaymentCartStore>): Promise<void> {
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

  totalDiscount(): number {
    return this.items.reduce((totalDiscount: number, item: PaymentCartItem) => {
      totalDiscount += Number(item.discountAmount)
      return totalDiscount
    }, 0)
  }
}
