import type { IModel } from "./IModel"
import { ProductDocumentTemplate } from "./ProductDocumentTemplate"
import { StringUtil } from "../utils/String"
import { Error } from "../library/Error"
import { ServicePricing } from "./ServicePricing"

export class PurchasedDocumentTemplate implements IModel<PurchasedDocumentTemplate> {
  id: string = ""
  companyId: string = ""
  orderDate: string = ""
  productId: string = ""
  price: number = 0.0
  status: string = "unpaid" // unpaid, active, expired
  documentTemplateId: string = ""
  documentTemplate: ProductDocumentTemplate | null = null
  expiryDate: string = ""
  orderItemId: string = ""
  purchasedBy: string = ""
  createdAt: string | null = null
  updatedAt: string | null = null

  servicePricingId: string = ""
  servicePricing: ServicePricing = new ServicePricing()

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof PurchasedDocumentTemplate) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.companyId = data.company_id
    this.orderDate = data.order_date
    this.productId = data.product_id
    this.price = data.price
    this.status = data.status ?? "unpaid"
    this.documentTemplateId = data.document_template_id
    this.documentTemplate = data.document_template ? new ProductDocumentTemplate(data.document_template) : null
    this.expiryDate = data.expiry_date
    this.orderItemId = data.order_item_id
    this.purchasedBy = data.purchased_by
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
  }

  clone(data: PurchasedDocumentTemplate): void {
    this.id = data.id
    this.companyId = data.companyId
    this.orderDate = data.orderDate
    this.productId = data.productId
    this.price = data.price
    this.status = data.status
    this.documentTemplateId = data.documentTemplateId
    this.documentTemplate = data.documentTemplate ? new ProductDocumentTemplate(data.documentTemplate) : null
    this.expiryDate = data.expiryDate
    this.orderItemId = data.orderItemId
    this.purchasedBy = data.purchasedBy
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt

    this.servicePricingId = data.servicePricingId
    this.servicePricing = new ServicePricing(data.servicePricing)
  }

  canSubmit(): boolean {
    return (
      !StringUtil.isNullOrEmpty(this.companyId) &&
      !StringUtil.isNullOrEmpty(this.status) &&
      !StringUtil.isNullOrEmpty(this.servicePricingId) &&
      !StringUtil.isNullOrEmpty(this.documentTemplateId) &&
      this.price > 0
    )
  }

  getRequestBody(): object {
    return {
      company_id: this.companyId,
      status: this.status,
      service_pricing_id: this.servicePricingId,
      document_template_id: this.documentTemplateId,
      price: this.price,
    }
  }

  async create(repository: ReturnType<typeof usePurchasedDocumentTemplateStore>): Promise<void> {
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

  async update(repository: ReturnType<typeof usePurchasedDocumentTemplateStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id) || !this.canSubmit()) {
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

  async remove(repository: ReturnType<typeof usePurchasedDocumentTemplateStore>): Promise<void> {
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
