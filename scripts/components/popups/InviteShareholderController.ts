import type { PropsInvitationPopup } from "~/scripts/props/PropsInvitationPopup"
import { PopupTitles, PopupTitlesBm } from "~/scripts/constants/Popups"
import { BasePopupController } from "./BasePopupController"
import { EmitMessages } from "~/scripts/constants/EmitMessages"
import { ShareholderInvitation } from "~/scripts/models/ShareholderInvitation"
import { Error } from "~/scripts/library/Error"
import { InvitationTarget } from "~/scripts/models/Invitation"
import { Toast } from "~/scripts/library/Toast"
import { StringUtil } from "~/scripts/utils/String"
import { SelectOption } from "~/scripts/types/SelectOption"
import { ShareholdingType } from "~/scripts/constants/Shareholder"

export class InviteShareholderController extends BasePopupController {
  targetType: Ref<string> = ref<string>("")
  targetId: Ref<string> = ref<string>("")

  shareholderInvitation: Ref<ShareholderInvitation> = ref<ShareholderInvitation>(new ShareholderInvitation())

  isSubmitting: Ref<boolean> = ref<boolean>(false)

  constructor(props: PropsInvitationPopup, emitEvents: any) {
    super(emitEvents)

    this.setDataFromProps(props)
  }

  setDataFromProps(props: PropsInvitationPopup): void {
    this.targetType.value = props.targetType
    this.targetId.value = props.targetId

    this.shareholderInvitation.value = new ShareholderInvitation()
    this.shareholderInvitation.value.target = new InvitationTarget()
    this.shareholderInvitation.value.target.target = this.targetType.value
    this.shareholderInvitation.value.target.id = this.targetId.value
  }

  override show(): void {
    if (!this.popupRef) {
      return
    }

    this.shareholderInvitation.value = new ShareholderInvitation()
    this.shareholderInvitation.value.target = new InvitationTarget()
    this.shareholderInvitation.value.target.target = this.targetType.value
    this.shareholderInvitation.value.target.id = this.targetId.value

    this.popupRef.show()
  }

  onProceedClicked(): void {
    // this is just a placeholder
  }

  async onAddShareholderClicked(): Promise<void> {
    if (this.isSubmitting.value) {
      return
    }

    try {
      this.isSubmitting.value = true

      let repository = useShareholderInvitationStore()
      await this.shareholderInvitation.value.create(repository)

      this.emitEvents(EmitMessages.SUCCESS, this.shareholderInvitation.value)

      let toastTitle = this.language.isMalay()
        ? "Pengarah Baharu telah berjaya ditambah ke permohonan ini."
        : "New Shareholder successfully added to this application."
      let toastMessage = this.language.isMalay()
        ? "Mereka akan terima akses ke Sdn Bhd selepas permohonan ini selesai."
        : "They will be granted access to the Sdn Bhd after this application is completed."
      let toast = new Toast(toastTitle, toastMessage)
      toast.success()

      this.hide()
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.setForCUD()
        error.handle()
      }
    } finally {
      this.isSubmitting.value = false
    }
  }

  get canProceed(): boolean {
    return (
      this.shareholderInvitation.value.canSubmit() && !StringUtil.isNullOrEmpty(this.shareholderInvitation.value.name)
    )
  }

  get title(): string {
    return this.language.isMalay() ? PopupTitlesBm.ImportantNotice : PopupTitles.ImportantNotice
  }

  get heading(): string {
    return this.language.isMalay() ? `Tambah Pengarah` : `Add Shareholder`
  }

  get cta(): string {
    return this.language.isMalay() ? "Ingin teruskan?" : "Would you like to continue?"
  }

  get content(): string {
    if (this.language.isMalay()) {
      return `
        Lengkapkan butiran yang diperlukar untuk tambah Pengarah.
      `
    }

    return `
      Complete the required details below to add new Shareholder.
    `
  }

  get nameLabel(): string {
    if (this.shareholderInvitation.value.type === ShareholdingType.Representative) {
      return this.language.isMalay() ? "Nama Wakil" : "Representative Name"
    }

    return this.language.isMalay() ? "Nama" : "Name"
  }

  get emailAddressLabel(): string {
    return this.language.isMalay() ? "Alamat Emel" : "Email Address"
  }

  get typeLabel(): string {
    return this.language.isMalay() ? "Jenis" : "Type"
  }

  get typeOptions(): SelectOption[] {
    return [
      new SelectOption(ShareholdingType.Individual, ShareholdingType.Individual, "Individual"),
      new SelectOption(ShareholdingType.Representative, ShareholdingType.Representative, "Corporate"),
    ]
  }

  get isTypeRepresentative(): boolean {
    return this.shareholderInvitation.value.type === ShareholdingType.Representative
  }

  get companyNameLabel(): string {
    return this.language.isMalay() ? "Nama" : "Name"
  }

  get companyNameTypeOptions(): SelectOption[] {
    return [new SelectOption("sdnbhd", "sdnbhd", "SDN BHD"), new SelectOption("others", "others", "-")]
  }
}
