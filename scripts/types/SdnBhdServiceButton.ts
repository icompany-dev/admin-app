export class SdnBhdServiceButton {
  name: string
  label: string
  hoverLabel: string = ""
  cta: () => {}

  constructor(name: string, label: string, cta: () => {}, hoverLabel: string = "") {
    this.name = name
    this.label = label
    this.cta = cta
    this.hoverLabel = hoverLabel
  }
}
