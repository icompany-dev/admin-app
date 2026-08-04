export interface IPropsSwitchesOngoing {
  searchText: string | null
  isIncludeDemo: boolean
}

export class PropsSwitchesOngoing implements IPropsSwitchesOngoing {
  searchText: string | null = null
  isIncludeDemo: boolean = false

  constructor(searchText: string | null, isIncludeDemo: boolean) {
    this.searchText = searchText
    this.isIncludeDemo = isIncludeDemo
  }
}
