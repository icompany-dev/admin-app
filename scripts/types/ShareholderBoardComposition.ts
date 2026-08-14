import type { PartialObject } from "lodash"
import type { User } from "../models/User"
import { ShareholdingType } from "../constants/Shareholder"

export class ShareholderBoardComposition {
  id: string | null = null
  type: string = ShareholdingType.Individual
  name: string = ""
  nameType: String = ""
  hasProfileImage: boolean = false
  imageUrl: string = ""
  createdAt: string = ""

  isAllotmentInProgress: boolean = false
  allotmentId: string | null = null

  isTransferInProgress: boolean = false
  transferId: string | null = null

  applicationStatus: string | null = null

  user: User | null = null

  constructor(data: PartialObject<ShareholderBoardComposition> = {}) {
    Object.assign(this, data)
  }

  registeredEmail(): string {
    if (!this.user) {
      return "Pending Registration"
    }

    return this.user.email
  }

  mobileNumber(): string {
    return !this.user ? "Pending Registration" : this.user.phone
  }

  addressLine1(): string {
    if (!this.user) {
      return "Pending Registration"
    }

    let detail = this.user.detail
    if (!detail) {
      return "Pending eKYC"
    }

    let address = detail.location

    return address?.addressLine1 ?? "-"
  }

  addressLine2(): string {
    if (!this.user) {
      return "Pending Registration"
    }

    let detail = this.user.detail
    if (!detail) {
      return "Pending eKYC"
    }

    let address = detail.location

    return address?.addressLine2 ?? "-"
  }

  postcode(): string {
    if (!this.user) {
      return "Pending Registration"
    }

    let detail = this.user.detail
    if (!detail) {
      return "Pending eKYC"
    }

    let address = detail.location

    return address?.postcode ?? "-"
  }

  city(): string {
    if (!this.user) {
      return "Pending Registration"
    }

    let detail = this.user.detail
    if (!detail) {
      return "Pending eKYC"
    }

    let address = detail.location

    return address?.city?.name ?? "-"
  }

  state(): string {
    if (!this.user) {
      return "Pending Registration"
    }

    let detail = this.user.detail
    if (!detail) {
      return "Pending eKYC"
    }

    let address = detail.location

    return address?.state?.name ?? "-"
  }

  country(): string {
    if (!this.user) {
      return "Pending Registration"
    }

    let detail = this.user.detail
    if (!detail) {
      return "Pending eKYC"
    }

    let address = detail.location

    return address?.country?.name ?? "-"
  }
}
