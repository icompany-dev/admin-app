import { SignatureGroup } from "../models/SignatureGroup"
import { Repository } from "./Repository"

export class SignatureRepository extends Repository<SignatureGroup> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, SignatureGroup)
  }

  async fetchByGroup(companyId: string, group: string): Promise<any> {
    try {
      let response = this.get(`${this.singleResourceUrl}/by-group/${companyId}?group_type=${group}`)
      return response
    } catch (e) {
      throw e
    }
  }
}
