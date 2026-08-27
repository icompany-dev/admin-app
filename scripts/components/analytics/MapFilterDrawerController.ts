import { Filter } from "~/scripts/library/Filter"
import { MsicCode } from "~/scripts/models/MsicCode"
import type { PropsMapFilterDrawer } from "~/scripts/props/PropsMapFilterDrawer"
import type { FilterState } from "~/scripts/types/maps/MapFilterState"
import { MALAYSIA_STATE_COORDINATES, type MalaysiaState } from "~/scripts/types/maps/MapStates"

export class MapFilterDrawerController {
  emitEvents: any | null = null

  searchText: Ref<string | null> = ref<string | null>(null)
  selectedBusinessNature: Ref<string[]> = ref<string[]>([])
  selectedGenders: Ref<string[]> = ref<string[]>([])
  selectedStates: Ref<string[]> = ref<string[]>([])
  selectedAgeGroup: Ref<string[]> = ref<string[]>([])

  msicCodes: Ref<MsicCode[]> = ref<MsicCode[]>([])

  activeTab = ref<"users" | "companies" | "general">("users")

  isStateDropdownOpen: Ref<boolean> = ref<boolean>(false)

  constructor(props: PropsMapFilterDrawer, emitEvents: any) {
    this.emitEvents = emitEvents

    this.setDataFromProps(props)
  }

  setDataFromProps(props: PropsMapFilterDrawer): void {
    this.searchText.value = props.searchText
    this.selectedBusinessNature.value = props.selectedBusinessNature
    this.selectedGenders.value = props.selectedGenders
    this.selectedStates.value = props.selectedStates
    this.selectedAgeGroup.value = props.selectedAgeGroup
  }

  async fetchMsicCodes(): Promise<void> {
    let repository = useMsicCodeStore()
    let filter = new Filter()
    filter.takeAll = true

    let response = await repository.fetchAll(filter)
    this.msicCodes.value = response.data.map((d: any) => {
      return new MsicCode(d)
    })
  }

  toggleArrayItem<T>(array: T[], item: T): T[] {
    return array.includes(item) ? array.filter((i) => i !== item) : [...array, item]
  }

  handleUpdateFilter(field: keyof FilterState, value: any): void {
    this.emitEvents("filterChange", (prev: any) => ({ ...prev, [field]: value }))
  }

  handleToggleArrayFilter<T>(field: keyof FilterState, allOptions: T[], item: T): void {
    this.emitEvents("filterChange", (prev: any) => ({
      ...prev,
      [field]: this.toggleArrayItem((prev[field] as unknown as T[]) || [], item),
    }))
  }

  handleSelectAllToggle<T>(field: keyof FilterState, allOptions: T[]): void {
    this.emitEvents("filterChange", (prev: any) => {
      const currentList = (prev[field] as unknown as T[]) || []
      return {
        ...prev,
        [field]: currentList.length === allOptions.length ? [] : [...allOptions],
      }
    })
  }

  handleFlyToState(state: MalaysiaState): void {
    const coords = MALAYSIA_STATE_COORDINATES[state]
    if (coords) {
      this.emitEvents("flyToState", coords)
    }
    this.isStateDropdownOpen.value = false
  }

  get genderOptions(): string[] {
    return ["Male", "Female"]
  }

  get ageGroupOptions(): string[] {
    return ["< 30", "30 - 49", "> 50", "Unknown"]
  }

  get roleOptions(): string[] {
    return ["Director", "Shareholder", "Officer"]
  }

  get proximityOptions(): string[] {
    return ["< 5 km", "5 - 15 km", "15 - 50 km", "> 50 km"]
  }

  get stateOptions(): string[] {
    return [
      "Kuala Lumpur",
      "Selangor",
      "Penang",
      "Johor",
      "Perak",
      "Melaka",
      "Negeri Sembilan",
      "Pahang",
      "Terengganu",
      "Kelantan",
      "Kedah",
      "Perlis",
      "Sabah",
      "Sarawak",
      "Putrajaya",
      "Labuan",
      "(Not in Malaysia)",
    ]
  }

  get businessNatures(): string[] {
    let businessNatures = this.msicCodes.value.map((d: MsicCode) => {
      return d.categoryDescriptionEn.replace("...", "").trim()
    })

    return [...new Set(businessNatures)]
  }
}
