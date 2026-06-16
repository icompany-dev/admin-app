import { CompanyDirectorRemoval } from "~/scripts/models/CompanyDirectorRemoval"
import { Company } from "~/scripts/models/Company"
import { Director } from "~/scripts/models/Director"
import { DocumentTemplate } from "~/scripts/models/DocumentTemplate"
import { ResolutionController } from "./ResolutionController"
import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { TemplateProcessor } from "~/scripts/library/TemplateProcessor"
import type { SignatureGroup } from "~/scripts/models/SignatureGroup"
import { StatusConstants } from "~/scripts/constants/Status"
import { ObjectUtil } from "~/scripts/utils/Object"
import { SignatureItem } from "~/scripts/types/SignatureItem"
import { EgmKnownPlatforms, EgmVenueType } from "~/scripts/constants/ExtraordianaryGeneralMeetings"
import { SelectOption } from "~/scripts/types/SelectOption"

export class DcrConveneRemoveDirectorMeetingController extends ResolutionController<CompanyDirectorRemoval> {
  companyDirectorRemovalRepository = useCompanyDirectorRemovalStore()
  companyRepository = useCompanyStore()
  documentTemplateRepository = useDocumentTemplateStore()

  directors = ref<Director[]>([])
  numberOfShareholders: Ref<number> = ref<number>(0)

  documentTemplate = ref<DocumentTemplate>(new DocumentTemplate())

  originalTemplateContent: string = ""

  private documentTemplateId: string = "827d74fa-6e92-474e-8878-2ccfb45be15f"

  constructor(props: IPropsResolutionDocument<CompanyDirectorRemoval>, emitEvents: any | null) {
    super(
      props.companyId,
      props.applicationId,
      props.application,
      CompanyDirectorRemoval,
      props.isInPreviewMode,
      true,
      false,
      props.showWatermark,
      props.watermarkText,
      emitEvents
    )

    this.signatureStartOnPage.value = 1
    this.maxSignatureOnFirstPage.value = 2
    this.maxSignatureOnOtherPages.value = 6
  }

  async setApplicationId(id: string | null): Promise<void> {
    if (StringUtil.isNullOrEmpty(id)) {
      await this.setApplication()
      return
    } else {
      await this.fetchApplication(id ?? "")
    }
  }

  async fetchApplication(id: string): Promise<void> {
    let response = await this.companyDirectorRemovalRepository.fetch(id)
    if (!this.companyDirectorRemovalRepository.error && response !== null) {
      this.application.value = new CompanyDirectorRemoval(response)
      this.initializeData()
    }
  }

  async setApplication(): Promise<void> {
    if (this.application.value && !StringUtil.isNullOrEmpty(this.application.value.id)) {
      return
    }

    let response = await this.companyRepository.fetch(this.companyId.value)
    let company = new Company(response)
    if (!this.companyRepository.error) {
      this.application.value = new CompanyDirectorRemoval()
      this.application.value.companyId = this.companyId.value
      this.application.value.company = new Company(company)
      this.initializeData()
    }
  }

  async fetchDocumentTemplate(): Promise<void> {
    try {
      let response = await this.documentTemplateRepository.fetch(this.documentTemplateId)
      if (this.documentTemplateRepository.error) {
        throw this.documentTemplateRepository.error
      }

      this.documentTemplate.value = new DocumentTemplate(response)
      this.originalTemplateContent = this.documentTemplate.value.content
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error("", "")
        errorMessage.setForFetch()
        errorMessage.handle()
      }
    }
  }

  async otherDataInitiation(): Promise<void> {
    await Promise.all([this.fetchShareholders(), this.fetchDirectors()])
  }

  async fetchShareholders(): Promise<void> {
    let response = await this.shareholderRepository.fetchAllForCompany(this.companyId.value)
    this.numberOfShareholders.value = response.length
  }

  async fetchDirectors(): Promise<void> {
    let response = await this.directorRepository.fetchAllForCompany(this.companyId.value)
    this.directors.value = response.map((d: any) => {
      return new Director(d)
    })
  }

  override async getPersonsToSign(): Promise<void> {
    let response = await this.directorRepository.fetchAllForCompany(this.companyId.value)
    this.signatureItems.value = response
      .filter((d: Director) => {
        if (this.application.value && d.id === this.application.value.directorId) {
          return false
        }

        if (!this.excludeResigningDirectors) {
          return true
        }

        return !new Director(d).isResignationInProgress
      })
      .map((d: Director) => {
        return new SignatureItem(
          this.signatureFile(d.email, "director"),
          this.hasSigned(d.email, "director"),
          this.isSignatureEditable("director"),
          d.email !== this.currentUser.email,
          d.name,
          d.email,
          "Director"
        )
      })
  }

  setContent(): void {
    this.resolutionContent.value = this.getContent()
  }

  getEgmDate(): string {
    if (this.isInPreviewMode.value || !this.application.value) {
      return '<span class="value-placeholder">DATE</span>'
    }

    let dayjs = useDayjs()

    if (this.isDocumentEditable()) {
      let date = this.application.value.egmDate
      if (date === null) {
        if (this.application.value.signatureGroups.length > 0) {
          let orderedSignatureGroups = ObjectUtil.sort<SignatureGroup>(
            this.application.value.signatureGroups,
            "createdAt",
            "asc"
          )
          let firstSignature = orderedSignatureGroups[0]
          let dateOfNotice = dayjs(firstSignature.createdAt ?? "")
          date = dateOfNotice.add(28, "days").format("YYYY-MM-DD")
        } else {
          date = dayjs().add(28, "days").format("YYYY-MM-DD")
        }
      }

      return `
        <input type='date' name='egmDate' value="${date}" class='form-control in-resolution' min="${date}">
      `
    }

    return dayjs(this.application.value.egmDate).format("D MMMM YYYY")
  }

  getEgmTime(): string {
    if (this.isInPreviewMode.value || !this.application.value) {
      return '<span class="value-placeholder">TIME</span>'
    }

    let dayjs = useDayjs()

    if (this.isDocumentEditable()) {
      let value = this.application.value.egmTime !== null ? dayjs(this.application.value.egmTime).format("HH:mm") : null
      return `
        <input type='time' name='egmTime' value='${value}' class='form-control in-resolution'>
      `
    }

    return dayjs(this.application.value.egmTime).format("h:mm a")
  }

  getEgmVenue(): string {
    if (this.isInPreviewMode.value || !this.application.value) {
      return '<span class="value-placeholder">VENUE / PLATFORM</span>'
    }

    if (this.isDocumentEditable()) {
      let venueTypes = this.venueTypeOptions.map((opt: SelectOption) => {
        let selected = this.application.value?.egmVenue?.includes(opt.value as string) ? "selected" : ""
        return `
          <option value='${opt.value}' ${selected}>
            ${opt.label}
          </option>
        `
      })

      let venueTypeSelect = `
        <select class='form-control in-resolution venue-type'>
          ${venueTypes.join("")}
        </select>
      `

      if (this.isShowOtherVenueField) {
        let otherVenueType = `
          <input type='text' class='form-control in-resolution otherVenue' value='${this.otherVenueType}'>
        `

        venueTypeSelect = `${venueTypeSelect} ${otherVenueType}`
      }

      if (!this.isShowOtherVenueField) {
        let platformOptions = this.platformOptions.map((opt: SelectOption) => {
          let selected =
            this.venuePlatform === opt.value ||
            (this.isShowOtherPlatformField && opt.value === EgmKnownPlatforms.Others)
              ? "selected"
              : ""

          return `
            <option value='${opt.value}' ${selected}>
              ${opt.label}
            </option>
          `
        })

        let platformSelect = `
          <select class='form-control in-resolution venuePlatform'>
            ${platformOptions.join("")}
          </select>
        `

        if (this.isShowOtherPlatformField) {
          let otherVenuePlatform = `
            <input type='text' class='form-control in-resolution otherPlatform' value='${this.otherVenuePlatform}'>
          `

          platformSelect = `${platformSelect} ${otherVenuePlatform}`
        }

        venueTypeSelect = `${venueTypeSelect} / ${platformSelect}`
      }

      return venueTypeSelect
    }

    return `${this.venue}<br>${this.venuePlatform}` ?? '<span class="value-placeholder">VENUE / PLATFORM</span>'
  }

  getContent(): string {
    this.documentTemplate.value.content = this.originalTemplateContent

    //shareholder(s)
    let shareholderStringToReplace = "$text.&lt;name=shareholderOrShareholders&gt;$"
    let shareholderString = this.numberOfShareholders.value > 1 ? "shareholders" : "shareholder"
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      shareholderStringToReplace,
      shareholderString
    )

    let directorNameSearchString = "$text.&lt;name=directorName&gt;$"
    this.documentTemplate.value.content = this.documentTemplate.value.content.replaceAll(
      directorNameSearchString,
      this.directorName
    )

    let egmTimeSearchString = "$text.&lt;name=egmTime&gt;$"
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      egmTimeSearchString,
      this.getEgmTime()
    )

    let egmVenueSearchString = "$text.&lt;name=egmVenue&gt;$"
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      egmVenueSearchString,
      this.getEgmVenue()
    )

    let egmDateSearchString = "$date.&lt;name=egmDate&gt;$"
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      egmDateSearchString,
      this.getEgmDate()
    )

    //andCompanyConstitution
    let companyConstitutionStringToReplace = " $text.&lt;name=andCompanyConstitution&gt;$"
    let andCompanyConstitutionString = this.application.value?.company?.hasConstitution
      ? " and the Constitution of the Company"
      : ""
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      companyConstitutionStringToReplace,
      andCompanyConstitutionString
    )

    let templateProcessor = new TemplateProcessor(this.documentTemplate.value)

    let content = this.isDocumentEditable()
      ? templateProcessor.getContent(this.application.value, this.isInPreviewMode.value)
      : templateProcessor.getContentForPrint(this.application.value)

    return content
  }

  totalPages(): number {
    if (this.directorRepository.isLoading || this.signatureItems.value.length <= 0) {
      return 1
    }

    return (
      this.signatureStartOnPage.value +
      Math.ceil(
        (this.signatureItems.value.length - this.maxSignatureOnFirstPage.value) / this.maxSignatureOnOtherPages.value
      )
    )
  }

  override isDocumentEditable(): boolean {
    if (this.isInPreviewMode.value) {
      return false
    }

    if (!this.application.value) {
      return false
    }

    let directorSignatures = this.application.value.signatureGroups.filter((sg: SignatureGroup) => {
      return sg.group?.target === "director"
    })

    if (directorSignatures.length > 0) {
      return false
    }

    return (
      this.application.value &&
      (StringUtil.isNullOrEmpty(this.application.value.id) ||
        this.application.value.status === StatusConstants.DRAFT ||
        this.application.value.status === StatusConstants.PENDING ||
        this.application.value.status === StatusConstants.PAID)
    )
  }

  handleVenueType(event: Event): void {
    if (!this.application.value) {
      return
    }

    let target = event.target as HTMLSelectElement

    let fragments = this.venueFragments
    if (fragments[0] === undefined) {
      fragments.push(target.value)
    } else {
      fragments[0] = target.value
    }

    if (target.value === EgmVenueType.Others) {
      if (fragments[2] !== undefined) {
        fragments[2] = ""
      }

      if (fragments[3] !== undefined) {
        fragments[3] = ""
      }
    } else {
      if (fragments[1] !== undefined) {
        fragments[1] = ""
      }
    }

    this.application.value.egmVenue = fragments.join("-")

    this.setContent()
  }

  handleOtherVenueType(event: Event): void {
    if (!this.application.value) {
      return
    }

    let target = event.target as HTMLInputElement

    let fragments = this.venueFragments
    if (fragments[1] === undefined) {
      fragments.push(target.value)
    } else {
      fragments[1] = target.value
    }

    this.application.value.egmVenue = fragments.join("-")

    this.setContent()
  }

  handleVenuePlatform(event: Event): void {
    if (!this.application.value) {
      return
    }

    let target = event.target as HTMLSelectElement

    let fragments = this.venueFragments
    if (fragments[2] === undefined) {
      fragments.push(target.value)
    } else {
      fragments[2] = target.value
    }

    if (target.value !== EgmKnownPlatforms.Others) {
      if (fragments[3] !== undefined) {
        fragments[3] = ""
      }
    }

    this.application.value.egmVenue = fragments.join("-")

    this.setContent()
  }

  handleVenueOtherPlatform(event: Event): void {
    if (!this.application.value) {
      return
    }

    let target = event.target as HTMLInputElement

    let fragments = this.venueFragments
    if (fragments[3] === undefined) {
      fragments.push(target.value)
    } else {
      fragments[3] = target.value
    }

    this.application.value.egmVenue = fragments.join("-")
    this.setContent()
  }

  attachEventListeners(): void {
    if (!this.isDocumentEditable()) {
      return
    }

    let venueTypeSelectors = document.querySelectorAll(".venue-type")
    venueTypeSelectors.forEach((el) => {
      el.removeEventListener("change", this.handleVenueType.bind(this))
      el.addEventListener("change", this.handleVenueType.bind(this))
    })

    let otherVenueSelectors = document.querySelectorAll(".otherVenue")
    otherVenueSelectors.forEach((el) => {
      el.removeEventListener("change", this.handleOtherVenueType.bind(this))
      el.addEventListener("change", this.handleOtherVenueType.bind(this))
    })

    let venuePlatformSelectors = document.querySelectorAll(".venuePlatform")
    venuePlatformSelectors.forEach((el) => {
      el.removeEventListener("change", this.handleVenuePlatform.bind(this))
      el.addEventListener("change", this.handleVenuePlatform.bind(this))
    })

    let venueOtherPlatformSelectors = document.querySelectorAll(".otherPlatform")
    venueOtherPlatformSelectors.forEach((el) => {
      el.removeEventListener("change", this.handleVenueOtherPlatform.bind(this))
      el.addEventListener("change", this.handleVenueOtherPlatform.bind(this))
    })
  }

  get directorName(): string {
    if (!this.application.value) {
      return '<span class="value-placeholder">NAME OF DIRECTOR</span>'
    }

    if (StringUtil.isNullOrEmpty(this.application.value.directorId)) {
      return '<span class="value-placeholder">NAME OF DIRECTOR</span>'
    }

    let matchedDirector = this.directors.value.find((d: Director) => {
      return d.id === this.application.value?.directorId
    })

    return matchedDirector ? matchedDirector.name : '<span class="value-placeholder">NAME OF DIRECTOR</span>'
  }

  get venueTypeOptions(): SelectOption[] {
    return [
      new SelectOption(EgmVenueType.Virtual, EgmVenueType.Virtual, "Virtual Meeting", false, false),
      new SelectOption(EgmVenueType.Hybrid, EgmVenueType.Hybrid, "Hybrid Meeting", false, false),
      new SelectOption(EgmVenueType.Others, EgmVenueType.Others, "Others", false, false),
    ]
  }

  get isShowOtherVenueField(): boolean {
    return this.application.value?.egmVenue?.includes(EgmVenueType.Others) ?? false
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
    if (!this.application.value || StringUtil.isNullOrEmpty(this.application.value.egmVenue)) {
      return false
    }

    return (
      !this.application.value.egmVenue?.includes(EgmKnownPlatforms.GoogleMeet) &&
      !this.application.value.egmVenue?.includes(EgmKnownPlatforms.MicrosoftTeams) &&
      !this.application.value.egmVenue?.includes(EgmKnownPlatforms.Zoom)
    )
  }

  get venueFragments(): string[] {
    if (!this.application.value || !this.application.value.egmVenue || this.application.value.egmVenue.length <= 0) {
      return ["", "", "", ""]
    }

    return this.application.value.egmVenue.split("-")
  }

  get otherVenueType(): string {
    return this.venueFragments[1] ?? "EGM VENUE"
  }

  get venue(): string {
    let type = this.venueFragments[0] ?? EgmVenueType.Others

    if (type !== EgmVenueType.Others) {
      return `${StringUtil.capitalize(type)} Meeting`
    }

    return this.venueFragments[1] ?? "EGM VENUE"
  }

  get venuePlatform(): string {
    let type = this.venueFragments[2] ?? EgmKnownPlatforms.Others

    if (type !== EgmKnownPlatforms.Others) {
      return type
    }

    return this.venueFragments[3] ?? "EGM PLATFORM"
  }

  get otherVenuePlatform(): string {
    return this.venueFragments[4] ?? "EGM PLATFORM"
  }
}
