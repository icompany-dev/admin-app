import { User } from "../models/User"
import { Company } from "../models/Company"
import { ApiRecord } from "../library/ApiRecord"
import { Repository } from "./Repository"

export class UserRepository extends Repository<User> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, User)
  }

  async fetchByEmail(email: string): Promise<User> {
    try {
      const response = this.get<User>(`${this.singleResourceUrl}/by-email?email=${email}`)
      return response
    } catch (error) {
      throw error
    }
  }

  async checkExists(email: string): Promise<any> {
    try {
      const data = {
        email: email,
      }

      const response = this.post<any>(`${this.singleResourceUrl}/exists`, data)
      return response
    } catch (error) {
      throw error
    }
  }

  async fetchByIdentification(identification: string, type: string): Promise<User> {
    try {
      const response = this.get<User>(
        `${this.singleResourceUrl}/by-identification?identification=${identification}&identification_type=${type}`
      )
      return response
    } catch (error) {
      throw error
    }
  }

  async fetchDirectorship(): Promise<ApiRecord<Company>> {
    try {
      const rawResponse = await this.get<Company>(`${this.singleResourceUrl}/directorship`)
      const apiRecord = new ApiRecord<Company>(rawResponse, Company)
      return apiRecord
    } catch (error) {
      throw error
    }
  }

  async fetchShareholding(): Promise<ApiRecord<Company>> {
    try {
      const rawResponse = await this.get<Company>(`${this.singleResourceUrl}/shareholding`)
      const apiRecord = new ApiRecord<Company>(rawResponse, Company)
      return apiRecord
    } catch (error) {
      throw error
    }
  }

  async fetchRepresentative(): Promise<ApiRecord<Company>> {
    try {
      const rawResponse = await this.get<Company>(`${this.singleResourceUrl}/representative`)
      const apiRecord = new ApiRecord<Company>(rawResponse, Company)
      return apiRecord
    } catch (error) {
      throw error
    }
  }

  async fetchDirectorToCompany(companyId: string): Promise<any> {
    try {
      let response = await this.get<any>(`${this.singleResourceUrl}/director/${companyId}`)
      return response
    } catch (error) {
      throw error
    }
  }

  async fetchRoles(): Promise<any> {
    try {
      let response = await this.get<any>(`${this.singleResourceUrl}/access/roles`)
      return response
    } catch (error) {
      throw error
    }
  }
}
