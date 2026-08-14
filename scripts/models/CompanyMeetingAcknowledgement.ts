import { File } from "./File"
import { Error } from "~/scripts/library/Error"
import { StringUtil } from "~/scripts/utils/String"

export class CompanyMeetingAcknowledgement {
  id: string = ""
  companyMeetingId: string = ""
  shareholderId: string = ""
  isAcknowledgingOnly: boolean = false

  // In Person
  isAttendingInPerson: boolean = false
  isAttendingAsCorporateRep: boolean = false
  nameOfCorporateRepresentative: string | null = null
  certificateOfCorporateRepresentativeId: string | null = null

  // Proxy
  isAppointingAProxy: boolean = false
  proxyFullName: string | null = null
  proxyEmailAddress: string | null = null
  proxyContactNumber: string | null = null
  proxyKnownAddress: string | null = null
  proxyIdentificationNumber: string | null = null
  proxyRelationship: string | null = null
  isForThisMeetingOnly: boolean = false
  isUnderConstitution: boolean = false

  // Signature data
  nameOfShareholder: string | null = null
  signatureId: string | null = null
  signatureFile: File | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CompanyMeetingAcknowledgement) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.companyMeetingId = data.company_meeting_id
    this.shareholderId = data.shareholder_id
    this.isAcknowledgingOnly = data.is_acknowleding_only
    this.isAttendingInPerson = data.is_attending_in_person
    this.isAttendingAsCorporateRep = data.is_attending_as_corporate_rep
    this.nameOfCorporateRepresentative = data.name_of_corporate_representative
    this.certificateOfCorporateRepresentativeId = data.certificate_of_corporate_representative_id
    this.isAppointingAProxy = data.is_appointing_a_proxy
    this.proxyFullName = data.proxy_full_name
    this.proxyEmailAddress = data.proxy_email_address
    this.proxyContactNumber = data.proxy_contact_number
    this.proxyKnownAddress = data.proxy_known_address
    this.proxyIdentificationNumber = data.proxy_identification_number
    this.proxyRelationship = data.proxy_relationship
    this.isForThisMeetingOnly = data.is_for_this_meeting_only
    this.isUnderConstitution = data.is_under_constitution
    this.nameOfShareholder = data.name_of_shareholder
    this.signatureId = data.signature_id
    this.signatureFile = data.signature ? new File(data.signature) : null
  }

  clone(data: CompanyMeetingAcknowledgement): void {
    this.id = data.id
    this.companyMeetingId = data.companyMeetingId
    this.shareholderId = data.shareholderId
    this.isAcknowledgingOnly = data.isAcknowledgingOnly
    this.isAttendingInPerson = data.isAttendingInPerson
    this.isAttendingAsCorporateRep = data.isAttendingAsCorporateRep
    this.nameOfCorporateRepresentative = data.nameOfCorporateRepresentative
    this.certificateOfCorporateRepresentativeId = data.certificateOfCorporateRepresentativeId
    this.isAppointingAProxy = data.isAppointingAProxy
    this.proxyFullName = data.proxyFullName
    this.proxyEmailAddress = data.proxyEmailAddress
    this.proxyContactNumber = data.proxyContactNumber
    this.proxyKnownAddress = data.proxyKnownAddress
    this.proxyIdentificationNumber = data.proxyIdentificationNumber
    this.proxyRelationship = data.proxyRelationship
    this.isForThisMeetingOnly = data.isForThisMeetingOnly
    this.isUnderConstitution = data.isUnderConstitution
    this.nameOfShareholder = data.nameOfShareholder
    this.signatureId = data.signatureId
    this.signatureFile = data.signatureFile ? new File(data.signatureFile) : null
  }

  getRequestBody(): object {
    return {
      company_meeting_id: this.companyMeetingId,
      shareholder_id: this.shareholderId,
      is_acknowledging_only: this.isAcknowledgingOnly,
      is_attending_in_person: this.isAttendingInPerson,
      is_attending_as_corporate_rep: this.isAttendingAsCorporateRep,
      name_of_corporate_representative: this.nameOfCorporateRepresentative,
      certificate_of_corporate_representative_id: this.certificateOfCorporateRepresentativeId,
      is_appointing_a_proxy: this.isAppointingAProxy,
      proxy_full_name: this.proxyFullName,
      proxy_email_address: this.proxyEmailAddress,
      proxy_contact_number: this.proxyContactNumber,
      proxy_known_address: this.proxyKnownAddress,
      proxy_identification_number: this.proxyIdentificationNumber,
      proxy_relationship: this.proxyRelationship,
      is_for_this_meeting_only: this.isForThisMeetingOnly,
      is_under_constitution: this.isUnderConstitution,
      name_of_shareholder: this.nameOfShareholder,
      signature_id: this.signatureId,
    }
  }

  canSubmit(): boolean {
    return (
      !StringUtil.isNullOrEmpty(this.companyMeetingId) &&
      !StringUtil.isNullOrEmpty(this.shareholderId) &&
      !StringUtil.isNullOrEmpty(this.signatureId)
    )
  }

  async create(repository: ReturnType<typeof useCompanyMeetingAcknowledgementStore>): Promise<void> {
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

  async update(repository: ReturnType<typeof useCompanyMeetingAcknowledgementStore>): Promise<void> {
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

  async remove(repository: ReturnType<typeof useCompanyMeetingAcknowledgementStore>): Promise<void> {
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
