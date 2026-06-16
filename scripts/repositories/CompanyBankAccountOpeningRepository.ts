import { CompanyBankAccountOpening } from "../models/CompanyBankAccountOpening"
import { Repository } from "./Repository"

export class CompanyBankAccountOpeningRepository extends Repository<CompanyBankAccountOpening> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyBankAccountOpening)
  }

  async addBankAccountNumber(id: string, accountNumber: string): Promise<any> {
    try {
      let data = {
        account_number: accountNumber,
      }
      const response = await this.post<any>(`${this.singleResourceUrl}/account-number/${id}`, data)
      return response
    } catch (error) {
      throw error
    }
  }
}
