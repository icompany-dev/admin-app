import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"
import { Application } from "./Application"
import { AuditorInvitation } from "./AuditorInvitation"
import { AuditorPartner } from "./AuditorPartner"
import type { IModelApplication } from "./IModelApplication"
import { User } from "./User"

export class CompanyAuditorAppointment
  extends Application
  implements IModelApplication<CompanyAuditorAppointment, ReturnType<typeof useCompanyAuditorAppointmentStore>>
{
  refNo: string = ""
  auditorInvitations: AuditorInvitation[] = []
  auditorInvitationId: string = ""
  auditorInvitation: AuditorInvitation = new AuditorInvitation()
  auditorPartnerId: string = ""
  auditorPartner: AuditorPartner = new AuditorPartner()
  financialYearStart: string = ""
  financialYearEnd: string = ""

  // This is entirely for display purposes
  auditorNameLicense: string = "YOUR AUDITOR NAME (YOUR AUDITOR LICENSE)"
  auditorAddress: string = "ADDRESS LINE 1<br>ADDRESS LINE 2<br>POSTCODE CITY<br>STATE"
  greeting: string = "MESSRS YOUR AUDITOR NAME"

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyAuditorAppointment) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.refNo = data.ref_no
    this.auditorInvitations =
      data.auditor_invitations !== null && Array.isArray(data.auditor_invitations)
        ? data.auditor_invitations.map((ai: any) => {
            return new AuditorInvitation(ai)
          })
        : []
    this.auditorInvitationId = data.auditor_invitation_id
    this.auditorInvitation = new AuditorInvitation(data.auditor_invitation)
    this.auditorPartnerId = data.auditor_partner?.id ?? null
    this.auditorPartner = new AuditorPartner(data.auditor_partner)
    this.financialYearStart = data.financial_year_start
    this.financialYearEnd = data.financial_year_end

    if (!StringUtil.isNullOrEmpty(this.auditorPartner.id)) {
      this.auditorNameLicense = `${this.auditorPartner.companyName.toUpperCase()} (${this.auditorPartner.license})`
      this.auditorAddress = this.auditorPartner.companyLocation.getMultilineAddress()
      this.greeting = `MESSRS ${this.auditorPartner.companyName.toUpperCase()}`
    }
  }

  cloneDetails(data: CompanyAuditorAppointment): void {
    super.clone(data)
    this.refNo = data.refNo
    this.auditorInvitations = data.auditorInvitations.map((ai: AuditorInvitation) => {
      return new AuditorInvitation(ai)
    })
    this.auditorInvitationId = data.auditorInvitationId
    this.auditorInvitation = new AuditorInvitation(data.auditorInvitation)
    this.auditorPartnerId = data.auditorPartnerId
    this.auditorPartner = new AuditorPartner(data.auditorPartner)
    this.financialYearStart = data.financialYearStart
    this.financialYearEnd = data.financialYearEnd

    this.auditorNameLicense = data.auditorNameLicense
    this.auditorAddress = data.auditorAddress
    this.greeting = data.greeting
  }

  getRequestBody(): object {
    let data: any = {
      company_id: this.companyId,
      auditor_invitations: this.getAuditorInvitationIds(),
      auditor_partner_id: this.auditorPartnerId,
      financial_year_start: this.financialYearStart,
      financial_year_end: this.financialYearEnd,
    }

    const auditorInvitationIds = this.getAuditorInvitationIds()
    if (auditorInvitationIds.length > 0) {
      data.auditor_invitation_id = auditorInvitationIds[0]
    }
    if (!StringUtil.isNullOrEmpty(this.financialYearStart)) {
      data.financial_year_start = this.financialYearStart
    }
    if (!StringUtil.isNullOrEmpty(this.financialYearEnd)) {
      data.financial_year_end = this.financialYearEnd
    }

    return data
  }

  getAuditorInvitationIds(): string[] {
    return this.auditorInvitations.map((di: AuditorInvitation) => {
      return di.id
    })
  }

  canSubmit(): boolean {
    return !StringUtil.isNullOrEmpty(this.companyId)
  }

  async create(repository: ReturnType<typeof useCompanyAuditorAppointmentStore>): Promise<void> {
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

  async update(repository: ReturnType<typeof useCompanyAuditorAppointmentStore>): Promise<void> {
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

  async remove(repository: ReturnType<typeof useCompanyAuditorAppointmentStore>): Promise<void> {
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
    if (this.auditorInvitations.length <= 0) {
      return null
    }

    let auditorInvitation = this.auditorInvitations[0] // get the first
    let userId = auditorInvitation.userId
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
