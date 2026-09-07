import { Company } from "./Company"
import { CompanyAuditorAppointment } from "./CompanyAuditorAppointment"
import { Location } from "./Location"
import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"

export class CompanyAuditor {
  id: string = ""
  companyId: string = ""
  company: Company = new Company()
  appointmentDate: string = ""
  auditorPartnerId: string = ""
  auditorCompanyName: string = ""
  auditorLicense: string = ""
  auditorLocationId: string | null = null
  auditorLocation: Location | null = null
  auditorEmail: string = ""
  auditorPhone: string = ""
  auditorContactPerson: string = ""
  appointmentResolutionId: string | null = null
  appointmentResolution: CompanyAuditorAppointment | null = null
  status: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CompanyAuditor) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.companyId = data.company_id
    this.company = new Company(data.company)
    this.appointmentDate = data.appointment_date
    this.auditorPartnerId = data.auditor_partner_id
    this.auditorCompanyName = data.auditor_company_name
    this.auditorLicense = data.auditor_license
    this.auditorLocationId = data.auditor_location_id
    this.auditorLocation = data.auditor_location ? new Location(data.auditor_location) : null
    this.auditorEmail = data.auditor_email
    this.auditorPhone = data.auditor_phone
    this.auditorContactPerson = data.auditor_contact_person
    this.appointmentResolutionId = data.appointment_resolution_id
    this.appointmentResolution = data.appointment_resolution
      ? new CompanyAuditorAppointment(data.appointment_resolution)
      : null
    this.status = data.status
  }

  clone(data: CompanyAuditor): void {
    this.id = data.id
    this.companyId = data.companyId
    this.company = new Company(data.company)
    this.appointmentDate = data.appointmentDate
    this.auditorPartnerId = data.auditorPartnerId
    this.auditorCompanyName = data.auditorCompanyName
    this.auditorLicense = data.auditorLicense
    this.auditorLocationId = data.auditorLocationId
    this.auditorLocation = data.auditorLocation ? new Location(data.auditorLocation) : null
    this.auditorEmail = data.auditorEmail
    this.auditorPhone = data.auditorPhone
    this.auditorContactPerson = data.auditorContactPerson
    this.appointmentResolutionId = data.appointmentResolutionId
    this.appointmentResolution = data.appointmentResolution
      ? new CompanyAuditorAppointment(data.appointmentResolution)
      : null
    this.status = data.status
  }

  getRequestBody(): object {
    return {
      company_id: this.companyId,
      appointment_date: this.appointmentDate,
      auditor_partner_id: this.auditorPartnerId,
      auditor_company_name: this.auditorCompanyName.toUpperCase(),
      auditor_license: this.auditorLicense,
      // auditor_location: this.auditorLocation?.getRequestBody() ?? null,
      auditor_email: this.auditorEmail,
      auditor_phone: this.auditorPhone,
      auditor_contact_person: this.auditorContactPerson,
      status: this.status,
    }
  }

  hasLocation(): boolean {
    return (
      this.auditorLocation !== null &&
      !StringUtil.isNullOrEmpty(this.auditorLocation.addressLine1) &&
      this.auditorLocation.city?.id !== null &&
      this.auditorLocation.state?.id !== null &&
      this.auditorLocation.country?.id !== null
    )
  }

  canSubmit(): boolean {
    return (
      !StringUtil.isNullOrEmpty(this.companyId) &&
      !StringUtil.isNullOrEmpty(this.auditorCompanyName) &&
      !StringUtil.isNullOrEmpty(this.auditorLicense) &&
      !StringUtil.isNullOrEmpty(this.auditorEmail) &&
      !StringUtil.isNullOrEmpty(this.auditorPhone) &&
      !StringUtil.isNullOrEmpty(this.appointmentDate)
    )
  }

  async create(repository: ReturnType<typeof useCompanyAuditorStore>): Promise<void> {
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

    this.convertFromResponse(response)
  }

  async update(repository: ReturnType<typeof useCompanyAuditorStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id) || !this.canSubmit()) {
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

    this.convertFromResponse(response)
  }

  async remove(repository: ReturnType<typeof useCompanyAuditorStore>): Promise<void> {
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

  get gmailComposeLink(): string {
    return `https://mail.google.com/mail/u/0/?view=cm&fs=1&to=${this.auditorEmail}`
  }
}
