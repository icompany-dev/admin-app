import { CompanyOfficialSeal } from "~/scripts/models/CompanyOfficialSeal"
import { ResolutionController } from "./ResolutionController"
import { DocumentTemplate } from "~/scripts/models/DocumentTemplate"
import { StringUtil } from "~/scripts/utils/String"
import { Company } from "~/scripts/models/Company"
import { Error } from "~/scripts/library/Error"
import { TemplateProcessor } from "~/scripts/library/TemplateProcessor"
import { Director } from "~/scripts/models/Director"
import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

export class DcrOfficialSealController extends ResolutionController<CompanyOfficialSeal> {
  companyOfficialSealRepository = useCompanyOfficialSealStore()
  companyRepository = useCompanyStore()
  documentTemplateRepository = useDocumentTemplateStore()

  directors = ref<Director[]>([])

  documentTemplate = ref<DocumentTemplate>(new DocumentTemplate())

  resolutionContent = ref<string>("")
  originalTemplateContent: string = ""

  private documentTemplateId: string = "39c38971-95ee-4846-b7d1-2405ae3f37e5"

  time = useLocalTime()

  constructor(props: IPropsResolutionDocument<CompanyOfficialSeal>, emitEvents: any | null) {
    super(
      props.companyId,
      props.applicationId,
      props.application,
      CompanyOfficialSeal,
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
    let response = await this.companyOfficialSealRepository.fetch(id)
    if (!this.companyOfficialSealRepository.error && response !== null) {
      this.application.value = new CompanyOfficialSeal(response)
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
      this.application.value = new CompanyOfficialSeal()
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
    let location = this.application.value?.location.toUpperCase() ?? "LOCATION"
    if (StringUtil.isNullOrEmpty(location)) {
      location = "LOCATION OF USE"
    }
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
            <text x="50%" y="100" text-anchor="middle" class="label">COMMON</text>
            <text x="50%" y="125" text-anchor="middle" class="label">SEAL</text>
            <text x="50%" y="165" text-anchor="middle" class="reg">${location}</text>
            <text x="50%" y="200" text-anchor="middle" class="reg">${this.registrationNumberNew()}</text>
            <text x="50%" y="225" text-anchor="middle" class="reg">(${this.registrationNumberOld()})</text>
          </g>
        </svg>
      </div>
    `
  }

  getAuthorisedPersonsContent(): string {
    if (this.isDocumentEditable()) {
      let options = this.directors.value.map((d: Director) => {
        return `<option value='${d.name}'>`
      })
      let datalist = `
          <datalist id='directorsList'>
            ${options.join("")}
          </datalist>
        `
      return `<input 
        type='text' 
        name='authorisedPersons' 
        id="authorised-persons"
        class='form-control in-resolution' 
        value='${this.application.value?.authorisedPersons}' 
        list="directorsList" 
        placeholder='AUTHORISED PERSON'>${datalist}`
    } else if (this.isInPreviewMode.value) {
      return `<span class='value-placeholder'>AUTHORISED PERSON</span>`
    }

    return `${this.application.value?.authorisedPersons ?? "Authorised Person"}`
  }

  getLocationContent(): string {
    if (this.isDocumentEditable()) {
      return `<input 
        type='text' 
        name='location' 
        id="location"
        class='form-control in-resolution' 
        value='${this.application.value?.location}' 
        placeholder='LOCATION OF USE'>`
    } else if (this.isInPreviewMode.value) {
      return `<span class='value-placeholder'>LOCATION OF USE</span>`
    }

    return `${this.application.value?.location ?? "location"}`
  }

  getAuthorisedPersonsTwoContent(): string {
    if (this.isDocumentEditable()) {
      return `<input 
        type='text'
        class='form-control in-resolution' 
        value='${this.application.value?.authorisedPersons}' 
        disabled 
        placeholder='AUTHORISED PERSON'>`
    } else if (this.isInPreviewMode.value) {
      return `<span class='value-placeholder'>AUTHORISED PERSON</span>`
    }

    return `${this.application.value?.authorisedPersons ?? "Authorised Person"}`
  }

  getLocationTwoContent(): string {
    if (this.isDocumentEditable()) {
      return `<input 
        type='text' 
        name='location' 
        class='form-control in-resolution' 
        value='${this.application.value?.location}' 
        disabled
        placeholder='LOCATION OF USE'>`
    } else if (this.isInPreviewMode.value) {
      return `<span class='value-placeholder'>LOCATION OF USE</span>`
    }

    return `${this.application.value?.location ?? "location"}`
  }

  getContent(): string {
    this.documentTemplate.value.content = this.originalTemplateContent

    let imageSearchString = "$text.&lt;name=imageOfCommonSeal&gt;$"
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      imageSearchString,
      this.getImageContent()
    )

    let authorisedPersonSearchString = "$text.&lt;name=authorisedPersons&gt;$"
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      authorisedPersonSearchString,
      this.getAuthorisedPersonsContent()
    )

    let authorisedPersonTwoSearchString = "$text.&lt;name=authorisedPersonsTwo&gt;$"
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      authorisedPersonTwoSearchString,
      this.getAuthorisedPersonsTwoContent()
    )

    let locationSearchString = "$text.&lt;name=location&gt;$"
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      locationSearchString,
      this.getLocationContent()
    )

    let locationTwoSearchString = "$text.&lt;name=locationTwo&gt;$"
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      locationTwoSearchString,
      this.getLocationTwoContent()
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

  handleAuthorisedPerson(event: Event): void {
    if (!this.application.value) {
      return
    }

    const inputField = event.target as HTMLSelectElement

    this.application.value.authorisedPersons = inputField.value
    this.setContent()
  }

  handleLocation(event: Event): void {
    if (!this.application.value) {
      return
    }

    const inputField = event.target as HTMLSelectElement

    this.application.value.location = inputField.value
    this.setContent()
  }

  attachEventListeners(): void {
    if (!this.isDocumentEditable()) {
      return
    }

    const authorisedPersonSelector = document.getElementById("authorised-persons")
    if (authorisedPersonSelector) {
      authorisedPersonSelector.removeEventListener("change", this.handleAuthorisedPerson.bind(this))
      authorisedPersonSelector.addEventListener("change", this.handleAuthorisedPerson.bind(this))
    }

    const locationSelector = document.getElementById("location")
    if (locationSelector) {
      locationSelector.removeEventListener("change", this.handleLocation.bind(this))
      locationSelector.addEventListener("change", this.handleLocation.bind(this))
    }
  }
}
