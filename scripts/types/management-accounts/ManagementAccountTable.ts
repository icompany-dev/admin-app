import type { ManagementAccountTableRow } from "./ManagementAccountTableRow"

export class ManagementAccountTable {
  rows: ManagementAccountTableRow[] = []
  isBalanceSheet: boolean = false

  constructor(rows: ManagementAccountTableRow[], isBalanceSheet: boolean) {
    this.rows = rows
    this.isBalanceSheet = isBalanceSheet
  }
}
