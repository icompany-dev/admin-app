export class NameReservationRejected {
  dateRejected: string = ""
  reason: string = ""
  actionToBeTaken: string = ""

  constructor(dateRejected: string, reason: string, actionToBeTaken: string) {
    this.dateRejected = dateRejected
    this.reason = reason
    this.actionToBeTaken = actionToBeTaken
  }
}
