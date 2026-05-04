import { StringUtil } from "../utils/String"
import { Application } from "./Application"
import { CompanyStrikingOffUser } from "./CompanyStrikingOffUser"
import { File } from "./File"
import { Error } from "~/scripts/library/Error"

export class CompanyStrikingOffClearance extends Application {
  strikingOffId: string = ""
  applicantId: string = ""
  applicant: CompanyStrikingOffUser = new CompanyStrikingOffUser()
  applicantName: string = ""
  applicantRole: string = ""
  signatureId: string = ""
  signature: File | null = null
  signatureDate: string = ""

  constructor(data: any | null) {
    super()
    if (!data) {
      return
    }

    if (data instanceof CompanyStrikingOffClearance) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.strikingOffId = data.striking_off_id
    this.applicantId = data.applicant_id
    this.applicant = new CompanyStrikingOffUser(data.applicant)
    this.applicantName = data.applicant_name
    this.applicantRole = data.applicant_role
    this.signatureId = data.signature_id
    this.signature = data.signature ? new File(data.signature) : null
    this.signatureDate = data.signature_date
  }

  cloneDetails(data: CompanyStrikingOffClearance): void {
    super.clone(data)
    this.strikingOffId = data.strikingOffId
    this.applicantId = data.applicantId
    this.applicant = new CompanyStrikingOffUser(data.applicant)
    this.applicantName = data.applicantName
    this.applicantRole = data.applicantRole
    this.signatureId = data.signatureId
    this.signature = data.signature ? new File(data.signature) : null
    this.signatureDate = data.signatureDate
  }

  getRequestBody(): object {
    return {
      company_id: this.companyId,
      applicant_id: this.applicantId,
      applicant_name: this.applicantName,
      applicant_role: this.applicantRole,
      signature_id: this.signatureId,
      signature_date: this.signatureDate,
    }
  }

  canSubmit(): boolean {
    return true
  }

  async create(repository: ReturnType<typeof useCompanyStrikingOffClearanceStore>): Promise<void> {
    if (!this.canSubmit()) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.customCreate(this.strikingOffId, data)
    if (repository.error) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponseDetails(response)
  }

  async update(repository: ReturnType<typeof useCompanyStrikingOffClearanceStore>): Promise<void> {
    if (!this.canSubmit() || StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.update(this.strikingOffId, data)
    if (repository.error) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponseDetails(response)
  }
}
