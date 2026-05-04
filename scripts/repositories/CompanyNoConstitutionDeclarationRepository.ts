import { CompanyNoConstitutionDeclaration } from "../models/CompanyNoConstitutionDeclaration"
import { Repository } from "./Repository"

export class CompanyNoConstitutionDeclarationRepository extends Repository<CompanyNoConstitutionDeclaration> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyNoConstitutionDeclaration)
  }

  async email(id: string, name: string, email: string, fileUrl: string): Promise<any> {
    try {
      let data = {
        name: name,
        email_to: email,
        file_url: fileUrl,
      }
      const response = this.post(`${this.singleResourceUrl}/email/${id}`, data)
      return response
    } catch (e) {
      throw e
    }
  }

  async download(id: string): Promise<any> {
    try {
      let data = {}
      const response = this.post(`${this.singleResourceUrl}/download/${id}`, data)
      return response
    } catch (e) {
      throw e
    }
  }
}
