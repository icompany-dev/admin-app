export class SearchResult {
  title: string = ""
  description: string = ""
  cta: Function = () => {}

  hasBadge: boolean = false
  badgeContent: string = ""
  badgeClass: string = ""

  subtitle: string = ""
  companyName: string = ""
  companyId: string = ""

  hasTooltip: boolean = false
  tooltipContent: string = ""

  alertContent: string = ""
  ctaLabel: string = ""

  constructor(
    title: string,
    description: string,
    cta: Function,
    hasBadge: boolean,
    badgeContent: string,
    badgeClass: string,
    subtitle: string,
    companyName: string,
    companyId: string,
    hasTooltip: boolean,
    tooltipContent: string,
    alertContent: string,
    ctaLabel: string
  ) {
    this.title = title
    this.description = description
    this.cta = cta

    this.hasBadge = hasBadge
    this.badgeContent = badgeContent
    this.badgeClass = badgeClass

    this.subtitle = subtitle
    this.companyName = companyName
    this.companyId = companyId

    this.hasTooltip = hasTooltip
    this.tooltipContent = tooltipContent

    this.alertContent = alertContent
    this.ctaLabel = ctaLabel
  }
}
