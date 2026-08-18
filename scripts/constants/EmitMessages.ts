// This contains the strings for global emit messages
export class EmitMessages {
  static BACK: string = "back"
  static DONE_LOADING: string = "doneLoading"
  static GO_TO_NEW: string = "goToNew"
  static GO_TO_EXISTING: string = "goToExisting"
  static HAS_EXISTING_APPLICATION: string = "hasExistingApplication"
  static HAS_PAST_APPLICATIONS: string = "hasPastApplications"
  static ISSUE: string = "issue"
  static MAILROOM_SERVICE: string = "mailroomService"
  static NO_EXISTING_APPLICATION: string = "noExistingApplication"
  static PAY: string = "pay"
  static PROCEED: string = "proceed"
  static RESIGN_AS_DIRECTOR: string = "resignAsDirector"
  static RESERVE_NAME_FIRST: string = "reserveNameFirst"
  static SSM_CORPORATE_PROFILE: string = "ssmCorporateProfile"
  static UPDATE_CART: string = "updateCart"
  static VIEW_MODE_CHANGED: string = "viewModeChanged"
  static MISSING_STEP: string = "missingStep"
  static DOCUMENT_GENERATED: string = "documentGenerated"
  static UPLOADED: string = "uploaded"
  static REMOVED: string = "removed"
  static SHOW_DOCUMENT: string = "showDocument"

  static COMPANY_SERVICES: string[] = [
    this.BACK,
    this.DONE_LOADING,
    this.GO_TO_NEW,
    this.GO_TO_EXISTING,
    this.HAS_EXISTING_APPLICATION,
    this.HAS_PAST_APPLICATIONS,
    this.ISSUE,
    this.NO_EXISTING_APPLICATION,
    this.PAY,
    this.UPDATE_CART,
    this.VIEW_MODE_CHANGED,
    this.MISSING_STEP,
  ]

  static POPUPS: string[] = [this.BACK, this.PROCEED, this.UPLOADED]

  static APPLICATION_SERVICES: string[] = [
    "applicationId",
    "paymentOrderId",
    "pa",
    "documentSelected",
    "download",
    "company",
    "show",
    "hide",
  ]
}
