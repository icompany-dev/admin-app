import { DirectorInvitation } from "~/scripts/models/DirectorInvitation"
import { InvitationController } from "./InvitationController"
import type { PropsInvitationDetail } from "~/scripts/props/PropsInvitationDetail"
import { StringUtil } from "~/scripts/utils/String"
import { EmitMessages } from "~/scripts/constants/EmitMessages"

export class DirectorController extends InvitationController {
  invitation: Ref<DirectorInvitation> = ref<DirectorInvitation>(new DirectorInvitation())

  constructor(props: PropsInvitationDetail, emitEvents: any) {
    super(props, useDirectorInvitationStore(), emitEvents)
  }

  async onDeclarationClicked(): Promise<void> {
    if (!this.hasAcceptedInvitation) {
      return
    }

    this.emitEvents(EmitMessages.SHOW_DOCUMENT)
  }

  async setDataFromProps(props: PropsInvitationDetail): Promise<void> {
    this.id.value = props.id
    this.invitation.value = props.invitation as DirectorInvitation

    if (!StringUtil.isNullOrEmpty(this.invitation.value.userId)) {
      this.isLoading.value = true
      try {
        await this.invitation.value.setUser(useUserStore())
      } catch (e) {
        //
      } finally {
        this.isLoading.value = false
      }
    }
  }

  // getters
  get hasNotResponded(): boolean {
    return this.invitation.value.responseType === null
  }

  get hasAcceptedInvitation(): boolean {
    return (
      this.invitation.value.responseType !== null &&
      this.invitation.value.responseType === "complete-24-hours" &&
      this.invitation.value.signatureId !== null
    )
  }

  get hasRejectedInvitation(): boolean {
    return this.invitation.value.responseType !== null && this.invitation.value.responseType === "reject"
  }

  get hasRequestedAppointmentLetter(): boolean {
    return this.invitation.value.responseType !== null && this.invitation.value.responseType === "request-letter"
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

    if (this.hasRequestedAppointmentLetter) {
      return this.language.isMalay() ? "Minta Surat Perlantikan" : "Requested Appointment Letter"
    }

    return this.language.isMalay() ? "Pengisytiharan bawah Seksyen 201" : "Declaration under Section 201"
  }

  get removeItemName(): string {
    return this.language.isMalay() ? "Pengarah" : "Director"
  }
}
