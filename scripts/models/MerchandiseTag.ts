import type { IModel } from "./IModel"

export class MerchandiseTag implements IModel<MerchandiseTag> {
  id: string = ""
  name: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof MerchandiseTag) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.name = data.name
  }

  clone(data: MerchandiseTag): void {
    this.id = data.id
    this.name = data.name
  }

  getRequestBody(): object {
    return {}
  }
}
