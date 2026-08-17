import { EmailUser } from "~/scripts/library/EmailUser"
import type { PropsMapDetailDrawer } from "~/scripts/props/PropsMapDetailDrawer"
import type { CompanyLocation } from "~/scripts/types/maps/MapCompanyLocation"
import { OfficeLocation } from "~/scripts/types/maps/MapOfficeLocation"
import { MapTarget } from "~/scripts/types/maps/MapTarget"
import type { UserCompanyAppointment } from "~/scripts/types/maps/MapUserCompanyAppointment"
import type { CompanyRole, UserLocation } from "~/scripts/types/maps/MapUserLocation"
import { StringUtil } from "~/scripts/utils/String"

export class MapDetailDrawerController {
  emitEvents: any | null = null

  selectedUser: Ref<UserLocation | null> = ref<UserLocation | null>(null)
  selectedCompany: Ref<CompanyLocation | null> = ref<CompanyLocation | null>(null)
  office: Ref<OfficeLocation> = ref<OfficeLocation>(new OfficeLocation(null))
  allUsers: Ref<UserLocation[]> = ref<UserLocation[]>([])
  allCompanies: Ref<CompanyLocation[]> = ref<CompanyLocation[]>([])

  constructor(props: PropsMapDetailDrawer, emitEvents: any) {
    this.emitEvents = emitEvents

    this.setDataFromProps(props)
  }

  setDataFromProps(props: PropsMapDetailDrawer): void {
    this.selectedUser.value = props.selectedUser
    this.selectedCompany.value = props.selectedCompany
    this.office.value = props.office
    this.allUsers.value = props.allUsers
    this.allCompanies.value = props.allCompanies

    console.log("called", this.selectedUser.value)
  }

  getCompanyById(companyId: string): CompanyLocation | null {
    return (
      this.allCompanies.value.find((c: CompanyLocation) => {
        return c.id === companyId
      }) ?? null
    )
  }

  handleClose(): void {
    this.emitEvents("close")
  }

  handleSelectCompany(company: CompanyLocation): void {
    this.emitEvents("selectCompany", company)
    this.emitEvents("flyTo", new MapTarget(company.lat, company.lng, 14))
  }

  handleSelectUser(user: UserLocation): void {
    this.emitEvents("selectCompany", user)
    this.emitEvents("flyTo", new MapTarget(user.lat, user.lng, 14))
  }

  handleFlyToEntity(lat: number, lng: number, zoom = 15): void {
    this.emitEvents("flyTo", new MapTarget(lat, lng, zoom))
  }

  roleClass(role: CompanyRole): string {
    return "" // do something. should return the color: ROLE_COLORS[role]?.badge
  }

  onEmailClicked(email: string): void {
    if (StringUtil.isNullOrEmpty(email)) {
      return
    }

    let emailUser = new EmailUser(email)
    emailUser.connectToGmail()
  }

  // getters
  get userAppointments(): UserCompanyAppointment[] {
    if (!this.selectedUser.value) {
      return []
    }

    if (this.selectedUser.value.appointments && this.selectedUser.value.appointments.length > 0) {
      return this.selectedUser.value.appointments
    }
    return [
      {
        companyId: this.selectedUser.value.companyId,
        companyName: this.selectedUser.value.companyName,
        role: this.selectedUser.value.role,
        isPrimary: true,
        shareholdingPercent: undefined,
      },
    ]
  }

  get affiliatedPersonnel(): UserLocation[] {
    if (!this.selectedCompany.value) {
      return []
    }

    const companyId = this.selectedCompany.value.id

    return this.allUsers.value.filter((user: UserLocation) => {
      if (user.companyIds && user.companyIds.includes(companyId)) {
        return true
      }

      if (
        user.appointments &&
        user.appointments.some((uca: UserCompanyAppointment) => {
          return uca.companyId === companyId
        })
      ) {
        return true
      }

      return user.companyId === companyId
    })
  }

  get isSelectedUser(): boolean {
    return this.selectedUser.value !== null
  }

  get selectedUserRoles(): CompanyRole[] {
    if (!this.isSelectedUser || !this.selectedUser.value) {
      return []
    }

    if (Array.isArray(this.selectedUser.value.role)) {
      return this.selectedUser.value.role
    }

    return [this.selectedUser.value.role]
  }

  get selectedUserAgeGroupClass(): string {
    if (!this.isSelectedUser || !this.selectedUser.value) {
      return "unknown"
    }

    if (this.selectedUser.value.ageGroup === "< 30") {
      return "less-30"
    }

    if (this.selectedUser.value.ageGroup === "> 50") {
      return "more-50"
    }

    if (this.selectedUser.value.ageGroup === "30 - 49") {
      return "between-30-49"
    }

    return "unknown"
  }

  get selectedUserAge(): string {
    if (!this.isSelectedUser || !this.selectedUser.value || !this.selectedUser.value.age) {
      return "Age: Unknown / Unspecified"
    }

    return `${this.selectedUser.value.age} y/o (${this.selectedUser.value.ageGroup})`
  }

  get selectedUserActiveStatus(): string {
    if (!this.isSelectedUser || !this.selectedUser.value) {
      return "Inactive"
    }

    return this.selectedUser.value.activeStatus
  }

  get selectedUserAppointments(): UserCompanyAppointment[] {
    if (!this.isSelectedUser || !this.selectedUser.value) {
      return []
    }

    return this.selectedUser.value.appointments
  }

  get selectedUserMail(): string {
    if (!this.isSelectedUser || !this.selectedUser.value) {
      return "Unknown"
    }

    return this.selectedUser.value.email
  }

  get selectedUserPhone(): string {
    if (!this.isSelectedUser || !this.selectedUser.value) {
      return "Unknown"
    }

    return this.selectedUser.value.phone
  }

  get selectedUserAddress(): string {
    if (!this.isSelectedUser || !this.selectedUser.value) {
      return "Unknown"
    }

    return this.selectedUser.value.address
  }

  get selectedUserLat(): number {
    return this.selectedUser.value?.lat ?? 0
  }

  get selectedUserLng(): number {
    return this.selectedUser.value?.lng ?? 0
  }
}
