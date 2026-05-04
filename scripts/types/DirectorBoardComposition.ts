import type { PartialObject } from "lodash"
import type { User } from "../models/User"

export class DirectorBoardComposition {
  id: string | null = null //director id, can be null if pending appointment
  name: string = ""
  hasProfileImage: boolean = false
  imageUrl: string = ""
  appointmentDate: string = ""

  isAppointmentInProgress: boolean = false
  appointmentId: string | null = null

  isResignationInProgress: boolean = false
  resignationId: string | null = null

  applicationStatus: string | null = null

  user: User | null = null

  constructor(data: PartialObject<DirectorBoardComposition> = {}) {
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
