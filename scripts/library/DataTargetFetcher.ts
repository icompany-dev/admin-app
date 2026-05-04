import { CompanyConstants } from "../constants/Company"
import type { IRepositoryStore } from "../models/IRepositoryStore"
import { StringUtil } from "../utils/String"
import { Error } from "./Error"
import { Filter } from "./Filter"

export class DataTargetFetcher<T> {
  target: string = ""
  repository: IRepositoryStore | null = null

  constructor(target: string) {
    this.target = target

    this.setRepository()
  }

  setRepository(): void {
    if (StringUtil.isNullOrEmpty(this.target)) {
      return
    }

    switch (this.target) {
      case CompanyConstants.TARGET_ADOPT_A_CONSTITUTION:
        this.repository = useCompanyAmendmentConstitutionStore()
        break
      case CompanyConstants.TARGET_AMENDMENT_ADDRESS:
        this.repository = useCompanyAmendmentAddressStore()
        break
      case CompanyConstants.TARGET_AMENDMENT_REGISTERED_ADDRESS:
        this.repository = useCompanyAmendmentRegisteredAddressStore()
        break
      case CompanyConstants.TARGET_AMENDMENT_BRANCH:
        this.repository = useCompanyAmendmentBranchStore()
        break
      case CompanyConstants.TARGET_AMENDMENT_CONSTITUTION:
        this.repository = useCompanyAmendmentConstitutionStore()
        break
      case CompanyConstants.TARGET_AMENDMENT_DESCRIPTION:
        this.repository = useCompanyAmendmentDescriptionStore()
        break
      case CompanyConstants.TARGET_AMENDMENT_NAME:
        this.repository = useCompanyAmendmentNameStore()
        break
      case CompanyConstants.TARGET_AUDIT_CIRCULATION:
        this.repository = useCompanyAuditCirculationStore()
        break
      case CompanyConstants.TARGET_AUDITOR_APPOINTMENT:
        this.repository = useCompanyAuditorAppointmentStore()
        break
      case CompanyConstants.TARGET_BO_DECLARATION:
        this.repository = useCompanyBODeclarationStore()
        break
      case CompanyConstants.TARGET_COMMON_SEAL:
        this.repository = useCompanyCommonSealStore()
        break
      case CompanyConstants.TARGET_COMMON_SEAL_REPLACEMENT:
        this.repository = useCompanyCommonSealReplacementStore()
        break
      case CompanyConstants.TARGET_CONTRACT_ENTER:
        this.repository = useCompanyContractEnterStore()
        break
      case CompanyConstants.TARGET_DELEGATION_OF_AUTHORITY:
        this.repository = useCompanyDelegationOfAuthorityStore()
        break
      case CompanyConstants.TARGET_DIRECTOR_APPOINTMENT:
        this.repository = useCompanyDirectorAppointmentStore()
        break
      case CompanyConstants.TARGET_DIRECTOR_DECLARATION_CONFLICT_OF_INTEREST:
        this.repository = useDirectorDeclarationConflictOfInterestStore()
        break
      case CompanyConstants.TARGET_DIRECTOR_INVITATION:
        this.repository = useDirectorInvitationStore()
        break
      case CompanyConstants.TARGET_DIRECTOR_LOAN:
        this.repository = useCompanyDirectorLoanStore()
        break
      case CompanyConstants.TARGET_DIRECTOR_MANAGER_APPOINTMENT:
        this.repository = useCompanyDirectorManagerAppointmentStore()
        break
      case CompanyConstants.TARGET_DIRECTOR_RESIGNATION:
        this.repository = useCompanyDirectorResignationStore()
        break
      case CompanyConstants.TARGET_DIVIDEND_DECLARATION:
        this.repository = useCompanyDividendDeclarationStore()
        break
      case CompanyConstants.TARGET_DOCUMENT_REQUEST:
        this.repository = useCompanyDocumentRequestStore()
        break
      case CompanyConstants.TARGET_FINANCIAL_STATEMENT_AUTHORISED_PERSON:
        this.repository = useCompanyFinancialStatementAuthorisedPersonStore()
        break
      case CompanyConstants.TARGET_LODGE_ANNUAL_RETURN:
        this.repository = useCompanyAnnualReturnRequestStore()
        break
      case CompanyConstants.TARGET_MAILROOM_SERVICE:
        this.repository = useCompanyMailroomServiceStore()
        break
      case CompanyConstants.TARGET_MANAGEMENT_ACCOUNT:
        this.repository = useCompanyManagementAccountStore()
        break
      case CompanyConstants.TARGET_NO_CONSTITUTION:
        this.repository = useCompanyNoConstitutionDeclarationStore()
        break
      case CompanyConstants.TARGET_OPEN_BANK_ACCOUNT:
        this.repository = useCompanyBankAccountOpeningStore()
        break
      case CompanyConstants.TARGET_PREFERENCE_SHARE_RIGHT:
        this.repository = useCompanyPreferenceShareRightStore()
        break
      case CompanyConstants.TARGET_SET_FINANCIAL_YEAR_END:
        this.repository = useCompanySetFinancialYearEndStore()
        break
      case CompanyConstants.TARGET_SHAREHOLDER_PROPOSE_ALLOTMENT:
        this.repository = useCompanyShareIssuanceStore()
        break
      case CompanyConstants.TARGET_SHAREHOLDER_ALLOTMENT_OF_SHARES:
        this.repository = useCompanyShareholderAllotmentStore()
        break
      case CompanyConstants.TARGET_SHAREHOLDER_TRANSFER_OF_SHARES:
        this.repository = useCompanyShareholderTransferStore()
        break
      case CompanyConstants.TARGET_SHAREHOLDER_PROPOSE_TRANSFER:
        this.repository = useCompanyShareholderTransferNoticeStore()
        break
      case CompanyConstants.TARGET_SHAREHOLDER_POST_SHARE_TRANSFER:
        this.repository = useCompanyPostShareTransferStore()
        break
      case CompanyConstants.TARGET_STRIKING_OFF_RESOLUTION:
        this.repository = useCompanyStrikingOffResolutionStore()
        break
      case CompanyConstants.TARGET_SUBSCRIBE_BUSINESS_ADDRESS:
        this.repository = useCompanyAddressSubscriptionStore()
        break
      case CompanyConstants.TARGET_TERMS_OF_REFERENCE:
        this.repository = useCompanyTermOfReferenceStore()
        break
      default:
        this.repository = null
        break
    }
  }

  async fetch(id: string): Promise<T> {
    if (!this.repository) {
      let error = new Error(Error.ERROR_TYPE_CODE, "")
      error.title = "Repository Not Found"
      error.message = "Please check the repository to continue"
      throw error
    }

    return this.repository.fetch(id)
  }

  async fetchOngoing(companyId: string): Promise<T> {
    if (!this.repository) {
      let error = new Error(Error.ERROR_TYPE_CODE, "")
      error.title = "Repository Not Found"
      error.message = "Please check the repository to continue"
      throw error
    }

    return this.repository.ongoing(companyId)
  }
}
