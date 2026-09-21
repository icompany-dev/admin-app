// NOTE: This is an expansion on the existing allotment model
//    -- we break it out from the old model to simplify data handling
import { ConsiderationPerShareType, ConsiderationType, PurposeOfAllotment } from "../constants/AllotmentOfShares"
import { ShareType } from "../constants/Shareholder"
import { CompanyShareAllotToExternal } from "./CompanyShareAllotToExternal"

export class CompanyShareholderAllotmentDetail {
  allotmentId: string = ""
  numberOfShares: number = 1
  typeOfShares: ShareType = ShareType.Ordinary
  proposedTotalSubscriptionAmount: number = 1 // minimum, in RM
  considerationPerShare: number = 1 // minimum
  considerationPerSharetype: ConsiderationPerShareType = ConsiderationPerShareType.Cash
  considerationType: ConsiderationType = ConsiderationType.FullyPaid
  maxShareholderAfterAllotment: number = 1
  purposeOfAllotment: PurposeOfAllotment = PurposeOfAllotment.WorkingCapital
  amountPaid: number = 0
  isPayableUponCall: boolean = false
  paymentDueDate: string | null = null

  actionInCaseUnsubscribed: string = "none"

  newAllottees: CompanyShareAllotToExternal[] = []

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CompanyShareholderAllotmentDetail) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.allotmentId = data.allotment_id
    this.numberOfShares = data.number_of_shares ?? 1
    this.typeOfShares = data.type_of_shares ?? ShareType.Ordinary
    this.proposedTotalSubscriptionAmount = data.proposed_total_subscription_amount ?? 1
    this.considerationPerShare = data.consideration_per_share ?? 1
    this.considerationPerSharetype = data.consideration_per_sharetype ?? ConsiderationPerShareType.Cash
    this.considerationType = data.consideration_type ?? ConsiderationType.FullyPaid
    this.maxShareholderAfterAllotment = data.max_shareholder_after_allotment ?? 1
    this.amountPaid = data.amount_paid ?? 0
    this.isPayableUponCall = data.is_payable_upon_call ?? false
    this.paymentDueDate = data.payment_due_date ?? null
    this.newAllottees =
      data.new_allottees && Array.isArray(data.new_allottees)
        ? data.new_allottees.map((d: any) => {
            return new CompanyShareAllotToExternal(d)
          })
        : []
  }

  clone(data: CompanyShareholderAllotmentDetail): void {
    this.allotmentId = data.allotmentId
    this.numberOfShares = data.numberOfShares
    this.typeOfShares = data.typeOfShares
    this.proposedTotalSubscriptionAmount = data.proposedTotalSubscriptionAmount
    this.considerationPerShare = data.considerationPerShare
    this.considerationPerSharetype = data.considerationPerSharetype
    this.considerationType = data.considerationType
    this.maxShareholderAfterAllotment = data.maxShareholderAfterAllotment
    this.amountPaid = data.amountPaid
    this.isPayableUponCall = data.isPayableUponCall
    this.paymentDueDate = data.paymentDueDate
    this.newAllottees = data.newAllottees.map((d: any) => {
      return new CompanyShareAllotToExternal(d)
    })
  }

  getRequestBody(): object {
    return {
      number_of_shares: this.numberOfShares,
      type_of_shares: this.typeOfShares,
      proposed_total_subscription_amount: this.proposedTotalSubscriptionAmount,
      consideration_per_share: this.considerationPerShare,
      consideration_per_sharetype: this.considerationPerSharetype,
      consideration_type: this.considerationType,
      max_shareholder_after_allotment: this.maxShareholderAfterAllotment,
      purpose_of_allotment: this.purposeOfAllotment,
      amount_paid: this.amountPaid,
      is_payable_upon_call: this.isPayableUponCall,
      payment_due_date: this.paymentDueDate,
      new_allottees: this.newAllottees.map((d: CompanyShareAllotToExternal) => {
        return d.getRequestBody()
      }),
    }
  }
}
