import type { PartialObject } from "lodash"
import { File } from "../models/File"

export class NameReservation {
  id: string = ""
  name: string | null = null
  type: string = "sdnbhd"
  description: string | null = null
  supportingDocumentId: string | null = null
  supportingDocument: File | null = null
  isAcceptable: boolean = true
  isSupportingDocumentRequired: boolean = false
  issueMessage: string | null = null

  constructor(
    id: string,
    name: string,
    type: string | null = null,
    description: string | null = null,
    supportingDocumentId: string | null = null,
    supportingDocument: File | null = null,
    isAcceptable: boolean | null = null,
    isSupportingDocumentRequired: boolean | null = null,
    issueMessage: string | null = null
  ) {
    this.id = id
    this.name = name
    this.type = type ?? "sdnbhd"
    this.description = description
    this.supportingDocumentId = supportingDocumentId
    this.supportingDocument = supportingDocument ? new File(supportingDocument) : null
    this.isAcceptable = isAcceptable ?? true
    this.isSupportingDocumentRequired = isSupportingDocumentRequired ?? false
    this.issueMessage = issueMessage
  }

  clone(data: PartialObject<NameReservation>): void {
    this.id = data.id ?? ""
    this.name = data.name ?? ""
    this.type = data.type ?? "sdnbhd"
    this.description = data.description ?? null
    this.supportingDocumentId = data.supportingDocumentId ?? null
    this.supportingDocument = data.supportingDocument ? new File(data.supportingDocument) : null
    this.isAcceptable = data.isAcceptable ?? true
    this.isSupportingDocumentRequired = data.isSupportingDocumentRequired ?? false
    this.issueMessage = data.issueMessage ?? null
  }

  isEqual(data: NameReservation): boolean {
    return (
      this.id === data.id &&
      this.name === data.name &&
      this.type === data.type &&
      this.description === data.description &&
      this.supportingDocumentId === data.supportingDocumentId &&
      this.supportingDocument?.id === data.supportingDocument?.id &&
      this.isAcceptable === data.isAcceptable &&
      this.isSupportingDocumentRequired === data.isSupportingDocumentRequired &&
      this.issueMessage === data.issueMessage
    )
  }
}
