import type { AnalyticsCompanyCoordinate } from "../models/AnalyticsCompanyCoordinate"
import type { AnalyticsUserCoordinate } from "../models/AnalyticsUserCoordinate"
import type { CompanyLocation } from "../types/maps/MapCompanyLocation"
import type { FilterState } from "../types/maps/MapFilterState"
import type { OfficeLocation } from "../types/maps/MapOfficeLocation"
import type { MapTarget } from "../types/maps/MapTarget"
import type { UserLocation } from "../types/maps/MapUserLocation"

export interface IPropsMap {
  users: UserLocation[]
  companies: CompanyLocation[]
  office: OfficeLocation
  filters: FilterState // FilterState --TODO
  effectiveTheme: "light" | "dark"
  selectedUser?: UserLocation | null
  selectedCompany?: CompanyLocation | null
  mapTarget?: MapTarget | null
}

export class PropsMap implements IPropsMap {
  users: UserLocation[] //UserLocation
  companies: CompanyLocation[] // CompanyLocation
  office: OfficeLocation // Company Coordinate
  filters: FilterState // FilterState --TODO
  effectiveTheme: "light" | "dark"
  selectedUser?: UserLocation | null
  selectedCompany?: CompanyLocation | null
  mapTarget?: MapTarget | null

  constructor(
    users: UserLocation[], //UserLocation
    companies: CompanyLocation[], // CompanyLocation
    office: OfficeLocation, // Company Coordinate
    filters: FilterState, // FilterState --TODO
    effectiveTheme: "light" | "dark",
    selectedUser?: UserLocation | null,
    selectedCompany?: CompanyLocation | null,
    mapTarget?: MapTarget | null
  ) {
    this.users = users
    this.companies = companies
    this.office = office
    this.filters = filters
    this.effectiveTheme = effectiveTheme
    this.selectedUser = selectedUser
    this.selectedCompany = selectedCompany
    this.mapTarget = mapTarget
  }
}
