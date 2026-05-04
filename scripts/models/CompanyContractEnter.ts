import { StringUtil } from "../utils/String"
import { Error } from "~/scripts/library/Error"
import { Application } from "./Application"
import type { IModelApplication } from "./IModelApplication"
import {
  CompanyContractEnterRole,
  CompanyContractEnterDocumentType,
  CompanyContractEnterValidity,
} from "../constants/CompanyContracts"

export class CompanyContractEnter
  extends Application
  implements IModelApplication<CompanyContractEnter, ReturnType<typeof useCompanyContractEnterStore>>
{
  refNo: string = ""
  authorisedPersons: string = ""
  role: string = CompanyContractEnterRole.Director
  documentType: string = CompanyContractEnterDocumentType.General
  documentName: string = ""
  contractWith: string[] = []
  validity: string = CompanyContractEnterValidity.UntilRevoke
  numberYears: number = 1
  isAdditionalClauseRequired: boolean = false
  initiatedBy: string = ""
  shippedAt: string = ""
  trackingUrl: string = ""
  trackingNumber: string = ""
  withdrawnAt: string = ""

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyContractEnter) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.refNo = data.ref_no ?? ""
    this.authorisedPersons = data.authorised_persons ?? ""
    this.role = data.role ?? ""
    this.documentType = data.document_type ?? ""
    this.documentName = data.document_name ?? ""
    this.contractWith = data.contract_with ?? []
    this.validity = data.validity ?? ""
    this.numberYears = data.number_years ?? ""
    this.isAdditionalClauseRequired = data.is_additional_clause_required ?? false
    this.initiatedBy = data.initiated_by ?? ""
    this.shippedAt = data.shipped_at ?? ""
    this.trackingUrl = data.tracking_url ?? ""
    this.trackingNumber = data.tracking_number ?? ""
    this.withdrawnAt = data.withdrawn_at ?? ""
  }

  cloneDetails(data: CompanyContractEnter): void {
    super.clone(data)
    this.refNo = data.refNo
    this.authorisedPersons = data.authorisedPersons
    this.role = data.role
    this.documentType = data.documentType
    this.documentName = data.documentName
    this.contractWith = data.contractWith
    this.validity = data.validity
    this.numberYears = data.numberYears
    this.isAdditionalClauseRequired = data.isAdditionalClauseRequired
    this.initiatedBy = data.initiatedBy
    this.shippedAt = data.shippedAt
    this.trackingUrl = data.trackingUrl
    this.trackingNumber = data.trackingNumber
    this.withdrawnAt = data.withdrawnAt
  }

  getRequestBody(): object {
    return {
      company_id: this.companyId,
      authorised_persons: this.authorisedPersons,
      role: this.role,
      document_type: this.documentType,
      document_name: this.documentName,
      contract_with: this.contractWith,
      validity: this.validity,
      number_years: this.numberYears,
      is_additional_clause_required: this.isAdditionalClauseRequired,
      status: this.status,
    }
  }

  canSubmit(): boolean {
    return !StringUtil.isNullOrEmpty(this.companyId)
  }

  async create(repository: ReturnType<typeof useCompanyContractEnterStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId)) {
      let error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.create(data)
    if (repository.error) {
      let error = new Error(Error.ERROR_TYPE_API, repository.error)
      throw error
    }

    this.convertFromResponseDetails(response)
  }

  async update(repository: ReturnType<typeof useCompanyContractEnterStore>): Promise<void> {
    if (!this.canSubmit() || StringUtil.isNullOrEmpty(this.id)) {
      let error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.update(this.id, data)
    if (repository.error) {
      let error = new Error(Error.ERROR_TYPE_API, repository.error)
      throw error
    }

    this.convertFromResponseDetails(response)
  }

  async remove(repository: ReturnType<typeof useCompanyContractEnterStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error = new Error(
        Error.ERROR_TYPE_DATA,
        "Application ID is empty. Please create the application before removing."
      )
      throw error
    }

    const response = await repository.remove(this.id)
    if (repository.error) {
      let error = new Error(Error.ERROR_TYPE_API, repository.error)
      throw error
    }

    return response
  }
}
