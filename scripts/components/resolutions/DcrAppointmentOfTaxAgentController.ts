import { DocumentTemplate } from "~/scripts/models/DocumentTemplate"
import { StringUtil } from "~/scripts/utils/String"
import { Company } from "~/scripts/models/Company"
import { Error } from "~/scripts/library/Error"
import { TemplateProcessor } from "~/scripts/library/TemplateProcessor"
import _ from "lodash"
import type { SignatureItem } from "~/scripts/types/SignatureItem"
import { ResolutionController } from "./ResolutionController"
import { CompanyAppointmentOfTaxAgent } from "~/scripts/models/CompanyAppointmentOfTaxAgent"
import type { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { PropsResolution } from "~/scripts/props/PropsResolution"
import { StatusConstants } from "~/scripts/constants/Status"
import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"

export class DcrAppointmentOfTaxAgentController extends ResolutionController<CompanyAppointmentOfTaxAgent> {
  companyAppointmentOfTaxAgentRepository = useCompanyAppointmentOfTaxAgentStore()
  companyRepository = useCompanyStore()
  documentTemplateRepository = useDocumentTemplateStore()

  documentTemplate = ref<DocumentTemplate>(new DocumentTemplate())

  pages = ref<string[]>([])

  originalTemplateContent: string = ""

  private documentTemplateId: string = "4e0995f2-3789-4f57-9304-c0892ec59bd0"

  taxAgentFirmName: Ref<string> = ref<string>("")
  taxAgentAddress: Ref<string> = ref<string>("")
  taxAgentPhone: Ref<string> = ref<string>("")
  taxAgentEmail: Ref<string> = ref<string>("")

  time = useLocalTime()
  language = useLanguage()

  constructor(props: PropsResolutionDocument<CompanyAppointmentOfTaxAgent>, emitEvents: any | null) {
    super(
      props.companyId,
      props.applicationId,
      props.application,
      CompanyAppointmentOfTaxAgent,
      props.isInPreviewMode,
      true, // isDcr
      false, // isMcr
      props.showWatermark,
      props.watermarkText,
      emitEvents
    )
    this.isDcr.value = true

    this.signatureStartOnPage.value = 1
    this.maxSignatureOnFirstPage.value = 2
    this.maxSignatureOnOtherPages.value = 6

    this.initializeResolution(props.isInPreviewMode)
  }

  async setApplicationId(id: string | null): Promise<void> {
    this.applicationId.value = id ?? ""

    if (StringUtil.isNullOrEmpty(id)) {
      await this.setApplication()
    } else {
      await this.fetchApplication(id ?? "")
    }

    if (!StringUtil.isNullOrEmpty(this.originalTemplateContent)) {
      this.setContent()
    }
  }

  async otherDataInitiation(): Promise<void> {
    // Empty
  }

  async fetchApplication(id: string): Promise<void> {
    let response = await this.companyAppointmentOfTaxAgentRepository.fetch(id)

    if (!this.companyAppointmentOfTaxAgentRepository.error && response !== null) {
      this.application.value = new CompanyAppointmentOfTaxAgent(response)

      this.taxAgentFirmName.value = this.application.value.firmName ?? ""
      this.taxAgentAddress.value = this.application.value.firmAddress ?? ""
      this.taxAgentPhone.value = this.application.value.firmPhone ?? ""
      this.taxAgentEmail.value = this.application.value.firmEmail ?? ""

      this.initializeData()
    }
  }

  lockDocumentEdit(application?: CompanyAppointmentOfTaxAgent): void {
    if (application) {
      this.application.value = new CompanyAppointmentOfTaxAgent(application)
    }

    if (!this.application.value) {
      return
    }

    this.application.value.status = StatusConstants.CONFIRMED

    this.taxAgentFirmName.value = this.application.value.firmName ?? ""
    this.taxAgentAddress.value = this.application.value.firmAddress ?? ""
    this.taxAgentPhone.value = this.application.value.firmPhone ?? ""
    this.taxAgentEmail.value = this.application.value.firmEmail ?? ""

    this.setContent()
  }

  async setApplication(): Promise<void> {
    if (this.application.value && !StringUtil.isNullOrEmpty(this.application.value.id)) {
      return
    }

    this.application.value = new CompanyAppointmentOfTaxAgent()
    this.application.value.companyId = this.companyId.value
    this.taxAgentFirmName.value = this.application.value.firmName
    this.taxAgentAddress.value = this.application.value.firmAddress
    this.taxAgentPhone.value = this.application.value.firmPhone
    this.taxAgentEmail.value = this.application.value.firmEmail

    let response = await this.companyRepository.fetch(this.companyId.value)
    if (!this.companyRepository.error) {
      this.application.value.company = new Company(response)
    }

    this.initializeData()
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
        let errorMessage: Error = new Error()
        errorMessage.setForFetch()
        errorMessage.handle()
      }
    }
  }

  setContent(): void {
    let content = this.processCustomPlaceholders(this.originalTemplateContent)

    let template = new DocumentTemplate()
    template.content = content

    let templateProcessor = new TemplateProcessor(template)

    if (this.isInPreviewMode.value) {
      this.resolutionContent.value = templateProcessor.getContentForPreview(this.application.value)
      return
    }

    this.resolutionContent.value = this.isDocumentEditable()
      ? templateProcessor.getContent(this.application.value, this.isInPreviewMode.value)
      : templateProcessor.getContentForPrint(this.application.value)
  }

  getContentPageCount(): number {
    return this.pages.value.length
  }

  processCustomPlaceholders(content: string): string {
    if (!content) {
      return content
    }

    let searchString = "$textarea.&lt;name=taxAgentInformation&gt;$"
    content = content.replaceAll(searchString, this.getTaxAgentInformation())

    content = content.replace(/%\[([^\]]*)\]%/g, (match, markerText) => {
      if (markerText) {
        return `<span class="fake-marker">${markerText}</span>`
      }
      return `<span class="fake-indent"></span>`
    })

    return content
  }

  getTaxAgentInformation(): string {
    const isShowPlaceholder = !this.application.value || this.isInPreviewMode.value
    const isShowInput = this.application.value && this.isDocumentEditable()
    const isShowValue = this.application.value && !this.isDocumentEditable()

    return `
        <div class='tax-agent-info-wrapper'>
          <table>
            <tbody>
              <tr>
                <td class="tax-agent-info-label-cell">
                  Tax Agent Firm
                </td>
                <td class="tax-agent-info-seperator-cell">:</td>
                <td class="tax-agent-info-input-cell">
                  ${isShowPlaceholder ? '<span class="value-placeholder">YOUR TAX AGENT FIRM NAME</span>' : ""}
                  ${isShowInput ? `<input type="text" class="form-control in-resolution tax-agent-firm-name uppercase" name="taxAgentFirmName" value="${this.taxAgentFirmName.value}" />` : ""}
                  ${isShowValue ? `${(this.application.value?.firmName ?? "").toUpperCase()}` : ""}
                </td>
              </tr>

              <tr>
                <td class="tax-agent-info-label-cell">
                  Address
                </td>
                <td class="tax-agent-info-seperator-cell">:</td>
                <td class="tax-agent-info-input-cell">
                  ${isShowPlaceholder ? '<span class="value-placeholder">YOUR TAX AGENT BUSINESS ADDRESS</span>' : ""}
                  ${isShowInput ? `<input type="text" class="form-control in-resolution tax-agent-address uppercase" name="taxAgentAddress" value="${this.taxAgentAddress.value}" />` : ""}
                  ${isShowValue ? `${(this.application.value?.firmAddress ?? "").toUpperCase()}` : ""}
                </td>
              </tr>

              <tr>
                <td class="tax-agent-info-label-cell">
                  Contact
                </td>
                <td class="tax-agent-info-seperator-cell">:</td>
                <td class="tax-agent-info-input-cell">
                  ${isShowPlaceholder ? '<span class="value-placeholder">YOUR TAX AGENT CONTACT NO.</span>' : ""}
                  ${isShowInput ? `<input type="text" class="form-control in-resolution tax-agent-phone lowercase" name="taxAgentPhone" value="${this.taxAgentPhone.value}" />` : ""}
                  ${isShowValue ? `${(this.application.value?.firmPhone ?? "").toLowerCase()}` : ""}
                </td>
              </tr>
              <tr>
                <td class="tax-agent-info-label-cell">
                  Email
                </td>
                <td class="tax-agent-info-seperator-cell">:</td>
                <td class="tax-agent-info-input-cell">
                  ${isShowPlaceholder ? '<span class="value-placeholder">YOUR TAX AGENT EMAIL</span>' : ""}
                  ${isShowInput ? `<input type="text" class="form-control in-resolution tax-agent-email lowercase" name="taxAgentEmail" value="${this.taxAgentEmail.value}" />` : ""}
                  ${isShowValue ? `${(this.application.value?.firmEmail ?? "").toLowerCase()}` : ""}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      `
  }

  totalPages(): number {
    const remainingSignatures = Math.max(0, this.signatureItems.value.length - this.maxSignatureOnFirstPage.value)

    return 1 + Math.ceil(remainingSignatures / this.maxSignatureOnOtherPages.value)
  }

  getSignatureOnCurrentPage(page: number): SignatureItem[] {
    if (page < this.signatureStartOnPage.value) {
      return []
    }

    if (page === this.signatureStartOnPage.value) {
      return this.signatureItems.value.slice(0, this.maxSignatureOnFirstPage.value)
    }

    const offsetPage = this.signatureStartOnPage.value + 1
    const skip = (page - offsetPage) * this.maxSignatureOnOtherPages.value + this.maxSignatureOnFirstPage.value
    const lastIndex = Math.min(this.signatureItems.value.length, skip + this.maxSignatureOnOtherPages.value)

    return this.signatureItems.value.slice(skip, lastIndex)
  }

  onTaxAgentInformationChanged(event: Event): void {
    const input = event.target as HTMLInputElement

    switch (input.name) {
      case "taxAgentFirmName":
        this.handleTaxAgentNameChange(event)
        return

      case "taxAgentAddress":
        this.handleTaxAgentAddressChange(event)
        return

      case "taxAgentPhone":
        this.handleTaxAgentPhoneChange(event)
        return

      case "taxAgentEmail":
        this.handleTaxAgentEmailChange(event)
        return
    }
  }

  attachEventListeners(): void {
    if (!this.isDocumentEditable() || this.isInPreviewMode.value) {
      return
    }

    const container = document.getElementById("dcr-appointment-of-tax-agent")

    if (!container) {
      return
    }

    const firmInputs = container.querySelectorAll(".tax-agent-firm-name")
    firmInputs.forEach((input) => {
      ;(input as HTMLInputElement).onchange = this.handleTaxAgentNameChange.bind(this)
    })

    const addressInputs = container.querySelectorAll(".tax-agent-address")
    addressInputs.forEach((input) => {
      ;(input as HTMLInputElement).onchange = this.handleTaxAgentAddressChange.bind(this)
    })

    const phoneInputs = container.querySelectorAll(".tax-agent-phone")
    phoneInputs.forEach((input) => {
      ;(input as HTMLInputElement).onchange = this.handleTaxAgentPhoneChange.bind(this)
    })

    const emailInputs = container.querySelectorAll(".tax-agent-email")
    emailInputs.forEach((input) => {
      ;(input as HTMLInputElement).onchange = this.handleTaxAgentEmailChange.bind(this)
    })
  }

  handleTaxAgentNameChange(event: Event): void {
    const inputField = event.target as HTMLInputElement

    this.taxAgentFirmName.value = inputField.value.toUpperCase()

    if (this.application.value) {
      this.application.value.firmName = inputField.value
    }

    this.emitEvents("updated")
  }

  handleTaxAgentAddressChange(event: Event): void {
    const inputField = event.target as HTMLInputElement

    this.taxAgentAddress.value = inputField.value.toUpperCase()

    if (this.application.value) {
      this.application.value.firmAddress = inputField.value
    }

    this.emitEvents("updated")
  }

  handleTaxAgentPhoneChange(event: Event): void {
    const inputField = event.target as HTMLInputElement

    this.taxAgentPhone.value = inputField.value.toLowerCase()

    if (this.application.value) {
      this.application.value.firmPhone = inputField.value
    }

    this.emitEvents("updated")
  }

  handleTaxAgentEmailChange(event: Event): void {
    const inputField = event.target as HTMLInputElement

    this.taxAgentEmail.value = inputField.value.toLowerCase()

    if (this.application.value) {
      this.application.value.firmEmail = inputField.value
    }

    this.emitEvents("updated")
  }

  handleEnlargedSignaturePad(isEnlarged: any): void {
    if (isEnlarged) {
      document.body.classList.add("no-scroll")
    } else {
      document.body.classList.remove("no-scroll")
    }
  }

  pageRangeForSignatures(): number[] {
    let startRange = this.pages.value.length + 1
    let length = this.totalPages() - this.pages.value.length
    return Array.from({ length: length }, (_, i) => i + startRange)
  }

  get isTaxAgentInformationComplete(): boolean {
    return !StringUtil.isNullOrEmpty(this.taxAgentFirmName.value)
  }

  override resolutionDate(): string {
    if (!this.application.value) {
      return "To be determined"
    }

    return this.application.value?.documentDate
      ? this.dayjs(this.application.value?.documentDate).format("YYYY-MM-DD")
      : "To be determined"
  }

  override get resolutionProps() {
    let props = new PropsResolution(
      this.companyName(), //companyName
      this.registrationNumberOld(), //registrationNumberOld
      this.registrationNumberNew(), //registrationNumberNew
      this.resolutionTitle(), //resolutionTitle
      "", //resolutionName
      this.signatureTitle(), //signatureTitle
      this.signatureItems.value, //signatureItems
      this.resolutionDate(), //resolutionDate
      this.totalPages(), //totalPages
      this.signatureStartOnPage.value, //signatureStartOnPage
      this.maxSignatureOnFirstPage.value, //maxSignatureOnFirstPage
      this.maxSignatureOnOtherPages.value, //maxSignatureOnOtherPage
      this.hasAccompanyingDocument.value, //hasAccompanyingDocument
      this.isDcr.value, //isDcr
      false, //showWatermark
      this.watermarkText.value, //watermarkText
      [], //contentPages
      this.isUsingTemplate.value, //isUsingTemplate
      this.isLoading.value //isLoading
    )

    return props
  }

  override async getPdfPages(): Promise<HTMLElement[]> {
    if (!this.documentRef) {
      return []
    }

    this.isGettingPdfPages.value = true

    let originalResolutionContent = this.resolutionContent.value

    this.setContent()
    await nextTick()
    let pdfPages = await PdfPaperUtil.getPdfElements(this.documentRef)

    this.resolutionContent.value = originalResolutionContent

    this.isGettingPdfPages.value = false

    return pdfPages
  }
}
