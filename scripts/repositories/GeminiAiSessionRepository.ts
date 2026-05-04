import { Model } from "../models/Model"
import { Repository } from "./Repository"

export class GeminiAiSessionRepository extends Repository<Model> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, Model)
  }

  async fetchOngoing(target: string, targetId: string): Promise<any> {
    try {
      const response = this.get(`${this.singleResourceUrl}/ongoing?target=${target}&target_id=${targetId}`)
      return response
    } catch (e) {
      throw e
    }
  }

  async fetchJob(id: string): Promise<any> {
    try {
      const response = this.get(`${this.singleResourceUrl}/job/${id}`)
      return response
    } catch (e) {
      throw e
    }
  }

  async addJob(id: string, data: object): Promise<any> {
    try {
      const response = this.post(`${this.singleResourceUrl}/add-job/${id}`, data)
      return response
    } catch (e) {
      throw e
    }
  }

  async addClassifiedJob(id: string, data: object): Promise<any> {
    try {
      const response = this.post(`${this.singleResourceUrl}/add-classified-job/${id}`, data)
      return response
    } catch (e) {
      throw e
    }
  }

  async removeJob(id: string, jobId: string): Promise<any> {
    try {
      const data = {
        job_id: jobId,
      }
      const response = this.post(`${this.singleResourceUrl}/remove-job/${id}`, data)
      return response
    } catch (e) {
      throw e
    }
  }

  async markCompleted(id: string): Promise<any> {
    try {
      const response = this.post(`${this.singleResourceUrl}/completed/${id}`, {})
      return response
    } catch (e) {
      throw e
    }
  }
}
