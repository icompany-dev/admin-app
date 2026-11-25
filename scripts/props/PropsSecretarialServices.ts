export interface IPropsSecretarialServices {
  searchText: string | null
  isIncludeDemo: boolean
  isShowPaidOnly: boolean
  isShowCustomResolution: boolean // This is for document requests
  target: string
}

export class PropsSecretarialServices implements IPropsSecretarialServices {
  searchText: string | null = null
  isIncludeDemo: boolean = false
  isShowPaidOnly: boolean = false
  isShowCustomResolution: boolean = false
  target: string

  constructor(
    searchText: string | null,
    isIncludeDemo: boolean,
    isShowPaidOnly: boolean,
    isShowCustomResolution: boolean,
    target: string
  ) {
    this.searchText = searchText
    this.isIncludeDemo = isIncludeDemo
    this.isShowPaidOnly = isShowPaidOnly
    this.isShowCustomResolution = isShowCustomResolution
    this.target = target
  }
}
