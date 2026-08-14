export class CentreStageActionButton {
  id: string = "1"
  label: string = ""
  iconClass: string = ""
  eventEmit: string = ""
  description: string = ""
  numberMarker: number = 0
  isSelected = ref<boolean>(false)
  isLoading = ref<boolean>(false)

  constructor(
    id: any,
    label: string,
    iconClass: string,
    eventEmit: string,
    description: string,
    numberMarker: number,
    isSelected: boolean,
    isLoading: boolean
  ) {
    this.id = id.toString()
    this.label = label
    this.iconClass = iconClass
    this.eventEmit = eventEmit
    this.description = description
    this.numberMarker = numberMarker
    this.isSelected.value = isSelected
    this.isLoading.value = isLoading
  }
}
