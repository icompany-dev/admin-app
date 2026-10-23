import { UserAccessRole } from "~/scripts/models/UserAccessRole"
import { BasePopupController } from "./BasePopupController"
import { AccessRole } from "~/scripts/models/AccessRole"
import { SelectOption } from "~/scripts/types/SelectOption"
import { PopupTitles, PopupTitlesBm } from "~/scripts/constants/Popups"
import type { PropsAssignRole } from "~/scripts/props/PropsAssignRole"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { Toast } from "~/scripts/library/Toast"
import { EmitMessages } from "~/scripts/constants/EmitMessages"

export class AssignRoleController extends BasePopupController {
  companyId: Ref<string> = ref<string>("")
  accessRoles: Ref<AccessRole[]> = ref<AccessRole[]>([])

  selectedAccessRole: Ref<string> = ref<string>("")
  name: Ref<string> = ref<string>("")
  email: Ref<string> = ref<string>("")
  phone: Ref<string> = ref<string>("")
  license: Ref<string> = ref<string>("")
  password: Ref<string> = ref<string>("iCompany2026!!")

  isAuditorTaxAgent: Ref<boolean> = ref<boolean>(false)
  isRequireEkyc: Ref<boolean> = ref<boolean>(false)
  isSendInvitation: Ref<boolean> = ref<boolean>(false)
  isNotifyDirectors: Ref<boolean> = ref<boolean>(false)

  isSubmitting: Ref<boolean> = ref<boolean>(false)

  constructor(props: PropsAssignRole, emitEvents: any) {
    super(emitEvents)

    this.isCompliance.value = false
    this.setDataFromProps(props)
  }

  setDataFromProps(props: PropsAssignRole): void {
    this.companyId.value = props.companyId
    this.accessRoles.value = props.accessRoles.map((ar: AccessRole) => {
      return new AccessRole(ar)
    })
  }

  async onProceedClicked(): Promise<void> {
    if (this.isSubmitting.value || !this.canProceed) {
      return
    }

    try {
      this.isSubmitting.value = true
      let repository = useUserInvitationStore()

      console.log(this.requestPayload)

      await repository.adminGrantAccess(this.requestPayload)

      let toastTitle = this.language.isMalay()
        ? `Akses diberikan kepada ${this.name.value}.`
        : `New Access is Granted to ${this.name.value}.`
      let toastMessage = ""
      if (this.isSendInvitation.value || this.isNotifyDirectors.value) {
        let emailTo: string[] = []
        if (this.isSendInvitation.value) {
          emailTo.push(this.name.value)
        }

        if (this.isNotifyDirectors.value) {
          emailTo.push(this.language.isMalay() ? "Pengarah" : "Directors")
        }

        let names = StringUtil.oxfordJoin("&", emailTo)
        toastMessage = this.language.isMalay() ? `Emel telah dihantar ke ${names}.` : `Email has been sent to ${names}.`
      }

      let toast = new Toast(toastTitle, toastMessage)
      toast.success()

      this.emitEvents(EmitMessages.PROCEED)
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

  get title(): string {
    return this.language.isMalay() ? PopupTitlesBm.ImportantNotice : PopupTitles.ImportantNotice
  }

  get heading(): string {
    return this.language.isMalay() ? `Tambah Peranan` : `Add Access Role`
  }

  get cta(): string {
    return this.language.isMalay() ? "Ingin teruskan?" : "Would you like to continue?"
  }

  get content(): string {
    if (this.language.isMalay()) {
      return `
        Lengkapkan semua butiran dibawah untuk beri akses.
      `
    }

    return `
      Complete the following details to grant access.
    `
  }

  get accessRoleOptions(): SelectOption[] {
    return this.accessRoles.value.map((ar: AccessRole) => {
      return new SelectOption(ar.id, ar.id, ar.name)
    })
  }

  get canProceed(): boolean {
    if (!this.isRequireEkyc.value && StringUtil.isNullOrEmpty(this.license.value)) {
      return false
    }

    return (
      !StringUtil.isNullOrEmpty(this.name.value) &&
      !StringUtil.isNullOrEmpty(this.email.value) &&
      !StringUtil.isNullOrEmpty(this.selectedAccessRole.value) &&
      !StringUtil.isNullOrEmpty(this.companyId.value)
    )
  }

  get requestPayload(): object {
    return {
      email: this.email.value,
      access_role_id: this.selectedAccessRole.value,
      company_id: this.companyId.value,
      password: this.password.value,
      name: this.name.value,
      phone: this.phone.value,
      is_require_ekyc: this.isRequireEkyc.value,
      license: this.license.value,
      send_out_invitation: this.isSendInvitation.value,
      notify_directors: this.isNotifyDirectors.value,
    }
  }

  //labels
  get nameLabel(): string {
    return this.language.isMalay() ? "Nama" : "Name"
  }

  get emailLabel(): string {
    return this.language.isMalay() ? "Alamat Emel" : "Email Address"
  }

  get phoneLabel(): string {
    return this.language.isMalay() ? "Tel. Bimbit" : "Contact Number"
  }

  get licenseLabel(): string {
    return this.language.isMalay() ? "No. Lesen / Pengenalan" : "License / Identification Number"
  }

  get passwordLabel(): string {
    return this.language.isMalay() ? "Kata Kunci" : "Password"
  }

  get roleLabel(): string {
    return this.language.isMalay() ? "Peranan" : "Role"
  }

  get isRequireEkycLabel(): string {
    return this.language.isMalay() ? "Memerlukan eKYC" : "Require eKYC"
  }

  get sendInvitationLabel(): string {
    return this.language.isMalay() ? "Hantar Notis melalui Emel & WhatsApp" : "Send Notice through Email & WhatsApp"
  }

  get notifyDirectorsLabel(): string {
    return this.language.isMalay()
      ? "Maklumkan kepada Pengarah melalui Emel & WhatsApp"
      : "Notify Directors through Email & WhatsApp"
  }
}
