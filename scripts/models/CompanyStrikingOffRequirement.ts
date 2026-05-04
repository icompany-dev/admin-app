import { StringUtil } from "../utils/String"
import { Application } from "./Application"
import { File } from "./File"
import { Error } from "../library/Error"
import type { IModelApplication } from "./IModelApplication"

export class CompanyStrikingOffRequirement
  extends Application
  implements IModelApplication<CompanyStrikingOffRequirement, ReturnType<typeof useCompanyStrikingOffRequirementStore>>
{
  lastDateOfOperation: string = ""
  isNotOperating: boolean = false
  isAbandoned: boolean = false
  areBankAccountsClosed: boolean = false
  bankStatementFileIds: string[] = []
  bankStatementFiles: File[] | null = null
  noOutstandingAnnualCompliance: boolean = false
  isManagementAccountProvided: boolean = false
  noActiveEmployment: boolean = false
  hasNoAssetsLiabilities: boolean = false
  managementAccountFileIds: string[] = []
  managementAccountFiles: File[] | null = null
  epfSocsoClearanceFileIds: string[] = []
  epfSocsoClearanceFiles: File[] | null = null
  letterOfWaiverFileIds: string[] = []
  letterOfWaiverFiles: File[] | null = null
  noOutstandingCharges: boolean = false
  noOutstandingCompound: boolean = false
  noOutstandingTax: boolean = false
  taxClearanceFileId: string[] = []
  taxClearanceFile: File | null = null
  additionalDocumentIds: string[] = []
  additionalDocuments: File[] | null = []
  likelihoodScore: number = 0
  rejectReason: string = ""

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyStrikingOffRequirement) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.lastDateOfOperation = data.last_date_of_operation
    this.isNotOperating = Boolean(data.is_not_operating)
    this.isAbandoned = Boolean(data.is_abandoned)
    this.areBankAccountsClosed = Boolean(data.are_bank_accounts_closed)
    this.bankStatementFileIds = data.bank_statement_file_ids
    this.bankStatementFiles =
      data.bank_statement_files && Array.isArray(data.bank_statement_files)
        ? data.bank_statement_files.map((d: any) => {
            return new File(d)
          })
        : null
    this.noOutstandingAnnualCompliance = Boolean(data.no_outstanding_annual_compliance)
    this.isManagementAccountProvided = Boolean(data.is_management_account_provided)
    this.noActiveEmployment = Boolean(data.no_active_employment)
    this.hasNoAssetsLiabilities = Boolean(data.has_no_assets_liabilities)
    this.managementAccountFileIds = data.management_account_file_ids
    this.managementAccountFiles =
      data.management_account_files && Array.isArray(data.management_account_files)
        ? data.management_account_files.map((d: any) => {
            return new File(d)
          })
        : null
    this.epfSocsoClearanceFileIds = data.epf_socso_clearance_file_ids
    this.epfSocsoClearanceFiles =
      data.epf_socso_clearance_files && Array.isArray(data.epf_socso_clearance_files)
        ? data.epf_socso_clearance_files.map((d: any) => {
            return new File(d)
          })
        : null
    this.letterOfWaiverFileIds = data.letter_of_waiver_file_ids
    this.letterOfWaiverFiles =
      data.letter_of_waiver_files && Array.isArray(data.letter_of_waiver_files)
        ? data.letter_of_waiver_files.map((d: any) => {
            return new File(d)
          })
        : null
    this.noOutstandingCharges = Boolean(data.no_outstanding_charges)
    this.noOutstandingCompound = Boolean(data.no_outstanding_compound)
    this.noOutstandingTax = Boolean(data.no_outstanding_tax)
    this.taxClearanceFileId = data.tax_clearance_file_id
    this.taxClearanceFile = data.tax_clearance_file ? new File(data.tax_clearance_file) : null
    this.additionalDocumentIds = data.additional_document_ids
    this.additionalDocuments =
      data.additional_documents && Array.isArray(data.additional_documents)
        ? data.additional_documents.map((d: any) => {
            return new File(d)
          })
        : null
    this.likelihoodScore = data.likelihood_score
    this.rejectReason = data.reject_reason
  }

  cloneDetails(data: CompanyStrikingOffRequirement): void {
    super.clone(data)
    this.lastDateOfOperation = data.lastDateOfOperation
    this.isNotOperating = data.isNotOperating
    this.isAbandoned = data.isAbandoned
    this.areBankAccountsClosed = data.areBankAccountsClosed
    this.bankStatementFileIds = data.bankStatementFileIds
    this.bankStatementFiles = data.bankStatementFiles
    this.noOutstandingAnnualCompliance = data.noOutstandingAnnualCompliance
    this.isManagementAccountProvided = data.isManagementAccountProvided
    this.noActiveEmployment = data.noActiveEmployment
    this.hasNoAssetsLiabilities = data.hasNoAssetsLiabilities
    this.managementAccountFileIds = data.managementAccountFileIds
    this.managementAccountFiles = data.managementAccountFiles
    this.epfSocsoClearanceFileIds = data.epfSocsoClearanceFileIds
    this.epfSocsoClearanceFiles = data.epfSocsoClearanceFiles
    this.letterOfWaiverFileIds = data.letterOfWaiverFileIds
    this.letterOfWaiverFiles = data.letterOfWaiverFiles
    this.noOutstandingCharges = data.noOutstandingCharges
    this.noOutstandingCompound = data.noOutstandingCompound
    this.noOutstandingTax = data.noOutstandingTax
    this.taxClearanceFileId = data.taxClearanceFileId
    this.taxClearanceFile = data.taxClearanceFile
    this.additionalDocumentIds = data.additionalDocumentIds
    this.additionalDocuments = data.additionalDocuments
    this.likelihoodScore = data.likelihoodScore
    this.rejectReason = data.rejectReason
  }

  getRequestBody(): object {
    return {
      company_id: this.companyId,
      last_date_of_operation: this.lastDateOfOperation,
      status: this.status,
      are_bank_accounts_closed: this.areBankAccountsClosed,
      bank_statement_file_ids: this.bankStatementFileIds,
      no_outstanding_annual_compliance: this.noOutstandingAnnualCompliance,
      is_management_account_provided: this.isManagementAccountProvided,
      no_active_employment: this.noActiveEmployment,
      has_no_assets_liabilities: this.hasNoAssetsLiabilities,
      management_account_file_ids: this.managementAccountFileIds,
      epf_socso_clearance_file_ids: this.epfSocsoClearanceFileIds,
      letter_of_waiver_file_ids: this.letterOfWaiverFileIds,
      no_outstanding_charges: this.noOutstandingCharges,
      no_outstanding_compound: this.noOutstandingCompound,
      no_outstanding_tax: this.noOutstandingTax,
      tax_clearance_file_id: this.taxClearanceFileId,
      additional_document_ids: this.additionalDocumentIds,
      likelihood_score: this.likelihoodScore,
      reject_reason: this.rejectReason,
    }
  }

  canSubmit(): boolean {
    return !StringUtil.isNullOrEmpty(this.companyId) && !StringUtil.isNullOrEmpty(this.lastDateOfOperation)
  }

  async create(repository: ReturnType<typeof useCompanyStrikingOffRequirementStore>): Promise<void> {
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

  async update(repository: ReturnType<typeof useCompanyStrikingOffRequirementStore>): Promise<void> {
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

  async remove(repository: ReturnType<typeof useCompanyStrikingOffRequirementStore>): Promise<void> {
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
