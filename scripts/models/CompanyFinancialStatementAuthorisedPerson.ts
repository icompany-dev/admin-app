import { Application } from "./Application"
import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"
import type { IModelApplication } from "./IModelApplication"

export class CompanyFinancialStatementAuthorisedPerson
  extends Application
  implements
    IModelApplication<
      CompanyFinancialStatementAuthorisedPerson,
      ReturnType<typeof useCompanyFinancialStatementAuthorisedPersonStore>
    >
{
  financialPeriodId: string | null = ""
  authorisedForStatutory: string | null = null
  authorisedForReports: string | null = null

  actOrConstitution: string = "pursuant to Section 251 (2) of the Companies Act, 2016"

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyFinancialStatementAuthorisedPerson) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.financialPeriodId = data.financial_period_id ?? null
    this.authorisedForStatutory = data.authorised_for_statutory ?? null
    this.authorisedForReports = data.authorised_for_reports ?? null
  }

  cloneDetails(data: CompanyFinancialStatementAuthorisedPerson): void {
    super.clone(data)
    this.financialPeriodId = data.financialPeriodId
    this.authorisedForStatutory = data.authorisedForStatutory
    this.authorisedForReports = data.authorisedForReports
  }

  canSubmit() {
    return !StringUtil.isNullOrEmpty(this.companyId)
  }

  getRequestBody() {
    return {
      company_id: this.companyId,
      financial_period_id: this.financialPeriodId,
      authorised_for_statutory: this.authorisedForStatutory,
      authorised_for_reports: this.authorisedForReports,
      status: this.status,
    }
  }

  async create(repository: ReturnType<typeof useCompanyFinancialStatementAuthorisedPersonStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    try {
      const newCompanyFinancialStatementAuthorisedPerson = await repository.create(this.getRequestBody())
      if (repository.error && !StringUtil.isNullOrEmpty(repository.error)) {
        throw repository.error
      }

      this.convertFromResponse(newCompanyFinancialStatementAuthorisedPerson)
    } catch (error) {
      let errorMessage: Error = new Error("", "")
      errorMessage.setForCUD()
      throw errorMessage
    }
  }

  async update(repository: ReturnType<typeof useCompanyFinancialStatementAuthorisedPersonStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id) || !this.canSubmit()) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    try {
      const updatedCompanyFinancialStatementAuthorisedPerson = await repository.update(this.id, this.getRequestBody())
      if (repository.error && !StringUtil.isNullOrEmpty(repository.error)) {
        throw repository.error
      }

      this.convertFromResponse(updatedCompanyFinancialStatementAuthorisedPerson)
    } catch (error) {
      let errorMessage: Error = new Error("", "")
      errorMessage.setForCUD()
      throw errorMessage
    }
  }

  async remove(repository: ReturnType<typeof useCompanyFinancialStatementAuthorisedPersonStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    try {
      await repository.remove(this.id)
      if (repository.error && !StringUtil.isNullOrEmpty(repository.error)) {
        throw repository.error
      }
    } catch (error) {
      let errorMessage: Error = new Error("", "")
      errorMessage.setForCUD()
      throw errorMessage
    }
  }
}
