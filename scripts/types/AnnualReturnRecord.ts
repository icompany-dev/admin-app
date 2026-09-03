import _, { type PartialObject } from "lodash"

export class AnnualReturnRecord {
  year: number = 0
  date: string = ""
  lodgementDueDate: string = ""
  daysTillLodgment: number = 0
  noOfDaysOverDue: number = 0
  status: string = ""
  cssClass: string = ""
  iconClass: string = ""
  isOverdue: boolean = false
  isIncoming: boolean = false
  isPaid: boolean = false
  isLodged: boolean = false
  showDayCount: boolean = false
  canDownload: boolean = false
  canPay: boolean = false
  noticeForPayment: string = ""

  constructor(data: PartialObject<AnnualReturnRecord> = {}) {
    Object.assign(this, data)
  }
}
