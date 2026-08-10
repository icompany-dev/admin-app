import { DirectorInvitation } from "~/scripts/models/DirectorInvitation"
import { InvitationController } from "./InvitationController"
import type { PropsInvitationDetail } from "~/scripts/props/PropsInvitationDetail"
import { StringUtil } from "~/scripts/utils/String"

export class DirectorController extends InvitationController {
  invitation: Ref<DirectorInvitation> = ref<DirectorInvitation>(new DirectorInvitation())

  constructor(props: PropsInvitationDetail, emitEvents: any) {
    super(props, useDirectorInvitationStore(), emitEvents)
  }

  // getters
  get hasAcceptedInvitation(): boolean {
    return this.invitation.value.responseDate !== null && this.invitation.value.response === "accepted"
  }

  get response(): string {
    return StringUtil.capitalize(this.invitation.value.response ?? "")
  }
}
