import { CompanyContractEnter } from "~/scripts/models/CompanyContractEnter"
import { Company } from "~/scripts/models/Company"
import { Director } from "~/scripts/models/Director"
import { DocumentTemplate } from "~/scripts/models/DocumentTemplate"
import { ResolutionController } from "./ResolutionController"
import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import {
  CompanyContractEnterDocumentType,
  CompanyContractEnterKeyValues,
  CompanyContractEnterRole,
  CompanyContractEnterValidity,
} from "~/scripts/constants/CompanyContracts"
import { TemplateProcessor } from "~/scripts/library/TemplateProcessor"

export class DcrEnterContractsController extends ResolutionController<CompanyContractEnter> {
  companyContractEnterRepository = useCompanyContractEnterStore()
  companyRepository = useCompanyStore()
  documentTemplateRepository = useDocumentTemplateStore()

  directors = ref<Director[]>([])

  documentTemplate = ref<DocumentTemplate>(new DocumentTemplate())

  originalTemplateContent: string = ""

  private documentTemplateId: string = "f517e315-e358-4f77-9e70-8576e502df20"

  constructor(props: IPropsResolutionDocument<CompanyContractEnter>, emitEvents: any | null) {
    super(
      props.companyId,
      props.applicationId,
      props.application,
      CompanyContractEnter,
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
    let response = await this.companyContractEnterRepository.fetch(id)
    if (!this.companyContractEnterRepository.error && response !== null) {
      this.application.value = new CompanyContractEnter(response)
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
      this.application.value = new CompanyContractEnter()
      this.application.value.companyId = this.companyId.value
      this.application.value.company = new Company(company)
      this.application.value.contractWith.push("")
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

  getAuthorisedPersonsContent(): string {
    if (this.isDocumentEditable()) {
      let directorOptions = this.directors.value.map((d: Director) => {
        return `
          <option value="${d.name}">
        `
      })

      let datalist = `
        <datalist id='authorisedPersonsList'>
          <option value="any Director">
          ${directorOptions.join("")}
        </datalist>
      `

      let authorisedPersonInput = `
        <input 
          type='text' 
          value='${this.application.value?.authorisedPersons}' 
          class='form-control in-resolution' 
          id='authorised-persons' 
          name='authorisedPersons'
          list="authorisedPersonsList">
        ${datalist}
      `

      return authorisedPersonInput
    } else if (this.isInPreviewMode.value) {
      return `<span class='value-placeholder'>any Director</span>`
    }

    return this.application.value?.authorisedPersons === "any"
      ? "any Director"
      : (this.application.value?.authorisedPersons ?? "")
  }

  getRoleContent(): string {
    if (this.isDocumentEditable()) {
      let directorSelected = this.application.value?.role === CompanyContractEnterRole.Director ? "selected" : ""
      let representativeSelected =
        this.application.value?.role === CompanyContractEnterRole.Representative ? "selected" : ""

      return `
        <select name='role' id='contract-enter-role' class='form-control in-resolution'>
          <option value='${CompanyContractEnterRole.Director}' ${directorSelected}>
            ${CompanyContractEnterKeyValues.MAP[CompanyContractEnterRole.Director]}
          </option>
          <option value='${CompanyContractEnterRole.Representative}' ${representativeSelected}>
            ${CompanyContractEnterKeyValues.MAP[CompanyContractEnterRole.Representative]}
          </option>
        </select>
      `
    } else if (this.isInPreviewMode.value) {
      return `
        <span class='value-placeholder'>
          ${CompanyContractEnterKeyValues.MAP[CompanyContractEnterRole.Director]}
        </span>
      `
    }

    if (!this.application.value) {
      return CompanyContractEnterKeyValues.MAP[CompanyContractEnterRole.Director]
    }

    return CompanyContractEnterKeyValues.MAP[this.application.value.role]
  }

  getDocumentTypeContent(): string {
    if (this.isDocumentEditable()) {
      if (this.application.value?.documentType === CompanyContractEnterDocumentType.General) {
        return `
          <select name='documentType' id='document-type' class='form-control in-resolution'>
            <option value='${CompanyContractEnterDocumentType.General}' selected>
              ${CompanyContractEnterKeyValues.MAP[CompanyContractEnterDocumentType.General]}
            </option>
            <option value='${CompanyContractEnterDocumentType.SpecificName}'>
              ${CompanyContractEnterKeyValues.MAP[CompanyContractEnterDocumentType.SpecificName]}
            </option>
          </select>
        `
      }

      let datalist = `
        <datalist id='documentTypeList'>
          <option value="${CompanyContractEnterKeyValues.MAP[CompanyContractEnterDocumentType.General]}">
        </datalist>
      `

      let documentNameInput = `
        <input 
          type='text' 
          value='${this.application.value?.documentName}' 
          class='form-control in-resolution' 
          id='document-name' 
          name='documentName'
          placeholder='${CompanyContractEnterKeyValues.MAP[CompanyContractEnterDocumentType.SpecificName]}'
          list="documentTypeList">
        ${datalist}
      `

      return documentNameInput
    } else if (this.isInPreviewMode.value) {
      return `
        <span class='value-placeholder'>
          ${CompanyContractEnterKeyValues.MAP[CompanyContractEnterDocumentType.General]}.
        </span>
      `
    }

    if (!this.application.value) {
      return `${CompanyContractEnterKeyValues.MAP[CompanyContractEnterDocumentType.General]}.`
    }

    if (this.application.value.documentType === CompanyContractEnterDocumentType.SpecificName) {
      return `${this.application.value.documentName}.`
    }

    return `${CompanyContractEnterKeyValues.MAP[this.application.value.documentType]}.`
  }

  getContractWithContent(): string {
    if (this.isDocumentEditable()) {
      let contractWith = this.application.value?.contractWith ?? [""]

      let inputFields = contractWith.map((item: string, index: number) => {
        return `
          <div class="contract-with-wrapper">
            <input 
              type="text" 
              class="form-control in-resolution contract-with" 
              id='contract-with-${index}' 
              value="${item}"
              placeholder="Full Legal Name of the Party">
          </div>
        `
      })

      let remove = contractWith.length > 1 ? '<span id="remove" class="action-link remove">(- Remove)</span>' : ""

      return `
        ${StringUtil.oxfordJoin("and", inputFields)}
        ${remove} 
        <span class="action-link add-more" id="add-more">(+ Add more)</span>
      `
    } else if (this.isInPreviewMode.value) {
      return `<span class='value-placeholder'>Full Legal Name of the Party</span>.`
    }

    if (!this.application.value) {
      return "."
    }

    return `${StringUtil.oxfordJoin("and", this.application.value.contractWith)}.`
  }

  getValidityContent(): string {
    if (this.isDocumentEditable()) {
      if (this.application.value?.validity === CompanyContractEnterValidity.UntilRevoke) {
        return `
          <select name='validity' id='validity' class='form-control in-resolution'>
            <option value='${CompanyContractEnterValidity.UntilRevoke}' selected>
              ${CompanyContractEnterKeyValues.MAP[CompanyContractEnterValidity.UntilRevoke]}
            </option>
            <option value='${CompanyContractEnterValidity.FixedPeriod}'>
              for a period of ______ years ${CompanyContractEnterKeyValues.MAP[CompanyContractEnterValidity.FixedPeriod]}
            </option>
          </select>
        `
      }

      let documentNameInput = `
        for a period of 
        <input 
          type='text' 
          value='${this.application.value?.numberYears}' 
          class='form-control in-resolution' 
          id='number-years' 
          name='numberYears'>
        year(s) ${CompanyContractEnterKeyValues.MAP[CompanyContractEnterValidity.FixedPeriod]}
        <span class="action-link change" id='change-validity'>(Change?)</span>
      `

      return documentNameInput
    } else if (this.isInPreviewMode.value) {
      return `
        <span class='value-placeholder'>
          ${CompanyContractEnterKeyValues.MAP[CompanyContractEnterValidity.UntilRevoke]}.
        </span>
      `
    }

    if (!this.application.value) {
      return `${CompanyContractEnterKeyValues.MAP[CompanyContractEnterValidity.UntilRevoke]}.`
    }

    if (this.application.value.validity === CompanyContractEnterValidity.FixedPeriod) {
      let yearOrYears = this.application.value.numberYears > 1 ? "years" : "year"
      return `for a period of ${this.application.value.numberYears} ${yearOrYears} ${CompanyContractEnterKeyValues.MAP[CompanyContractEnterValidity.FixedPeriod]}.`
    }

    return `${CompanyContractEnterKeyValues.MAP[this.application.value.validity]}.`
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

    if (this.isDocumentEditable()) {
      return `
        <div class="form-check">
          <input type="checkbox" class="form-check-input" id="additional-clause" ${this.application.value?.isAdditionalClauseRequired ? "checked" : ""}>
          <span>
            ${optionalClause}
          </span>
        </div>
      `
    } else if (this.isInPreviewMode.value) {
      return `
        <p>
          <span class='value-placeholder'>
            ${optionalClause}
          </span>
        </p>
      `
    }

    if (!this.application.value || !this.application.value.isAdditionalClauseRequired) {
      return ""
    }

    return `<p>${optionalClause}</p>`
  }

  getContent(): string {
    this.documentTemplate.value.content = this.originalTemplateContent

    let authorisedPersonsSearchString = "$text.&lt;name=authorisedPersons&gt;$"
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      authorisedPersonsSearchString,
      this.getAuthorisedPersonsContent()
    )

    let roleSearchString = "$text.&lt;name=role&gt;$"
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      roleSearchString,
      this.getRoleContent()
    )

    let documentTypeSearchString = "$text.&lt;name=documentType&gt;$"
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      documentTypeSearchString,
      this.getDocumentTypeContent()
    )

    let contractWithSearchString = "$text.&lt;name=contractWith&gt;$"
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      contractWithSearchString,
      this.getContractWithContent()
    )

    let validitySearchString = "$text.&lt;name=validity&gt;$"
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      validitySearchString,
      this.getValidityContent()
    )

    let optionalClauseSearchString = `<p class="ql-align-justify">[Optional]<strong>THAT </strong>all agreements, contracts, documents and instruments executed by the authorised signatory on behalf of the Company prior to the passing of this resolution be and are hereby approved, ratified and confirmed.[/Optional]</p>`
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

  //event listeners
  handleAuthorisedPersonsChanged(event: Event): void {
    if (!this.application.value) {
      return
    }

    const inputField = event.target as HTMLInputElement

    this.application.value.authorisedPersons = inputField.value
  }

  handleRoleChanged(event: Event): void {
    if (!this.application.value) {
      return
    }

    const inputField = event.target as HTMLSelectElement

    this.application.value.role = inputField.value
  }

  handleDocumentTypeChanged(event: Event): void {
    if (!this.application.value) {
      return
    }

    const inputField = event.target as HTMLSelectElement

    this.application.value.documentType = inputField.value

    if (this.application.value.documentType === CompanyContractEnterDocumentType.General) {
      this.application.value.documentName = ""
    }

    this.setContent()
  }

  handleDocumentNameChanged(event: Event): void {
    if (!this.application.value) {
      return
    }

    const inputField = event.target as HTMLInputElement

    if (inputField.value === CompanyContractEnterKeyValues.MAP[CompanyContractEnterDocumentType.General]) {
      this.application.value.documentType = CompanyContractEnterDocumentType.General
      this.application.value.documentName = ""
      this.setContent()
      return
    }

    this.application.value.documentName = inputField.value
  }

  handleAddMoreContactWithClicked(): void {
    if (!this.application.value) {
      this.application.value = new CompanyContractEnter()
    }

    this.application.value.contractWith.push("")
    this.setContent()
  }

  handleRemoveContactWithClicked(): void {
    if (!this.application.value) {
      return
    }

    this.application.value.contractWith.pop()
    this.setContent()
  }

  handleContractWithInput(event: Event): void {
    if (!this.application.value) {
      return
    }

    const inputField = event.target as HTMLInputElement
    const inputId = inputField.id
    const index = Number(inputId.replace("contract-with-", ""))

    if (index >= this.application.value.contractWith.length) {
      return
    }

    this.application.value.contractWith[index] = inputField.value
  }

  handleValidityChanged(event: Event): void {
    if (!this.application.value) {
      return
    }

    const inputField = event.target as HTMLSelectElement

    this.application.value.validity = inputField.value

    this.setContent()
  }

  handleChangeValidityClicked(): void {
    if (!this.application.value) {
      return
    }

    this.application.value.validity = CompanyContractEnterValidity.UntilRevoke
    this.application.value.numberYears = 0

    this.setContent()
  }

  handleAdditionalClauseChanged(event: Event): void {
    if (!this.application.value) {
      return
    }

    const inputField = event.target as HTMLInputElement

    this.application.value.isAdditionalClauseRequired = !this.application.value.isAdditionalClauseRequired

    this.setContent()
  }

  attachEventListeners(): void {
    if (!this.isDocumentEditable()) {
      return
    }

    const authorisedPersonInput = document.getElementById("authorised-persons")
    if (authorisedPersonInput) {
      authorisedPersonInput.removeEventListener("change", this.handleAuthorisedPersonsChanged.bind(this))
      authorisedPersonInput.addEventListener("change", this.handleAuthorisedPersonsChanged.bind(this))
    }

    const roleSelector = document.getElementById("contract-enter-role")
    if (roleSelector) {
      roleSelector.removeEventListener("change", this.handleRoleChanged.bind(this))
      roleSelector.addEventListener("change", this.handleRoleChanged.bind(this))
    }

    const documentTypeSelector = document.getElementById("document-type")
    if (documentTypeSelector) {
      documentTypeSelector.removeEventListener("change", this.handleDocumentTypeChanged.bind(this))
      documentTypeSelector.addEventListener("change", this.handleDocumentTypeChanged.bind(this))
    }

    const documentNameInput = document.getElementById("document-name")
    if (documentNameInput) {
      documentNameInput.removeEventListener("change", this.handleDocumentNameChanged.bind(this))
      documentNameInput.addEventListener("change", this.handleDocumentNameChanged.bind(this))
    }

    const addMore = document.getElementById("add-more")
    if (addMore) {
      addMore.removeEventListener("click", this.handleAddMoreContactWithClicked.bind(this))
      addMore.addEventListener("click", this.handleAddMoreContactWithClicked.bind(this))
    }

    const remove = document.getElementById("remove")
    if (remove) {
      remove.removeEventListener("click", this.handleRemoveContactWithClicked.bind(this))
      remove.addEventListener("click", this.handleRemoveContactWithClicked.bind(this))
    }

    const contractWithInputs = document.querySelectorAll("contract-with")
    contractWithInputs.forEach((input) => {
      input.removeEventListener("change", this.handleContractWithInput.bind(this))
      input.addEventListener("change", this.handleContractWithInput.bind(this))
    })

    const validity = document.getElementById("validity")
    if (validity) {
      validity.removeEventListener("change", this.handleValidityChanged.bind(this))
      validity.addEventListener("change", this.handleValidityChanged.bind(this))
    }

    const changeValidity = document.getElementById("change-validity")
    if (changeValidity) {
      changeValidity.removeEventListener("click", this.handleChangeValidityClicked.bind(this))
      changeValidity.addEventListener("click", this.handleChangeValidityClicked.bind(this))
    }

    const additionalClause = document.getElementById("additional-clause")
    if (additionalClause) {
      additionalClause.removeEventListener("change", this.handleAdditionalClauseChanged.bind(this))
      additionalClause.addEventListener("change", this.handleAdditionalClauseChanged.bind(this))
    }
  }
}
