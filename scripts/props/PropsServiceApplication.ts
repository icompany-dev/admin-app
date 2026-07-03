import { Application } from "../models/Application"

export interface IPropsServiceApplication {
  serviceName: string
  hasApplication: boolean
  application: Application | null
}

export class PropsServiceApplication implements IPropsServiceApplication {
  serviceName: string
  hasApplication: boolean
  application: Application | null = null

  constructor(serviceName: string, hasApplication: boolean) {
    this.serviceName = serviceName
    this.hasApplication = hasApplication
  }
}
