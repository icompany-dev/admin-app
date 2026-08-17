import type { MalaysiaState } from "./MapStates"
import type { UserCompanyAppointment } from "./MapUserCompanyAppointment"

export type Gender = "Male" | "Female"
export type AgeGroup = "< 30" | "30 - 49" | "> 50" | "Unknown"
export type CompanyRole = "Director" | "Shareholder" | "Director & Shareholder" | "Officer"

export class UserLocation {
  id: string
  name: string
  email: string
  phone: string
  avatarUrl?: string
  gender: Gender
  age: number
  ageGroup: AgeGroup
  role: CompanyRole
  companyId: string
  companyName: string
  companyIds: string[]
  appointments: UserCompanyAppointment[]
  lat: number
  lng: number
  city: string
  state: MalaysiaState
  address: string
  activeStatus: "Active" | "Inactive" | "Pending"
  lastSeen?: string

  constructor(
    id: string,
    name: string,
    email: string,
    phone: string,
    avatarUrl: string,
    gender: Gender,
    age: number,
    ageGroup: AgeGroup,
    role: CompanyRole,
    companyId: string,
    companyName: string,
    companyIds: string[],
    appointments: UserCompanyAppointment[],
    lat: number,
    lng: number,
    city: string,
    state: MalaysiaState,
    address: string,
    activeStatus: "Active" | "Inactive" | "Pending",
    lastSeen?: string
  ) {
    this.id = id
    this.name = name
    this.email = email
    this.phone = phone
    this.avatarUrl = avatarUrl
    this.gender = gender
    this.age = age
    this.ageGroup = ageGroup
    this.role = role
    this.companyId = companyId
    this.companyName = companyName
    this.companyIds = companyIds
    this.appointments = appointments
    this.lat = lat
    this.lng = lng
    this.city = city
    this.state = state
    this.address = address
    this.activeStatus = activeStatus
    this.lastSeen = lastSeen
  }
}
