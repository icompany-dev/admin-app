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

    this.companyAuditor.value.companyId = this.companyId.value

    console.log(this.companyId.value)

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
    let accessRolesRepository = useAccessRoleStore()
    let accessRoleFilter = new Filter()
    accessRoleFilter.companyId = this.companyId.value
    accessRoleFilter.searchText = "auditor"

    let response = await accessRolesRepository.fetchAll(accessRoleFilter)
    if (response.totalRecords >= 0) {
      this.auditorAccessRole.value = new AccessRole(response.data[0])
      return
    }

    this.auditorAccessRole.value.companyId = this.companyId.value
    this.auditorAccessRole.value.name = "Appointed Auditor"
    this.auditorAccessRole.value.description = "Role for Appointed Auditors"
    await this.auditorAccessRole.value.create(accessRolesRepository)
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

      let promises = [this.companyAuditor.value.create(useCompanyAuditorStore())]

      if (this.isGrantAccess.value) {
        promises.push(this.grantAccess())
      }

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
      // create user account with some random password
      let userRepository = useUserStore()
      let user = await userRepository.fetchByEmail(this.companyAuditor.value.auditorEmail)

      if (!user) {
        let auth = useAuthStore()
        let success = await auth.register({
          email: this.companyAuditor.value.auditorEmail,
          password: "randomPassword1234565",
          passwordConfirmation: "randomPassword1234565",
        })

        if (!success) {
          return //
        }

        user = await userRepository.fetchByEmail(this.companyAuditor.value.auditorEmail)

        if (!user) {
          return
        }
      }

      if (!user?.detail) {
        return
      }

      if (StringUtil.isNullOrEmpty(user.detail.identification)) {
        user.name = this.companyAuditor.value.auditorCompanyName.toUpperCase()
        user.phone = this.companyAuditor.value.auditorPhone
        user.detail.identification = this.companyAuditor.value.auditorLicense
        user.detail.identificationType = "ic" //leave it as it is
        await user.update(userRepository)
      }

      let userInvitation = new UserInvitation()
      userInvitation.companyId = this.companyId.value
      userInvitation.name = this.companyAuditor.value.auditorContactPerson
      userInvitation.email = this.companyAuditor.value.auditorEmail
      userInvitation.accessRoleId = this.auditorAccessRole.value.id

      if (!userInvitation.canSubmit()) {
        console.log("invitation", userInvitation)
      }

      await userInvitation.create(useUserInvitationStore())

      console.log("user invitation", userInvitation)
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
}
