export interface IPropsIncorporationDocumentService {
  applicationIncorporationId: string
  applicationNameReservationId: string
  companyName: string
  registrationNumberNew: string
  registrationNumberOld: string
}

export class PropsIncorporationDocumentService implements IPropsIncorporationDocumentService {
  applicationIncorporationId: string
  applicationNameReservationId: string

  companyName: string = ""
  registrationNumberNew: string = ""
  registrationNumberOld: string = ""

  constructor(applicationIncorporationId: string, applicationNameReservationId: string) {
    this.applicationIncorporationId = applicationIncorporationId
    this.applicationNameReservationId = applicationNameReservationId
  }
}
