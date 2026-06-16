import { EgmKnownPlatforms, EgmVenueType } from "~/scripts/constants/ExtraordianaryGeneralMeetings"
import { PaperOrientation } from "~/scripts/constants/Paper"
import { Error } from "~/scripts/library/Error"
import { Company } from "~/scripts/models/Company"
import { CompanyDirectorRemoval } from "~/scripts/models/CompanyDirectorRemoval"
import { CompanyMeeting } from "~/scripts/models/CompanyMeeting"
import { Shareholder } from "~/scripts/models/Shareholder"
import { SelectOption } from "~/scripts/types/SelectOption"
import { StringUtil } from "~/scripts/utils/String"

export class RemovalOfDirectorEgmMinutesController {
  companyMeetingId: Ref<string> = ref<string>("")
  companyMeeting = ref<CompanyMeeting>(new CompanyMeeting())
  companyDirectorRemoval = ref<CompanyDirectorRemoval>(new CompanyDirectorRemoval())

  emitEvents: any | null = null

  isLoading: Ref<boolean> = ref<boolean>(false)

  shareholders = ref<Shareholder[]>([])

  paperOrientation: string = PaperOrientation.Portrait
  additionalCssClass: string = "removal-of-director-egm-minutes"

  totalPages: Ref<number> = ref<number>(2)

  isQuorumComplete: Ref<boolean> = ref<boolean>(false)

  constructor(companyMeetingId: string, emitEvents: any) {
    this.emitEvents = emitEvents

    this.setCompanyMeetingId(companyMeetingId)
  }

  async setCompanyMeetingId(companyMeetingId: string) {
    this.companyMeetingId.value = companyMeetingId

    try {
      this.isLoading.value = true
      await this.fetchCompanyMeeting()
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error("", "")
        error.setForFetch()
        error.handle()
      }
    } finally {
      this.isLoading.value = false
    }
  }

  async fetchCompanyMeeting(): Promise<void> {
    let repository = useCompanyMeetingStore()
    const response = await repository.fetch(this.companyMeetingId.value)

    if (response) {
      this.companyMeeting.value = new CompanyMeeting(response)

      await Promise.all([this.fetchCompanyDirectorRemoval(), this.fetchShareholders()])
    }
  }

  async fetchCompanyDirectorRemoval(): Promise<void> {
    let companyDirectorRemovalId = this.companyMeeting.value.targetId

    let repository = useCompanyDirectorRemovalStore()
    const response = await repository.fetch(companyDirectorRemovalId)

    if (response) {
      this.companyDirectorRemoval.value = new CompanyDirectorRemoval(response)

      await this.companyDirectorRemoval.value.director.setRegisteredUser(useUserStore())
    }
  }

  async fetchShareholders(): Promise<void> {
    let repository = useShareholderStore()
    const response = await repository.fetchAllForCompany(this.company.id)

    this.shareholders.value = response.map((shareholder: any) => {
      return new Shareholder(shareholder)
    })
  }

  onQuorumChanged(event: Event): void {
    let target = event.target as HTMLSelectElement
    this.isQuorumComplete.value = target.value === "true"
  }

  get company(): Company {
    return this.companyMeeting.value.company ?? new Company()
  }

  get companyName(): string {
    return this.company.getFullName()
  }

  get registrationNumberNew(): string {
    return this.company.registrationNumberNew
  }

  get registrationNumberOld(): string {
    return this.company.registrationNumberOld
  }

  get loaderLabel(): string {
    return "Preparing Your"
  }

  get loaderSublabel(): string {
    return "Minutes"
  }

  get directorName(): string {
    return this.companyDirectorRemoval.value.director.user?.name.toUpperCase() ?? ""
  }

  get venue(): string {
    if (this.companyMeeting.value.venueType === EgmVenueType.Others) {
      return this.companyMeeting.value.otherVenueType
    }

    return this.companyMeeting.value.platform
  }

  get egmDate(): string {
    let time = useLocalTime()

    return time.formatDateOnlyFull(this.companyDirectorRemoval.value.egmDate ?? "")
  }

  get egmTime(): string {
    let time = useLocalTime()

    return time.formatTimeOnly(this.companyDirectorRemoval.value.egmTime ?? "")
  }

  get isMajorityReached(): boolean {
    return false
  }
}
