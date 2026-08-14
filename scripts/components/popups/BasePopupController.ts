import { EmitMessages } from "~/scripts/constants/EmitMessages"
import { PropsPopup } from "~/scripts/props/PropsPopup"

export abstract class BasePopupController {
  isCompliance: Ref<boolean> = ref<boolean>(false)
  hasCta: Ref<boolean> = ref<boolean>(true)
  hasActionButtons: Ref<boolean> = ref<boolean>(true)

  popupRef: any | null = null

  emitEvents: any | null = null

  language = useLanguage()

  constructor(emitEvents: any) {
    this.emitEvents = emitEvents
  }

  setPopupRef(popupRef: any): void {
    this.popupRef = popupRef
  }

  show(): void {
    if (!this.popupRef) {
      return
    }

    this.popupRef.show()
  }

  hide(): void {
    if (!this.popupRef) {
      return
    }

    this.popupRef.hide()
  }

  onCancelClicked(): void {
    this.hide()
    this.emitEvents(EmitMessages.BACK)
  }

  abstract onProceedClicked(): void

  abstract get title(): string
  abstract get heading(): string
  abstract get cta(): string

  get popupProps(): PropsPopup {
    return new PropsPopup(
      this.title,
      this.heading,
      this.cta,
      this.isCompliance.value,
      this.hasCta.value,
      this.hasActionButtons.value
    )
  }

  get cancelLabel(): string {
    return this.language.isMalay() ? "Batal" : "Cancel"
  }

  get proceedLabel(): string {
    return this.language.isMalay() ? "Teruskan" : "Proceed"
  }
}
