import { CompanyPostShareTransfer } from "../models/CompanyPostShareTransfer"
import { Repository } from "./Repository"

export class CompanyPostShareTransferRepository extends Repository<CompanyPostShareTransfer> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyPostShareTransfer)
  }

  async fetchForTransfer(transferId: string): Promise<any> {
    try {
      const response = this.get(`${this.singleResourceUrl}/for-transfer?transfer_id=${transferId}`)
      return response
    } catch (error) {
      throw error
    }
  }

  async extend(id: string, data: any): Promise<any> {
    try {
      const response = this.post(`${this.singleResourceUrl}/extend/${id}`, data)
      return response
    } catch (error) {
      throw error
    }
  }

  async fetchSection105Date(transferId: string): Promise<any> {
    try {
      const response = this.get(`${this.singleResourceUrl}/section-105-date?transfer_id=${transferId}`)
      return response
    } catch (error) {
      throw error
    }
  }
}
