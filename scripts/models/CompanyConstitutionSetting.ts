import { CompanyTypes, ConstitutionSettings } from "../constants/ConstitutionSettings"
import { Company } from "./Company"
import { CompanyConstitutionSettingPurposeOfCompany } from "./CompanyConstitutionSettingPurposeOfCompany"
import { CompanyConstitutionSettingTypesAndClassOfShare } from "./CompanyConstitutionSettingTypesAndClassOfShare"
import { CompanyConstitutionSettingAllotmentAndPRN } from "./CompanyConstitutionSettingAllotmentAndPRN"
import { CompanyConstitutionSettingReductionOfShares } from "./CompanyConstitutionSettingReductionOfShares"
import { CompanyConstitutionSettingInstrumentOfTransfer } from "./CompanyConstitutionSettingInstrumentOfTransfer"
import { CompanyConstitutionSettingRegisterTransfer } from "./CompanyConstitutionSettingRegisterTransfer"
import { CompanyConstitutionSettingTransmissionOfSharesByLaw } from "./CompanyConstitutionSettingTransmissionOfSharesByLaw"
import { CompanyConstitutionSettingEvidenceOfTitle } from "./CompanyConstitutionSettingEvidenceOfTitle"
import { CompanyConstitutionSettingConveningMeeting } from "./CompanyConstitutionSettingConveningMeeting"
import { CompanyConstitutionSettingVenueFormatMeeting } from "./CompanyConstitutionSettingVenueFormatMeeting"
import { CompanyConstitutionSettingNoticeOfMeeting } from "./CompanyConstitutionSettingNoticeOfMeeting"
import { CompanyConstitutionSettingBusinessGeneralMeeting } from "./CompanyConstitutionSettingBusinessGeneralMeeting"
import { CompanyConstitutionSettingQuorumRequirement } from "./CompanyConstitutionSettingQuorumRequirement"
import { CompanyConstitutionSettingFailToMeetQuorum } from "./CompanyConstitutionSettingFailToMeetQuorum"
import { CompanyConstitutionSettingElectronicParticipation } from "./CompanyConstitutionSettingElectronicParticipation"
import { CompanyConstitutionSettingVotingAtMeeting } from "./CompanyConstitutionSettingVotingAtMeeting"
import { CompanyConstitutionSettingWrittenResolution } from "./CompanyConstitutionSettingWrittenResolution"
import { CompanyConstitutionSettingProxyCorporateRepresentative } from "./CompanyConstitutionSettingProxyCorporateRepresentative"
import { CompanyConstitutionSettingMethodToAppointDirector } from "./CompanyConstitutionSettingMethodToAppointDirector"
import { CompanyConstitutionSettingCasualVacanciesOfDirector } from "./CompanyConstitutionSettingCasualVacanciesOfDirector"
import { CompanyConstitutionSettingRemovalOfDirector } from "./CompanyConstitutionSettingRemovalOfDirector"
import { CompanyConstitutionSettingChairman } from "./CompanyConstitutionSettingChairman"
import { CompanyConstitutionSettingDirectorPowersAndDuty } from "./CompanyConstitutionSettingDirectorPowersAndDuty"
import { CompanyConstitutionSettingDirectorMeeting } from "./CompanyConstitutionSettingDirectorMeeting"
import { CompanyConstitutionSettingQuorumForBoard } from "./CompanyConstitutionSettingQuorumForBoard"
import { CompanyConstitutionSettingWrittenDcr } from "./CompanyConstitutionSettingWrittenDcr"
import { CompanyConstitutionSettingManagingDirector } from "./CompanyConstitutionSettingManagingDirector"
import { CompanyConstitutionSettingVotingAtBoard } from "./CompanyConstitutionSettingVotingAtBoard"
import { CompanyConstitutionSettingScopeDutiesAuthority } from "./CompanyConstitutionSettingScopeDutiesAuthority"
import { CompanyConstitutionSettingRevocation } from "./CompanyConstitutionSettingRevocation"
import { CompanyConstitutionSettingCeo } from "./CompanyConstitutionSettingCeo"
import { CompanyConstitutionSettingCeoDuty } from "./CompanyConstitutionSettingCeoDuty"
import { CompanyConstitutionSettingCeoRevocation } from "./CompanyConstitutionSettingCeoRevocation"
import { CompanyConstitutionSettingSealCustody } from "./CompanyConstitutionSettingSealCustody"
import { CompanyConstitutionSettingSealAuthority } from "./CompanyConstitutionSettingSealAuthority"
import { CompanyConstitutionSettingSealSign } from "./CompanyConstitutionSettingSealSign"
import { CompanyConstitutionSettingSealDispenseUse } from "./CompanyConstitutionSettingSealDispenseUse"
import { CompanyConstitutionSettingDividend } from "./CompanyConstitutionSettingDividend"
import { CompanyConstitutionSettingDividendRestriction } from "./CompanyConstitutionSettingDividendRestriction"
import { CompanyConstitutionSettingCapitalisationOfProfit } from "./CompanyConstitutionSettingCapitalisationOfProfit"
import { CompanyConstitutionSettingWindingUp } from "./CompanyConstitutionSettingWindingUp"
import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"
import { StatusConstants } from "../constants/Status"

export class CompanyConstitutionSetting {
  id: string = ""
  companyId: string = ""
  company: Company = new Company()

  typeOfCompany: string = CompanyTypes.PrivateLimitedByShares
  currency: string = "Ringgit Malaysia"

  status: string = StatusConstants.DRAFT

  purposeOfCompany: CompanyConstitutionSettingPurposeOfCompany = new CompanyConstitutionSettingPurposeOfCompany()
  typeAndClassOfShares: CompanyConstitutionSettingTypesAndClassOfShare =
    new CompanyConstitutionSettingTypesAndClassOfShare()
  allotmentAndPreEmptiveRights: CompanyConstitutionSettingAllotmentAndPRN =
    new CompanyConstitutionSettingAllotmentAndPRN()
  reductionOfShares: CompanyConstitutionSettingReductionOfShares = new CompanyConstitutionSettingReductionOfShares()
  instrumentOfTransfer: CompanyConstitutionSettingInstrumentOfTransfer =
    new CompanyConstitutionSettingInstrumentOfTransfer()
  registerTransfer: CompanyConstitutionSettingRegisterTransfer = new CompanyConstitutionSettingRegisterTransfer()
  transmitShareByLaw: CompanyConstitutionSettingTransmissionOfSharesByLaw =
    new CompanyConstitutionSettingTransmissionOfSharesByLaw()
  evidenceOfTitle: CompanyConstitutionSettingEvidenceOfTitle = new CompanyConstitutionSettingEvidenceOfTitle()
  conveningOfMeetings: CompanyConstitutionSettingConveningMeeting = new CompanyConstitutionSettingConveningMeeting()
  venueFormatMeetings: CompanyConstitutionSettingVenueFormatMeeting = new CompanyConstitutionSettingVenueFormatMeeting()
  noticeOfMeeting: CompanyConstitutionSettingNoticeOfMeeting = new CompanyConstitutionSettingNoticeOfMeeting()
  businessAtGeneralMeeting: CompanyConstitutionSettingBusinessGeneralMeeting =
    new CompanyConstitutionSettingBusinessGeneralMeeting()
  quorumRequirement: CompanyConstitutionSettingQuorumRequirement = new CompanyConstitutionSettingQuorumRequirement()
  failToMeetQuorumRequirement: CompanyConstitutionSettingFailToMeetQuorum =
    new CompanyConstitutionSettingFailToMeetQuorum()
  electronicParticipation: CompanyConstitutionSettingElectronicParticipation =
    new CompanyConstitutionSettingElectronicParticipation()
  votingAtMeetings: CompanyConstitutionSettingVotingAtMeeting = new CompanyConstitutionSettingVotingAtMeeting()
  writtenResolutions: CompanyConstitutionSettingWrittenResolution = new CompanyConstitutionSettingWrittenResolution()
  proxyCorporateRepresentative: CompanyConstitutionSettingProxyCorporateRepresentative =
    new CompanyConstitutionSettingProxyCorporateRepresentative()
  methodToAppointDirectors: CompanyConstitutionSettingMethodToAppointDirector =
    new CompanyConstitutionSettingMethodToAppointDirector()
  casualVacanciesOfDirectors: CompanyConstitutionSettingCasualVacanciesOfDirector =
    new CompanyConstitutionSettingCasualVacanciesOfDirector()
  removalOfDirectors: CompanyConstitutionSettingRemovalOfDirector = new CompanyConstitutionSettingRemovalOfDirector()
  chairman: CompanyConstitutionSettingChairman = new CompanyConstitutionSettingChairman()
  directorPowerDuties: CompanyConstitutionSettingDirectorPowersAndDuty =
    new CompanyConstitutionSettingDirectorPowersAndDuty()
  directorMeetings: CompanyConstitutionSettingDirectorMeeting = new CompanyConstitutionSettingDirectorMeeting()
  quorumForBoard: CompanyConstitutionSettingQuorumForBoard = new CompanyConstitutionSettingQuorumForBoard()
  votingInBoardMeetings: CompanyConstitutionSettingVotingAtBoard = new CompanyConstitutionSettingVotingAtBoard()
  writtenDcr: CompanyConstitutionSettingWrittenDcr = new CompanyConstitutionSettingWrittenDcr()
  managingDirector: CompanyConstitutionSettingManagingDirector = new CompanyConstitutionSettingManagingDirector()
  scopeDutiesAuthority: CompanyConstitutionSettingScopeDutiesAuthority =
    new CompanyConstitutionSettingScopeDutiesAuthority()
  revocation: CompanyConstitutionSettingRevocation = new CompanyConstitutionSettingRevocation()
  ceo: CompanyConstitutionSettingCeo = new CompanyConstitutionSettingCeo()
  ceoDuty: CompanyConstitutionSettingCeoDuty = new CompanyConstitutionSettingCeoDuty()
  ceoRevocation: CompanyConstitutionSettingCeoRevocation = new CompanyConstitutionSettingCeoRevocation()
  sealCustody: CompanyConstitutionSettingSealCustody = new CompanyConstitutionSettingSealCustody()
  sealAuthority: CompanyConstitutionSettingSealAuthority = new CompanyConstitutionSettingSealAuthority()
  sealSign: CompanyConstitutionSettingSealSign = new CompanyConstitutionSettingSealSign()
  sealDispenseUse: CompanyConstitutionSettingSealDispenseUse = new CompanyConstitutionSettingSealDispenseUse()
  dividend: CompanyConstitutionSettingDividend = new CompanyConstitutionSettingDividend()
  dividendRestrictions: CompanyConstitutionSettingDividendRestriction =
    new CompanyConstitutionSettingDividendRestriction()
  capitalisationOfProfit: CompanyConstitutionSettingCapitalisationOfProfit =
    new CompanyConstitutionSettingCapitalisationOfProfit()
  windingUp: CompanyConstitutionSettingWindingUp = new CompanyConstitutionSettingWindingUp()

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CompanyConstitutionSetting) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.companyId = data.company_id
    this.company = new Company(data.company)
    this.typeOfCompany = data.type_of_company
    this.currency = data.currency
    this.status = data.status
    this.purposeOfCompany = new CompanyConstitutionSettingPurposeOfCompany(data.purpose_of_company)
    this.typeAndClassOfShares = new CompanyConstitutionSettingTypesAndClassOfShare(data.type_and_class_of_shares)
    this.allotmentAndPreEmptiveRights = new CompanyConstitutionSettingAllotmentAndPRN(data.allotment)
    this.reductionOfShares = new CompanyConstitutionSettingReductionOfShares(data.reduction_of_shares)
    this.instrumentOfTransfer = new CompanyConstitutionSettingInstrumentOfTransfer(data.instrument_of_transfer)
    this.registerTransfer = new CompanyConstitutionSettingRegisterTransfer(data.register_transfer)
    this.transmitShareByLaw = new CompanyConstitutionSettingTransmissionOfSharesByLaw(data.transmit_share_by_law)
    this.evidenceOfTitle = new CompanyConstitutionSettingEvidenceOfTitle(data.evidence_of_title)
    this.conveningOfMeetings = new CompanyConstitutionSettingConveningMeeting(data.convene_meeting)
    this.venueFormatMeetings = new CompanyConstitutionSettingVenueFormatMeeting(data.meeting_venue)
    this.noticeOfMeeting = new CompanyConstitutionSettingNoticeOfMeeting(data.meeting_notice)
    this.businessAtGeneralMeeting = new CompanyConstitutionSettingBusinessGeneralMeeting(data.general_meeting)
    this.quorumRequirement = new CompanyConstitutionSettingQuorumRequirement(data.quorum_requirement)
    this.failToMeetQuorumRequirement = new CompanyConstitutionSettingFailToMeetQuorum(data.quorum_fail)
    this.electronicParticipation = new CompanyConstitutionSettingElectronicParticipation(data.electronic_participation)
    this.votingAtMeetings = new CompanyConstitutionSettingVotingAtMeeting(data.voting_at_meetings)
    this.writtenResolutions = new CompanyConstitutionSettingWrittenResolution(data.written_resolutions)
    this.proxyCorporateRepresentative = new CompanyConstitutionSettingProxyCorporateRepresentative(data.proxies)
    this.methodToAppointDirectors = new CompanyConstitutionSettingMethodToAppointDirector(data.appointment_method)
    this.casualVacanciesOfDirectors = new CompanyConstitutionSettingCasualVacanciesOfDirector(data.casual_vacancies)
    this.removalOfDirectors = new CompanyConstitutionSettingRemovalOfDirector(data.director_removal)
    this.chairman = new CompanyConstitutionSettingChairman(data.chairman)
    this.directorPowerDuties = new CompanyConstitutionSettingDirectorPowersAndDuty(data.director_power_duties)
    this.directorMeetings = new CompanyConstitutionSettingDirectorMeeting(data.director_meetings)
    this.quorumForBoard = new CompanyConstitutionSettingQuorumForBoard(data.quorum_for_board)
    this.votingInBoardMeetings = new CompanyConstitutionSettingVotingAtBoard(data.board_voting)
    this.writtenDcr = new CompanyConstitutionSettingWrittenDcr(data.written_dcr)
    this.managingDirector = new CompanyConstitutionSettingManagingDirector(data.managing_director)
    this.scopeDutiesAuthority = new CompanyConstitutionSettingScopeDutiesAuthority(data.scope_duties_authority)
    this.revocation = new CompanyConstitutionSettingRevocation(data.revocation)
    this.ceo = new CompanyConstitutionSettingCeo(data.ceo)
    this.ceoDuty = new CompanyConstitutionSettingCeoDuty(data.ceo_duty)
    this.ceoRevocation = new CompanyConstitutionSettingCeoRevocation(data.ceo_revocation)
    this.sealCustody = new CompanyConstitutionSettingSealCustody(data.seal_custody)
    this.sealAuthority = new CompanyConstitutionSettingSealAuthority(data.seal_authority)
    this.sealSign = new CompanyConstitutionSettingSealSign(data.seal_sign)
    this.sealDispenseUse = new CompanyConstitutionSettingSealDispenseUse(data.seal_dispense_use)
    this.dividend = new CompanyConstitutionSettingDividend(data.dividend)
    this.dividendRestrictions = new CompanyConstitutionSettingDividendRestriction(data.dividend_restrictions)
    this.capitalisationOfProfit = new CompanyConstitutionSettingCapitalisationOfProfit(data.capitalisation_of_profit)
    this.windingUp = new CompanyConstitutionSettingWindingUp(data.winding_up)
  }

  clone(data: CompanyConstitutionSetting): void {
    this.id = data.id
    this.companyId = data.companyId
    this.company = new Company(data.company)
    this.typeOfCompany = data.typeOfCompany
    this.currency = data.currency
    this.status = data.status
    this.purposeOfCompany = new CompanyConstitutionSettingPurposeOfCompany(data.purposeOfCompany)
    this.typeAndClassOfShares = new CompanyConstitutionSettingTypesAndClassOfShare(data.typeAndClassOfShares)
    this.allotmentAndPreEmptiveRights = new CompanyConstitutionSettingAllotmentAndPRN(data.allotmentAndPreEmptiveRights)
    this.reductionOfShares = new CompanyConstitutionSettingReductionOfShares(data.reductionOfShares)
    this.instrumentOfTransfer = new CompanyConstitutionSettingInstrumentOfTransfer(data.instrumentOfTransfer)
    this.registerTransfer = new CompanyConstitutionSettingRegisterTransfer(data.registerTransfer)
    this.transmitShareByLaw = new CompanyConstitutionSettingTransmissionOfSharesByLaw(data.transmitShareByLaw)
    this.evidenceOfTitle = new CompanyConstitutionSettingEvidenceOfTitle(data.evidenceOfTitle)
    this.conveningOfMeetings = new CompanyConstitutionSettingConveningMeeting(data.conveningOfMeetings)
    this.venueFormatMeetings = new CompanyConstitutionSettingVenueFormatMeeting(data.venueFormatMeetings)
    this.noticeOfMeeting = new CompanyConstitutionSettingNoticeOfMeeting(data.noticeOfMeeting)
    this.businessAtGeneralMeeting = new CompanyConstitutionSettingBusinessGeneralMeeting(data.businessAtGeneralMeeting)
    this.quorumRequirement = new CompanyConstitutionSettingQuorumRequirement(data.quorumRequirement)
    this.failToMeetQuorumRequirement = new CompanyConstitutionSettingFailToMeetQuorum(data.failToMeetQuorumRequirement)
    this.electronicParticipation = new CompanyConstitutionSettingElectronicParticipation(data.electronicParticipation)
    this.votingAtMeetings = new CompanyConstitutionSettingVotingAtMeeting(data.votingAtMeetings)
    this.writtenResolutions = new CompanyConstitutionSettingWrittenResolution(data.writtenResolutions)
    this.proxyCorporateRepresentative = new CompanyConstitutionSettingProxyCorporateRepresentative(
      data.proxyCorporateRepresentative
    )
    this.methodToAppointDirectors = new CompanyConstitutionSettingMethodToAppointDirector(data.methodToAppointDirectors)
    this.casualVacanciesOfDirectors = new CompanyConstitutionSettingCasualVacanciesOfDirector(
      data.casualVacanciesOfDirectors
    )
    this.removalOfDirectors = new CompanyConstitutionSettingRemovalOfDirector(data.removalOfDirectors)
    this.chairman = new CompanyConstitutionSettingChairman(data.chairman)
    this.directorPowerDuties = new CompanyConstitutionSettingDirectorPowersAndDuty(data.directorPowerDuties)
    this.directorMeetings = new CompanyConstitutionSettingDirectorMeeting(data.directorMeetings)
    this.quorumForBoard = new CompanyConstitutionSettingQuorumForBoard(data.quorumForBoard)
    this.votingInBoardMeetings = new CompanyConstitutionSettingVotingAtBoard(data.votingInBoardMeetings)
    this.writtenDcr = new CompanyConstitutionSettingWrittenDcr(data.writtenDcr)
    this.managingDirector = new CompanyConstitutionSettingManagingDirector(data.managingDirector)
    this.scopeDutiesAuthority = new CompanyConstitutionSettingScopeDutiesAuthority(data.scopeDutiesAuthority)
    this.revocation = new CompanyConstitutionSettingRevocation(data.revocation)
    this.ceo = new CompanyConstitutionSettingCeo(data.ceo)
    this.ceoDuty = new CompanyConstitutionSettingCeoDuty(data.ceoDuty)
    this.ceoRevocation = new CompanyConstitutionSettingCeoRevocation(data.ceoRevocation)
    this.sealCustody = new CompanyConstitutionSettingSealCustody(data.sealCustody)
    this.sealAuthority = new CompanyConstitutionSettingSealAuthority(data.sealAuthority)
    this.sealSign = new CompanyConstitutionSettingSealSign(data.sealSign)
    this.sealDispenseUse = new CompanyConstitutionSettingSealDispenseUse(data.sealDispenseUse)
    this.dividend = new CompanyConstitutionSettingDividend(data.dividend)
    this.dividendRestrictions = new CompanyConstitutionSettingDividendRestriction(data.dividendRestrictions)
    this.capitalisationOfProfit = new CompanyConstitutionSettingCapitalisationOfProfit(data.capitalisationOfProfit)
    this.windingUp = new CompanyConstitutionSettingWindingUp(data.windingUp)
  }

  // region extract information
  companyName(): string {
    return this.company.getFullName()
  }

  registrationNumberNew(): string {
    return this.company.registrationNumberNew
  }

  registrationNumberOld(): string {
    return this.company.registrationNumberOld
  }

  companyType(): string {
    return ConstitutionSettings.TYPE_PRIVATE_LIMITED_BY_SHARES.description
  }

  baseOfOperations(): string {
    if (!this.company.businessAddressLocation) {
      return "Malaysia" // Default?
    }

    return this.company.businessAddressLocation.state?.name ?? "Malaysia"
  }

  getRequestBody(): object {
    return {
      company_id: this.companyId,
      type_of_company: this.typeOfCompany,
      currency: this.currency,
      status: this.status,
    }
  }

  canSubmit(): boolean {
    return (
      !StringUtil.isNullOrEmpty(this.companyId) &&
      !StringUtil.isNullOrEmpty(this.typeOfCompany) &&
      !StringUtil.isNullOrEmpty(this.currency)
    )
  }

  async create(repository: ReturnType<typeof useCompanyConstitutionSettingStore>): Promise<void> {
    if (!this.canSubmit()) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    let response = await repository.create(data)
    if (repository.error !== null) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponse(response)
  }

  async update(repository: ReturnType<typeof useCompanyConstitutionSettingStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id) || !this.canSubmit()) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    let response = await repository.update(this.id, data)
    if (repository.error !== null) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponse(response)
  }

  async remove(repository: ReturnType<typeof useCompanyConstitutionSettingStore>): Promise<void> {
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
