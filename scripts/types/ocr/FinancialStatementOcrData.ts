import { OcrData } from "./OcrData"

export class FinancialStatementOcrData extends OcrData {
  canSubmitUnaudited: boolean = false
  reason: string = ""

  constructor(jsonObject: any) {
    super(jsonObject)

    this.canSubmitUnaudited = jsonObject.can_submit_unaudited
    this.reason = jsonObject.reason
  }
}
