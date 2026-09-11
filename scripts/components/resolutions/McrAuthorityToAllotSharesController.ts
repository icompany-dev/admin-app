import { CompanyShareAuthorization } from "~/scripts/models/CompanyShareAuthorization"
import { ResolutionController } from "./ResolutionController"
import { DocumentTemplate } from "~/scripts/models/DocumentTemplate"
import { StringUtil } from "~/scripts/utils/String"
import { Company } from "~/scripts/models/Company"
import { Error } from "~/scripts/library/Error"
import { TemplateProcessor } from "~/scripts/library/TemplateProcessor"
import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { AuthorizationEffectiveType, PurposeOfAllotment } from "~/scripts/constants/AllotmentOfShares"

export class McrAuthorityToAllotSharesController extends ResolutionController<CompanyShareAuthorization> {
  companyShareAuthorizationRepository = useCompanyShareAuthorizationStore()
  companyRepository = useCompanyStore()
  documentTemplateRepository = useDocumentTemplateStore()

  documentTemplate = ref<DocumentTemplate>(new DocumentTemplate())

  originalContent = ref<string>("")

  resolutionContentPage1 = ref<string>("")
  resolutionContentPage2 = ref<string>("")
  accompanyingDocumentContent = ref<string>("")

  private documentTemplateId: string = "cdff8d73-da6d-4974-ba36-4e29bedffc47"

  time = useLocalTime()

  constructor(props: IPropsResolutionDocument<CompanyShareAuthorization>, emitEvents: any | null) {
    super(
      props.companyId,
      props.applicationId,
      props.application,
      CompanyShareAuthorization,
      props.isInPreviewMode,
      false,
      true,
      props.showWatermark,
      props.watermarkText,
      emitEvents
    )

    this.signatureStartOnPage.value = 2
    this.maxSignatureOnFirstPage.value = 2
    this.maxSignatureOnOtherPages.value = 6
    this.isUsingTemplate.value = true
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
    let response = await this.companyShareAuthorizationRepository.fetch(id)
    if (!this.companyShareAuthorizationRepository.error && response !== null) {
      this.application.value = new CompanyShareAuthorization(response)
    }

    this.setContent()
    this.initializeData()
  }

  async setApplication(): Promise<void> {
    if (this.application.value && !StringUtil.isNullOrEmpty(this.application.value.id)) {
      return
    }

    this.application.value = new CompanyShareAuthorization()
    this.application.value.companyId = this.companyId.value

    let response = await this.companyRepository.fetch(this.companyId.value)
    if (!this.companyRepository.error) {
      this.application.value.company = new Company(response)
    }

    this.setContent()
    this.initializeData()
  }

  async fetchDocumentTemplate(): Promise<void> {
    try {
      let response = await this.documentTemplateRepository.fetch(this.documentTemplateId)
      if (this.documentTemplateRepository.error) {
        throw this.documentTemplateRepository.error
      }

      this.documentTemplate.value = new DocumentTemplate(response)
      this.originalContent.value = this.documentTemplate.value.content
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
    //split pages
    let pageContents = this.resolutionContent.value.split("&lt;pagebreak&gt;")
    this.resolutionContentPage1.value = pageContents[0] ?? this.resolutionContent.value
    this.resolutionContentPage2.value = pageContents[1] ?? ""

    this.accompanyingDocumentContent.value = this.getAccompanyingDocument()
    this.hasAccompanyingDocument.value = this.accompanyingDocumentContent.value.length > 0
  }

  async otherDataInitiation(): Promise<void> {
    // do nothing
  }

  getInstructionsForTickbox(): string {
    if (this.isInPreviewMode.value) {
      return `<span class='value-placeholder'><small>(please tick where required for the best interest of the Company)</small></span><br>`
    }

    if (!this.isDocumentEditable()) {
      return ""
    }

    return "<small>(please tick where required for the best interest of the Company)</small><br>"
  }

  getPurposeOfProposedAllotment(): string {
    if (!this.application.value || this.isInPreviewMode.value || this.isDocumentEditable()) {
      let items = this.purposeOfAllotments.map((i: string, index: number) => {
        let semiColon = index === this.purposeOfAllotments.length - 1 ? "." : ";"
        let andOr = index === this.purposeOfAllotments.length - 2 ? " and/or" : ""

        let disabled = !this.application.value || this.isInPreviewMode.value ? "disabled" : ""
        let isChecked = this.isPurposeOfAllotmentSelected(i as PurposeOfAllotment)
        let checked = isChecked ? "checked" : ""
        return `
          <div class='form-check'>
            <input type='checkbox' class="form-control form-check-input purpose-of-allotment" value='${i}' ${disabled} ${checked}>
            <span class="label ${isChecked ? "" : "unselected"}">${this.getPurposeOfAllotmentValue(i as PurposeOfAllotment)}${semiColon}${andOr}</span>
          </div>
        `
      })

      return items.join("")
    }

    if (this.application.value.purposeOfProposedAllotment.length <= 0) {
      return ""
    }

    let listItems = this.application.value.purposeOfProposedAllotment.map((s: string, index: number) => {
      if (!this.application.value) {
        return ""
      }

      let semiColon = index === this.application.value.purposeOfProposedAllotment.length - 1 ? "." : ";"
      let andOr = index === this.application.value.purposeOfProposedAllotment.length - 2 ? " and/or" : ""

      return `
            <li>${this.getPurposeOfAllotmentValue(s as PurposeOfAllotment)}${semiColon}${andOr}</li>
        `
    })

    return `
      <ul>
        ${listItems.join("")}
      </ul>
    `
  }

  isPurposeOfAllotmentSelected(purposeOfAllotment: PurposeOfAllotment): boolean {
    if (!this.application.value) {
      return false
    }

    return this.application.value.purposeOfProposedAllotment.some((d: string) => {
      return d === purposeOfAllotment
    })
  }

  getPurposeOfAllotmentValue(purposeOfAllotment: PurposeOfAllotment): string {
    switch (purposeOfAllotment) {
      case PurposeOfAllotment.WorkingCapital:
        return "working capital"
      case PurposeOfAllotment.OperationalFunding:
        return "operational funding"
      case PurposeOfAllotment.BusinessExpansion:
        return "business expansion"
      case PurposeOfAllotment.InvestmentPurposes:
        return "restructuring"
      case PurposeOfAllotment.Restructuring:
        return "investment purposes"
      case PurposeOfAllotment.SettlementOfObligations:
        return "settlement of obligations"
      case PurposeOfAllotment.OtherCommercialPurposes:
        return "such other commercial purposes as determined by the Directors"
    }

    return ""
  }

  getDirectorsPowers(): string {
    if (!this.application.value || this.isInPreviewMode.value || this.isDocumentEditable()) {
      let disabled = !this.application.value || this.isInPreviewMode.value ? "disabled" : ""
      return `
        <div class='form-check'>
          <input type='checkbox' class='form-control form-check-input can-set-number-class-shares' ${disabled} ${this.application.value?.canSetNumberClassShares ? "checked" : ""}>
          <span class="label ${this.application.value?.canSetNumberClassShares ? "" : "unselected"}">determine the number and class of shares to be allotted;</span>
        </div>
        <div class='form-check'>
          <input type='checkbox' class='form-control form-check-input can-set-issue-price' ${disabled} ${this.application.value?.canSetIssuePrice ? "checked" : ""}>
          <span class="label ${this.application.value?.canSetIssuePrice ? "" : "unselected"}">determine the issue price and basis of valuation;</span>
        </div>
        <div class='form-check'>
          <input type='checkbox' class='form-control form-check-input can-accept-reject' ${disabled} ${this.application.value?.canAcceptRejectSubscription ? "checked" : ""}>
          <span class="label ${this.application.value?.canAcceptRejectSubscription ? "" : "unselected"}">accept or reject any subscription application;</span>
        </div>
        <ul>
          <li>execute and deliver all agreements, resolutions, notices, forms, and documents;</li>
          <li>update the Register of Members;</li>
          <li>issue share certificates if deem required;</li>
          <li>lodge the relevant returns and documents with the Companies Commission of Malaysia; and</li>
          <li>do all acts, matters, and things necessary or expedient to give effect to this Resolution.</li>
        </ul>
      `
    }

    let items = []
    if (this.application.value.canSetNumberClassShares) {
      items.push("<li>determine the number and class of shares to be allotted</li>")
    }

    if (this.application.value.canSetIssuePrice) {
      items.push("<li>determine the issue price and basis of valuation</li>")
    }

    if (this.application.value.canAcceptRejectSubscription) {
      items.push("<li>accept or reject any subscription application</li>")
    }

    return `
      <ul>
        ${items.join("")}
        <li>execute and deliver all agreements, resolutions, notices, forms, and documents;</li>
        <li>update the Register of Members;</li>
        <li>issue share certificates if deem required;</li>
        <li>lodge the relevant returns and documents with the Companies Commission of Malaysia; and</li>
        <li>do all acts, matters, and things necessary or expedient to give effect to this Resolution.</li>
      </ul>
    `
  }

  getEffectiveDate(): string {
    if (!this.application.value || this.isInPreviewMode.value) {
      return `<span class='value-placeholder'>until end of the Financial Year</span>.`
    }

    if (this.isDocumentEditable()) {
      let options = this.effectiveTypes.map((item: string) => {
        return `
          <option 
            value='${item}' 
            ${this.isEffectiveTypeSelected(item as AuthorizationEffectiveType) ? "selected" : ""}
          >
            ${this.getEffectiveType(item as AuthorizationEffectiveType)}
          </option>
        `
      })

      let dateInput = ""
      if (this.isEffectiveTypeSelected(AuthorizationEffectiveType.SpecificDate)) {
        dateInput = `
          <input 
            type='date' 
            class='form-control in-resolution effective-date' 
            value='${this.application?.value.effectiveDate}'
          >
        `
      }

      return `
        <select class='form-control in-resolution effective-date-type'>
          ${options.join("")}
        </select>
        ${dateInput}
      `
    }

    let effectiveType = this.getEffectiveType(this.application.value.effectiveDateType as AuthorizationEffectiveType)
    if (this.isEffectiveTypeSelected(AuthorizationEffectiveType.Revoked)) {
      let time = useLocalTime()
      let effectiveDate = time.formatDateOnlyFull(this.application.value.effectiveDate ?? "")
      effectiveType = `until ${effectiveDate}`
    }

    return ""
  }

  getEffectiveType(effectiveType: AuthorizationEffectiveType): string {
    switch (effectiveType) {
      case AuthorizationEffectiveType.EndOfFye:
        return "until end of Financial Year"
      case AuthorizationEffectiveType.Revoked:
        return "until revoked"
      case AuthorizationEffectiveType.SpecificDate:
        return "until specific date "
      case AuthorizationEffectiveType.OneAllotmentOnly:
        return "for this Allotment of New Shares only"
    }
  }

  isEffectiveTypeSelected(effectiveType: AuthorizationEffectiveType): boolean {
    if (!this.application.value) {
      return false
    }

    return this.application.value.effectiveDateType === effectiveType
  }

  getContent(): string {
    this.documentTemplate.value.content = this.originalContent.value

    const instructionTickBoxSearchString = "(please tick where required for the best interest of the Company)"
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      instructionTickBoxSearchString,
      this.getInstructionsForTickbox()
    )

    const purposeOfAllotmentRegex = /\[purpose-checkbox-options\]([\s\S]*?)\[\/purpose-checkbox-options\]/
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      purposeOfAllotmentRegex,
      this.getPurposeOfProposedAllotment()
    )

    const directorsPowerRegex = /\[power-checkbox-option\]([\s\S]*?)\[\/power-checkbox-option\]/
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      directorsPowerRegex,
      this.getDirectorsPowers()
    )

    const effectiveDateSearchString = "$text.&lt;name=effectiveDateType&gt;$"
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      effectiveDateSearchString,
      this.getEffectiveDate()
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

  getAccompanyingDocument(): string {
    let templateProcessor = new TemplateProcessor(this.documentTemplate.value)

    return templateProcessor.getPostSignatureContent(this.application.value)
  }

  totalPages(): number {
    if (this.directorRepository.isLoading || this.signatureItems.value.length <= 0) {
      return 2
    }

    return (
      this.signatureStartOnPage.value +
      Math.ceil(
        (this.signatureItems.value.length - this.maxSignatureOnFirstPage.value) / this.maxSignatureOnOtherPages.value
      )
    )
  }

  // event listeners
  handleOnPurposeAllotmentClicked(event: Event): void {
    if (!this.application.value || !this.isDocumentEditable()) {
      return
    }

    let target = event.target as HTMLInputElement
    let value = target.value

    if (this.isPurposeOfAllotmentSelected(value as PurposeOfAllotment)) {
      this.application.value.purposeOfProposedAllotment = this.application.value.purposeOfProposedAllotment.filter(
        (s: string) => {
          return s !== value
        }
      )
    } else {
      this.application.value.purposeOfProposedAllotment.push(value)
    }

    this.setContent()
  }

  handleOnCanSetNumberSharesClicked(event: Event): void {
    if (!this.application.value || !this.isDocumentEditable()) {
      return
    }

    this.application.value.canSetNumberClassShares = !this.application.value.canSetNumberClassShares

    this.setContent()
  }

  handleOnCanSetIssuePriceClicked(event: Event): void {
    if (!this.application.value || !this.isDocumentEditable()) {
      return
    }

    this.application.value.canSetIssuePrice = !this.application.value.canSetIssuePrice

    this.setContent()
  }

  handleOnCanAcceptRejectClicked(event: Event): void {
    if (!this.application.value || !this.isDocumentEditable()) {
      return
    }

    this.application.value.canAcceptRejectSubscription = !this.application.value.canAcceptRejectSubscription

    this.setContent()
  }

  handleOnEffectiveDateTypeChanged(event: Event): void {
    if (!this.application.value || !this.isDocumentEditable()) {
      return
    }

    let target = event.target as HTMLSelectElement
    let value = target.value

    this.application.value.effectiveDateType = value
    if (!this.isEffectiveTypeSelected(AuthorizationEffectiveType.SpecificDate)) {
      this.application.value.effectiveDate = null
    }

    this.setContent()
  }

  handleOnEffectiveDateChanged(event: Event): void {
    if (!this.application.value || !this.isDocumentEditable()) {
      return
    }

    let target = event.target as HTMLSelectElement
    let value = target.value

    this.application.value.effectiveDate = value

    this.setContent()
  }

  attachEventListeners(): void {
    if (!this.isDocumentEditable()) {
      return
    }

    const purposeOfAllotmentBoxes = document.querySelectorAll(".purpose-of-allotment")
    purposeOfAllotmentBoxes.forEach((el) => {
      el.removeEventListener("click", this.handleOnPurposeAllotmentClicked.bind(this))
      el.addEventListener("click", this.handleOnPurposeAllotmentClicked.bind(this))
    })

    const canSetNumberShares = document.querySelectorAll(".can-set-number-class-shares")
    canSetNumberShares.forEach((el) => {
      el.removeEventListener("click", this.handleOnCanSetNumberSharesClicked.bind(this))
      el.addEventListener("click", this.handleOnCanSetNumberSharesClicked.bind(this))
    })

    const canSetIssuePrice = document.querySelectorAll(".can-set-issue-price")
    canSetIssuePrice.forEach((el) => {
      el.removeEventListener("click", this.handleOnCanSetIssuePriceClicked.bind(this))
      el.addEventListener("click", this.handleOnCanSetIssuePriceClicked.bind(this))
    })

    const canAcceptReject = document.querySelectorAll(".can-accept-reject")
    canAcceptReject.forEach((el) => {
      el.removeEventListener("click", this.handleOnCanAcceptRejectClicked.bind(this))
      el.addEventListener("click", this.handleOnCanAcceptRejectClicked.bind(this))
    })

    const effectiveDateType = document.querySelectorAll(".effective-date-type")
    effectiveDateType.forEach((el) => {
      el.removeEventListener("change", this.handleOnEffectiveDateTypeChanged.bind(this))
      el.addEventListener("change", this.handleOnEffectiveDateTypeChanged.bind(this))
    })

    const effectiveDate = document.querySelectorAll(".effective-date")
    effectiveDate.forEach((el) => {
      el.removeEventListener("change", this.handleOnEffectiveDateChanged.bind(this))
      el.addEventListener("change", this.handleOnEffectiveDateChanged.bind(this))
    })
  }

  get purposeOfAllotments(): string[] {
    return Object.values(PurposeOfAllotment)
  }

  get effectiveTypes(): string[] {
    return Object.values(AuthorizationEffectiveType)
  }
}
