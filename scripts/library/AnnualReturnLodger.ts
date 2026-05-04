import { Error } from "~/scripts/library/Error"
import { Company } from "~/scripts/models/Company"
import { StringUtil } from "~/scripts/utils/String"
import type { PaymentCart } from "../models/PaymentCart"
import type { PaymentCartItem } from "../models/PaymentCartItem"
import { CompanyConstants } from "../constants/Company"
import { ServicePricing } from "../models/ServicePricing"
import { ControlledServicePricingId } from "../constants/Payment"
import { ServicePricingOptional } from "../models/ServicePricingOptional"
import type { ServicePricingMandatory } from "../models/ServicePricingMandatory"
import { PaymentCartItemOptional } from "../models/PaymentCartItemOptional"

export class AnnualReturnLodger {
  companyId: string = ""
  company: Company = new Company()

  yearToLodge: number = 0
  yearsDue: number[] = []

  outstandingServicePricing: ServicePricing = new ServicePricing()

  isPayingForOutstandings: boolean = false

  constructor(companyId: string) {
    this.companyId = companyId
  }

  async init(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId)) {
      return
    }

    await Promise.all([this.fetchCompany(), this.fetchDues(), this.fetchServicePricing()])
  }

  setYearToLodge(yearToLodge: number): void {
    this.yearToLodge = yearToLodge
  }

  async fetchCompany(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId)) {
      return
    }

    try {
      let repository = useCompanyStore()
      let response = await repository.fetch(this.companyId)
      if (repository.error !== null) {
        throw repository.error
      }

      this.company = new Company(response)
    } catch (e: any) {
      this.company = new Company()

      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error("", "")
        error.setForFetch()
        error.handle()
      }
    }
  }

  async fetchDues(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId)) {
      return
    }

    try {
      let repository = useCompanyAnnualReturnStore()
      let response = await repository.fetchDues(this.companyId)
      if (repository.error !== null) {
        throw repository.error
      }

      this.yearsDue = response.map((d: any) => {
        return d
      })
    } catch (error: any) {
      this.yearsDue = []
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage: Error = new Error("", "")
        errorMessage.setForFetchAll()
        errorMessage.handle()
      }
    }
  }

  async fetchServicePricing(): Promise<void> {
    try {
      let repository = useServicePricingStore()
      let response = await repository.fetch(ControlledServicePricingId.OutstandingAnnualReturn)
      if (repository.error !== null) {
        throw repository.error
      }

      this.outstandingServicePricing = new ServicePricing(response)
      this.outstandingServicePricing.serviceName = this.outstandingServicePricing.serviceName
        .toLowerCase()
        .replaceAll("(with outstanding)", "")
        .trim()
        .toUpperCase()
    } catch (error: any) {
      this.outstandingServicePricing = new ServicePricing()
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage: Error = new Error("", "")
        errorMessage.setForFetchAll()
        errorMessage.handle()
      }
    }
  }

  isLateLodgement(): boolean {
    let isYearDue = this.yearsDue.some((d: number) => {
      return d === this.yearToLodge
    })

    if (!isYearDue) {
      return false
    }

    let dayjs = useDayjs()
    let companyIncorporatedAt = dayjs(this.company.incorporatedAt)
    let anniversaryForYearToLodge = companyIncorporatedAt.year(this.yearToLodge)

    let lastPaymentDateForLodgement = anniversaryForYearToLodge.add(15, "days")

    return dayjs().isAfter(lastPaymentDateForLodgement)
  }

  numberOfMonthsLateBy(): number {
    if (!this.isLateLodgement()) {
      return 0
    }

    let dayjs = useDayjs()
    let companyIncorporatedAt = dayjs(this.company.incorporatedAt)
    let anniversaryForYearToLodge = companyIncorporatedAt.year(this.yearToLodge)

    let lastPaymentDateForLodgement = anniversaryForYearToLodge.add(15, "days")

    let diff = dayjs().diff(lastPaymentDateForLodgement, "months")

    return diff
  }

  totalLateLodgementFees(): number {
    if (!this.isLateLodgement()) {
      return 0
    }

    let numberOfMonthsLate = this.numberOfMonthsLateBy()
    let numberOfLateLodgementToCharge = Math.ceil(numberOfMonthsLate / 3)
    let totalLateLodgementFees = numberOfLateLodgementToCharge * 50

    if (totalLateLodgementFees > 200) {
      totalLateLodgementFees = 200 // max
    }

    return totalLateLodgementFees
  }

  totalLateLodgementFeeFor(year: number): number {
    let dayjs = useDayjs()
    let companyIncorporatedAt = dayjs(this.company.incorporatedAt)
    let anniversaryForYearToLodge = companyIncorporatedAt.year(year)

    let lastPaymentDateForLodgement = anniversaryForYearToLodge.add(15, "days")

    let numberOfMonthsLate = dayjs().diff(lastPaymentDateForLodgement, "months")
    let numberOfLateLodgementToCharge = Math.ceil(numberOfMonthsLate / 3)
    let totalLateLodgementFees = numberOfLateLodgementToCharge * 50

    if (totalLateLodgementFees > 200) {
      totalLateLodgementFees = 200 // max
    }

    return totalLateLodgementFees
  }

  hasOtherOutstandings(): boolean {
    return this.yearsDue.some((yd: number) => {
      return yd !== this.yearToLodge
    })
  }

  async handlePaymentToLodgeAnnualReturn(paymentCart: PaymentCart, targetId: string): Promise<PaymentCart> {
    let paymentCartItem = paymentCart.items.find((pci: PaymentCartItem) => {
      return pci.targetType === CompanyConstants.TARGET_LODGE_ANNUAL_RETURN && pci.targetId === targetId
    })

    if (!paymentCartItem) {
      return paymentCart
    }

    if (this.isLateLodgement()) {
      paymentCartItem.isLateLodgement = true
      paymentCartItem.lateLodgementFees = this.totalLateLodgementFees()
    }

    if (this.hasOtherOutstandings() && this.isPayingForOutstandings) {
      paymentCartItem.servicePricingId = this.outstandingServicePricing.id
      paymentCartItem.servicePricing = new ServicePricing(this.outstandingServicePricing)

      paymentCartItem.servicePricing.mandatoryServices.forEach((ms: ServicePricingMandatory) => {
        // we just need the appeal price
        if (ms.mandatoryServiceId !== "1d1dd163-ea1a-486b-87cf-97f522dd7895") {
          return
        }

        const years: string[] = this.yearsDue
          .filter((yd: number) => {
            return yd !== this.yearToLodge
          })
          .map((yd: number) => {
            return yd.toString()
          })

        let forYears: string = ""

        if (years.length === 1) {
          forYears = years[0]
        } else if (years.length > 1) {
          const lastYear = years.pop() // Remove the last element
          forYears = `${years.join(", ")} and ${lastYear}`
        }

        ms.mandatoryServicePrice.serviceName = `${ms.mandatoryServicePrice.serviceName} for ${forYears}`
      })

      if (paymentCartItem.servicePricing.optionals.length > 0) {
        let repository = useServicePricingStore()
        let promises = paymentCartItem.servicePricing.optionals
          .map((opt: ServicePricingOptional) => {
            if (opt.optionalServiceId === null) {
              return null
            }

            return repository.fetch(opt.optionalServiceId)
          })
          .filter((promise: any | null) => {
            return promise !== null
          })

        await Promise.all(promises).then((result) => {
          if (!paymentCartItem) {
            return
          }

          paymentCartItem.servicePricing.optionals.forEach((opt: ServicePricingOptional) => {
            let servicePricing = result.find((response: any) => {
              return response !== null && response.id === opt.optionalServiceId
            })

            opt.optionalServicePrice = new ServicePricing(servicePricing)
          })
        })
      }

      let dayjs = useDayjs()
      let yearJoined = dayjs(this.company.createdAt ?? "").year()
      let paymentCartItemOptionals: PaymentCartItemOptional[] = []
      let optionals: ServicePricingOptional[] = []
      this.yearsDue
        .filter((yd: number) => {
          return yd !== this.yearToLodge
        })
        .forEach((yd: number) => {
          if (!paymentCartItem) {
            return
          }

          paymentCartItem.servicePricing.optionals.forEach((opt: ServicePricingOptional) => {
            let clonedOptional = new ServicePricingOptional(opt)
            clonedOptional.optionalServicePrice.serviceName = `${opt.optionalServicePrice.serviceName} FOR ${yd}`

            optionals.push(clonedOptional)

            let newPaymentCartItemOptional = new PaymentCartItemOptional()
            newPaymentCartItemOptional.servicePricing = new ServicePricing(clonedOptional.optionalServicePrice)
            newPaymentCartItemOptional.servicePricingId = clonedOptional.optionalServiceId ?? ""
            newPaymentCartItemOptional.isLateLodgement = true
            newPaymentCartItemOptional.lateLodgementFees = this.totalLateLodgementFeeFor(yd)
            newPaymentCartItemOptional.total =
              clonedOptional.optionalServicePrice.baseGrandTotal + this.totalLateLodgementFeeFor(yd)
            newPaymentCartItemOptional.suffixToServiceName = `for ${yd}`
            newPaymentCartItemOptional.isDisabled = yd >= yearJoined
            paymentCartItemOptionals.push(newPaymentCartItemOptional)
          })
        })

      paymentCartItem.optionals = paymentCartItemOptionals.map((pcio: PaymentCartItemOptional) => {
        return new PaymentCartItemOptional(pcio)
      })

      paymentCartItem.servicePricing.optionals = optionals.map((opt: ServicePricingOptional) => {
        return new ServicePricingOptional(opt)
      })

      paymentCartItem.selectedOptionals = optionals
        .filter((opt: ServicePricingOptional) => {
          let nameFragments = opt.optionalServicePrice.serviceName.split(" FOR ")
          let year = nameFragments[1] ?? dayjs().year()

          return parseInt(year) >= yearJoined
        })
        .map((opt: ServicePricingOptional) => {
          return new ServicePricingOptional(opt)
        })
    }

    paymentCartItem.servicePricing.serviceName = `${paymentCartItem.servicePricing.serviceName} FOR ${this.yearToLodge}`

    return paymentCart
  }
}
