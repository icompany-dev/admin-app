import { EgmKnownPlatforms, EgmVenueType } from "~/scripts/constants/ExtraordianaryGeneralMeetings"
import { PaperOrientation, PaperSize } from "~/scripts/constants/Paper"
import { Error } from "~/scripts/library/Error"
import { Company } from "~/scripts/models/Company"
import { CompanyDirectorRemoval } from "~/scripts/models/CompanyDirectorRemoval"
import { CompanyMeeting } from "~/scripts/models/CompanyMeeting"
import type { Director } from "~/scripts/models/Director"
import { SelectOption } from "~/scripts/types/SelectOption"
import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"
import { StringUtil } from "~/scripts/utils/String"

export class RemovalOfDirectorEgmAgendaController {
  companyMeetingId: Ref<string> = ref<string>("")
  companyMeeting = ref<CompanyMeeting>(new CompanyMeeting())
  companyDirectorRemoval = ref<CompanyDirectorRemoval>(new CompanyDirectorRemoval())

  emitEvents: any | null = null

  isLoading: Ref<boolean> = ref<boolean>(false)

  paperOrientation: string = PaperOrientation.Portrait
  additionalCssClass: string = "removal-of-director-egm-agenda"

  totalPages: Ref<number> = ref<number>(1)

  otherPlatform: Ref<string> = ref<string>("")
  isChairmanAddress: Ref<boolean> = ref<boolean>(false)
  hasAppointedChairman: Ref<boolean> = ref<boolean>(false)

  agendaRef: any | null = null

  constructor(companyMeetingId: string, emitEvents: any) {
    this.emitEvents = emitEvents

    this.setCompanyMeetingId(companyMeetingId)
  }

  setAgendaRef(agendaRef: any): void {
    this.agendaRef = agendaRef
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

      if (this.isShowOtherPlatformField) {
        this.otherPlatform.value = this.companyMeeting.value.platform
        this.companyMeeting.value.platform = EgmKnownPlatforms.Others
      }

      await Promise.all([this.fetchCompanyDirectorRemoval(), this.fetchDirectors()])
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

  async fetchDirectors(): Promise<void> {
    let repository = useDirectorStore()
    let response = await repository.fetchAllForCompany(this.companyMeeting.value.companyId)

    this.hasAppointedChairman.value = response.some((d: Director) => {
      return d.role === "Chairman"
    })
  }

  async onDataUpdated(): Promise<void> {
    this.emitEvents("isUpdating")

    try {
      if (this.isShowOtherPlatformField) {
        this.companyMeeting.value.platform = this.otherPlatform.value
      } else {
        this.otherPlatform.value = ""
      }

      if (!this.isShowOtherVenueField) {
        this.companyMeeting.value.otherVenueType = ""
      }

      this.companyMeeting.value.isChairmanAddress = this.isChairmanAddress.value

      await this.companyMeeting.value.update(useCompanyMeetingStore())
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error("", "")
        error.setForCUD()
        error.handle()
      }
    } finally {
      this.emitEvents("updated")
    }
  }

  async onDownloadClicked(): Promise<void> {
    if (!this.agendaRef) {
      return
    }

    let paperElements = await PdfPaperUtil.getPdfElements(this.agendaRef)
    await PdfPaperUtil.generatePdfFile(paperElements, 20, "EGM Agenda", PaperSize.A4, PaperOrientation.Portrait)
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
    return "Agenda"
  }

  get venueTypeOptions(): SelectOption[] {
    return [
      new SelectOption(EgmVenueType.Virtual, EgmVenueType.Virtual, "Virtual Meeting", false, false),
      new SelectOption(EgmVenueType.Hybrid, EgmVenueType.Hybrid, "Hybrid Meeting", false, false),
      new SelectOption(EgmVenueType.Others, EgmVenueType.Others, "Others", false, false),
    ]
  }

  get isShowOtherVenueField(): boolean {
    return this.companyMeeting.value.venueType === EgmVenueType.Others
  }

  get platformOptions(): SelectOption[] {
    return [
      new SelectOption(EgmKnownPlatforms.GoogleMeet, EgmKnownPlatforms.GoogleMeet, "Google Meet", false, false),
      new SelectOption(
        EgmKnownPlatforms.MicrosoftTeams,
        EgmKnownPlatforms.MicrosoftTeams,
        "Microsoft Teams",
        false,
        false
      ),
      new SelectOption(EgmKnownPlatforms.Zoom, EgmKnownPlatforms.Zoom, "Zoom", false, false),
      new SelectOption(EgmKnownPlatforms.Others, EgmKnownPlatforms.Others, "Others", false, false),
    ]
  }

  get isShowOtherPlatformField(): boolean {
    if (StringUtil.isNullOrEmpty(this.companyMeeting.value.platform)) {
      return false
    }

    return (
      this.companyMeeting.value.platform !== EgmKnownPlatforms.GoogleMeet &&
      this.companyMeeting.value.platform !== EgmKnownPlatforms.MicrosoftTeams &&
      this.companyMeeting.value.platform !== EgmKnownPlatforms.Zoom
    )
  }

  get isStartWithChairmansAddress(): boolean {
    return this.isChairmanAddress.value
  }

  get isStartWithAppointmentOfChairman(): boolean {
    return !this.isChairmanAddress.value
  }

  get directorName(): string {
    return this.companyDirectorRemoval.value.director.user?.name.toUpperCase() ?? ""
  }

  get egmDate(): string {
    let time = useLocalTime()

    return time.formatDateOnlyFull(this.companyDirectorRemoval.value.egmDate ?? "")
  }

  get egmTime(): string {
    let time = useLocalTime()

    return time.formatTimeOnly(this.companyDirectorRemoval.value.egmTime ?? "")
  }

  get venueFragments(): string[] {
    if (
      !this.companyDirectorRemoval.value ||
      !this.companyDirectorRemoval.value.egmVenue ||
      this.companyDirectorRemoval.value.egmVenue.length <= 0
    ) {
      return ["", "", "", ""]
    }

    return this.companyDirectorRemoval.value.egmVenue.split("-")
  }

  get venue(): string {
    let type = this.companyMeeting.value.venueType ?? EgmVenueType.Others

    if (type !== EgmVenueType.Others) {
      return `${StringUtil.capitalize(type)} Meeting`
    }

    return this.companyMeeting.value.otherVenueType ?? "EGM VENUE"
  }
}
