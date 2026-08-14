import { CurrentUser } from "../utils/CurrentUser"
import { ColorModeUtil } from "../utils/ColorMode"
import { Filter } from "../library/Filter"
import { PaymentOrder } from "../models/PaymentOrder"
import { PaymentOrderItem } from "../models/PaymentOrderItem"
import { StringUtil } from "../utils/String"
import { Toast } from "../library/Toast"

export class LayoutController {
  onboardingWelcomeRef: any | null = null

  pageContentRef: any | null = null
  isOverlap: Ref<boolean> = ref<boolean>(false)

  isSidebarCollapsed: Ref<boolean> = ref<boolean>(false)

  isCheckingPayment: Ref<boolean> = ref<boolean>(false)
  lastDateAnnounced: Ref<string> = ref<string>("")

  isDragging: Ref<boolean> = ref<boolean>(false)
  lastY: Ref<number> = ref<number>(0)
  deltaY: Ref<number> = ref<number>(0)

  language = useLanguage()
  eventManager = useEventManagerStore()

  constructor() {
    this.initTheme()
    this.fetchPaymentReceived()
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

  async fetchPaymentReceived(): Promise<void> {
    if (this.isCheckingPayment.value) {
      return
    }

    try {
      this.isCheckingPayment.value = true

      let dayjs = useDayjs()
      let filter = new Filter()
      filter.isIncludeMinutes = true
      filter.startDate = dayjs().subtract(8, "hours").subtract(5, "minute").format("YYYY-MM-DD HH:mm:ss")

      let repository = useAnalyticsStore()
      let response = await repository.fetchPaymentSince(filter)

      let paymentToInform = response.data
        .map((d: any) => {
          return new PaymentOrder(d)
        })
        .filter((po: PaymentOrder) => {
          return dayjs(po.paidAt).isAfter(dayjs(filter.startDate))
        })

      if (paymentToInform.length > 0) {
        // play audio
        let kachingAudio = new Audio("/sounds/kaching-sound.mp3")
        kachingAudio.currentTime = 0
        kachingAudio.play()
      }

      paymentToInform.forEach((po: PaymentOrder) => {
        let paymentForFragments = po.items.map((poi: PaymentOrderItem) => {
          return poi.serviceName
        })
        let paymentFor = StringUtil.oxfordJoin("&", paymentForFragments)

        let toastTitle = this.language.isMalay()
          ? `Bayaran sejumlah RM${po.total} diterima dari ${po.billingInfo.name}`
          : `Payment Received of RM${po.total} from ${po.billingInfo.name}`
        let toastMessage = this.language.isMalay() ? `Bayaran Untuk: ${paymentFor}` : `Payment For: ${paymentFor}`

        let toast = new Toast(toastTitle, toastMessage)
        toast.success()
      })
    } catch (e) {
      console.error(e)
    } finally {
      this.isCheckingPayment.value = false

      let timeoutTimer = 1000 * 60
      setTimeout(() => {
        this.fetchPaymentReceived()
      }, timeoutTimer)
    }
  }
}
