import { Application } from "../models/Application"
import { ApplicationIncorporate } from "../models/ApplicationIncorporate"

export interface IPropsServiceApplication {
  serviceName: string
  hasApplication: boolean
  application: Application | ApplicationIncorporate | null
  isShowPaymentStep: boolean
}

export class PropsServiceApplication implements IPropsServiceApplication {
  serviceName: string
  hasApplication: boolean
  application: Application | ApplicationIncorporate | null = null
  isShowPaymentStep: boolean

  constructor(serviceName: string, hasApplication: boolean, isShowPaymentStep: boolean) {
    this.serviceName = serviceName
    this.hasApplication = hasApplication
    this.isShowPaymentStep = isShowPaymentStep
  }
}
