import type { CompanyLocation } from "../types/maps/MapCompanyLocation"
import type { OfficeLocation } from "../types/maps/MapOfficeLocation"
import type { UserLocation } from "../types/maps/MapUserLocation"

export interface IPropsMapDetailDrawer {
  selectedUser: UserLocation | null
  selectedCompany: CompanyLocation | null
  office: OfficeLocation
  allUsers: UserLocation[]
  allCompanies: CompanyLocation[]
}

export class PropsMapDetailDrawer implements IPropsMapDetailDrawer {
  selectedUser: UserLocation | null
  selectedCompany: CompanyLocation | null
  office: OfficeLocation
  allUsers: UserLocation[]
  allCompanies: CompanyLocation[]

  constructor(
    selectedUser: UserLocation | null,
    selectedCompany: CompanyLocation | null,
    office: OfficeLocation,
    allUsers: UserLocation[],
    allCompanies: CompanyLocation[]
  ) {
    this.selectedUser = selectedUser
    this.selectedCompany = selectedCompany
    this.office = office
    this.allUsers = allUsers
    this.allCompanies = allCompanies
  }
}
