import { StringUtil } from "~/scripts/utils/String"
import { PaymentOrder } from "~/scripts/models/PaymentOrder"
import { PaymentUtil } from "~/scripts/utils/Payment"
import { PaymentCart } from "~/scripts/models/PaymentCart"
import { BillingInfo } from "~/scripts/models/BillingInfo"
import { CurrentUser } from "~/scripts/utils/CurrentUser"
import { PaymentConstants } from "~/scripts/constants/Payment"
import { ServiceController } from "./ServiceController"
import { CompanyConstants } from "~/scripts/constants/Company"

export class SubscriptionInvoiceController extends ServiceController {
  applicationId = ref<string>("")
  paymentOrderId = ref<string>("")
  paymentOrder = ref<PaymentOrder>(new PaymentOrder())
  paymentCart = ref<PaymentCart>(new PaymentCart())
  paymentOrderRepository = usePaymentOrderStore()
  isLoading = ref<boolean>(true)
  error = ref<string | null>(null)

  constructor(companyId: string, applicationId: string, emitEvents: any | null) {
    super(CompanyConstants.TARGET_SUBSCRIPTION, companyId, emitEvents)
    this.applicationId.value = applicationId

    this.initializeData()
  }

  async initializeData(): Promise<void> {
    this.isLoading.value = true
    this.error.value = null

    if (StringUtil.isNullOrEmpty(this.applicationId.value) || StringUtil.isNullOrEmpty(this.companyId)) {
      this.isLoading.value = false
      return
    }

    try {
      const currentUser = await CurrentUser.get()
      const billingInfo = new BillingInfo()
      billingInfo.name = currentUser.name
      billingInfo.email = currentUser.email
      billingInfo.phone = currentUser.phone

      if (currentUser.detail?.location) {
        const location = currentUser.detail.location
        billingInfo.addressLine1 = location.addressLine1 || "N/A"
        billingInfo.addressLine2 = location.addressLine2
        billingInfo.addressPostcode = location.postcode || "00000"
        billingInfo.addressCity = location.city?.name || null
        billingInfo.addressState = location.state?.name || "N/A"
        billingInfo.addressCountry = location.country?.name || "Malaysia"
      } else {
        billingInfo.addressLine1 = "N/A"
        billingInfo.addressPostcode = "00000"
        billingInfo.addressCity = "N/A"
        billingInfo.addressState = "N/A"
        billingInfo.addressCountry = "Malaysia"
      }

      this.paymentCart.value = await PaymentUtil.getCart(
        this.companyId,
        PaymentConstants.PAYMENT_CART_ENTITY_TYPE_COMPANY,
        billingInfo,
        "company_subscription",
        this.applicationId.value
      )

      await PaymentUtil.setEntityName(this.paymentCart.value)

      this.paymentCart.value.deliveryInfo.name = billingInfo.name
      this.paymentCart.value.deliveryInfo.email = billingInfo.email
      this.paymentCart.value.deliveryInfo.phone = billingInfo.phone
      this.paymentCart.value.deliveryInfo.addressLine1 = billingInfo.addressLine1
      this.paymentCart.value.deliveryInfo.addressLine2 = billingInfo.addressLine2
      this.paymentCart.value.deliveryInfo.addressPostcode = billingInfo.addressPostcode
      this.paymentCart.value.deliveryInfo.addressCity = billingInfo.addressCity
      this.paymentCart.value.deliveryInfo.addressState = billingInfo.addressState
      this.paymentCart.value.deliveryInfo.addressCountry = billingInfo.addressCountry

      const url = new URL(window.location.href)
      url.searchParams.set("payment.redirect", "true")
      url.searchParams.set("payment.target", "company_subscription")
      url.searchParams.set("payment.id", this.applicationId.value)

      this.paymentCart.value.redirectUrl = url.toString()

      const paymentCartRepository = usePaymentCartStore()
      if (StringUtil.isNullOrEmpty(this.paymentCart.value.id) && this.paymentCart.value.canSubmit()) {
        await this.paymentCart.value.create(paymentCartRepository)
      } else if (!StringUtil.isNullOrEmpty(this.paymentCart.value.id)) {
        await this.paymentCart.value.update(paymentCartRepository)
      }

      if (!StringUtil.isNullOrEmpty(this.paymentCart.value.id)) {
        let existingPaymentOrder = await this.paymentOrderRepository.fetchByCart(this.paymentCart.value.id)

        if (existingPaymentOrder && existingPaymentOrder.id) {
          this.paymentOrder.value = existingPaymentOrder
          this.paymentOrderId.value = existingPaymentOrder.id
        } else {
          let paymentOrder = new PaymentOrder()
          paymentOrder.paymentCartId = this.paymentCart.value.id
          await paymentOrder.create(this.paymentOrderRepository)

          if (paymentOrder.id) {
            this.paymentOrder.value = paymentOrder
            this.paymentOrderId.value = paymentOrder.id
          } else {
            console.error("Payment order creation returned no ID")
            this.error.value = "Failed to create payment order"
          }
        }
      } else {
        console.error("Cart has no ID after creation")
        this.error.value = "Failed to create cart"
      }
    } catch (error: any) {
      console.error("Error generating invoice:", error)
      this.error.value = error.message || "Failed to generate invoice"
    } finally {
      this.isLoading.value = false
    }
  }

  setCompanyId(companyId: string): void {
    this.companyId = companyId
  }

  async onSubmitClicked(): Promise<void> {
    // do nothing
  }

  async setApplicationId(applicationId: string): Promise<void> {
    this.applicationId.value = applicationId
    await this.initializeData()
  }

  onInvoiceClicked(): void {
    if (this.paymentCart.value && this.paymentCart.value.id) {
      this.emitEvents("openCart", this.paymentCart.value)
    }
  }
}
