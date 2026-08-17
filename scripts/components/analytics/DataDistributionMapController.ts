import { PropsMap } from "~/scripts/props/PropsMap"
import { CompanyLocation } from "~/scripts/types/maps/MapCompanyLocation"
import { FilterState } from "~/scripts/types/maps/MapFilterState"
import { OfficeLocation } from "~/scripts/types/maps/MapOfficeLocation"
import { UserLocation, type AgeGroup, type CompanyRole } from "~/scripts/types/maps/MapUserLocation"
import { AnalyticsCompanyCoordinate } from "~/scripts/models/AnalyticsCompanyCoordinate"
import { AnalyticsUserCoordinate } from "~/scripts/models/AnalyticsUserCoordinate"
import { State } from "~/scripts/models/Location"
import { MALAYSIA_STATES, type MalaysiaState } from "~/scripts/types/maps/MapStates"
import { PropsMapDetailDrawer } from "~/scripts/props/PropsMapDetailDrawer"
import { MapTarget } from "~/scripts/types/maps/MapTarget"

export class DataDistributionMapController {
  emitEvents: any | null = null

  userCoordinates: Ref<AnalyticsUserCoordinate[]> = ref<AnalyticsUserCoordinate[]>([])
  companyCoordinates: Ref<AnalyticsCompanyCoordinate[]> = ref<AnalyticsCompanyCoordinate[]>([])
  natureOfBusinesses: Ref<any[]> = ref<any[]>([])
  states: Ref<State[]> = ref<State[]>([])

  isLoading: Ref<boolean> = ref<boolean>(false)

  selectedUser: Ref<UserLocation | null> = ref<UserLocation | null>(null)
  selectedCompany: Ref<CompanyLocation | null> = ref<CompanyLocation | null>(null)
  selectedMapTarget: Ref<MapTarget | null> = ref<MapTarget | null>(null)

  effectiveTheme: Ref<"light" | "dark"> = ref<"light" | "dark">("light")

  constructor(props: any, emitEvents: any) {
    this.emitEvents = emitEvents

    this.init()
  }

  async init(): Promise<void> {
    if (this.isLoading.value) {
      return
    }

    try {
      this.isLoading.value = true

      await Promise.allSettled([this.fetchUserCoordinates(), this.fetchCompanyCoordinates(), this.fetchStates()])
    } catch (e) {
      console.error(e)
    } finally {
      this.isLoading.value = false
    }
  }

  async fetchUserCoordinates(): Promise<void> {
    this.userCoordinates.value = []

    let repository = useAnalyticsStore()
    let response = await repository.fetchUserCoordinates()
    this.userCoordinates.value = response.map((d: any) => {
      return new AnalyticsUserCoordinate(d)
    })
  }

  async fetchCompanyCoordinates() {
    this.companyCoordinates.value = []
    this.natureOfBusinesses.value = []

    let repository = useAnalyticsStore()
    let response = await repository.fetchCompanyCoordinates()
    this.companyCoordinates.value = response.map((d: any) => {
      return new AnalyticsCompanyCoordinate(d)
    })

    this.natureOfBusinesses.value = Array.from(
      new Set(
        this.companyCoordinates.value.flatMap((cc) => {
          return cc.msicCodes
        })
      )
    ).map((msicCode) => {
      return {
        code: msicCode.code,
        color: null,
      }
    })
  }

  async fetchStates() {
    this.states.value = []

    let repository = useStateStore()
    let response = await repository.byCountryId(87) //malaysia only
    this.states.value = repository.states.map((d: any) => {
      return new State(d)
    })
  }

  onSelectedUser(user: UserLocation | null): void {
    this.selectedUser.value = user
    this.selectedMapTarget.value = null
    this.selectedCompany.value = null
  }

  onSelectedCompany(company: CompanyLocation | null): void {
    this.selectedCompany.value = company
    this.selectedMapTarget.value = null
    this.selectedUser.value = null
  }

  onFlyTo(mapTarget: MapTarget): void {
    this.selectedMapTarget.value = mapTarget
  }

  onCloseDetailDrawer(): void {
    this.selectedUser.value = null
    this.selectedCompany.value = null
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
    return this.userCoordinates.value.map((uc: AnalyticsUserCoordinate) => {
      let ageGroup: AgeGroup = "Unknown"
      if (uc.age !== null) {
        ageGroup = uc.age < 30 ? "< 30" : uc.age >= 30 && uc.age < 50 ? "30 - 49" : "> 50"
      }

      let role: CompanyRole = "Officer"
      if (uc.isADirector && uc.isAShareholder) {
        role = "Director & Shareholder"
      } else if (uc.isADirector) {
        role = "Director"
      } else if (uc.isAShareholder) {
        role = "Shareholder"
      }

      let state: MalaysiaState | null =
        (MALAYSIA_STATES.find((state: string) => {
          return uc.address.includes(state.toLowerCase())
        }) as MalaysiaState) ?? null

      return new UserLocation(
        uc.name, //id
        uc.name, //name
        uc.email, //email
        uc.phone, //phone
        "", //avatarUrl
        uc.gender === "female" ? "Female" : "Male", //gender
        uc.age ?? 0, //age
        ageGroup, //ageGroup
        role, //role
        "", //companyId
        "", //companyName
        [], //companyIds
        [], //appointments
        uc.coordinate.lat, //lat
        uc.coordinate.lng, //lng
        uc.address, //city
        state ?? "(Not in Malaysia)", //state
        uc.address, //address
        "Active" //activeStatus
        //lastSeen
      )
    })
  }

  get companyLocations(): CompanyLocation[] {
    return this.companyCoordinates.value.map((cc: AnalyticsCompanyCoordinate) => {
      let businessNature = "" // need to handle

      let state: MalaysiaState | null =
        (MALAYSIA_STATES.find((state: string) => {
          return cc.address.includes(state.toLowerCase())
        }) as MalaysiaState) ?? null

      return new CompanyLocation(
        cc.companyId,
        cc.name,
        "", //reg no
        businessNature,
        state ?? "(Not in Malaysia)",
        "", //city,
        cc.address,
        cc.coordinate.lat,
        cc.coordinate.lng,
        1, //director count
        1, //shareholder count
        0, //officeers count
        2026, //incorporated year,
        "100", //total shares,
        0, // office distance?,
        "< 5 km", // need to deal with this,
        "", //email
        "", // phone,
        "", //website,
        []
      )
    })
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
      this.selectedUser.value, //selectedUser
      this.selectedCompany.value, //selectedCompany
      this.selectedMapTarget.value //mapTarget
    )
  }

  get mapDetailDrawerProps(): PropsMapDetailDrawer {
    return new PropsMapDetailDrawer(
      this.selectedUser.value,
      this.selectedCompany.value,
      this.officeLocation,
      this.userLocations,
      this.companyLocations
    )
  }
}
