import { Application } from "../models/Application"

export interface IPropsServiceApplication {
  serviceName: string
  hasApplication: boolean
  application: Application | null
  isShowPaymentStep: boolean
}

export class PropsServiceApplication implements IPropsServiceApplication {
  serviceName: string
  hasApplication: boolean
  application: Application | null = null
  isShowPaymentStep: boolean

  constructor(serviceName: string, hasApplication: boolean, isShowPaymentStep: boolean) {
    this.serviceName = serviceName
    this.hasApplication = hasApplication
    this.isShowPaymentStep = isShowPaymentStep
  }
}
