import { StringUtil } from "../utils/String"

export class CompanyManagementAccountData {
  id: string = crypto.randomUUID()
  name: string = ""
  note: string = ""
  amount: string = "0.00"

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    this.name = data.name
    this.note = data.note
    this.amount = Number(data.amount ?? 0).toFixed(2)
  }

  getRequestBody(): object {
    return {
      name: this.name,
      note: this.note,
      amount: Number(this.amount),
    }
  }

  clone(data: CompanyManagementAccountData): void {
    this.id = data.id
    this.name = data.name
    this.note = data.note
    this.amount = data.amount
  }

  isNameValid(checkValidity: boolean): boolean {
    if (!checkValidity) {
      return true
    }

    return !StringUtil.isNullOrEmpty(this.name)
  }

  isAmountValid(checkValidity: boolean): boolean {
    if (!checkValidity) {
      return true
    }

    return !StringUtil.isNullOrEmpty(this.amount)
  }

  isDataValid(checkValidity: boolean): boolean {
    if (!checkValidity) {
      return true
    }

    return this.isNameValid(checkValidity) && this.isAmountValid(checkValidity)
  }

  isTheSame(record: CompanyManagementAccountData): boolean {
    return this.name === record.name && this.note === record.note && this.amount === record.amount
  }
}
