import { File } from "./File"
import type { IModel } from "./IModel"

export class CompanyDocumentRequestItem implements IModel<CompanyDocumentRequestItem> {
  id: string = ""
  requestId: string = ""
  documentName: string = ""
  isSsmPurchase: boolean = false
  isPurchasableViaApi: boolean = false
  iCompanyFileId: string | null = null
  iCompanyFile: File | null = null
  mydataFileId: string | null = null
  mydataCustomerReferenceNumber: string | null = null
  mydataOrderNumber: string | null = null
  documentDownloadExpireAt: string | null = null
  uploadedFileId: string | null = null
  uploadedFile: File | null = null
  createdAt: string | null = null
  updatedAt: string | null = null
  deletedAt: string | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CompanyDocumentRequestItem) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.requestId = data.request_id
    this.documentName = data.document_name
    this.isSsmPurchase = data.is_ssm_purchase
    this.isPurchasableViaApi = data.is_purchasable_via_api
    this.iCompanyFileId = data.icompany_file_id
    this.iCompanyFile = data.icompany_file ? new File(data.icompany_file) : null
    this.mydataFileId = data.mydata_file_id
    this.mydataCustomerReferenceNumber = data.mydata_customer_reference_number
    this.mydataOrderNumber = data.mydata_order_number
    this.documentDownloadExpireAt = data.document_download_expire_at
    this.uploadedFileId = data.uploaded_file_id
    this.uploadedFile = data.uploaded_file ? new File(data.uploaded_file) : null
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
    this.deletedAt = data.deleted_at
  }

  clone(data: CompanyDocumentRequestItem): void {
    this.id = data.id
    this.requestId = data.requestId
    this.documentName = data.documentName
    this.isSsmPurchase = data.isSsmPurchase
    this.isPurchasableViaApi = data.isPurchasableViaApi
    this.iCompanyFileId = data.iCompanyFileId
    this.iCompanyFile = data.iCompanyFile ? new File(data.iCompanyFile) : null
    this.mydataFileId = data.mydataFileId
    this.mydataCustomerReferenceNumber = data.mydataCustomerReferenceNumber
    this.mydataOrderNumber = data.mydataOrderNumber
    this.documentDownloadExpireAt = data.documentDownloadExpireAt
    this.uploadedFileId = data.uploadedFileId
    this.uploadedFile = data.uploadedFile ? new File(data.uploadedFile) : null
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
    this.deletedAt = data.deletedAt
  }

  getRequestBody(): object {
    return {
      document_name: this.documentName,
      is_ssm_purchase: this.isSsmPurchase,
      is_purchasable_via_api: this.isPurchasableViaApi,
      icompany_file_id: this.iCompanyFileId,
      mydata_file_id: this.mydataFileId,
    }
  }
}
