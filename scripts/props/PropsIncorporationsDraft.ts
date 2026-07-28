export interface IPropsIncorporationsDraft {
  searchText: string | null
}

export class PropsIncorporationsDraft implements IPropsIncorporationsDraft {
  searchText: string | null = null

  constructor(searchText: string | null) {
    this.searchText = searchText
  }
}
