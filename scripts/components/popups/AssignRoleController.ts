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
import { Company } from "~/scripts/models/Company"
import { Director } from "~/scripts/models/Director"
import { AdminEmail } from "~/scripts/models/AdminEmail"

export class AssignRoleController extends BasePopupController {
  companyId: Ref<string> = ref<string>("")
  company: Ref<Company> = ref<Company>(new Company())
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

  directors: Ref<Director[]> = ref<Director[]>([])
  numberOfDirectors: Ref<number> = ref<number>(1)

  constructor(props: PropsAssignRole, emitEvents: any) {
    super(emitEvents)

    this.isCompliance.value = false
    this.setDataFromProps(props)
  }

  setDataFromProps(props: PropsAssignRole): void {
    if (this.companyId.value !== props.companyId) {
      this.companyId.value = props.companyId
      this.fetchCompany()
      this.fetchDirectors()
    }

    this.accessRoles.value = props.accessRoles.map((ar: AccessRole) => {
      return new AccessRole(ar)
    })
  }

  async fetchCompany(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId.value)) {
      return
    }

    try {
      let repository = useCompanyStore()
      let response = await repository.fetch(this.companyId.value)

      if (response && repository.error === null) {
        this.company.value = new Company(response)
      }
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.setForFetch()
        error.handle()
      }
    }
  }

  async fetchDirectors(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId.value)) {
      this.numberOfDirectors.value = 1
      return
    }

    try {
      let repository = useDirectorStore()
      let response = await repository.fetchAllForCompany(this.companyId.value)

      if (response && repository.error === null) {
        this.numberOfDirectors.value = response.length
        this.directors.value = response.map((d: any) => {
          return new Director(d)
        })
      }
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.setForFetch()
        error.handle()
      }
    }
  }

  async onProceedClicked(): Promise<void> {
    if (this.isSubmitting.value || !this.canProceed) {
      return
    }

    try {
      this.isSubmitting.value = true
      let repository = useUserInvitationStore()

      await repository.adminGrantAccess(this.requestPayload)

      let promises = []

      let toastTitle = this.language.isMalay()
        ? `Akses diberikan kepada ${this.name.value.toUpperCase()}.`
        : `New Access is Granted to ${this.name.value.toUpperCase()}.`
      let toastMessage = ""
      if (this.isSendInvitation.value || this.isNotifyDirectors.value) {
        let emailTo: string[] = []
        if (this.isSendInvitation.value) {
          emailTo.push(this.name.value)
          promises.push(this.sendEmailToPerson())
        }

        if (this.isNotifyDirectors.value) {
          emailTo.push(this.language.isMalay() ? "Pengarah" : "Directors")
          promises.push(this.sendEmailToDirectors())
        }

        if (promises.length > 0) {
          await Promise.all(promises)
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

  async sendEmailToPerson(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.email.value)) {
      return
    }

    let adminEmail = new AdminEmail()
    adminEmail.recipients = [this.email.value]
    adminEmail.subject = this.emailTitleForPerson
    adminEmail.content = this.emailContentForPerson
    await adminEmail.sendEmail(useAdminEmailStore())
  }

  async sendEmailToDirectors(): Promise<void> {
    let directorEmails = this.directors.value.map((d: Director) => {
      return d.email
    })

    if (directorEmails.length <= 0) {
      return
    }

    let adminEmail = new AdminEmail()
    adminEmail.recipients = [...new Set(directorEmails)]
    adminEmail.subject = this.emailTitleForDirectors
    adminEmail.content = this.emailContentForDirectors
    await adminEmail.sendEmail(useAdminEmailStore())
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
      name: this.name.value.toUpperCase(),
      phone: this.phone.value,
      is_require_ekyc: this.isRequireEkyc.value,
      license: this.license.value,
      send_out_invitation: false, // this.isSendInvitation.value - we need the frontend to control the emails for now,
      notify_directors: false, //this.isNotifyDirectors.value,
    }
  }

  get selectedAccessRoleName(): string {
    return (
      this.accessRoles.value.find((ar: AccessRole) => {
        return ar.id === this.selectedAccessRole.value
      })?.name ?? "Officer"
    )
  }

  get emailContentForPerson(): string {
    let additionalClause = this.isRequireEkyc
      ? "Upon login, please complete the eKYC process. For compliance purposes, iCompany Systems require every user to complete the eKYC process on the systems,"
      : 'Upon login, click "<b>Proceed</b>" on the notification pop-up. You will be redirected to Company Documents, where you may view and download all documents currently available to you.'

    let content = `<p>Dear ${this.name.value.toUpperCase()},</p>
      <p>Please go to this URL: https://cosec.icompany.my</p>
      <p>
        <b>${this.name.value.toUpperCase()}</b> registered account details are as follows:
      </p>
      <p>
        <b>Default Username:</b><br>
        ${this.email.value}<br>
        <b>Default Password:</b><br>
        ${this.password.value}
      </p>
      <p>
        ${additionalClause}
      </p>
      <p>
        Please note that we are not aware of any additional documents other than those already available on the platform.
      </p>
      <p>
        If you require assistance, please contant use via WhatsApp at +6017 778 3266.
      </p>
      <p>
        Thank You.
      </p>
    `

    return content
  }

  get emailTitleForPerson(): string {
    return `[NOTICE] Access to ${this.company.value.getFullName().toUpperCase()}`
  }

  get emailContentForDirectors(): string {
    return `<p>Dear Director${this.numberOfDirectors.value > 1 ? "s" : ""},</p>
      <p>
        Access to <b>${this.company.value.getFullName().toUpperCase()}</b> is granted to ${this.name.value.toUpperCase()} / ${this.email.value}. 
      </p>
      <p>
        Please go to <a href="https://cosec.icompany.my/sdnbhd/${this.companyId.value}/roles-and-accesses">Roles & Access</a> to view, edit and/or revoke the access.
      </p>
      <p>
        Thank You.
      </p>
    `
  }

  get emailTitleForDirectors(): string {
    return `[NOTICE] Access to ${this.company.value.getFullName().toUpperCase()} is granted to ${this.name.value.toUpperCase()}`
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
