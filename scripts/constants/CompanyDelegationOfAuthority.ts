export class DelegationOfAuthorityType {
  id: string = ""
  value: string = ""

  constructor(id: string, value: string) {
    this.id = id
    this.value = value
  }
}

export class CompanyDelegationOfAuthorityConstant {
  static EXECUTING_DOCUMENT: DelegationOfAuthorityType = new DelegationOfAuthorityType("executing_document", "Executing a document as an authorized officer")
  static ATTESTING_SIGNATURE: DelegationOfAuthorityType = new DelegationOfAuthorityType("attesting_signature", "Attesting the signature of the Director")
  static DIRECTION_IN_WRITING: DelegationOfAuthorityType = new DelegationOfAuthorityType("direction_in_writing", "The direction of the said Director in writing")
  static OPTIONS: Array<DelegationOfAuthorityType> = [this.EXECUTING_DOCUMENT, this.ATTESTING_SIGNATURE, this.DIRECTION_IN_WRITING]

  static DESIGNATION_OPTIONS: string[] = [
    "Director",
    "Board appointed Representative",
    "Executive Representative of the Company"
  ]

  static SCOPE_OF_AUTHORITY_OPTIONS: string[] = [
    "Liaise with Relevant Authorities to obtain permit/license for the Company",
    "Negotiate with any third parties for the best interest of the Company",
    "Enter into any contract/agreement with any third parties for the best interest of the Company",
    "Hiring any third party independent contractor/advisor for the best interest of the Company",
    "Manage the day-to-day operations of the Company",
  ]
}

