import { CompanyBankAccountOpening } from "~/scripts/models/CompanyBankAccountOpening"
import { ResolutionController } from "./ResolutionController"
import { DocumentTemplate } from "~/scripts/models/DocumentTemplate"
import { StringUtil } from "~/scripts/utils/String"
import { Company } from "~/scripts/models/Company"
import { Bank } from "~/scripts/models/Bank"
import { BankBranch } from "~/scripts/models/BankBranch"
import { Error } from "~/scripts/library/Error"
import { TemplateProcessor } from "~/scripts/library/TemplateProcessor"
import { Director } from "~/scripts/models/Director"
import { User } from "~/scripts/models/User"
import { ObjectUtil } from "~/scripts/utils/Object"
import { CompanyBankSignatory } from "~/scripts/models/CompanyBankSignatory"
import _ from "lodash"
import type { SignatureItem } from "~/scripts/types/SignatureItem"

export class DcrBankAccountOpeningAffinController extends ResolutionController<CompanyBankAccountOpening> {
  companyBankAccountOpeningRepository = useCompanyBankAccountOpeningStore()
  companyRepository = useCompanyStore()
  documentTemplateRepository = useDocumentTemplateStore()
  bankRepository = useBankStore()

  signatureStartOnPage = ref<number>(3)
  maxSignatureOnFirstPage = ref<number>(4)
  maxSignatureOnOtherPages = ref<number>(6)
  documentTemplate = ref<DocumentTemplate>(new DocumentTemplate())

  directors = ref<Director[]>([])
  directorUsers = ref<User[]>([])

  pages = ref<string[]>([])
  resolutionContent = ref<string>("")

  originalTemplateContent: string = ""

  private documentTemplateId: string = "afa90c0e-a36a-45e2-9eb0-010b3da76929"
  private affinBankId: string = "6e7c5542-1d5f-42be-872c-3a8bfe2b4c16"

  bankId = ref<string>("")
  bank = ref<Bank>(new Bank())
  bankBranches = ref<BankBranch[]>([])

  selectedBranchId = ref<string>("")
  selectedBranch = ref<BankBranch>(new BankBranch())

  bankBranchSearchText = ref<string>("")
  showBranchOption = ref<boolean>(false)

  onlineAccessPersons = ref<{ id: string; name: string; role: string }[]>([])
  signatories = ref<CompanyBankSignatory[]>([])

  time = useLocalTime()
  language = useLanguage()

  constructor(
    companyId: string,
    applicationId: string | null,
    application: CompanyBankAccountOpening | null,
    isInPreviewMode: boolean,
    emitEvents: any | null,
    bankId: string = ""
  ) {
    super(companyId, application, CompanyBankAccountOpening, isInPreviewMode, emitEvents)
    this.isDcr.value = true
    this.bankId.value = this.affinBankId

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

  async initializeResolution(applicationId: string | null, companyId: string): Promise<void> {
    await Promise.all([
      this.initializeApplication(applicationId, companyId),
      this.fetchDocumentTemplate(),
      this.fetchBank()
    ])

    this.setContent()
  }

  async fetchBank(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.bankId.value)) {
      return
    }

    try {
      let response = await this.bankRepository.fetch(this.bankId.value)
      if (!this.bankRepository.error && response) {
        this.bank.value = new Bank(response)
        if (this.application.value) {
          this.application.value.bank = this.bank.value
        }

        this.bankBranches.value = this.bank.value.branches.map((b: BankBranch) => {
          return new BankBranch(b)
        })

        this.bankBranches.value = ObjectUtil.sort<BankBranch>(this.bankBranches.value, "stateId", "asc")
      }
    } catch (e) {
      console.error("Failed to fetch bank:", e)
    }
  }

  async fetchApplication(id: string): Promise<void> {
    if (this.companyBankAccountOpeningRepository.isLoading) {
      setTimeout(() => {
        this.fetchApplication(id)
      }, 1000)
      return
    }

    let response = await this.companyBankAccountOpeningRepository.fetch(id)
    if (!this.companyBankAccountOpeningRepository.error && response !== null) {
      this.application.value = new CompanyBankAccountOpening(response)
      this.syncFromApplication()
      this.initializeData()
    }
  }

  syncFromApplication(): void {
    if (!this.application.value) {
      return
    }

    this.bankId.value = this.application.value.bankId
    this.selectedBranchId.value = this.application.value.bankBranchId
    this.selectedBranch.value = new BankBranch(this.application.value.bankBranch)

    if (this.application.value.signatories) {
      this.signatories.value = this.application.value.signatories.map((s: any) => {
        return new CompanyBankSignatory(s)
      })

      this.onlineAccessPersons.value = this.application.value.signatories.map((s: any) => ({
        id: s.id || s.identification,
        name: s.name,
        role: s.role || "checker",
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
      this.application.value.bankId = this.affinBankId
      if (this.bank.value?.id) {
        this.application.value.bank = this.bank.value
      }
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
        let error = new Error(Error.ERROR_TYPE_API, "Failed to fetch resolution template. Please refresh the page.")
        error.handle()
      }
    }
  }

  setContent(): void {
    let splitPages = this.documentTemplate.value.content.split(TemplateProcessor.BREAKPAGE_MARKER)

    this.pages.value = splitPages.map((raw: string) => {
      let p = this.processCustomPlaceholders(raw)
      let mockTemplate = new DocumentTemplate()
      mockTemplate.content = p
      let templateProcessor = new TemplateProcessor(mockTemplate)

      if (this.isInPreviewMode.value) {
        return templateProcessor.getContentForPreview(this.application.value)
      } else {
        return this.isDocumentEditable()
          ? templateProcessor.getContent(this.application.value, this.isInPreviewMode.value)
          : templateProcessor.getContentForPrint(this.application.value)
      }
    })
  }

  getContentPageCount(): number {
    return this.pages.value.length
  }

  processCustomPlaceholders(content: string): string {
    if (!content) {
      return content
    }

    content = content.replace(/%\[([^\]]*)\]%/g, (match, markerText) => {
      if (markerText) {
        return `<span class="fake-marker">${markerText}</span>`
      }
      return `<span class="fake-indent"></span>`
    })

    content = content.replace(
      "$textarea.&lt;name=authorisedSignatory&gt;$",
      this.authorisedSignatoryHtml()
    )

    content = content.replace(
      "$textarea.&lt;name=onlineBanking&gt;$",
      this.authorisedOnlineBankingListHtml()
    )

    content = content.replace(
      "$textarea.&lt;name=systemAdministrator&gt;$",
      this.authorisedOnlineBankingHtml()
    )

    content = content.replace(
      "$text.&lt;name=bankBranchId&gt;$",
      this.bankBranchSelectionHtml()
    )

    content = content.replace(
      "$text.&lt;name=signatoryType&gt;$",
      this.signatoryTypeSelectHtml()
    )

    return content
  }

  signatoryTypeSelectHtml(): string {
    let selectedType = this.application.value?.metaData?.type ?? ""

    if (!this.isDocumentEditable()) {
      switch (selectedType) {
        case "anyone":
          return "Anyone"
        case "both":
          return "Both"
        case "solely":
          return "Solely"
        default:
          return selectedType || "-"
      }
    }

    return `
      <select class='form-select form-control signatory-type-select'>
        <option value='' ${StringUtil.isNullOrEmpty(selectedType) ? "selected" : ""}>-- Select --</option>
        <option value='anyone' ${selectedType === "anyone" ? "selected" : ""}>Anyone</option>
        <option value='both' ${selectedType === "both" ? "selected" : ""}>Both</option>
        <option value='solely' ${selectedType === "solely" ? "selected" : ""}>Solely</option>
      </select>
    `
  }

  handleSignatoryTypeChanged(event: Event): void {
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

  bankBranchSelectionHtml(): string {
    if (!this.isDocumentEditable()) {
      return this.application.value?.bankBranch?.name || "-"
    }

    if (this.bankBranches.value.length <= 0) {
      return ""
    }

    let content: string[] = []

    let stateIds = new Set(
      this.bankBranches.value.map((d: BankBranch) => {
        return d.stateId
      })
    )

    stateIds.forEach((stateId: number) => {
      let branchesInState = this.bankBranches.value.filter((b: BankBranch) => {
        return b.stateId === stateId
      })

      if (branchesInState.length <= 0) {
        return
      }

      branchesInState = ObjectUtil.sort<BankBranch>(branchesInState, "name", "asc")
      let addedNames: string[] = []

      let stateName = branchesInState[0].state.name
      let options = branchesInState
        .map((b: BankBranch) => {
          if (
            !StringUtil.isNullOrEmpty(this.bankBranchSearchText.value) &&
            !StringUtil.contains(b.name, this.bankBranchSearchText.value) &&
            !StringUtil.contains(stateName, this.bankBranchSearchText.value)
          ) {
            return ""
          }

          if (StringUtil.inArray(b.name.trim(), addedNames)) {
            return ""
          }

          addedNames.push(b.name.trim())

          return `
          <span id='${b.id}' class='branch-to-select dropdown-item'>${b.name}</span>
        `
        })
        .filter((s: string) => {
          return !StringUtil.isNullOrEmpty(s)
        })

      options = [...new Set(options)]

      if (options.length <= 0) {
        return
      }

      content.push(`
        <span class='dropdown-divider'>${stateName}</span>
        ${options.join("")}
      `)
    })

    let selectedValue = StringUtil.isNullOrEmpty(this.application.value?.bankBranchId)
      ? "-- Select Branch --"
      : this.application.value?.bankBranch?.name || "-- Select Branch --"

    let showClass = this.showBranchOption.value ? "show" : ""
    let visibleClass = this.showBranchOption.value ? "dropdown-visible" : ""

    return `
      <div class='searchable-dropdown branch-select ${visibleClass}'>
        <div class='selected-value dropdown'>${selectedValue}</div>
        <div class='dropdown-menu ${showClass}'>
          <input type='text' class='form-control search-field' value='${this.bankBranchSearchText.value}'>
          ${content.join("")}
        </div>
      </div>
    `
  }

  handleBranchSelectClick(event: Event): void {
    this.showBranchOption.value = !this.showBranchOption.value

    nextTick(() => {
      this.setContent()
    })
  }

  handleSearchSelect(event: Event): void {
    let target = event.target as HTMLInputElement
    let value = target.value

    this.bankBranchSearchText.value = value

    nextTick(() => {
      this.setContent()
    })
  }

  handleBranchSelect(event: Event): void {
    let target = event.target as HTMLSpanElement
    let value = target.id

    let selectedBranch = this.bankBranches.value.find((b: BankBranch) => {
      return b.id === value
    })
    if (!selectedBranch) {
      return
    }

    this.selectedBranchId.value = value
    this.selectedBranch.value = new BankBranch(selectedBranch)

    if (this.application.value) {
      this.application.value.bankBranchId = value
      this.application.value.bankBranch = new BankBranch(selectedBranch)
    }

    this.showBranchOption.value = false
    nextTick(() => {
      this.setContent()
    })
  }

  datalistForSignatories(itemIndex: number): string {
    let selectedNames = this.signatories.value
      .map((item: CompanyBankSignatory, index: number) => {
        if (index === itemIndex) {
          return ""
        }
        return item.name
      })
      .filter((name: string) => !StringUtil.isNullOrEmpty(name))

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

  getSignatoryRowForItem(itemIndex: number): string {
    let item = this.signatories.value[itemIndex] ?? null
    let datalist = this.datalistForSignatories(itemIndex)

    if (this.isDocumentEditable()) {
      let canRemove = itemIndex > 0 && itemIndex === this.signatories.value.length - 1
      let removeButton = ""
      if (canRemove) {
        removeButton = `<i class='fa-regular fa-trash-alt remove-button remove-authorised-signatories' />`
      }
      return `
        <tr>
          <td>
            <input type='text' value='${item?.name ?? ""}' class='form-control signatory-name' id='signatory-name-${itemIndex}' list="signatoryList${itemIndex}">
            ${datalist}
          </td>
          <td>
            <input type='text' value='${item?.identification ?? ""}' class='form-control signatory-id' id='signatory-id-${itemIndex}'>
            ${removeButton}
          </td>
        </tr>
      `
    } else {
      return `
        <tr>
          <td>${item?.name ?? ""}</td>
          <td>${item?.identification ?? ""}</td>
        </tr>
      `
    }
  }

  authorisedSignatoryHtml(): string {
    if (this.signatories.value.length <= 0) {
      this.signatories.value.push(new CompanyBankSignatory())
    }

    let content = this.signatories.value.map((item: CompanyBankSignatory, index: number) => {
      return this.getSignatoryRowForItem(index)
    })

    let addMoreButton = ""
    if (this.isDocumentEditable()) {
      addMoreButton = '<span class="add-more-signatory action-link">+ Add More</span>'
    }

    return `
      <table class='affin-authorised-signatory-list'>
        <tbody>
          ${content.join("")}
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
    if (!identificationInput) {
      this.signatories.value[index].identification = ""
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
    this.signatories.value[index].identification = selectedDirector.detail?.identification ?? "-"
    this.signatories.value[index].type = selectedDirector.detail?.identificationType ?? "nric"

    nextTick(() => {
      this.setContent()
    })
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
    this.signatories.value.push(new CompanyBankSignatory())

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

  getBankName(): string {
    return this.bank.value?.name || ""
  }

  totalPages(): number {
    if (this.directorRepository.isLoading || this.signatureItems.value.length <= 0) {
      return this.getContentPageCount()
    }

    const contentPageCount = this.getContentPageCount()
    const signaturePages = Math.ceil(
      (this.signatureItems.value.length - this.maxSignatureOnFirstPage.value) / this.maxSignatureOnOtherPages.value
    )

    return contentPageCount + signaturePages
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

    if (this.isDocumentEditable()) {
      let canRemove = itemIndex > 0 && itemIndex === this.onlineAccessPersons.value.length - 1
      let removeButton = ""
      if (canRemove) {
        removeButton = `<i class='fa-regular fa-trash-alt remove-button remove-online-banking' />`
      }
      return `
        <tr>
          <td>
            <input type='text' value='${item?.name ?? ""}' class='form-control authorised-persons' id='name-${itemIndex}' list="directorsList${itemIndex}">
            ${datalist}
          </td>
          <td>
            <input type='text' value='${item?.id ?? ""}' class='form-control authorised-person-id' id='id-${itemIndex}'>
            ${removeButton}
          </td>
        </tr>
      `
    } else {
      return `
        <tr>
          <td>${item?.name ?? ""}</td>
          <td>${item?.id ?? ""}</td>
        </tr>
      `
    }
  }

  getRowForItemWithRole(itemIndex: number): string {
    let item = this.onlineAccessPersons.value[itemIndex] ?? null
    let datalist = this.datalistForDirectors(itemIndex)
    let role = item?.role === "maker" ? "maker" : "checker"

    if (this.isDocumentEditable()) {
      let canRemove = itemIndex > 0 && itemIndex === this.onlineAccessPersons.value.length - 1
      let removeButton = ""
      if (canRemove) {
        removeButton = `<i class='fa-regular fa-trash-alt remove-button remove-online-banking' />`
      }
      return `
        <tr>
          <td>
            <select class='form-select form-control authorised-person-role' id='role-${itemIndex}'>
              <option value='checker' ${role === "checker" ? "selected" : ""}>System Approver</option>
              <option value='maker' ${role === "maker" ? "selected" : ""}>System Administrator</option>
            </select>
          </td>
          <td>
            <input type='text' value='${item?.name ?? ""}' class='form-control authorised-persons' id='name-${itemIndex}' list="directorsList${itemIndex}">
            ${datalist}
          </td>
          <td>
            <input type='text' value='${item?.id ?? ""}' class='form-control authorised-person-id' id='id-${itemIndex}'>
            ${removeButton}
          </td>
        </tr>
      `
    } else {
      let roleDisplay = role === "maker" ? "System Administrator" : "System Approver"
      return `
        <tr>
          <td>${roleDisplay}</td>
          <td>${item?.name ?? ""}</td>
          <td>${item?.id ?? ""}</td>
        </tr>
      `
    }
  }

  authorisedOnlineBankingListHtml(): string {
    if (this.onlineAccessPersons.value.length <= 0) {
      this.onlineAccessPersons.value.push({
        id: "",
        name: "",
        role: "",
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
      <table class='affin-online-banking-list'>
        <tbody>
          ${content.join("")}
        </tbody>
      </table>
      ${addMoreButton}
    `
  }

  authorisedOnlineBankingHtml(): string {
    if (this.onlineAccessPersons.value.length <= 0) {
      this.onlineAccessPersons.value.push({
        id: "",
        name: "",
        role: "",
      })
    }

    let content = this.onlineAccessPersons.value.map((item: any, index: number) => {
      return this.getRowForItemWithRole(index)
    })

    let addMoreButton = ""
    if (this.isDocumentEditable()) {
      addMoreButton = '<span class="add-more action-link">+ Add More</span>'
    }

    return `
      <table class='affin-online-banking'>
        <thead>
          <tr>
            <td>Role</td>
            <td>Full Name (as Per NRIC)</td>
            <td>NRIC No</td>
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
  }

  addMore(): void {
    this.onlineAccessPersons.value.push({
      id: "",
      name: "",
      role: "checker",
    })

    if (this.onlineAccessPersons.value.length > 2) {
      this.signatureStartOnPage.value = 4
      this.maxSignatureOnFirstPage.value = 4
    } else {
      this.signatureStartOnPage.value = 3
      this.maxSignatureOnFirstPage.value = 4
    }

    nextTick(() => {
      this.setContent()
    })
  }

  remove(): void {
    this.onlineAccessPersons.value.pop()

    if (this.onlineAccessPersons.value.length > 2) {
      this.signatureStartOnPage.value = 4
      this.maxSignatureOnFirstPage.value = 4
    } else {
      this.signatureStartOnPage.value = 3
      this.maxSignatureOnFirstPage.value = 4
    }

    nextTick(() => {
      this.setContent()
    })
  }

  attachEventListeners(): void {
    if (!this.isDocumentEditable()) {
      return
    }

    const container = document.getElementById("dcr-bank-account-opening-affin")
    if (!container) {
      return
    }

    const branchSelect = container.querySelectorAll(".branch-select .dropdown")
    branchSelect.forEach((bs) => {
      (bs as HTMLElement).onclick = this.handleBranchSelectClick.bind(this)
    })

    const branchesToSelect = container.querySelectorAll(".branch-to-select")
    branchesToSelect.forEach((branchToSelect) => {
      (branchToSelect as HTMLElement).onclick = this.handleBranchSelect.bind(this)
    })

    const searchField = container.querySelectorAll(".branch-select .search-field")
    searchField.forEach((sf) => {
      (sf as HTMLInputElement).oninput = this.handleSearchSelect.bind(this)
    })

    // Signatory type dropdown
    const signatoryTypeSelect = container.querySelectorAll(".signatory-type-select")
    signatoryTypeSelect.forEach((select) => {
      (select as HTMLSelectElement).onchange = this.handleSignatoryTypeChanged.bind(this)
    })

    // Signatory table event listeners
    const signatoryNameInputs = container.querySelectorAll(".signatory-name")
    signatoryNameInputs.forEach((input) => {
      (input as HTMLInputElement).onchange = this.handleSignatoryNameSelected.bind(this)
    })

    const signatoryIdInputs = container.querySelectorAll(".signatory-id")
    signatoryIdInputs.forEach((input) => {
      (input as HTMLInputElement).onchange = this.handleSignatoryIdChanged.bind(this)
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

    const roleInputFields = container.querySelectorAll(".authorised-person-role")
    roleInputFields.forEach((input) => {
      (input as HTMLSelectElement).onchange = this.handleRoleChanged.bind(this)
    })

    const addMores = container.querySelectorAll(".add-more")
    addMores.forEach((addMore) => {
      (addMore as HTMLElement).onclick = this.addMore.bind(this)
    })

    const removeOnlineBankingButtons = container.querySelectorAll(".remove-online-banking")
    removeOnlineBankingButtons.forEach((btn) => {
      (btn as HTMLElement).onclick = this.remove.bind(this)
    })
  }

  getAuthorisedPersonsForOnlineBanking(): any {
    return this.onlineAccessPersons.value
  }

  getSelectedBranch(): BankBranch {
    return this.selectedBranch.value
  }

  getSignatories(): CompanyBankSignatory[] {
    return this.signatories.value
  }
}