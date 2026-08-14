import { SelectOption } from "~/scripts/types/SelectOption"

export enum AccountingTransactionCategories {
  BankingCash = "banking-cash",
  SalesRevenue = "sales-revenue",
  PurchaseExpense = "purchase-expense",
  PayrollStaffCost = "payroll-staff-cost",
  CapitalFinancing = "capital-financing",
  Others = "others", //pending option for others
}

export enum AccountingJournalEntryAccounts {
  AccountsPayable = "accounts-payable",
  AccountsReceivable = "accounts-receivable",
  AccruedIncome = "accrued-income",
  Asset = "asset",
  Bank = "bank",
  Cash = "cash",
  DeferredIncome = "deferred-income",
  OtherIncome = "other-income",
  OtherReceivable = "other-receivable",
  Revenue = "revenue",
}

export class AccountingConstants {
  static MANAGEMENT_ACCOUNT_VIEW_MAIN: string = "main"
  static MANAGEMENT_ACCOUNT_VIEW_DOCUMENTS: string = "documents"

  static JOURNAL_ENTRY_ACCOUNTS_PAYABLE = new SelectOption(
    AccountingJournalEntryAccounts.AccountsPayable,
    AccountingJournalEntryAccounts.AccountsPayable,
    "Accounts Payable"
  )
  static JOURNAL_ENTRY_ACCOUNTS_RECEIVABLE = new SelectOption(
    AccountingJournalEntryAccounts.AccountsReceivable,
    AccountingJournalEntryAccounts.AccountsReceivable,
    "Accounts Receivable"
  )
  static JOURNAL_ENTRY_ACCRUED_INCOME = new SelectOption(
    AccountingJournalEntryAccounts.AccruedIncome,
    AccountingJournalEntryAccounts.AccruedIncome,
    "Accrued Income"
  )
  static JOURNAL_ENTRY_ASSET = new SelectOption(
    AccountingJournalEntryAccounts.Asset,
    AccountingJournalEntryAccounts.Asset,
    "Asset"
  )
  static JOURNAL_ENTRY_BANK = new SelectOption(
    AccountingJournalEntryAccounts.Bank,
    AccountingJournalEntryAccounts.Bank,
    "Bank"
  )
  static JOURNAL_ENTRY_CASH = new SelectOption(
    AccountingJournalEntryAccounts.Cash,
    AccountingJournalEntryAccounts.Cash,
    "Cash"
  )
  static JOURNAL_ENTRY_DEFERRED_INCOME = new SelectOption(
    AccountingJournalEntryAccounts.DeferredIncome,
    AccountingJournalEntryAccounts.DeferredIncome,
    "Deferred Income"
  )
  static JOURNAL_ENTRY_OTHER_INCOME = new SelectOption(
    AccountingJournalEntryAccounts.OtherIncome,
    AccountingJournalEntryAccounts.OtherIncome,
    "Other Income"
  )
  static JOURNAL_ENTRY_OTHER_RECEIVABLE = new SelectOption(
    AccountingJournalEntryAccounts.OtherReceivable,
    AccountingJournalEntryAccounts.OtherReceivable,
    "Other Receivable"
  )
  static JOURNAL_ENTRY_REVENUE = new SelectOption(
    AccountingJournalEntryAccounts.Revenue,
    AccountingJournalEntryAccounts.Revenue,
    "Revenue"
  )
}
