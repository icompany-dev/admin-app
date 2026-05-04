import { User } from "./User"
import { Location } from "./Location"
import type { IModel } from "./IModel"

export class AppointedAuditor implements IModel<AppointedAuditor> {
  id: string = ""
  companyId: string = ""
  userId: string | null = null
  user: User | null = null

  name: string = ""
  email: string = ""
  phone: string = ""
  companyName: string = ""
  companyType: string = "others"
  companyEmail: string = ""
  companyLocation: Location = new Location()

  dateAppointed: string = ""
  financialYearStart: string = ""
  financialYearEnd: string = ""
  status: string = ""

  createdAt: string | null = null
  updatedAt: string | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof AppointedAuditor) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id ?? ""
    this.companyId = data.company_id ?? ""
    this.userId = data.user_id ?? null
    this.user = data.user ? new User(data.user) : null

    this.name = data.name ?? ""
    this.email = data.email ?? ""
    this.phone = data.phone ?? ""
    this.companyName = data.company_name ?? ""
    this.companyType = data.company_type ?? "others"
    this.companyEmail = data.company_email ?? ""
    this.companyLocation = data.company_location ? new Location(data.company_location) : new Location()

    this.dateAppointed = data.date_appointed ?? ""
    this.financialYearStart = data.financial_year_start ?? ""
    this.financialYearEnd = data.financial_year_end ?? ""
    this.status = data.status ?? ""

    this.createdAt = data.created_at ?? null
    this.updatedAt = data.updated_at ?? null
  }

  clone(data: AppointedAuditor): void {
    this.id = data.id
    this.companyId = data.companyId
    this.userId = data.userId
    this.user = data.user ? new User(data.user) : null

    this.name = data.name
    this.email = data.email
    this.phone = data.phone
    this.companyName = data.companyName
    this.companyType = data.companyType
    this.companyEmail = data.companyEmail
    this.companyLocation = new Location(data.companyLocation)

    this.dateAppointed = data.dateAppointed
    this.financialYearStart = data.financialYearStart
    this.financialYearEnd = data.financialYearEnd
    this.status = data.status

    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  getRequestBody(): object {
    return {
      company_id: this.companyId,
      user_id: this.userId,
      name: this.name,
      email: this.email,
      phone: this.phone,
      company_name: this.companyName,
      company_type: this.companyType,
      company_email: this.companyEmail,
      company_location: this.companyLocation.getRequestBody(),
      date_appointed: this.dateAppointed,
      financial_year_start: this.financialYearStart,
      financial_year_end: this.financialYearEnd,
      status: this.status
    }
  }
}
