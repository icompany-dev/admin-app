import type { MalaysiaState } from "./MapStates"
import type { ProximityTier } from "./MapProximityTier"

export class CompanyLocation {
  id: string
  name: string
  regNo: string // SSM registration number
  businessNature: string //BusinessNature;
  state: MalaysiaState
  city: string
  address: string
  lat: number
  lng: number
  directorsCount: number
  shareholdersCount: number
  officersCount: number
  establishedYear: number
  paidUpCapital: string
  officeDistanceKm?: number
  proximityTier?: ProximityTier
  contactEmail: string
  contactPhone: string
  website?: string
  associatedUserIds: string[]

  constructor(
    id: string,
    name: string,
    regNo: string, // SSM registration number,
    businessNature: string, //BusinessNature;,
    state: MalaysiaState,
    city: string,
    address: string,
    lat: number,
    lng: number,
    directorsCount: number,
    shareholdersCount: number,
    officersCount: number,
    establishedYear: number,
    paidUpCapital: string,
    officeDistanceKm: number,
    proximityTier: ProximityTier,
    contactEmail: string,
    contactPhone: string,
    website: string,
    associatedUserIds: string[]
  ) {
    this.id = id
    this.name = name
    this.regNo = regNo
    this.businessNature = businessNature
    this.state = state
    this.city = city
    this.address = address
    this.lat = lat
    this.lng = lng
    this.directorsCount = directorsCount
    this.shareholdersCount = shareholdersCount
    this.officersCount = officersCount
    this.establishedYear = establishedYear
    this.paidUpCapital = paidUpCapital
    this.officeDistanceKm = officeDistanceKm
    this.proximityTier = proximityTier
    this.contactEmail = contactEmail
    this.contactPhone = contactPhone
    this.website = website
    this.associatedUserIds = associatedUserIds
  }
}
