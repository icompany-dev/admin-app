import { CompanyConstants } from "~/scripts/constants/Company"
import { StringUtil } from "~/scripts/utils/String"

import { useCompanyAmendmentAddressStore } from "#imports"
import { useCompanyAmendmentBranchStore } from "#imports"
import { useCompanyAmendmentDescriptionStore } from "#imports"
import { useCompanyAmendmentNameStore } from "#imports"
import { useCompanyDirectorAppointmentStore } from "#imports"

export class DeleteApplicationsUtil {
  static async remove(targetType: string, targetId: string): Promise<void> {
    if (StringUtil.isNullOrEmpty(targetType) || StringUtil.isNullOrEmpty(targetId)) {
      return
    }

    let repository = null
    switch (targetType) {
      case CompanyConstants.TARGET_AMENDMENT_ADDRESS:
        repository = useCompanyAmendmentAddressStore()
        break
      case CompanyConstants.TARGET_AMENDMENT_BRANCH:
        repository = useCompanyAmendmentBranchStore()
        break
      case CompanyConstants.TARGET_AMENDMENT_DESCRIPTION:
        repository = useCompanyAmendmentDescriptionStore()
        break
      case CompanyConstants.TARGET_AMENDMENT_NAME:
        repository = useCompanyAmendmentNameStore()
        break
      case CompanyConstants.TARGET_AMENDMENT_REGISTERED_ADDRESS:
        repository = useCompanyAmendmentRegisteredAddressStore()
        break
      case CompanyConstants.TARGET_AUDIT_CIRCULATION:
        repository = useCompanyAuditCirculationStore()
        break
      case CompanyConstants.TARGET_DIRECTOR_APPOINTMENT:
        repository = useCompanyDirectorAppointmentStore()
        break
      case CompanyConstants.TARGET_DIRECTOR_RESIGNATION:
        repository = useCompanyDirectorResignationStore()
        break
      case CompanyConstants.TARGET_FINANCIAL_STATEMENT_AUTHORISED_PERSON:
        repository = useCompanyFinancialStatementAuthorisedPersonStore()
        break
      case CompanyConstants.TARGET_LODGE_ANNUAL_RETURN:
        repository = useCompanyAnnualReturnRequestStore()
        break
      case CompanyConstants.TARGET_MAILROOM_SERVICE:
        repository = useCompanyMailroomServiceStore()
        break
      case CompanyConstants.TARGET_NO_CONSTITUTION:
        repository = useCompanyNoConstitutionDeclarationStore()
        break
      case CompanyConstants.TARGET_OPEN_BANK_ACCOUNT:
        repository = useCompanyBankAccountOpeningStore()
        break
      case CompanyConstants.TARGET_SET_FINANCIAL_YEAR_END:
        repository = useCompanySetFinancialYearEndStore()
        break
      case CompanyConstants.TARGET_APPLICATION_SWITCH:
        repository = useApplicationSwitchStore()
        break
      case CompanyConstants.TARGET_APPLICATION_INCORPORATE:
        repository = useApplicationIncorporateStore()
        break
      case CompanyConstants.TARGET_SHAREHOLDER_PROPOSE_ALLOTMENT:
        repository = useCompanyShareIssuanceStore()
        break
      case CompanyConstants.TARGET_SHAREHOLDER_ALLOTMENT_OF_SHARES:
        repository = useCompanyShareholderAllotmentStore()
        break
      case CompanyConstants.TARGET_SHAREHOLDER_TRANSFER_OF_SHARES:
        repository = useCompanyShareholderTransferStore()
        break
      case CompanyConstants.TARGET_SHAREHOLDER_POST_SHARE_TRANSFER:
        repository = useCompanyPostShareTransferStore()
        break
      case CompanyConstants.TARGET_APPLICATION_INCORPORATE:
        repository = useApplicationIncorporateStore()
        break
      case CompanyConstants.TARGET_SUBSCRIBE_BUSINESS_ADDRESS:
        repository = useCompanyAddressSubscriptionStore()
        break
      case CompanyConstants.TARGET_DOCUMENT_REQUEST:
        repository = useCompanyDocumentRequestStore()
        break
      case CompanyConstants.TARGET_COMMON_SEAL:
        repository = useCompanyCommonSealStore()
        break
      case CompanyConstants.TARGET_AUDITOR_APPOINTMENT:
        repository = useCompanyAuditorAppointmentStore()
        break
      case CompanyConstants.TARGET_NAME_RESERVATION:
        repository = useCompanyNameReservationStore()
        break
      case CompanyConstants.TARGET_DIRECTOR_MANAGER_APPOINTMENT:
        repository = useCompanyDirectorManagerAppointmentStore()
        break
      case CompanyConstants.TARGET_DIRECTOR_LOAN:
        repository = useCompanyDirectorLoanStore()
        break
      default:
        break
    }

    if (!repository) {
      return
    }

    await repository.remove(targetId)
  }
}
