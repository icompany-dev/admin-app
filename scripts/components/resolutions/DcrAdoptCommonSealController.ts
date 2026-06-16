import { CompanyCommonSeal } from "~/scripts/models/CompanyCommonSeal"
import { ResolutionController } from "./ResolutionController"
import { DocumentTemplate } from "~/scripts/models/DocumentTemplate"
import { StringUtil } from "~/scripts/utils/String"
import { Company } from "~/scripts/models/Company"
import { Error } from "~/scripts/library/Error"
import { TemplateProcessor } from "~/scripts/library/TemplateProcessor"
import { CommonSealAuthorityOf, CommonSealStoredAt } from "~/scripts/constants/CommonSeals"
import { Director } from "~/scripts/models/Director"
import { IdentificationTypes } from "~/scripts/constants/IdentificationTypes"
import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

export class DcrAdoptCommonSealController extends ResolutionController<CompanyCommonSeal> {
  companyCommonSealRepository = useCompanyCommonSealStore()
  companyRepository = useCompanyStore()
  documentTemplateRepository = useDocumentTemplateStore()

  directors = ref<Director[]>([])

  documentTemplate = ref<DocumentTemplate>(new DocumentTemplate())

  resolutionContent = ref<string>("")
  originalTemplateContent: string = ""

  private documentTemplateId: string = "6ee14468-6ac0-40e1-ad10-118086205426"

  time = useLocalTime()

  constructor(props: IPropsResolutionDocument<CompanyCommonSeal>, emitEvents: any | null) {
    super(
      props.companyId,
      props.applicationId,
      props.application,
      CompanyCommonSeal,
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
    let response = await this.companyCommonSealRepository.fetch(id)
    if (!this.companyCommonSealRepository.error && response !== null) {
      this.application.value = new CompanyCommonSeal(response)
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
      this.application.value = new CompanyCommonSeal()
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

  getImageContent(): string {
    let companyName = this.companyName().replace("SDN", "SDN.").replace("BHD", "BHD.")
    let length = companyName.length
    let fontSize = 17
    let letterSpacing = length > 25 ? "1px" : "2px"
    if (length > 35) {
      fontSize = 14
    } else if (length > 25) {
      fontSize = 14
    } else {
      fontSize = 18
    }

    return `
      <div class='common-seal-image'>
        <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <path 
              id="namePath" 
              d="M 150, 260 a 110,110 0 1,1 0.1,0" 
            />
          </defs>

          <circle cx="150" cy="150" r="140" class="border-bold" />
          <circle cx="150" cy="150" r="105" class="border-thin" />

          <text x="150" y="280" text-anchor="middle" class="fixed-star">★</text>

          <text class="company-name">
            <textPath 
              xlink:href="#namePath" 
              startOffset="50%" 
              text-anchor="middle"
            >
              ${companyName}
            </textPath>
          </text>

          <g class="center-content">
            <text x="50%" y="115" text-anchor="middle" class="label">COMMON</text>
            <text x="50%" y="150" text-anchor="middle" class="label">SEAL</text>
            <text x="50%" y="185" text-anchor="middle" class="reg">${this.registrationNumberNew()}</text>
            <text x="50%" y="215" text-anchor="middle" class="reg">(${this.registrationNumberOld()})</text>
          </g>
        </svg>
      </div>
    `
  }

  getStoredAtContent(): string {
    if (this.isDocumentEditable()) {
      let disable = this.isInPreviewMode.value ? "disabled" : ""
      return `
        <select id='stored-at' class='form-select form-control in-resolution' ${disable} name="storedAt" data-field-name="storedAt">
          <option value='${CommonSealStoredAt.RegisteredOffice}' ${this.application.value?.storedAt === CommonSealStoredAt.RegisteredOffice ? "selected" : ""}>
            Registered Office of the Company in the custody of the Company Secretary
          </option>
          <option value='${CommonSealStoredAt.BusinessAddress}' ${this.application.value?.storedAt === CommonSealStoredAt.BusinessAddress ? "selected" : ""}>
            Business Address of the Company in the custody of the Management
          </option>
        </select>
      `
    }

    if (this.isInPreviewMode.value) {
      return "<span class='placeholder'>Registered Office of the Company in the custody of the Company Secretary</span>"
    }

    return this.application.value?.storedAt === CommonSealStoredAt.RegisteredOffice
      ? "Registered Office of the Company in the custody of the Company Secretary"
      : "Business Address of the Company in the custody of the Management"
  }

  getAuthorityOfContent(): string {
    if (this.isDocumentEditable()) {
      let disable = this.isInPreviewMode.value ? "disabled" : ""
      let authorityOfOptions = `
        <select id='authority-of' class='form-select form-control in-resolution' ${disable} name="authorityOf" data-field-name="authorityOf">
          <option value='${CommonSealAuthorityOf.BoardOfDirectors}' ${this.application.value?.authorityOf === CommonSealAuthorityOf.BoardOfDirectors ? "selected" : ""}>
            the Board of Directors
          </option>
          <option value='${CommonSealAuthorityOf.SpecificDirector}' ${this.application.value?.authorityOf === CommonSealAuthorityOf.SpecificDirector ? "selected" : ""}>
            the following Director:
          </option>
        </select>
      `

      if (this.application.value?.authorityOf === CommonSealAuthorityOf.SpecificDirector) {
        let directorOptions = this.directors.value.map((d: Director) => {
          let selected = this.application.value?.directorName === d.name ? "selected" : ""
          return `
            <option value='${d.name}' ${selected}>${d.name}</option>
          `
        })
        authorityOfOptions = `
          ${authorityOfOptions}
          <select class='form-select form-control in-resolution' ${disable} name="directorName" data-field-name="directorName">
            ${directorOptions.join("")}
          </select>
        `
      }

      return authorityOfOptions
    }

    if (this.isInPreviewMode.value) {
      return "<span class='placeholder'>the Board of Directors</span>"
    }

    return this.application.value?.authorityOf === CommonSealAuthorityOf.BoardOfDirectors
      ? "the Board of Directors"
      : `the following Director: ${this.application.value?.directorName}`
  }

  getAuthorisedSignatoriesContent(): string {
    if (this.isDocumentEditable()) {
      let disable = this.isInPreviewMode.value ? "disabled" : ""
      let directorForAuthorisedSignatoriesOptions = this.directors.value.map((d: Director) => {
        let checked = this.application.value?.authorisedSignatory.includes(d.name) ? "checked" : ""
        return `
          <div class='form-check'>
            <input type='checkbox' class='form-check-input authorised-signatory' value='${d.name}' ${checked} ${disable}>
            <span class='${checked}'>${d.name}</span>
          </div>
        `
      })

      let authorisedSignatoriesOptions = `
        <div class='authorised-signatories'>
          ${directorForAuthorisedSignatoriesOptions.join("")}
        </div>
      `

      return authorisedSignatoriesOptions
    }

    if (this.isInPreviewMode.value) {
      let names = this.directors.value.map((d: Director, index: number) => {
        let idType =
          d.identificationType === IdentificationTypes.IC.id
            ? IdentificationTypes.IC.value
            : IdentificationTypes.PASSPORT.value
        return `<span class='placeholder'>${index + 1}. ${d.name} (${idType} NO. ${d.identification})</span>`
      })

      return names.join("<br>")
    }

    if (!this.application.value) {
      return ""
    }

    let listOfNames = this.application.value.authorisedSignatory.map((d: any) => {
      return `<li>${d}</li>`
    })

    return `<ol>${listOfNames.join(" ")}</ol>`
  }

  getContent(): string {
    this.documentTemplate.value.content = this.originalTemplateContent

    let imageSearchString = "$text.&lt;name=imageOfCommonSeal&gt;$"
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      imageSearchString,
      this.getImageContent()
    )

    let storedAtSearchString = "$text.&lt;name=storedAt&gt;$"
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      storedAtSearchString,
      this.getStoredAtContent()
    )

    let authorityOfSearchString = "$text.&lt;name=authorityOf&gt;$"
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      authorityOfSearchString,
      this.getAuthorityOfContent()
    )

    let authorisedSignatoriesSearchString = "$text.&lt;name=authorisedSignatories&gt;$"
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      authorisedSignatoriesSearchString,
      this.getAuthorisedSignatoriesContent()
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

  handleStoredAt(event: Event): void {
    if (!this.application.value) {
      return
    }

    const inputField = event.target as HTMLSelectElement

    this.application.value.storedAt = inputField.value
    this.setContent()
  }

  handleAuthorityOf(event: Event): void {
    if (!this.application.value) {
      return
    }

    const inputField = event.target as HTMLSelectElement

    this.application.value.authorityOf = inputField.value
    this.setContent()
  }

  handleAuthorisedSignatories(event: Event): void {
    if (!this.application.value) {
      return
    }

    const inputField = event.target as HTMLInputElement

    if (inputField.checked) {
      this.application.value.authorisedSignatory.push(inputField.value)
    } else {
      this.application.value.authorisedSignatory = this.application.value.authorisedSignatory.filter((d: string) => {
        return d !== inputField.value
      })
    }
    this.setContent()
  }

  attachEventListeners(): void {
    if (!this.isDocumentEditable()) {
      return
    }

    const storedAtSelector = document.getElementById("stored-at")
    if (storedAtSelector) {
      storedAtSelector.removeEventListener("change", this.handleStoredAt.bind(this))
      storedAtSelector.addEventListener("change", this.handleStoredAt.bind(this))
    }

    const authorityOfSelector = document.getElementById("authority-of")
    if (authorityOfSelector) {
      authorityOfSelector.removeEventListener("change", this.handleAuthorityOf.bind(this))
      authorityOfSelector.addEventListener("change", this.handleAuthorityOf.bind(this))
    }

    const authorisedSignatories = document.querySelectorAll(".authorised-signatory")
    authorisedSignatories.forEach((input: any) => {
      input.removeEventListener("changed", this.handleAuthorisedSignatories.bind(this))
      input.addEventListener("changed", this.handleAuthorisedSignatories.bind(this))
    })
  }
}
