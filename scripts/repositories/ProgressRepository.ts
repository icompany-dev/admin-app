import { ProgressItem } from "../models/ProgressItem";
import { Repository } from "./Repository";

export class ProgressRepository extends Repository<ProgressItem> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined,
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, ProgressItem)
  }

  async fetchList(): Promise<ProgressItem[]> {
    try {
      const response = await this.get<ProgressItem[]>(`${this.resourceUrl}/min`)
      return response
    } catch (error) {
      throw error
    }
  }
}