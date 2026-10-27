import { CompanySwitchOut } from "~/scripts/models/CompanySwitchOut"
import { ResolutionController } from "./ResolutionController"
import { DocumentTemplate } from "~/scripts/models/DocumentTemplate"
import { StringUtil } from "~/scripts/utils/String"
import { Company } from "~/scripts/models/Company"
import { Error } from "~/scripts/library/Error"
import { TemplateProcessor } from "~/scripts/library/TemplateProcessor"
import { ConstitutionAmendmentTypes } from "~/scripts/constants/AmendmentTypes"
import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

export class DcrChangeOfCompanySecretaryController extends ResolutionController<CompanySwitchOut> {
  companySwitchOutRepository = useCompanySwitchOutStore()
  companyRepository = useCompanyStore()
  documentTemplateRepository = useDocumentTemplateStore()

  documentTemplate = ref<DocumentTemplate>(new DocumentTemplate())

  originalResolutionContent = ref<string>("")

  private documentTemplateId: string = "c38486a9-e2a1-4e29-ae0d-5f99b13caf0d"

  time = useLocalTime()

  constructor(props: IPropsResolutionDocument<CompanySwitchOut>, emitEvents: any | null) {
    super(
      props.companyId,
      props.applicationId,
      props.application,
      CompanySwitchOut,
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
    if (this.isLoading.value) {
      setTimeout(() => {
        this.setApplicationId(id)
      }, 500)

      return
    }

    if (StringUtil.isNullOrEmpty(id)) {
      await this.setApplication()
      return
    } else {
      await this.fetchApplication(id ?? "")
    }
  }

  async fetchApplication(id: string): Promise<void> {
    let response = await this.companySwitchOutRepository.fetch(id)
    if (!this.companySwitchOutRepository.error && response !== null) {
      this.application.value = new CompanySwitchOut(response)
      this.initializeData()
    }

    this.setContent()
  }

  async setApplication(): Promise<void> {
    if (this.application.value && !StringUtil.isNullOrEmpty(this.application.value.id)) {
      return
    }

    this.application.value = new CompanySwitchOut()
    this.application.value.companyId = this.companyId.value

    let response = await this.companyRepository.fetch(this.companyId.value)
    if (!this.companyRepository.error) {
      this.application.value.company = new Company(response)
    }

    this.initializeData()
    this.setContent()
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

  async otherDataInitiation(): Promise<void> {
    // not applicable
  }

  setContent(): void {
    this.resolutionContent.value = this.getContent()
  }

  getContent(): string {
    this.documentTemplate.value.content = this.originalResolutionContent.value

    let boardSearchString = "$text.&lt;name=boardOrSoleDirectors&gt;$"
    let boardOrSole = this.signatureItems.value.length > 1 ? "Board of Directors" : "Sole Director"
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(boardSearchString, boardOrSole)

    let oldCosecNamesSearchString = "$text.&lt;name=cosecName&gt;$"
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      oldCosecNamesSearchString,
      this.getOldCosecNames()
    )

    let oldCosecNamesReadonlySearchString = "$text.&lt;name=cosecNameReadOnly&gt;$"
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      oldCosecNamesReadonlySearchString,
      this.getOldCosecNameReadOnly()
    )

    let newCosecNamesSearchString = "$text.&lt;name=newCosecName&gt;$"
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      newCosecNamesSearchString,
      this.getNewCosecNames()
    )

    let newCosecNameReadOnlySearchString = "$text.&lt;name=newCosecNameReadOnly&gt;$"
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      newCosecNameReadOnlySearchString,
      this.getNewCosecNameReadOnly()
    )

    let agreedDetailsSearchString = "$text.&lt;name=agreedDetails&gt;$"
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      agreedDetailsSearchString,
      "<span class='input-field-placeholder'>(To be completed in ink)</span>"
    )

    let templateProcessor = new TemplateProcessor(this.documentTemplate.value)

    if (this.isInPreviewMode.value) {
      return templateProcessor.getContentForPreview(this.application.value)
    }

    if (this.isDocumentEditable()) {
      return templateProcessor.getContent(this.application.value)
    }

    return templateProcessor.getContentForPrint(this.application.value)
  }

  getNewCosecNames(): string {
    if (!this.application.value || this.isInPreviewMode.value) {
      return '<span class="value-placeholder">YOUR NEW COMPANY SECRETARY NAME</span>'
    }

    let hasOrHave = this.application.value && this.application.value.newCosecNames.length > 1 ? "have" : "has"

    if (this.isDocumentEditable()) {
      let inputFields = this.application.value.newCosecNames.map((s: string, index: number) => {
        if (!this.application.value) {
          return ""
        }

        let field = `<input type='text' value='${s}' class='form-control in-resolution new-cosec-name' id='new-name-${index}'>`
        if (index === this.application.value?.newCosecNames.length - 1 && index > 0) {
          field = `${field} <span class='action-link remove remove-new'><i class='fa-regular fa-xmark'></i></span>`
        }
        return field
      })

      return `${StringUtil.oxfordJoin("and", inputFields)} <span class='action-link add-new'>(+ Add More)</span> ${hasOrHave}`
    }

    let newCosecNames = StringUtil.oxfordJoin("and", this.application.value.newCosecNames)

    return `${newCosecNames} ${hasOrHave}`
  }

  getNewCosecNameReadOnly(): string {
    if (!this.application.value || this.isInPreviewMode.value) {
      return '<span class="value-placeholder">YOUR NEW COMPANY SECRETARY NAME</span>'
    }

    let isAllEmpty = this.application.value.newCosecNames.every((s: string) => {
      return StringUtil.isNullOrEmpty(s)
    })

    if (this.application.value.newCosecNames.length <= 0 || isAllEmpty) {
      return '<span class="value-placeholder">YOUR NEW COMPANY SECRETARY NAMES</span>'
    }

    let hasOrHave = this.application.value && this.application.value.newCosecNames.length > 1 ? "have" : "has"
    let newCosecNames = StringUtil.oxfordJoin("and", this.application.value.newCosecNames)

    return `${newCosecNames} ${hasOrHave}`
  }

  getOldCosecNames(): string {
    if (!this.application.value || this.isInPreviewMode.value) {
      return '<span class="value-placeholder">YOUR CURRENT COMPANY SECRETARY NAME</span>'
    }

    let hasOrHave = this.application.value && this.application.value.cosecNames.length > 1 ? "have" : "has"

    if (this.isDocumentEditable()) {
      let inputFields = this.application.value.cosecNames.map((s: string, index: number) => {
        if (!this.application.value) {
          return ""
        }

        let field = `<input type='text' value='${s}' class='form-control in-resolution old-cosec-name' id='old-name-${index}'>`
        if (index === this.application.value?.cosecNames.length - 1 && index > 0) {
          field = `${field} <span class='action-link remove remove-old'><i class='fa-regular fa-xmark'></i></span>`
        }
        return field
      })

      return `${StringUtil.oxfordJoin("and", inputFields)} <span class='action-link add-old'>(+ Add More)</span> ${hasOrHave}`
    }

    let oldCosecNames = StringUtil.oxfordJoin("and", this.application.value.cosecNames)

    return `${oldCosecNames} ${hasOrHave}`
  }

  getOldCosecNameReadOnly(): string {
    if (!this.application.value || this.isInPreviewMode.value) {
      return '<span class="value-placeholder">YOUR CURRENT COMPANY SECRETARY NAME</span>'
    }

    let isAllEmpty = this.application.value.cosecNames.every((s: string) => {
      return StringUtil.isNullOrEmpty(s)
    })

    if (this.application.value.cosecNames.length <= 0 || isAllEmpty) {
      return '<span class="value-placeholder">YOUR CURRENT COMPANY SECRETARY NAMES</span>'
    }

    let hasOrHave = this.application.value && this.application.value.cosecNames.length > 1 ? "have" : "has"
    let oldCosecNames = StringUtil.oxfordJoin("and", this.application.value.cosecNames)

    return `${oldCosecNames} ${hasOrHave}`
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

  handleAddMoreOldClicked(): void {
    if (!this.application.value || !this.isDocumentEditable()) {
      return
    }

    this.application.value.cosecNames.push("")
    this.setContent()
  }

  handleRemoveOldClicked(): void {
    if (!this.application.value || !this.isDocumentEditable()) {
      return
    }

    this.application.value.cosecNames.pop()
    this.setContent()
  }

  handleOldCosecNameChanged(event: Event): void {
    if (!this.application.value || !this.isDocumentEditable()) {
      return
    }

    let target = event.target as HTMLInputElement
    let value = target.value

    let id = target.id
    let index = parseInt(id.replace("old-name-", ""))

    if (index >= this.application.value.cosecNames.length) {
      return
    }

    this.application.value.cosecNames[index] = value.toUpperCase()
  }

  handleAddMoreNewClicked(): void {
    if (!this.application.value || !this.isDocumentEditable()) {
      return
    }

    this.application.value.newCosecNames.push("")
    this.setContent()
  }

  handleRemoveNewClicked(): void {
    if (!this.application.value || !this.isDocumentEditable()) {
      return
    }

    this.application.value.newCosecNames.pop()
    this.setContent()
  }

  handleNewCosecNameChanged(event: Event): void {
    if (!this.application.value || !this.isDocumentEditable()) {
      return
    }

    let target = event.target as HTMLInputElement
    let value = target.value

    let id = target.id
    let index = parseInt(id.replace("new-name-", ""))

    if (index >= this.application.value.newCosecNames.length) {
      return
    }

    this.application.value.newCosecNames[index] = value.toUpperCase()
  }

  handleEffectiveResignationDate(event: Event): void {
    if (!this.application.value || !this.isDocumentEditable()) {
      return
    }

    let target = event.target as HTMLInputElement
    let value = target.value
    this.application.value.effectiveResignationDate = value
  }

  handleEffectiveAppointmentDate(event: Event): void {
    if (!this.application.value || !this.isDocumentEditable()) {
      return
    }

    let target = event.target as HTMLInputElement
    let value = target.value
    this.application.value.effectiveAppointmentDate = value
  }

  attachEventListeners(): void {
    if (!this.isDocumentEditable()) {
      return
    }

    const addOldCosecs = document.querySelectorAll(".add-old")
    addOldCosecs.forEach((d) => {
      d.removeEventListener("click", this.handleAddMoreOldClicked.bind(this))
      d.addEventListener("click", this.handleAddMoreOldClicked.bind(this))
    })

    const removeOldCosecs = document.querySelectorAll(".remove-old")
    removeOldCosecs.forEach((d) => {
      d.removeEventListener("click", this.handleRemoveOldClicked.bind(this))
      d.addEventListener("click", this.handleRemoveOldClicked.bind(this))
    })

    const oldCosecNames = document.querySelectorAll(".old-cosec-name")
    oldCosecNames.forEach((d) => {
      d.removeEventListener("change", this.handleOldCosecNameChanged.bind(this))
      d.addEventListener("change", this.handleOldCosecNameChanged.bind(this))
    })

    const addNewCosecs = document.querySelectorAll(".add-new")
    addNewCosecs.forEach((d) => {
      d.removeEventListener("click", this.handleAddMoreNewClicked.bind(this))
      d.addEventListener("click", this.handleAddMoreNewClicked.bind(this))
    })

    const removeNewCosecs = document.querySelectorAll(".remove-new")
    removeNewCosecs.forEach((d) => {
      d.removeEventListener("click", this.handleRemoveNewClicked.bind(this))
      d.addEventListener("click", this.handleRemoveNewClicked.bind(this))
    })

    const newCosecNames = document.querySelectorAll(".new-cosec-name")
    newCosecNames.forEach((d) => {
      d.removeEventListener("change", this.handleNewCosecNameChanged.bind(this))
      d.addEventListener("change", this.handleNewCosecNameChanged.bind(this))
    })

    const effectiveResignationDates = document.querySelectorAll(".effectiveResignationDate")
    effectiveResignationDates.forEach((d) => {
      d.removeEventListener("change", this.handleEffectiveResignationDate.bind(this))
      d.addEventListener("change", this.handleEffectiveResignationDate.bind(this))
    })

    const effectiveAppointmentDates = document.querySelectorAll(".effectiveAppointmentDate")
    effectiveAppointmentDates.forEach((d) => {
      d.removeEventListener("change", this.handleEffectiveAppointmentDate.bind(this))
      d.addEventListener("change", this.handleEffectiveAppointmentDate.bind(this))
    })
  }

  override isDocumentEditable(): boolean {
    return false
  }

  get isShowCosecNameTag(): boolean {
    if (!this.application.value || !this.isDocumentEditable()) {
      return false
    }

    return (
      this.application.value.cosecNames.length === 0 ||
      this.application.value.cosecNames.some((s: string) => {
        return StringUtil.isNullOrEmpty(s)
      })
    )
  }

  get isShowNewCosecNameTag(): boolean {
    if (!this.application.value || !this.isDocumentEditable()) {
      return false
    }

    if (this.isShowCosecNameTag) {
      return false
    }

    return (
      this.application.value.newCosecNames.length === 0 ||
      this.application.value.newCosecNames.some((s: string) => {
        return StringUtil.isNullOrEmpty(s)
      })
    )
  }

  get isShowResignationDateTag(): boolean {
    if (!this.application.value || !this.isDocumentEditable()) {
      return false
    }

    if (this.isShowCosecNameTag || this.isShowNewCosecNameTag) {
      return false
    }

    return StringUtil.isNullOrEmpty(this.application.value.effectiveResignationDate)
  }

  get isShowAppointmentDateTag(): boolean {
    if (!this.application.value || !this.isDocumentEditable()) {
      return false
    }

    if (this.isShowCosecNameTag || this.isShowNewCosecNameTag || this.isShowResignationDateTag) {
      return false
    }

    return StringUtil.isNullOrEmpty(this.application.value.effectiveAppointmentDate)
  }
}
