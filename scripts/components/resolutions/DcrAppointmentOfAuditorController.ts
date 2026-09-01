import { CompanyAuditorAppointment } from "~/scripts/models/CompanyAuditorAppointment"
import { useCompanyAuditorAppointmentStore } from "#imports"
import { useCompanyStore } from "#imports"
import { useMyDataStore } from "#imports"
import { ResolutionController } from "./ResolutionController"
import { Company } from "~/scripts/models/Company"
import { AuditorInvitation } from "~/scripts/models/AuditorInvitation"
import { StringUtil } from "~/scripts/utils/String"
import { Filter } from "~/scripts/library/Filter"
import { DocumentTemplate } from "~/scripts/models/DocumentTemplate"
import { Error } from "~/scripts/library/Error"
import { TemplateProcessor } from "~/scripts/library/TemplateProcessor"
import { AuditorPartner } from "~/scripts/models/AuditorPartner"
import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { ObjectUtil } from "~/scripts/utils/Object"
import { StatusConstants } from "~/scripts/constants/Status"
import type { CompanyAuditor } from "~/scripts/models/CompanyAuditor"

export class DcrAppointmentOfAuditorController extends ResolutionController<CompanyAuditorAppointment> {
  companyAuditorAppointmentRepository = useCompanyAuditorAppointmentStore()
  companyRepository = useCompanyStore()
  myDataRepository = useMyDataStore()
  documentTemplateRepository = useDocumentTemplateStore()
  eventManager = useEventManagerStore()

  auditorInvitations = ref<AuditorInvitation[]>([])
  financialYearStart = ref<string>("")
  financialYearEnd = ref<string>("")
  auditorFirmName = ref<string>("")
  auditorAddressText = ref<string>("")
  isFirstAudit = ref<boolean>(false)

  auditorPartners = ref<AuditorPartner[]>([])

  time = useLocalTime()

  documentTemplate = ref<DocumentTemplate>(new DocumentTemplate())
  originalResolutionContent = ref<string>("")

  private documentTemplateId: string = "4a5665e8-1f6c-48c5-ba3f-3ae3eef9c042"

  constructor(props: IPropsResolutionDocument<CompanyAuditorAppointment>, emitEvents: any | null) {
    super(
      props.companyId,
      props.applicationId,
      props.application,
      CompanyAuditorAppointment,
      props.isInPreviewMode,
      true,
      false,
      props.showWatermark,
      props.watermarkText,
      emitEvents
    )

    this.signatureStartOnPage.value = 1
    this.maxSignatureOnFirstPage.value = 4
    this.maxSignatureOnOtherPages.value = 6
  }

  async setApplicationId(id: string | null): Promise<void> {
    if (StringUtil.isNullOrEmpty(id)) {
      await this.setApplication()
      return
    } else {
      await this.fetchApplication(id ?? "")
    }

    this.setContent()
    await this.getPersonsToSign()
  }

  async fetchApplication(id: string): Promise<void> {
    let response = await this.companyAuditorAppointmentRepository.fetch(id)
    if (!this.companyAuditorAppointmentRepository.error) {
      this.application.value = new CompanyAuditorAppointment(response)
      if (this.application.value.auditorInvitations.length > 0) {
        this.setAuditorInvitations(this.application.value.auditorInvitations)
      }
      this.financialYearStart.value = this.application.value?.financialYearStart || ""
      this.financialYearEnd.value = this.application.value?.financialYearEnd || ""
      this.auditorFirmName.value = this.auditorFirm()
      this.auditorAddressText.value = this.auditorAddress()

      this.setAuditorInvitations(this.application.value.auditorInvitations)

      if (this.eventManager.selectedAuditorPartnerId) {
        this.application.value.auditorPartnerId = this.eventManager.selectedAuditorPartnerId
        this.eventManager.selectedAuditorPartnerId = null
      }
    }
  }

  async setApplication(): Promise<void> {
    let response = await this.companyRepository.fetch(this.companyId.value)
    if (!this.companyRepository.error) {
      this.application.value = new CompanyAuditorAppointment()
      this.application.value.companyId = this.companyId.value
      this.application.value.company = new Company(response)
    }
  }

  async otherDataInitiation(): Promise<void> {
    await Promise.all([this.fetchAuditorPartners(), this.checkIsFirstAudit()])
  }

  setAuditorInvitations(auditorInvitations: AuditorInvitation[]): void {
    this.auditorInvitations.value = auditorInvitations.map((ai: AuditorInvitation) => {
      return new AuditorInvitation(ai)
    })

    this.auditorFirmName.value = this.auditorFirm()
    this.auditorAddressText.value = this.auditorAddress()
  }

  async checkIsFirstAudit(): Promise<void> {
    try {
      const filter = new Filter()
      filter.searchText = "form 557"
      filter.orderBy = "date"
      filter.sortOrder = "desc"
      filter.companyId = this.companyId.value

      const response = await this.myDataRepository.fetchAllDocuments(filter)
      if (!response) {
        this.isFirstAudit.value = true
        return
      }
      this.isFirstAudit.value = response.noOfDocuments <= 0
    } catch (error) {
      console.error(error)
      this.isFirstAudit.value = true
    }
  }

  async fetchAuditorPartners(): Promise<void> {
    try {
      this.auditorPartners.value = []

      let repository = useAuditorPartnerStore()
      let filter = new Filter()
      filter.takeAll = true

      let response = await repository.fetchAll(filter)
      if (repository.error) {
        throw repository.error
      }

      let unsorted = response.data.map((record: any) => {
        return new AuditorPartner(record)
      })
      this.auditorPartners.value = ObjectUtil.sort<AuditorPartner>(unsorted, "name", "asc").map((record: any) => {
        return new AuditorPartner(record)
      })
    } catch (e) {
      this.auditorPartners.value = []
    }
  }

  async fetchDocumentTemplate(): Promise<void> {
    try {
      let response = await this.documentTemplateRepository.fetch(this.documentTemplateId)
      if (this.documentTemplateRepository.error) {
        throw this.documentTemplateRepository.error
      }

      this.documentTemplate.value = new DocumentTemplate(response)
      this.originalResolutionContent.value = this.documentTemplate.value.content
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error()
        errorMessage.setForFetch()
        errorMessage.handle()
      }
    }
  }

  setContent(): void {
    this.resolutionContent.value = this.getContent()
  }

  getAuditorOptions(): string {
    return this.auditorPartners.value
      .map((a: AuditorPartner) => {
        let selected = this.application.value?.auditorPartnerId === a.id ? "selected" : ""

        return `<option value="${a.id}" ${selected}>${a.name} - ${a.companyName}</option>`
      })
      .join("")
  }

  getContent(): string {
    this.documentTemplate.value.content = this.originalResolutionContent.value

    let auditorSelection = '<span class="value-placeholder">YOUR AUDITOR NAME HERE</span>'
    if (this.isDocumentEditable()) {
      auditorSelection = `
        <select name='auditorPartnerId' id='auditor-partner-id' class='form-control in-resolution auditor-partner'>
          <option value=''>Select an auditor</option>
          ${this.getAuditorOptions()}
        </select>
      `
    } else if (this.isInPreviewMode.value) {
      auditorSelection = '<span class="value-placeholder">YOUR AUDITOR NAME HERE</span>'
    } else {
      auditorSelection = this.auditorFirmName.value ?? "YOUR AUDITOR NAME"
    }

    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      "$text.&lt;name=auditorPartnerId&gt;$",
      auditorSelection
    )

    let templateProcessor = new TemplateProcessor(this.documentTemplate.value)

    return this.isDocumentEditable()
      ? templateProcessor.getContent(this.application.value)
      : templateProcessor.getContentForPrint(this.application.value)
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

  getIsFirstAudit(): boolean {
    return this.isFirstAudit.value
  }

  incorporationDate(): string {
    if (!this.application.value) {
      return ""
    }

    if (!this.application.value.company) {
      return ""
    }

    return this.time.formatDateOnlyShort(this.application.value.company.incorporatedAt || "")
  }

  financialYearEndDate(): string {
    if (!this.application.value) {
      return ""
    }

    return this.time.formatDateOnlyShort(this.application.value.financialYearEnd)
  }

  financialYearMonthAndDays(): string {
    if (!this.application.value) {
      return ""
    }

    return this.time.formatDateMonthOnlyFull(this.application.value.financialYearEnd)
  }

  auditorFirm(): string {
    if (this.auditorInvitations.value.length === 0) {
      return ""
    }

    return this.auditorInvitations.value[0].companyName
  }

  auditorAddress(): string {
    if (this.auditorInvitations.value.length === 0) {
      return ""
    }

    return this.auditorInvitations.value[0].companyLocation?.getOnelineAddress() ?? ""
  }

  handleAuditorInvitationsChanged(auditorInvitations: AuditorInvitation[]): void {
    this.setAuditorInvitations(auditorInvitations)
    this.emitEvents("auditorInvitationsChanged", this.auditorInvitations.value)
  }

  handleFinancialYearChanged(): void {
    if (this.application.value) {
      this.application.value.financialYearStart = this.financialYearStart.value
      this.application.value.financialYearEnd = this.financialYearEnd.value
    }
    this.emitEvents("financialYearChanged", {
      financialYearStart: this.financialYearStart.value,
      financialYearEnd: this.financialYearEnd.value,
    })
  }

  handleAuditorFieldsChanged(): void {
    if (this.auditorInvitations.value.length > 0) {
      this.auditorInvitations.value[0].companyName = this.auditorFirmName.value
    }
    this.emitEvents("auditorFieldsChanged", {
      firmName: this.auditorFirmName.value,
      address: this.auditorAddressText.value,
    })
  }

  handleAuditorPartnerSelected(event: Event): void {
    if (!this.application.value) {
      return
    }

    const inputField = event.target as HTMLSelectElement

    let selectedAuditorPartner = this.auditorPartners.value.find((ap: AuditorPartner) => {
      return ap.id === inputField.value
    })
    let partner = new AuditorPartner(selectedAuditorPartner ?? null)
    this.application.value.auditorPartnerId = inputField.value
    this.application.value.auditorPartner = partner
    this.application.value.auditorNameLicense = `${partner.companyName.toUpperCase()} (${partner.license})`
    this.application.value.auditorAddress = partner.companyLocation.getMultilineAddress()
    this.application.value.greeting = `MESSRS ${partner.companyName.toUpperCase()}`

    this.emitEvents("partnerSelected", this.application.value)

    this.setContent()
  }

  attachEventListeners(): void {
    if (!this.isDocumentEditable()) {
      return
    }

    const auditorPartnerSelector = document.getElementById("auditor-partner-id")
    if (auditorPartnerSelector) {
      auditorPartnerSelector.removeEventListener("change", this.handleAuditorPartnerSelected.bind(this))
      auditorPartnerSelector.addEventListener("change", this.handleAuditorPartnerSelected.bind(this))
    }
  }
}
