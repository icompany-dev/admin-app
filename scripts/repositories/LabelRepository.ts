import { Label } from "../models/Label"
import { Repository } from "./Repository"

export class LabelRepository extends Repository<Label> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, Label)
  }

  async fetchItemsForLabel(id: string): Promise<any> {
    try {
      const response = this.get(`${this.singleResourceUrl}/items/${id}`)
      return response
    } catch (e) {
      throw e
    }
  }

  async addItem(data: any): Promise<any> {
    try {
      const response = this.post(`${this.singleResourceUrl}/item/add`, data)
    } catch (e) {
      throw e
    }
  }

  async deleteItem(itemId: string): Promise<any> {
    try {
      const response = this.post(`${this.singleResourceUrl}/item/delete/${itemId}`, {})
      return response
    } catch (e) {
      throw e
    }
  }

  async fetchForServicePricings(): Promise<any> {
    try {
      let response = this.get(`${this.singleResourceUrl}/service-pricings`)
      return response
    } catch (e) {
      throw e
    }
  }
}
