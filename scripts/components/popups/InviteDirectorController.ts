import type { PropsInvitationPopup } from "~/scripts/props/PropsInvitationPopup"
import { PopupTitles, PopupTitlesBm } from "~/scripts/constants/Popups"
import { BasePopupController } from "./BasePopupController"
import { EmitMessages } from "~/scripts/constants/EmitMessages"
import { DirectorInvitation } from "~/scripts/models/DirectorInvitation"
import { Error } from "~/scripts/library/Error"
import { InvitationTarget } from "~/scripts/models/Invitation"
import { Toast } from "~/scripts/library/Toast"
import { StringUtil } from "~/scripts/utils/String"

export class InviteDirectorController extends BasePopupController {
  targetType: Ref<string> = ref<string>("")
  targetId: Ref<string> = ref<string>("")

  directorInvitation: Ref<DirectorInvitation> = ref<DirectorInvitation>(new DirectorInvitation())

  isSubmitting: Ref<boolean> = ref<boolean>(false)

  constructor(props: PropsInvitationPopup, emitEvents: any) {
    super(emitEvents)

    this.setDataFromProps(props)
  }

  setDataFromProps(props: PropsInvitationPopup): void {
    this.targetType.value = props.targetType
    this.targetId.value = props.targetId

    this.directorInvitation.value = new DirectorInvitation()
    this.directorInvitation.value.target = new InvitationTarget()
    this.directorInvitation.value.target.target = this.targetType.value
    this.directorInvitation.value.target.id = this.targetId.value
  }

  override show(): void {
    if (!this.popupRef) {
      return
    }

    this.directorInvitation.value = new DirectorInvitation()
    this.directorInvitation.value.target = new InvitationTarget()
    this.directorInvitation.value.target.target = this.targetType.value
    this.directorInvitation.value.target.id = this.targetId.value

    this.popupRef.show()
  }

  onProceedClicked(): void {
    // this is just a placeholder
  }

  async onAddDirectorClicked(): Promise<void> {
    if (this.isSubmitting.value) {
      return
    }

    try {
      this.isSubmitting.value = true

      let repository = useDirectorInvitationStore()
      await this.directorInvitation.value.create(repository)

      this.emitEvents(EmitMessages.SUCCESS, this.directorInvitation.value)

      let toastTitle = this.language.isMalay()
        ? "Pengarah Baharu telah berjaya ditambah ke permohonan ini."
        : "New Director successfully added to this application."
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
    return this.directorInvitation.value.canSubmit() && !StringUtil.isNullOrEmpty(this.directorInvitation.value.name)
  }

  get title(): string {
    return this.language.isMalay() ? PopupTitlesBm.ImportantNotice : PopupTitles.ImportantNotice
  }

  get heading(): string {
    return this.language.isMalay() ? `Tambah Pengarah` : `Add Director`
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
      Complete the required details below to add new Director.
    `
  }

  get nameLabel(): string {
    return this.language.isMalay() ? "Nama" : "Name"
  }

  get emailAddressLabel(): string {
    return this.language.isMalay() ? "Alamat Emel" : "Email Address"
  }
}
