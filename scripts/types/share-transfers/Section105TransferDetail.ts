import { Section105TransferDetailFrom } from "~/scripts/types/share-transfers/Section105TransferDetailFrom"
import { Section105TransferDetailSignature } from "./Section105TransferDetailSignature"
import { Section105TransferDetailTo } from "./Section105TransferDetailTo"

export class Section105TransferDetail {
  fromShareholder: Section105TransferDetailFrom = new Section105TransferDetailFrom()
  fromRepSignature: Section105TransferDetailSignature = new Section105TransferDetailSignature()
  toShareholder: Section105TransferDetailTo = new Section105TransferDetailTo()
  toRepSignature: Section105TransferDetailSignature = new Section105TransferDetailSignature()

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof Section105TransferDetail) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.fromShareholder = new Section105TransferDetailFrom(data.from_shareholder)
    this.fromRepSignature = new Section105TransferDetailSignature(data.from_rep_signature)
    this.toShareholder = new Section105TransferDetailTo(data.to_shareholder)
    this.toRepSignature = new Section105TransferDetailSignature(data.to_rep_signature)
  }

  clone(data: Section105TransferDetail): void {
    this.fromShareholder = new Section105TransferDetailFrom(data.fromShareholder)
    this.fromRepSignature = new Section105TransferDetailSignature(data.fromRepSignature)
    this.toShareholder = new Section105TransferDetailTo(data.toShareholder)
    this.toRepSignature = new Section105TransferDetailSignature(data.toRepSignature)
  }
}
