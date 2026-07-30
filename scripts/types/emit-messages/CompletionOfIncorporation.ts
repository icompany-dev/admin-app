export class CompletionOfIncorporation {
  incorporatedAt: string = ""
  registrationNumberNew: string = ""
  registrationNumberOld: string = ""

  constructor(incorporatedAt: string, registrationNumberNew: string, registrationNumberOld: string) {
    this.incorporatedAt = incorporatedAt
    this.registrationNumberNew = registrationNumberNew
    this.registrationNumberOld = registrationNumberOld
  }
}
