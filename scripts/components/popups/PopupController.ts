import { EmitMessages } from "~/scripts/constants/EmitMessages"

export class PopupController {
  isShowing = ref<boolean>(false)

  eventManager = useEventManagerStore()

  emitEvents: any | null = null

  constructor(emitEvents: any | null) {
    this.emitEvents = emitEvents
  }

  show(): void {
    if (!this.eventManager.isCentreStageLoaded && !this.isShowing.value) {
      setTimeout(() => {
        this.show()
      }, 500)

      return
    }

    this.isShowing.value = true
    this.eventManager.setIsPopupShowing(true)
  }

  hide(): void {
    this.isShowing.value = false
    this.emitEvents(EmitMessages.BACK)
    setTimeout(() => {
      this.eventManager.setIsPopupShowing(false)
    }, 1000)
  }

  handleClickOutside(): void {
    this.hide()
  }

  handleKeyUp(event: KeyboardEvent): void {
    if (event.key === "Escape") {
      this.hide()
    }
  }

  getIsShowing(): boolean {
    return this.isShowing.value
  }
}
