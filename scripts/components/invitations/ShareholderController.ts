import { InvitationController } from "./InvitationController"
import type { PropsInvitationDetail } from "~/scripts/props/PropsInvitationDetail"
import { StringUtil } from "~/scripts/utils/String"
import { EmitMessages } from "~/scripts/constants/EmitMessages"
import { ShareholderInvitation } from "~/scripts/models/ShareholderInvitation"

export class ShareholderController extends InvitationController {
  invitation: Ref<ShareholderInvitation> = ref<ShareholderInvitation>(new ShareholderInvitation())

  constructor(props: PropsInvitationDetail, emitEvents: any) {
    super(props, useShareholderInvitationStore(), emitEvents)
  }

  async setDataFromProps(props: PropsInvitationDetail): Promise<void> {
    this.id.value = props.id
    this.invitation.value = props.invitation as ShareholderInvitation

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

  get totalSharesLabel(): string {
    return this.language.isMalay() ? "Jumlah Saham" : "Total Shares"
  }

  get removeItemName(): string {
    return this.language.isMalay() ? "Pemegang Saham" : "Shareholder"
  }
}
