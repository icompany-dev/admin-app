import { Model } from "../models/Model"
import { Repository } from "./Repository"

export class GeminiAiRepository extends Repository<Model> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, Model)
  }

  async generateFromText(prompt: string): Promise<any> {
    try {
      let data = {
        prompt: prompt,
      }
      const response: any = this.post(`${this.resourceUrl}/text`, data, {
        headers: { "Content-Type": "application/json" },
      })
      return response
    } catch (e) {
      throw e
    }
  }

  async generateFromImage(prompt: string, base64Image: string, mimeType: string, filename: string): Promise<any> {
    try {
      let data = {
        prompt: prompt,
        image_data: base64Image,
        mime_type: mimeType,
        filename: filename,
      }
      const response: any = this.post(`${this.resourceUrl}/image`, data, {
        headers: { "Content-Type": "application/json" },
      })
      return response
    } catch (e) {
      throw e
    }
  }

  async generateFromPdf(prompt: string, fileUrl: string, filename: string): Promise<any> {
    try {
      let data = {
        prompt: prompt,
        file_url: fileUrl,
        filename: filename,
      }
      const response: any = this.post(`${this.resourceUrl}/pdf`, data, {
        headers: { "Content-Type": "application/json" },
      })
      return response
    } catch (e) {
      throw e
    }
  }

  async getJobStatus(jobId: string): Promise<any> {
    try {
      const response: any = this.get(`${this.resourceUrl}/status/${jobId}`)
      return response
    } catch (e) {
      throw e
    }
  }
}
