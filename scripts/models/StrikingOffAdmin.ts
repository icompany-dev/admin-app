import { File } from "./File"
import _ from "lodash"

export class StrikingOffUser {
  id: string = ""
  name: string = ""
  email: string = ""
  phone: string = ""
  identification: string = ""
  identificationType: string = "" // ic / passport

  constructor(data: any | null = null) {
    if (data !== null) {
      if (data instanceof StrikingOffUser) {
        this.clone(data)
      } else {
        this.convertFromResponse(data)
      }
    }
  }

  clone(data: StrikingOffUser): void {
    this.id = data.id
    this.name = data.name
    this.email = data.email
    this.phone = data.phone
    this.identification = data.identification
    this.identificationType = data.identificationType
  }

  convertFromResponse(data: any): void {
    this.id = data.id ?? ""
    this.name = data.name ?? ""
    this.email = data.email ?? ""
    this.phone = data.phone ?? ""
    this.identification = data.identification ?? ""
    this.identificationType = data.identification_type ?? ""
  }
}

export class StrikingOffApplication {
  id: string = ""
  companyId: string = ""
  strikingOffId: string = ""
  applicantId: string = ""
  applicant: StrikingOffUser = new StrikingOffUser()
  applicantName: string = ""
  signatureId: string = ""
  signature: File | null = null
  signatureDate: string | null = null
  lodgerName: string = ""
  lodgerNric: string = ""
  lodgerAddress: string = ""
  lodgerPhone: string = ""
  lodgerEmail: string = ""
  createdAt: string = ""
  updatedAt: string = ""

  constructor(data: any | null = null) {
    if (data !== null) {
      if (data instanceof StrikingOffApplication) {
        this.clone(data)
      } else {
        this.convertFromResponse(data)
      }
    }
  }

  clone(data: StrikingOffApplication): void {
    this.id = data.id
    this.companyId = data.companyId
    this.strikingOffId = data.strikingOffId
    this.applicantId = data.applicantId
    this.applicant.clone(data.applicant)
    this.applicantName = data.applicantName
    this.signatureId = data.signatureId
    this.signature = data.signature ? new File(data.signature) : null
    this.signatureDate = data.signatureDate
    this.lodgerName = data.lodgerName
    this.lodgerNric = data.lodgerNric
    this.lodgerAddress = data.lodgerAddress
    this.lodgerPhone = data.lodgerPhone
    this.lodgerEmail = data.lodgerEmail
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  convertFromResponse(data: any): void {
    this.id = data.id ?? ""
    this.companyId = data.company_id ?? ""
    this.strikingOffId = data.striking_off_id ?? ""
    this.applicantId = data.applicant_id ?? ""
    this.applicant = new StrikingOffUser(data.applicant)
    this.applicantName = data.applicant_name ?? ""
    this.signatureId = data.signature_id ?? ""
    this.signature = data.signature ? new File(data.signature) : null
    this.signatureDate = data.signature_date ?? null
    this.lodgerName = data.lodger_name ?? ""
    this.lodgerNric = data.lodger_nric ?? ""
    this.lodgerAddress = data.lodger_address ?? ""
    this.lodgerPhone = data.lodger_phone ?? ""
    this.lodgerEmail = data.lodger_email ?? ""
    this.createdAt = data.created_at ?? ""
    this.updatedAt = data.updated_at ?? ""
  }

  getRequestBody(): object {
    return {
      lodger_name: this.lodgerName,
      lodger_nric: this.lodgerNric,
      lodger_address: this.lodgerAddress,
      lodger_email: this.lodgerEmail,
      signature_id: this.signatureId,
    }
  }
}

export class StrikingOffChecklist {
  id: string = ""
  companyId: string = ""
  strikingOffId: string = ""
  hasPaidApplicationFees: boolean = false
  hasCoveringLetter: boolean = false
  hasDeclarationByApplicant: boolean = false
  hasIndividualMembersResolution: boolean = false
  hasLetterOfConsentFromHoldingCompany: boolean = false
  hasCoOwnedSubsidiaryMcr: boolean = false
  hasLatestManagementAccounts: boolean = false
  hasWaiverLetters: boolean = false
  hasTaxClearrance: boolean = false
  hasCompanyPrintOut: boolean = false
  hasBankAccount: boolean = false
  applicantId: string = ""
  applicant: StrikingOffUser = new StrikingOffUser()
  applicantName: string = ""
  signatureId: string = ""
  signature: File | null = null
  signatureDate: string | null = null
  createdAt: string = ""
  updatedAt: string = ""

  constructor(data: any | null = null) {
    if (data !== null) {
      if (data instanceof StrikingOffChecklist) {
        this.clone(data)
      } else {
        this.convertFromResponse(data)
      }
    }
  }

  clone(data: StrikingOffChecklist): void {
    this.id = data.id
    this.companyId = data.companyId
    this.strikingOffId = data.strikingOffId
    this.hasPaidApplicationFees = data.hasPaidApplicationFees
    this.hasCoveringLetter = data.hasCoveringLetter
    this.hasDeclarationByApplicant = data.hasDeclarationByApplicant
    this.hasIndividualMembersResolution = data.hasIndividualMembersResolution
    this.hasLetterOfConsentFromHoldingCompany = data.hasLetterOfConsentFromHoldingCompany
    this.hasCoOwnedSubsidiaryMcr = data.hasCoOwnedSubsidiaryMcr
    this.hasLatestManagementAccounts = data.hasLatestManagementAccounts
    this.hasWaiverLetters = data.hasWaiverLetters
    this.hasTaxClearrance = data.hasTaxClearrance
    this.hasCompanyPrintOut = data.hasCompanyPrintOut
    this.hasBankAccount = data.hasBankAccount
    this.applicantId = data.applicantId
    this.applicant.clone(data.applicant)
    this.applicantName = data.applicantName
    this.signatureId = data.signatureId
    this.signature = data.signature ? new File(data.signature) : null
    this.signatureDate = data.signatureDate
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  convertFromResponse(data: any): void {
    this.id = data.id ?? ""
    this.companyId = data.company_id ?? ""
    this.strikingOffId = data.striking_off_id ?? ""
    this.hasPaidApplicationFees = data.has_paid_application_fees ?? false
    this.hasCoveringLetter = data.has_covering_letter ?? false
    this.hasDeclarationByApplicant = data.has_declaration_by_applicant ?? false
    this.hasIndividualMembersResolution = data.has_individual_members_resolution ?? false
    this.hasLetterOfConsentFromHoldingCompany = data.has_letter_of_consent_from_holding_company ?? false
    this.hasCoOwnedSubsidiaryMcr = data.has_co_owned_subsidiary_mcr ?? false
    this.hasLatestManagementAccounts = data.has_latest_management_accounts ?? false
    this.hasWaiverLetters = data.has_waiver_letters ?? false
    this.hasTaxClearrance = data.has_tax_clearrance ?? false
    this.hasCompanyPrintOut = data.has_company_print_out ?? false
    this.hasBankAccount = data.has_bank_account ?? false
    this.applicantId = data.applicant_id ?? ""
    this.applicant = new StrikingOffUser(data.applicant)
    this.applicantName = data.applicant_name ?? ""
    this.signatureId = data.signature_id ?? ""
    this.signature = data.signature ? new File(data.signature) : null
    this.signatureDate = data.signature_date ?? null
    this.createdAt = data.created_at ?? ""
    this.updatedAt = data.updated_at ?? ""
  }

  getRequestBody(): object {
    return {
      has_covering_letter: this.hasCoveringLetter,
      has_declaration_by_applicant: this.hasDeclarationByApplicant,
      has_individual_members_resolution: this.hasIndividualMembersResolution,
      has_letter_of_consent_from_holding_company: this.hasLetterOfConsentFromHoldingCompany,
      has_co_owned_subsidiary_mcr: this.hasCoOwnedSubsidiaryMcr,
      has_latest_management_accounts: this.hasLatestManagementAccounts,
      has_waiver_letters: this.hasWaiverLetters,
      has_tax_clearance: this.hasTaxClearrance,
      has_company_print_out: this.hasCompanyPrintOut,
      signature_id: this.signatureId,
    }
  }
}

export class StrikingOffRegistrarLetter {
  id: string = ""
  companyId: string = ""
  strikingOffId: string = ""
  applicantId: string = ""
  applicant: StrikingOffUser = new StrikingOffUser()
  applicantName: string = ""
  applicantRole: string = ""
  signatureId: string = ""
  signature: File | null = null
  signatureDate: string | null = null
  createdAt: string = ""
  updatedAt: string = ""

  constructor(data: any | null = null) {
    if (data !== null) {
      if (data instanceof StrikingOffRegistrarLetter) {
        this.clone(data)
      } else {
        this.convertFromResponse(data)
      }
    }
  }

  clone(data: StrikingOffRegistrarLetter): void {
    this.id = data.id
    this.companyId = data.companyId
    this.strikingOffId = data.strikingOffId
    this.applicantId = data.applicantId
    this.applicant.clone(data.applicant)
    this.applicantName = data.applicantName
    this.applicantRole = data.applicantRole
    this.signatureId = data.signatureId
    this.signature = data.signature ? new File(data.signature) : null
    this.signatureDate = data.signatureDate
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  convertFromResponse(data: any): void {
    this.id = data.id ?? ""
    this.companyId = data.company_id ?? ""
    this.strikingOffId = data.striking_off_id ?? ""
    this.applicantId = data.applicant_id ?? ""
    this.applicant = new StrikingOffUser(data.applicant)
    this.applicantName = data.applicant_name ?? ""
    this.applicantRole = data.applicant_role ?? ""
    this.signatureId = data.singnature_id ?? ""
    this.signature = data.signature ? new File(data.signature) : null
    this.signatureDate = data.signature_date ?? null
    this.createdAt = data.created_at ?? ""
    this.updatedAt = data.updated_at ?? ""
  }

  getRequestBody(): object {
    return {
      signature_id: this.signatureId,
    }
  }
}

export class StrikingOffWaiverLetter {
  id: string = ""
  companyId: string = ""
  strikingOffId: string = ""
  userId: string = ""
  user: StrikingOffUser = new StrikingOffUser()
  name: string = ""
  address: string = ""
  signatureId: string = ""
  signature: File | null = null
  signatureDate: string | null = null
  createdAt: string | null = null
  updatedAt: string | null = null

  constructor(data: any | null = null) {
    if (data !== null) {
      if (data instanceof StrikingOffWaiverLetter) {
        this.clone(data)
      } else {
        this.convertFromResponse(data)
      }
    }
  }

  clone(data: StrikingOffWaiverLetter): void {
    this.id = data.id
    this.companyId = data.companyId
    this.strikingOffId = data.strikingOffId
    this.userId = data.userId
    this.user.clone(data.user)
    this.name = data.name
    this.address = data.address
    this.signatureId = data.signatureId
    this.signature = data.signature ? new File(data.signature) : null
    this.signatureDate = data.signatureDate
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  convertFromResponse(data: any): void {
    this.id = data.id ?? ""
    this.companyId = data.company_id ?? ""
    this.strikingOffId = data.striking_off_id ?? ""
    this.userId = data.user_id ?? ""
    this.user = new StrikingOffUser(data.user)
    this.name = data.name ?? ""
    this.address = data.address ?? ""
    this.signatureId = data.signature_id ?? ""
    this.signature = data.signature ? new File(data.signature) : null
    this.signatureDate = data.signature_date ?? null
    this.createdAt = data.created_at ?? null
    this.updatedAt = data.updated_at ?? null
  }
}

export class StrikingOffClearanceDisclaimerLetter {
  id: string = ""
  companyId: string = ""
  strikingOffId: string = ""
  applicantId: string = ""
  applicant: StrikingOffUser = new StrikingOffUser()
  applicantName: string = ""
  applicantRole: string = ""
  signatureId: string = ""
  signature: File | null = null
  signatureDate: string | null = null
  createdAt: string | null = null
  updatedAt: string | null = null

  constructor(data: any | null = null) {
    if (data !== null) {
      if (data instanceof StrikingOffClearanceDisclaimerLetter) {
        this.clone(data)
      } else {
        this.convertFromResponse(data)
      }
    }
  }

  clone(data: StrikingOffClearanceDisclaimerLetter): void {
    this.id = data.id
    this.companyId = data.companyId
    this.strikingOffId = data.strikingOffId
    this.applicantId = data.applicantId
    this.applicant.clone(data.applicant)
    this.applicantName = data.applicantName
    this.applicantRole = data.applicantRole
    this.signatureId = data.signatureId
    this.signature = data.signature ? new File(data.signature) : null
    this.signatureDate = data.signatureDate
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  convertFromResponse(data: any): void {
    this.id = data.id ?? ""
    this.companyId = data.company_id ?? ""
    this.strikingOffId = data.striking_off_id ?? ""
    this.applicantId = data.applicant_id ?? ""
    this.applicant = new StrikingOffUser(data.applicant)
    this.applicantName = data.applicant_name ?? ""
    this.applicantRole = data.applicant_role ?? ""
    this.signatureId = data.signature_id ?? ""
    this.signature = data.signature ? new File(data.signature) : null
    this.signatureDate = data.signature_date ?? null
    this.createdAt = data.created_at ?? null
    this.updatedAt = data.updated_at ?? null
  }

  getRequestBody(): object {
    return {
      signature_id: this.signatureId,
    }
  }
}
