export class CompanyConstants {
  static TYPE_ID_SDNBHD: string = "sdnbhd"
  static TYPE_ID_BERHAD: string = "berhad"

  static TYPE_SDNBHD: string = "SDN BHD"
  static TYPE_BERHAD: string = "BERHAD"

  static SUBSCRIPTION_ACTIVE: string = "active"
  static SUBSCRIPTION_EXPIRING: string = "expiring"
  static SUBSCRIPTION_EXPIRED: string = "expired"

  static AMENDMENT_BRANCH_TYPE_ADD: string = "add"
  static AMENDMENT_BRANCH_TYPE_ADD_LABEL: string = "addition"
  static AMENDMENT_BRANCH_TYPE_CHANGE: string = "change"
  static AMENDMENT_BRANCH_TYPE_CHANGE_LABEL: string = "change"
  static AMENDMENT_BRANCH_TYPE_REMOVE: string = "remove"
  static AMENDMENT_BRANCH_TYPE_REMOVE_LABEL: string = "removal"

  //Service section
  static TARGET_ADOPT_A_CONSTITUTION: string = "company_constitution_setting"
  static TARGET_AMENDMENT_ADDRESS: string = "company_amendment_address"
  static TARGET_AMENDMENT_REGISTERED_ADDRESS: string = "company_amendment_registered_address"
  static TARGET_AMENDMENT_BRANCH: string = "company_amendment_branch"
  static TARGET_AMENDMENT_CONSTITUTION: string = "company_amendment_constitution"
  static TARGET_AMENDMENT_DESCRIPTION: string = "company_amendment_description"
  static TARGET_AMENDMENT_NAME: string = "company_amendment_name"
  static TARGET_AMENDMENT_NAME_SECTION27: string = "company_amendment_name_section27"
  static TARGET_AMENDMENT_NAME_SECTION28: string = "company_amendment_name_section28"
  static TARGET_AUDIT_CIRCULATION: string = "company_audit_circulation"
  static TARGET_AUDIT_EXTENSION_OF_TIME: string = "company_audit_extension_of_time"
  static TARGET_AUDITOR_APPOINTMENT: string = "company_auditor_appointment"
  static TARGET_BO_DECLARATION: string = "company_bo_declaration"
  static TARGET_CLOSE_BANK_ACCOUNT: string = "company_bank_account_closure"
  static TARGET_COMMON_SEAL: string = "company_common_seal"
  static TARGET_COMMON_SEAL_REPLACEMENT: string = "company_common_seal_replacement"
  static TARGET_CONTRACT_ENTER: string = "company_contract_enter"
  static TARGET_DELEGATION_OF_AUTHORITY: string = "company_delegation_of_authority"
  static TARGET_DIRECTOR_APPOINTMENT: string = "company_director_appointment"
  static TARGET_DIRECTOR_DECLARATION_CONFLICT_OF_INTEREST: string = "director_declaration_conflict_of_interest"
  static TARGET_DIRECTOR_INVITATION: string = "director_invitation"
  static TARGET_DIRECTOR_LOAN: string = "company_director_loan"
  static TARGET_DIRECTOR_CHAIRMAN_APPOINTMENT: string = "company_director_chairman_appointment"
  static TARGET_DIRECTOR_MANAGER_APPOINTMENT: string = "company_director_manager_appointment"
  static TARGET_DIRECTOR_RESIGNATION: string = "company_director_resignation"
  static TARGET_DIVIDEND_DECLARATION: string = "company_dividend_declaration"
  static TARGET_DOCUMENT_NOT_KEPT: string = "company_record_storage"
  static TARGET_DOCUMENT_REQUEST: string = "company_document_request"
  static TARGET_FINANCIAL_STATEMENT_AUTHORISED_PERSON: string = "company_financial_statement_authorised_person"
  static TARGET_LOAN_APPLICATION: string = "company_loan_application"
  static TARGET_LODGE_ANNUAL_RETURN: string = "company_annual_return_request"
  static TARGET_MAILROOM_SERVICE: string = "company_mailroom_service"
  static TARGET_MANAGEMENT_ACCOUNT: string = "company_management_account"
  static TARGET_NAME_RESERVATION: string = "company_name_reservation"
  static TARGET_NO_CONSTITUTION: string = "company_no_constitution_declaration"
  static TARGET_NOTICE_ACKNOWLEDGEMENT: string = "company_meeting_acknowledgement"
  static TARGET_NOTIFY_CHANGE_OF_NAME: string = "company_notify_change_of_name"
  static TARGET_OFFICIAL_SEAL: string = "company_official_seal"
  static TARGET_OPEN_BANK_ACCOUNT: string = "company_bank_resolution"
  static TARGET_PRACTICE_DIRECTIVE_2: string = "practice_directive_2"
  static TARGET_PREFERENCE_SHARE_RIGHT: string = "company_preference_share_right"
  static TARGET_RECEIPT: string = "receipt"
  static TARGET_REMOVAL_OF_DIRECTOR: string = "company_director_removal_notice"
  static TARGET_SET_FINANCIAL_YEAR_END: string = "company_set_financial_year_end"
  static TARGET_SHAREHOLDER_PROPOSE_ALLOTMENT: string = "company_share_issuance"
  static TARGET_SHAREHOLDER_ALLOTMENT_OF_SHARES: string = "company_shareholder_allotment"
  static TARGET_SHAREHOLDER_TRANSFER_OF_SHARES: string = "company_shareholder_transfer"
  static TARGET_SHAREHOLDER_PROPOSE_TRANSFER: string = "company_shareholder_transfer_proposal"
  static TARGET_SHAREHOLDER_POST_SHARE_TRANSFER: string = "company_post_share_transfer"
  static TARGET_STRIKING_OFF_RESOLUTION: string = "company_striking_off_resolution"
  static TARGET_SWITCH_OUT: string = "company_switch_out"
  static TARGET_SUBSCRIPTION: string = "company_subscription"
  static TARGET_SUBSCRIBE_BUSINESS_ADDRESS: string = "company_address_subscription"
  static TARGET_TERMS_OF_REFERENCE: string = "company_terms_of_reference"
  static TARGET_SECTION_47: string = "company_record_storage"

  static TARGET_PREPARE_FINANCIAL_STATEMENTS: string = "company_prepare_financial_statements"

  // TODO: Consider moving this elsewhere
  static TARGET_APPLICATION_INCORPORATE: string = "application_incorporate"
  static TARGET_APPLICATION_INCORPORATE_SECTION27: string = "application_incorporate_section27"
  static TARGET_APPLICATION_INCORPORATE_SECTION236: string = "application_incorporate_section236"

  static TARGET_APPLICATION_SWITCH: string = "application_switch"
  static TARGET_APPLICATION_SWITCH_LETTER: string = "application_switch_letter"
  static TARGET_APPLICATION_SWITCH_RESO: string = "application_switch_reso"

  static TARGET_PURCHASED_DOCUMENT_TEMPLATE: string = "purchased_document_template"

  static TARGET_THIRD_SCHEDULE: string = "third_schedule" //this is not a service. but a document

  static TARGET_MERCHANDISE_PURCHASE: string = "merchandise_purchase"

  static DOCUMENT_TARGETS: string[] = [
    this.TARGET_AMENDMENT_ADDRESS,
    this.TARGET_AMENDMENT_REGISTERED_ADDRESS,
    this.TARGET_AMENDMENT_BRANCH,
    this.TARGET_AMENDMENT_CONSTITUTION,
    this.TARGET_AMENDMENT_DESCRIPTION,
    this.TARGET_AMENDMENT_NAME,
    this.TARGET_AMENDMENT_NAME_SECTION27,
    this.TARGET_AMENDMENT_NAME_SECTION28,
    this.TARGET_APPLICATION_INCORPORATE,
    this.TARGET_APPLICATION_INCORPORATE_SECTION27,
    this.TARGET_APPLICATION_INCORPORATE_SECTION236,
    this.TARGET_APPLICATION_SWITCH,
    this.TARGET_APPLICATION_SWITCH_LETTER,
    this.TARGET_APPLICATION_SWITCH_RESO,
    this.TARGET_AUDIT_CIRCULATION,
    this.TARGET_AUDIT_EXTENSION_OF_TIME,
    this.TARGET_AUDITOR_APPOINTMENT,
    this.TARGET_BO_DECLARATION,
    this.TARGET_CLOSE_BANK_ACCOUNT,
    this.TARGET_COMMON_SEAL,
    this.TARGET_COMMON_SEAL_REPLACEMENT,
    this.TARGET_CONTRACT_ENTER,
    this.TARGET_DELEGATION_OF_AUTHORITY,
    this.TARGET_DIRECTOR_APPOINTMENT,
    this.TARGET_DIRECTOR_DECLARATION_CONFLICT_OF_INTEREST,
    this.TARGET_DIRECTOR_INVITATION,
    this.TARGET_DIRECTOR_LOAN,
    this.TARGET_DIRECTOR_CHAIRMAN_APPOINTMENT,
    this.TARGET_DIRECTOR_MANAGER_APPOINTMENT,
    this.TARGET_DIRECTOR_RESIGNATION,
    this.TARGET_DIVIDEND_DECLARATION,
    this.TARGET_FINANCIAL_STATEMENT_AUTHORISED_PERSON,
    this.TARGET_LOAN_APPLICATION,
    this.TARGET_LODGE_ANNUAL_RETURN,
    this.TARGET_MANAGEMENT_ACCOUNT,
    this.TARGET_NO_CONSTITUTION,
    this.TARGET_NOTICE_ACKNOWLEDGEMENT,
    this.TARGET_NOTIFY_CHANGE_OF_NAME,
    this.TARGET_OFFICIAL_SEAL,
    this.TARGET_OPEN_BANK_ACCOUNT,
    this.TARGET_PRACTICE_DIRECTIVE_2,
    this.TARGET_PREFERENCE_SHARE_RIGHT,
    this.TARGET_PREPARE_FINANCIAL_STATEMENTS,
    this.TARGET_RECEIPT,
    this.TARGET_REMOVAL_OF_DIRECTOR,
    this.TARGET_SET_FINANCIAL_YEAR_END,
    this.TARGET_SHAREHOLDER_PROPOSE_ALLOTMENT,
    this.TARGET_SHAREHOLDER_ALLOTMENT_OF_SHARES,
    this.TARGET_SHAREHOLDER_PROPOSE_TRANSFER,
    this.TARGET_SHAREHOLDER_POST_SHARE_TRANSFER,
    this.TARGET_DOCUMENT_NOT_KEPT,
    this.TARGET_APPLICATION_INCORPORATE,
    this.TARGET_SHAREHOLDER_TRANSFER_OF_SHARES,
    this.TARGET_STRIKING_OFF_RESOLUTION,
    this.TARGET_SWITCH_OUT,
    this.TARGET_SUBSCRIBE_BUSINESS_ADDRESS,
    this.TARGET_SUBSCRIPTION,
    this.TARGET_THIRD_SCHEDULE,
    this.TARGET_SECTION_47,
    this.TARGET_TERMS_OF_REFERENCE,
  ]
}
