import type { IModel } from "./IModel"

export class ProgressItem implements IModel<ProgressItem> {
  target: string = ''
  targetId: string = ''
  companyName: string = ''
  companyId: string | null = null
  isIncomplete: boolean = false
  isSignatureRequired: boolean = false
  isPaymentRequired: boolean = false
  isResponseNeeded: boolean = false
  isApplicationCompleted: boolean = false
  status: string = 'draft'
  createdAt: string = ''

  constructor (data: any) {
    if (!data) {
      return
    }

    if (data instanceof ProgressItem) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse (data: any): void {
    this.target = data.target ?? ''
    this.target = this.target.replace(/[A-Z]/g, (letter, index) => {
      return index === 0 ? letter.toLowerCase() : `_${letter.toLowerCase()}`
    })
    this.targetId = data.target_id ?? ''
    this.companyName = data.company_name ?? ''
    this.companyId = data.company_id ?? null
    this.isIncomplete = data.is_incomplete ?? false
    this.isSignatureRequired = data.is_signature_required ?? false
    this.isPaymentRequired = data.is_payment_required ?? false
    this.isResponseNeeded = data.is_response_needed ?? false
    this.isApplicationCompleted = data.is_application_completed ?? false
    this.status = data.status
    this.createdAt = data.created_at
  }

  clone(data: ProgressItem) : void {
    this.target = data.target
    this.targetId = data.targetId
    this.companyName = data.companyName
    this.companyId = data.companyId
    this.isIncomplete = data.isIncomplete
    this.isSignatureRequired = data.isSignatureRequired
    this.isPaymentRequired = data.isPaymentRequired
    this.isResponseNeeded = data.isResponseNeeded
    this.isApplicationCompleted = data.isApplicationCompleted
    this.status = data.status
    this.createdAt = data.createdAt
  }

  getRequestBody (): object {
    return {}
  }

  isDeletable(): boolean {
    return !this.isApplicationCompleted && 
      !this.isResponseNeeded &&
      this.target !== 'company_subscription' &&
      this.target !== 'company_annual_return_request'
  }
}