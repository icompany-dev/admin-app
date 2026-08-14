import { DirectorInvitation } from "../models/DirectorInvitation"
import { StringUtil } from "../utils/String"

export class DirectorInvitationInputField {
  invitation: DirectorInvitation = new DirectorInvitation()

  constructor(directorInvitation: DirectorInvitation) {
    this.invitation = new DirectorInvitation(directorInvitation)
  }

  isEmailValid(): boolean {
    return !StringUtil.isNullOrEmpty(this.invitation.email) && StringUtil.isEmailAddress(this.invitation.email)
  }

  isPhoneValid(): boolean {
    return !StringUtil.isNullOrEmpty(this.invitation.phone)
  }

  errorMessage(): string {
    let errorMessages = []
    if (!this.isEmailValid()) {
      errorMessages.push("Email cannot be empty and must be a valid email address.")
    }

    if (!this.isPhoneValid()) {
      errorMessages.push("Mobile phone number cannot be empty.")
    }

    return errorMessages.join("<br>")
  }
}
