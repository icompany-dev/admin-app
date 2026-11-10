import { Filter } from "~/scripts/library/Filter"
import { AuditorPartner } from "~/scripts/models/AuditorPartner"
import { CompanyAuditor } from "~/scripts/models/CompanyAuditor"
import { PopupTitles, PopupTitlesBm } from "~/scripts/constants/Popups"
import type { PropsAddCompanyAuditor } from "~/scripts/props/PropsAddCompanyAuditor"
import { BasePopupController } from "./BasePopupController"
import { EmitMessages } from "~/scripts/constants/EmitMessages"
import { AccessRole } from "~/scripts/models/AccessRole"
import { UserInvitation } from "~/scripts/models/UserInvitation"
import { Error } from "~/scripts/library/Error"
import { Toast } from "~/scripts/library/Toast"
import { SelectOption } from "~/scripts/types/SelectOption"
import { StringUtil } from "~/scripts/utils/String"

export class AddCompanyAuditorController extends BasePopupController {
  auditorPartners: Ref<AuditorPartner[]> = ref<AuditorPartner[]>([])
  companyAuditor = ref<CompanyAuditor>(new CompanyAuditor())
  companyId: Ref<string> = ref<string>("")
  email: Ref<string> = ref<string>("")

  name: Ref<string> = ref<string>("")
  phone: Ref<string> = ref<string>("")
  license: Ref<string> = ref<string>("")
  password: Ref<string> = ref<string>("iCompany2026!!")

  isSendInvitation: Ref<boolean> = ref<boolean>(false)
  isNotifyDirectors: Ref<boolean> = ref<boolean>(false)

  isGrantAccess: Ref<boolean> = ref<boolean>(false)
  isSubmitting: Ref<boolean> = ref<boolean>(false)

  searchText: Ref<string> = ref<string>("")
  dateOfAppointment: Ref<string> = ref<string>("")

  auditorAccessRole: Ref<AccessRole> = ref<AccessRole>(new AccessRole())

  constructor(props: PropsAddCompanyAuditor, emitEvents: any) {
    super(emitEvents)

    this.isCompliance.value = false

    this.setDataProps(props)

    this.init()
  }

  async setDataProps(props: PropsAddCompanyAuditor): Promise<void> {
    this.companyId.value = props.companyId

    this.companyAuditor.value = new CompanyAuditor(props.auditor)
    this.companyAuditor.value.companyId = this.companyId.value

    this.name.value = this.companyAuditor.value.auditorCompanyName
    this.email.value = this.companyAuditor.value.auditorEmail
    this.phone.value = this.companyAuditor.value.auditorPhone
    this.license.value = this.companyAuditor.value.auditorLicense

    await this.fetchAuditorAccessRole()
  }

  async init(): Promise<void> {
    let repository = useAuditorPartnerStore()
    let filter = new Filter()
    filter.takeAll = true
    let response = await repository.fetchAll(filter)

    this.auditorPartners.value = response.data.map((d: any) => {
      return new AuditorPartner(d)
    })
  }

  async fetchAuditorAccessRole(): Promise<void> {
    try {
      let accessRolesRepository = useAccessRoleStore()
      let accessRoleFilter = new Filter()
      accessRoleFilter.companyId = this.companyId.value
      accessRoleFilter.searchText = "auditor"

      let response = await accessRolesRepository.fetchAll(accessRoleFilter)
      if (response.totalRecords > 0) {
        this.auditorAccessRole.value = new AccessRole(response.data[0])
        return
      }

      this.auditorAccessRole.value.companyId = this.companyId.value
      this.auditorAccessRole.value.name = "Appointed Auditor"
      this.auditorAccessRole.value.description = "Role for Appointed Auditors"
      await this.auditorAccessRole.value.create(accessRolesRepository)
    } catch (e) {
      console.error(e)
    }
  }

  override show(): void {
    this.companyAuditor.value = new CompanyAuditor()
    this.companyAuditor.value.companyId = this.companyId.value

    if (!this.popupRef) {
      return
    }

    this.popupRef.show()
  }

  override onCancelClicked(): void {
    if (this.isSubmitting.value) {
      return
    }

    this.hide()
    this.emitEvents(EmitMessages.BACK)
  }

  onProceedClicked(): void {
    this.emitEvents(EmitMessages.PROCEED)
    this.hide()
  }

  async addAuditor(): Promise<void> {
    if (!this.companyAuditor.value.canSubmit()) {
      return
    }

    try {
      this.isSubmitting.value = true

      let promises: any[] = []

      if (StringUtil.isNullOrEmpty(this.companyAuditor.value.id)) {
        promises.push(this.companyAuditor.value.create(useCompanyAuditorStore()))
      } else {
        promises.push(this.companyAuditor.value.update(useCompanyAuditorStore()))
      }

      if (this.isGrantAccess.value) {
        promises.push(this.grantAccess())
      }

      await Promise.allSettled(promises)

      let toastTitle = this.language.isMalay()
        ? "Anda telah berjaya tambah butiran Juruaudit Syarikat"
        : "You have successfully added the details of the Company Auditor."
      let toastMessage = ""
      if (this.isGrantAccess.value) {
        toastMessage = this.language.isMalay()
          ? `Emel telah dihantar ke ${this.companyAuditor.value.auditorEmail}.`
          : `Email was sent to ${this.companyAuditor.value.auditorEmail}.`
      }
      let toast = new Toast(toastTitle, toastMessage)
      toast.success()

      this.onProceedClicked()
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

  async grantAccess(): Promise<void> {
    try {
      let repository = useUserInvitationStore()

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
    } catch (e) {
      console.error(e)

      let error = new Error()
      error.setForCUD()
      throw error
    }
  }

  onAuditorPartnerSelected(auditorPartnerId: string): void {
    let auditorPartner = this.auditorPartners.value.find((ap: AuditorPartner) => {
      return ap.id === auditorPartnerId
    })

    if (!auditorPartner) {
      this.companyAuditor.value.auditorPartnerId = ""
      return
    }

    this.companyAuditor.value.auditorPartnerId = auditorPartnerId
    this.companyAuditor.value.auditorCompanyName = auditorPartner.companyName
    this.companyAuditor.value.auditorLicense = auditorPartner.license
    this.companyAuditor.value.auditorEmail = auditorPartner.companyEmail
    this.companyAuditor.value.auditorPhone = auditorPartner.companyPhone

    this.name.value = this.companyAuditor.value.auditorCompanyName
    this.email.value = this.companyAuditor.value.auditorEmail
    this.phone.value = this.companyAuditor.value.auditorPhone
    this.license.value = this.companyAuditor.value.auditorLicense
  }

  onDataChanged(): void {
    this.companyAuditor.value.auditorCompanyName = this.name.value
    this.companyAuditor.value.auditorEmail = this.email.value
    this.companyAuditor.value.auditorPhone = this.phone.value
    this.companyAuditor.value.auditorLicense = this.license.value
  }

  onSearch(searchText: string): void {
    this.searchText.value = searchText
  }

  onDateOfAppointmentChanged(): void {
    this.companyAuditor.value.appointmentDate = this.dateOfAppointment.value
  }

  get title(): string {
    return this.language.isMalay() ? PopupTitlesBm.ImportantNotice : PopupTitles.ImportantNotice
  }

  get heading(): string {
    return this.language.isMalay() ? `Tambah Juruaudit` : `Add Auditor`
  }

  get cta(): string {
    return this.language.isMalay() ? "Ingin teruskan?" : "Would you like to continue?"
  }

  get content(): string {
    if (this.language.isMalay()) {
      return `
        Lengkapkan semua butiran yang diperlukan.
      `
    }

    return `
      Complete all the required details.
    `
  }

  get auditorCompanyNameLabel(): string {
    return this.language.isMalay() ? "Nama Firma" : "Firm Name"
  }

  get auditorLicenseLabel(): string {
    return this.language.isMalay() ? "No. Lesen" : "License No."
  }

  get auditorAppointmentDateLabel(): string {
    return this.language.isMalay() ? "Tarikh Perlantikan" : "Date of Appointment"
  }

  get auditorLocationLabel(): string {
    return this.language.isMalay() ? "Alamat Firma" : "Firm Address"
  }

  get auditorEmailLabel(): string {
    return this.language.isMalay() ? "Alamat Emel" : "Email Address"
  }

  get auditorPhoneLabel(): string {
    return this.language.isMalay() ? "No. Telefon Bimbit" : "Mobile Number"
  }

  get auditorPasswordLabel(): string {
    return this.language.isMalay() ? "Kata Kunci" : "Password"
  }

  get auditorContactPersonLabel(): string {
    return this.language.isMalay() ? "Nama Orang boleh Dihubungi" : "Name of Contact Person"
  }

  get grantAccessLabel(): string {
    return this.language.isMalay() ? "Beri Akses kepada Juruaudit ini?" : "Grant Access to this Auditor?"
  }

  get auditorPartnerOptions(): SelectOption[] {
    return this.auditorPartners.value
      .filter((ap: AuditorPartner) => {
        if (StringUtil.isNullOrEmpty(this.searchText.value)) {
          return true
        }

        return (
          StringUtil.contains(ap.companyName, this.searchText.value) ||
          StringUtil.contains(ap.license, this.searchText.value)
        )
      })
      .map((ap: AuditorPartner) => {
        return new SelectOption(ap.id, ap.id, ap.companyName)
      })
  }

  get auditorPartnerLabel(): string {
    return this.language.isMalay() ? "Juruaudit" : "Auditor"
  }

  get selectedAuditorPartnerName(): string {
    if (StringUtil.isNullOrEmpty(this.companyAuditor.value.auditorPartnerId)) {
      return this.language.isMalay() ? "Pilih Juruaudit" : "Select an Auditor"
    }

    let auditor = this.auditorPartners.value.find((ap: AuditorPartner) => {
      return ap.id === this.companyAuditor.value.auditorPartnerId
    })

    if (!auditor) {
      return this.language.isMalay() ? "Pilih Juruaudit" : "Select an Auditor"
    }

    return auditor.companyName
  }

  get sendInvitationLabel(): string {
    return this.language.isMalay() ? "Hantar Notis melalui Emel & WhatsApp" : "Send Notice through Email & WhatsApp"
  }

  get notifyDirectorsLabel(): string {
    return this.language.isMalay()
      ? "Maklumkan kepada Pengarah melalui Emel & WhatsApp"
      : "Notify Directors through Email & WhatsApp"
  }

  get requestPayload(): object {
    return {
      email: this.email.value,
      access_role_id: this.auditorAccessRole.value.id,
      company_id: this.companyId.value,
      password: this.password.value,
      name: this.name.value.toUpperCase(),
      phone: this.phone.value,
      is_require_ekyc: false,
      license: this.license.value,
      send_out_invitation: this.isSendInvitation.value,
      notify_directors: this.isNotifyDirectors.value,
    }
  }
}
