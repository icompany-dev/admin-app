import { CompanyConstants } from "~/scripts/constants/Company"
import { Error } from "~/scripts/library/Error"
import { ApplicationIncorporate } from "~/scripts/models/ApplicationIncorporate"
import { PaymentOrder } from "~/scripts/models/PaymentOrder"
import { PropsIncorporationApplication } from "~/scripts/props/PropsIncorporationApplication"
import { StringUtil } from "~/scripts/utils/String"
import { PropsServiceApplication } from "~/scripts/props/PropsServiceApplication"
import { PropsShipApplication } from "~/scripts/props/PropsShipApplication"

/**
 * THINGS THEY WANT TO KNOW
 * 1. Payment
 * 2. Section 201
 * 3. Names proposed
 * 4. Directors
 * 5. Shareholders
 * 6. Upload documents for each stage
 * 7. Name rejected
 * 8. Complete incorporation
 */

export class ApplicationController {
  applicationId: Ref<string> = ref<string>("")
  application: Ref<ApplicationIncorporate> = ref<ApplicationIncorporate>(new ApplicationIncorporate())

  paymentOrderId: Ref<string> = ref<string>("")
  paymentOrder: Ref<PaymentOrder> = ref<PaymentOrder>(new PaymentOrder())

  emitEvents: any | null = null

  language = useLanguage()

  isLoading: Ref<boolean> = ref<boolean>(false)

  constructor(props: PropsIncorporationApplication, emitEvents: any) {
    this.setDataFromProps(props)
    this.emitEvents = emitEvents
  }

  async setDataFromProps(props: PropsIncorporationApplication): Promise<void> {
    this.applicationId.value = props.applicationId
    await this.init()
  }

  async init(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.applicationId.value)) {
      let error = new Error()
      error.title = this.language.isMalay() ? "ID Permohonan Tiada" : "No Application ID found"
      error.message = this.language.isMalay()
        ? "Anda akan dibawa ke laman utama"
        : "You will be redirected to the main page."
      error.promptWarning()

      this.emitEvents("back")
      return
    }

    if (this.isLoading.value) {
      return
    }

    try {
      this.isLoading.value = true

      await Promise.allSettled([this.fetchApplication(), this.fetchPaymentOrder()])

      this.application.value.paidAt = this.paymentOrder.value.paidAt
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.setForFetch()
        error.handle()
      }
    } finally {
      this.isLoading.value = false
    }
  }

  async fetchApplication(): Promise<void> {
    let repository = useApplicationIncorporateStore()
    let response = await repository.fetch(this.applicationId.value)

    if (repository.error !== null) {
      throw repository.error
    }

    this.application.value = new ApplicationIncorporate(response)
  }

  async fetchPaymentOrder(): Promise<void> {
    let repository = usePaymentOrderStore()
    let response = await repository.fetchByTarget(
      CompanyConstants.TARGET_APPLICATION_INCORPORATE,
      this.applicationId.value
    )

    if (!response || repository.error !== null) {
      this.paymentOrderId.value = ""
      return
    }

    this.paymentOrder.value = new PaymentOrder(response)
    this.paymentOrderId.value = this.paymentOrder.value.id
  }

  // getters
  get serviceName(): string {
    return this.language.isMalay() ? "Pemerbadanan Sdn Bhd Baharu" : "Incorporation of New Sdn Bhd"
  }

  get isNameApproved(): boolean {
    return this.application.value.nameSelected !== null
  }

  get serviceApplicationProps(): PropsServiceApplication {
    let props = new PropsServiceApplication(this.serviceName, true, false)

    props.application = this.application.value

    return props
  }
}
