import { File } from "./File"
import { Product } from "./Product"
import { PurchasedDocumentTemplate } from "./PurchasedDocumentTemplate"
import type { IModel } from "./IModel"
import { ServicePricing } from "./ServicePricing"
import { StringUtil } from "../utils/String"

export class ProductDocumentTemplate implements IModel<ProductDocumentTemplate> {
  id: string = ""
  productId: string = ""
  name: string = ""
  nameBm: string = ""
  description: string = ""
  descriptionBm: string = ""
  versionNumber: string | null = ""
  pdfFileId: string | null = ""
  pdfFile: File | null = null
  docxFileId: string | null = ""
  docxFile: File | null = null
  product: Product = new Product()
  purchases: PurchasedDocumentTemplate[] = []
  servicePricingId: string = ""
  servicePricing: ServicePricing = new ServicePricing()
  createdAt: string | null = ""
  updatedAt: string | null = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof ProductDocumentTemplate) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.productId = data.productId
    this.name = data.name ?? ""
    this.nameBm = data.name_bm ?? ""
    this.description = data.description ?? ""
    this.descriptionBm = data.description_bm ?? ""
    this.versionNumber = data.version_number
    this.pdfFileId = data.pdf_file_id
    this.pdfFile = data.pdf_file ? new File(data.pdf_file) : null
    this.docxFileId = data.docx_file_id
    this.docxFile = data.docx_file ? new File(data.docx_file) : null
    this.product = new Product(data.product)
    this.purchases =
      data.purchases.length > 0
        ? data.purchases.map((purchase: any) => {
            return new PurchasedDocumentTemplate(purchase)
          })
        : []
    this.servicePricingId = data.service_pricing_id ?? ""
    this.servicePricing = new ServicePricing(data.service_pricing)

    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
  }

  clone(data: ProductDocumentTemplate): void {
    this.id = data.id
    this.productId = data.productId
    this.name = data.name
    this.nameBm = data.nameBm
    this.description = data.description
    this.descriptionBm = data.descriptionBm
    this.versionNumber = data.versionNumber
    this.pdfFileId = data.pdfFileId
    this.pdfFile = data.pdfFile ? new File(data.pdfFile) : null
    this.docxFileId = data.docxFileId
    this.docxFile = data.docxFile ? new File(data.docxFile) : null
    this.product = new Product(data.product)
    this.purchases = data.purchases.map((purchase: any) => {
      return new PurchasedDocumentTemplate(purchase)
    })
    this.servicePricingId = data.servicePricingId
    this.servicePricing = new ServicePricing(data.servicePricing)
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  getRequestBody(): object {
    return {}
  }

  isDownloadable(): boolean {
    return !StringUtil.isNullOrEmpty(this.docxFile?.url ?? "") || !StringUtil.isNullOrEmpty(this.pdfFile?.url ?? "")
  }

  isPhysical(): boolean {
    return StringUtil.isNullOrEmpty(this.docxFile?.url ?? "") && StringUtil.isNullOrEmpty(this.pdfFile?.url ?? "")
  }
}
