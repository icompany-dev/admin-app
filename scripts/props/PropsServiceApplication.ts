export interface IPropsServiceApplication {
  serviceName: string
  hasApplication: boolean
}

export class PropsServiceApplication implements IPropsServiceApplication {
  serviceName: string
  hasApplication: boolean

  constructor(serviceName: string, hasApplication: boolean) {
    this.serviceName = serviceName
    this.hasApplication = hasApplication
  }
}
