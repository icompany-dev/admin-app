import { Application } from "./Application"
import type { IModelApplication } from "./IModelApplication"
import { Error } from "~/scripts/library/Error"
import { StringUtil } from "../utils/String"
import { CompanyTorDutiesAndResponsibility } from "./CompanyTorDutiesAndResponsibility"
import { CompanyTorConfidentiality } from "./CompanyTorConfidentiality"
import { CompanyTorConductConflict } from "./CompanyTorConductConflict"
import { CompanyTorReliance } from "./CompanyTorReliance"
import { CompanyTorRecordKeeping } from "./CompanyTorRecordKeeping"
import { CompanyTorInformationAccess } from "./CompanyTorInformationAccess"
import { CompanyTorAdditionalTerm } from "./CompanyTorAdditionalTerm"

export class CompanyTermOfReference
  extends Application
  implements IModelApplication<CompanyTermOfReference, ReturnType<typeof useCompanyTermOfReferenceStore>>
{
  // Section B.1
  authorityIncludeResolutionsOfMembers: boolean = true
  authorityAcceptReservedMatters: boolean = true

  // Section B.2
  isEffectiveDateCustom: boolean = false
  isEffectiveOnFirstSignature: boolean = false
  isEffectiveOnLastSignature: boolean = false
  effectiveDate: string = ""

  // Section C.1
  continueRegardlessOfChange: boolean = false
  ceasesUntilDirectorChange: boolean = true

  // Section D.2
  oversightCorporateGovernance: boolean = true
  oversightCompanyAffairs: boolean = true
  ensureStatutoryRecords: boolean = true
  monitorCompliance: boolean = true
  ensureDecisionsMinuted: boolean = true

  // Section D.3
  approveBusinessStrategy: boolean = true
  approveAnnualBudgets: boolean = true
  approveMajorInitiatives: boolean = true
  monitorPerformance: boolean = true

  // Section D.4
  approveFinancialStatements: boolean = true
  determineAuditRequirement: boolean = true
  declareDividends: boolean = true
  approveFinancing: boolean = true
  approveCapitalExpenditure: boolean = true

  // Section D.5
  identifyBusinessRisks: boolean = true
  ensureInternalControls: boolean = true
  oversightSolvency: boolean = true
  ensureCompliance: boolean = true

  // Section E.1
  authorizedDisclosure: boolean = true

  // Section E.2
  confidentialityDuringTenureOnly: boolean = true
  confidentialitySurvivesCessation: boolean = false

  // Section E.3
  boardApprovalRequired: boolean = true

  // Section E.4
  secretProfitDisclosureRequired: boolean = true
  secretProfitReturnRequired: boolean = false

  // Section F.2
  declareConflictInterest: boolean = true
  abstainFromVotingOnConflict: boolean = true
  ensureDisclosureInMinute: boolean = false

  // Section F.3
  isEnsureAllTransactionsDisclosed: boolean = true
  isEnsureApprovalsObtained: boolean = true
  isEnsureTransactionsTerms: boolean = true

  // Section G.1
  relianceOnManagement: boolean = true
  relianceOnProfessionals: boolean = true
  relianceOnDigitalAndAi: boolean = false

  // Section H.1
  minutesReflectDeliberations: boolean = false
  electronicRecordsAcceptable: boolean = true

  // Section I.1
  timelyAccessToInfo: boolean = true
  requestClarification: boolean = false
  accessCompanySecretaryRecords: boolean = false

  //Backend data
  dutiesAndResponsibilities: CompanyTorDutiesAndResponsibility = new CompanyTorDutiesAndResponsibility()
  confidentialities: CompanyTorConfidentiality = new CompanyTorConfidentiality()
  conductAndConflictOfInterest: CompanyTorConductConflict = new CompanyTorConductConflict()
  relianceOnInfoAndProfessionalAdvice: CompanyTorReliance = new CompanyTorReliance()
  recordKeepingBoardPapers: CompanyTorRecordKeeping = new CompanyTorRecordKeeping()
  accessToInformation: CompanyTorInformationAccess = new CompanyTorInformationAccess()
  additionalTerms: CompanyTorAdditionalTerm[] = []

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyTermOfReference) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)

    this.authorityIncludeResolutionsOfMembers = data.authority_include_resolutions_of_members
    this.authorityAcceptReservedMatters = data.authority_accept_reserved_matters
    this.isEffectiveDateCustom = data.is_effective_from_date
    this.isEffectiveOnFirstSignature = data.is_effective_from_document_date
    this.isEffectiveOnLastSignature = data.is_effective_from_incorporation_date
    this.effectiveDate = data.effective_date
    this.continueRegardlessOfChange = data.is_applicable_board_changes
    this.ceasesUntilDirectorChange = !data.is_applicable_board_changes

    this.dutiesAndResponsibilities = new CompanyTorDutiesAndResponsibility(data.duties_and_responsibilities)
    this.confidentialities = new CompanyTorConfidentiality(data.confidentialities)
    this.conductAndConflictOfInterest = new CompanyTorConductConflict(data.conduct_and_conflict_of_interest)
    this.relianceOnInfoAndProfessionalAdvice = new CompanyTorReliance(data.reliance_on_info_and_professional_advice)
    this.recordKeepingBoardPapers = new CompanyTorRecordKeeping(data.record_keeping_board_papers)
    this.accessToInformation = new CompanyTorInformationAccess(data.access_to_information)
    this.additionalTerms =
      data.additional_terms && Array.isArray(data.additional_terms)
        ? data.additional_terms.map((d: any) => {
            return new CompanyTorAdditionalTerm(d)
          })
        : []

    this.mapData()
  }

  cloneDetails(data: CompanyTermOfReference): void {
    super.clone(data)

    this.authorityIncludeResolutionsOfMembers = data.authorityIncludeResolutionsOfMembers
    this.authorityAcceptReservedMatters = data.authorityAcceptReservedMatters
    this.isEffectiveDateCustom = data.isEffectiveDateCustom
    this.isEffectiveOnFirstSignature = data.isEffectiveOnFirstSignature
    this.isEffectiveOnLastSignature = data.isEffectiveOnLastSignature
    this.effectiveDate = data.effectiveDate
    this.continueRegardlessOfChange = data.continueRegardlessOfChange
    this.ceasesUntilDirectorChange = data.ceasesUntilDirectorChange
    this.dutiesAndResponsibilities = new CompanyTorDutiesAndResponsibility(data.dutiesAndResponsibilities)
    this.confidentialities = new CompanyTorConfidentiality(data.confidentialities)
    this.conductAndConflictOfInterest = new CompanyTorConductConflict(data.conductAndConflictOfInterest)
    this.relianceOnInfoAndProfessionalAdvice = new CompanyTorReliance(data.relianceOnInfoAndProfessionalAdvice)
    this.recordKeepingBoardPapers = new CompanyTorRecordKeeping(data.recordKeepingBoardPapers)
    this.accessToInformation = new CompanyTorInformationAccess(data.accessToInformation)
    this.additionalTerms = data.additionalTerms.map((d: any) => {
      return new CompanyTorAdditionalTerm(d)
    })

    this.mapData()
  }

  mapData(): void {
    this.oversightCorporateGovernance = this.dutiesAndResponsibilities.isOverallCorporateGovernance
    this.oversightCompanyAffairs = this.dutiesAndResponsibilities.isOversightOfAffairs
    this.ensureStatutoryRecords = this.dutiesAndResponsibilities.isEnsureProperStatutoryRecords
    this.monitorCompliance = this.dutiesAndResponsibilities.isMonitorCompliance
    this.ensureDecisionsMinuted = this.dutiesAndResponsibilities.isEnsureDecisionsMinutedAndDocumented
    this.approveBusinessStrategy = this.dutiesAndResponsibilities.isApproveBusinessStrategy
    this.approveAnnualBudgets = this.dutiesAndResponsibilities.isApproveAnnualBudgets
    this.approveMajorInitiatives = this.dutiesAndResponsibilities.isApproveMajorOperationalInitiatives
    this.monitorPerformance = this.dutiesAndResponsibilities.isMonitorPerformance
    this.approveFinancialStatements = this.dutiesAndResponsibilities.isApproveFinancialStatements
    this.determineAuditRequirement = this.dutiesAndResponsibilities.isDetermineAuditedOrUnauditred
    this.declareDividends = this.dutiesAndResponsibilities.isDeclareOrRecommendDividends
    this.approveFinancing = this.dutiesAndResponsibilities.isApproveFinancing
    this.approveCapitalExpenditure = this.dutiesAndResponsibilities.isApproveCapitalExpenditure
    this.identifyBusinessRisks = this.dutiesAndResponsibilities.isIdentifyBusinessRisks
    this.ensureInternalControls = this.dutiesAndResponsibilities.isEnsureInternalControlsInPlace
    this.oversightSolvency = this.dutiesAndResponsibilities.isOverseeSolvency
    this.ensureCompliance = this.dutiesAndResponsibilities.isEnsureCompliance
    this.authorizedDisclosure = this.confidentialities.canDisclosureAuthorisedByBoard
    this.confidentialityDuringTenureOnly = this.confidentialities.isOnlyDuringTenure
    this.confidentialitySurvivesCessation = !this.confidentialities.isOnlyDuringTenure
    this.boardApprovalRequired = this.confidentialities.mustDirectorVentureApprovedByBoard
    this.secretProfitDisclosureRequired = this.confidentialities.mustProfitBeDisclosed
    this.secretProfitReturnRequired = this.confidentialities.mustProfitAccountedReturned
    this.declareConflictInterest = this.conductAndConflictOfInterest.mustDeclareInterest
    this.abstainFromVotingOnConflict = this.conductAndConflictOfInterest.mustAbstainFromVoting
    this.ensureDisclosureInMinute = this.conductAndConflictOfInterest.mustEnsureDisclosureMinuted
    this.isEnsureAllTransactionsDisclosed = this.conductAndConflictOfInterest.isEnsureAllTransactionsDisclosed
    this.isEnsureApprovalsObtained = this.conductAndConflictOfInterest.isEnsureApprovalsObtained
    this.isEnsureTransactionsTerms = this.conductAndConflictOfInterest.isEnsureTransactionsTerms
    this.relianceOnManagement = this.relianceOnInfoAndProfessionalAdvice.isInformationByManagement
    this.relianceOnProfessionals = this.relianceOnInfoAndProfessionalAdvice.isProfessionalAdvice
    this.relianceOnDigitalAndAi = this.relianceOnInfoAndProfessionalAdvice.isInformationByAi
    this.minutesReflectDeliberations = this.recordKeepingBoardPapers.isMinutesWithDeliberations
    this.electronicRecordsAcceptable = this.recordKeepingBoardPapers.isElectronicRecordsAcceptable
    this.timelyAccessToInfo = this.accessToInformation.canAccessCompanyInformation
    this.requestClarification = this.accessToInformation.canRequestClarification
    this.accessCompanySecretaryRecords = this.accessToInformation.canAccessRecordsFromCosec
  }

  setRecordData(): void {
    this.dutiesAndResponsibilities.isOverallCorporateGovernance = this.oversightCorporateGovernance
    this.dutiesAndResponsibilities.isOversightOfAffairs = this.oversightCompanyAffairs
    this.dutiesAndResponsibilities.isEnsureProperStatutoryRecords = this.ensureStatutoryRecords
    this.dutiesAndResponsibilities.isMonitorCompliance = this.monitorCompliance
    this.dutiesAndResponsibilities.isEnsureDecisionsMinutedAndDocumented = this.ensureDecisionsMinuted
    this.dutiesAndResponsibilities.isApproveBusinessStrategy = this.approveBusinessStrategy
    this.dutiesAndResponsibilities.isApproveAnnualBudgets = this.approveAnnualBudgets
    this.dutiesAndResponsibilities.isApproveMajorOperationalInitiatives = this.approveMajorInitiatives
    this.dutiesAndResponsibilities.isMonitorPerformance = this.monitorPerformance
    this.dutiesAndResponsibilities.isApproveFinancialStatements = this.approveFinancialStatements
    this.dutiesAndResponsibilities.isDetermineAuditedOrUnauditred = this.determineAuditRequirement
    this.dutiesAndResponsibilities.isDeclareOrRecommendDividends = this.declareDividends
    this.dutiesAndResponsibilities.isApproveFinancing = this.approveFinancing
    this.dutiesAndResponsibilities.isApproveCapitalExpenditure = this.approveCapitalExpenditure
    this.dutiesAndResponsibilities.isIdentifyBusinessRisks = this.identifyBusinessRisks
    this.dutiesAndResponsibilities.isEnsureInternalControlsInPlace = this.ensureInternalControls
    this.dutiesAndResponsibilities.isOverseeSolvency = this.oversightSolvency
    this.dutiesAndResponsibilities.isEnsureCompliance = this.ensureCompliance
    this.confidentialities.canDisclosureAuthorisedByBoard = this.authorizedDisclosure
    this.confidentialities.isOnlyDuringTenure = this.confidentialityDuringTenureOnly
    this.confidentialities.isOnlyDuringTenure = this.confidentialitySurvivesCessation
    this.confidentialities.mustDirectorVentureApprovedByBoard = this.boardApprovalRequired
    this.confidentialities.mustProfitBeDisclosed = this.secretProfitDisclosureRequired
    this.confidentialities.mustProfitAccountedReturned = this.secretProfitReturnRequired
    this.conductAndConflictOfInterest.mustDeclareInterest = this.declareConflictInterest
    this.conductAndConflictOfInterest.mustAbstainFromVoting = this.abstainFromVotingOnConflict
    this.conductAndConflictOfInterest.mustEnsureDisclosureMinuted = this.ensureDisclosureInMinute
    this.conductAndConflictOfInterest.isEnsureAllTransactionsDisclosed = this.isEnsureAllTransactionsDisclosed
    this.conductAndConflictOfInterest.isEnsureApprovalsObtained = this.isEnsureApprovalsObtained
    this.conductAndConflictOfInterest.isEnsureTransactionsTerms = this.isEnsureTransactionsTerms
    this.relianceOnInfoAndProfessionalAdvice.isInformationByManagement = this.relianceOnManagement
    this.relianceOnInfoAndProfessionalAdvice.isProfessionalAdvice = this.relianceOnProfessionals
    this.relianceOnInfoAndProfessionalAdvice.isInformationByAi = this.relianceOnDigitalAndAi
    this.recordKeepingBoardPapers.isMinutesWithDeliberations = this.minutesReflectDeliberations
    this.recordKeepingBoardPapers.isElectronicRecordsAcceptable = this.electronicRecordsAcceptable
    this.accessToInformation.canAccessCompanyInformation = this.timelyAccessToInfo
    this.accessToInformation.canRequestClarification = this.requestClarification
    this.accessToInformation.canAccessRecordsFromCosec = this.accessCompanySecretaryRecords
  }

  getRequestBody(): object {
    this.setRecordData()

    return {
      company_id: this.companyId,
      status: this.status,
      document_date: null,
      is_effective_from_date: this.isEffectiveDateCustom,
      is_effective_from_document_date: this.isEffectiveOnFirstSignature,
      is_effective_from_incorporation_date: this.isEffectiveOnLastSignature,
      effective_date: this.effectiveDate,
      is_applicable_board_changes: this.continueRegardlessOfChange,
      duties_and_responsibilities: this.dutiesAndResponsibilities.getRequestBody(),
      confidentialities: this.confidentialities.getRequestBody(),
      conduct_and_conflict_of_interest: this.conductAndConflictOfInterest.getRequestBody(),
      reliance_on_info_and_professional_advice: this.relianceOnInfoAndProfessionalAdvice.getRequestBody(),
      record_keeping_board_papers: this.recordKeepingBoardPapers.getRequestBody(),
      access_to_information: this.accessToInformation.getRequestBody(),
    }
  }

  canSubmit(): boolean {
    return !StringUtil.isNullOrEmpty(this.companyId)
  }

  async create(repository: ReturnType<typeof useCompanyTermOfReferenceStore>): Promise<void> {
    if (!this.canSubmit()) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.create(data)
    if (repository.error) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponseDetails(response)
  }

  async update(repository: ReturnType<typeof useCompanyTermOfReferenceStore>): Promise<void> {
    if (!this.canSubmit() || StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.update(this.id, data)
    if (repository.error) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponseDetails(response)
  }

  async remove(repository: ReturnType<typeof useCompanyTermOfReferenceStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    const response = await repository.remove(this.id)
    if (repository.error) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    return response
  }
}
