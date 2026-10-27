import { StatusConstants } from "../constants/Status"
import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"
import { Application } from "./Application"
import type { IModelApplication } from "./IModelApplication"

export class CompanyAppointmentOfTaxAgent
  extends Application
  implements IModelApplication<CompanyAppointmentOfTaxAgent, ReturnType<typeof useCompanyAppointmentOfTaxAgentStore>>
{
  refNo: string = ""
  firmName: string = ""
  firmAddress: string = ""
  firmPhone: string = ""
  firmEmail: string = ""

  constructor(data: any | null = null) {
    super()

    if (!data) {
      // TEMPORARY
      const today = new Date()
      const day = String(today.getDate()).padStart(2, "0")
      const month = String(today.getMonth() + 1).padStart(2, "0")
      const year = today.getFullYear()

      this.refNo = `TA/${day}/${month}/${year}`

      return
    }

    if (data instanceof CompanyAppointmentOfTaxAgent) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.refNo = data.ref_no
    this.firmName = data.firm_name
    this.firmAddress = data.firm_address
    this.firmPhone = data.firm_phone
    this.firmEmail = data.firm_email
  }

  cloneDetails(data: CompanyAppointmentOfTaxAgent): void {
    super.clone(data)
    this.refNo = data.refNo
    this.firmName = data.firmName
    this.firmAddress = data.firmAddress
    this.firmPhone = data.firmPhone
    this.firmEmail = data.firmEmail
  }

  getRequestBody(): object {
    let data: any = {
      ref_no: this.refNo,
      company_id: this.companyId,
      firm_name: this.firmName,
      firm_address: this.firmAddress,
      firm_phone: this.firmPhone,
      firm_email: this.firmEmail,
      document_date: this.documentDate,
      location_id: this.locationId,
      status: this.status,
    }

    return data
  }

  canSubmit(): boolean {
    return !StringUtil.isNullOrEmpty(this.companyId)
  }

  async create(repository: ReturnType<typeof useCompanyAppointmentOfTaxAgentStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId)) {
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

  async update(repository: ReturnType<typeof useCompanyAppointmentOfTaxAgentStore>): Promise<void> {
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

  async remove(repository: ReturnType<typeof useCompanyAppointmentOfTaxAgentStore>): Promise<void> {
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
}
