import { ApplicationIncorporate } from "../models/ApplicationIncorporate"

export interface IPropsIncorporationApplication {
  applicationId: string
}

export class PropsIncorporationApplication {
  applicationId: string

  constructor(applicationId: string) {
    this.applicationId = applicationId
  }
}
