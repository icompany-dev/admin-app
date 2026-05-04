import { ApiRecord } from "../library/ApiRecord"
import type { Filter } from "../library/Filter"
import { CompanyShareIssuance } from "../models/CompanyShareIssuance"
import { Repository } from "./Repository"

export class CompanyShareIssuanceRepository extends Repository<CompanyShareIssuance> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyShareIssuance)
  }

  async initiate(data: any): Promise<any> {
    try {
      const response = this.post(`${this.singleResourceUrl}/initiate`, data)
      return response
    } catch (e) {
      throw e
    }
  }

  async hasOngoing(companyId: string, shareType: string): Promise<any> {
    try {
      const response = this.get(`${this.singleResourceUrl}/has-ongoing?company_id=${companyId}&share_type=${shareType}`)
      return response
    } catch (e) {
      throw e
    }
  }

  async allOngoing(companyId: string, shareType: string): Promise<any> {
    try {
      const response = this.get(
        `${this.singleResourceUrl}/on-going/company?company_id=${companyId}&share_type=${shareType}`
      )
      return response
    } catch (e) {
      throw e
    }
  }

  override async ongoing(companyId: any): Promise<any> {
    try {
      const response = this.get(`${this.singleResourceUrl}/on-going?company_id=${companyId}`)
      return response
    } catch (e) {
      throw e
    }
  }

  async respond(id: string, data: any): Promise<any> {
    try {
      const response = this.post(`${this.singleResourceUrl}/respond/${id}`, data)
      return response
    } catch (e) {
      throw e
    }
  }

  async fetchToProceed(companyId: string): Promise<any> {
    try {
      const response = this.get(`${this.singleResourceUrl}/all-to-proceed?company_id=${companyId}`)
      return response
    } catch (e) {
      throw e
    }
  }

  async canProceed(id: string): Promise<any> {
    try {
      const response = this.get(`${this.singleResourceUrl}/can-proceed/${id}`)
      return response
    } catch (e) {
      throw e
    }
  }

  async issue(id: string): Promise<any> {
    try {
      const response = this.post(`${this.singleResourceUrl}/issue/${id}`, {})
      return response
    } catch (e) {
      throw e
    }
  }

  async declaration(id: string, data: any): Promise<any> {
    try {
      const response = this.post(`${this.singleResourceUrl}/declaration/${id}`, data)
      return response
    } catch (e) {
      throw e
    }
  }
}
