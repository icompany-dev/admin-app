export class IdentificationType {
  id: string = ""
  value: string = ""

  constructor(id: string, value: string) {
    this.id = id
    this.value = value
  }
}

export class IdentificationTypes {
  static IC: IdentificationType = new IdentificationType("ic", "NRIC")
  static PASSPORT: IdentificationType = new IdentificationType("passport", "Passport")

  static OPTIONS: Array<IdentificationType> = [this.IC, this.PASSPORT]
}
