import { File } from "./File"
import { Location } from "./Location"
import { StringUtil } from "../utils/String"
import { Error } from "../library/Error"
import { User } from "./User"

export class Director {
  id: string = ""

  // NOTE: These are values from the compact response - these values may be empty or null
  name: string = ""
  dateAppointed: string = ""
  isResignationInProgress: boolean = false
  isResignationRequireApproval: boolean = false
  profileImage: File | null = null
  email: string = ""
  phone: string = ""
  identificationType: string | null = null
  identification: string | null = null
  location: Location | null = null

  // NOTE: these are the value from full response (from standard API functions)
  userId: string | null = null
  user: User | null = null
  role: string | null = null
  mustVote: boolean = false
  decisionWeight: number = 1
  companyId: string | null = null
  createdAt: string | null = null
  updatedAt: string | null = null

  constructor(data: any = null) {
    if (data !== null) {
      if (data instanceof Director) {
        this.clone(data)
      } else {
        this.convertFromResponse(data)
      }
    }
  }

  convertFromResponse(data: any) {
    this.id = data.id
    this.name = data.name ?? ""
    this.dateAppointed = data.date_appointed ?? ""
    this.isResignationInProgress = data.resignation_in_progress ?? false
    this.isResignationRequireApproval = data.resignation_require_approval ?? false
    this.profileImage = data.profile_image !== null ? new File(data.profile_image) : null
    this.email = data.email ?? ""
    this.phone = data.phone ?? ""
    this.identificationType = data.identification_type ?? ""
    this.identification = data.identification ?? ""
    this.location = data.location !== null ? new Location(data.location) : null

    this.userId = data.user_id ?? null
    this.user = data.user ? new User(data.user) : null
    this.role = data.role ?? null
    this.mustVote = data.must_vote ?? null
    this.decisionWeight = data.decision_weight ?? null
    this.companyId = data.company_id ?? null
    this.createdAt = data.created_at ?? null
    this.updatedAt = data.updated_at ?? null
  }

  clone(data: Director) {
    this.id = data.id
    this.name = data.name
    this.dateAppointed = data.dateAppointed
    this.isResignationInProgress = data.isResignationInProgress
    this.isResignationRequireApproval = data.isResignationRequireApproval
    this.profileImage = data.profileImage !== null ? new File(data.profileImage) : null
    this.email = data.email
    this.phone = data.phone
    this.identificationType = data.identificationType
    this.identification = data.identification
    this.location = data.location !== null ? new Location(data.location) : null

    this.userId = data.userId
    this.user = data.user ? new User(data.user) : null
    this.role = data.role
    this.mustVote = data.mustVote
    this.decisionWeight = data.decisionWeight
    this.companyId = data.companyId
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  hasProfileImage() {
    return this.profileImage !== null && !StringUtil.isNullOrEmpty(this.profileImage.url)
  }

  profileImageUrl() {
    if (!this.hasProfileImage()) {
      return null
    }

    return this.profileImage?.url
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
    if (this.userId === null) {
      return
    }

    const response = await repository.fetch(this.userId)
    if (repository.error !== null) {
      let error: Error = new Error("", "")
      error.setForFetch()
      throw error
    }

    this.user = new User(response)
  }
}
