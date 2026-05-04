import { CompanyManagementAccountData } from "~/scripts/models/CompanyManagementAccountData"

export class ProcessedOcrManagementAccountData {
  amount: number = 0
  isDebitBalanceSheet: boolean = false
  isDebitProfitLoss: boolean = false
  debitTarget: string = ""
  debitData: CompanyManagementAccountData = new CompanyManagementAccountData()
  isCreditBalanceSheet: boolean = false
  isCreditProfitLoss: boolean = false
  creditTarget: string = ""
  creditData: CompanyManagementAccountData = new CompanyManagementAccountData()

  constructor(
    amount: number,
    isDebitBalanceSheet: boolean,
    isDebitProfitLoss: boolean,
    debitTarget: string,
    debitData: CompanyManagementAccountData,
    isCreditBalanceSheet: boolean,
    isCreditProfitLoss: boolean,
    creditTarget: string,
    creditData: CompanyManagementAccountData
  ) {
    this.amount = amount
    this.isDebitBalanceSheet = isDebitBalanceSheet
    this.isDebitProfitLoss = isDebitProfitLoss
    this.debitTarget = debitTarget
    this.debitData = debitData
    this.isCreditBalanceSheet = isCreditBalanceSheet
    this.isCreditProfitLoss = isCreditProfitLoss
    this.creditTarget = creditTarget
    this.creditData = creditData
  }
}
