import { Company } from "~/scripts/models/Company"
import { Section105TransferDetail } from "./Section105TransferDetail"

export class Section105Data {
  id: string = ""
  sharesAllotted: number = 1
  pricePerShare: number = 1
  consideredAmount: number = 1
  shareType: string = ""
  company: Company = new Company()
  transferDetails: Section105TransferDetail[] = []

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof Section105Data) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.sharesAllotted = data.shares_allotted
    this.pricePerShare = data.price_per_share
    this.consideredAmount = data.considered_amount
    this.shareType = data.share_type
    this.company = new Company(data.company)
    this.transferDetails =
      data.transfer_details && Array.isArray(data.transfer_details)
        ? data.transfer_details.map((d: any) => {
            return new Section105TransferDetail(d)
          })
        : []
  }

  clone(data: Section105Data): void {
    this.id = data.id
    this.sharesAllotted = data.sharesAllotted
    this.pricePerShare = data.pricePerShare
    this.consideredAmount = data.consideredAmount
    this.shareType = data.shareType
    this.company = new Company(data.company)
    this.transferDetails = data.transferDetails.map((d: any) => {
      return new Section105TransferDetail(d)
    })
  }
}
