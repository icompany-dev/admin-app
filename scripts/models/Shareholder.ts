import { ShareholdingType } from "../constants/Shareholder"
import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"
import { Company } from "./Company"
import { File } from "./File"
import type { IModel } from "./IModel"
import { Location } from "./Location"
import { User } from "./User"

export class Shareholder implements IModel<Shareholder> {
  id: string = ""

  // NOTE: These are values from the compact response - these values may be empty or null
  name: string = ""
  ordinaryShares: number = 0
  percentageShares: number = 0.0
  profileImage: File | null = null
  email: string = ""
  phone: string = ""
  location: Location | null = null
  type: string = ""
  company: Company | null = null

  // NOTE: these are the value from full response (from standard API functions)
  userId: string | null = null
  user: User | null = null
  preferenceShares: number = 0
  totalShares: number = 0
  dateAppointed: string | null = null
  representedCompanyId: string | null = null
  companyId: string | null = null
  createdAt: string | null = null
  updatedAt: string | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof Shareholder) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.name = data.name
    this.ordinaryShares = data.ordinary_shares ?? 0
    this.percentageShares = data.percentage_shares ?? 0.0
    this.profileImage = data.profile_image ? new File(data.profile_image) : null
    this.email = data.email
    this.phone = data.phone
    this.location = data.location ? new Location(data.location) : null
    this.type = data.type
    this.company = data.company ? new Company(data.company) : null

    this.userId = data.user_id ?? null
    this.user = data.user ? new User(data.user) : null
    this.preferenceShares = data.preference_shares ?? 0
    this.totalShares = data.total_shares ?? 0
    this.dateAppointed = data.date_appointed ?? null
    this.representedCompanyId = data.represented_company_id ?? null
    this.companyId = data.company_id ?? null
    this.createdAt = data.created_at ?? null
    this.updatedAt = data.updated_at ?? null

    if (!StringUtil.isNullOrEmpty(data.company_name)) {
      this.company = new Company()
      this.company.name = data.company_name
      this.company.nameType = data.company_type ?? ""
      this.company.registrationNumberNew = data.company_registration_number_new ?? ""
      this.company.registrationNumberOld = data.company_registration_number_old ?? ""
    }
  }

  clone(data: Shareholder): void {
    this.id = data.id
    this.name = data.name
    this.ordinaryShares = data.ordinaryShares
    this.percentageShares = data.percentageShares
    this.profileImage = data.profileImage ? new File(data.profileImage) : null
    this.email = data.email
    this.phone = data.phone
    this.location = data.location ? new Location(data.location) : null
    this.type = data.type
    this.company = data.company ? new Company(data.company) : null

    this.userId = data.userId
    this.user = data.user
    this.preferenceShares = data.preferenceShares
    this.totalShares = data.totalShares
    this.dateAppointed = data.dateAppointed
    this.representedCompanyId = data.representedCompanyId
    this.companyId = data.companyId
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  getRequestBody(): object {
    return {}
  }

  isCorporateRepresentative(): boolean {
    return this.type === ShareholdingType.Representative
  }

  hasProfileImage(): boolean {
    return this.profileImage !== null && !StringUtil.isNullOrEmpty(this.profileImage.url)
  }

  profileImageUrl(): string | null {
    if (!this.hasProfileImage()) {
      return null
    }

    if (this.isCorporateRepresentative()) {
      let url = this.company?.companyLogo?.url ?? null
      if (StringUtil.isNullOrEmpty(url)) {
        return "/img/logo/default-logo.png"
      }
      return url
    }

    return this.profileImage?.url ?? null
  }

  fullName(): string {
    if (this.isCorporateRepresentative()) {
      return this.company?.getFullName() ?? this.name
    }

    return this.user?.name ?? this.name
  }

  getAddress() {
    if (!this.location) {
      return ""
    }

    const elementsForAddress = [
      this.location.addressLine1,
      this.location.addressLine2,
      `${this.location.postcode} ${this.location.city?.name}`,
      this.location.state?.name,
      this.location.country?.name,
    ]

    return elementsForAddress.join("<br>")
  }

  async getRegisteredUser(repository: ReturnType<typeof useUserStore>): Promise<User | null> {
    const response = await repository.fetchByEmail(this.email)
    if (repository.error !== null) {
      let error: Error = new Error("", "")
      error.setForFetch()
      throw error
    }

    return new User(response)
  }

  async setRegisteredUser(repository: ReturnType<typeof useUserStore>): Promise<void> {
    let user = await this.getRegisteredUser(repository)

    this.user = new User(user)
  }
}
