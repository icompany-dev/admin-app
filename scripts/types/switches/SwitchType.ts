export class SwitchType {
  id: string = ""
  value: string = ""
  emphasisedLabel: string = ""
  label: string = ""
  isSelected: boolean = false

  //cta
  hasCta: boolean = false
  ctaLabel: string | null = null
  cta: Function | null = null

  constructor(
    id: string,
    value: string,
    emphasisedLabel: string,
    label: string,
    isSelected: boolean,
    hasCta: boolean,
    ctaLabel: string | null,
    cta: Function | null
  ) {
    this.id = id
    this.value = value
    this.emphasisedLabel = emphasisedLabel
    this.label = label
    this.isSelected = isSelected
    this.hasCta = hasCta
    this.ctaLabel = ctaLabel
    this.cta = cta
  }
}
