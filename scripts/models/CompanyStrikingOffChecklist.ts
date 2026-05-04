import { Application } from "./Application"
import { CompanyStrikingOffUser } from "./CompanyStrikingOffUser"
import { File } from "./File"
import { StringUtil } from "../utils/String"
import { Error } from "~/scripts/library/Error"

export class CompanyStrikingOffChecklist extends Application {
  strikingOffId: string = ""
  hasPaidApplicationFees: boolean = false
  hasCoveringLetter: boolean = false
  hasDeclarationByApplicant: boolean = false
  hasIndividualMembersResolution: boolean = false
  hasLetterOfConsentFromHoldingCompany: boolean = false
  hasCoOwnedSubsidiaryMcr: boolean = false
  hasLatestManagementAccounts: boolean = false
  hasWaiverLetters: boolean = false
  hasTaxClearance: boolean = false
  hasCompanyPrintOut: boolean = false
  hasBankAccount: boolean = false
  applicantId: string = ""
  applicant: CompanyStrikingOffUser = new CompanyStrikingOffUser()
  applicantName: string = ""
  signatureId: string = ""
  signature: File | null = null
  signatureDate: boolean = false

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyStrikingOffChecklist) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.strikingOffId = data.striking_off_id
    this.hasPaidApplicationFees = data.has_paid_application_fees
    this.hasCoveringLetter = data.has_covering_letter
    this.hasDeclarationByApplicant = data.has_declaration_by_applicant
    this.hasIndividualMembersResolution = data.has_individual_members_resolution
    this.hasLetterOfConsentFromHoldingCompany = data.has_letter_of_consent_from_holding_company
    this.hasCoOwnedSubsidiaryMcr = data.has_co_owned_subsidiary_mcr
    this.hasLatestManagementAccounts = data.has_latest_management_accounts
    this.hasWaiverLetters = data.has_waiver_letters
    this.hasTaxClearance = data.has_tax_clearance
    this.hasCompanyPrintOut = data.has_company_print_out
    this.hasBankAccount = data.has_bank_account
    this.applicantId = data.applicant_id
    this.applicant = new CompanyStrikingOffUser(data.applicant)
    this.applicantName = data.applicant_name
    this.signatureId = data.signature_id
    this.signature = data.signature ? new File(data.signature) : null
    this.signatureDate = data.signature_date
  }

  cloneDetails(data: CompanyStrikingOffChecklist): void {
    super.clone(data)
    this.strikingOffId = data.strikingOffId
    this.hasPaidApplicationFees = data.hasPaidApplicationFees
    this.hasCoveringLetter = data.hasCoveringLetter
    this.hasDeclarationByApplicant = data.hasDeclarationByApplicant
    this.hasIndividualMembersResolution = data.hasIndividualMembersResolution
    this.hasLetterOfConsentFromHoldingCompany = data.hasLetterOfConsentFromHoldingCompany
    this.hasCoOwnedSubsidiaryMcr = data.hasCoOwnedSubsidiaryMcr
    this.hasLatestManagementAccounts = data.hasLatestManagementAccounts
    this.hasWaiverLetters = data.hasWaiverLetters
    this.hasTaxClearance = data.hasTaxClearance
    this.hasCompanyPrintOut = data.hasCompanyPrintOut
    this.hasBankAccount = data.hasBankAccount
    this.applicantId = data.applicantId
    this.applicant = new CompanyStrikingOffUser(data.applicant)
    this.applicantName = data.applicantName
    this.signatureId = data.signatureId
    this.signature = data.signature ? new File(data.signature) : null
    this.signatureDate = data.signatureDate
  }

  getRequestBody(): object {
    return {
      company_id: this.companyId,
      has_paid_application_fees: this.hasPaidApplicationFees,
      has_covering_letter: this.hasCoveringLetter,
      has_declaration_by_applicant: this.hasDeclarationByApplicant,
      has_individual_members_resolution: this.hasIndividualMembersResolution,
      has_letter_of_consent_from_holding_company: this.hasLetterOfConsentFromHoldingCompany,
      has_co_owned_subsidiary_mcr: this.hasCoOwnedSubsidiaryMcr,
      has_latest_management_accounts: this.hasLatestManagementAccounts,
      has_waiver_letters: this.hasWaiverLetters,
      has_tax_clearance: this.hasTaxClearance,
      has_company_print_out: this.hasCompanyPrintOut,
      has_bank_account: this.hasBankAccount,
      applicant_id: this.applicantId,
      applicant_name: this.applicantName,
      signature_id: this.signatureId,
      signature_date: this.signatureDate,
    }
  }

  canSubmit(): boolean {
    return true
  }

  async create(repository: ReturnType<typeof useCompanyStrikingOffChecklistStore>): Promise<void> {
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

  async update(repository: ReturnType<typeof useCompanyStrikingOffChecklistStore>): Promise<void> {
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
