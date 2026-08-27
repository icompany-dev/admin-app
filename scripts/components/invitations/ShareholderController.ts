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

  get totalSharesLabel(): string {
    return this.language.isMalay() ? "Jumlah Saham" : "Total Shares"
  }

  get removeItemName(): string {
    return this.language.isMalay() ? "Pemegang Saham" : "Shareholder"
  }
}
