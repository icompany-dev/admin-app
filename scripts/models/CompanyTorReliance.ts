export class CompanyTorReliance {
  id: string = ""
  companyTermsOfReferenceId: string = ""
  isInformationByManagement: boolean = false
  isProfessionalAdvice: boolean = false
  isInformationByAi: boolean = false
  createdAt: string | null = null
  updatedAt: string | null = null
  deletedAt: string | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CompanyTorReliance) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.companyTermsOfReferenceId = data.tor_id
    this.isInformationByManagement = data.is_information__by_management
    this.isProfessionalAdvice = data.is_professional_advice
    this.isInformationByAi = data.is_information_by_ai
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
    this.deletedAt = data.deleted_at
  }

  clone(data: CompanyTorReliance): void {
    this.id = data.id
    this.companyTermsOfReferenceId = data.companyTermsOfReferenceId
    this.isInformationByManagement = data.isInformationByManagement
    this.isProfessionalAdvice = data.isProfessionalAdvice
    this.isInformationByAi = data.isInformationByAi
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
    this.deletedAt = data.deletedAt
  }

  getRequestBody(): object {
    return {
      tor_id: this.companyTermsOfReferenceId,
      is_information__by_management: this.isInformationByManagement,
      is_professional_advice: this.isProfessionalAdvice,
      is_information_by_ai: this.isInformationByAi,
    }
  }
}
