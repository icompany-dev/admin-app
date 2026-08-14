import { ServiceToPay } from "../models/ServiceToPay"

export class CompanyServiceToPay {
  companyId: string = ""
  companyName: string = ""
  servicesToPay: ServiceToPay[] = []

  constructor(companyId: string, companyName: string, servicesToPay: ServiceToPay[]) {
    this.companyId = companyId
    this.companyName = companyName
    this.servicesToPay = servicesToPay.map((stp: ServiceToPay) => {
      return new ServiceToPay(stp)
    })
  }
}
