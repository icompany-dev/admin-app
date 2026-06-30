export interface IPropsPopup {
  title: string
  heading: string
  cta: string
  isCompliance: boolean
  hasCta: boolean
  hasActionButtons: boolean
}

export class PropsPopup {
  title: string
  heading: string
  cta: string
  isCompliance: boolean
  hasCta: boolean
  hasActionButtons: boolean

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
