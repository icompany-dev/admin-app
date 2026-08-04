export interface IPropsSwitchApplication {
  applicationId: string
}

export class PropsSwitchApplication {
  applicationId: string

  constructor(applicationId: string) {
    this.applicationId = applicationId
  }
}
