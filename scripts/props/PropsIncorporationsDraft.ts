export interface IPropsIncorporationsDraft {
  searchText: string | null
  isIncludeDemo: boolean
}

export class PropsIncorporationsDraft implements IPropsIncorporationsDraft {
  searchText: string | null = null
  isIncludeDemo: boolean = false

  constructor(searchText: string | null, isIncludeDemo: boolean) {
    this.searchText = searchText
    this.isIncludeDemo = isIncludeDemo
  }
}
