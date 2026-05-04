export class NotificationItem {
  itemId: string = ""
  label: string = ""
  sublabel: string = ""
  isShowCompanyName: boolean = false
  companyName: string = ""
  isCompliance: boolean = false
  cta: (params?: any) => void = () => {}

  constructor(
    itemId: string,
    label: string,
    sublabel: string,
    isShowCompanyName: boolean,
    companyName: string,
    isCompliance: boolean,
    cta: (params?: any) => void
  ) {
    this.itemId = itemId
    this.label = label
    this.sublabel = sublabel
    this.isShowCompanyName = isShowCompanyName
    this.companyName = companyName
    this.isCompliance = isCompliance
    this.cta = cta
  }

  onClick(params?: any): void {
    this.cta(params)
  }
}
