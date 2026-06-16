import type { useCompanyManagementAccountStore } from "~/stores/CompanyManagementAccounts"
import { CompanyItem } from "./CompanyItem"
import { CompanyManagementAccountBalanceSheet } from "./CompanyManagementAccountBalanceSheet"
import { CompanyManagementAccountProfitLoss } from "./CompanyManagementAccountProfitLoss"
import { File } from "./File"
import type { IModel } from "./IModel"
import { StringUtil } from "../utils/String"
import { Error } from "../library/Error"
import type { IAutoSaveEnabled } from "./IAutoSaveEnabled"
import { StatusConstants } from "../constants/Status"
import { Application } from "./Application"
import type { IModelApplication } from "./IModelApplication"

export class CompanyManagementAccount
  extends Application //CompanyItem
  implements
    IModelApplication<CompanyManagementAccount, ReturnType<typeof useCompanyManagementAccountStore>>,
    IAutoSaveEnabled<CompanyManagementAccount, ReturnType<typeof useCompanyManagementAccountStore>>
{
  // status: string = StatusConstants.DRAFT
  financialYearStartDate: string | null = null
  financialYearEndDate: string | null = null
  balanceSheet: CompanyManagementAccountBalanceSheet = new CompanyManagementAccountBalanceSheet()
  profitLoss: CompanyManagementAccountProfitLoss = new CompanyManagementAccountProfitLoss()
  fileId: string | null = null
  file: File = new File()

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyManagementAccount) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.status = data.status
    this.financialYearStartDate = data.financial_year_start_date
    this.financialYearEndDate = data.financial_year_end_date
    this.balanceSheet = new CompanyManagementAccountBalanceSheet(data.balance_sheet)
    this.profitLoss = new CompanyManagementAccountProfitLoss(data.profit_loss)
    this.fileId = data.file_id
    this.file = new File(data.file)
  }

  cloneDetails(data: CompanyManagementAccount): void {
    super.clone(data)
    this.status = data.status
    this.financialYearStartDate = data.financialYearStartDate
    this.financialYearEndDate = data.financialYearEndDate
    this.balanceSheet = new CompanyManagementAccountBalanceSheet(data.balanceSheet)
    this.profitLoss = new CompanyManagementAccountProfitLoss(data.profitLoss)
    this.fileId = data.fileId
    this.file = new File(data.file)
  }

  getRequestBody(): object {
    return {
      company_id: this.companyId,
      financial_year_start_date: this.financialYearStartDate,
      financial_year_end_date: this.financialYearEndDate,
      balance_sheet: this.balanceSheet.getRequestBody(),
      profit_loss: this.profitLoss.getRequestBody(),
      status: this.status,
      file_id: this.fileId,
    }
  }

  isTheSame(record: CompanyManagementAccount): boolean {
    return this.balanceSheet.isTheSame(record.balanceSheet) && this.profitLoss.isTheSame(record.profitLoss)
  }

  canSubmit(): boolean {
    return true
  }

  canSubmitDetails(checkValidity: boolean): boolean {
    if (!checkValidity) {
      return true
    }

    const balanceSheetCanSubmit = this.balanceSheet.canSubmit(checkValidity)
    const profitLossCanSubmit = this.profitLoss.canSubmit(checkValidity)

    return (
      this.financialYearEndDate !== null &&
      this.financialYearStartDate !== null &&
      this.companyId !== null &&
      balanceSheetCanSubmit &&
      profitLossCanSubmit
    )
  }

  // We need to move this to the controller. It should not be in here
  getInvalidErrorMessage(): string {
    if (this.canSubmitDetails(true)) {
      return ""
    }

    if (!this.financialYearEndDate || !this.financialYearStartDate) {
      return "Your Financial Period is incomplete."
    }

    if (!this.balanceSheet.isCurrentAssetsValid(true)) {
      return "Your balance sheet (current assets) is incomplete."
    }
    if (!this.balanceSheet.isNonCurrentAssetsValid(true)) {
      return "Your balance sheet (non current assets) is incomplete."
    }
    if (!this.balanceSheet.isOtherAssetsValid(true)) {
      return "Your balance sheet (other assets) is incomplete."
    }
    if (!this.balanceSheet.isCurrentLiabilitiesValid(true)) {
      return "Your balance sheet (current liabilities) is incomplete."
    }
    if (!this.balanceSheet.isNonCurrentLiabilitiesValid(true)) {
      return "Your balance sheet (non current liabilities) is incomplete."
    }
    if (!this.balanceSheet.isOtherLiabilitiesValid(true)) {
      return "Your balance sheet (other liabilities) is incomplete."
    }
    if (!this.balanceSheet.isEquityValid(true)) {
      return "Your balance sheet (equity) is incomplete."
    }
    if (!this.balanceSheet.isEquityLiabilitiesValid(true)) {
      return "Your balance sheet assets and liability are not equal."
    }

    // Profit Loss
    if (!this.profitLoss.isRevenueValid(true)) {
      return "Your profit loss (revenue) is incomplete."
    }
    if (!this.profitLoss.isCostOfGoodSoldValid(true)) {
      return "Your profit loss (cost of good sold) is incomplete."
    }
    if (!this.profitLoss.isOtherIncomeValid(true)) {
      return "Your profit loss (other income) is incomplete."
    }
    if (!this.profitLoss.isExpensesValid(true)) {
      return "Your profit loss (expenses) is incomplete."
    }

    return "Management Account is incomplete. Please ensure all the data has been inserted before submitting."
  }

  isDormant(): boolean {
    return this.profitLoss.isEmpty()
  }

  isZeroRevenue(): boolean {
    return this.profitLoss.getTotalRevenue() === 0 && this.balanceSheet.getTotalAssets() <= 300000
  }

  isThresholdQualified(): boolean {
    return this.profitLoss.getTotalRevenue() <= 100000 && this.balanceSheet.getTotalAssets() <= 300000
  }

  async fetchStartDate(repository: ReturnType<typeof useCompanyManagementAccountStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let response = await repository.fetchStartDate(this.companyId)
    if (repository.error !== null) {
      throw repository.error
    }

    this.financialYearStartDate = response.start_date ?? null
  }

  async setDefaultFinancialYearEndDate(repository: ReturnType<typeof useCompanyManagementAccountStore>): Promise<void> {
    await this.fetchStartDate(repository)

    const dayjs = useDayjs()
    const time = useLocalTime()

    const startDate = dayjs(this.financialYearStartDate)

    const day = this.company?.companySetting?.auditDay
    const month = this.company?.companySetting?.auditMonth
    const year = startDate.format("YYYY")

    const targetDate = dayjs(`${year}-${month}-${day}`)

    if (targetDate.isSame(startDate, "day") || targetDate.isBefore(startDate, "day")) {
      this.financialYearEndDate = time.formatDateOnlySystem(targetDate.toString())
    } else {
      this.financialYearEndDate = time.formatDateOnlySystem(targetDate.add(1, "year").toString())
    }
  }

  async create(repository: ReturnType<typeof useCompanyManagementAccountStore>): Promise<void> {
    if (
      this.financialYearStartDate === null ||
      this.financialYearEndDate === null ||
      StringUtil.isNullOrEmpty(this.companyId)
    ) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    let response = await repository.create(data)
    this.convertFromResponseDetails(response)
  }

  async update(repository: ReturnType<typeof useCompanyManagementAccountStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    if (
      this.financialYearStartDate === null ||
      this.financialYearEndDate === null ||
      StringUtil.isNullOrEmpty(this.companyId)
    ) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    let response = await repository.update(this.id, data)

    this.convertFromResponseDetails(response)
  }

  async remove(repository: ReturnType<typeof useCompanyManagementAccountStore>): Promise<any> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let response = await repository.remove(this.id)
    if (repository.error !== null) {
      throw repository.error
    }

    return response
  }
}
