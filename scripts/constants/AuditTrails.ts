export enum AuditTrailDayType {
  Today = "Today",
  Yeasterday = "Yesterday",
  ThisWeek = "This Week",
  LastWeek = "Last Week",
  ThisMonth = "This Month",
  PreviousMonths = "Previous Months",
}

export enum AuditTrailAction {
  Login = "login",
  Logout = "logout",
  View = "view",
  Download = "download",
  Initiate = "initiate",
  Update = "update",
  Sign = "sign",
  MakePayment = "make payment",
  MadePayment = "made payment",
  Revoke = "revoke",
  Delete = "delete",
  Search = "search",
}
