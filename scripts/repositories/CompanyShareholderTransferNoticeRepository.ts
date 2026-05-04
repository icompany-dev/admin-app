import { CompanyShareholderTransferNotice } from "../models/CompanyShareholderTransferNotice"
import { Repository } from "./Repository"

export class CompanyShareholderTransferNoticeRepository extends Repository<CompanyShareholderTransferNotice> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyShareholderTransferNotice)
  }

  async fetchForTransfer(transferId: string): Promise<any> {
    try {
      const response = this.get(`${this.singleResourceUrl}/for-transfer?transfer_id=${transferId}`)
      return response
    } catch (e) {
      throw e
    }
  }
}
