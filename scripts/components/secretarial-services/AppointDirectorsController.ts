import type { PropsSecretarialServices } from "~/scripts/props/PropsSecretarialServices"
import { SecretarialServicesController } from "./SecretarialServicesController"
import { CompanyDirectorAppointment } from "~/scripts/models/CompanyDirectorAppointment"
import { Company } from "~/scripts/models/Company"
import { StatusConstants } from "~/scripts/constants/Status"

export class AppointDirectorsController extends SecretarialServicesController<CompanyDirectorAppointment> {
  constructor(props: PropsSecretarialServices, emitEvents: any | null) {
    super(props, CompanyDirectorAppointment, useCompanyDirectorAppointmentStore(), emitEvents)
  }

  onApplicationClicked(data: any): void {
    let application = new CompanyDirectorAppointment(data)
    this.router.push({ path: `/services/appoint-director-new/${application.id}` })
  }

  companyName(data: any): string {
    let application = new CompanyDirectorAppointment(data)
    return this.company(application).getFullName()
  }

  applicationDetails(data: any): string {
    let application = new CompanyDirectorAppointment(data)
    let isRegistered = application.directorInvitation?.userId

    return `
      <b>${this.language.isMalay() ? "Nama" : "Name"}</b>: ${application.directorName?.toUpperCase() ?? "(Incomplete)"}<br>
      <b>${this.language.isMalay() ? "No." : ""} ${application.directorIdentificationType === "passport" ? "Passport" : "MyKad"} 
      ${this.language.isMalay() ? "" : "No."}</b>: ${application.directorIdentification}
      ${isRegistered ? "<i class='success-icon fa-solid fa-circle-check'></i>" : ""}
    `
  }

  applicationDate(data: any): string {
    let application = new CompanyDirectorAppointment(data)
    if (!application.paidAt) {
      return this.language.isMalay() ? "Belum Dibayar" : "(Unpaid)"
    }

    return this.time.formatDateTimeFull(application.paidAt)
  }

  applicationStatusClass(data: any): string {
    let application = new CompanyDirectorAppointment(data)
    switch (application.status) {
      case StatusConstants.DRAFT:
        return "draft"
      case StatusConstants.PAID:
        return "info"
      case StatusConstants.NAME_REJECTED:
        return "danger"
      case StatusConstants.APPROVED:
        return "success"
    }

    return "info"
  }

  applicationStatus(data: any): string {
    let application = new CompanyDirectorAppointment(data)
    switch (application.status) {
      case StatusConstants.DRAFT:
        return this.language.isMalay() ? "Belum Dibayar" : "Pending Payment"
      case StatusConstants.PAID:
        return this.language.isMalay() ? "Bayaran Diterima" : "Payment Received"
      case StatusConstants.NAME_REJECTED:
        return this.language.isMalay() ? "Cadangan Nama Ditolak" : "Proposed Name Rejected"
      case StatusConstants.SUBMITTED:
        return this.language.isMalay() ? "Dihantar ke SSM" : "Submitted to SSM"
    }

    return application.status
  }

  company(data: any): Company {
    let application = new CompanyDirectorAppointment(data)
    return new Company(application.company)
  }
}
