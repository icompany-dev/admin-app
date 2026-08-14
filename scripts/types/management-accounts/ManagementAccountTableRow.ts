import type { ManagementAccountTableColumn } from "./ManagementAccountTableColumn"

export class ManagementAccountTableRow {
  columns: ManagementAccountTableColumn[] = []
  cssClass: string = ""

  constructor(columns: ManagementAccountTableColumn[], cssClass: string = "") {
    this.columns = columns
    this.cssClass = cssClass
  }
}
