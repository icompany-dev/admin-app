import { AppointmentEffectFrom } from "../constants/AppointmentOfDirectors"
import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"
import { Application } from "./Application"
import { DirectorInvitation } from "./DirectorInvitation"
import type { IModelApplication } from "./IModelApplication"
import { User } from "./User"

export class CompanyDirectorAppointment
  extends Application
  implements IModelApplication<CompanyDirectorAppointment, ReturnType<typeof useCompanyDirectorAppointmentStore>>
{
  refNo: string = ""
  emailAddress: string | null = ""
  directorInvitations: DirectorInvitation[] = []
  directorInvitationId: string = ""
  directorInvitation: DirectorInvitation = new DirectorInvitation()
  directorName: string | null = ""
  directorIdentificationType: string | null = "ic"
  directorIdentification: string | null = ""
  isInitiatedByShareholder: boolean = false
  isEffectFromEffectiveDate: boolean = true
  effectiveFromType: string = AppointmentEffectFrom.EffectiveDate
  effectiveFromTypeDetails: string = ""
  isAppointByShareholder: boolean = false

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyDirectorAppointment) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.refNo = data.ref_no
    this.directorInvitations =
      data.director_invitations !== null && Array.isArray(data.director_invitations)
        ? data.director_invitations.map((di: any) => {
            return new DirectorInvitation(di)
          })
        : []
    this.emailAddress = this.directorInvitations.length > 0 ? this.directorInvitations[0].email : ""
    this.directorInvitationId = data.director_invitation_id
    this.directorInvitation = new DirectorInvitation(data.director_invitation)
    this.directorName = data.director_name ?? ""
    this.directorIdentificationType = data.director_identification_type ?? "ic"
    this.directorIdentification = data.director_identification ?? ""
    this.isInitiatedByShareholder = data.is_initiated_by_shareholder ?? false
    this.isEffectFromEffectiveDate = data.is_effect_from_effective_date ?? true
    this.effectiveFromType = data.effective_from_type ?? ""
    this.effectiveFromTypeDetails = data.effective_from_type_details ?? ""
    this.isAppointByShareholder = data.is_appoint_by_shareholder
  }

  cloneDetails(data: CompanyDirectorAppointment): void {
    super.clone(data)
    this.refNo = data.refNo
    this.directorInvitations = data.directorInvitations.map((di: DirectorInvitation) => {
      return new DirectorInvitation(di)
    })
    this.emailAddress = data.emailAddress
    this.directorInvitationId = data.directorInvitationId
    this.directorInvitation = new DirectorInvitation(data.directorInvitation)
    this.directorName = data.directorName
    this.directorIdentificationType = data.directorIdentificationType
    this.directorIdentification = data.directorIdentification
    this.isInitiatedByShareholder = data.isInitiatedByShareholder
    this.isEffectFromEffectiveDate = data.isEffectFromEffectiveDate
    this.effectiveFromType = data.effectiveFromType
    this.effectiveFromTypeDetails = data.effectiveFromTypeDetails
    this.isAppointByShareholder = data.isAppointByShareholder
  }

  getRequestBody(): object {
    let data: any = {
      company_id: this.companyId,
      director_invitations: this.getDirectorInvitationIds(),
      director_name: this.directorName,
      director_id_type: this.directorIdentificationType,
      director_identification_number: this.directorIdentification,
      is_effect_from_effective_date: this.isEffectFromEffectiveDate,
      effective_from_type: this.effectiveFromType,
      effective_from_type_details: this.effectiveFromTypeDetails,
      is_appoint_by_shareholder: this.isAppointByShareholder,
    }

    const directorInvitationIds = this.getDirectorInvitationIds()
    if (directorInvitationIds.length > 0) {
      data.director_invitations = directorInvitationIds
    }
    if (!StringUtil.isNullOrEmpty(this.directorName)) {
      data.director_name = this.directorName
    }
    if (!StringUtil.isNullOrEmpty(this.directorIdentificationType)) {
      data.director_id_type = this.directorIdentificationType
    }
    if (!StringUtil.isNullOrEmpty(this.directorIdentification)) {
      data.director_identification_number = this.directorIdentification
    }

    return data
  }

  getDirectorInvitationIds(): string[] {
    return this.directorInvitations.map((di: DirectorInvitation) => {
      return di.id
    })
  }

  canSubmit(): boolean {
    return !StringUtil.isNullOrEmpty(this.companyId)
  }

  async create(repository: ReturnType<typeof useCompanyDirectorAppointmentStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.create(data)
    if (repository.error) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponseDetails(response)
  }

  async update(repository: ReturnType<typeof useCompanyDirectorAppointmentStore>): Promise<void> {
    if (!this.canSubmit() || StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.update(this.id, data)
    if (repository.error) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponseDetails(response)
  }

  async remove(repository: ReturnType<typeof useCompanyDirectorAppointmentStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    const response = await repository.remove(this.id)
    if (repository.error) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    return response
  }

  async getRegisteredUser(repository: ReturnType<typeof useUserStore>): Promise<User | null> {
    if (this.directorInvitations.length <= 0) {
      return null
    }

    let directorInvitation = this.directorInvitations[0] // get the first
    let userId = directorInvitation.userId
    if (!userId) {
      return null
    }

    const user = await repository.fetch(userId)
    if (repository.error) {
      let error: Error = new Error("", "")
      error.setForFetch()
      throw error
    }

    return new User(user)
  }
}
