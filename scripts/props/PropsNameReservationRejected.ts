export interface IPropsNameReservationRejected {
  applicantName: string
  nameSubmitted: string
}

export class PropsNameReservationRejected implements IPropsNameReservationRejected {
  applicantName: string = ""
  nameSubmitted: string = ""

  constructor(applicantName: string, nameSubmitted: string) {
    this.applicantName = applicantName
    this.nameSubmitted = nameSubmitted
  }
}
