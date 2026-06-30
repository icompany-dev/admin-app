import { CompanyDirectorAppointment } from "~/scripts/models/CompanyDirectorAppointment"
import { useCompanyDirectorAppointmentStore } from "#imports"
import { useCompanyStore } from "#imports"
import { ResolutionController } from "./ResolutionController"
import { Company } from "~/scripts/models/Company"
import { IdentificationTypes, IdentificationType } from "~/scripts/constants/IdentificationTypes"
import { StringUtil } from "~/scripts/utils/String"
import { AppointmentEffectFrom } from "~/scripts/constants/AppointmentOfDirectors"
import { DocumentTemplate } from "~/scripts/models/DocumentTemplate"
import { Error } from "~/scripts/library/Error"
import { TemplateProcessor } from "~/scripts/library/TemplateProcessor"
import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

export abstract class ResolutionAppointmentOfDirectorController extends ResolutionController<CompanyDirectorAppointment> {
  companyDirectorAppointmentRepository = useCompanyDirectorAppointmentStore()
  companyRepository = useCompanyStore()

  identificationTypeOptions: Array<IdentificationType> = IdentificationTypes.OPTIONS
  directorName: string | null = null
  directorEmail: string | null = null
  directorIdentificationType: string = IdentificationTypes.IC.id
  directorIdentification: string | null = null

  selectedEffectFrom: Ref<AppointmentEffectFrom> = ref<AppointmentEffectFrom>(AppointmentEffectFrom.EffectiveDate)
  selectedEffectFromDetails: Ref<string | null> = ref<string | null>(null)

  isByShareholder: Ref<boolean> = ref<boolean>(false)

  dcrResolutionContentId: string = "077ae21e-0084-4f3c-8cc3-b2e604e3cda6"
  mcrResolutionContentId: string = "22489268-c062-4bec-9c7e-eed51f103d2b"
  mcrDcrResolutionContentId: string = "f2dd2a9e-9794-49a2-815d-c3efa2daf32f"

  documentTemplateRepository = useDocumentTemplateStore()
  dcrTemplate = ref<DocumentTemplate>(new DocumentTemplate())
  mcrTemplate = ref<DocumentTemplate>(new DocumentTemplate())
  originalDcrTemplateContent: Ref<string> = ref<string>("")
  originalMcrTemplateContent: Ref<string> = ref<string>("")

  dcrResolutionContent: Ref<string> = ref<string>("")
  mcrResolutionContent: Ref<string> = ref<string>("")

  constructor(props: IPropsResolutionDocument<CompanyDirectorAppointment>, isDcr: boolean, emitEvents: any | null) {
    super(
      props.companyId,
      props.applicationId,
      props.application,
      CompanyDirectorAppointment,
      props.isInPreviewMode,
      isDcr,
      !isDcr,
      props.showWatermark,
      props.watermarkText,
      emitEvents
    )
    this.isByShareholder.value = props.isByShareholder

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

    this.initializeData()
    this.setContent()
  }

  async fetchApplication(id: string): Promise<void> {
    let response = await this.companyDirectorAppointmentRepository.fetch(id)
    if (!this.companyDirectorAppointmentRepository.error) {
      this.application.value = new CompanyDirectorAppointment(response)
      this.selectedEffectFrom.value = this.application.value.effectiveFromType as AppointmentEffectFrom
      this.selectedEffectFromDetails.value = this.application.value.effectiveFromTypeDetails
    }
  }

  async setApplication(): Promise<void> {
    let response = await this.companyRepository.fetch(this.companyId.value)
    if (!this.companyRepository.error) {
      this.application.value = new CompanyDirectorAppointment()
      this.application.value.companyId = this.companyId.value
      this.application.value.company = new Company(response)
      this.application.value.isAppointByShareholder = this.isByShareholder.value
      this.selectedEffectFrom.value = this.application.value.effectiveFromType as AppointmentEffectFrom
      this.selectedEffectFromDetails.value = this.application.value.effectiveFromTypeDetails
    }
  }

  async fetchDocumentTemplate(): Promise<void> {
    // do nothing
  }

  async otherDataInitiation(): Promise<void> {
    try {
      await Promise.all([this.fetchDcrTemplate(), this.fetchMcrTemplate()])
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

  async fetchDcrTemplate(): Promise<void> {
    let templateId = this.isByShareholder.value ? this.mcrDcrResolutionContentId : this.dcrResolutionContentId
    let response = await this.documentTemplateRepository.fetch(templateId)
    if (this.documentTemplateRepository.error) {
      throw this.documentTemplateRepository.error
    }

    this.dcrTemplate.value = new DocumentTemplate(response)
    this.originalDcrTemplateContent.value = this.dcrTemplate.value.content
  }

  async fetchMcrTemplate(): Promise<void> {
    let response = await this.documentTemplateRepository.fetch(this.mcrResolutionContentId)
    if (this.documentTemplateRepository.error) {
      throw this.documentTemplateRepository.error
    }

    this.mcrTemplate.value = new DocumentTemplate(response)
    this.originalMcrTemplateContent.value = this.mcrTemplate.value.content
  }

  async setContent(): Promise<void> {
    this.dcrTemplate.value.content = this.originalDcrTemplateContent.value
    this.mcrTemplate.value.content = this.originalMcrTemplateContent.value

    await nextTick(() => {
      this.dcrResolutionContent.value = this.getContent(this.dcrTemplate.value)
      this.mcrResolutionContent.value = this.getContent(this.mcrTemplate.value)
    })
  }

  getContent(documentTemplate: DocumentTemplate): string {
    if (this.isDocumentEditable()) {
      let additionalSelectClass = this.isEffectFromTerms() ? "large" : ""
      let fields = `
        <select
          class="form-control in-resolution ${additionalSelectClass}"
          id='effect-from'
          name='effectiveFromType'
        >
          <option value="${AppointmentEffectFrom.EffectiveDate}" ${this.isEffectFromEffectiveDate() ? "selected" : ""}>with effect from</option>
          <option value="${AppointmentEffectFrom.FixTerm}" ${this.isEffectFromFixTerm() ? "selected" : ""}>for a fix term of</option>
          <option value="${AppointmentEffectFrom.TermsOfAppointment}" ${this.isEffectFromTerms() ? "selected" : ""}>
            with conditions as stated in the Terms of Appointment
          </option>
        </select>
      `
      if (this.isShowSelectedEffectFromDetails()) {
        let type = this.isEffectFromEffectiveDate() ? "date" : "text"
        fields = `
          ${fields}
          <input
            type="${type}"
            class="form-control in-resolution"
            name="effectiveFromTypeDetails"
            id="effect-from-details"
          />
        `
      }

      documentTemplate.content = documentTemplate.content.replace("$text.&lt;name=witheffectfrom&gt;$", fields)

      let identificationType = `
      <select
          class="form-control in-resolution"
          id='identification-type'
          name="directorIdentificationType"
        >
          <option value="${IdentificationTypes.IC.id}" ${this.application.value?.directorIdentificationType === IdentificationTypes.IC.id ? "selected" : ""}>${IdentificationTypes.IC.value}</option>
          <option value="${IdentificationTypes.PASSPORT.id}" ${this.application.value?.directorIdentificationType === IdentificationTypes.PASSPORT.id ? "selected" : ""}>${IdentificationTypes.PASSPORT.value}</option>
        </select>
      `

      documentTemplate.content = documentTemplate.content.replace(
        "$text.&lt;name=directorIdentificationType&gt;$",
        identificationType
      )
    } else {
      if (this.isInPreviewMode.value) {
        documentTemplate.content = documentTemplate.content.replace(
          "$text.&lt;name=directorName&gt;$",
          `<span class='placeholder'>${this.directorNameValue()}</span>`
        )
        documentTemplate.content = documentTemplate.content.replace(
          "$text.&lt;name=witheffectfrom&gt;$",
          `<span class='placeholder'>${this.effectFromValue()}</span>`
        )
        documentTemplate.content = documentTemplate.content.replace(
          "$text.&lt;name=directorIdentificationType&gt;$",
          `<span class='placeholder'>${this.directorIdentificationTypeValue()}</span>`
        )
        documentTemplate.content = documentTemplate.content.replace(
          "$text.&lt;name=directorIdentification&gt;$",
          `<span class='placeholder'>${this.directorIdentificationValue()}</span>`
        )
        documentTemplate.content = documentTemplate.content.replace(
          "$text.&lt;name=emailAddress&gt;$",
          `<span class='placeholder'>${this.directorEmailValue()}</span>`
        )
      } else {
        documentTemplate.content = documentTemplate.content.replace(
          "$text.&lt;name=directorIdentificationType&gt;$",
          this.directorIdentificationTypeValue()
        )

        documentTemplate.content = documentTemplate.content.replace(
          "$text.&lt;name=witheffectfrom&gt;$",
          this.effectFromValue()
        )
      }
    }

    let templateProcessor = new TemplateProcessor(documentTemplate)

    let template = null

    if (this.isInPreviewMode.value) {
      template = templateProcessor.getContentForPreview(this.application.value)
    } else {
      template = this.isDocumentEditable()
        ? templateProcessor.getContent(this.application.value, this.isInPreviewMode.value)
        : templateProcessor.getContentForPrint(this.application.value)
    }

    return template
  }

  attachEventListeners(): void {
    if (!this.isDocumentEditable()) {
      return
    }

    const withEffectFrom = document.getElementById("effect-from")
    if (withEffectFrom) {
      withEffectFrom.removeEventListener("change", this.onEffectFromChanged.bind(this))
      withEffectFrom.addEventListener("change", this.onEffectFromChanged.bind(this))
    }

    const withEffectFromDetails = document.getElementById("effect-from-details")
    if (withEffectFromDetails) {
      withEffectFromDetails.removeEventListener("change", this.onEffectFromDetailsChanged.bind(this))
      withEffectFromDetails.addEventListener("change", this.onEffectFromDetailsChanged.bind(this))
    }
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

  identificationType(): string {
    if (!this.application.value?.directorIdentificationType) {
      return IdentificationTypes.IC.value
    }

    return (
      this.identificationTypeOptions.find((idt: IdentificationType) => {
        return idt.id === this.application.value?.directorIdentificationType
      })?.value ?? IdentificationTypes.IC.value
    )
  }

  onDirectorNameChanged(): void {
    if (!this.application.value) {
      return
    }

    this.application.value.directorName = this.directorName
  }

  onDirectorEmailChanged(): void {
    if (!this.application.value) {
      return
    }

    this.application.value.emailAddress = this.directorEmail
  }

  onDirectorIdentificationTypeChanged(): void {
    if (!this.application.value) {
      return
    }

    this.application.value.directorIdentificationType = this.directorIdentificationType
  }

  onDirectorIdentificationChanged(): void {
    if (!this.application.value) {
      return
    }

    this.application.value.directorIdentification = this.directorIdentification
  }

  onEffectFromChanged(event: Event): void {
    if (!this.application.value) {
      return
    }

    const selectField = event.target as HTMLSelectElement

    this.selectedEffectFrom.value = selectField.value as AppointmentEffectFrom
    this.application.value.isEffectFromEffectiveDate =
      this.selectedEffectFrom.value === AppointmentEffectFrom.EffectiveDate

    this.application.value.effectiveFromType = this.selectedEffectFrom.value
    if (!this.isShowSelectedEffectFromDetails()) {
      this.application.value.effectiveFromTypeDetails = ""
    }
    this.setContent()
  }

  isShowSelectedEffectFromDetails(): boolean {
    return (
      this.isDocumentEditable() &&
      (this.selectedEffectFrom.value === AppointmentEffectFrom.EffectiveDate ||
        this.selectedEffectFrom.value === AppointmentEffectFrom.FixTerm)
    )
  }

  onEffectFromDetailsChanged(event: Event): void {
    if (!this.application.value) {
      return
    }

    const inputField = event.target as HTMLInputElement
    this.selectedEffectFromDetails.value = inputField.value

    this.application.value.effectiveFromTypeDetails = this.selectedEffectFromDetails.value ?? ""
  }

  onIdentificationTypeChanged(event: Event): void {
    if (!this.application.value) {
      return
    }

    const selectField = event.target as HTMLSelectElement

    this.application.value.directorIdentificationType = selectField.value
  }

  isEffectFromEffectiveDate(): boolean {
    return this.application.value?.effectiveFromType === AppointmentEffectFrom.EffectiveDate
  }

  isEffectFromFixTerm(): boolean {
    return this.application.value?.effectiveFromType === AppointmentEffectFrom.FixTerm
  }

  isEffectFromTerms(): boolean {
    return this.application.value?.effectiveFromType === AppointmentEffectFrom.TermsOfAppointment
  }

  //copywriting
  directorNameValue(): string {
    if (this.isInPreviewMode.value) {
      return "FULL NAME OF DIRECTOR"
    }

    return this.application.value?.directorName ?? ""
  }

  directorIdentificationTypeValue(): string {
    if (this.isInPreviewMode.value) {
      return "IDENTIFICATION"
    }

    return `${this.identificationType()} No. `
  }

  directorIdentificationValue(): string {
    if (this.isInPreviewMode.value) {
      return "NRIC / PASSPORT NO"
    }

    return this.application.value?.directorIdentification ?? ""
  }

  directorEmailValue(): string {
    if (this.isInPreviewMode.value) {
      return "EMAIL ADDRESS"
    }

    return this.application.value?.emailAddress ?? ""
  }

  effectFromValue(): string {
    if (!this.application.value) {
      return `with effect from ${this.dayjs().add(1, "week").format("DD MMMM YYYY")}`
    }

    switch (this.application.value.effectiveFromType) {
      case AppointmentEffectFrom.EffectiveDate:
        let time = useLocalTime()
        let effectiveDate = StringUtil.isNullOrEmpty(this.application.value.effectiveFromTypeDetails)
          ? "APPOINTMENT EFFECTIVE DATE"
          : time.formatDateOnlyFull(this.application.value.effectiveFromTypeDetails)
        return `with effect from ${effectiveDate}`
      case AppointmentEffectFrom.FixTerm:
        let fixTerm = parseInt(this.application.value.effectiveFromTypeDetails ?? "1")
        let year = fixTerm > 1 ? "years" : "year"
        return `for a fix tem of ${fixTerm} ${year}`
      case AppointmentEffectFrom.TermsOfAppointment:
        return "with conditions as stated in the Terms of Appointment"
    }

    return `with effect upon confirmation of consent`
  }
}
