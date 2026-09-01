export interface IPropsSecretarialServices {
  searchText: string | null
  isIncludeDemo: boolean
  target: string
}

export class PropsSecretarialServices implements IPropsSecretarialServices {
  searchText: string | null = null
  isIncludeDemo: boolean = false
  target: string

  constructor(searchText: string | null, isIncludeDemo: boolean, target: string) {
    this.searchText = searchText
    this.isIncludeDemo = isIncludeDemo
    this.target = target
  }
}
