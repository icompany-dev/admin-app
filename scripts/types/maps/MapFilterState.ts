import type { MalaysiaState } from "./MapStates"
import type { Gender, AgeGroup, CompanyRole } from "./MapUserLocation"
import type { ProximityTier } from "./MapProximityTier"

export type UserCategoryMode = "role" | "gender" | "age_group"
export type CompanyCategoryMode = "state" | "proximity" | "business_nature"
export type ViewMode = "all" | "users" | "companies"
export type ThemeMode = "light" | "dark" | "system"

export class FilterState {
  viewMode: ViewMode
  userCategoryMode: UserCategoryMode
  companyCategoryMode: CompanyCategoryMode
  selectedGenders: Gender[]
  selectedAgeGroups: AgeGroup[]
  selectedRoles: CompanyRole[]
  selectedStates: MalaysiaState[]
  selectedBusinessNatures: string[]
  selectedProximityTiers: ProximityTier[]
  maxProximityKm: number
  searchQuery: string
  showOfficeRadius: boolean
  showConnectingLines: boolean

  constructor(
    viewMode: ViewMode,
    userCategoryMode: UserCategoryMode,
    companyCategoryMode: CompanyCategoryMode,
    selectedGenders: Gender[],
    selectedAgeGroups: AgeGroup[],
    selectedRoles: CompanyRole[],
    selectedStates: MalaysiaState[],
    selectedBusinessNatures: string[],
    selectedProximityTiers: ProximityTier[],
    maxProximityKm: number,
    searchQuery: string,
    showOfficeRadius: boolean,
    showConnectingLines: boolean
  ) {
    this.viewMode = viewMode
    this.userCategoryMode = userCategoryMode
    this.companyCategoryMode = companyCategoryMode
    this.selectedGenders = selectedGenders
    this.selectedAgeGroups = selectedAgeGroups
    this.selectedRoles = selectedRoles
    this.selectedStates = selectedStates
    this.selectedBusinessNatures = selectedBusinessNatures
    this.selectedProximityTiers = selectedProximityTiers
    this.maxProximityKm = maxProximityKm
    this.searchQuery = searchQuery
    this.showOfficeRadius = showOfficeRadius
    this.showConnectingLines = showConnectingLines
  }
}
