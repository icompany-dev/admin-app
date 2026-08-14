import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"
import { BillingInfo } from "./BillingInfo"
import type { IModel } from "./IModel"
import type { PaymentBill } from "./PaymentBill"
import { PaymentOrderItem } from "./PaymentOrderItem"
import type { PaymentOrderItemOptional } from "./PaymentOrderItemOptional"

export class PaymentOrder implements IModel<PaymentOrder> {
  id: string = ""
  paymentCartId: string = ""
  referenceNumber: string = ""
  entityType: string = ""
  entityId: string = ""
  billingInfo: BillingInfo = new BillingInfo()
  items: PaymentOrderItem[] = []
  total: number = 0
  totalSst: number = 0
  totalDst: number = 0
  paymentBillId: number | null = null
  paymentMethod: string = ""
  status: string = ""
  paidAt: string | null = null
  paidBy: string | null = null
  createdAt: string | null = null
  updatedAt: string | null = null

  redirectUrl: string = `${window.location.origin}/transactions` //redirect to transactions page

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof PaymentOrder) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.paymentCartId = data.payment_cart_id
    this.referenceNumber = data.reference_number
    this.entityType = data.entity_type
    this.entityId = data.entity_id
    this.billingInfo = new BillingInfo(data)
    this.items =
      data.items && Array.isArray(data.items)
        ? data.items.map((item: any) => {
            return new PaymentOrderItem(item)
          })
        : []
    this.total = data.total
    this.totalSst = data.total_sst
    this.totalDst = data.total_dst
    this.paymentBillId = data.payment_bill_id
    this.paymentMethod = data.payment_method
    this.status = data.status
    this.paidAt = data.paid_at
    this.paidBy = data.paid_by
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
  }

  clone(data: PaymentOrder): void {
    this.id = data.id
    this.paymentCartId = data.paymentCartId
    this.referenceNumber = data.referenceNumber
    this.entityType = data.entityType
    this.entityId = data.entityId
    this.billingInfo = new BillingInfo(data.billingInfo)
    this.items = data.items.map((item: PaymentOrderItem) => {
      return new PaymentOrderItem(item)
    })
    this.total = data.total
    this.totalSst = data.totalSst
    this.totalDst = data.totalDst
    this.paymentBillId = data.paymentBillId
    this.paymentMethod = data.paymentMethod
    this.status = data.status
    this.paidAt = data.paidAt
    this.paidBy = data.paidBy
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  getRequestBody(): object {
    return {
      payment_cart_id: this.paymentCartId,
      payment_method: this.paymentMethod,
      redirect_url: this.redirectUrl,
      items: this.items.map((d: PaymentOrderItem) => {
        return d.getRequestBody()
      }),
      optionals: this.items.reduce(
        (acc, item: PaymentOrderItem) => {
          acc[item.id] = item.optionals.map((opt: PaymentOrderItemOptional) => {
            return opt.getRequestBody()
          })
          return acc
        },
        {} as Record<string, any>
      ),
    }
  }

  canSubmit(): boolean {
    return !StringUtil.isNullOrEmpty(this.paymentCartId) && !StringUtil.isNullOrEmpty(this.paymentMethod)
  }

  async makePayment(repository: ReturnType<typeof usePaymentOrderStore>): Promise<PaymentBill | null> {
    if (!this.canSubmit()) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.makePayment(data)
    if (repository.error) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    return response
  }

  async create(repository: ReturnType<typeof usePaymentOrderStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.paymentCartId)) {
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

  totalDiscount(): number {
    return this.items.reduce((totalDiscount: number, item: PaymentOrderItem) => {
      totalDiscount += Number(item.discountAmount)
      return totalDiscount
    }, 0)
  }
}
