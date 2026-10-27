import { EmitMessages } from "~/scripts/constants/EmitMessages"

export class AddApplicationController {
  emitEvents: any | null = null

  isShow: Ref<boolean> = ref<boolean>(false)

  popupRef: any | null = null

  language = useLanguage()

  constructor(props: any, emitEvents: any) {
    this.emitEvents = emitEvents
  }

  setPopupRef(popupRef: any): void {
    this.popupRef = popupRef
  }

  onClick(): void {
    if (!this.popupRef) {
      return
    }

    this.popupRef.show()

    this.isShow.value = true
  }

  onBackClicked(): void {
    this.isShow.value = false
  }

  onProceed(): void {
    this.isShow.value = false
    this.emitEvents(EmitMessages.PROCEED)
  }

  get buttonLabel(): string {
    return this.language.isMalay() ? "Buat Baharu" : "Create New"
  }
}
