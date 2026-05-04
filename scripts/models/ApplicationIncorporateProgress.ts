import type { IModel } from "./IModel"

export class ApplicationIncorporateProgress implements IModel<ApplicationIncorporateProgress> {
  id: string = ""
  status: string = ""
  nameCompleted: boolean = false
  registersCompleted: boolean = false
  descriptionCompleted: boolean = false
  addressCompleted: boolean = false

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof ApplicationIncorporateProgress) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.status = data.status
    this.nameCompleted = data.name_completed
    this.registersCompleted = data.registers_completed
    this.descriptionCompleted = data.description_completed
    this.addressCompleted = data.address_completed
  }

  clone(data: ApplicationIncorporateProgress): void {
    this.id = data.id
    this.status = data.status
    this.nameCompleted = data.nameCompleted
    this.registersCompleted = data.registersCompleted
    this.descriptionCompleted = data.descriptionCompleted
    this.addressCompleted = data.addressCompleted
  }

  getRequestBody(): object {
    return {}
  }
}
