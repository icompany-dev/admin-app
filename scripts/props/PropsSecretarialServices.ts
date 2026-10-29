export interface IPropsSecretarialServices {
  searchText: string | null
  isIncludeDemo: boolean
  isShowPaidOnly: boolean
  target: string
}

export class PropsSecretarialServices implements IPropsSecretarialServices {
  searchText: string | null = null
  isIncludeDemo: boolean = false
  isShowPaidOnly: boolean = false
  target: string

  constructor(searchText: string | null, isIncludeDemo: boolean, isShowPaidOnly: boolean, target: string) {
    this.searchText = searchText
    this.isIncludeDemo = isIncludeDemo
    this.isShowPaidOnly = isShowPaidOnly
    this.target = target
  }
}
