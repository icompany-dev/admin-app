import { StringUtil } from "../utils/String"
import { Application } from "./Application"
import { Error } from "../library/Error"
import type { IModelApplication } from "./IModelApplication"
import { File } from "./File"

export class CompanyFinancialStatement
  extends Application
  implements IModelApplication<CompanyFinancialStatement, ReturnType<typeof useCompanyFinancialStatementStore>>
{
  financialPeriodId: string | null = null
  financialYearStartDate: string = ""
  financialYearEndDate: string = ""
  circulationDate: string = ""
  isUnaudited: boolean = true // default to false
  isProfitable: boolean = false
  directorNames: string[] = []
  registeredOfficeAddress: string = ""
  businessAddress: string = ""
  bankers: string[] = []
  taxAgentDetails: string[] = []
  companySecretary: string = ""
  businessNature: string = ""
  finalAmount: number = 0
  responsibleDirector: string = ""
  hasAnyReservesOrProvisions: boolean = false
  isTransferredToReserves: boolean = false
  reservedAmount: number = 0
  hasDeclaredAnyDividends: boolean = false
  dividendAmount: number = 0
  directorsInterest: CompanyFinancialStatementDirectorInterest[] = []
  hasIssuedNewShares: boolean = false
  amountOfSharesIssued: number = 0
  hasDirectorsBenefits: boolean = false
  directorsBenefits: string = ""
  hasDirectorsRemunerations: boolean = false
  directorsRemuneration: string = ""
  exemptionType: string[] = []
  cityOfDeclaration: string = ""
  stateOfDeclaration: string = ""
  dateOfDeclaration: string = ""
  statementId: string | null = null
  statementFile: File | null = null
  generatedStatementId: string | null = null
  generatedStatement: File | null = null
  statementData: FinancialStatementData = new FinancialStatementData()

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyFinancialStatement) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.financialPeriodId = data.financial_period_id
    this.financialYearStartDate = data.financial_year_start_date
    this.financialYearEndDate = data.financial_year_end_date
    this.circulationDate = data.circulation_date
    this.isUnaudited = data.is_unaudited
    this.isProfitable = data.is_profitable
    this.directorNames = data.director_names
    this.registeredOfficeAddress = data.registered_office_address
    this.businessAddress = data.business_address
    this.bankers = data.bankers
    this.taxAgentDetails = data.tax_agent_details
    this.companySecretary = data.company_secretary
    this.businessNature = data.business_nature
    this.finalAmount = data.final_amount
    this.responsibleDirector = data.responsible_director
    this.hasAnyReservesOrProvisions = data.has_any_reserves_or_provisions
    this.isTransferredToReserves = data.is_transferred_to_reserves
    this.reservedAmount = data.reserved_amount
    this.hasDeclaredAnyDividends = data.has_declared_any_dividends
    this.dividendAmount = data.dividend_amount
    this.directorsInterest =
      data.directors_interest && Array.isArray(data.directors_interest)
        ? data.directors_interest.map((d: any) => {
            return new CompanyFinancialStatementDirectorInterest(d)
          })
        : []
    this.hasIssuedNewShares = data.has_issued_new_shares
    this.amountOfSharesIssued = data.amount_of_shares_issued
    this.hasDirectorsBenefits = data.has_directors_benefits
    this.directorsBenefits = data.directors_benefits
    this.hasDirectorsRemunerations = data.has_directors_remunerations
    this.directorsRemuneration = data.directors_remuneration
    this.exemptionType = data.exemption_type
    this.cityOfDeclaration = data.city_of_declaration ?? null
    this.stateOfDeclaration = data.state_of_declaration ?? null
    this.dateOfDeclaration = data.date_of_declaration ?? null
    this.statementId = data.statement_id ?? null
    this.statementFile = data.statement ? new File(data.statement) : null
    this.generatedStatementId = data.generated_statement_id ?? null
    this.generatedStatement = data.generated_statement ? new File(data.generated_statement) : null
    this.statementData = new FinancialStatementData(data.statement_data)
  }

  cloneDetails(data: CompanyFinancialStatement): void {
    super.clone(data)
    this.financialPeriodId = data.financialPeriodId
    this.financialYearStartDate = data.financialYearStartDate
    this.financialYearEndDate = data.financialYearEndDate
    this.circulationDate = data.circulationDate
    this.isUnaudited = data.isUnaudited
    this.isProfitable = data.isProfitable
    this.directorNames = data.directorNames
    this.registeredOfficeAddress = data.registeredOfficeAddress
    this.businessAddress = data.businessAddress
    this.bankers = data.bankers
    this.taxAgentDetails = data.taxAgentDetails
    this.companySecretary = data.companySecretary
    this.businessNature = data.businessNature
    this.finalAmount = data.finalAmount
    this.responsibleDirector = data.responsibleDirector
    this.hasAnyReservesOrProvisions = data.hasAnyReservesOrProvisions
    this.isTransferredToReserves = data.isTransferredToReserves
    this.reservedAmount = data.reservedAmount
    this.hasDeclaredAnyDividends = data.hasDeclaredAnyDividends
    this.dividendAmount = data.dividendAmount
    this.directorsInterest = data.directorsInterest.map((d: CompanyFinancialStatementDirectorInterest) => {
      return new CompanyFinancialStatementDirectorInterest(d)
    })
    this.hasIssuedNewShares = data.hasIssuedNewShares
    this.amountOfSharesIssued = data.amountOfSharesIssued
    this.hasDirectorsBenefits = data.hasDirectorsBenefits
    this.directorsBenefits = data.directorsBenefits
    this.hasDirectorsRemunerations = data.hasDirectorsRemunerations
    this.directorsRemuneration = data.directorsRemuneration
    this.exemptionType = data.exemptionType
    this.cityOfDeclaration = data.cityOfDeclaration
    this.stateOfDeclaration = data.stateOfDeclaration
    this.dateOfDeclaration = data.dateOfDeclaration
    this.statementId = data.statementId
    this.statementFile = data.statementFile ? new File(data.statementFile) : null
    this.generatedStatementId = data.generatedStatementId
    this.generatedStatement = data.generatedStatement ? new File(data.generatedStatement) : null
    this.statementData = new FinancialStatementData(data.statementData)
  }

  getRequestBody(): object {
    return {
      company_id: this.companyId,
      financial_period_id: this.financialPeriodId,
      financial_year_start_date: this.financialYearStartDate,
      financial_year_end_date: this.financialYearEndDate,
      circulation_date: this.circulationDate,
      is_unaudited: this.isUnaudited,
      is_profitable: this.isProfitable,
      director_names: this.directorNames,
      registered_office_address: this.registeredOfficeAddress,
      business_address: this.businessAddress,
      bankers: this.bankers,
      tax_agent_details: this.taxAgentDetails,
      company_secretary: this.companySecretary,
      business_nature: this.businessNature,
      final_amount: this.finalAmount,
      responsible_director: this.responsibleDirector,
      has_any_reserves_or_provisions: this.hasAnyReservesOrProvisions,
      is_transferred_to_reserves: this.isTransferredToReserves,
      reserved_amount: this.reservedAmount,
      has_declared_any_dividends: this.hasDeclaredAnyDividends,
      dividend_amount: this.dividendAmount,
      directors_interest: this.directorsInterest.map((d: CompanyFinancialStatementDirectorInterest) => {
        return d.getRequestBody()
      }),
      has_issued_new_shares: this.hasIssuedNewShares,
      amount_of_shares_issued: this.amountOfSharesIssued,
      has_directors_benefits: this.hasDirectorsBenefits,
      directors_benefits: this.directorsBenefits,
      has_directors_remunerations: this.hasDirectorsRemunerations,
      directors_remuneration: this.directorsRemuneration,
      exemption_type: this.exemptionType,
      city_of_declaration: this.cityOfDeclaration,
      state_of_declaration: this.stateOfDeclaration,
      date_of_declaration: this.dateOfDeclaration,
      statement_id: this.statementId,
      generated_statement_id: this.generatedStatementId,
      status: this.status,
      statement_data: this.statementData.getRequestBody(),
    }
  }

  canSubmit(): boolean {
    return !StringUtil.isNullOrEmpty(this.companyId) && !StringUtil.isNullOrEmpty(this.financialPeriodId)
  }

  async create(repository: ReturnType<typeof useCompanyFinancialStatementStore>): Promise<void> {
    if (!this.canSubmit()) {
      let error: Error = new Error()
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.create(data)
    if (repository.error) {
      let error: Error = new Error()
      error.setForCUD()
      throw error
    }

    this.convertFromResponseDetails(response)
  }

  async update(repository: ReturnType<typeof useCompanyFinancialStatementStore>): Promise<void> {
    if (!this.canSubmit() || StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error()
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.update(this.id, data)
    if (repository.error) {
      let error: Error = new Error()
      error.setForCUD()
      throw error
    }

    this.convertFromResponseDetails(response)
  }

  async remove(repository: ReturnType<typeof useCompanyFinancialStatementStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error()
      error.setForIncompleteData()
      throw error
    }

    const response = await repository.remove(this.id)
    if (repository.error) {
      let error: Error = new Error()
      error.setForCUD()
      throw error
    }

    return response
  }
}

export class CompanyFinancialStatementDirectorInterest {
  id: string = ""
  statementId: string = ""
  directorName: string = ""
  balanceAtStartOfYear: number = 0
  amountBought: number = 0
  amountSold: number = 0
  balanceAtEndOfYear: number = 0

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CompanyFinancialStatementDirectorInterest) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.statementId = data.statement_id
    this.directorName = data.director_name
    this.balanceAtStartOfYear = data.balance_at_start_of_year
    this.amountBought = data.amount_bought
    this.amountSold = data.amount_sold
    this.balanceAtEndOfYear = data.balance_at_end_of_year
  }

  clone(data: CompanyFinancialStatementDirectorInterest): void {
    this.id = data.id
    this.statementId = data.statementId
    this.directorName = data.directorName
    this.balanceAtStartOfYear = data.balanceAtStartOfYear
    this.amountBought = data.amountBought
    this.amountSold = data.amountSold
    this.balanceAtEndOfYear = data.balanceAtEndOfYear
  }

  getRequestBody(): object {
    return {
      director_name: this.directorName,
      balance_at_start_of_year: this.balanceAtStartOfYear,
      amount_bought: this.amountBought,
      amount_sold: this.amountSold,
      balance_at_end_of_year: this.balanceAtEndOfYear,
    }
  }
}

export class FinancialStatementData {
  isProfitOrLoss: string = ""
  totalProfitOrLoss: number = 0
  reasonForProfitOrLoss: string = ""
  statementOfFinancialPosition: FinancialStatementDataItem[] = []
  statementOfProfitOrLoss: FinancialStatementDataItem[] = []
  statementOfChangesInEquity: FinancialStatementDataItem[] = []
  statementOfCashFlows: FinancialStatementDataItem[] = []
  notesToTheFinancialStatements: FinancialStatementDataNote[] = []

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof FinancialStatementData) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.isProfitOrLoss = data.is_profit_or_loss
    this.totalProfitOrLoss = data.total_profit_or_loss ? Number(data.total_profit_or_loss) : 0
    this.reasonForProfitOrLoss = data.reason_for_profit_or_loss
    this.statementOfFinancialPosition =
      data.statement_of_financial_position && Array.isArray(data.statement_of_financial_position)
        ? data.statement_of_financial_position.map((d: any) => {
            return new FinancialStatementDataItem(d)
          })
        : []
    this.statementOfProfitOrLoss =
      data.statement_of_profit_or_loss && Array.isArray(data.statement_of_profit_or_loss)
        ? data.statement_of_profit_or_loss.map((d: any) => {
            return new FinancialStatementDataItem(d)
          })
        : []
    this.statementOfChangesInEquity =
      data.statement_of_changes_in_equity && Array.isArray(data.statement_of_changes_in_equity)
        ? data.statement_of_changes_in_equity.map((d: any) => {
            return new FinancialStatementDataItem(d)
          })
        : []
    this.statementOfCashFlows =
      data.statement_of_cash_flows && Array.isArray(data.statement_of_cash_flows)
        ? data.statement_of_cash_flows.map((d: any) => {
            return new FinancialStatementDataItem(d)
          })
        : []
    this.notesToTheFinancialStatements =
      data.notes_to_the_financial_statements && Array.isArray(data.notes_to_the_financial_statements)
        ? data.notes_to_the_financial_statements.map((d: any) => {
            return new FinancialStatementDataNote(d)
          })
        : []
  }

  clone(data: FinancialStatementData): void {
    this.isProfitOrLoss = data.isProfitOrLoss
    this.totalProfitOrLoss = data.totalProfitOrLoss
    this.reasonForProfitOrLoss = data.reasonForProfitOrLoss
    this.statementOfFinancialPosition = data.statementOfFinancialPosition.map((d: any) => {
      return new FinancialStatementDataItem(d)
    })
    this.statementOfProfitOrLoss = data.statementOfProfitOrLoss.map((d: any) => {
      return new FinancialStatementDataItem(d)
    })
    this.statementOfChangesInEquity = data.statementOfChangesInEquity.map((d: any) => {
      return new FinancialStatementDataItem(d)
    })
    this.statementOfCashFlows = data.statementOfCashFlows.map((d: any) => {
      return new FinancialStatementDataItem(d)
    })
    this.notesToTheFinancialStatements = data.notesToTheFinancialStatements.map((d: any) => {
      return new FinancialStatementDataNote(d)
    })
  }

  getRequestBody(): object {
    return {
      is_profit_or_loss: this.isProfitOrLoss,
      total_profit_or_loss: this.totalProfitOrLoss,
      reason_for_profit_or_loss: this.reasonForProfitOrLoss,
      statement_of_financial_position: this.statementOfFinancialPosition.map((d: FinancialStatementDataItem) => {
        return d.getRequestBody()
      }),
      statement_of_profit_or_loss: this.statementOfProfitOrLoss.map((d: FinancialStatementDataItem) => {
        return d.getRequestBody()
      }),
      statement_of_changes_in_equity: this.statementOfChangesInEquity.map((d: FinancialStatementDataItem) => {
        return d.getRequestBody()
      }),
      statement_of_cash_flows: this.statementOfCashFlows.map((d: FinancialStatementDataItem) => {
        return d.getRequestBody()
      }),
      notes_to_the_financial_statements: this.notesToTheFinancialStatements.map((d: FinancialStatementDataNote) => {
        return d.getRequestBody()
      }),
    }
  }
}

export class FinancialStatementDataItem {
  itemType: string = ""
  description: string = ""
  amount: number | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof FinancialStatementDataItem) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.itemType = data.item_type
    this.description = data.description
    this.amount = data.amount
  }

  clone(data: FinancialStatementDataItem): void {
    this.itemType = data.itemType
    this.description = data.description
    this.amount = data.amount
  }

  getRequestBody(): object {
    return {
      item_type: this.itemType,
      description: this.description,
      amount: this.amount,
    }
  }
}

export class FinancialStatementDataNote {
  noteNumber: number = 1
  title: string = ""
  content: string = ""
  subsections: FinancialStatementDataNoteSubsection[] = []

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof FinancialStatementDataNote) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.noteNumber = data.note_number
    this.title = data.title
    this.content = data.content
    this.subsections =
      data.subsections && Array.isArray(data.subsections)
        ? data.subsections.map((d: any) => {
            return new FinancialStatementDataNoteSubsection(d)
          })
        : []
  }

  clone(data: FinancialStatementDataNote): void {
    this.noteNumber = data.noteNumber
    this.title = data.title
    this.content = data.content
    this.subsections = data.subsections
      ? data.subsections.map((d: any) => {
          return new FinancialStatementDataNoteSubsection(d)
        })
      : []
  }

  getRequestBody(): object {
    return {
      note_number: this.noteNumber,
      title: this.title,
      content: this.content,
      subsections: this.subsections
        ? this.subsections.map((d: any) => {
            return d.getRequestBody()
          })
        : [],
    }
  }
}

export class FinancialStatementDataNoteSubsection {
  subtitle: string = ""
  content: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof FinancialStatementDataNoteSubsection) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.subtitle = data.subtitle
    this.content = data.content
  }

  clone(data: FinancialStatementDataNoteSubsection): void {
    this.subtitle = data.subtitle
    this.content = data.content
  }

  getRequestBody(): object {
    return {
      subtitle: this.subtitle,
      content: this.content,
    }
  }
}
