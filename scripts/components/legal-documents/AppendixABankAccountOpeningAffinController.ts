import { CompanyBankAccountOpening } from "~/scripts/models/CompanyBankAccountOpening"
import { SdnBhdLegalDocumentController } from "./SdnBhdLegalDocumentController"
import { DocumentTemplate } from "~/scripts/models/DocumentTemplate"
import { StringUtil } from "~/scripts/utils/String"
import { Company } from "~/scripts/models/Company"
import { Bank } from "~/scripts/models/Bank"
import { Error } from "~/scripts/library/Error"
import { TemplateProcessor } from "~/scripts/library/TemplateProcessor"
import { PaperOrientation } from "~/scripts/constants/Paper"
import { Director } from "~/scripts/models/Director"
import { User } from "~/scripts/models/User"
import { SignatureItem } from "~/scripts/types/SignatureItem"
import { CurrentUser } from "~/scripts/utils/CurrentUser"
import { CompanyBankSignatory } from "~/scripts/models/CompanyBankSignatory"

export class AppendixABankAccountOpeningAffinController extends SdnBhdLegalDocumentController {
  companyBankAccountOpeningRepository = useCompanyBankAccountOpeningStore()
  documentTemplateRepository = useDocumentTemplateStore()
  bankRepository = useBankStore()
  directorRepository = useDirectorStore()

  directors = ref<Director[]>([])
  directorUsers = ref<User[]>([])
  signatories = ref<CompanyBankSignatory[]>([])
  onlineAccessPersons = ref<{ id: string; name: string; role: string; designation: string }[]>([])
  signatureItem = ref<SignatureItem>(new SignatureItem("", false, false, false, "", "", "", false))

  documentTemplate = ref<DocumentTemplate>(new DocumentTemplate())
  resolutionContent = ref<string>("")
  originalContent = ref<string>("")
  application = ref<CompanyBankAccountOpening>(new CompanyBankAccountOpening())

  private documentTemplateId: string = "907e1dff-8f06-4b45-b130-78dbb990b6fb"
  private bankId: string = "6e7c5542-1d5f-42be-872c-3a8bfe2b4c16"

  bank = ref<Bank>(new Bank())

  time = useLocalTime()
  language = useLanguage()

  constructor(companyId: string, applicationId: string | null, isInPreviewMode: boolean, emitEvents: any | null) {
    super("AuthorisedSignatoriesBankAccountOpeningMaybank", companyId, PaperOrientation.Portrait)
    this.isInPreviewMode.value = isInPreviewMode

    this.initializeDocument(applicationId, companyId)
  }

  async initializeDocument(applicationId: string | null, companyId: string): Promise<void> {
    await Promise.all([
      this.initializeApplication(applicationId, companyId),
      this.fetchDocumentTemplate(),
      this.fetchBank(),
      this.fetchDirectors(),
    ])

    this.setContent()
  }

  async initializeApplication(applicationId: string | null, companyId: string): Promise<void> {
    if (!StringUtil.isNullOrEmpty(applicationId) && applicationId !== null) {
      await this.fetchApplication(applicationId)
    } else {
      await this.setApplication()
    }
  }

  async fetchBank(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.bankId)) {
      return
    }

    try {
      let response = await this.bankRepository.fetch(this.bankId)
      if (!this.bankRepository.error && response) {
        this.bank.value = new Bank(response)
        if (this.application.value) {
          this.application.value.bank = this.bank.value
        }
      }
    } catch (e) {
      console.error("Failed to fetch bank:", e)
    }
  }

  async fetchDirectors(): Promise<void> {
    try {
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

      await this.setSignatureItem()
    } catch (e) {
      console.error("Failed to fetch directors:", e)
    }
  }

  async fetchApplication(id: string): Promise<void> {
    let response = await this.companyBankAccountOpeningRepository.fetch(id)
    if (!this.companyBankAccountOpeningRepository.error && response !== null) {
      this.application.value = new CompanyBankAccountOpening(response)
      this.signatories.value = this.application.value.signatories.map((d: any) => {
        let signatory = new CompanyBankSignatory(d)
        ;(signatory as any).designation = d.designation || "Director"
        return signatory
      })
      this.onlineAccessPersons.value = this.application.value.signatories.map((s: any) => ({
        id: s.id || s.identification,
        name: s.name,
        role: s.role || "checker",
        designation: s.designation || "Director",
      }))
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
      this.application.value.bankId = this.bankId
      if (this.bank.value?.id) {
        this.application.value.bank = this.bank.value
      }
    }
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
        let error = new Error(Error.ERROR_TYPE_API, "Failed to fetch document template. Please refresh the page.")
        error.handle()
      }
    }
  }

  datalistForSignatories(itemIndex: number): string {
    let selectedNames = this.signatories.value
      .map((item: CompanyBankSignatory, index: number) => {
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
      <datalist id='signatoryList${itemIndex}'>
        ${directorsNames.join("")}
      </datalist>
    `
  }

  getDesignationDatalist(itemIndex: number, prefix: string): string {
    return `
      <datalist id='${prefix}DesignationList${itemIndex}'>
        <option value='Director'>
      </datalist>
    `
  }

  getSignatoryRowForItem(itemIndex: number): string {
    let item = this.signatories.value[itemIndex] ?? null
    let datalist = this.datalistForSignatories(itemIndex)
    let designationDatalist = this.getDesignationDatalist(itemIndex, "signatory")
    let designation = (item as any)?.designation ?? "Director"

    if (this.isDocumentEditable()) {
      let canRemove = itemIndex > 0 && itemIndex === this.signatories.value.length - 1
      let removeButton = ""
      if (canRemove) {
        removeButton = `<i class='fa-regular fa-trash-alt remove-button remove-authorised-signatories' />`
      }
      return `
        <tr>
          <td>${itemIndex + 1}.</td>
          <td>
            <input type='text' value='${item?.name ?? ""}' class='form-control signatory-name' id='signatory-name-${itemIndex}' list="signatoryList${itemIndex}">
            ${datalist}
          </td>
          <td>
            <input type='text' value='${item?.identification ?? ""}' class='form-control signatory-id' id='signatory-id-${itemIndex}'>
          </td>
          <td>
            <input type='text' value='${designation}' class='form-control signatory-designation' id='signatory-designation-${itemIndex}' list="signatoryDesignationList${itemIndex}">
            ${designationDatalist}
          </td>
          <td>${removeButton}</td>
        </tr>
      `
    } else {
      return `
        <tr>
          <td>${itemIndex + 1}.</td>
          <td>${item?.name ?? ""}</td>
          <td>${item?.identification ?? ""}</td>
          <td>${designation}</td>
          <td></td>
        </tr>
      `
    }
  }

  getModeOfOperationSelectHtml(): string {
    let selectedType = this.application.value?.metaData?.type ?? ""

    if (!this.isDocumentEditable()) {
      switch (selectedType) {
        case "anyone":
          return "<b>Anyone</b>"
        case "both":
          return "<b>Both</b>"
        case "solely":
          return "<b>Solely</b>"
        default:
          return selectedType || "-"
      }
    }

    return `
      <select class='form-select form-control mode-of-operation-select'>
        <option value='' ${StringUtil.isNullOrEmpty(selectedType) ? "selected" : ""}>-- Select --</option>
        <option value='solely' ${selectedType === "solely" ? "selected" : ""}>Solely</option>
        <option value='both' ${selectedType === "both" ? "selected" : ""}>Both</option>
        <option value='anyone' ${selectedType === "anyone" ? "selected" : ""}>Anyone</option>
      </select>
    `
  }

  getModeOfOperationRow(): string {
    return `
      <tr class='mode-of-operation'>
        <td colspan='5'>
          <b>Mode of Operation:</b><br>
          ${this.getModeOfOperationSelectHtml()} to Authorise
        </td>
      </tr>
    `
  }

  authorisedSignatoryHtml(): string {
    if (this.signatories.value.length <= 0) {
      let newSignatory = new CompanyBankSignatory()
      ;(newSignatory as any).designation = "Director"
      this.signatories.value.push(newSignatory)
    }

    let content = this.signatories.value.map((item: CompanyBankSignatory, index: number) => {
      return this.getSignatoryRowForItem(index)
    })

    let addMoreButton = ""
    if (this.isDocumentEditable()) {
      addMoreButton = '<span class="add-more-signatory action-link">+ Add More</span>'
    }

    return `
      <table class='affin-online-banking'>
        <thead>
          <tr>
            <td>No.</td>
            <td>Authorized Representative Name</td>
            <td>NRIC No.</td>
            <td>Designation</td>
            <td>Specimen Signature</td>
          </tr>
        </thead>
        <tbody>
          ${content.join("")}
          ${this.getModeOfOperationRow()}
        </tbody>
      </table>
      ${addMoreButton}
    `
  }

  handleSignatoryNameSelected(event: Event): void {
    const inputField = event.target as HTMLInputElement
    let inputFieldId = inputField.id
    if (!inputFieldId.includes("signatory-name")) {
      return
    }

    let selectedName = inputField.value
    let index = parseInt(inputFieldId.replace("signatory-name-", ""))

    if (index >= this.signatories.value.length) {
      return
    }
    this.signatories.value[index].name = selectedName

    let identificationFieldId = `signatory-id-${index}`
    let identificationInput = document.getElementById(identificationFieldId)
    let designationFieldId = `signatory-designation-${index}`
    let designationInput = document.getElementById(designationFieldId)

    if (!identificationInput) {
      this.signatories.value[index].identification = ""
      return
    }

    let identificationInputField = identificationInput as HTMLInputElement
    let designationInputField = designationInput as HTMLInputElement | null

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
    this.signatories.value[index].identification = selectedDirector.detail?.identification ?? "-"
    this.signatories.value[index].type = selectedDirector.detail?.identificationType ?? "nric"

    // Auto-set designation to "Director" when a director is selected
    if (designationInputField) {
      designationInputField.value = "Director"
    }
    ;(this.signatories.value[index] as any).designation = "Director"

    nextTick(() => {
      this.setContent()
    })
  }

  handleSignatoryDesignationChanged(event: Event): void {
    const inputField = event.target as HTMLInputElement
    let inputFieldId = inputField.id
    if (!inputFieldId.includes("signatory-designation")) {
      return
    }

    let designation = inputField.value
    let index = parseInt(inputFieldId.replace("signatory-designation-", ""))

    if (index >= this.signatories.value.length) {
      return
    }
    ;(this.signatories.value[index] as any).designation = designation
  }

  handleSignatoryIdChanged(event: Event): void {
    const inputField = event.target as HTMLInputElement
    let inputFieldId = inputField.id
    if (!inputFieldId.includes("signatory-id")) {
      return
    }

    let identificationNumber = inputField.value
    let index = parseInt(inputFieldId.replace("signatory-id-", ""))

    if (index >= this.signatories.value.length) {
      return
    }
    this.signatories.value[index].identification = identificationNumber
  }

  addMoreSignatory(): void {
    let newSignatory = new CompanyBankSignatory()
    ;(newSignatory as any).designation = "Director"
    this.signatories.value.push(newSignatory)

    nextTick(() => {
      this.setContent()
    })
  }

  removeSignatory(): void {
    this.signatories.value.pop()

    nextTick(() => {
      this.setContent()
    })
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
    let designationDatalist = this.getDesignationDatalist(itemIndex, "online")
    let designation = item?.designation ?? "Director"

    if (this.isDocumentEditable()) {
      let canRemove = itemIndex > 0 && itemIndex === this.onlineAccessPersons.value.length - 1
      let removeButton = ""
      if (canRemove) {
        removeButton = `<i class='fa-regular fa-trash-alt remove-button remove-online-banking' />`
      }
      return `
        <tr>
          <td>${itemIndex + 1}.</td>
          <td>
            <input type='text' value='${item?.name ?? ""}' class='form-control authorised-persons' id='name-${itemIndex}' list="directorsList${itemIndex}">
            ${datalist}
          </td>
          <td>
            <input type='text' value='${item?.id ?? ""}' class='form-control authorised-person-id' id='id-${itemIndex}'>
          </td>
          <td>
            <input type='text' value='${designation}' class='form-control online-designation' id='online-designation-${itemIndex}' list="onlineDesignationList${itemIndex}">
            ${designationDatalist}
          </td>
          <td>${removeButton}</td>
        </tr>
      `
    } else {
      return `
        <tr>
          <td>${itemIndex + 1}.</td>
          <td>${item?.name ?? ""}</td>
          <td>${item?.id ?? ""}</td>
          <td>${designation}</td>
          <td></td>
        </tr>
      `
    }
  }

  authorisedOnlineBankingHtml(): string {
    if (this.onlineAccessPersons.value.length <= 0) {
      this.onlineAccessPersons.value.push({
        id: "",
        name: "",
        role: "",
        designation: "Director",
      })
    }

    let content = this.onlineAccessPersons.value.map((item: any, index: number) => {
      return this.getRowForItem(index)
    })

    let addMoreButton = ""
    if (this.isDocumentEditable()) {
      addMoreButton = '<span class="add-more action-link">+ Add More</span>'
    }

    return `
      <table class='affin-online-banking'>
        <thead>
          <tr>
            <td>No.</td>
            <td>Authorized Representative Name</td>
            <td>NRIC No.</td>
            <td>Designation</td>
            <td>Specimen Signature</td>
          </tr>
        </thead>
        <tbody>
          ${content.join("")}
          ${this.getModeOfOperationRow()}
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

    let identificationFieldId = `id-${index}`
    let identificationInput = document.getElementById(identificationFieldId)
    let designationFieldId = `online-designation-${index}`
    let designationInput = document.getElementById(designationFieldId)

    if (!identificationInput) {
      this.onlineAccessPersons.value[index].id = ""
      return
    }

    let identificationInputField = identificationInput as HTMLInputElement
    let designationInputField = designationInput as HTMLInputElement | null

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

    // Auto-set designation to "Director" when a director is selected
    if (designationInputField) {
      designationInputField.value = "Director"
    }
    this.onlineAccessPersons.value[index].designation = "Director"

    nextTick(() => {
      this.setContent()
    })
  }

  handleOnlineDesignationChanged(event: Event): void {
    const inputField = event.target as HTMLInputElement
    let inputFieldId = inputField.id
    if (!inputFieldId.includes("online-designation")) {
      return
    }

    let designation = inputField.value
    let index = parseInt(inputFieldId.replace("online-designation-", ""))

    if (index >= this.onlineAccessPersons.value.length) {
      return
    }
    this.onlineAccessPersons.value[index].designation = designation
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
  }

  addMore(): void {
    this.onlineAccessPersons.value.push({
      id: "",
      name: "",
      role: "checker",
      designation: "Director",
    })

    nextTick(() => {
      this.setContent()
    })
  }

  removeOnlineBankingRow(): void {
    this.onlineAccessPersons.value.pop()

    nextTick(() => {
      this.setContent()
    })
  }

  setContent(): void {
    this.resolutionContent.value = this.getContent()
  }

  getContent(): string {
    this.documentTemplate.value.content = this.originalContent.value

    // Replace authorised signatory placeholder with table
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      "$text.&lt;name=authorisedSignatory&gt;$",
      this.authorisedSignatoryHtml()
    )

    //replace act or constitution
    let actOrConstitution = this.company.value.hasConstitution
      ? `Company's Constitution`
      : "the Paragraph 15 of the Third Schedule of the Companies Act 2016."
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      "$text.&lt;name=actOrConstitution&gt;$",
      actOrConstitution
    )

    // Handle textarea placeholders for authorised signatories and online banking
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      "$textarea.&lt;name=authorisedSignatory&gt;$",
      this.authorisedSignatoryHtml()
    )

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

  isDocumentEditable(): boolean {
    return this.application.value.signatureGroups.length <= 0
  }

  async setApplicationId(id: string | null): Promise<void> {
    if (StringUtil.isNullOrEmpty(id)) {
      await this.setApplication()
    } else {
      await this.fetchApplication(id ?? "")
    }
    this.setContent()
  }

  updateApplicationContent(application: CompanyBankAccountOpening): void {
    this.application.value = new CompanyBankAccountOpening(application)
    this.setContent()
  }

  async setSignatureItem(): Promise<void> {
    if (this.directors.value.length <= 0) {
      return
    }

    let user = await CurrentUser.get()
    if (!user) {
      return
    }

    let director = this.directors.value.find((d: Director) => {
      return d.email === user.email
    })

    if (!director) {
      director = this.directors.value[0]
    }

    this.signatureItem.value = new SignatureItem(
      null,
      false,
      director.email === user.email,
      false,
      director.name,
      director.email,
      "Director",
      false
    )
  }

  handleModeOfOperationChanged(event: Event): void {
    const selectField = event.target as HTMLSelectElement
    let selectedValue = selectField.value

    if (!this.application.value.metaData) {
      this.application.value.metaData = {}
    }
    this.application.value.metaData.type = selectedValue

    nextTick(() => {
      this.setContent()
    })
  }

  attachEventListeners(): void {
    if (!this.isDocumentEditable()) {
      return
    }

    const container = document.getElementById("appendix-a-bank-account-opening-affin")
    if (!container) {
      return
    }

    const modeOfOperationSelect = container.querySelectorAll(".mode-of-operation-select")
    modeOfOperationSelect.forEach((select) => {
      (select as HTMLSelectElement).onchange = this.handleModeOfOperationChanged.bind(this)
    })

    const signatoryNameInputs = container.querySelectorAll(".signatory-name")
    signatoryNameInputs.forEach((input) => {
      (input as HTMLInputElement).onchange = this.handleSignatoryNameSelected.bind(this)
    })

    const signatoryIdInputs = container.querySelectorAll(".signatory-id")
    signatoryIdInputs.forEach((input) => {
      (input as HTMLInputElement).onchange = this.handleSignatoryIdChanged.bind(this)
    })

    const signatoryDesignationInputs = container.querySelectorAll(".signatory-designation")
    signatoryDesignationInputs.forEach((input) => {
      (input as HTMLInputElement).onchange = this.handleSignatoryDesignationChanged.bind(this)
    })

    const addMoreSignatoryButtons = container.querySelectorAll(".add-more-signatory")
    addMoreSignatoryButtons.forEach((btn) => {
      (btn as HTMLElement).onclick = this.addMoreSignatory.bind(this)
    })

    const removeSignatoryButtons = container.querySelectorAll(".remove-authorised-signatories")
    removeSignatoryButtons.forEach((btn) => {
      (btn as HTMLElement).onclick = this.removeSignatory.bind(this)
    })

    const nameInputFields = container.querySelectorAll(".authorised-persons")
    nameInputFields.forEach((input) => {
      (input as HTMLInputElement).onchange = this.handleNameSelected.bind(this)
    })

    const idInputFields = container.querySelectorAll(".authorised-person-id")
    idInputFields.forEach((input) => {
      (input as HTMLInputElement).onchange = this.handleIdChanged.bind(this)
    })

    const onlineDesignationInputs = container.querySelectorAll(".online-designation")
    onlineDesignationInputs.forEach((input) => {
      (input as HTMLInputElement).onchange = this.handleOnlineDesignationChanged.bind(this)
    })

    const addMores = container.querySelectorAll(".add-more")
    addMores.forEach((addMore) => {
      (addMore as HTMLElement).onclick = this.addMore.bind(this)
    })

    const removeOnlineBankingButtons = container.querySelectorAll(".remove-online-banking")
    removeOnlineBankingButtons.forEach((removeBtn) => {
      (removeBtn as HTMLElement).onclick = this.removeOnlineBankingRow.bind(this)
    })
  }

  totalPages(): number {
    return 1
  }

  getSignatories(): CompanyBankSignatory[] {
    return this.signatories.value
  }

  getAuthorisedPersonsForOnlineBanking(): any {
    return this.onlineAccessPersons.value
  }
}