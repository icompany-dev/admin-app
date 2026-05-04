import { Company } from "./Company"
import { CompanyAuditorAppointment } from "./CompanyAuditorAppointment"
import { Location } from "./Location"

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
}
