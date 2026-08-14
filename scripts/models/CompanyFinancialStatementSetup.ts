import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"
import { Company } from "./Company"
import type { IModel } from "./IModel"

export class CompanyFinancialStatementSetup implements IModel<CompanyFinancialStatementSetup> {
  id: string = ""
  companyId: string = ""
  company: Company = new Company()
  setFyeId: string | null = null
  authorisedPersonId: string | null = null
  auditorAppointmentId: string | null = null
  initiatorId: string | null = null
  status: string | null = "pending"
  paidAt: string | null = null
  createdAt: string | null = null
  updatedAt: string | null = null
  deletedAt: string | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CompanyFinancialStatementSetup) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id ?? ""
    this.companyId = data.company_id ?? ""
    this.company = new Company(data.company)
    this.setFyeId = data.set_fye_id ?? null
    this.authorisedPersonId = data.authorised_person_id ?? null
    this.auditorAppointmentId = data.auditor_appointment_id ?? null
    this.initiatorId = data.initiator_id ?? null
    this.status = data.status ?? null
    this.paidAt = data.paid_at ?? null
    this.createdAt = data.created_at ?? null
    this.updatedAt = data.updated_at ?? null
    this.deletedAt = data.deleted_at ?? null
  }

  clone(data: CompanyFinancialStatementSetup): void {
    this.id = data.id
    this.companyId = data.companyId
    this.company = new Company(data.company)
    this.setFyeId = data.setFyeId
    this.authorisedPersonId = data.authorisedPersonId
    this.auditorAppointmentId = data.auditorAppointmentId
    this.initiatorId = data.initiatorId
    this.status = data.status
    this.paidAt = data.paidAt
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
    this.deletedAt = data.deletedAt
  }

  getRequestBody(): object {
    return {
      company_id: this.companyId,
      set_fye_id: this.setFyeId,
      authorised_person_id: this.authorisedPersonId,
      auditor_appointment_id: this.auditorAppointmentId,
      status: this.status,
    }
  }

  canSubmit() {
    return !StringUtil.isNullOrEmpty(this.companyId)
  }

  async create(repository: ReturnType<typeof useCompanyFinancialStatementSetupStore>): Promise<void> {
    if (!this.canSubmit()) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    try {
      const response = await repository.create(this.getRequestBody())
      if (repository.error && !StringUtil.isNullOrEmpty(repository.error)) {
        throw repository.error
      }

      this.convertFromResponse(response)
    } catch (error) {
      let errorMessage: Error = new Error("", "")
      errorMessage.setForCUD()
      throw errorMessage
    }
  }

  async update(repository: ReturnType<typeof useCompanyFinancialStatementSetupStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id) || !this.canSubmit()) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    try {
      const response = await repository.update(this.id, this.getRequestBody())
      if (repository.error && !StringUtil.isNullOrEmpty(repository.error)) {
        throw repository.error
      }

      this.convertFromResponse(response)
    } catch (error) {
      let errorMessage: Error = new Error("", "")
      errorMessage.setForCUD()
      throw errorMessage
    }
  }

  async remove(repository: ReturnType<typeof useCompanyFinancialStatementSetupStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    try {
      await repository.remove(this.id)
      if (repository.error && !StringUtil.isNullOrEmpty(repository.error)) {
        throw repository.error
      }
    } catch (error) {
      let errorMessage: Error = new Error("", "")
      errorMessage.setForCUD()
      throw errorMessage
    }
  }
}
