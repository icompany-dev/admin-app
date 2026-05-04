import { File } from "~/scripts/models/File"

export class Section105TransferDetailSignature {
  name: string = ""
  identification: string = ""
  signature: File | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    this.setData(data)
  }

  setData(data: any): void {
    this.name = data.name
    this.identification = data.identification
    this.signature = data.signature ? new File(data.signature) : null
  }
}
