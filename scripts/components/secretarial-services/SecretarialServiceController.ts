import type { PropsSecretarialService } from "~/scripts/props/PropsSecretarialService"
import { PaymentOrder } from "~/scripts/models/PaymentOrder"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"

export abstract class SecretarialServiceController {
  companyId: Ref<string> = ref<string>("")
  applicationId: Ref<string> = ref<string>("")
  paymentOrderId: Ref<string> = ref<string>("")

  emitEvents: any | null = null

  language = useLanguage()

  isLoading: Ref<boolean> = ref<boolean>(false)

  abstract application: Ref<any | null>
  paymentOrder: Ref<PaymentOrder> = ref<PaymentOrder>(new PaymentOrder())

  constructor(props: PropsSecretarialService, emitEvents: any) {
    this.emitEvents = emitEvents

    this.setDataFromProps(props)
  }

  async setDataFromProps(props: PropsSecretarialService): Promise<void> {
    this.companyId.value = props.companyId
    this.applicationId.value = props.applicationId
    this.paymentOrderId.value = props.paymentOrderId

    await this.initializeService()
  }

  async initializeService(): Promise<void> {
    if (this.isLoading.value) {
      return
    }

    try {
      this.isLoading.value = true

      await Promise.allSettled([this.fetchApplication(), this.fetchPaymentOrder()])
    } catch (e) {
      if (e instanceof Error) {
        e.isMalay = this.language.isMalay()
        e.handle()
      } else {
        let error = new Error()
        error.isMalay = this.language.isMalay()
        error.setForFetch()
        error.handle()
      }
    } finally {
      this.isLoading.value = false
    }
  }

  abstract fetchApplication(): Promise<void>

  async fetchPaymentOrder(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.paymentOrderId.value)) {
      return
    }

    let repository = usePaymentOrderStore()
    let response = await repository.fetch(this.paymentOrderId.value)
    this.paymentOrder.value = new PaymentOrder(response)
  }
}
