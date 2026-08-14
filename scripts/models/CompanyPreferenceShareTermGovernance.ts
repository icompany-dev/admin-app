import {
  PreferenceShareTransferabilityStatus,
  PreferenceShareDisputeResolutionMethod,
} from "~/scripts/constants/PreferenceShareTerms"
import { StringUtil } from "../utils/String"
import { Error } from "../library/Error"

export class CompanyPreferenceShareTermGovernance {
  id: string = ""
  termSheetId: string = ""
  isParticipateInSurplusAsset: boolean | null = null
  transferabilityStatus: PreferenceShareTransferabilityStatus | null = null
  informationRightsGranted: string[] = [] // JSON field: typically an array of strings e.g. ['Monthly Accounts', 'Annual Budget']
  hasRightToAppointDirector: boolean = false
  investorDirectorSeats: number | null = null
  hasNoBoardRepresentative: boolean = false
  hasObserverSeat: boolean = false
  hasDragAlong: boolean = false
  dragAlongThresholdPercent: number | null = null
  hasTagAlong: boolean = false
  tagAlongThresholdPercent: number | null = null
  isROFRApplies: boolean = false
  isROFOApplies: boolean = false
  rofoNoticePeriod: number | null = null
  hasLockInPeriod: boolean = false
  lockInPeriodMonths: number | null = null
  lockedInShareholders: string | null = null // Stored as Text in DB
  disputeNegotiationDays: number = 0
  isDisputeEscalationRequired: boolean = false
  isDisputeMediationRequired: boolean = false
  isDisputeMediationOptional: boolean = false
  isNoDisputeMediation: boolean = false
  disputeResolutionMethod: PreferenceShareDisputeResolutionMethod | null =
    PreferenceShareDisputeResolutionMethod.ArbitrationAiac
  arbitrationSeat: string = "Kuala Lumpur"
  createdAt: string = ""
  updatedAt: string = ""
  deletedAt: string | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CompanyPreferenceShareTermGovernance) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id ?? ""
    this.termSheetId = data.term_sheet_id ?? ""
    this.isParticipateInSurplusAsset = data.is_participate_in_surplus_asset ?? false
    this.transferabilityStatus = (data.transferability_status as PreferenceShareTransferabilityStatus) ?? null
    if (typeof data.information_rights_granted === "string") {
      try {
        this.informationRightsGranted = JSON.parse(data.information_rights_granted)
      } catch (e) {
        this.informationRightsGranted = []
      }
    } else if (Array.isArray(data.information_rights_granted)) {
      this.informationRightsGranted = data.information_rights_granted
    } else {
      this.informationRightsGranted = []
    }
    this.hasRightToAppointDirector = data.has_right_to_appoint_director ?? false
    this.investorDirectorSeats = data.investor_director_seats ? Number(data.investor_director_seats) : null
    this.hasNoBoardRepresentative = data.has_no_board_representative ?? false
    this.hasObserverSeat = Boolean(data.has_observer_seat)
    this.hasDragAlong = Boolean(data.has_drag_along)
    this.dragAlongThresholdPercent = data.drag_along_threshold_percent
      ? Number(data.drag_along_threshold_percent)
      : null
    this.hasTagAlong = Boolean(data.has_tag_along)
    this.tagAlongThresholdPercent = data.tag_along_threshold_percent ? Number(data.tag_along_threshold_percent) : null
    this.isROFRApplies = data.is_rofr_applies ?? false
    this.isROFOApplies = data.is_rofo_applies ?? false
    this.rofoNoticePeriod = Number(data.rofo_notice_period) ?? null
    this.hasLockInPeriod = Boolean(data.has_lock_in_period)
    this.lockInPeriodMonths = data.lock_in_period_months ? Number(data.lock_in_period_months) : null
    this.lockedInShareholders = data.locked_in_shareholders ?? null
    this.disputeNegotiationDays = data.dispute_negotiation_days ?? 0
    this.isDisputeEscalationRequired = data.is_dispute_escalation_required ?? false
    this.isDisputeMediationRequired = data.is_dispute_mediation_required ?? false
    this.isDisputeMediationOptional = data.is_dispute_mediation_optional ?? false
    this.isNoDisputeMediation = data.is_no_dispute_mediation ?? false
    this.disputeResolutionMethod = (data.dispute_resolution_method as PreferenceShareDisputeResolutionMethod) ?? null
    this.arbitrationSeat = data.arbitration_seat ?? "Kuala Lumpur"
    this.createdAt = data.created_at ?? ""
    this.updatedAt = data.updated_at ?? ""
    this.deletedAt = data.deleted_at ?? null
  }

  clone(data: CompanyPreferenceShareTermGovernance): void {
    this.id = data.id
    this.termSheetId = data.termSheetId
    this.isParticipateInSurplusAsset = data.isParticipateInSurplusAsset
    this.transferabilityStatus = data.transferabilityStatus
    this.informationRightsGranted = Array.isArray(data.informationRightsGranted)
      ? [...data.informationRightsGranted]
      : []
    this.hasRightToAppointDirector = data.hasRightToAppointDirector
    this.investorDirectorSeats = data.investorDirectorSeats
    this.hasNoBoardRepresentative = data.hasNoBoardRepresentative
    this.hasObserverSeat = data.hasObserverSeat
    this.hasDragAlong = data.hasDragAlong
    this.dragAlongThresholdPercent = data.dragAlongThresholdPercent
    this.hasTagAlong = data.hasTagAlong
    this.tagAlongThresholdPercent = data.tagAlongThresholdPercent
    this.isROFRApplies = data.isROFRApplies
    this.isROFOApplies = data.isROFOApplies
    this.rofoNoticePeriod = data.rofoNoticePeriod
    this.hasLockInPeriod = data.hasLockInPeriod
    this.lockInPeriodMonths = data.lockInPeriodMonths
    this.lockedInShareholders = data.lockedInShareholders
    this.disputeNegotiationDays = data.disputeNegotiationDays
    this.isDisputeEscalationRequired = data.isDisputeEscalationRequired
    this.isDisputeMediationRequired = data.isDisputeMediationRequired
    this.isDisputeMediationOptional = data.isDisputeMediationOptional
    this.isNoDisputeMediation = data.isNoDisputeMediation
    this.disputeResolutionMethod = data.disputeResolutionMethod
    this.arbitrationSeat = data.arbitrationSeat
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
    this.deletedAt = data.deletedAt
  }

  getRequestBody(): object {
    return {
      is_participate_in_surplus_asset: this.isParticipateInSurplusAsset,
      transferability_status: this.transferabilityStatus,
      information_rights_granted: this.informationRightsGranted,
      has_right_to_appoint_director: this.hasRightToAppointDirector,
      investor_director_seats: this.investorDirectorSeats,
      has_no_board_representative: this.hasNoBoardRepresentative,
      has_observer_seat: this.hasObserverSeat,
      has_drag_along: this.hasDragAlong,
      drag_along_threshold_percent: this.dragAlongThresholdPercent,
      has_tag_along: this.hasTagAlong,
      tag_along_threshold_percent: this.tagAlongThresholdPercent,
      is_rofr_applies: this.isROFRApplies,
      is_rofo_applies: this.isROFOApplies,
      rofo_notice_period: this.rofoNoticePeriod,
      has_lock_in_period: this.hasLockInPeriod,
      lock_in_period_months: this.lockInPeriodMonths,
      locked_in_shareholders: this.lockedInShareholders,
      dispute_negotiation_days: this.disputeNegotiationDays,
      is_dispute_escalation_required: this.isDisputeEscalationRequired,
      is_dispute_mediation_required: this.isDisputeMediationRequired,
      is_dispute_mediation_optional: this.isDisputeMediationOptional,
      is_no_dispute_mediation: this.isNoDisputeMediation,
      dispute_resolution_method: this.disputeResolutionMethod,
      arbitration_seat: this.arbitrationSeat,
    }
  }

  canSubmit(): boolean {
    return !StringUtil.isNullOrEmpty(this.termSheetId)
  }

  async update(repository: ReturnType<typeof useCompanyPreferenceShareTermGovernanceStore>): Promise<void> {
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

    this.convertFromResponse(response)
  }
}
