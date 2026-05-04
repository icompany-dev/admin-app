import { SelectOption } from "../types/SelectOption"

export enum FinancialStatementTypes {
  Audited = 'audited',
  Unaudited = 'unaudited'
}

export class AuditConstants {
  static AUDITED: SelectOption = new SelectOption("audited", "audited", "Audited")
  static UNAUDITED: SelectOption = new SelectOption("unaudited", "unaudited", "Unaudited")

  static AUDIT_CIRCULATION_OPTIONS: Array<SelectOption> = [this.AUDITED, this.UNAUDITED]
}