import { CompanyConstants } from "~/scripts/constants/Company"

export class ServiceWrapperController {
  targetToShow = ref<string | null>(null)
  isShowing = ref<boolean>(false)
  emitEvents: any | null = null
  defaultDocumentTheme: string = ""

  eventManager = useEventManagerStore()

  constructor(targetToShow: string, emitEvents: any | null) {
    this.targetToShow.value = targetToShow
    this.emitEvents = emitEvents
  }

  onShow() {
    this.isShowing.value = true
  }

  hasDocumentToShow(): boolean {
    if (!this.targetToShow.value) {
      return false
    }

    return CompanyConstants.DOCUMENT_TARGETS.includes(this.targetToShow.value)
  }

  onMinimizeDocument(applicationData: any): void {
    this.isShowing.value = false
    this.emitEvents("minimize", applicationData)
  }

  onMakePayment(): void {
    this.isShowing.value = false
    this.emitEvents("makePayment")
  }

  showPreferenceShareRight(): boolean {
    return this.targetToShow.value === CompanyConstants.TARGET_PREFERENCE_SHARE_RIGHT
  }

  handleMouseClick(event: MouseEvent | TouchEvent): void {
    if (!this.isShowing.value || !event || !event.target) {
      return
    }

    if (this.eventManager.isPopupShowing) {
      return
    }

    const path = event.composedPath()

    const clickedInsidePaper = path.some((el) => {
      return el instanceof HTMLElement && el.classList.contains("paper")
    })

    const clickedInsideSignature = path.some((el) => {
      return el instanceof HTMLElement && el.classList.contains("enlarged-signature-container")
    })

    if (clickedInsidePaper || clickedInsideSignature) {
      return
    }

    this.onMinimizeDocument(null)
  }

  handleKeydown(event: KeyboardEvent): void {
    if (!this.isShowing.value) {
      return
    }

    if (event.key === "Escape") {
      this.onMinimizeDocument(null)
    }
  }

  onApplicationUpdated(data: any): void {
    this.emitEvents("applicationUpdated", data)
  }
}
