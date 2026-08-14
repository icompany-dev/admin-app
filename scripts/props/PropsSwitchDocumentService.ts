export interface IPropsSwitchDocumentService {
  applicationSwitchId: string
  companyName: string
  registrationNumberNew: string
  registrationNumberOld: string
}

export class PropsSwitchDocumentService implements IPropsSwitchDocumentService {
  applicationSwitchId: string

  companyName: string = ""
  registrationNumberNew: string = ""
  registrationNumberOld: string = ""

  constructor(applicationSwitchId: string) {
    this.applicationSwitchId = applicationSwitchId
  }
}
