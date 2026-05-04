import {
  PreferenceSharePaymentTermType,
  PreferenceShareConfidentialityType,
  PreferenceShareExpenseBearerType,
  PreferenceShareCompletionOverdueAction,
} from "~/scripts/constants/PreferenceShareTerms"
import { Company } from "~/scripts/models/Company"
import { CompanyPreferenceShareTermFinancial } from "./CompanyPreferenceShareTermFinancial"
import { CompanyPreferenceShareTermGovernance } from "./CompanyPreferenceShareTermGovernance"
import { CompanyPreferenceShareTermChecklist } from "./CompanyPreferenceShareTermChecklist"
import { StatusConstants } from "../constants/Status"
import { StringUtil } from "../utils/String"
import { Error } from "../library/Error"

export class CompanyPreferenceShareTerm {
  id: string = ""
  companyId: string = ""
  company: Company = new Company()
  investorName: string | null = null
  termSheetDate: string | null = null
  subscriptionAmount: number | null = null
  issuePricePerShare: number | null = null
  totalNumberOfShares: number | null = null
  paymentTermType: string = PreferenceSharePaymentTermType.LumpSum
  classDesignation: string | null = null
  shareType: string | null = null
  otherShareType: string | null = null
  completionDeadline: string | null = null
  completionOverdueAction: PreferenceShareCompletionOverdueAction | null = null
  deadlinePostCompletion: number | null = null
  confidentialityType: string | null = PreferenceShareConfidentialityType.Mutual
  confidentialityDurationYears: number = 2
  expenseBearer: string | null = PreferenceShareExpenseBearerType.EachPartyBearsOwn
  isCompanyBearAdminCost: boolean = false
  financial: CompanyPreferenceShareTermFinancial = new CompanyPreferenceShareTermFinancial()
  governance: CompanyPreferenceShareTermGovernance = new CompanyPreferenceShareTermGovernance()
  checklists: CompanyPreferenceShareTermChecklist[] = []
  status: string = StatusConstants.DRAFT
  createdAt: string = ""
  updatedAt: string = ""
  deletedAt: string | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CompanyPreferenceShareTerm) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id ?? ""
    this.companyId = data.company_id ?? ""
    this.company = new Company(data.company)
    this.investorName = data.investor_name ?? null
    this.termSheetDate = data.term_sheet_date ?? null
    this.subscriptionAmount = data.subscription_amount ? Number(data.subscription_amount) : null
    this.issuePricePerShare = data.issue_price_per_share ? Number(data.issue_price_per_share) : null
    this.totalNumberOfShares = data.total_number_of_shares ? Number(data.total_number_of_shares) : null
    this.paymentTermType = data.payment_term_type ?? PreferenceSharePaymentTermType.LumpSum
    this.classDesignation = data.class_designation ?? null
    this.shareType = data.share_type ?? null
    this.otherShareType = data.other_share_type ?? null
    this.completionDeadline = data.completion_deadline ?? null
    this.completionOverdueAction = data.completion_overdue_action ?? null
    this.deadlinePostCompletion = data.deadline_post_completion ? Number(data.deadline_post_completion) : null
    this.confidentialityType = data.confidentiality_type ?? PreferenceShareConfidentialityType.Mutual
    this.confidentialityDurationYears = data.confidentiality_duration_years
      ? Number(data.confidentiality_duration_years)
      : 2
    this.expenseBearer = data.expense_bearer ?? PreferenceShareExpenseBearerType.EachPartyBearsOwn
    this.isCompanyBearAdminCost = data.is_company_bear_admin_cost
    this.financial = new CompanyPreferenceShareTermFinancial(data.financial)
    this.governance = new CompanyPreferenceShareTermGovernance(data.governance)
    this.checklists =
      data.checklists && Array.isArray(data.checklists)
        ? data.checklists.map((d: any) => {
            return new CompanyPreferenceShareTermChecklist(d)
          })
        : []
    this.status = data.status
    this.createdAt = data.created_at ?? ""
    this.updatedAt = data.updated_at ?? ""
    this.deletedAt = data.deleted_at ?? null
  }

  clone(data: CompanyPreferenceShareTerm): void {
    this.id = data.id
    this.companyId = data.companyId
    this.company = new Company(data.company)
    this.investorName = data.investorName
    this.termSheetDate = data.termSheetDate
    this.subscriptionAmount = data.subscriptionAmount
    this.issuePricePerShare = data.issuePricePerShare
    this.totalNumberOfShares = data.totalNumberOfShares
    this.paymentTermType = data.paymentTermType
    this.classDesignation = data.classDesignation
    this.shareType = data.shareType
    this.otherShareType = data.otherShareType
    this.completionDeadline = data.completionDeadline
    this.completionOverdueAction = data.completionOverdueAction
    this.deadlinePostCompletion = data.deadlinePostCompletion
    this.confidentialityType = data.confidentialityType
    this.confidentialityDurationYears = data.confidentialityDurationYears
    this.expenseBearer = data.expenseBearer
    this.isCompanyBearAdminCost = data.isCompanyBearAdminCost
    this.financial = new CompanyPreferenceShareTermFinancial(data.financial)
    this.governance = new CompanyPreferenceShareTermGovernance(data.governance)
    this.checklists = data.checklists.map((d: any) => {
      return new CompanyPreferenceShareTermChecklist(d)
    })
    this.status = data.status
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
    this.deletedAt = data.deletedAt
  }

  getRequestBody(): object {
    return {
      company_id: this.companyId,
      investor_name: this.investorName,
      term_sheet_date: this.termSheetDate,
      subscription_amount: this.subscriptionAmount,
      issue_price_per_share: this.issuePricePerShare,
      total_number_of_shares: this.totalNumberOfShares,
      payment_term_type: this.paymentTermType,
      class_designation: this.classDesignation,
      share_type: this.shareType,
      other_share_type: this.otherShareType,
      completion_deadline: this.completionDeadline,
      completion_overdue_action: this.completionOverdueAction,
      deadline_post_completion: this.deadlinePostCompletion,
      confidentiality_type: this.confidentialityType,
      confidentiality_duration_years: this.confidentialityDurationYears,
      expense_bearer: this.expenseBearer,
      is_company_bear_admin_cost: this.isCompanyBearAdminCost,
      status: this.status,
    }
  }

  canSubmit(): boolean {
    return !StringUtil.isNullOrEmpty(this.companyId)
  }

  async create(repository: ReturnType<typeof useCompanyPreferenceShareTermStore>): Promise<void> {
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

    this.convertFromResponse(response)
  }

  async update(repository: ReturnType<typeof useCompanyPreferenceShareTermStore>): Promise<void> {
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

  async remove(repository: ReturnType<typeof useCompanyPreferenceShareTermStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    const response = await repository.remove(this.id)
    if (repository.error) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    return response
  }
}
