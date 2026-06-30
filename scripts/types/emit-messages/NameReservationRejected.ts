export class NameReservationRejected {
  dateRejected: string = ""
  reason: string = ""

  constructor(dateRejected: string, reason: string) {
    this.dateRejected = dateRejected
    this.reason = reason
  }
}
