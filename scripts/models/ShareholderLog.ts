import { ServiceLog } from "./ServiceLog"

export class ShareholderLog extends ServiceLog {
  shareholderId: string = ""

  constructor(data: any | null = null) {
    super()

    if (data instanceof ShareholderLog) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.shareholderId = data.shareholder_id
  }

  cloneDetails(data: ShareholderLog): void {
    super.clone(data)
    this.shareholderId = data.shareholderId
  }
}
