import { CompanyDocumentRequest } from "../models/CompanyDocumentRequest"
import { Repository } from "./Repository"

export class CompanyDocumentRequestRepository extends Repository<CompanyDocumentRequest> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyDocumentRequest)
  }

  async purchaseDocuments(requestId: string): Promise<any> {
    try {
      const response = this.post(`${this.singleResourceUrl}/purchase/documents/${requestId}`, {})
      return response
    } catch (error) {
      throw error
    }
  }

  async purchaseCorporateProfile(requestId: string): Promise<any> {
    try {
      const response = this.post(`${this.singleResourceUrl}/purchase/corporate-profile/${requestId}`, {})
      return response
    } catch (error) {
      throw error
    }
  }

  async download(itemId: string): Promise<any> {
    try {
      const response = this.get(`${this.singleResourceUrl}/item/download/${itemId}`, {})
      return response
    } catch (error) {
      throw error
    }
  }

  async fetchLatestPaidForDocument(companyId: string, documentName: string): Promise<any> {
    try {
      const response = this.get(
        `${this.singleResourceUrl}/purchased/latest?company_id=${companyId}&document_name=${documentName}`
      )
      return response
    } catch (error) {
      throw error
    }
  }

  async email(name: string, email: string, documentName: string, fileUrl: string): Promise<any> {
    try {
      const data = {
        name: name,
        email: email,
        document_name: documentName,
        file_url: fileUrl,
      }

      const response = this.post(`${this.singleResourceUrl}/email`, data)
      return response
    } catch (error) {
      throw error
    }
  }
}
