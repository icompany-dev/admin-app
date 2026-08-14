import { ApiRecord } from "../library/ApiRecord"
import type { Filter } from "../library/Filter"
import { CompanyConstitution } from "../models/CompanyConstitution"
import { Repository } from "./Repository"

export class CompanyConstitutionRepository extends Repository<CompanyConstitution> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyConstitution)
  }

  async byCompanyId(companyId: string): Promise<any> {
    try {
      let response = this.get(`${this.singleResourceUrl}/by-company-id/${companyId}`)
      return response
    } catch (e) {
      throw e
    }
  }

  async latest(companyId: string): Promise<any> {
    try {
      let response = this.get(`${this.singleResourceUrl}/latest/${companyId}`)
      return response
    } catch (e) {
      throw e
    }
  }

  async addContent(data: any): Promise<any> {
    try {
      let response = this.post(`${this.singleResourceUrl}/add-content`, data)
      return response
    } catch (e) {
      throw e
    }
  }

  async addMultipleContents(data: any): Promise<any> {
    try {
      let response = this.post(`${this.singleResourceUrl}/add-multiple-contents`, data)
      return response
    } catch (e) {
      throw e
    }
  }

  async deleteContent(contentId: string): Promise<any> {
    try {
      let response = this.delete(`${this.singleResourceUrl}/delete-content/${contentId}`)
      return response
    } catch (e) {
      throw e
    }
  }

  async deleteMultipleContents(data: any): Promise<any> {
    try {
      let response = this.post(`${this.singleResourceUrl}/delete-multiple-contents`, data)
      return response
    } catch (e) {
      throw e
    }
  }
}
