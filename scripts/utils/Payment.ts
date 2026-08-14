import { usePaymentCartStore } from "#imports"
import { useServicePricingStore } from "#imports"
import { CompanyConstants } from "../constants/Company"
import { PaymentConstants } from "../constants/Payment"
import { Error } from "../library/Error"
import { ApplicationIncorporate } from "../models/ApplicationIncorporate"
import { BillingInfo } from "../models/BillingInfo"
import { PaymentCart } from "../models/PaymentCart"
import { PaymentCartItem } from "../models/PaymentCartItem"
import { ServicePricing } from "../models/ServicePricing"
import type { ServiceToPay } from "../models/ServiceToPay"
import { FirstBankAccountChecker } from "../library/FirstBankAccountChecker"
import { StringUtil } from "./String"

export class PaymentUtil {
  static async getCart(
    entityId: string,
    entityType: string,
    billingInfo: BillingInfo,
    targetType: string,
    targetId: string
  ): Promise<PaymentCart> {
    const paymentCartRepository = usePaymentCartStore()

    //1. Get existing
    let paymentCart: PaymentCart | null = await paymentCartRepository.fetchByEntity(entityId, entityType)

    if (!paymentCart || StringUtil.isNullOrEmpty(paymentCart.id)) {
      paymentCart = new PaymentCart()
      paymentCart.entityType = entityType
      paymentCart.entityId = entityId
      paymentCart.billingInfo = new BillingInfo(billingInfo)
    }

    if (!paymentCart.isItemInCart(targetType, targetId)) {
      let newPaymentCartItem = new PaymentCartItem()
      newPaymentCartItem.targetType = targetType
      newPaymentCartItem.targetId = targetId

      // get pricing
      let servicePricingRepository = useServicePricingStore()
      let servicePricing: ServicePricing | null = await servicePricingRepository.fetchDefault(targetType)
      if (!servicePricing || StringUtil.isNullOrEmpty(servicePricing.id)) {
        servicePricing = new ServicePricing()

        //TODO: we need a fallback plan for this. what happens when there is no price to charge?
      } else {
        newPaymentCartItem.servicePricingId = servicePricing.id
        newPaymentCartItem.servicePricing = new ServicePricing(servicePricing)
        paymentCart.items.push(newPaymentCartItem)
      }
    }

    if (StringUtil.isNullOrEmpty(paymentCart.id) && paymentCart.canSubmit()) {
      await paymentCart.create(paymentCartRepository)
    }

    return paymentCart
  }

  //Transition functions --> from Cart to Payment Cart
  static async getPaymentCartFromServiceToPay(serviceToPay: ServiceToPay): Promise<PaymentCart> {
    const paymentCartRepository = usePaymentCartStore()

    let entityType = ""
    let entityId = ""
    if (!StringUtil.isNullOrEmpty(serviceToPay.companyId)) {
      entityType = PaymentConstants.PAYMENT_CART_ENTITY_TYPE_COMPANY
      entityId = serviceToPay.companyId
    } else {
      entityType = serviceToPay.target //Incorp / switch
      entityId = serviceToPay.targetId
    }

    let paymentCart: PaymentCart | null = await paymentCartRepository.fetchByEntity(entityId, entityType)
    if (!paymentCart || StringUtil.isNullOrEmpty(paymentCart.id)) {
      paymentCart = new PaymentCart()
      paymentCart.entityType = entityType
      paymentCart.entityId = entityId
    }

    return paymentCart //This is possible to be empty
  }

  static async getPaymentCartItemFromServiceToPay(serviceToPay: ServiceToPay): Promise<PaymentCartItem> {
    const paymentCartRepository = usePaymentCartStore()

    let entityType = ""
    let entityId = ""
    if (!StringUtil.isNullOrEmpty(serviceToPay.companyId)) {
      entityType = PaymentConstants.PAYMENT_CART_ENTITY_TYPE_COMPANY
      entityId = serviceToPay.companyId
    } else {
      entityType = serviceToPay.target //Incorp / switch
      entityId = serviceToPay.targetId
    }

    let paymentCart: PaymentCart | null = await paymentCartRepository.fetchByEntity(entityId, entityType)
    if (!paymentCart || StringUtil.isNullOrEmpty(paymentCart.id)) {
      paymentCart = new PaymentCart()
      paymentCart.entityType = entityType
      paymentCart.entityId = entityId
    }

    let targetType = serviceToPay.target
    let targetId = serviceToPay.targetId
    let paymentCartItem: PaymentCartItem | undefined = paymentCart.items.find((item: PaymentCartItem) => {
      return item.targetType === targetType && item.targetId === targetId
    })

    if (!paymentCartItem) {
      paymentCartItem = new PaymentCartItem()
      paymentCartItem.targetType = targetType
      paymentCartItem.targetId = targetId

      let controledServicePricingId: string | null = null

      if (targetType === CompanyConstants.TARGET_OPEN_BANK_ACCOUNT) {
        const firstBankAccountChecker = new FirstBankAccountChecker(paymentCart.entityId ?? "")
        firstBankAccountChecker.init()

        if (firstBankAccountChecker.isFirst) {
          controledServicePricingId = "a5a4c1c9-bf27-4647-b27c-12a19a65a2de"
        }
      }

      let servicePricingRepository = useServicePricingStore()
      let servicePricing: ServicePricing | null = null
      if (!StringUtil.isNullOrEmpty(controledServicePricingId)) {
        servicePricing = await servicePricingRepository.fetch(controledServicePricingId ?? "")
      } else {
        servicePricing = await servicePricingRepository.fetchDefault(targetType)
      }
      if (servicePricing !== null) {
        paymentCartItem.servicePricingId = servicePricing.id
        paymentCartItem.servicePricing = new ServicePricing(servicePricing)
        if (paymentCartItem.servicePricing.optionals.length > 0) {
          for (let i = 0; i < paymentCartItem.servicePricing.optionals.length; i++) {
            let optionalServiceId = paymentCartItem.servicePricing.optionals[i].optionalServiceId
            if (!optionalServiceId) {
              continue
            }
            let optionalServicePrice: ServicePricing | null = await servicePricingRepository.fetch(optionalServiceId)
            if (!optionalServicePrice) {
              continue
            }

            paymentCartItem.servicePricing.optionals[i].optionalServicePrice = new ServicePricing(optionalServicePrice)
          }
        }
      }
    }

    return paymentCartItem
  }

  static async setEntityName(paymentCart: PaymentCart): Promise<void> {
    if (StringUtil.isNullOrEmpty(paymentCart.entityId)) {
      return
    }

    switch (paymentCart.entityType) {
      case PaymentConstants.PAYMENT_CART_ENTITY_TYPE_COMPANY:
        await this.setEntityNameForCompany(paymentCart)
        break
      case PaymentConstants.PAYMENT_CART_ENTITY_TYPE_APPLICATION_INCORPORATE:
        await this.setEntityNameForIncorp(paymentCart)
        break
      default:
        return
    }
  }

  static async setEntityNameForCompany(paymentCart: PaymentCart): Promise<void> {
    if (paymentCart.entityType !== PaymentConstants.PAYMENT_CART_ENTITY_TYPE_COMPANY || paymentCart.entityId === null) {
      return
    }

    const companyRepository = useCompanyStore()
    try {
      let company = await companyRepository.fetch(paymentCart.entityId)
      if (companyRepository.error !== null) {
        throw companyRepository.error
      }
      paymentCart.entityName = company?.name ?? "Company"
      paymentCart.entityName = paymentCart.entityName.toUpperCase()
      paymentCart.entityNameType = "SDN BHD" //TODO: get back to this when we handle more types
    } catch (error) {
      console.error(error)
      let errorMessage = new Error(Error.ERROR_TYPE_API, `Unable to set company name for ${paymentCart.entityId}`)
      errorMessage.handle()
    }
  }

  static async setEntityNameForIncorp(paymentCart: PaymentCart): Promise<void> {
    if (
      paymentCart.entityType !== PaymentConstants.PAYMENT_CART_ENTITY_TYPE_APPLICATION_INCORPORATE ||
      paymentCart.entityId === null
    ) {
      return
    }

    const applicationIncorporateRepository = useApplicationIncorporateStore()
    try {
      const response = await applicationIncorporateRepository.fetch(paymentCart.entityId)

      if (applicationIncorporateRepository.error !== null) {
        throw applicationIncorporateRepository.error
      }

      const applicationIncorporate = new ApplicationIncorporate(response)

      paymentCart.entityName = applicationIncorporate?.getName() ?? "New Company"
      paymentCart.entityName = paymentCart.entityName.toUpperCase()
    } catch (error) {
      console.error(error)
      let errorMessage = new Error(Error.ERROR_TYPE_API, `Unable to set name for ${paymentCart.entityId}`)
      errorMessage.handle()
    }
  }
}
