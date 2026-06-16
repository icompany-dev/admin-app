import { ApiRecord } from "../library/ApiRecord"
import type { Filter } from "../library/Filter"
import { CompanyLoanApplication } from "../models/CompanyLoanApplication"
import { Repository } from "./Repository"

export class CompanyLoanApplicationRepository extends Repository<CompanyLoanApplication> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyLoanApplication)
  }

  async fetchAllForLoan(loanProvider: string, filter: Filter): Promise<ApiRecord<CompanyLoanApplication>> {
    try {
      let slug = filter.getSlug()
      let response: any = await this.get(`${this.singleResourceUrl}/all/${loanProvider}${slug ? "?" + slug : ""}`)
      let apiRecord = new ApiRecord<CompanyLoanApplication>(response, this.itemClassType)
      return apiRecord
    } catch (e) {
      throw e
    }
  }

  async ongoingLoanApplication(companyId: string, loanProvider: string): Promise<any> {
    try {
      let response = this.get(`${this.singleResourceUrl}/ongoing/${companyId}/${loanProvider}`)
      return response
    } catch (e) {
      throw e
    }
  }

  async completedLoanApplication(companyId: string, loanProvider: string): Promise<any> {
    try {
      let response = this.get(`${this.singleResourceUrl}/latest-completed/${companyId}/${loanProvider}`)
      return response
    } catch (e) {
      throw e
    }
  }
}
