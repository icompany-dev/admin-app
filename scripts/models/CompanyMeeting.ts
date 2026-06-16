import { Application } from "./Application"
import { File } from "./File"
import type { IModelApplication } from "./IModelApplication"
import { StringUtil } from "../utils/String"
import { Error } from "../library/Error"
import type { IRepositoryStore } from "./IRepositoryStore"
import { CompanyConstants } from "../constants/Company"
import { CompanyDirectorRemoval } from "./CompanyDirectorRemoval"

export class CompanyMeeting
  extends Application
  implements IModelApplication<CompanyMeeting, ReturnType<typeof useCompanyMeetingStore>>
{
  venueType: string = ""
  otherVenueType: string = ""
  platform: string = ""
  platformLink: string = ""
  targetId: string = ""
  targetType: string = ""
  isChairmanAddress: boolean = false
  isCosecAttendanceRequired: boolean = false
  agendaFileId: string = ""
  agendaFile: File | null = null
  minutesFileId: string = ""
  minutesFile: File | null = null
  notifiedAt: string = ""
  cancelledAt: string = ""

  application: Application | null = null

  constructor(data: any | null = null) {
    super()
    if (!data) {
      return
    }

    if (data instanceof CompanyMeeting) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.venueType = data.venue_type
    this.otherVenueType = data.other_venue_type
    this.platform = data.platform
    this.platformLink = data.platform_link
    this.targetId = data.target_id
    this.targetType = data.target_type
    this.isChairmanAddress = data.is_chairman_address ?? false
    this.isCosecAttendanceRequired = data.is_cosec_attendance_required
    this.agendaFileId = data.agenda_file_id
    this.agendaFile = data.agenda_file ? new File(data.agenda_file) : null
    this.minutesFileId = data.minutes_file_id
    this.minutesFile = data.minutes_file ? new File(data.minutes_file) : null
    this.notifiedAt = data.notified_at
    this.cancelledAt = data.cancelled_at

    this.application = data.application ?? null
  }

  cloneDetails(data: CompanyMeeting): void {
    super.clone(data)
    this.venueType = data.venueType
    this.otherVenueType = data.otherVenueType
    this.platform = data.platform
    this.platformLink = data.platformLink
    this.targetId = data.targetId
    this.targetType = data.targetType
    this.isChairmanAddress = data.isChairmanAddress
    this.isCosecAttendanceRequired = data.isCosecAttendanceRequired
    this.agendaFileId = data.agendaFileId
    this.agendaFile = data.agendaFile ? new File(data.agendaFile) : null
    this.minutesFileId = data.minutesFileId
    this.minutesFile = data.minutesFile ? new File(data.minutesFile) : null
    this.notifiedAt = data.notifiedAt
    this.cancelledAt = data.cancelledAt

    this.application = data.application
  }

  getRequestBody(): object {
    return {
      company_id: this.companyId,
      venue_type: this.venueType,
      other_venue_type: this.otherVenueType,
      platform: this.platform,
      platform_link: this.platformLink,
      target_id: this.targetId,
      target_type: this.targetType,
      is_chairman_address: this.isChairmanAddress,
      is_cosec_attendance_required: this.isCosecAttendanceRequired,
      agenda_file_id: this.agendaFileId,
      minutes_file_id: this.minutesFileId,
    }
  }

  canSubmit(): boolean {
    return (
      !StringUtil.isNullOrEmpty(this.companyId) &&
      !StringUtil.isNullOrEmpty(this.targetType) &&
      !StringUtil.isNullOrEmpty(this.targetId)
    )
  }

  async create(repository: ReturnType<typeof useCompanyMeetingStore>): Promise<void> {
    if (!this.canSubmit()) {
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

  async update(repository: ReturnType<typeof useCompanyMeetingStore>): Promise<void> {
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

  async remove(repository: ReturnType<typeof useCompanyMeetingStore>): Promise<void> {
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

  async setApplication(repository: IRepositoryStore): Promise<void> {
    let response = await repository.fetch(this.targetId)

    if (this.targetType === StringUtil.snakeToPascal(CompanyConstants.TARGET_REMOVAL_OF_DIRECTOR)) {
      this.application = new CompanyDirectorRemoval(response)
    }
  }
}
