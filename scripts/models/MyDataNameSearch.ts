import type { IModel } from "./IModel"

export class MyDataNameSearch implements IModel<MyDataNameSearch> {
  id: string = ""
  available: boolean = false
  errorMsg: string = ""
  successCode: string = ""
  type: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof MyDataNameSearch) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.available = data.available
    this.errorMsg = data.errorMsg
    this.successCode = data.successCode
    this.type = data.type
  }

  clone(data: MyDataNameSearch): void {
    this.available = data.available
    this.errorMsg = data.errorMsg
    this.successCode = data.successCode
    this.type = data.type
  }

  getRequestBody(): object {
    return {}
  }
}