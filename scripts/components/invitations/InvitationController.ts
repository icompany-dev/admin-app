import { EmitMessages } from "~/scripts/constants/EmitMessages"
import { EmailUser } from "~/scripts/library/EmailUser"
import { Error } from "~/scripts/library/Error"
import { Toast } from "~/scripts/library/Toast"
import type { IRepositoryStore } from "~/scripts/models/IRepositoryStore"
import { Invitation } from "~/scripts/models/Invitation"
import type { PropsInvitationDetail } from "~/scripts/props/PropsInvitationDetail"
import { StringUtil } from "~/scripts/utils/String"

export abstract class InvitationController {
  id: Ref<string> = ref<string>("")
  abstract invitation: Ref<Invitation>

  emitEvents: any | null = null

  isLoading: Ref<boolean> = ref<boolean>(false)

  isInEditMode: Ref<boolean> = ref<boolean>(false)
  isUpdating: Ref<boolean> = ref<boolean>(false)
  isRemoving: Ref<boolean> = ref<boolean>(false)

  removeConfirmationRef: any | null = null

  repository: IRepositoryStore

  language = useLanguage()

  constructor(props: PropsInvitationDetail, repository: IRepositoryStore, emitEvents: any) {
    this.emitEvents = emitEvents
    this.repository = repository

    this.setDataFromProps(props)
  }

  abstract setDataFromProps(props: PropsInvitationDetail): Promise<void>

  setRemoveConfirmationRef(removeConfirmationRef: any): void {
    this.removeConfirmationRef = removeConfirmationRef
  }

  onUpdateClicked(): void {
    this.isInEditMode.value = true
  }

  onCancelUpdateClicked(): void {
    this.isInEditMode.value = false
  }

  async onProceedUpdateClicked(): Promise<void> {
    if (this.isUpdating.value) {
      return
    }

    try {
      this.isUpdating.value = true
      await this.invitation.value.update(this.repository)

      let toastTitle = this.language.isMalay() ? "Rekod telah dikemaskini" : "Your changes have been recorded."
      let toast = new Toast(toastTitle, "")
      toast.success()

      this.isInEditMode.value = false
    } catch (e) {
      if (e instanceof Error) {
        e.isMalay = this.language.isMalay()
        e.handle()
      } else {
        let error = new Error()
        error.isMalay = this.language.isMalay()
        error.setForCUD()
        error.handle()
      }
    } finally {
      this.isUpdating.value = false
    }
  }

  async onRemoveClicked(): Promise<void> {
    if (this.removeConfirmationRef) {
      this.removeConfirmationRef.show()
      return
    }
  }

  async onProceedRemove(): Promise<void> {
    console.log("called???")
    if (this.isRemoving.value) {
      return
    }

    try {
      this.isRemoving.value = true
      await this.invitation.value.remove(this.repository)

      let toastTitle = this.language.isMalay() ? "Rekod telah dipadamkan" : "This record has been removed."
      let toast = new Toast(toastTitle, "")
      toast.success()

      this.emitEvents(EmitMessages.REMOVED)
    } catch (e) {
      if (e instanceof Error) {
        e.isMalay = this.language.isMalay()
        e.handle()
      } else {
        let error = new Error()
        error.isMalay = this.language.isMalay()
        error.setForCUD()
        error.handle()
      }
    } finally {
      this.isRemoving.value = false
    }
  }

  onDoubleClicked(event: Event): void {
    try {
      let target = event.target as HTMLElement
      let stringToCopy = target.innerHTML
      navigator.clipboard.writeText(stringToCopy)

      let toastTitle = this.language.isMalay() ? `${stringToCopy} telah disalin!` : `"${stringToCopy}" has been copied!`
      let toastMessage = this.language.isMalay()
        ? `Hanya tampalkan dimana anda perlu.`
        : `Just paste it anywhere you need to.`
      let toast = new Toast(toastTitle, toastMessage)
      toast.success()
    } catch (e) {
      //
    }
  }

  onEmailClicked(): void {
    let emailUser = new EmailUser(this.email)
    emailUser.connectToGmail()
  }

  //getters
  get name(): string {
    if (!this.invitation.value.user) {
      return this.language.isMalay() ? "Pengguna Tidak Berdaftar" : "Unregistered User"
    }

    return this.invitation.value.user.name
  }

  get isRegisteredUser(): boolean {
    return (
      !StringUtil.isNullOrEmpty(this.invitation.value.userId) &&
      this.invitation.value.user.detail !== null &&
      !StringUtil.isNullOrEmpty(this.invitation.value.user.detail.identification)
    )
  }

  get email(): string {
    if (!this.invitation.value.user) {
      return this.invitation.value.email
    }

    return this.invitation.value.user.email
  }

  get phone(): string {
    if (!this.invitation.value.user) {
      return "-"
    }

    return this.invitation.value.user.phone
  }

  get identificationType(): string {
    let type = "MyKad"
    if (this.invitation.value.user) {
      let detail = this.invitation.value.user.detail
      if (detail) {
        type = detail.identificationType === "passport" ? "Passport" : "MyKad"
      }
    }

    return this.language.isMalay() ? `No. ${type}` : `${type} No.`
  }

  get identificationNumber(): string {
    if (!this.invitation.value.user) {
      return "-"
    }

    let detail = this.invitation.value.user.detail
    if (!detail) {
      return "-"
    }

    return detail.identification
  }

  get removeLabel(): string {
    return this.language.isMalay() ? "Padam" : "Remove"
  }
}
