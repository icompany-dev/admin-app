export interface IPropsMapFilterDrawer {
  searchText: string | null
  selectedBusinessNature: string[]
  selectedGenders: string[]
  selectedStates: string[]
  selectedAgeGroup: string[]
}

export class PropsMapFilterDrawer implements IPropsMapFilterDrawer {
  searchText: string | null = null
  selectedBusinessNature: string[] = []
  selectedGenders: string[] = []
  selectedStates: string[] = []
  selectedAgeGroup: string[] = []

  constructor(
    searchText: string | null,
    selectedBusinessNature: string[],
    selectedGenders: string[],
    selectedStates: string[],
    selectedAgeGroup: string[]
  ) {
    this.searchText = searchText
    this.selectedBusinessNature = selectedBusinessNature
    this.selectedGenders = selectedGenders
    this.selectedStates = selectedStates
    this.selectedAgeGroup = selectedAgeGroup
  }
}
