export interface IPropsPopup {
  title: string
  heading: string
  cta: string
  isCompliance: boolean
  hasCta: boolean
  hasActionButtons: boolean
  cssClass: string
}

export class PropsPopup {
  title: string
  heading: string
  cta: string
  isCompliance: boolean
  hasCta: boolean
  hasActionButtons: boolean
  cssClass: string = ""

  constructor(
    title: string,
    heading: string,
    cta: string,
    isCompliance: boolean,
    hasCta: boolean,
    hasActionButtons: boolean
  ) {
    this.title = title
    this.heading = heading
    this.cta = cta
    this.isCompliance = isCompliance
    this.hasCta = hasCta
    this.hasActionButtons = hasActionButtons
  }
}
