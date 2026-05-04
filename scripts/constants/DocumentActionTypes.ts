export class DocumentActionType {
  id: string = ""
  en: string = ""
  bm: string = ""
  actionEn: string = ""
  actionBm: string = ""
  subnoteEn: string = ""
  subnoteBm: string = ""

  constructor(
    id: string,
    en: string,
    bm: string,
    actionEn: string,
    actionBm: string,
    subnoteEn: string = "",
    subnoteBm: string = ""
  ) {
    this.id = id
    this.en = en
    this.bm = bm
    this.actionEn = actionEn
    this.actionBm = actionBm
    this.subnoteEn = subnoteEn
    this.subnoteBm = subnoteBm
  }
}

export class DocumentActionTypes {
  static email = new DocumentActionType("email", "Email", "Emel", "email", "emel")
  static download = new DocumentActionType("download", "Download", "Muat Turun", "download", "muat turun")
  static certifyBySSM = new DocumentActionType(
    "certify-ssm",
    "Certify by SSM",
    "Disah oleh SSM",
    "certify by SSM",
    "sahkan oleh SSM",
    "Email only",
    "Hanya Emel"
  )
  static certifyCourier = new DocumentActionType(
    "certify-courier",
    "Certify & Courier",
    "Sah & Kurier",
    "certify and deliver",
    "sahkan dan hantar"
  )
  static certifyEmail = new DocumentActionType(
    "certify-email",
    "Certify & Email",
    "Sah & Emel",
    "certify and email",
    "sahkan dan emel"
  )

  static types: DocumentActionType[] = [
    this.email,
    this.download,
    this.certifyBySSM,
    this.certifyCourier,
    this.certifyEmail,
  ]

  static certifyTypes: DocumentActionType[] = [this.certifyBySSM, this.certifyCourier, this.certifyEmail]
}
