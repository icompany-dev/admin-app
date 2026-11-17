export abstract class BaseDrawerController {
  isShowing: Ref<boolean> = ref<boolean>(false)

  emitEvents: any | null = null

  language = useLanguage()

  constructor(emitEvents: any | null) {
    this.emitEvents = emitEvents
  }

  show(): void {
    this.isShowing.value = true
  }

  hide(): void {
    this.isShowing.value = false
  }

  abstract resetValues(): void
  abstract setDataFromProps(data: any): void

  onCancelClicked(): void {
    this.resetValues()
    this.hide()
  }

  abstract onProceedClicked(): Promise<void>

  abstract get drawerTitle(): string

  get cta(): string {
    return this.language.isMalay() ? "Ingin teruskan?" : "Would you like to continue?"
  }

  get proceedLabel(): string {
    return this.language.isMalay() ? "Teruskan" : "Proceed"
  }

  get cancelLabel(): string {
    return this.language.isMalay() ? "Batal" : "Cancel"
  }
}
