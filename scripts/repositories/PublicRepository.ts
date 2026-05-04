import { Model } from "../models/Model"
import { Repository } from "./Repository"

export class PublicRepository extends Repository<Model> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, Model)
  }

  async validateExternal(target: string, targetId: string, code: string): Promise<any> {
    try {
      let data = {
        target: target,
        target_id: targetId,
        code: code,
      }
      const response = this.post(`${this.resourceUrl}/validate/external`, data, {
        headers: { "Content-Type": "access/json" },
      })
      return response
    } catch (error) {
      throw error
    }
  }

  async uploadFile(
    accessHash: string,
    target: string,
    targetId: string,
    file: string,
    fileDescription: string
  ): Promise<any> {
    try {
      let uuid = crypto.randomUUID()
      let formData = {
        access_hash: accessHash,
        target: target,
        target_id: targetId,
        base64attachment: file,
        name: uuid,
        slug: uuid,
        description: fileDescription,
      }
      const response = this.post(`${this.resourceUrl}/external/file/upload`, formData, {
        headers: { "Content-Type": "application/json" },
      })
      return response
    } catch (error) {
      throw error
    }
  }
}
