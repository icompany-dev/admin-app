export interface IPropsEmailToAuditorContent {
  companyName: string
  registrationNumberNew: string
  registrationNumberOld: string
  auditorFirmName: string
  auditorEmail: string
}

export class PropsEmailToAuditorContent implements IPropsEmailToAuditorContent {
  companyName: string
  registrationNumberNew: string
  registrationNumberOld: string
  auditorFirmName: string
  auditorEmail: string

  constructor(
    companyName: string,
    registrationNumberNew: string,
    registrationNumberOld: string,
    auditorFirmName: string,
    auditorEmail: string
  ) {
    this.companyName = companyName
    this.registrationNumberNew = registrationNumberNew
    this.registrationNumberOld = registrationNumberOld
    this.auditorFirmName = auditorFirmName
    this.auditorEmail = auditorEmail
  }
}
