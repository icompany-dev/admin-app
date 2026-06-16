import { Bank } from "~/scripts/models/Bank"

export class BankPartner {
  id: string = ""
  bankId: string = ""
  // bank: Bank = new Bank()
  description: string = ""
  imageUrl: string = ""
  logoUrl: string = ""
  url: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof BankPartner) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.bankId = data.bank_id
    // this.bank = new Bank(data.bank)
    this.description = data.description
    this.imageUrl = data.image_url
    this.logoUrl = data.logo_url
    this.url = data.url
  }

  clone(data: BankPartner): void {
    this.id = data.id
    this.bankId = data.bankId
    // this.bank = new Bank(data.bank)
    this.description = data.description
    this.imageUrl = data.imageUrl
    this.logoUrl = data.logoUrl
    this.url = data.url
  }
}
