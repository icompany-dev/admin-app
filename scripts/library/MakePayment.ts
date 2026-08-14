import { PaymentConstants } from "../constants/Payment"
import { SwitchConstants } from "../constants/Switches"
import type { ApplicationIncorporate } from "../models/ApplicationIncorporate"
import type { ApplicationSwitch } from "../models/ApplicationSwitch"
import { BillingInfo } from "../models/BillingInfo"
import { Company } from "../models/Company"
import type { CompanyOutstanding } from "../models/CompanyOutstanding"
import { PaymentCart } from "../models/PaymentCart"
import { PaymentCartItem } from "../models/PaymentCartItem"
import { PaymentCartItemOptional } from "../models/PaymentCartItemOptional"
import { ServicePricing } from "../models/ServicePricing"
import { ServicePricingBreakdown } from "../models/ServicePricingBreakdown"
import { ServicePricingMandatory } from "../models/ServicePricingMandatory"
import { ServicePricingOptional } from "../models/ServicePricingOptional"
import { User } from "../models/User"
import { CurrentUser } from "../utils/CurrentUser"
import { PaymentUtil } from "../utils/Payment"
import { StringUtil } from "../utils/String"
import { Error } from "./Error"

export class MakePayment {
  entityType: string = ""
  entityId: string = ""
  target: string = ""
  targetId: string = ""

  isMakingPayment: boolean = false

  user: User = new User()
  billingInfo: BillingInfo = new BillingInfo()

  paymentCart: PaymentCart = new PaymentCart()

  constructor(entityType: string, entityId: string, target: string, targetId: string) {
    this.entityType = entityType
    this.entityId = entityId
    this.target = target
    this.targetId = targetId
  }

  async setPaymentCart(): Promise<void> {
    if (this.isMakingPayment) {
      return
    }

    try {
      this.isMakingPayment = true
      this.user = await CurrentUser.get()

      if (this.entityType === PaymentConstants.PAYMENT_CART_ENTITY_TYPE_COMPANY) {
        await this.setCompanyBillingInfo()
      } else {
        this.setUserBillingInfo()
      }

      this.paymentCart = await PaymentUtil.getCart(
        this.entityId,
        this.entityType,
        this.billingInfo,
        this.target,
        this.targetId
      )

      const url = new URL(window.location.href)
      url.searchParams.set("payment.redirect", "true")
      url.searchParams.set("payment.target", this.target)
      url.searchParams.set("payment.id", this.targetId)

      this.paymentCart.redirectUrl = url.toString()
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error("", "")
        errorMessage.setForMakePayment()
        errorMessage.handle()
      }
      this.paymentCart = new PaymentCart()
    } finally {
      this.isMakingPayment = false
    }
  }

  async setCompanyBillingInfo(): Promise<void> {
    if (this.entityType !== PaymentConstants.PAYMENT_CART_ENTITY_TYPE_COMPANY) {
      return
    }

    let companyRepository = useCompanyStore()
    let response = await companyRepository.fetch(this.entityId)
    if (companyRepository.error !== null || !response) {
      let errorMessage: Error = new Error("", "")
      errorMessage.setForMakePayment()
    }

    let company = new Company(response)
    this.billingInfo = new BillingInfo(company.billingInfo())
    this.billingInfo.email = this.user.email
    this.billingInfo.phone = this.user.phone
  }

  setUserBillingInfo(): void {
    this.billingInfo = new BillingInfo(this.user.billingInfo())
  }

  async setForOutstanding(companyOutstanding: CompanyOutstanding): Promise<void> {
    ///
    if (this.isMakingPayment) {
      return
    }

    try {
      this.isMakingPayment = true
      this.user = await CurrentUser.get()

      if (this.entityType === PaymentConstants.PAYMENT_CART_ENTITY_TYPE_COMPANY) {
        await this.setCompanyBillingInfo()
      } else {
        this.setUserBillingInfo()
      }

      this.paymentCart = await PaymentUtil.getCart(
        this.entityId,
        this.entityType,
        this.billingInfo,
        this.target,
        this.targetId
      )

      let paymentCartItem = this.paymentCart.items.find((item: PaymentCartItem) => {
        return item.targetType === this.target && item.targetId === this.targetId
      })
      if (paymentCartItem) {
        let breakdown = new ServicePricingBreakdown()
        breakdown.itemName = companyOutstanding.description
        breakdown.price = companyOutstanding.amount
        paymentCartItem.servicePricing.breakdowns.push(breakdown)
      }

      const url = new URL(window.location.href)
      url.searchParams.set("payment.redirect", "true")
      url.searchParams.set("payment.target", this.target)
      url.searchParams.set("payment.id", this.targetId)

      this.paymentCart.redirectUrl = url.toString()
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error("", "")
        errorMessage.setForMakePayment()
        errorMessage.handle()
      }
      this.paymentCart = new PaymentCart()
    } finally {
      this.isMakingPayment = false
    }
  }

  async setForSwitch(applicationSwitch: ApplicationSwitch): Promise<void> {
    if (this.isMakingPayment) {
      return
    }

    try {
      this.isMakingPayment = true
      this.user = await CurrentUser.get()
      this.setUserBillingInfo()

      this.paymentCart = await PaymentUtil.getCart(
        this.entityId,
        this.entityType,
        this.billingInfo,
        this.target,
        this.targetId
      )

      let servicePricingRepository = useServicePricingStore()
      if (applicationSwitch.switchType !== SwitchConstants.TYPE_SETTLE) {
        let servicePricingId = ""
        if (applicationSwitch.switchType === SwitchConstants.TYPE_VACATED) {
          servicePricingId = "6a389d4a-7c0c-4d4c-af3e-25645da3462b"
        } else if (applicationSwitch.switchType === SwitchConstants.TYPE_SELF_SERVICE) {
          servicePricingId = "ffd1d656-72cd-4695-9ba0-97f808721854"
        }

        if (!StringUtil.isNullOrEmpty(servicePricingId)) {
          let servicePricingResponse = await servicePricingRepository.fetch(servicePricingId)
          if (servicePricingResponse) {
            let servicePricing = new ServicePricing(servicePricingResponse)
            this.paymentCart.items.forEach((item: PaymentCartItem) => {
              if (item.targetId !== applicationSwitch.id || item.targetType !== this.target) {
                return
              }

              item.servicePricingId = servicePricingId
              item.servicePricing = new ServicePricing(servicePricing)
            })
          }
        }
      }

      let paymentCartItem = this.paymentCart.items.find((pci: PaymentCartItem) => {
        return pci.targetType === this.target && pci.targetId === applicationSwitch.id
      })

      if (paymentCartItem) {
        let promises = paymentCartItem.servicePricing.optionals.map((opt: ServicePricingOptional) => {
          if (opt.optionalServiceId === null) {
            return null
          }

          return servicePricingRepository.fetch(opt.optionalServiceId)
        })
        await Promise.all(promises).then((result) => {
          if (!paymentCartItem) {
            return
          }

          let paymentCartItemOptionals: PaymentCartItemOptional[] = []
          let optionals: ServicePricingOptional[] = []
          paymentCartItem.servicePricing.optionals.forEach((opt: ServicePricingOptional) => {
            let servicePricing = result.find((response: any) => {
              return response !== null && response.id === opt.optionalServiceId
            })

            if (!servicePricing) {
              return
            }

            servicePricing.baseGrandTotal = servicePricing.baseGrandTotal + servicePricing.config.handlingFees // add handling fees together

            opt.optionalServicePrice = new ServicePricing(servicePricing)

            let clonedOptional = new ServicePricingOptional(opt)
            optionals.push(clonedOptional)

            let newPaymentCartItemOptional = new PaymentCartItemOptional()
            newPaymentCartItemOptional.servicePricing = new ServicePricing(clonedOptional.optionalServicePrice)
            newPaymentCartItemOptional.servicePricingId = clonedOptional.optionalServiceId ?? ""
            paymentCartItemOptionals.push(newPaymentCartItemOptional)
          })

          paymentCartItem.optionals = paymentCartItemOptionals.map((pcio: PaymentCartItemOptional) => {
            return new PaymentCartItemOptional(pcio)
          })

          paymentCartItem.servicePricing.optionals = optionals.map((opt: ServicePricingOptional) => {
            return new ServicePricingOptional(opt)
          })

          paymentCartItem.selectedOptionals = optionals.map((opt: ServicePricingOptional) => {
            return new ServicePricingOptional(opt)
          })
        })
      }

      const url = new URL(window.location.href)
      url.searchParams.set("payment.redirect", "true")
      url.searchParams.set("payment.target", this.target)
      url.searchParams.set("payment.id", this.targetId)

      this.paymentCart.redirectUrl = url.toString()
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error("", "")
        errorMessage.setForMakePayment()
        errorMessage.handle()
      }
      this.paymentCart = new PaymentCart()
    } finally {
      this.isMakingPayment = false
    }
  }

  async setForIncorporation(
    applicationIncorporate: ApplicationIncorporate,
    numberOfDirectors: number,
    numberOfShareholders: number
  ): Promise<void> {
    if (this.isMakingPayment) {
      return
    }

    try {
      this.isMakingPayment = true
      this.user = await CurrentUser.get()
      this.setUserBillingInfo()

      this.paymentCart = await PaymentUtil.getCart(
        this.entityId,
        this.entityType,
        this.billingInfo,
        this.target,
        this.targetId
      )

      let servicePricingRepository = useServicePricingStore()
      let additionalDirectorPricingId = "b227e7e2-cf54-4d8e-895e-b112db3b1c2c"
      let additionalMemberPricingId = "30585b63-35d5-4d40-a94c-0d4f70a5a0a9"
      let useOfBusinessAddressPricingId = "6b3ed77b-18f9-4e9d-bb81-a23a42c34a6b"
      let additionalDirectorPricing = new ServicePricing()
      let additionalMemberPricing = new ServicePricing()
      let useOfBusinessAddressPricing = new ServicePricing()
      let promises = [
        servicePricingRepository.fetch(additionalDirectorPricingId).then((response) => {
          additionalDirectorPricing = new ServicePricing(response)
        }),
        servicePricingRepository.fetch(additionalMemberPricingId).then((response) => {
          additionalMemberPricing = new ServicePricing(response)
        }),
        servicePricingRepository.fetch(useOfBusinessAddressPricingId).then((response) => {
          useOfBusinessAddressPricing = new ServicePricing(response)
        }),
      ]
      await Promise.all(promises)

      let paymentCartItem = this.paymentCart.items.find((pci: PaymentCartItem) => {
        return pci.targetType === this.target && pci.targetId === applicationIncorporate.id
      })

      if (paymentCartItem) {
        if (numberOfDirectors > 3) {
          let additionalDirectors = numberOfDirectors - 3
          let servicePricingMandatory = new ServicePricingMandatory()
          servicePricingMandatory.servicePricingId = paymentCartItem.servicePricingId
          servicePricingMandatory.mandatoryServiceId = additionalDirectorPricingId
          servicePricingMandatory.mandatoryServicePrice = new ServicePricing(additionalDirectorPricing)
          servicePricingMandatory.basePrice = additionalDirectorPricing.baseGrandTotal * additionalDirectors
          paymentCartItem.servicePricing.mandatoryServices.push(servicePricingMandatory)
        }

        if (numberOfShareholders > 3) {
          let additionalMembers = numberOfShareholders - 3
          let servicePricingMandatory = new ServicePricingMandatory()
          servicePricingMandatory.servicePricingId = paymentCartItem.servicePricingId
          servicePricingMandatory.mandatoryServiceId = additionalMemberPricingId
          servicePricingMandatory.mandatoryServicePrice = new ServicePricing(additionalMemberPricing)
          servicePricingMandatory.basePrice = additionalMemberPricing.baseGrandTotal * additionalMembers
          paymentCartItem.servicePricing.mandatoryServices.push(servicePricingMandatory)
        }

        let promises = paymentCartItem.servicePricing.optionals.map((opt: ServicePricingOptional) => {
          if (opt.optionalServiceId === null) {
            return null
          }

          return servicePricingRepository.fetch(opt.optionalServiceId)
        })
        await Promise.all(promises).then((result) => {
          if (!paymentCartItem) {
            return
          }

          let paymentCartItemOptionals: PaymentCartItemOptional[] = []
          let optionals: ServicePricingOptional[] = []
          let selectedOptionals: ServicePricingOptional[] = []

          paymentCartItem.servicePricing.optionals.forEach((opt: ServicePricingOptional) => {
            let servicePricing = result.find((response: any) => {
              return response !== null && response.id === opt.optionalServiceId
            })

            if (!servicePricing) {
              return
            }

            opt.optionalServicePrice = new ServicePricing(servicePricing)

            let clonedOptional = new ServicePricingOptional(opt)
            optionals.push(clonedOptional)

            if (!applicationIncorporate.hasBusinessAddress && servicePricing.id === useOfBusinessAddressPricingId) {
              selectedOptionals.push(clonedOptional)

              let newPaymentCartItemOptional = new PaymentCartItemOptional()
              newPaymentCartItemOptional.servicePricing = new ServicePricing(clonedOptional.optionalServicePrice)
              newPaymentCartItemOptional.servicePricingId = clonedOptional.optionalServiceId ?? ""
              paymentCartItemOptionals.push(newPaymentCartItemOptional)
            }
          })

          paymentCartItem.optionals = paymentCartItemOptionals.map((pcio: PaymentCartItemOptional) => {
            return new PaymentCartItemOptional(pcio)
          })

          paymentCartItem.servicePricing.optionals = optionals.map((opt: ServicePricingOptional) => {
            return new ServicePricingOptional(opt)
          })

          paymentCartItem.selectedOptionals = selectedOptionals.map((opt: ServicePricingOptional) => {
            return new ServicePricingOptional(opt)
          })
        })
      }

      const url = new URL(window.location.href)
      url.searchParams.set("payment.redirect", "true")
      url.searchParams.set("payment.target", this.target)
      url.searchParams.set("payment.id", this.targetId)

      this.paymentCart.redirectUrl = url.toString()
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error("", "")
        errorMessage.setForMakePayment()
        errorMessage.handle()
      }
      this.paymentCart = new PaymentCart()
    } finally {
      this.isMakingPayment = false
    }
  }
}
