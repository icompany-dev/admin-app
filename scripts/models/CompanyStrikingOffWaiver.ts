import { StringUtil } from "../utils/String"
import { Application } from "./Application"
import { CompanyStrikingOffUser } from "./CompanyStrikingOffUser"
import { File } from "./File"
import { Error } from "~/scripts/library/Error"

export class CompanyStrikingOffWaiver extends Application {
  strikingOffId: string = ""
  userId: string = ""
  user: CompanyStrikingOffUser | null = null
  name: string = ""
  address: string = ""
  signatureId: string = ""
  signature: File | null = null
  signatureDate: string = ""

  constructor(data: any | null) {
    super()
    if (!data) {
      return
    }

    if (data instanceof CompanyStrikingOffWaiver) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.strikingOffId = data.striking_off_id
    this.userId = data.user_id
    this.user = data.user ? new CompanyStrikingOffUser(data.user) : null
    this.name = data.name
    this.address = data.address
    this.signatureId = data.signature_id
    this.signature = data.signature ? new File(data.signature) : null
    this.signatureDate = data.signature_date
  }

  cloneDetails(data: CompanyStrikingOffWaiver): void {
    super.clone(data)
    this.strikingOffId = data.strikingOffId
    this.userId = data.userId
    this.user = data.user ? new CompanyStrikingOffUser(data.user) : null
    this.name = data.name
    this.address = data.address
    this.signatureId = data.signatureId
    this.signature = data.signature ? new File(data.signature) : null
    this.signatureDate = data.signatureDate
  }

  getRequestBody(): object {
    return {
      company_id: this.companyId,
      name: this.name,
      address: this.address,
      signature_id: this.signatureId,
      signature_date: this.signatureDate,
    }
  }

  canSubmit(): boolean {
    return true
  }

  async create(repository: ReturnType<typeof useCompanyStrikingOffWaiverStore>): Promise<void> {
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

  async update(repository: ReturnType<typeof useCompanyStrikingOffWaiverStore>): Promise<void> {
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
