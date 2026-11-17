import { Filter } from "~/scripts/library/Filter"
import { Toast } from "~/scripts/library/Toast"
import { PaymentNotice } from "~/scripts/models/PaymentNotice"
import { StringUtil } from "~/scripts/utils/String"

export class PaymentNoticesController {
  emitEvents: any | null = null

  companyId: Ref<string> = ref<string>("")
  paymentNotices: Ref<PaymentNotice[]> = ref<PaymentNotice[]>([])

  isLoading: Ref<boolean> = ref<boolean>(false)

  language = useLanguage()

  paymentNoticeToNotify: Ref<PaymentNotice> = ref<PaymentNotice>(new PaymentNotice())

  constructor(companyId: string, emitEvents: any) {
    this.emitEvents = emitEvents

    this.setCompanyId(companyId)
  }

  async setCompanyId(companyId: string): Promise<void> {
    this.companyId.value = companyId

    await this.fetchPaymentNotices()
  }

  async fetchPaymentNotices(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId.value) || this.isLoading.value) {
      return
    }

    this.isLoading.value = true
    this.paymentNotices.value = []
    try {
      let repository = usePaymentNoticeStore()
      let filter = new Filter()
      filter.companyId = this.companyId.value

      let response = await repository.fetchAll(filter)
      this.paymentNotices.value = response.data.map((d: any) => {
        return new PaymentNotice(d)
      })
    } catch (e) {
      //
    } finally {
      this.isLoading.value = false
    }
  }

  isNotifying(paymentNotice: PaymentNotice): boolean {
    return this.paymentNoticeToNotify.value.id === paymentNotice.id
  }

  async notify(paymentNotice: PaymentNotice): Promise<void> {
    if (this.isNotifying(paymentNotice)) {
      return
    }

    try {
      this.paymentNoticeToNotify.value = new PaymentNotice(paymentNotice)

      await paymentNotice.notify(usePaymentNoticeStore())

      let toastTitle = this.language.isMalay()
        ? "Pengarah telah diberitahu melalui email dan WhatsApp"
        : "Directors are notified via email and WhatsApp."
      let toast = new Toast(toastTitle, "")
      toast.success()
    } catch (e) {
    } finally {
      this.paymentNoticeToNotify.value = new PaymentNotice()
    }
  }

  get loaderLabel(): string {
    return this.language.isMalay() ? "Sedang Memaut" : "Retrieving All"
  }

  get loaderSublabel(): string {
    return this.language.isMalay() ? "Arahan Bayaran" : "Payment Orders"
  }
}
