import { CompanyBODeclaration } from "../models/CompanyBODeclaration"
import { Repository } from "./Repository"

export class CompanyBODeclarationRepository extends Repository<CompanyBODeclaration> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyBODeclaration)
  }

  async fetchByCompanyId(companyId: string): Promise<any> {
    try {
      const response = await this.get<any>(`${this.singleResourceUrl}/for-company?company_id=${companyId}`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  async isRequiredForCompany(companyId: string): Promise<any> {
    try {
      const response = await this.get<any>(`${this.singleResourceUrl}/is_required-for-company?company_id=${companyId}`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  async fetchByShareholderId(shareholderId: string): Promise<any> {
    try {
      const response = await this.get<any>(`${this.singleResourceUrl}/by-shareholder?shareholder_id=${shareholderId}`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  async incompleteDeclarations(): Promise<any> {
    try {
      const response = await this.get<any>(`${this.resourceUrl}/companies-incomplete`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  async fetchForExternal(id: string, emailAddress: string): Promise<any> {
    try {
      const response = await this.get<any>(`${this.singleResourceUrl}/public/${id}?email_address=${emailAddress}`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  async updateForExternal(id: string, data: any): Promise<any> {
    try {
      const response = await this.post<any>(`${this.singleResourceUrl}/public/update/${id}`, data)
      return response.data
    } catch (error) {
      throw error
    }
  }

  async fetchPast(companyId: string): Promise<any> {
    try {
      const response = await this.get(`${this.singleResourceUrl}/past/${companyId}`)
      return response
    } catch (error) {
      throw error
    }
  }
}
