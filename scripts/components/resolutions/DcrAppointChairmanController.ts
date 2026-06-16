import { CompanyDirectorManagerAppointment } from "~/scripts/models/CompanyDirectorManagerAppointment"
import { Company } from "~/scripts/models/Company"
import { Director } from "~/scripts/models/Director"
import { DocumentTemplate } from "~/scripts/models/DocumentTemplate"
import { ResolutionController } from "./ResolutionController"
import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { TemplateProcessor } from "~/scripts/library/TemplateProcessor"
import { CompanyDirectorManagerTnCDocumentType } from "~/scripts/constants/CompanyDirectorManagers"
import { ObjectUtil } from "~/scripts/utils/Object"

export class DcrAppointChairmanController extends ResolutionController<CompanyDirectorManagerAppointment> {
  companyDirectorManagerAppointmentRepository = useCompanyDirectorManagerAppointmentStore()
  companyRepository = useCompanyStore()
  documentTemplateRepository = useDocumentTemplateStore()

  directors = ref<Director[]>([])

  documentTemplate = ref<DocumentTemplate>(new DocumentTemplate())

  resolutionContent: Ref<string> = ref<string>("")
  originalTemplateContent: string = ""

  private documentTemplateId: string = "78a05874-5abd-4861-957d-f926cad896e7"

  constructor(props: IPropsResolutionDocument<CompanyDirectorManagerAppointment>, emitEvents: any | null) {
    super(
      props.companyId,
      props.applicationId,
      props.application,
      CompanyDirectorManagerAppointment,
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
    let response = await this.companyDirectorManagerAppointmentRepository.fetch(id)
    if (!this.companyDirectorManagerAppointmentRepository.error && response !== null) {
      this.application.value = new CompanyDirectorManagerAppointment(response)
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
      this.application.value = new CompanyDirectorManagerAppointment()
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
    let response = await this.directorRepository.fetchAllForCompany(this.companyId.value)
    this.directors.value = response.map((d: any) => {
      return new Director(d)
    })
  }

  setContent(): void {
    this.resolutionContent.value = this.getContent()
  }

  getNameOptions(): string {
    if (this.isInPreviewMode.value || !this.application.value) {
      return `<span class='value-placeholder'>NAME OF NEW CHAIRMAN</span>`
    }

    if (this.isDocumentEditable()) {
      let directorOptions = this.directors.value.map((d: Director) => {
        let selected = d.name === this.application.value?.name ? "selected" : ""

        return `
          <option value="${d.name}" ${selected}>
            ${d.name}
          </option>
        `
      })

      return `
        <select class='form-control in-resolution director-name' name='directorName'>
          <option></option>
          ${directorOptions.join("")}
        </select> 
      `
    }

    return this.application.value.name.toUpperCase() ?? ""
  }

  getDirectorName(): string {
    if (
      this.isInPreviewMode.value ||
      !this.application.value ||
      StringUtil.isNullOrEmpty(this.application.value.name)
    ) {
      return `<span class='value-placeholder'>NAME OF NEW CHAIRMAN</span>`
    }

    return this.application.value.name.toUpperCase() ?? ""
  }

  getContent(): string {
    this.documentTemplate.value.content = this.originalTemplateContent

    let nameSearchString = "$text.&lt;name=directorName&gt;$"
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      nameSearchString,
      this.getNameOptions()
    )

    let directorNameSearchString = "%directorName%"
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      directorNameSearchString,
      this.getDirectorName()
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

  handleDirectorName(event: Event): void {
    if (!this.application.value) {
      return
    }

    const target = event.target as HTMLSelectElement

    this.application.value.name = target.value
    this.setContent()
  }

  attachEventListeners(): void {
    if (!this.isDocumentEditable()) {
      return
    }

    const directorNameElements = document.querySelectorAll(".director-name")
    directorNameElements.forEach((element) => {
      element.removeEventListener("change", this.handleDirectorName.bind(this))
      element.addEventListener("change", this.handleDirectorName.bind(this))
    })
  }

  override async updateApplicationContent(updatedApplicationData: CompanyDirectorManagerAppointment): Promise<void> {
    if (!this.application.value) {
      this.application.value = new CompanyDirectorManagerAppointment(null)
    }

    let isSame = ObjectUtil.isEqual<CompanyDirectorManagerAppointment>(
      this.application.value as CompanyDirectorManagerAppointment,
      updatedApplicationData
    )
    if (isSame) {
      this.setContent()
      return
    }

    nextTick(async () => {
      this.application.value?.cloneDetails(updatedApplicationData)
      this.setContent()
      await this.getPersonsToSign()
    })
  }
}
