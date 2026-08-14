export class SelectOption {
  id: string | number = ""
  value: string | number = ""
  label: string = ""
  isDisabled: boolean = false
  isSelected: boolean = false

  constructor(id: string, value: string, label: string, isDisabled: boolean = false, isSelected: boolean = false) {
    this.id = id
    this.value = value
    this.label = label
    this.isDisabled = isDisabled
    this.isSelected = isSelected
  }
}
