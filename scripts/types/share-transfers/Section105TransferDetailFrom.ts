import { File } from "~/scripts/models/File"

export class Section105TransferDetailFrom {
  name: string = ""
  identificationType: string = ""
  identification: string = ""
  identificationAlt: string = ""
  signatoryName: string = ""
  signatoryUserId: string = ""
  signature: File | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof Section105TransferDetailFrom) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.name = data.name
    this.identificationType = data.identification_type
    this.identification = data.identification
    this.identificationAlt = data.identification_alt
    this.signatoryName = data.signatory_name
    this.signatoryUserId = data.signatory_user_id
    this.signature = data.signature ? new File(data.signature) : null
  }

  clone(data: Section105TransferDetailFrom): void {
    this.name = data.name
    this.identificationType = data.identificationType
    this.identification = data.identification
    this.identificationAlt = data.identificationAlt
    this.signatoryName = data.signatoryName
    this.signatoryUserId = data.signatoryUserId
    this.signature = data.signature ? new File(data.signature) : null
  }
}
