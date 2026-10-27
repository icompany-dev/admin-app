import { ServiceTargetDetail } from "~/scripts/types/ServiceTargetDetail"
import { CompanyConstants } from "~/scripts/constants/Company"
import type { IRepositoryStore } from "../models/IRepositoryStore"

export class SecretarialServiceUtil {
  static targetDetails(): ServiceTargetDetail[] {
    return [
      new ServiceTargetDetail(CompanyConstants.TARGET_ADOPT_A_CONSTITUTION, useCompanyAmendmentConstitutionStore()),
      new ServiceTargetDetail(CompanyConstants.TARGET_AMENDMENT_ADDRESS, useCompanyAmendmentAddressStore()),
      new ServiceTargetDetail(
        CompanyConstants.TARGET_AMENDMENT_REGISTERED_ADDRESS,
        useCompanyAmendmentRegisteredAddressStore()
      ),
      new ServiceTargetDetail(CompanyConstants.TARGET_AMENDMENT_BRANCH, useCompanyAmendmentBranchStore()),
      new ServiceTargetDetail(CompanyConstants.TARGET_AMENDMENT_CONSTITUTION, useCompanyAmendmentConstitutionStore()),
      new ServiceTargetDetail(CompanyConstants.TARGET_AMENDMENT_DESCRIPTION, useCompanyAmendmentDescriptionStore()),
      new ServiceTargetDetail(CompanyConstants.TARGET_AMENDMENT_NAME, useCompanyAmendmentNameStore()),
      new ServiceTargetDetail(CompanyConstants.TARGET_AUDIT_CIRCULATION, useCompanyAuditCirculationStore()),
      new ServiceTargetDetail(CompanyConstants.TARGET_AUDITOR_APPOINTMENT, useCompanyAuditorAppointmentStore()),
      new ServiceTargetDetail(CompanyConstants.TARGET_BO_DECLARATION, useCompanyBODeclarationStore()),
      new ServiceTargetDetail(CompanyConstants.TARGET_CHANGE_BANK_SIGNATORY, useCompanyChangeBankSignatoryStore()),
      new ServiceTargetDetail(CompanyConstants.TARGET_CLOSE_BANK_ACCOUNT, useCompanyBankAccountClosureStore()),
      new ServiceTargetDetail(CompanyConstants.TARGET_COMMON_SEAL, useCompanyCommonSealStore()),
      new ServiceTargetDetail(CompanyConstants.TARGET_COMMON_SEAL_REPLACEMENT, useCompanyCommonSealReplacementStore()),
      new ServiceTargetDetail(CompanyConstants.TARGET_CONTRACT_ENTER, useCompanyContractEnterStore()),
      new ServiceTargetDetail(CompanyConstants.TARGET_DELEGATION_OF_AUTHORITY, useCompanyDelegationOfAuthorityStore()),
      new ServiceTargetDetail(CompanyConstants.TARGET_DIRECTOR_APPOINTMENT, useCompanyDirectorAppointmentStore()),
      new ServiceTargetDetail(
        CompanyConstants.TARGET_DIRECTOR_DECLARATION_CONFLICT_OF_INTEREST,
        useDirectorDeclarationConflictOfInterestStore()
      ),
      new ServiceTargetDetail(CompanyConstants.TARGET_DIRECTOR_INVITATION, useDirectorInvitationStore()),
      new ServiceTargetDetail(CompanyConstants.TARGET_DIRECTOR_LOAN, useCompanyDirectorLoanStore()),
      new ServiceTargetDetail(CompanyConstants.TARGET_DIRECTOR_PAYMENT, useCompanyDirectorPaymentStore()),
      new ServiceTargetDetail(
        CompanyConstants.TARGET_DIRECTOR_MANAGER_APPOINTMENT,
        useCompanyDirectorManagerAppointmentStore()
      ),
      new ServiceTargetDetail(CompanyConstants.TARGET_DIRECTOR_RESIGNATION, useCompanyDirectorResignationStore()),
      new ServiceTargetDetail(CompanyConstants.TARGET_DIVIDEND_DECLARATION, useCompanyDividendDeclarationStore()),
      new ServiceTargetDetail(CompanyConstants.TARGET_DOCUMENT_REQUEST, useCompanyDocumentRequestStore()),
      new ServiceTargetDetail(
        CompanyConstants.TARGET_FINANCIAL_STATEMENT_AUTHORISED_PERSON,
        useCompanyFinancialStatementAuthorisedPersonStore()
      ),
      // new ServiceTargetDetail(
      //   CompanyConstants.TARGET_FINANCIAL_STATEMENT_SETUP,
      //   useCompanyFinancialStatementSetupStore()
      // ),
      new ServiceTargetDetail(CompanyConstants.TARGET_LOAN_APPLICATION, useCompanyLoanApplicationStore()),
      new ServiceTargetDetail(CompanyConstants.TARGET_LODGE_ANNUAL_RETURN, useCompanyAnnualReturnRequestStore()),
      new ServiceTargetDetail(CompanyConstants.TARGET_MAILROOM_SERVICE, useCompanyMailroomServiceStore()),
      new ServiceTargetDetail(CompanyConstants.TARGET_MANAGEMENT_ACCOUNT, useCompanyManagementAccountStore()),
      new ServiceTargetDetail(CompanyConstants.TARGET_NAME_RESERVATION, useApplicationNameReservationStore()),
      new ServiceTargetDetail(CompanyConstants.TARGET_NO_CONSTITUTION, useCompanyNoConstitutionDeclarationStore()),
      new ServiceTargetDetail(CompanyConstants.TARGET_OFFICIAL_SEAL, useCompanyOfficialSealStore()),
      new ServiceTargetDetail(CompanyConstants.TARGET_OPEN_BANK_ACCOUNT, useCompanyBankAccountOpeningStore()),
      new ServiceTargetDetail(CompanyConstants.TARGET_PURCHASE_ASSET, useCompanyAssetPurchaseStore()),
      new ServiceTargetDetail(CompanyConstants.TARGET_PREFERENCE_SHARE_RIGHT, useCompanyPreferenceShareRightStore()),
      new ServiceTargetDetail(CompanyConstants.TARGET_REMOVAL_OF_DIRECTOR, useCompanyDirectorRemovalStore()),
      new ServiceTargetDetail(CompanyConstants.TARGET_SET_FINANCIAL_YEAR_END, useCompanySetFinancialYearEndStore()),
      new ServiceTargetDetail(CompanyConstants.TARGET_SHAREHOLDER_PROPOSE_ALLOTMENT, useCompanyShareIssuanceStore()),
      new ServiceTargetDetail(
        CompanyConstants.TARGET_SHAREHOLDER_ALLOTMENT_OF_SHARES,
        useCompanyShareholderAllotmentStore()
      ),
      new ServiceTargetDetail(
        CompanyConstants.TARGET_SHAREHOLDER_TRANSFER_OF_SHARES,
        useCompanyShareholderTransferStore()
      ),
      new ServiceTargetDetail(
        CompanyConstants.TARGET_SHAREHOLDER_PROPOSE_TRANSFER,
        useCompanyShareholderTransferNoticeStore()
      ),
      new ServiceTargetDetail(
        CompanyConstants.TARGET_SHAREHOLDER_POST_SHARE_TRANSFER,
        useCompanyPostShareTransferStore()
      ),
      new ServiceTargetDetail(CompanyConstants.TARGET_STRIKING_OFF_RESOLUTION, useCompanyStrikingOffResolutionStore()),
      new ServiceTargetDetail(CompanyConstants.TARGET_SUBSCRIBE_BUSINESS_ADDRESS, useCompanyAddressSubscriptionStore()),
      new ServiceTargetDetail(CompanyConstants.TARGET_SWITCH_OUT, useCompanySwitchOutStore()),
      new ServiceTargetDetail(CompanyConstants.TARGET_TERMS_OF_REFERENCE, useCompanyTermOfReferenceStore()),
      // new ServiceTargetDetail(CompanyConstants.TARGET_TAX_AGENT_APPOINTMENT, useCompanyAppointmentOfTaxAgentStore()),
    ]
  }

  static getRepositoryByTarget(target: string): IRepositoryStore | null {
    let targetDetail = this.targetDetails().find((td: ServiceTargetDetail) => {
      return td.name === target
    })

    return targetDetail?.repository ?? null
  }
}
