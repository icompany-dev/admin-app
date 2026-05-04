import type { Filter } from "../library/Filter"
import { Model } from "../models/Model"
import { StringUtil } from "../utils/String"
import { Repository } from "./Repository"

export class MyDataRepository extends Repository<Model> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, Model)
  }

  async fetchAllDocuments(filter: Filter): Promise<any> {
    try {
      let slug = filter.getSlug()
      const response = this.get(`${this.singleResourceUrl}/alldocuments${slug ? "?" + slug : ""}`)
      return response
    } catch (error) {
      throw error
    }
  }

  async purchaseCorporateProfile(registrationNumberOld: string, registrationNumberNew: string): Promise<any> {
    try {
      let entityNumber = !StringUtil.isNullOrEmpty(registrationNumberOld)
        ? registrationNumberOld
        : registrationNumberNew
      let fragments = entityNumber.split("-")
      let checkDigit = fragments.length > 1 ? fragments[1] : ""
      let data = {
        EntityNumber: fragments[0],
        EntityType: "Company",
        LocaleName: "en",
        CheckDigit: checkDigit,
      }

      const response = this.post(`${this.singleResourceUrl}/corporate-profile`, data)
      return response
    } catch (error) {
      throw error
    }
  }

  async fetchPurchasedCorporateProfileJson(orderNumber: string): Promise<any> {
    try {
      let data = {
        OrderNumber: orderNumber,
      }
      const response = this.post(`${this.singleResourceUrl}/getjson`, data)
      return response
    } catch (error) {
      throw error
    }
  }

  async fetchPurchasedCorporateProfilePdf(orderNumber: string): Promise<any> {
    try {
      let data = {
        OrderNumber: orderNumber,
      }
      const response = this.post(`${this.singleResourceUrl}/getpdf`, data, {
        headers: { "Content-Type": "application/json" },
        responseType: "blob",
      })
      return response
    } catch (error) {
      throw error
    }
  }
}
