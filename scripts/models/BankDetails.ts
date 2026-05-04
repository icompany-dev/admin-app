import { BankComparisonItem } from "./BankComparisonItem"

export interface OnlineBankingInfo {
  days: number
  name: string
  notes: string
}

export interface BranchInfo {
  name: string
  notes: string
}

export class BankDetails {
  id = ""
  name = ""
  bankType = ""
  documentRequired: BankComparisonItem[] = []
  documentRequiredNotes = ""
  requireBranchVisit = false
  branchVisitReason = ""
  verificationProcess: BankComparisonItem[] = []
  onlineBanking: OnlineBankingInfo = { days: 0, name: "", notes: "" }
  digitalServices: BankComparisonItem[] = []
  branchesToAvoid: BranchInfo[] = []
  hasMinimumDeposit = false
  minimumDeposit = 0
  minimumDepositNotes = ""
  plusPoint: BranchInfo[] = []
  otherNotes: BranchInfo[] = []
  activationTimeline = ""
  url = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    this.id = data.id || ""
    this.name = data.name || ''
    this.bankType = data.bankType || ""
    this.documentRequired = BankComparisonItem.fromArray(data.documentRequired)
    this.documentRequiredNotes = data.documentRequiredNotes || ""
    this.requireBranchVisit = data.requireBranchVisit || false
    this.branchVisitReason = data.branchVisitReason || ""
    this.verificationProcess = BankComparisonItem.fromArray(data.verificationProcess)
    this.onlineBanking = data.onlineBanking || { days: 0, name: "", notes: "" }
    this.digitalServices = BankComparisonItem.fromArray(data.digitalServices)
    this.branchesToAvoid = this.parseBranchInfoArray(data.branchesToAvoid)
    this.hasMinimumDeposit = data.hasMinimumDeposit || false
    this.minimumDeposit = data.minimumDeposit || 0
    this.minimumDepositNotes = data.minimumDepositNotes || ""
    this.plusPoint = this.parseBranchInfoArray(data.plusPoint)
    this.otherNotes = this.parseBranchInfoArray(data.otherNotes)
    this.activationTimeline = data.activationTimeline || ""
    this.url = data.url || ""
  }

  parseBranchInfoArray(items: any): BranchInfo[] {
    if (!items || !Array.isArray(items)) {
      return []
    }

    return items.map(item => {
      if (typeof item === "string") {
        return { name: item, notes: "" }
      }
      return { name: item.name || "", notes: item.notes || "" }
    })
  }
}
