import type { PropsSecretarialServices } from "~/scripts/props/PropsSecretarialServices"
import { SecretarialServicesController } from "./SecretarialServicesController"
import { CompanyAppointmentOfTaxAgent } from "~/scripts/models/CompanyAppointmentOfTaxAgent"
import { Company } from "~/scripts/models/Company"
import { StatusConstants } from "~/scripts/constants/Status"
import { StringUtil } from "~/scripts/utils/String"

export class AppointTaxAgentsController extends SecretarialServicesController<CompanyAppointmentOfTaxAgent> {
  constructor(props: PropsSecretarialServices, emitEvents: any | null) {
    super(props, CompanyAppointmentOfTaxAgent, useCompanyAppointmentOfTaxAgentStore(), emitEvents)
  }

  onApplicationClicked(data: any): void {
    let application = new CompanyAppointmentOfTaxAgent(data)
    this.router.push({ path: `/services/appointment-of-tax-agent/${application.id}` })
  }

  companyName(data: any): string {
    let application = new CompanyAppointmentOfTaxAgent(data)
    return this.company(application).getFullName()
  }

  applicationDetails(data: any): string {
    let application = new CompanyAppointmentOfTaxAgent(data)

    let details: string[] = []

    if (!StringUtil.isNullOrEmpty(application.firmName)) {
      details.push(application.firmName.toUpperCase())
    }

    return details.join("<br/>")
  }

  applicationDate(data: any): string {
    let application = new CompanyAppointmentOfTaxAgent(data)
    if (!application.paidAt) {
      return this.language.isMalay() ? "Belum Dibayar" : "(Unpaid)"
    }

    return this.time.formatDateTimeFull(application.paidAt)
  }

  applicationStatusClass(data: any): string {
    let application = new CompanyAppointmentOfTaxAgent(data)
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
    let application = new CompanyAppointmentOfTaxAgent(data)
    switch (application.status) {
      case StatusConstants.DRAFT:
        return this.language.isMalay() ? "Belum Dibayar" : "Pending Payment"
      case StatusConstants.PAID:
        return this.language.isMalay() ? "Bayaran Diterima" : "Payment Received"
      case StatusConstants.READY:
        return this.language.isMalay() ? "Permohonan Sedia" : "Application Ready"
      case StatusConstants.NAME_REJECTED:
        return this.language.isMalay() ? "Cadangan Nama Ditolak" : "Proposed Name Rejected"
    }

    return application.status
  }

  company(data: any): Company {
    let application = new CompanyAppointmentOfTaxAgent(data)
    return new Company(application.company)
  }
}
