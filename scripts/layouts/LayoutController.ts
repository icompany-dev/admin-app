import { CurrentUser } from "../utils/CurrentUser"
import { ColorModeUtil } from "../utils/ColorMode"

export class LayoutController {
  onboardingWelcomeRef: any | null = null

  pageContentRef: any | null = null
  isOverlap: Ref<boolean> = ref<boolean>(false)

  isSidebarCollapsed: Ref<boolean> = ref<boolean>(false)

  isDragging: Ref<boolean> = ref<boolean>(false)
  lastY: Ref<number> = ref<number>(0)
  deltaY: Ref<number> = ref<number>(0)

  eventManager = useEventManagerStore()

  constructor() {
    this.initTheme()
    window.addEventListener("wheel", this.onScrolling.bind(this))
    window.addEventListener("scroll", this.onScrolling.bind(this))
  }

  async initTheme(): Promise<void> {
    const user = await CurrentUser.get()
    ColorModeUtil.initializeTheme(user)
  }

  setOnboardingWelcomeRef(onboardingWelcomeRef: any): void {
    this.onboardingWelcomeRef = onboardingWelcomeRef
  }

  setPageContentRef(ref: any | null): void {
    this.pageContentRef = ref
  }

  onEkycSuccess(): void {
    if (!this.onboardingWelcomeRef) {
      return
    }
    this.onboardingWelcomeRef.show()
  }

  handleEventManagerChanges(): void {
    if (this.eventManager.isShowWelcomeAfterEKYC) {
      if (this.onboardingWelcomeRef) {
        this.onboardingWelcomeRef.show()
        this.eventManager.setIsShowWelcomeAfterEKYC(false)
      }
    }
  }

  updateIsOverlap(): void {
    if (this.eventManager.isDocumentActive) {
      this.isOverlap.value = this.deltaY.value > 0
      return
    }

    let isPageTop = true

    if (this.pageContentRef) {
      const pageContentRect = this.pageContentRef.getBoundingClientRect()
      const pageTop = pageContentRect.top
      isPageTop = pageTop > 0
    }

    this.isOverlap.value = !isPageTop
  }

  onScrolling(event: WheelEvent | Event): void {
    if (event instanceof WheelEvent) {
      this.deltaY.value = event.deltaY
      this.updateIsOverlap()
    } else if (event instanceof Event) {
      const currentScrollY = window.scrollY
      this.deltaY.value = currentScrollY - this.lastY.value
      this.lastY.value = currentScrollY
      this.updateIsOverlap()
    }
  }

  startDrag(event: TouchEvent) {
    if (this.isDragging.value) {
      return
    }

    this.isDragging.value = true
    this.lastY.value = event.touches[0].clientY
  }

  onDrag(event: TouchEvent | any): void {
    const yPosition = event.touches[0].clientY
    this.deltaY.value = this.lastY.value - yPosition
    this.lastY.value = yPosition
    this.updateIsOverlap()
  }

  stopDrag(): void {
    this.isDragging.value = false
  }

  isDisableScrolling(): boolean {
    return this.eventManager.isPopupShowing || this.eventManager.isDisablePage
  }

  onSidebarCollapsed(): void {
    this.isSidebarCollapsed.value = true
  }

  onSidebarExpanded(): void {
    this.isSidebarCollapsed.value = false
  }
}
