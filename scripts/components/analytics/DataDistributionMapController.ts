import { PropsMap } from "~/scripts/props/PropsMap"
import type { CompanyLocation } from "~/scripts/types/maps/MapCompanyLocation"
import { FilterState } from "~/scripts/types/maps/MapFilterState"
import { OfficeLocation } from "~/scripts/types/maps/MapOfficeLocation"
import type { UserLocation } from "~/scripts/types/maps/MapUserLocation"

export class DataDistributionMapController {
  emitEvents: any | null = null

  effectiveTheme: Ref<"light" | "dark"> = ref<"light" | "dark">("light")

  constructor(props: any, emitEvents: any) {
    this.emitEvents = emitEvents
  }

  // getters
  get officeLocation(): OfficeLocation {
    return new OfficeLocation({
      id: "icompany",
      name: "iCompany",
      address: "D-1-6 SEKITAR26 ENTERPRISE,<br>PERSIARAN HULU SELANGOR,<br>40400 SHAH ALAM,<br>SELANGOR, MALAYSIA",
      lat: 3.034333062104476,
      lng: 101.56259931349219,
      state: "Selangor",
      radiusKm: 15,
    })
  }

  get userLocations(): UserLocation[] {
    return []
  }

  get companyLocations(): CompanyLocation[] {
    return []
  }

  get filterState(): FilterState {
    return new FilterState(
      "all", //viewMode
      "gender", //userCategoryMode
      "state", //companyCategoryMode
      [], //selectedGenders
      [], //selectedAgeGroups
      [], //selectedRoles
      [], //selectedStates
      [], //selectedBusinessNatures
      [], //selectedProximityTiers
      20, //maxProximityKm
      "", //searchQuery
      true, //showOfficeRadius
      false //showConnectingLines
    )
  }

  get mapProps(): PropsMap {
    return new PropsMap(
      this.userLocations, //users
      this.companyLocations, //companies
      this.officeLocation, //office
      this.filterState, //filters
      this.effectiveTheme.value, //effectiveTheme
      null, //selectedUser
      null, //selectedCompany
      null //mapTarget
    )
  }
}
