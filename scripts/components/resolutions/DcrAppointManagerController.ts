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

export class DcrAppointManagerController extends ResolutionController<CompanyDirectorManagerAppointment> {
  companyDirectorManagerAppointmentRepository = useCompanyDirectorManagerAppointmentStore()
  companyRepository = useCompanyStore()
  documentTemplateRepository = useDocumentTemplateStore()

  directors = ref<Director[]>([])

  documentTemplate = ref<DocumentTemplate>(new DocumentTemplate())

  originalTemplateContent: string = ""

  private documentTemplateId: string = "1866b7fd-bfb6-42fd-94e2-3109c83711e9"

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
    if (this.isDocumentEditable()) {
      let directorOptions = this.directors.value.map((d: Director) => {
        return `
          <option value="${d.name}">
        `
      })

      let datalist = `
        <datalist id='nameList'>
          ${directorOptions.join("")}
        </datalist>
      `

      let nameInput = `
        <input 
          type='text' 
          value='${this.application.value?.name}' 
          class='form-control in-resolution' 
          id='name' 
          name='name'
          placeholder='FULL NAME OF APPOINTEE'
          list="nameList">
        ${datalist}
      `

      return nameInput
    } else if (this.isInPreviewMode.value) {
      return `<span class='value-placeholder'>Full Name of Appointee</span>`
    }

    return this.application.value?.name ?? ""
  }

  getIdentificationTypeOptions(): string {
    if (this.isDocumentEditable()) {
      let identificationSelect = `
        <select name='identificationType' id='identification-type' class='form-control in-resolution'>
          <option value='ic'>
            NRIC
          </option>
          <option value='passport'>
            Passport
          </option>
        </select>
      `

      return identificationSelect
    } else if (this.isInPreviewMode.value) {
      return `<span class='value-placeholder'>NRIC / Passport</span>`
    }

    return this.application.value?.identificationType === "passport" ? "Passport" : "NRIC"
  }

  getTermsAndConditionsOption(): string {
    if (this.isDocumentEditable()) {
      let tncSelect = `
        <select name='termsAndConditions' id='terms-and-conditions' class='form-control in-resolution'>
          <option value='${CompanyDirectorManagerTnCDocumentType.TermsOfAppointment}'>
            Terms Of Appointment
          </option>
          <option value='${CompanyDirectorManagerTnCDocumentType.EmploymentContract}'>
            Employment Contract
          </option>
          <option value='${CompanyDirectorManagerTnCDocumentType.ServiceAgreement}'>
            Service Agreement
          </option>
        </select>
      `

      return tncSelect
    } else if (this.isInPreviewMode.value) {
      return `<span class='value-placeholder'>Terms of Appointment</span>`
    }

    switch (this.application.value?.termsAndConditions) {
      case CompanyDirectorManagerTnCDocumentType.TermsOfAppointment:
        return `Terms Of Appointment`
        break
      case CompanyDirectorManagerTnCDocumentType.EmploymentContract:
        return `Employment Contract`
        break
      case CompanyDirectorManagerTnCDocumentType.ServiceAgreement:
        return `Service Agreement`
        break
    }

    return "Terms Of Appointment"
  }

  getOptionalClauseContent(): string {
    let fragments = this.originalTemplateContent.split('<p class="ql-align-justify">[Optional]')
    if (fragments.length < 2) {
      return ""
    }

    let secondFragment = fragments[1].replace('<p class="ql-align-justify">[Optional]', "").split("[/Optional]</p>")
    if (secondFragment.length < 2) {
      return ""
    }

    let optionalClause = secondFragment[0].replace("[/Optional]</p>", "")

    if (this.isInPreviewMode.value) {
      return `
        <p>
          <span class='value-placeholder'>
            ${optionalClause}
          </span>
        </p>
      `
    }

    if (!this.application.value || !this.application.value.isUpdateRegistryRequired) {
      return ""
    }

    return `<p></p><p>${optionalClause}</p><p><br></p>`
  }

  getContent(): string {
    this.documentTemplate.value.content = this.originalTemplateContent

    let nameSearchString = "$text.&lt;name=name&gt;$"
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      nameSearchString,
      this.getNameOptions()
    )

    let identificationTypeSearchString = "$text.&lt;name=identificationType&gt;$"
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      identificationTypeSearchString,
      this.getIdentificationTypeOptions()
    )

    let termsAndConditionSearchString = "$text.&lt;name=documentName&gt;$"
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      termsAndConditionSearchString,
      this.getTermsAndConditionsOption()
    )

    let optionalClauseSearchString = `<p class="ql-align-justify">[Optional]<strong>THAT</strong> the Company Secretary be and is hereby authorised to make the necessary entries in the relevant statutory registers and internal records of the Company, where applicable.[/Optional]</p><p class="ql-align-justify"><br></p>`
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      optionalClauseSearchString,
      this.getOptionalClauseContent()
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
}
