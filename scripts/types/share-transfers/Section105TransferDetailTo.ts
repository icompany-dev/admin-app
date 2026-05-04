import { File } from "~/scripts/models/File"

export class Section105TransferDetailTo {
  name: string = ""
  address: string = ""
  shareholderType: string = ""
  individual: Section105TransferDetailToIndividual = new Section105TransferDetailToIndividual()
  respresentative: Section105TransferDetailToRepresentative = new Section105TransferDetailToRepresentative()
  signatoryName: string = ""
  signatoryUserId: string = ""
  signature: File | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof Section105TransferDetailTo) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.name = data.name
    this.address = data.address
    this.shareholderType = data.shareholder_type
    this.individual = new Section105TransferDetailToIndividual(data.individual)
    this.respresentative = new Section105TransferDetailToRepresentative(data.respresentative)
    this.signatoryName = data.signatory_name
    this.signatoryUserId = data.signatory_user_id
    this.signature = data.signature ? new File(data.signature) : null
  }

  clone(data: Section105TransferDetailTo): void {
    this.name = data.name
    this.address = data.address
    this.shareholderType = data.shareholderType
    this.individual = new Section105TransferDetailToIndividual(data.individual)
    this.respresentative = new Section105TransferDetailToRepresentative(data.respresentative)
    this.signatoryName = data.signatoryName
    this.signatoryUserId = data.signatoryUserId
    this.signature = data.signature ? new File(data.signature) : null
  }
}

export class Section105TransferDetailToIndividual {
  identificationType: string = ""
  identification: string = ""
  nationality: string = ""
  race: string = ""
  raceOthers: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof Section105TransferDetailToIndividual) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.identificationType = data.identification_type
    this.identification = data.identification
    this.nationality = data.nationality
    this.race = data.race
    this.raceOthers = data.race_others
  }

  clone(data: Section105TransferDetailToIndividual): void {
    this.identificationType = data.identificationType
    this.identification = data.identification
    this.nationality = data.nationality
    this.race = data.race
    this.raceOthers = data.raceOthers
  }
}

export class Section105TransferDetailToRepresentative {
  registrationNumberOld: string = ""
  registrationNumberNew: string = ""
  incorporatedAt: string = ""
  typeOfCorporateBody: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof Section105TransferDetailToRepresentative) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.registrationNumberOld = data.registration_number_old
    this.registrationNumberNew = data.registration_number_new
    this.incorporatedAt = data.incorporate_at
    this.typeOfCorporateBody = data.type_of_body_corporate
  }

  clone(data: Section105TransferDetailToRepresentative): void {
    this.registrationNumberOld = data.registrationNumberOld
    this.registrationNumberNew = data.registrationNumberNew
    this.incorporatedAt = data.incorporatedAt
    this.typeOfCorporateBody = data.typeOfCorporateBody
  }
}
