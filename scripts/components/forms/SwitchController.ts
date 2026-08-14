export class SwitchController {
  emitEvents: any | null = null
  booleanValue = ref<boolean>(false)

  constructor(booleanValue: boolean, emitEvents: any | null) {
    this.booleanValue.value = booleanValue
    this.emitEvents = emitEvents
  }

  onClick(): void {
    this.emitEvents("switchUpdate", this.booleanValue.value)
  }
}
