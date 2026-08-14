import { ShareType, ShareholdingType } from "../constants/Shareholder"
import { StringUtil } from "../utils/String"
import { File } from "./File"
import { Shareholder } from "./Shareholder"
import { ShareholderInvitation } from "./ShareholderInvitation"
import { Error } from "~/scripts/library/Error"
import { User } from "./User"

export class CompanyShareTransferDetail {
  id: string = ""
  transferId: string = ""
  unitsOfShare: number = 1
  pricePerShare: number = 1
  shareType: string = ShareType.Ordinary
  transferFromId: string = ""
  transferFrom: Shareholder = new Shareholder()
  isTransferFromConsented: boolean | null = null
  transferFromConsentedAt: string | null = null
  transferFromName: string = ""
  transferFromIdentification: string = ""
  fromSignatureId: string | null = null
  fromSignature: File | null = null
  transferFromRepName: string | null = null
  transferFromRepIdentification: string | null = null
  fromRepSignatureId: string | null = null
  fromRepSignature: File | null = null
  transferToType: string = ShareholdingType.Individual
  transferToName: string | null = null
  transferToIdType: string | null = "ic"
  transferToIdentification: string | null = null // This is the registration number if corporate body
  transferToIdentificationAdditional: string | null = null // This is the registration number if corporate body
  transferToNationality: string | null = null
  transferToAddress: string | null = null
  transferToRepName: string | null = null
  transferToRepIdentification: string | null = null
  transferToIncorporatedAt: string | null = null
  transferToCorporateType: string | null = null
  transferToAltRepName: string | null = null
  transferToAltRepIdentification: string | null = null
  transferToId: string | null = null
  transferTo: Shareholder | null = null
  transferToInvitationId: string | null = null
  transferToInvitation: ShareholderInvitation | null = null
  isTransferToConsented: boolean | null = null
  transferToConsentedAt: string | null = null
  toSignatureId: string | null = null
  toSignature: File | null = null
  toRepSignatureId: string | null = null
  toRepSignature: File | null = null
  createdAt: string | null = null
  updatedAt: string | null = null

  // UI values, not from database
  isNewTransferee: boolean = false

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CompanyShareTransferDetail) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.transferId = data.transfer_id
    this.unitsOfShare = data.units_of_shares
    this.pricePerShare = data.price_per_share
    this.shareType = data.share_type
    this.transferFromId = data.transfer_from_id
    this.transferFrom = new Shareholder(data.transfer_from)
    this.isTransferFromConsented = data.is_transfer_from_consented
    this.transferFromConsentedAt = data.transfer_from_consented_at
    this.transferFromName = data.transfer_from_name
    this.transferFromIdentification = data.transfer_from_identification
    this.transferToIdentificationAdditional = data.transfer_to_identification_additional
    this.fromSignatureId = data.from_signature_id
    this.fromSignature = data.from_signature ? new File(data.from_signature) : null
    this.transferFromRepName = data.transfer_from_rep_name
    this.transferFromRepIdentification = data.transfer_from_rep_identification
    this.fromRepSignatureId = data.from_rep_signature_id
    this.fromRepSignature = data.from_rep_signature ? new File(data.from_rep_signature) : null
    this.transferToType = data.transfer_to_type
    this.transferToName = data.transfer_to_name
    this.transferToIdType = data.transfer_to_id_type
    this.transferToIdentification = data.transfer_to_identification
    this.transferToNationality = data.transfer_to_nationality
    this.transferToAddress = data.transfer_to_address
    this.transferToRepName = data.transfer_to_rep_name
    this.transferToRepIdentification = data.transfer_to_rep_identification
    this.transferToIncorporatedAt = data.transfer_to_incorporated_at
    this.transferToCorporateType = data.transfer_to_corporate_type
    this.transferToAltRepName = data.transfer_to_alt_rep_name
    this.transferToAltRepIdentification = data.transfer_to_alt_rep_identification
    this.transferToId = data.transfer_to_id
    this.transferTo = data.transfer_to ? new Shareholder(data.transfer_to) : null
    this.transferToInvitationId = data.transfer_to_invitation_id
    this.transferToInvitation = data.transfer_to_invitation
      ? new ShareholderInvitation(data.transfer_to_invitation)
      : null
    this.isTransferToConsented = data.is_transfer_to_consented
    this.transferToConsentedAt = data.transfer_to_consented_at
    this.toSignatureId = data.to_signature_id
    this.toSignature = data.to_signature ? new File(data.to_signature) : null
    this.toRepSignatureId = data.to_rep_signature_id
    this.toRepSignature = data.to_rep_signature ? new File(data.to_rep_signature) : null
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
  }

  clone(data: CompanyShareTransferDetail): void {
    this.id = data.id
    this.transferId = data.transferId
    this.unitsOfShare = data.unitsOfShare
    this.pricePerShare = data.pricePerShare
    this.shareType = data.shareType
    this.transferFromId = data.transferFromId
    this.transferFrom = new Shareholder(data.transferFrom)
    this.isTransferFromConsented = data.isTransferFromConsented
    this.transferFromConsentedAt = data.transferFromConsentedAt
    this.transferFromName = data.transferFromName
    this.transferFromIdentification = data.transferFromIdentification
    this.transferToIdentificationAdditional = data.transferToIdentificationAdditional
    this.fromSignatureId = data.fromSignatureId
    this.fromSignature = data.fromSignature ? new File(data.fromSignature) : null
    this.transferFromRepName = data.transferFromRepName
    this.transferFromRepIdentification = data.transferFromRepIdentification
    this.fromRepSignatureId = data.fromRepSignatureId
    this.fromRepSignature = data.fromRepSignature ? new File(data.fromRepSignature) : null
    this.transferToType = data.transferToType
    this.transferToName = data.transferToName
    this.transferToIdType = data.transferToIdType
    this.transferToIdentification = data.transferToIdentification
    this.transferToNationality = data.transferToNationality
    this.transferToAddress = data.transferToAddress
    this.transferToRepName = data.transferToRepName
    this.transferToRepIdentification = data.transferToRepIdentification
    this.transferToIncorporatedAt = data.transferToIncorporatedAt
    this.transferToCorporateType = data.transferToCorporateType
    this.transferToAltRepName = data.transferToAltRepName
    this.transferToAltRepIdentification = data.transferToAltRepIdentification
    this.transferToId = data.transferToId
    this.transferTo = data.transferTo ? new Shareholder(data.transferTo) : null
    this.transferToInvitationId = data.transferToInvitationId
    this.transferToInvitation = data.transferToInvitation ? new ShareholderInvitation(data.transferToInvitation) : null
    this.isTransferToConsented = data.isTransferToConsented
    this.transferToConsentedAt = data.transferToConsentedAt
    this.toSignatureId = data.toSignatureId
    this.toSignature = data.toSignature ? new File(data.toSignature) : null
    this.toRepSignatureId = data.toRepSignatureId
    this.toRepSignature = data.toRepSignature ? new File(data.toRepSignature) : null
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  getRequestBody(): object {
    return {
      transfer_id: this.transferId,
      units_of_shares: this.unitsOfShare,
      price_per_share: this.pricePerShare,
      share_type: this.shareType,
      transfer_from_id: this.transferFromId,
      transfer_from_name: this.transferFromName,
      transfer_from_identification: this.transferFromIdentification,
      transfer_from_rep_name: this.transferFromRepName,
      transfer_from_rep_identification: this.transferFromRepIdentification,
      transfer_to_type: this.transferToType,
      transfer_to_name: this.transferToName,
      transfer_to_id_type: this.transferToIdType,
      transfer_to_identification: this.transferToIdentification,
      transfer_to_address: this.transferToAddress,
      transfer_to_rep_name: this.transferToRepName,
      transfer_to_rep_identification: this.transferToRepIdentification,
      transfer_to_incorporated_at: this.transferToIncorporatedAt,
      transfer_to_corporate_type: this.transferToCorporateType,
      transfer_to_alt_rep_name: this.transferToAltRepName,
      transfer_to_alt_rep_identification: this.transferToAltRepIdentification,
      transfer_to_id: this.transferToId,
      transfer_to_invitation_id: this.transferToInvitationId,
    }
  }

  canSubmit(): boolean {
    return (
      this.unitsOfShare > 0 &&
      !StringUtil.isNullOrEmpty(this.transferFromId) &&
      (!StringUtil.isNullOrEmpty(this.transferToId) || !StringUtil.isNullOrEmpty(this.transferToInvitationId))
    )
  }

  async addToTransfer(repository: ReturnType<typeof useCompanyShareholderTransferStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.transferId)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    if (!this.canSubmit()) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    let response = await repository.addShareTransferDetails(this.transferId, data)
    if (repository.error !== null) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponse(response)
  }

  async update(repository: ReturnType<typeof useCompanyShareholderTransferStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    if (!this.canSubmit()) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    let response = await repository.updateShareTransferDetails(this.id, data)
    if (repository.error !== null) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponse(response)
  }

  async remove(repository: ReturnType<typeof useCompanyShareholderTransferStore>): Promise<any> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let response = await repository.removeShareTransferDetails(this.id)
    if (repository.error !== null) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    return response
  }

  async submitTransferorConsent(repository: ReturnType<typeof useCompanyShareholderTransferStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    if (this.isTransferFromConsented === null) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    await repository.transferorConsented(this.id, this.isTransferFromConsented)
    if (repository.error !== null) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }
  }

  async submitTransferorSignature(
    signatureFileId: string,
    repository: ReturnType<typeof useCompanyShareholderTransferStore>
  ): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let response = await repository.transferorSigned(this.id, signatureFileId)
    if (repository.error !== null) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponse(response)
  }

  async submitTransferorRepSignature(
    signatureFileId: string,
    repository: ReturnType<typeof useCompanyShareholderTransferStore>
  ): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    if (
      StringUtil.isNullOrEmpty(this.transferFromRepName) ||
      StringUtil.isNullOrEmpty(this.transferFromRepIdentification)
    ) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let response = await repository.transferorRepSigned(
      this.id,
      signatureFileId,
      this.transferFromRepName ?? "",
      this.transferFromRepIdentification ?? ""
    )
    if (repository.error !== null) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponse(response)
  }

  async submitTransfereeConsent(repository: ReturnType<typeof useCompanyShareholderTransferStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    if (this.isTransferFromConsented === null) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    await repository.transfereeConsented(this.id, this.isTransferFromConsented)
    if (repository.error !== null) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }
  }

  async submitTransfereeSignature(
    signatureFileId: string,
    repository: ReturnType<typeof useCompanyShareholderTransferStore>
  ): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let response = await repository.transfereeSigned(this.id, signatureFileId)
    if (repository.error !== null) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponse(response)
  }

  async submitTransfereeRepSignature(
    signatureFileId: string,
    repository: ReturnType<typeof useCompanyShareholderTransferStore>
  ): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    if (
      StringUtil.isNullOrEmpty(this.transferToRepName) ||
      StringUtil.isNullOrEmpty(this.transferToRepIdentification)
    ) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let response = await repository.transfereeRepSigned(
      this.id,
      signatureFileId,
      this.transferToRepName ?? "",
      this.transferToRepIdentification ?? ""
    )
    if (repository.error !== null) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponse(response)
  }

  async getTransferToRegisteredUser(): Promise<User> {
    if (this.transferTo && this.transferTo.user) {
      return this.transferTo.user
    }

    if (this.transferToInvitation && this.transferToInvitation.userId) {
      let repository = useUserStore()
      let response = await repository.fetch(this.transferToInvitation.userId)
      if (repository.error === null) {
        return new User(response)
      }
    }

    let newUser = new User()
    newUser.name = this.transferToName ?? ""

    return newUser
  }

  isTransferFromCompany(): boolean {
    return this.transferFrom.type === ShareholdingType.Representative
  }

  isTransferToCompany(): boolean {
    return this.transferToType === ShareholdingType.Representative
  }

  haveAllTransferorSigned(): boolean {
    return (
      !StringUtil.isNullOrEmpty(this.fromSignatureId) &&
      (!this.isTransferFromCompany() || !StringUtil.isNullOrEmpty(this.fromRepSignatureId))
    )
  }

  haveAllTransfereeSigned(): boolean {
    return (
      !StringUtil.isNullOrEmpty(this.toSignatureId) &&
      (!this.isTransferToCompany() || !StringUtil.isNullOrEmpty(this.toRepSignatureId))
    )
  }

  haveAllSigned(): boolean {
    return this.haveAllTransferorSigned() && this.haveAllTransfereeSigned()
  }
}
