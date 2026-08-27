import type { CompanyRole } from "./MapUserLocation"

export class UserCompanyAppointment {
  companyId: string = ""
  companyName: string = ""
  role: CompanyRole = "Officer"
  shareholdingPercent?: number // e.g. 25 (%)
  isPrimary?: boolean
  appointedDate?: string

  constructor(data: any | null = null) {
    Object.assign(this, data)
  }
}
