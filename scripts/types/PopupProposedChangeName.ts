export class PopupProposedChangedName {
  label: string = ""
  name: string = ""
  isSelected: boolean = true

  constructor(label: string, name: string, isSelected: boolean) {
    this.label = label
    this.name = name
    this.isSelected = isSelected
  }
}
