import { DirectorDeclarationConflictOfInterest } from "../models/DirectorDeclarationConflictOfInterest"
import { Repository } from "./Repository"

export class DirectorDeclarationConflictOfInterestRepository extends Repository<DirectorDeclarationConflictOfInterest> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, DirectorDeclarationConflictOfInterest)
  }

  async ongoingForDirector(directorId: string): Promise<any> {
    try {
      let response = this.get(`${this.singleResourceUrl}/${directorId}/ongoing`)
      return response
    } catch (e) {
      throw e
    }
  }

  async activeForDirector(directorId: string): Promise<any> {
    try {
      let response = this.get(`${this.singleResourceUrl}/${directorId}/active`)
      return response
    } catch (e) {
      throw e
    }
  }

  async overridenForDirector(directorId: string): Promise<any> {
    try {
      let response = this.get(`${this.singleResourceUrl}/${directorId}/overriden`)
      return response
    } catch (e) {
      throw e
    }
  }

  async allForDirector(directorId: string): Promise<any> {
    try {
      let response = this.get(`${this.singleResourceUrl}/${directorId}/all`)
      return response
    } catch (e) {
      throw e
    }
  }

  async submitSignature(id: string, signatureId: string): Promise<any> {
    try {
      let data = {
        signature_id: signatureId,
      }
      let response = this.post(`${this.singleResourceUrl}/${id}/submit`, data)
      return response
    } catch (e) {
      throw e
    }
  }
}
