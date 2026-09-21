import { Application } from "~/scripts/models/Application"
import { File } from "~/scripts/models/File"
import { FundDeclarationConsiderationType, FundDeclarationSource } from "../constants/AllotmentOfShares"
import { StringUtil } from "../utils/String"
import type { IModelApplication } from "./IModelApplication"
import { Error } from "../library/Error"

export class CompanyFundSourceDeclaration
  extends Application
  implements IModelApplication<CompanyFundSourceDeclaration, ReturnType<typeof useCompanyFundSourceDeclarationStore>>
{
  allotmentId: string = ""
  targetType: string = ""
  targetId: string = ""
  subscriberName: string = ""
  identificationNumber: string = "" //IC, passport or company reg number
  subscriptionAmount: number = 1
  typeOfConsideration: string = "Cash"
  descriptionOfNonCash: string | null = null
  sourceOfFunds: string[] = []
  otherSourceOfFunds: string | null = null
  isBeneficialOwner: boolean = true
  beneficialOwnerName: string | null = null
  beneficialOwnerRelation: string | null = null
  isPaymentMadeByOthers: boolean = false
  nameOfPayee: string | null = null
  payeeRelation: string | null = null
  reasonForThirdPartyPayment: string | null = null
  signatureId: string | null = null
  signature: File | null = null

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyFundSourceDeclaration) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.allotmentId = data.allotment_id
    this.targetType = data.target_type
    this.targetId = data.target_id
    this.subscriberName = data.subscriber_name
    this.identificationNumber = data.identification_number
    this.subscriptionAmount = data.subscription_amount
    this.typeOfConsideration = data.type_of_consideration ?? FundDeclarationConsiderationType.Cash
    this.descriptionOfNonCash = data.description_of_non_cash
    this.sourceOfFunds = data.source_of_funds.split(",")
    this.otherSourceOfFunds = data.other_source_of_funds
    this.isBeneficialOwner = data.is_beneficial_owner
    this.beneficialOwnerName = data.beneficial_owner_name
    this.beneficialOwnerRelation = data.beneficial_owner_relation
    this.isPaymentMadeByOthers = data.is_payment_made_by_others
    this.nameOfPayee = data.name_of_payee
    this.payeeRelation = data.payee_relation
    this.reasonForThirdPartyPayment = data.reason_for_third_party_payment
    this.signatureId = data.signature_id
    this.signature = data.signature ? new File(data.signature) : null
  }

  cloneDetails(data: CompanyFundSourceDeclaration): void {
    super.clone(data)
    this.allotmentId = data.allotmentId
    this.targetType = data.targetType
    this.targetId = data.targetId
    this.subscriberName = data.subscriberName
    this.identificationNumber = data.identificationNumber
    this.subscriptionAmount = data.subscriptionAmount
    this.typeOfConsideration = data.typeOfConsideration
    this.descriptionOfNonCash = data.descriptionOfNonCash
    this.sourceOfFunds = data.sourceOfFunds
    this.otherSourceOfFunds = data.otherSourceOfFunds
    this.isBeneficialOwner = data.isBeneficialOwner
    this.beneficialOwnerName = data.beneficialOwnerName
    this.beneficialOwnerRelation = data.beneficialOwnerRelation
    this.isPaymentMadeByOthers = data.isPaymentMadeByOthers
    this.nameOfPayee = data.nameOfPayee
    this.payeeRelation = data.payeeRelation
    this.reasonForThirdPartyPayment = data.reasonForThirdPartyPayment
    this.signatureId = data.signatureId
    this.signature = data.signature ? new File(data.signature) : null
  }

  getRequestBody(): object {
    return {
      company_id: this.companyId,
      allotment_id: this.allotmentId,
      target_type: this.targetType,
      target_id: this.targetId,
      subscriber_name: this.subscriberName,
      identification_number: this.identificationNumber,
      subscription_amount: this.subscriptionAmount,
      type_of_consideration: this.typeOfConsideration,
      description_of_non_cash: this.descriptionOfNonCash,
      source_of_funds: this.sourceOfFunds.join(","),
      other_source_of_funds: this.otherSourceOfFunds,
      is_beneficial_owner: this.isBeneficialOwner,
      beneficial_owner_name: this.beneficialOwnerName,
      beneficial_owner_relation: this.beneficialOwnerRelation,
      is_payment_made_by_others: this.isPaymentMadeByOthers,
      name_of_payee: this.nameOfPayee,
      payee_relation: this.payeeRelation,
      reason_for_third_party_payment: this.reasonForThirdPartyPayment,
      signature_id: this.signatureId,
    }
  }

  canSubmit(): boolean {
    return (
      !StringUtil.isNullOrEmpty(this.companyId) &&
      !StringUtil.isNullOrEmpty(this.allotmentId) &&
      !StringUtil.isNullOrEmpty(this.targetType) &&
      !StringUtil.isNullOrEmpty(this.targetId) &&
      !StringUtil.isNullOrEmpty(this.subscriberName) &&
      !StringUtil.isNullOrEmpty(this.identificationNumber) &&
      !StringUtil.isNullOrEmpty(this.typeOfConsideration)
    )
  }

  async create(repository: ReturnType<typeof useCompanyFundSourceDeclarationStore>): Promise<void> {
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

  async update(repository: ReturnType<typeof useCompanyFundSourceDeclarationStore>): Promise<void> {
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

  async remove(repository: ReturnType<typeof useCompanyFundSourceDeclarationStore>): Promise<void> {
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

  //getters
  get isTypeOfConsiderationCompleted(): boolean {
    return !StringUtil.isNullOrEmpty(this.typeOfConsideration)
  }

  get isDescriptionOfNonCashCompleted(): boolean {
    if (!this.isTypeOfConsiderationCompleted) {
      return true
    }

    return (
      this.typeOfConsideration === FundDeclarationConsiderationType.Cash ||
      !StringUtil.isNullOrEmpty(this.descriptionOfNonCash)
    )
  }

  get isSourceOfFundsCompleted(): boolean {
    return this.sourceOfFunds.length > 0
  }

  get isOtherSourceOfFundsCompleted(): boolean {
    return (
      !this.sourceOfFunds.includes(FundDeclarationSource.Other) || !StringUtil.isNullOrEmpty(this.otherSourceOfFunds)
    )
  }

  get isBeneficialOwnerCompleted(): boolean {
    return (
      this.isBeneficialOwner ||
      (!StringUtil.isNullOrEmpty(this.beneficialOwnerName) && !StringUtil.isNullOrEmpty(this.beneficialOwnerRelation))
    )
  }

  get isThirdPartyPaymentCompleted(): boolean {
    return (
      !this.isPaymentMadeByOthers ||
      (!StringUtil.isNullOrEmpty(this.nameOfPayee) &&
        !StringUtil.isNullOrEmpty(this.payeeRelation) &&
        !StringUtil.isNullOrEmpty(this.reasonForThirdPartyPayment))
    )
  }
}
