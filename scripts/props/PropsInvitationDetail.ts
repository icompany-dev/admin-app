import { Invitation } from "~/scripts/models/Invitation"

export interface IPropsInvitationDetail {
  id: string
  invitation: Invitation
  hasSection201: boolean
}

export class PropsInvitationDetail {
  id: string
  invitation: Invitation
  hasSection201: boolean = true

  constructor(id: string, invitation: Invitation) {
    this.id = id
    this.invitation = invitation
  }
}
