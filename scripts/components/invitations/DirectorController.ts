import { DirectorInvitation } from "~/scripts/models/DirectorInvitation"
import { InvitationController } from "./InvitationController"
import type { PropsInvitationDetail } from "~/scripts/props/PropsInvitationDetail"
import { StringUtil } from "~/scripts/utils/String"

export class DirectorController extends InvitationController {
  invitation: Ref<DirectorInvitation> = ref<DirectorInvitation>(new DirectorInvitation())

  constructor(props: PropsInvitationDetail, emitEvents: any) {
    super(props, useDirectorInvitationStore(), emitEvents)
  }

  async onDeclarationClicked(): Promise<void> {
    if (!this.hasAcceptedInvitation) {
      return
    }
  }

  // getters
  get hasNotResponded(): boolean {
    return this.invitation.value.responseDate === null || this.invitation.value.response === "pending"
  }

  get hasAcceptedInvitation(): boolean {
    return this.invitation.value.responseDate !== null && this.invitation.value.response === "accepted"
  }

  get hasRejectedInvitation(): boolean {
    return this.invitation.value.responseDate !== null && this.invitation.value.response === "rejected"
  }

  get response(): string {
    return StringUtil.capitalize(this.invitation.value.response ?? "")
  }

  get declarationLabel(): string {
    if (this.hasNotResponded) {
      return this.language.isMalay() ? "Menunggu Maklum Balas" : "Awaiting Response"
    }

    if (this.hasRejectedInvitation) {
      return this.language.isMalay() ? "Perlantikan Ditolak" : "Rejected Appointment"
    }

    return this.language.isMalay() ? "Pengisytiharan bawah Seksyen 201" : "Declaration under Section 201"
  }
}
