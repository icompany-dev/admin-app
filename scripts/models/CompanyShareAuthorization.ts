import { Application } from "./Application"
import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"
import type { IModelApplication } from "./IModelApplication"

export class CompanyShareAuthorization
  extends Application
  implements IModelApplication<CompanyShareAuthorization, ReturnType<typeof useCompanyShareAuthorizationStore>>
{
  maxPercentageAllowed: number | null = 100
  maxConsiderationAmountAllowed: number | null = 100
  maxUnitsOfSharesAllowed: number | null = 100
  pricePerShareAllowed: number | null = 100
  isPrnWaivable: boolean = false
  purposeOfProposedAllotment: string[] = []
  canSetNumberClassShares: boolean = false
  canSetIssuePrice: boolean = false
  canAcceptRejectSubscription: boolean = false
  effectiveDateType: string = ""
  effectiveDate: string | null = null
  validTill: string = ""
  initiatedBy: boolean = false

  // isShareholdingChangeable: boolean = false
  // isOfferableToExternal: boolean = false
  // isBeneficialToCompany: boolean = false

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyShareAuthorization) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.maxPercentageAllowed = data.max_percentage_allowed ?? null
    this.maxConsiderationAmountAllowed = data.max_consideration_amount_allowed ?? 1
    this.maxUnitsOfSharesAllowed = data.max_units_of_shares_allowed ?? 1
    this.pricePerShareAllowed = data.price_per_share_allowed ?? 1
    this.isPrnWaivable = data.is_prn_waivable ?? false
    this.purposeOfProposedAllotment = data.purpose_of_proposed_allotment
      ? data.purpose_of_proposed_allotment.split(",")
      : []
    // this.isShareholdingChangeable = data.is_shareholding_changeable ?? false
    // this.isOfferableToExternal = data.is_offerable_to_external ?? false
    // this.isBeneficialToCompany = data.is_beneficial_to_company ?? false
    this.canSetNumberClassShares = data.can_set_number_class_shares ?? false
    this.canSetIssuePrice = data.can_set_issue_price ?? false
    this.canAcceptRejectSubscription = data.can_accept_reject_subscription ?? false
    this.effectiveDateType = data.effective_date_type ?? ""
    this.effectiveDate = data.effective_date ?? false
    this.validTill = data.valid_till ?? ""
    this.initiatedBy = data.initiated_by ?? false
  }

  cloneDetails(data: CompanyShareAuthorization): void {
    super.clone(data)
    this.maxPercentageAllowed = data.maxPercentageAllowed
    this.maxConsiderationAmountAllowed = data.maxConsiderationAmountAllowed
    this.maxUnitsOfSharesAllowed = data.maxUnitsOfSharesAllowed
    this.pricePerShareAllowed = data.pricePerShareAllowed
    this.isPrnWaivable = data.isPrnWaivable
    this.purposeOfProposedAllotment = data.purposeOfProposedAllotment
    // this.isShareholdingChangeable = data.isShareholdingChangeable
    // this.isOfferableToExternal = data.isOfferableToExternal
    // this.isBeneficialToCompany = data.isBeneficialToCompany
    this.canSetNumberClassShares = data.canSetNumberClassShares
    this.canSetIssuePrice = data.canSetIssuePrice
    this.canAcceptRejectSubscription = data.canAcceptRejectSubscription
    this.effectiveDateType = data.effectiveDateType
    this.effectiveDate = data.effectiveDate
    this.validTill = data.validTill
    this.initiatedBy = data.initiatedBy
  }

  getRequestBody(): object {
    return {
      company_id: this.companyId,
      max_percentage_allowed: this.maxPercentageAllowed,
      max_consideration_amount_allowed: this.maxConsiderationAmountAllowed,
      max_units_of_shares_allowed: this.maxUnitsOfSharesAllowed,
      price_per_share_allowed: this.pricePerShareAllowed,
      is_prn_waivable: this.isPrnWaivable,
      purpose_of_proposed_allotment: this.purposeOfProposedAllotment.join(","),
      // is_shareholding_changeable: this.isShareholdingChangeable,
      // is_offerable_to_external: this.isOfferableToExternal,
      // is_beneficial_to_company: this.isBeneficialToCompany,
      can_set_number_class_shares: this.canSetNumberClassShares,
      can_set_issue_price: this.canSetIssuePrice,
      can_accept_reject_subscription: this.canAcceptRejectSubscription,
      effective_date_type: this.effectiveDateType,
      // effective_date: this.effectiveDate,
      // valid_till: this.validTill,
      status: this.status,
    }
  }

  canSubmit(): boolean {
    return !StringUtil.isNullOrEmpty(this.companyId)
  }

  async create(repository: ReturnType<typeof useCompanyShareAuthorizationStore>): Promise<void> {
    if (!this.canSubmit()) {
      let error: Error = new Error()
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.create(data)
    if (repository.error) {
      let error: Error = new Error()
      error.setForCUD()
      throw error
    }

    this.convertFromResponseDetails(response)
  }

  async update(repository: ReturnType<typeof useCompanyShareAuthorizationStore>): Promise<void> {
    if (!this.canSubmit() || StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error()
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.update(this.id, data)
    if (repository.error) {
      let error: Error = new Error()
      error.setForCUD()
      throw error
    }

    this.convertFromResponseDetails(response)
  }

  async remove(repository: ReturnType<typeof useCompanyShareAuthorizationStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error()
      error.setForIncompleteData()
      throw error
    }

    const response = await repository.remove(this.id)
    if (repository.error) {
      let error: Error = new Error()
      error.setForCUD()
      throw error
    }

    return response
  }
}
