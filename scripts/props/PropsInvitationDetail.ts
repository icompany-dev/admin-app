import { Invitation } from "~/scripts/models/Invitation"

export interface IPropsInvitationDetail {
  id: string
  invitation: Invitation
}

export class PropsInvitationDetail {
  id: string
  invitation: Invitation

  constructor(id: string, invitation: Invitation) {
    this.id = id
    this.invitation = invitation
  }
}
