import type { useCompanySetFinancialYearEndStore } from "~/stores/CompanySetFinancialYearEnds"
import { Application } from "./Application"
import type { IModelApplication } from "./IModelApplication"
import { User } from "./User"
import { StringUtil } from "../utils/String"
import { Error } from "../library/Error"
import { FinancialYearEndConstants } from "../constants/FinancialYearEnds"

export class CompanySetFinancialYearEnd
  extends Application
  implements IModelApplication<CompanySetFinancialYearEnd, ReturnType<typeof useCompanySetFinancialYearEndStore>>
{
  type: string = FinancialYearEndConstants.AMENDMENT_TYPE_SET
  financialPeriodStartDate: string = ""
  financialPeriodEndDate: string = ""
  financialYearEndDate: string = ""
  previousFinancialYearEnd: string = ""
  initiatedById: string = ""
  initiatedBy: User = new User()
  withdrawnAt: string | null = null
  withdrawnById: string | null = null
  withdrawnBy: User | null = null

  //for reso purposes
  fyeDateMonth: string = ""

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanySetFinancialYearEnd) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.type = data.type
    this.financialPeriodStartDate = data.financial_period_start_date
    this.financialPeriodEndDate = data.financial_period_end_date
    this.financialYearEndDate = data.financial_year_end_date
    this.previousFinancialYearEnd = data.previous_financial_year_end
    this.initiatedById = data.initiated_by_id
    this.initiatedBy = new User(data.initiated_by)
    this.withdrawnAt = data.withdrawn_at
    this.withdrawnById = data.withdrawn_by_id
    this.withdrawnBy = data.withdrawn_by ? new User(data.withdrawn_by) : null
  }

  cloneDetails(data: CompanySetFinancialYearEnd): void {
    super.clone(data)
    this.type = data.type
    this.financialPeriodStartDate = data.financialPeriodStartDate
    this.financialPeriodEndDate = data.financialPeriodEndDate
    this.financialYearEndDate = data.financialYearEndDate
    this.previousFinancialYearEnd = data.previousFinancialYearEnd
    this.initiatedById = data.initiatedById
    this.initiatedBy = new User(data.initiatedBy)
    this.withdrawnAt = data.withdrawnAt
    this.withdrawnById = data.withdrawnById
    this.withdrawnBy = data.withdrawnBy ? new User(data.withdrawnBy) : null
  }

  getRequestBody(): object {
    let time = useLocalTime()

    let startDate = StringUtil.isNullOrEmpty(this.financialPeriodStartDate)
      ? null
      : time.formatDateOnlySystem(this.financialPeriodStartDate)
    let endDate = StringUtil.isNullOrEmpty(this.financialPeriodEndDate)
      ? null
      : time.formatDateOnlySystem(this.financialPeriodEndDate)
    let fye = StringUtil.isNullOrEmpty(this.financialYearEndDate)
      ? null
      : time.formatDateOnlySystem(this.financialYearEndDate)
    let previousFye = StringUtil.isNullOrEmpty(this.previousFinancialYearEnd)
      ? null
      : time.formatDateOnlySystem(this.previousFinancialYearEnd)

    let data: any = {
      company_id: this.companyId,
    }

    if (startDate) {
      data.financial_period_start_date = startDate
    }
    if (endDate) {
      data.financial_period_end_date = endDate
    }
    if (fye) {
      data.financial_year_end_date = fye
    }
    if (previousFye) {
      data.previous_financial_year_end = previousFye
    }
    if (!StringUtil.isNullOrEmpty(this.type)) {
      data.type = this.type
    }
    if (!StringUtil.isNullOrEmpty(this.status)) {
      data.status = this.status
    }

    return data
  }

  canSubmit(): boolean {
    return (
      !StringUtil.isNullOrEmpty(this.companyId) &&
      !StringUtil.isNullOrEmpty(this.type) &&
      !StringUtil.isNullOrEmpty(this.status)
    )
  }

  async create(repository: ReturnType<typeof useCompanySetFinancialYearEndStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId)) {
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

  async update(repository: ReturnType<typeof useCompanySetFinancialYearEndStore>): Promise<void> {
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

  async remove(repository: ReturnType<typeof useCompanySetFinancialYearEndStore>): Promise<void> {
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
