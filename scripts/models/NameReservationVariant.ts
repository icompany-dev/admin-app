import { CompanyConstants } from "../constants/Company"
import { StringUtil } from "../utils/String"
import { File } from "./File"

export class NameReservationVariant {
  name: string = ""
  nameType: string = "sdnbhd"
  nameDescription: string | null = null
  supportingDocument: File | null = null
  supportingDocumentId: string | null = null

  constructor(name: string, nameType: string, nameDescription: string | null, supportingDocument: any | null) {
    this.name = name
    this.nameType = nameType
    this.nameDescription = nameDescription
    this.supportingDocument = supportingDocument ? new File(supportingDocument) : null
    this.supportingDocumentId = supportingDocument ? supportingDocument.id : null
  }

  clone(data: NameReservationVariant | null): void {
    if (!data) {
      return
    }

    this.name = data.name
    this.nameType = data.nameType
    this.nameDescription = data.nameDescription
    this.supportingDocument = data.supportingDocument ? new File(data.supportingDocument) : null
    this.supportingDocumentId = data.supportingDocumentId
  }

  getType(): string {
    switch (this.nameType) {
      case "sdnbhd":
        return CompanyConstants.TYPE_SDNBHD
      case "berhad":
        return CompanyConstants.TYPE_BERHAD
      case "others":
        return ""
      default:
        return CompanyConstants.TYPE_SDNBHD
    }
  }

  getCompleteName() {
    if (StringUtil.isNullOrEmpty(this.name)) {
      return ""
    }

    return `${this.name} ${this.getType()}`
  }
}
