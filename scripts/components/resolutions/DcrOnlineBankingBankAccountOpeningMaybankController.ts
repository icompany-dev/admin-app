import { CompanyBankAccountOpening } from "~/scripts/models/CompanyBankAccountOpening"
import { OpenBankAccountResolutionController } from "./OpenBankAccountResolutionController"
import { DocumentTemplate } from "~/scripts/models/DocumentTemplate"
import { StringUtil } from "~/scripts/utils/String"
import { Company } from "~/scripts/models/Company"
import { Bank } from "~/scripts/models/Bank"
import { Error } from "~/scripts/library/Error"
import { TemplateProcessor } from "~/scripts/library/TemplateProcessor"
import { Director } from "~/scripts/models/Director"
import _ from "lodash"
import { User } from "~/scripts/models/User"
import { OnlineBanking } from "~/scripts/types/banks/OnlineBanking"

export class DcrOnlineBankingBankAccountOpeningMaybankController extends OpenBankAccountResolutionController<CompanyBankAccountOpening> {
  companyBankAccountOpeningRepository = useCompanyBankAccountOpeningStore()
  companyRepository = useCompanyStore()
  documentTemplateRepository = useDocumentTemplateStore()
  bankRepository = useBankStore()

  documentTemplate = ref<DocumentTemplate>(new DocumentTemplate())

  directors = ref<Director[]>([])
  directorUsers = ref<User[]>([])

  resolutionContent = ref<string>("")
  originalResolutionContent = ref<string>("")

  private documentTemplateId: string = "fc711763-c8f4-48ff-99d4-a291739b26de"

  bankId = ref<string>("")
  bank = ref<Bank>(new Bank())

  onlineAccessPersons = ref<OnlineBanking[]>([])

  time = useLocalTime()
  language = useLanguage()

  constructor(
    companyId: string,
    applicationId: string | null,
    application: CompanyBankAccountOpening | null,
    isInPreviewMode: boolean,
    showWatermark: boolean,
    watermarkText: string,
    emitEvents: any | null,
    bankId: string = ""
  ) {
    super(companyId, application, CompanyBankAccountOpening, isInPreviewMode, showWatermark, watermarkText, emitEvents)
    this.isDcr.value = true
    this.bankId.value = bankId

    this.initializeResolution(applicationId, companyId)
  }

  override setCompanyId(companyId: string): void {
    this.companyId.value = companyId
    this.fetchDirectors()
  }

  async setApplicationId(id: string | null): Promise<void> {
    if (StringUtil.isNullOrEmpty(id)) {
      await this.setApplication()
      return
    } else {
      await this.fetchApplication(id ?? "")
    }
  }

  async initializeApplication(applicationId: string | null, companyId: string): Promise<void> {
    if (!StringUtil.isNullOrEmpty(applicationId) && applicationId !== null) {
      await this.fetchApplication(applicationId)
    } else {
      await this.setApplication()
    }

    await this.fetchDirectors()
    this.setContent()
  }

  async initializeResolution(applicationId: string | null, companyId: string): Promise<void> {
    this.isLoading.value = true
    await Promise.all([this.initializeApplication(applicationId, companyId), this.fetchDocumentTemplate()])

    this.setContent()
    this.isLoading.value = false

    await nextTick(() => {
      this.attachEventListeners()
    })
  }

  async fetchDirectors(): Promise<void> {
    let response = await this.directorRepository.fetchAllForCompany(this.companyId.value)
    this.directors.value = response.map((d: Director) => {
      return new Director(d)
    })

    for (let i = 0; i < this.directors.value.length; i++) {
      let director = this.directors.value[i]
      let user = await director.getRegisteredUser(useUserStore())
      if (!user) {
        continue
      }

      this.directorUsers.value.push(user)
    }
  }

  async fetchApplication(id: string): Promise<void> {
    let response = await this.companyBankAccountOpeningRepository.fetch(id)
    if (!this.companyBankAccountOpeningRepository.error && response !== null) {
      this.application.value = new CompanyBankAccountOpening(response)
      this.syncFromApplication()
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
      this.application.value = new CompanyBankAccountOpening()
      this.application.value.companyId = this.companyId.value
      this.application.value.company = new Company(company)
      this.application.value.bankId = this.bankId.value
      if (this.bank.value?.id) {
        this.application.value.bank = this.bank.value
      }
      this.initializeData()
    }
  }

  syncFromApplication(): void {
    if (!this.application.value) {
      return
    }

    this.bankId.value = this.application.value.bankId
    this.onlineAccessPersons.value = this.application.value.onlineBanking.map((s: any) => {
      return new OnlineBanking({
        id: s.id || s.identification,
        name: s.name,
        role: s.role || "checker",
      })
    })
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

  getContent(): string {
    this.documentTemplate.value.content = this.originalResolutionContent.value
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      "$textarea.&lt;name=onlineBanking&gt;$",
      this.authorisedOnlineBankingHtml()
    )

    let templateProcessor = new TemplateProcessor(this.documentTemplate.value)

    if (this.isInPreviewMode.value) {
      return templateProcessor.getContentForPreview(this.application.value)
    } else {
      return this.isDocumentEditable()
        ? templateProcessor.getContent(this.application.value, this.isInPreviewMode.value)
        : templateProcessor.getContentForPrint(this.application.value)
    }
  }

  datalistForDirectors(itemIndex: number): string {
    let selectedNames = this.onlineAccessPersons.value
      .map((item: any, index: number) => {
        if (index === itemIndex) {
          return ""
        }

        return item.name
      })
      .filter((name: string) => {
        return !StringUtil.isNullOrEmpty(name)
      })

    let directorsNames = this.directorUsers.value.map((d: User) => {
      if (StringUtil.inArray(d.name, selectedNames)) {
        return ""
      }

      return `<option value='${d.name}'>`
    })

    return `
      <datalist id='directorsList${itemIndex}'>
        ${directorsNames.join("")}
      </datalist>
    `
  }

  getRowForItem(itemIndex: number): string {
    let item = this.onlineAccessPersons.value[itemIndex] ?? null

    let datalist = this.datalistForDirectors(itemIndex)
    let role = item?.role === "maker" ? "maker" : "checker"
    if (this.isDocumentEditable()) {
      let canRemove = itemIndex > 0 && itemIndex === this.onlineAccessPersons.value.length - 1
      let removeButton = ""
      if (canRemove) {
        removeButton = `<i class='fa-regular fa-trash-alt remove-button' />`
      }
      return `
        <tr>
          <td>
            <input type='text' value='${item?.name ?? ""}' class='form-control authorised-persons' id='name-${itemIndex}' list="directorsList${itemIndex}">
            ${datalist}
          </td>
          <td>
            <input type='text' value='${item?.id ?? ""}' class='form-control authorised-person-id' id='id-${itemIndex}'>
          </td>
          <td>
            <select class='form-select form-control authorised-person-role' id='role-${itemIndex}'>
              <option value='checker' ${role === "checker" ? "selected" : ""}>Checker</option>
              <option value='maker' ${role === "maker" ? "selected" : ""}>Maker</option>
            </select>
            ${removeButton}
          </td>
        </tr>
      `
    } else {
      let spanClass = this.isInPreviewMode.value ? 'class="placeholder"' : ""
      let itemName = this.isInPreviewMode.value ? "NAME OF AUTHORISED PERSON" : item?.name
      let itemId = this.isInPreviewMode.value ? "NRIC NO. OF AUTHORISED PERSON" : item?.id
      return `
      <tr>
        <td>
          <span ${spanClass}>${itemName}</span>
        </td>
        <td>
        <span ${spanClass}>${itemId}</span>
        </td>
        <td>
          ${role.toUpperCase()}
        </td>
      </tr>
    `
    }
  }

  authorisedOnlineBankingHtml(): string {
    if (this.onlineAccessPersons.value.length <= 0) {
      let newOnlineAccessPerson = new OnlineBanking()
      newOnlineAccessPerson.role = "checker"
      this.onlineAccessPersons.value.push(newOnlineAccessPerson)
    }

    let content = this.onlineAccessPersons.value.map((item: any, index: number) => {
      return this.getRowForItem(index)
    })

    let addMoreButton = ""
    if (this.isDocumentEditable()) {
      addMoreButton = '<span class="add-more action-link">+ Add More</span>'
    }

    return `
      <table class='maybank-online-banking'>
        <thead>
          <tr>
            <td colspan='3'>Viewer, Maker and Checker Information</td>
          </tr>
          <tr>
            <td>NAME</td>
            <td>PASSPORT/NRIC No.</td>
            <td>VIEWER OR MAKER OR CHECKER</td>
          </tr>
        </thead>
        <tbody>
          ${content.join("")}
        </tbody>
      </table>
      ${addMoreButton}
    `
  }

  handleNameSelected(event: Event): void {
    const inputField = event.target as HTMLInputElement
    let inputFieldId = inputField.id
    if (!inputFieldId.includes("name")) {
      return
    }

    let selectedName = inputField.value

    let index = parseInt(inputFieldId.replace("name-", ""))

    if (index >= this.onlineAccessPersons.value.length) {
      return
    }

    this.onlineAccessPersons.value[index].name = selectedName
    nextTick(() => {
      this.setContent()
    })

    let identificationFieldId = `id-${index}`
    let identificationInput = document.getElementById(identificationFieldId)
    if (!identificationInput) {
      this.onlineAccessPersons.value[index].id = ""
      return
    }

    let identificationInputField = identificationInput as HTMLInputElement

    if (StringUtil.isNullOrEmpty(selectedName)) {
      identificationInputField.value = ""
      return
    }

    let selectedDirector = this.directorUsers.value.find((d: User) => {
      return d.name === selectedName
    })

    if (!selectedDirector) {
      identificationInputField.value = ""
      return
    }

    identificationInputField.value = selectedDirector.detail?.identification ?? "-"
    this.onlineAccessPersons.value[index].id = selectedDirector.detail?.identification ?? "-"

    this.emitEvents("updated")
  }

  handleIdChanged(event: Event): void {
    const inputField = event.target as HTMLInputElement
    let inputFieldId = inputField.id
    if (!inputFieldId.includes("id")) {
      return
    }

    let identificationNumber = inputField.value

    let index = parseInt(inputFieldId.replace("id-", ""))

    if (index >= this.onlineAccessPersons.value.length) {
      return
    }
    this.onlineAccessPersons.value[index].id = identificationNumber

    this.emitEvents("updated")
  }

  handleRoleChanged(event: Event): void {
    const inputField = event.target as HTMLSelectElement
    let inputFieldId = inputField.id
    if (!inputFieldId.includes("role")) {
      return
    }

    let selectedRole = inputField.value

    let index = parseInt(inputFieldId.replace("role-", ""))

    if (index >= this.onlineAccessPersons.value.length) {
      return
    }

    this.onlineAccessPersons.value[index].role = selectedRole

    this.emitEvents("updated")
  }

  addMore(): void {
    let newOnlineAccessPerson = new OnlineBanking()
    newOnlineAccessPerson.role = "checker"
    this.onlineAccessPersons.value.push(newOnlineAccessPerson)

    if (this.onlineAccessPersons.value.length > 2) {
      this.signatureStartOnPage.value = 2
      this.maxSignatureOnFirstPage.value = 4
    } else {
      this.signatureStartOnPage.value = 1
      this.maxSignatureOnFirstPage.value = 2
    }

    nextTick(() => {
      this.setContent()
    })

    this.emitEvents("updated")
  }

  remove(): void {
    this.onlineAccessPersons.value.pop()

    if (this.onlineAccessPersons.value.length > 2) {
      this.signatureStartOnPage.value = 2
      this.maxSignatureOnFirstPage.value = 4
    } else {
      this.signatureStartOnPage.value = 1
      this.maxSignatureOnFirstPage.value = 2
    }

    nextTick(() => {
      this.setContent()
    })

    this.emitEvents("updated")
  }

  attachEventListeners(): void {
    if (!this.isDocumentEditable()) {
      return
    }

    const nameInputFields = document.querySelectorAll(".authorised-persons")
    nameInputFields.forEach((input) => {
      input.removeEventListener("change", this.handleNameSelected.bind(this))
      input.addEventListener("change", this.handleNameSelected.bind(this))
    })

    const idInputFields = document.querySelectorAll(".authorised-person-id")
    idInputFields.forEach((input) => {
      input.removeEventListener("change", this.handleIdChanged.bind(this))
      input.addEventListener("change", this.handleIdChanged.bind(this))
    })

    const roleInputFields = document.querySelectorAll(".authorised-person-role")
    roleInputFields.forEach((input) => {
      input.removeEventListener("change", this.handleRoleChanged.bind(this))
      input.addEventListener("change", this.handleRoleChanged.bind(this))
    })

    const addMores = document.querySelectorAll(".add-more")
    addMores.forEach((addMore) => {
      addMore.removeEventListener("click", this.addMore.bind(this))
      addMore.addEventListener("click", this.addMore.bind(this))
    })

    const removeButtons = document.querySelectorAll(".remove-button")
    removeButtons.forEach((addMore) => {
      addMore.removeEventListener("click", this.remove.bind(this))
      addMore.addEventListener("click", this.remove.bind(this))
    })
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

  getAuthorisedPersonsForOnlineBanking(): OnlineBanking[] {
    return this.onlineAccessPersons.value
  }
}
