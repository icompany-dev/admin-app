import { Application } from "../models/Application"
import { ApplicationIncorporate } from "../models/ApplicationIncorporate"
import type { ApplicationSwitch } from "../models/ApplicationSwitch"

export interface IPropsServiceApplication {
  serviceName: string
  hasApplication: boolean
  application: Application | ApplicationIncorporate | ApplicationSwitch | null
  isShowPaymentStep: boolean
}

export class PropsServiceApplication implements IPropsServiceApplication {
  serviceName: string
  hasApplication: boolean
  application: Application | ApplicationIncorporate | ApplicationSwitch | null = null
  isShowPaymentStep: boolean

  constructor(serviceName: string, hasApplication: boolean, isShowPaymentStep: boolean) {
    this.serviceName = serviceName
    this.hasApplication = hasApplication
    this.isShowPaymentStep = isShowPaymentStep
  }
}
