import { CompanyConstants } from "../constants/Company"
import { CtcConstants, DeliveryConstants, PaymentConstants } from "../constants/Payment"
import { BillingInfo } from "../models/BillingInfo"
import { CompanyDocumentRequest } from "../models/CompanyDocumentRequest"
import { CompanyDocumentRequestItem } from "../models/CompanyDocumentRequestItem"
import type { PaymentCart } from "../models/PaymentCart"
import { PaymentCartItem } from "../models/PaymentCartItem"
import { ServicePricing } from "../models/ServicePricing"
import { ServicePricingMandatory } from "../models/ServicePricingMandatory"
import type { ServicePricingOptional } from "../models/ServicePricingOptional"
import { CurrentUser } from "../utils/CurrentUser"
import { PaymentUtil } from "../utils/Payment"
import { Error } from "./Error"

export class DocumentPurchaser {
  companyId: string = ""
  latestStatutoryDocumentServicePricingId: string = "6208a9e6-22b6-4468-b24b-b9af01088edd" // default
  ctcAndEmailPricingId: string = "6b0750b7-88f9-43f0-82bf-72a03ead9287"
  myDataDocumentPricingId: string = "a5781872-a615-4004-b3fd-5bf85762f980"
  myDataServiceFeePricingId: string = "0ba404d3-352d-4029-b632-7f0de33f6bce"

  documentRequest: CompanyDocumentRequest = new CompanyDocumentRequest()
  documentRequestItems: CompanyDocumentRequestItem[] = []

  repository = useCompanyDocumentRequestStore()
  target: string = CompanyConstants.TARGET_DOCUMENT_REQUEST

  isPurchasing: boolean = false
  isCtcRequired: boolean = false
  isSSMCtcRequired: boolean = false
  isPriority: boolean = false
  deliveryMethod: string = ""

  totalPages: number = 1

  constructor(companyId: string) {
    this.companyId = companyId
  }

  prepareForPurchase(): void {
    if (this.isPurchasing) {
      return
    }

    this.documentRequest = new CompanyDocumentRequest()
    this.documentRequest.companyId = this.companyId
    this.documentRequest.isCtcRequired = this.isCtcRequired
    this.documentRequest.isSsmCtcRequired = this.isSSMCtcRequired
    this.documentRequest.isPriority = this.isPriority
    this.documentRequest.deliveryMethod = this.deliveryMethod
    this.documentRequest.items = this.documentRequestItems.map((dri: CompanyDocumentRequestItem) => {
      return new CompanyDocumentRequestItem(dri)
    })
  }

  setItems(documentRequestItems: CompanyDocumentRequestItem[]): void {
    this.documentRequestItems = documentRequestItems.map((dri: CompanyDocumentRequestItem) => {
      return new CompanyDocumentRequestItem(dri)
    })
  }

  async addToPaymentCart(): Promise<PaymentCart> {
    let billingInfo = new BillingInfo()
    let currentUser = await CurrentUser.get()
    billingInfo.name = currentUser.name
    billingInfo.email = currentUser.email
    billingInfo.phone = currentUser.phone

    let address = currentUser.detail?.location
    billingInfo.addressLine1 = address?.addressLine1 ?? "Address Line 1"
    billingInfo.addressLine2 = address?.addressLine2 ?? "Address Line 2"
    billingInfo.addressPostcode = address?.postcode ?? "40400"
    billingInfo.addressCity = address?.city?.name ?? "Shah Alam"
    billingInfo.addressState = address?.state?.name ?? "Selangor"
    billingInfo.addressCountry = address?.country?.name ?? "Malaysia"

    let paymentCart = await PaymentUtil.getCart(
      this.companyId,
      PaymentConstants.PAYMENT_CART_ENTITY_TYPE_COMPANY,
      billingInfo,
      this.target,
      this.documentRequest.id
    )

    let pricingId = this.latestStatutoryDocumentServicePricingId
    if (this.isCtcRequired && this.deliveryMethod === DeliveryConstants.DELIVERY_EMAIL) {
      pricingId = this.ctcAndEmailPricingId
    }

    let servicePricingRepository = useServicePricingStore()
    let response = await servicePricingRepository.fetch(pricingId)
    let servicePricing = new ServicePricing(response)

    let newPaymentCartItem = new PaymentCartItem()
    newPaymentCartItem.paymentCartId = paymentCart.id
    newPaymentCartItem.servicePricingId = this.latestStatutoryDocumentServicePricingId
    newPaymentCartItem.servicePricing = servicePricing
    newPaymentCartItem.targetType = this.target
    newPaymentCartItem.targetId = this.documentRequest.id
    newPaymentCartItem.isCtcRequired = this.isCtcRequired || this.isSSMCtcRequired
    newPaymentCartItem.ctcBy =
      this.isCtcRequired || this.isSSMCtcRequired
        ? this.isSSMCtcRequired
          ? CtcConstants.CTC_TYPE_SSM
          : CtcConstants.CTC_TYPE_COSEC
        : CtcConstants.CTC_TYPE_NONE
    newPaymentCartItem.ctcType = CtcConstants.CTC_OPTION_PAGE
    newPaymentCartItem.ctcCopies = CtcConstants.CTC_COPIES_SINGLE
    newPaymentCartItem.isDeliveryRequired = true
    newPaymentCartItem.deliveryType = this.deliveryMethod
    newPaymentCartItem.numberOfPages = this.totalPages
    newPaymentCartItem.selectedDocumentNames = this.documentRequestItems.map((d: CompanyDocumentRequestItem) => {
      return d.documentName
    })

    let additionalServicePricingIds: string[] = []
    let isMyDataServiceFeeRequired = this.documentRequestItems.some((item: CompanyDocumentRequestItem) => {
      return item.isPurchasableViaApi
    })

    for (let item of this.documentRequestItems) {
      if (item.isPurchasableViaApi) {
        additionalServicePricingIds.push(this.myDataDocumentPricingId)
      }
    }

    if (isMyDataServiceFeeRequired) {
      additionalServicePricingIds.push(this.myDataServiceFeePricingId)
    }

    let additionalServicePricings: ServicePricing[] = []
    if (additionalServicePricingIds.length > 0) {
      for (let id of additionalServicePricingIds) {
        let response = await servicePricingRepository.fetch(id)
        additionalServicePricings.push(new ServicePricing(response))
      }

      newPaymentCartItem.additionalServicePricings = additionalServicePricings.map((asp: ServicePricing) => {
        return new ServicePricing(asp)
      })

      newPaymentCartItem.additionalServicePricingIds = [...additionalServicePricingIds]
    }

    newPaymentCartItem.setCtcAmount()
    newPaymentCartItem.isDisableCtcSelection = this.isCtcRequired || this.isSSMCtcRequired
    newPaymentCartItem.showTotalPagesToCtc = this.isCtcRequired || this.isSSMCtcRequired
    newPaymentCartItem.isDisableDeliverySelection = true // delivery already set
    newPaymentCartItem.setSubtotal()
    paymentCart.items.push(newPaymentCartItem)

    servicePricing.optionals.forEach((opt: ServicePricingOptional) => {
      if (opt.optionalServiceId !== "09268b9e-bac3-400d-8272-602b1ba5e375") {
        return
      }
      // Paper prints
      if (
        this.isCtcRequired ||
        this.isSSMCtcRequired ||
        (this.deliveryMethod !== "email" && this.deliveryMethod !== "whatsapp")
      ) {
        newPaymentCartItem.selectedOptionals.push(opt)
      }

      opt.optionalServicePrice.mandatoryServices = this.documentRequestItems.map((d: CompanyDocumentRequestItem) => {
        let newMandatory = new ServicePricingMandatory()
        newMandatory.mandatoryServicePrice = new ServicePricing()
        newMandatory.mandatoryServicePrice.serviceName = d.documentName

        return newMandatory
      })
    })

    const url = new URL(window.location.href)
    url.searchParams.set("payment.redirect", "true")
    url.searchParams.set("payment.target", this.target)
    url.searchParams.set("payment.id", this.documentRequest.id ?? "")
    paymentCart.redirectUrl = url.toString()

    return paymentCart
  }

  async purchase(): Promise<PaymentCart | null> {
    if (this.isPurchasing) {
      return null
    }

    this.prepareForPurchase()

    try {
      this.isPurchasing = true
      await this.documentRequest.create(this.repository)
      let paymentCart = await this.addToPaymentCart()

      return paymentCart
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error("", "")
        errorMessage.setForMakePayment()
        errorMessage.handle()
      }
      return null
    } finally {
      this.isPurchasing = false
    }
  }
}
