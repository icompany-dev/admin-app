export interface IPropsIncorporationsOngoing {
  searchText: string | null
  isIncludeDemo: boolean
}

export class PropsIncorporationsOngoing implements IPropsIncorporationsOngoing {
  searchText: string | null = null
  isIncludeDemo: boolean = false

  constructor(searchText: string | null, isIncludeDemo: boolean) {
    this.searchText = searchText
    this.isIncludeDemo = isIncludeDemo
  }
}
