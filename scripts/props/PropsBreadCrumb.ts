export interface IPropsBreadCrumbItem {
  pageName: string
  url: string
}

export interface IPropsBreadCrumb {
  crumbs: IPropsBreadCrumbItem[]
}

export class PropsBreadCrumbItem implements IPropsBreadCrumbItem {
  pageName: string = ""
  url: string = ""

  constructor(pageName: string, url: string) {
    this.pageName = pageName
    this.url = url
  }
}

export class PropsBreadCrumb implements IPropsBreadCrumb {
  crumbs: PropsBreadCrumbItem[] = []

  constructor(crumbs: PropsBreadCrumbItem[]) {
    this.crumbs = crumbs.map((d: PropsBreadCrumbItem) => {
      return new PropsBreadCrumbItem(d.pageName, d.url)
    })
  }
}
