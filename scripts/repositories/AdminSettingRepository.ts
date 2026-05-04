import { AdminSetting } from "../models/AdminSetting";
import { Repository } from "./Repository";

export class AdminSettingRepository extends Repository<AdminSetting> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined,
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, AdminSetting)
  }

  // This method uses the old indexed endpoints - must update when the new endpoint is added
  async fetchAllOld(slug: string | null): Promise<any> {
    try {
      const response = this.get(`${this.resourceUrl}${slug ? '?' + slug : ''}`)
      return response
    } catch (error) {
      throw error
    }
  }
}