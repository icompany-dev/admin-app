import { Application } from "./Application"
import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"
import { CompanyStrikingOffApplication } from "./CompanyStrikingOffApplication"
import { CompanyStrikingOffChecklist } from "./CompanyStrikingOffChecklist"
import { CompanyStrikingOffClearance } from "./CompanyStrikingOffClearance"
import { CompanyStrikingOffDocument } from "./CompanyStrikingOffDocument"
import { CompanyStrikingOffRegistrarLetter } from "./CompanyStrikingOffRegistrarLetter"
import { CompanyStrikingOffUser } from "./CompanyStrikingOffUser"
import { CompanyStrikingOffWaiver } from "./CompanyStrikingOffWaiver"

export class CompanyStrikingOffResolution extends Application {
  initiator: CompanyStrikingOffUser = new CompanyStrikingOffUser()
  applicant: CompanyStrikingOffUser = new CompanyStrikingOffUser()
  application: CompanyStrikingOffApplication | null = null
  checklist: CompanyStrikingOffChecklist | null = null
  registrarLetter: CompanyStrikingOffRegistrarLetter | null = null
  waiverLetters: CompanyStrikingOffWaiver[] = []
  clearanceDisclaimerLetter: CompanyStrikingOffClearance[] = []
  uploadedDocuments: CompanyStrikingOffDocument[] = []
  type: string[] = []

  preparationData: string = ""

  constructor(data: any | null = null) {
    super()
    if (!data) {
      return
    }

    if (data instanceof CompanyStrikingOffResolution) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.initiator = new CompanyStrikingOffUser(data.initiator)
    this.applicant = new CompanyStrikingOffUser(data.applicant)
    this.application = data.application ? new CompanyStrikingOffApplication(data.application) : null
    this.checklist = data.checklist ? new CompanyStrikingOffChecklist(data.checklist) : null
    this.registrarLetter = data.registrar_letter ? new CompanyStrikingOffRegistrarLetter(data.registrar_letter) : null
    this.waiverLetters =
      data.waiver_letters && Array.isArray(data.waiver_letters)
        ? data.waiver_letters.map((d: any) => {
            return new CompanyStrikingOffWaiver(d)
          })
        : []
    this.clearanceDisclaimerLetter =
      data.clearance_disclaimer_letter && Array.isArray(data.clearance_disclaimer_letter)
        ? data.clearance_disclaimer_letter.map((d: any) => {
            return new CompanyStrikingOffClearance(d)
          })
        : []
    this.uploadedDocuments =
      data.uploaded_documents && Array.isArray(data.uploaded_documents)
        ? data.uploaded_documents.map((d: any) => {
            return new CompanyStrikingOffDocument(d)
          })
        : []
    this.type = !StringUtil.isNullOrEmpty(data.type) ? data.type.split(",") : []
  }

  cloneDetails(data: CompanyStrikingOffResolution): void {
    super.clone(data)
    this.initiator = new CompanyStrikingOffUser(data.initiator)
    this.applicant = new CompanyStrikingOffUser(data.applicant)
    this.application = data.application ? new CompanyStrikingOffApplication(data.application) : null
    this.checklist = data.checklist ? new CompanyStrikingOffChecklist(data.checklist) : null
    this.registrarLetter = data.registrarLetter ? new CompanyStrikingOffRegistrarLetter(data.registrarLetter) : null
    this.waiverLetters = data.waiverLetters.map((d: CompanyStrikingOffWaiver) => {
      return new CompanyStrikingOffWaiver(d)
    })
    this.clearanceDisclaimerLetter = data.clearanceDisclaimerLetter.map((d: CompanyStrikingOffClearance) => {
      return new CompanyStrikingOffClearance(d)
    })
    this.uploadedDocuments = data.uploadedDocuments.map((d: CompanyStrikingOffDocument) => {
      return new CompanyStrikingOffDocument(d)
    })
    this.type = data.type
  }

  getRequestBody(): object {
    return {
      company_id: this.companyId,
      applicant_id: this.applicant.id,
      type: this.preparationData,
      // type: this.type.join(","),
    }
  }

  canSubmit(): boolean {
    return !StringUtil.isNullOrEmpty(this.companyId)
  }

  async create(repository: ReturnType<typeof useCompanyStrikingOffResolutionStore>): Promise<void> {
    if (!this.canSubmit()) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.create(data)
    if (repository.error) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponseDetails(response)
  }

  async update(repository: ReturnType<typeof useCompanyStrikingOffResolutionStore>): Promise<void> {
    if (!this.canSubmit() || StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.update(this.id, data)
    if (repository.error) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponseDetails(response)
  }

  async remove(repository: ReturnType<typeof useCompanyStrikingOffResolutionStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    const response = await repository.remove(this.id)
    if (repository.error) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    return response
  }
}
