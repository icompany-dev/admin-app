import type { useApplicationNameReservationStore } from "~/stores/ApplicationNameReservations"
import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"

export class ApplicationNameReservation {
  id: string = ""
  applicationIncorporateId: string = ""
  name: string = ""
  nameType: string = "sdnbhd"
  nameDescription: string = "-"
  supportingDocumentId: string | null = null
  status: string = ""
  submittedAt: string = ""
  resubmittedAt: string = ""
  resultAt: string = ""
  nameValidTill: string = ""
  ssmEmailSubject: string = ""
  ssmResult: string = ""
  ssmReferenceNumber: string = ""
  ssmTemplateReferenceNumber: string = ""
  ssmQueryEn: string = ""
  ssmQueryBm: string = ""
  ssmRemarksEn: string = ""
  ssmRemarksBm: string = ""
  createdAt: string = ""
  updatedAt: string = ""
  deletedAt: string = ""

  actionToBeTaken = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof ApplicationNameReservation) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.applicationIncorporateId = data.application_incorporate_id
    this.name = data.name
    this.nameType = data.name_type
    this.nameDescription = data.name_description
    this.supportingDocumentId = data.supporting_document_id
    this.status = data.status
    this.submittedAt = data.submitted_at
    this.resubmittedAt = data.resubmitted_at
    this.resultAt = data.result_at
    this.nameValidTill = data.name_valid_till
    this.ssmEmailSubject = data.ssm_email_subject
    this.ssmResult = data.ssm_result
    this.ssmReferenceNumber = data.ssm_reference_number
    this.ssmTemplateReferenceNumber = data.ssm_template_reference_number
    this.ssmQueryEn = data.ssm_query_en
    this.ssmQueryBm = data.ssm_query_bm
    this.ssmRemarksEn = data.ssm_remarks_en
    this.ssmRemarksBm = data.ssm_remarks_bm
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
    this.deletedAt = data.deleted_at
  }

  clone(data: ApplicationNameReservation): void {
    this.id = data.id
    this.applicationIncorporateId = data.applicationIncorporateId
    this.name = data.name
    this.nameType = data.nameType
    this.nameDescription = data.nameDescription
    this.supportingDocumentId = data.supportingDocumentId
    this.status = data.status
    this.submittedAt = data.submittedAt
    this.resubmittedAt = data.resubmittedAt
    this.resultAt = data.resultAt
    this.nameValidTill = data.nameValidTill
    this.ssmEmailSubject = data.ssmEmailSubject
    this.ssmResult = data.ssmResult
    this.ssmReferenceNumber = data.ssmReferenceNumber
    this.ssmTemplateReferenceNumber = data.ssmTemplateReferenceNumber
    this.ssmQueryEn = data.ssmQueryEn
    this.ssmQueryBm = data.ssmQueryBm
    this.ssmRemarksEn = data.ssmRemarksEn
    this.ssmRemarksBm = data.ssmRemarksBm
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
    this.deletedAt = data.deletedAt
  }

  getRequestBody(): object {
    return {
      application_incorporate_id: this.applicationIncorporateId,
      name: this.name,
      name_type: this.nameType,
      name_description: this.nameDescription,
      status: this.status,
    }
  }

  canSubmit(): boolean {
    return !StringUtil.isNullOrEmpty(this.applicationIncorporateId) && !StringUtil.isNullOrEmpty(this.name)
  }

  async create(repository: ReturnType<typeof useApplicationNameReservationStore>): Promise<void> {
    if (!this.canSubmit()) {
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

    this.convertFromResponse(response)
  }
}
