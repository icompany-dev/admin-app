export class ActionType {
  id: string = ""
  en: string = ""
  bm: string = ""
  canPrependServiceName: boolean = false
  canAppendServiceName: boolean = false
  isUserAction: boolean = true

  constructor(
    id: string,
    en: string,
    bm: string,
    canPrependServiceName: boolean = false,
    canAppendServiceName: boolean = false,
    isUserAction: boolean = true
  ) {
    this.id = id
    this.en = en
    this.bm = bm
    this.canPrependServiceName = canPrependServiceName
    this.canAppendServiceName = canAppendServiceName
    this.isUserAction = isUserAction
  }
}

export class ActionTypes {
  static JOINED = new ActionType(
    "joined",
    "Joined iCompany",
    "Sertai iCompany",
    false,
    false,
    false
  )
  static INCORPORATED = new ActionType(
    "incorporated",
    "Incorporation is successful!",
    "Permerbadanan berjaya!",
    false,
    false,
    false
  )
  static SWITCHED = new ActionType(
    "switched",
    "Successfully switched to iCompany!",
    "Berjaya Tukar ke iCompany!",
    false,
    false,
    false
  )
  static INITIATED = new ActionType(
    "initiated",
    "Initiated",
    "Mulakan",
    false,
    true,
    true
  )
  static PAID = new ActionType(
    "paid",
    "Made Payment for",
    "Buat bayaran bagi",
    false,
    true,
    true
  )
  static SIGNED = new ActionType(
    "signed",
    "Signed documents for",
    "Tandatangan dokumen bagi",
    false,
    true,
    true
  )
  static REMOVED = new ActionType(
    "removed",
    "Deleted / Withdrawn",
    "Padam / Menarik balik",
    false,
    true,
    true
  )
  static COMPLETED = new ActionType(
    "completed",
    "completed",
    "selesai",
    true,
    false,
    false
  )
  static SWITCHED_OUT = new ActionType(
    "switched-out",
    "Switched out of iCompany",
    "Tukar Setiausaha Syarikat",
    false,
    true,
    false
  )
  static ACCEPTED_APPOINTMENT = new ActionType(
    "accepted-appointment",
    "Signed on Section 201",
    "Tandatangan Seksyen 201",
    false,
    false,
    true
  )
  static REJECTED_APPOINTMENT = new ActionType(
    "rejected-appointment",
    "Rejected appointment as Director",
    "Tolak Perlantikan sebagai Pengarah",
    false,
    false,
    true
  )
  static SIGNED_106 = new ActionType(
    "signed-section-106",
    "Signed on Section 106",
    "Tandatangan Seksyen 106",
    false,
    false,
    true
  )
  static LODGED = new ActionType(
    "lodged",
    "lodged with SSM",
    "diserahkan kepada SSM",
    true,
    false,
    false
  )
  static SUBMITTED = new ActionType(
    "submitted",
    "submitted to SSM",
    "diserahkan kepada SSM"
  )

  static ACTIONS = [
    this.JOINED,
    this.INCORPORATED,
    this.SWITCHED,
    this.INITIATED,
    this.PAID,
    this.SIGNED,
    this.REMOVED,
    this.COMPLETED,
    this.SWITCHED_OUT,
    this.ACCEPTED_APPOINTMENT,
    this.REJECTED_APPOINTMENT,
    this.SIGNED_106,
    this.LODGED,
    this.SUBMITTED,
  ]
}
