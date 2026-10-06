export interface IPropsManagementAccounts {
  searchText: string
  isIncludeDemo: boolean
}

export class PropsManagementAccounts implements IPropsManagementAccounts {
  searchText: string
  isIncludeDemo: boolean

  constructor(searchText: string, isIncludeDemo: boolean) {
    this.searchText = searchText
    this.isIncludeDemo = isIncludeDemo
  }
}
