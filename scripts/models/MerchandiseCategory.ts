import type { IModel } from "./IModel"

export class MerchandiseCategory implements IModel<MerchandiseCategory> {
  id: string = ""
  name: string = ""
  description: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof MerchandiseCategory) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.name = data.name
    this.description = data.description
  }

  clone(data: MerchandiseCategory): void {
    this.id = data.id
    this.name = data.name
    this.description = data.description
  }

  getRequestBody(): object {
    return {}
  }
}
