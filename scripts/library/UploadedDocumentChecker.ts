import { DocumentTargets } from "../constants/DocumentTargets"
import { StatutoryFormKeywords } from "../constants/StatutoryForms"
import type { CompanyDocument } from "../types/CompanyDocument"
import { ObjectUtil } from "../utils/Object"
import { StringUtil } from "../utils/String"
import { DocumentsAndForms } from "./DocumentsAndForms"

export class UploadedDocumentChecker {
  companyId: string = ""

  isFetching: boolean = false

  documentsAndForms: DocumentsAndForms = new DocumentsAndForms("")

  constructor(companyId: string) {
    this.companyId = companyId
  }

  async fetchDocuments(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId)) {
      return
    }

    this.documentsAndForms.companyId = this.companyId
    await this.documentsAndForms.init()
  }

  isDocumentUploaded(target: string, applicationDate: string): boolean {
    let keyword = this.keyword(target)

    if (StringUtil.isNullOrEmpty(keyword) || StringUtil.isNullOrEmpty(applicationDate)) {
      return false
    }

    let keywordParts = keyword.split(",")

    let matchedDocuments = this.documentsAndForms.documents.filter((d: CompanyDocument) => {
      return keywordParts.some((k: string) => {
        return StringUtil.contains(d.documentName, k)
      })
    })

    if (matchedDocuments.length <= 0) {
      return false
    }

    let orderedDocuments = ObjectUtil.sort<CompanyDocument>(matchedDocuments, "documentDate", "desc")

    let firstDocumentDate = orderedDocuments[0].documentDate

    let dayjs = useDayjs()

    return dayjs(applicationDate).isBefore(firstDocumentDate) || dayjs(applicationDate).isSame(firstDocumentDate)
  }

  keyword(target: string): string {
    switch (target) {
      case DocumentTargets.TARGET_ADOPT_A_CONSTITUTION:
        return StatutoryFormKeywords.Constitution
      case DocumentTargets.TARGET_ADOPT_A_CONSTITUTION_RESOLUTIONS:
        return StatutoryFormKeywords.Constitution
      case DocumentTargets.TARGET_AMENDMENT_ADDRESS:
        return StatutoryFormKeywords.ChangeOfAddress
      case DocumentTargets.TARGET_AMENDMENT_ADDRESS_RESOLUTIONS:
        return StatutoryFormKeywords.ChangeOfAddress
      case DocumentTargets.TARGET_AMENDMENT_REGISTERED_ADDRESS:
        return StatutoryFormKeywords.ChangeOfRegisteredAddress
      case DocumentTargets.TARGET_AMENDMENT_REGISTERED_ADDRESS_RESOLUTIONS:
        return StatutoryFormKeywords.ChangeOfRegisteredAddress
      case DocumentTargets.TARGET_AMENDMENT_BRANCH:
        return StatutoryFormKeywords.ChangeOfBranch
      case DocumentTargets.TARGET_AMENDMENT_BRANCH_RESOLUTIONS:
        return StatutoryFormKeywords.ChangeOfBranch
      case DocumentTargets.TARGET_AMENDMENT_CONSTITUTION:
        return StatutoryFormKeywords.Constitution
      case DocumentTargets.TARGET_AMENDMENT_CONSTITUTION_RESOLUTIONS:
        return StatutoryFormKeywords.Constitution
      case DocumentTargets.TARGET_AMENDMENT_DESCRIPTION:
        return StatutoryFormKeywords.ChangeOfDescription
      case DocumentTargets.TARGET_AMENDMENT_DESCRIPTION_RESOLUTIONS:
        return StatutoryFormKeywords.ChangeOfDescription
      case DocumentTargets.TARGET_AMENDMENT_NAME:
        return StatutoryFormKeywords.ChangeOfName
      case DocumentTargets.TARGET_AMENDMENT_NAME_RESOLUTIONS:
        return StatutoryFormKeywords.ChangeOfName
      case DocumentTargets.TARGET_AMENDMENT_NAME_SECTION27:
        return "Section 27"
      case DocumentTargets.TARGET_AMENDMENT_NAME_SECTION28:
        return "Section 28"
      case DocumentTargets.TARGET_AUDIT_CIRCULATION:
        return StatutoryFormKeywords.AuditCirculation
      case DocumentTargets.TARGET_AUDIT_CIRCULATION_RESOLUTIONS:
        return StatutoryFormKeywords.AuditCirculation
      case DocumentTargets.TARGET_AUDIT_EXTENSION_OF_TIME:
        return StatutoryFormKeywords.AuditEOT
      case DocumentTargets.TARGET_AUDIT_EXTENSION_OF_TIME_RESOLUTIONS:
        return StatutoryFormKeywords.AuditEOT
      case DocumentTargets.TARGET_AUDITOR_APPOINTMENT:
        return StatutoryFormKeywords.AuditorAppointment
      case DocumentTargets.TARGET_AUDITOR_APPOINTMENT_RESOLUTIONS:
        return StatutoryFormKeywords.AuditorAppointment
      case DocumentTargets.TARGET_BO_DECLARATION:
        return ""
      case DocumentTargets.TARGET_BO_DECLARATION_RESOLUTIONS:
        return ""
      case DocumentTargets.TARGET_CLOSE_BANK_ACCOUNT:
        return ""
      case DocumentTargets.TARGET_CLOSE_BANK_ACCOUNT_RESOLUTIONS:
        return ""
      case DocumentTargets.TARGET_COMMON_SEAL:
        return ""
      case DocumentTargets.TARGET_COMMON_SEAL_RESOLUTIONS:
        return ""
      case DocumentTargets.TARGET_COMMON_SEAL_REPLACEMENT:
        return ""
      case DocumentTargets.TARGET_COMMON_SEAL_REPLACEMENT_RESOLUTIONS:
        return ""
      case DocumentTargets.TARGET_CONTRACT_ENTER:
        return ""
      case DocumentTargets.TARGET_CONTRACT_ENTER_RESOLUTIONS:
        return ""
      case DocumentTargets.TARGET_DELEGATION_OF_AUTHORITY:
        return ""
      case DocumentTargets.TARGET_DELEGATION_OF_AUTHORITY_RESOLUTIONS:
        return ""
      case DocumentTargets.TARGET_DIRECTOR_APPOINTMENT:
        return ""
      case DocumentTargets.TARGET_DIRECTOR_APPOINTMENT_RESOLUTIONS:
        return ""
      case DocumentTargets.TARGET_DIRECTOR_DECLARATION_CONFLICT_OF_INTEREST:
        return ""
      case DocumentTargets.TARGET_DIRECTOR_DECLARATION_CONFLICT_OF_INTEREST_RESOLUTIONS:
        return ""
      case DocumentTargets.TARGET_DIRECTOR_INVITATION:
        return ""
      case DocumentTargets.TARGET_DIRECTOR_INVITATION_RESOLUTIONS:
        return ""
      case DocumentTargets.TARGET_DIRECTOR_LOAN:
        return ""
      case DocumentTargets.TARGET_DIRECTOR_LOAN_RESOLUTIONS:
        return ""
      case DocumentTargets.TARGET_DIRECTOR_CHAIRMAN_APPOINTMENT:
        return ""
      case DocumentTargets.TARGET_DIRECTOR_CHAIRMAN_APPOINTMENT_RESOLUTIONS:
        return ""
      case DocumentTargets.TARGET_DIRECTOR_MANAGER_APPOINTMENT:
        return ""
      case DocumentTargets.TARGET_DIRECTOR_MANAGER_APPOINTMENT_RESOLUTIONS:
        return ""
      case DocumentTargets.TARGET_DIRECTOR_RESIGNATION:
        return ""
      case DocumentTargets.TARGET_DIRECTOR_RESIGNATION_RESOLUTIONS:
        return ""
      case DocumentTargets.TARGET_DIVIDEND_DECLARATION:
        return ""
      case DocumentTargets.TARGET_DIVIDEND_DECLARATION_RESOLUTIONS:
        return ""
      case DocumentTargets.TARGET_DOCUMENT_NOT_KEPT:
        return ""
      case DocumentTargets.TARGET_DOCUMENT_NOT_KEPT_RESOLUTIONS:
        return ""
      case DocumentTargets.TARGET_DOCUMENT_REQUEST:
        return ""
      case DocumentTargets.TARGET_DOCUMENT_REQUEST_RESOLUTIONS:
        return ""
      case DocumentTargets.TARGET_FINANCIAL_STATEMENT_AUTHORISED_PERSON:
        return ""
      case DocumentTargets.TARGET_FINANCIAL_STATEMENT_AUTHORISED_PERSON_RESOLUTIONS:
        return ""
      case DocumentTargets.TARGET_LOAN_APPLICATION:
        return ""
      case DocumentTargets.TARGET_LOAN_APPLICATION_RESOLUTIONS:
        return ""
      case DocumentTargets.TARGET_LODGE_ANNUAL_RETURN:
        return ""
      case DocumentTargets.TARGET_LODGE_ANNUAL_RETURN_RESOLUTIONS:
        return ""
      case DocumentTargets.TARGET_MAILROOM_SERVICE:
        return ""
      case DocumentTargets.TARGET_MAILROOM_SERVICE_RESOLUTIONS:
        return ""
      case DocumentTargets.TARGET_MANAGEMENT_ACCOUNT:
        return ""
      case DocumentTargets.TARGET_MANAGEMENT_ACCOUNT_RESOLUTIONS:
        return ""
      case DocumentTargets.TARGET_NAME_RESERVATION:
        return ""
      case DocumentTargets.TARGET_NAME_RESERVATION_RESOLUTIONS:
        return ""
      case DocumentTargets.TARGET_NO_CONSTITUTION:
        return ""
      case DocumentTargets.TARGET_NO_CONSTITUTION_RESOLUTIONS:
        return ""
      case DocumentTargets.TARGET_NOTICE_ACKNOWLEDGEMENT:
        return ""
      case DocumentTargets.TARGET_NOTICE_ACKNOWLEDGEMENT_RESOLUTIONS:
        return ""
      case DocumentTargets.TARGET_NOTIFY_CHANGE_OF_NAME:
        return ""
      case DocumentTargets.TARGET_NOTIFY_CHANGE_OF_NAME_RESOLUTIONS:
        return ""
      case DocumentTargets.TARGET_OFFICIAL_SEAL:
        return ""
      case DocumentTargets.TARGET_OFFICIAL_SEAL_RESOLUTIONS:
        return ""
      case DocumentTargets.TARGET_OPEN_BANK_ACCOUNT:
        return ""
      case DocumentTargets.TARGET_OPEN_BANK_ACCOUNT_RESOLUTIONS:
        return ""
      case DocumentTargets.TARGET_PREFERENCE_SHARE_RIGHT:
        return ""
      case DocumentTargets.TARGET_PREFERENCE_SHARE_RIGHT_RESOLUTIONS:
        return ""
      case DocumentTargets.TARGET_REMOVAL_OF_DIRECTOR:
        return ""
      case DocumentTargets.TARGET_REMOVAL_OF_DIRECTOR_RESOLUTIONS:
        return ""
      case DocumentTargets.TARGET_SET_FINANCIAL_YEAR_END:
        return ""
      case DocumentTargets.TARGET_SET_FINANCIAL_YEAR_END_RESOLUTIONS:
        return ""
      case DocumentTargets.TARGET_SHAREHOLDER_PROPOSE_ALLOTMENT:
        return ""
      case DocumentTargets.TARGET_SHAREHOLDER_PROPOSE_ALLOTMENT_RESOLUTIONS:
        return ""
      case DocumentTargets.TARGET_SHAREHOLDER_ALLOTMENT_OF_SHARES:
        return ""
      case DocumentTargets.TARGET_SHAREHOLDER_ALLOTMENT_OF_SHARES_RESOLUTIONS:
        return ""
      case DocumentTargets.TARGET_SHAREHOLDER_TRANSFER_OF_SHARES:
        return ""
      case DocumentTargets.TARGET_SHAREHOLDER_TRANSFER_OF_SHARES_RESOLUTIONS:
        return ""
      case DocumentTargets.TARGET_SHAREHOLDER_PROPOSE_TRANSFER:
        return ""
      case DocumentTargets.TARGET_SHAREHOLDER_PROPOSE_TRANSFER_RESOLUTIONS:
        return ""
      case DocumentTargets.TARGET_SHAREHOLDER_POST_SHARE_TRANSFER:
        return ""
      case DocumentTargets.TARGET_SHAREHOLDER_POST_SHARE_TRANSFER_RESOLUTIONS:
        return ""
      case DocumentTargets.TARGET_STRIKING_OFF_RESOLUTION:
        return ""
      case DocumentTargets.TARGET_STRIKING_OFF_RESOLUTION_RESOLUTIONS:
        return ""
      case DocumentTargets.TARGET_SUBSCRIPTION:
        return ""
      case DocumentTargets.TARGET_SUBSCRIPTION_RESOLUTIONS:
        return ""
      case DocumentTargets.TARGET_SUBSCRIBE_BUSINESS_ADDRESS:
        return ""
      case DocumentTargets.TARGET_SUBSCRIBE_BUSINESS_ADDRESS_RESOLUTIONS:
        return ""
      case DocumentTargets.TARGET_TERMS_OF_REFERENCE:
        return ""
      case DocumentTargets.TARGET_TERMS_OF_REFERENCE_RESOLUTIONS:
        return ""
      case DocumentTargets.TARGET_SECTION_47:
        return ""
      case DocumentTargets.TARGET_SECTION_47_RESOLUTIONS:
        return ""
    }

    return ""
  }
}
