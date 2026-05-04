import type { useCompanyShareholderTransferStore } from "~/stores/CompanyShareholderTransfers"
import { ShareType, ShareholdingType } from "../constants/Shareholder"
import { Application } from "./Application"
import { CompanyShareTransferDetail } from "./CompanyShareTransferDetail"
import { File } from "./File"
import type { IModelApplication } from "./IModelApplication"
import { Shareholder } from "./Shareholder"
import { ShareholderInvitation } from "./ShareholderInvitation"
import { StringUtil } from "../utils/String"
import { Error } from "~/scripts/library/Error"

export class CompanyShareholderTransfer
  extends Application
  implements IModelApplication<CompanyShareholderTransfer, ReturnType<typeof useCompanyShareholderTransferStore>>
{
  sharesToTransfer: number = 1
  pricePerShare: number = 1
  shareType: string = ShareType.Ordinary
  transferCashType: string = ""
  preferenceAgreement: File | null = null
  cashInjection: File | null = null
  auditFile: File | null = null
  // This section can be removed when all the parts have changed to use new structure
  fromShareholderId: string | null = null
  fromShareholder: Shareholder | null = null
  fromSignature: File | null = null
  fromSignatureAlt: File | null = null
  fromSignatureName: string | null = null
  fromSignatureIdentification: string | null = null
  toShareholderId: string | null = null
  toShareholder: Shareholder | null = null
  toShareholderInvitationId: string | null = null
  toShareholderInvitation: ShareholderInvitation | null = null
  toShareholderName: string | null = null
  toShareholderIdType: string | null = null
  toShareholderIdentification: string | null = null
  toShareholderAddress: string | null = null
  toShareholderIncorporateAt: string | null = null
  toShareholderTypeOfCorporate: string | null = null
  toSignature: File | null = null
  toSignatureAlt: File | null = null
  toSignatureName: string | null = null
  toSignatureIdentification: string | null = null
  isInitiatedByDirector: boolean = false
  isProceedWithLodgment: boolean = false
  isFullPaymentReceived: boolean = false
  isFullPaymentMade: boolean = false
  evidenceDocumentIds: any = null // Not clear of type
  transferDetails: CompanyShareTransferDetail[] = []

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyShareholderTransfer) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.sharesToTransfer = data.shares_allotted
    this.pricePerShare = data.price_per_share
    this.shareType = data.shares_type
    this.transferCashType = data.transfer_cash_type
    this.preferenceAgreement = data.preference_agreement
    this.cashInjection = data.cash_injection
    this.auditFile = data.audit_file
    this.fromShareholderId = data.from_shareholder_id
    this.fromShareholder = data.from_shareholder ? new Shareholder(data.from_shareholder) : null
    this.fromSignature = data.from_signature ? new File(data.from_signature) : null
    this.fromSignatureAlt = data.from_signature_alt ? new File(data.from_signature_alt) : null
    this.fromSignatureName = data.from_signature_name
    this.fromSignatureIdentification = data.from_signature_identification
    this.toShareholderId = data.to_shareholder_id
    this.toShareholder = data.to_shareholder ? new Shareholder(data.to_shareholder) : null
    this.toShareholderInvitationId = data.to_shareholder_invitation_id
    this.toShareholderInvitation = data.to_shareholder_invitation
      ? new ShareholderInvitation(data.to_shareholder_invitation)
      : null
    this.toShareholderName = data.to_shareholder_name
    this.toShareholderIdType = data.to_shareholder_id_type
    this.toShareholderIdentification = data.to_shareholder_identification
    this.toShareholderAddress = data.to_shareholder_address
    this.toShareholderIncorporateAt = data.to_shareholder_incorporate_at
    this.toShareholderTypeOfCorporate = data.to_shareholder_type_of_corporate
    this.toSignature = data.to_signature ? new File(data.to_signature) : null
    this.toSignatureAlt = data.to_signature_alt ? new File(data.to_signature_alt) : null
    this.toSignatureName = data.to_signature_name
    this.toSignatureIdentification = data.to_signature_identification
    this.isInitiatedByDirector = data.is_initiated_by_director
    this.isProceedWithLodgment = data.is_proceed_with_lodgment
    this.isFullPaymentReceived = data.is_full_payment_received
    this.isFullPaymentMade = data.is_full_payment_made
    this.evidenceDocumentIds = data.evidence_document_ids
    this.transferDetails =
      data.transfer_details && Array.isArray(data.transfer_details)
        ? data.transfer_details.map((d: any) => {
            return new CompanyShareTransferDetail(d)
          })
        : []

    // Transition support for old structures
    if (this.transferDetails.length === 0 && this.fromShareholderId) {
      this.setTransferDetails()
    }
  }

  cloneDetails(data: CompanyShareholderTransfer): void {
    super.clone(data)
    this.sharesToTransfer = data.sharesToTransfer
    this.pricePerShare = data.pricePerShare
    this.shareType = data.shareType
    this.transferCashType = data.transferCashType
    this.preferenceAgreement = data.preferenceAgreement
    this.cashInjection = data.cashInjection
    this.auditFile = data.auditFile
    this.fromShareholderId = data.fromShareholderId
    this.fromShareholder = data.fromShareholder ? new Shareholder(data.fromShareholder) : null
    this.fromSignature = data.fromSignature ? new File(data.fromSignature) : null
    this.fromSignatureAlt = data.fromSignatureAlt ? new File(data.fromSignatureAlt) : null
    this.fromSignatureName = data.fromSignatureName
    this.fromSignatureIdentification = data.fromSignatureIdentification
    this.toShareholderId = data.toShareholderId
    this.toShareholder = data.toShareholder ? new Shareholder(data.toShareholder) : null
    this.toShareholderInvitationId = data.toShareholderInvitationId
    this.toShareholderInvitation = data.toShareholderInvitation
      ? new ShareholderInvitation(data.toShareholderInvitation)
      : null
    this.toShareholderName = data.toShareholderName
    this.toShareholderIdType = data.toShareholderIdType
    this.toShareholderIdentification = data.toShareholderIdentification
    this.toShareholderAddress = data.toShareholderAddress
    this.toShareholderIncorporateAt = data.toShareholderIncorporateAt
    this.toShareholderTypeOfCorporate = data.toShareholderTypeOfCorporate
    this.toSignature = data.toSignature ? new File(data.toSignature) : null
    this.toSignatureAlt = data.toSignatureAlt ? new File(data.toSignatureAlt) : null
    this.toSignatureName = data.toSignatureName
    this.toSignatureIdentification = data.toSignatureIdentification
    this.isInitiatedByDirector = data.isInitiatedByDirector
    this.isProceedWithLodgment = data.isProceedWithLodgment
    this.isFullPaymentReceived = data.isFullPaymentReceived
    this.isFullPaymentMade = data.isFullPaymentMade
    this.evidenceDocumentIds = data.evidenceDocumentIds
    this.transferDetails = data.transferDetails.map((d: any) => {
      return new CompanyShareTransferDetail(d)
    })
  }

  // this is for transition purposes
  setTransferDetails(): void {
    if (this.transferDetails.length > 0 || this.fromShareholderId === null) {
      return
    }

    let newTransferDetail = new CompanyShareTransferDetail()
    newTransferDetail.transferFromId = this.fromShareholderId
    newTransferDetail.transferFrom = new Shareholder(this.fromShareholder)
    newTransferDetail.isTransferFromConsented = false // we need to check with notice for this
    newTransferDetail.transferFromConsentedAt = null
    newTransferDetail.transferFromName = this.fromShareholder?.fullName() ?? "Unknown Transferor"
    newTransferDetail.transferFromIdentification = this.fromShareholder?.user?.detail?.identification ?? ""
    newTransferDetail.fromSignatureId = this.fromSignature ? this.fromSignature.id : null
    newTransferDetail.fromSignature = this.fromSignature ? new File(this.fromSignature) : null
    newTransferDetail.transferFromRepName = this.fromSignatureName
    newTransferDetail.transferFromRepIdentification = this.fromSignatureIdentification
    newTransferDetail.fromRepSignatureId = this.fromSignatureAlt ? this.fromSignatureAlt.id : null
    newTransferDetail.fromRepSignature = this.fromSignatureAlt ? new File(this.fromSignatureAlt) : null
    newTransferDetail.transferToType = ShareholdingType.Individual // Need to check other types
    newTransferDetail.transferToName = this.toShareholderName
    newTransferDetail.transferToIdType = this.toShareholderIdType
    newTransferDetail.transferToIdentification = this.toShareholderIdentification
    newTransferDetail.transferToAddress = this.toShareholderAddress
    newTransferDetail.transferToRepName = this.toShareholderName // This should only be for corp rep
    newTransferDetail.transferToRepIdentification = this.toShareholderIdentification // this should only be for corp rep
    newTransferDetail.transferToIncorporatedAt = this.toShareholderIncorporateAt
    newTransferDetail.transferToCorporateType = this.toShareholderTypeOfCorporate
    newTransferDetail.transferToAltRepName = this.toSignatureName
    newTransferDetail.transferToAltRepIdentification = this.toSignatureIdentification
    newTransferDetail.transferToId = this.toShareholderId
    newTransferDetail.transferTo = this.toShareholder ? new Shareholder(this.toShareholder) : null
    newTransferDetail.transferToInvitationId = this.toShareholderInvitationId
    newTransferDetail.transferToInvitation = this.toShareholderInvitation
      ? new ShareholderInvitation(this.toShareholderInvitation)
      : null
    newTransferDetail.isTransferToConsented = false // we need to check with notice for this
    newTransferDetail.transferToConsentedAt = null
    newTransferDetail.toSignatureId = this.toSignature ? this.toSignature.id : null
    newTransferDetail.toSignature = this.toSignature ? new File(this.toSignature) : null
    newTransferDetail.toRepSignatureId = this.toSignatureAlt ? this.toSignatureAlt.id : null
    newTransferDetail.toRepSignature = this.toSignatureAlt ? new File(this.toSignatureAlt) : null

    this.transferDetails.push(newTransferDetail)
  }

  getRequestBody(): object {
    return {
      company_id: this.companyId,
      shares_allotted: this.sharesToTransfer,
      price_per_share: this.pricePerShare,
      shares_type: this.shareType,
      is_initiated_by_director: this.isInitiatedByDirector,
      transfer_details: this.transferDetails.map((d: CompanyShareTransferDetail) => {
        return d.getRequestBody()
      }),
    }
  }

  canSubmit(): boolean {
    return (
      !StringUtil.isNullOrEmpty(this.companyId) &&
      this.transferDetails.every((d: CompanyShareTransferDetail) => {
        return d.canSubmit()
      })
    )
  }

  async create(repository: ReturnType<typeof useCompanyShareholderTransferStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId)) {
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

    this.convertFromResponseDetails(response)
  }

  async update(repository: ReturnType<typeof useCompanyShareholderTransferStore>): Promise<void> {
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

    this.convertFromResponseDetails(response)
  }

  async remove(repository: ReturnType<typeof useCompanyShareholderTransferStore>): Promise<any> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let response = await repository.remove(this.id)
    if (repository.error !== null) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    return response
  }
}
