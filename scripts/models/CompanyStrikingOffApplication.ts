import { StringUtil } from "../utils/String"
import { Application } from "./Application"
import { CompanyStrikingOffUser } from "./CompanyStrikingOffUser"
import { File } from "./File"
import { Error } from "~/scripts/library/Error"

export class CompanyStrikingOffApplication extends Application {
  strikingOffId: string = ""
  applicantId: string = ""
  applicant: CompanyStrikingOffUser = new CompanyStrikingOffUser()
  applicantName: string = ""
  applicantResidentialAddress: string = ""
  applicantRole: string = ""
  isAmountSufficient: boolean = false
  isOperating: boolean = false
  operatingSinceDate: string | null = null
  hasOutstandingPenalty: boolean = false
  applyOrAppealCompound: string = ""
  waivedOrReducedCompound: string = ""
  isAHoldingCompany: boolean = false
  holdingCompanyName: string | null = null
  signatureId: string = ""
  signature: File | null = null
  signatureDate: string = ""
  lodgerName: string = ""
  lodgerNric: string = ""
  lodgerAddress: string = ""
  lodgerPhone: string = ""
  lodgerEmail: string = ""

  constructor(data: any | null = null) {
    super()
    if (!data) {
      return
    }

    if (data instanceof CompanyStrikingOffApplication) {
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
    this.applicantResidentialAddress = data.applicant_residential_address ?? ""
    this.applicantRole = data.applicant_role ?? ""
    this.isAmountSufficient = data.is_amount_sufficient ?? false
    this.isOperating = data.is_operating ?? false
    this.operatingSinceDate = data.operating_since_date ?? null
    this.hasOutstandingPenalty = data.has_outstanding_penalty ?? false
    this.applyOrAppealCompound = data.apply_or_appeal_compound ?? "applies"
    this.waivedOrReducedCompound = data.waived_or_reduced_compound ?? "waived"
    this.isAHoldingCompany = data.is_a_holding_company ?? false
    this.holdingCompanyName = data.holding_company_name ?? null
    this.signatureId = data.signature_id
    this.signature = data.signature ? new File(data.signature) : null
    this.signatureDate = data.signature_date
    this.lodgerName = data.lodger_name
    this.lodgerNric = data.lodger_nric
    this.lodgerAddress = data.lodger_address
    this.lodgerPhone = data.lodger_phone
    this.lodgerEmail = data.lodger_email
  }

  cloneDetails(data: CompanyStrikingOffApplication): void {
    super.clone(data)
    this.strikingOffId = data.strikingOffId
    this.applicantId = data.applicantId
    this.applicant = new CompanyStrikingOffUser(data.applicant)
    this.applicantName = data.applicantName
    this.applicantResidentialAddress = data.applicantResidentialAddress
    this.applicantRole = data.applicantRole
    this.isAmountSufficient = data.isAmountSufficient
    this.isOperating = data.isOperating
    this.operatingSinceDate = data.operatingSinceDate
    this.hasOutstandingPenalty = data.hasOutstandingPenalty
    this.applyOrAppealCompound = data.applyOrAppealCompound
    this.waivedOrReducedCompound = data.waivedOrReducedCompound
    this.isAHoldingCompany = data.isAHoldingCompany
    this.holdingCompanyName = data.holdingCompanyName
    this.signatureId = data.signatureId
    this.signature = data.signature ? new File(data.signature) : null
    this.signatureDate = data.signatureDate
    this.lodgerName = data.lodgerName
    this.lodgerNric = data.lodgerNric
    this.lodgerAddress = data.lodgerAddress
    this.lodgerPhone = data.lodgerPhone
    this.lodgerEmail = data.lodgerEmail
  }

  getRequestBody(): object {
    return {
      company_id: this.companyId,
      applicant_id: this.applicantId,
      applicant_name: this.applicantName,
      applicant_residential_address: this.applicantResidentialAddress,
      applicant_role: this.applicantRole,
      is_amount_sufficient: this.isAmountSufficient,
      is_operating: this.isOperating,
      operating_since_date: this.operatingSinceDate,
      has_outstanding_penalty: this.hasOutstandingPenalty,
      apply_or_appeal_compound: this.applyOrAppealCompound,
      waived_or_reduced_compound: this.waivedOrReducedCompound,
      is_a_holding_company: this.isAHoldingCompany,
      holding_company_name: this.holdingCompanyName,
      signature_id: this.signatureId,
      signature_date: this.signatureDate,
    }
  }

  canSubmit(): boolean {
    return true
  }

  async create(repository: ReturnType<typeof useCompanyStrikingOffApplicationStore>): Promise<void> {
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

  async update(repository: ReturnType<typeof useCompanyStrikingOffApplicationStore>): Promise<void> {
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
