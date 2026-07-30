export interface IPropsIncorporationDocumentService {
  applicationIncorporationId: string
  applicationNameReservationId: string
}

export class PropsIncorporationDocumentService implements IPropsIncorporationDocumentService {
  applicationIncorporationId: string
  applicationNameReservationId: string

  constructor(applicationIncorporationId: string, applicationNameReservationId: string) {
    this.applicationIncorporationId = applicationIncorporationId
    this.applicationNameReservationId = applicationNameReservationId
  }
}
