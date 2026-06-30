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
import _ from "lodash"
import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { OnlineBanking } from "~/scripts/types/banks/OnlineBanking"
import { CompanyBankSignatory } from "~/scripts/models/CompanyBankSignatory"
import { PropsResolution } from "~/scripts/props/PropsResolution"
import type { SignatureItem } from "~/scripts/types/SignatureItem"
import { ObjectUtil } from "~/scripts/utils/Object"
import type { State } from "~/scripts/models/Location"

export class DcrBankAccountOpeningController extends ResolutionController<CompanyBankAccountOpening> {
  companyBankAccountOpeningRepository = useCompanyBankAccountOpeningStore()
  companyRepository = useCompanyStore()
  documentTemplateRepository = useDocumentTemplateStore()
  bankRepository = useBankStore()

  directors = ref<Director[]>([])

  documentTemplate = ref<DocumentTemplate>(new DocumentTemplate())

  resolutionContent = ref<string>("")

  originalTemplateContent: string = ""

  bankBranchSearchText = ref<string>("")
  showBranchOption = ref<boolean>(false)

  private documentTemplateId: string = "c1b4d3b4-2457-41af-af90-81999355fd4d"

  bankId = ref<string>("")
  bank = ref<Bank>(new Bank())

  // Editable fields
  selectedBranchId = ref<string>("")
  signatoryType = ref<string>("anyone") // "normal" | "anyone" | "all"
  signatories = ref<CompanyBankSignatory[]>([])
  selectedSignatoryIds = ref<string[]>([])
  onlineAccessPersons = ref<OnlineBanking[]>([])

  time = useLocalTime()
  language = useLanguage()

  constructor(props: IPropsResolutionDocument<CompanyBankAccountOpening>, emitEvents: any | null, bankId: string = "") {
    super(
      props.companyId,
      props.applicationId,
      props.application,
      CompanyBankAccountOpening,
      props.isInPreviewMode,
      true,
      false,
      props.showWatermark,
      props.watermarkText,
      emitEvents
    )
    this.bankId.value = props.bankId ?? ""
  }

  async setBankId(bankId: string): Promise<void> {
    this.bankId.value = bankId
    await this.fetchBank()
  }

  async setApplicationId(id: string | null): Promise<void> {
    if (StringUtil.isNullOrEmpty(id)) {
      await this.setApplication()
      return
    } else {
      await this.fetchApplication(id ?? "")
    }
  }

  async otherDataInitiation(): Promise<void> {
    await Promise.all([this.fetchBank(), this.fetchDirectors()])
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
      }
    } catch (e) {
      console.error("Failed to fetch bank:", e)
    }
  }

  async fetchDirectors(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId.value)) {
      return
    }

    let response = await this.directorRepository.fetchAllForCompany(this.companyId.value)
    this.directors.value = response.map((d: any) => {
      return new Director(d)
    })
  }

  async fetchApplication(id: string): Promise<void> {
    let response = await this.companyBankAccountOpeningRepository.fetch(id)
    if (!this.companyBankAccountOpeningRepository.error && response !== null) {
      this.application.value = new CompanyBankAccountOpening(response)
      this.syncFromApplication()
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
      // Set bank on application if already fetched
      if (this.bank.value?.id) {
        this.application.value.bank = this.bank.value
      }
    }

    this.syncFromApplication()
  }

  syncFromApplication(): void {
    if (!this.application.value) {
      return
    }

    this.bankId.value = this.application.value.bankId
    this.selectedBranchId.value = this.application.value.bankBranchId

    this.signatoryType.value = this.application.value.signatoryType || "anyone"
    this.selectedSignatoryIds.value = this.application.value.signatories.map((s: CompanyBankSignatory) => {
      return s.id
    })
    this.signatories.value = this.application.value.signatories.map((s: CompanyBankSignatory) => {
      return new CompanyBankSignatory(s)
    })

    this.onlineAccessPersons.value = this.application.value.onlineBanking.map((s: any) => {
      return new OnlineBanking(s)
    })
  }

  syncToApplication(): void {
    if (!this.application.value) {
      return
    }

    // Sync bank
    if (this.bank.value?.id) {
      this.application.value.bank = this.bank.value
    }

    this.application.value.bankBranchId = this.selectedBranchId.value
    const selectedBranch = this.bank.value.branches.find((b) => b.id === this.selectedBranchId.value)
    if (selectedBranch) {
      this.application.value.bankBranch = new BankBranch(selectedBranch)
    }

    this.application.value.signatories = this.getSelectedSignatories().map((s) => {
      return new CompanyBankSignatory(s)
    })

    this.application.value.onlineBanking = this.onlineAccessPersons.value.map((p) => {
      return new OnlineBanking({
        id: p.id,
        name: p.name,
        identification: p.id,
        role: p.role,
      })
    })

    this.emitEvents("updated")
  }

  async fetchDocumentTemplate(): Promise<void> {
    try {
      let response = await this.documentTemplateRepository.fetch(this.documentTemplateId)
      if (this.documentTemplateRepository.error) {
        throw this.documentTemplateRepository.error
      }

      this.documentTemplate.value = new DocumentTemplate(response)
      this.originalTemplateContent = this.documentTemplate.value.content

      this.maxSignatureOnFirstPage.value = this.documentTemplate.value.maxNumberOfSignatureOnFirstPage ?? 4
      this.maxSignatureOnOtherPages.value = this.documentTemplate.value.numberOfSignaturePerPage ?? 6
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

  setContent(): void {
    this.resolutionContent.value = this.getContent()
  }

  getContent(): string {
    this.documentTemplate.value.content = this.originalTemplateContent
    this.documentTemplate.value.content = this.processCustomPlaceholders(this.documentTemplate.value.content)
    let templateProcessor = new TemplateProcessor(this.documentTemplate.value)

    let template = null

    if (this.isInPreviewMode.value) {
      template = templateProcessor.getContentForPreview(this.application.value)
    } else {
      template = this.isDocumentEditable()
        ? templateProcessor.getContent(this.application.value, this.isInPreviewMode.value)
        : templateProcessor.getContentForPrint(this.application.value)
    }

    return template
  }

  processCustomPlaceholders(content: string): string {
    if (!content) {
      return content
    }

    // Replace bank select
    content = content.replace("$text.&lt;name=bankName&gt;$", this.getBankName())

    // Replace bank branch select
    content = content.replace("$text.&lt;name=bankBranchName&gt;$", this.generateBranchSelectHtml())

    // Replace signatory select
    content = content.replace("$text.&lt;name=signatoryType&gt;$", this.generateSignatorySelectHtml())

    // Replace online access select
    content = content.replace("$text.&lt;name=onlineAccess&gt;$", this.generateOnlineAccessSelectHtml())

    return content
  }

  getBankName(): string {
    return this.bank.value?.name || ""
  }

  generateBranchSelectHtml(): string {
    if (this.isInPreviewMode.value || !this.application.value) {
      return `<span class='value-placeholder'>YOUR SELECTED BRANCH</span>`
    }

    if (!this.isDocumentEditable()) {
      return this.application.value.bankBranch.name
    }

    let branches = this.getBranches()

    if (branches.length <= 0) {
      return ""
    }

    let content: string[] = []

    let states = branches.map((b: BankBranch) => {
      return b.state
    })
    let uniqueStates = new Set(states)
    let orderedStates = ObjectUtil.sort<State>(Array.from(uniqueStates), "name", "asc")

    let stateIds = new Set(
      orderedStates.map((d: State) => {
        return d.id
      })
    )

    stateIds.forEach((stateId: number) => {
      let branchesInState = branches.filter((b: BankBranch) => {
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

    let selectedValue = StringUtil.isNullOrEmpty(this.application.value.bankBranchId)
      ? "YOUR SELECTED BRANCH"
      : this.application.value.bankBranch.name

    let placeholderClass = StringUtil.isNullOrEmpty(this.application.value.bankBranchId) ? "value-placeholder" : ""

    let showClass = this.showBranchOption.value ? "show" : ""
    let visibleClass = this.showBranchOption.value ? "dropdown-visible" : ""

    return `
      <div class='searchable-dropdown branch-select ${visibleClass}'>
        <div class='selected-value dropdown'>
          <span class='selected-value-name ${placeholderClass}'>${selectedValue}</span>
          <i class='fa-solid fa-caret-down ${this.showBranchOption.value ? "rotate" : ""}'></i>
        </div>
        <div class='dropdown-menu ${showClass}'>
          <input type='text' class='form-control search-field' value='${this.bankBranchSearchText.value}'>
          ${content.join("")}
        </div>
      </div>
    `
  }

  generateSignatorySelectHtml(): string {
    if (!this.isDocumentEditable()) {
      return this.getSignatoriesDisplayText()
    }

    const disabled = this.isInPreviewMode.value ? "disabled" : ""
    const anyoneChecked = this.signatoryType.value === "anyone" ? "checked" : ""
    const allChecked = this.signatoryType.value === "all" ? "checked" : ""
    const normalChecked = this.signatoryType.value === "normal" ? "checked" : ""

    let directorCheckboxes = ""
    this.directors.value.forEach((director) => {
      const checked = this.isSignatorySelected(director.id) ? "checked" : ""
      const isBoxDisabled = this.isInPreviewMode.value || allChecked
      const boxDisabled = isBoxDisabled ? "disabled" : ""
      directorCheckboxes += `
        <label class="checkbox-option">
          <input type="checkbox" class="signatory-checkbox" data-field-name="signatoryType" data-director-id="${director.id}" ${checked} ${boxDisabled}>
          ${director.name}
        </label>`
    })

    let signatoryOptions = `
    <div id="director-checkboxes" class="director-checkboxes">
      ${directorCheckboxes}
    </div>
    `

    let fields = `<div class="editable-field signatory-selection" data-field-name="signatoryType">
      <div class="signatory-options">
        <label class="radio-option">
          <input type="radio" name="signatoryType" value="anyone" class="signatory-type-radio" ${anyoneChecked} ${disabled}>
          Any Director
        </label>
    `

    if (anyoneChecked) {
      fields = `${fields} ${signatoryOptions}`
    }

    fields = `${fields}
        <label class="radio-option">
          <input type="radio" name="signatoryType" value="all" class="signatory-type-radio" ${allChecked} ${disabled}>
          All Directors
        </label>
    `

    if (allChecked) {
      fields = `${fields} ${signatoryOptions}`
    }

    fields = `${fields}
        <label class="radio-option">
          <input type="radio" name="signatoryType" value="normal" class="signatory-type-radio" ${normalChecked} ${disabled}>
          Select Director(s)
        </label>
        `

    if (normalChecked) {
      fields = `${fields} ${signatoryOptions}`
    }

    fields = `${fields}
        </div>
      </div>`

    return fields
  }

  generateOnlineAccessSelectHtml(): string {
    if (!this.isDocumentEditable()) {
      return this.getOnlineAccessDisplayText()
    }

    const disabled = this.isInPreviewMode.value ? "disabled" : ""
    let rows = ""

    this.directors.value.forEach((director) => {
      const isSelected = this.isOnlineAccessSelected(director.id)
      const checked = isSelected ? "checked" : ""
      const role = this.getOnlineAccessRole(director.id)
      const checkerSelected = role === "checker" ? "selected" : ""
      const makerSelected = role === "maker" ? "selected" : ""

      const roleSelect = isSelected
        ? `<select class="form-select form-select-sm role-select online-access-role" data-field-name="onlineAccess" data-director-id="${director.id}" ${disabled}>
            <option value="checker" ${checkerSelected}>Checker</option>
            <option value="maker" ${makerSelected}>Maker</option>
          </select>`
        : ""

      rows += `
        <div class="online-access-row">
          <label class="checkbox-option">
            <input type="checkbox" class="online-access-checkbox" data-field-name="onlineAccess" data-director-id="${director.id}" ${checked} ${disabled}>
            ${director.name}
          </label>
          ${roleSelect}
        </div>`
    })

    return `<span class="editable-field online-access-selection" data-field-name="onlineAccess">
      <div class="director-checkboxes">
        ${rows}
      </div>
    </span>`
  }

  attachEventListeners(): void {
    if (!this.isDocumentEditable()) {
      return
    }

    // Branch select
    const branchSelect = document.querySelectorAll(".dropdown")
    branchSelect.forEach((bs) => {
      bs.removeEventListener("click", this.handlebranchSelectClick.bind(this))
      bs.addEventListener("click", this.handlebranchSelectClick.bind(this))
    })

    const branchesToSelect = document.querySelectorAll(".branch-to-select")
    branchesToSelect.forEach((branchToSelect) => {
      branchToSelect.removeEventListener("click", this.handleBranchSelect.bind(this))
      branchToSelect.addEventListener("click", this.handleBranchSelect.bind(this))
    })

    const searchField = document.querySelectorAll(".search-field")
    searchField.forEach((sf) => {
      sf.removeEventListener("change", this.handleSearchSelect.bind(this))
      sf.addEventListener("change", this.handleSearchSelect.bind(this))
    })

    // Signatory type radios
    const signatoryRadios = document.querySelectorAll(".signatory-type-radio")
    signatoryRadios.forEach((radio) => {
      radio.removeEventListener("change", this.handleSignatoryRadioChange)
      radio.addEventListener("change", this.handleSignatoryRadioChange)
    })

    // Signatory checkboxes
    const signatoryCheckboxes = document.querySelectorAll(".signatory-checkbox")
    signatoryCheckboxes.forEach((checkbox) => {
      checkbox.removeEventListener("change", this.handleSignatoryCheckboxChange)
      checkbox.addEventListener("change", this.handleSignatoryCheckboxChange)
    })

    // Online access checkboxes
    const onlineAccessCheckboxes = document.querySelectorAll(".online-access-checkbox")
    onlineAccessCheckboxes.forEach((checkbox) => {
      checkbox.removeEventListener("change", this.handleOnlineAccessCheckboxChange)
      checkbox.addEventListener("change", this.handleOnlineAccessCheckboxChange)
    })

    // Online access role selects
    const roleSelects = document.querySelectorAll(".online-access-role")
    roleSelects.forEach((select) => {
      select.removeEventListener("change", this.handleOnlineAccessRoleSelect)
      select.addEventListener("change", this.handleOnlineAccessRoleSelect)
    })
  }

  handlebranchSelectClick(event: Event): void {
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
    if (!this.application.value) {
      return
    }

    let target = event.target as HTMLSpanElement
    let value = target.id

    let selectedBranch = this.getBranches().find((b: BankBranch) => {
      return b.id === value
    })

    if (!selectedBranch) {
      return
    }

    this.selectedBranchId.value = value
    this.application.value.bankBranchId = value
    this.application.value.bankBranch = selectedBranch

    this.showBranchOption.value = false
    this.syncToApplication()

    nextTick(() => {
      this.setContent()
    })

    this.emitEvents("updated")
  }

  handleBranchSelectChange = (event: Event): void => {
    const select = event.target as HTMLSelectElement
    this.selectedBranchId.value = select.value
    this.syncToApplication()

    this.emitEvents("updated")
  }

  handleSignatoryRadioChange = (event: Event): void => {
    const radio = event.target as HTMLInputElement
    this.signatoryType.value = radio.value
    if (radio.value === "all") {
      this.selectedSignatoryIds.value = this.directors.value.map((d: Director) => {
        return d.id
      })
    }
    this.syncToApplication()
    this.setContent()

    this.emitEvents("updated")
  }

  handleSignatoryCheckboxChange = (event: Event): void => {
    const checkbox = event.target as HTMLInputElement
    const directorId = checkbox.dataset.directorId || ""
    if (checkbox.checked) {
      if (!this.selectedSignatoryIds.value.includes(directorId)) {
        this.selectedSignatoryIds.value.push(directorId)
      }
    } else {
      this.selectedSignatoryIds.value = this.selectedSignatoryIds.value.filter((id) => id !== directorId)
    }
    this.syncToApplication()

    this.emitEvents("updated")
  }

  handleOnlineAccessCheckboxChange = (event: Event): void => {
    const checkbox = event.target as HTMLInputElement
    const directorId = checkbox.dataset.directorId || ""
    if (checkbox.checked) {
      const director = this.getDirectors().find((d) => d.id === directorId)
      if (director && !this.onlineAccessPersons.value.find((p) => p.id === directorId)) {
        this.onlineAccessPersons.value.push(
          new OnlineBanking({
            id: director.id,
            name: director.name,
            role: "checker",
          })
        )
      }
    } else {
      this.onlineAccessPersons.value = this.onlineAccessPersons.value.filter((p) => p.id !== directorId)
    }
    this.syncToApplication()
    this.setContent()
    this.emitEvents("updated")
  }

  handleOnlineAccessRoleSelect = (event: Event): void => {
    const select = event.target as HTMLSelectElement
    const directorId = select.dataset.directorId || ""
    const person = this.onlineAccessPersons.value.find((p) => p.id === directorId)
    if (person) {
      person.role = select.value
    }
    this.syncToApplication()

    this.emitEvents("updated")
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

  // Branch methods
  getBranches(): BankBranch[] {
    return this.bank.value.branches || []
  }

  getSelectedBranchName(): string {
    const branch = this.getBranches().find((b) => b.id === this.selectedBranchId.value)
    return branch?.name || ""
  }

  handleBranchChanged(branchId: string): void {
    this.selectedBranchId.value = branchId
    this.syncToApplication()
    this.setContent()
  }

  // Signatory methods
  getDirectors(): Director[] {
    return this.directorRepository.directors || []
  }

  getSelectedSignatories(): CompanyBankSignatory[] {
    return this.selectedSignatoryIds.value
      .map((id: string) => {
        const director = this.directors.value.find((d: Director) => {
          return d.id === id
        })

        if (!director) {
          return null
        }

        return new CompanyBankSignatory({
          id: director.id,
          name: director.name,
          role: "Director",
          type: director.identificationType,
          identification: director.identification,
        })
      })
      .filter((s) => s !== null) as CompanyBankSignatory[]
  }

  getSignatoriesDisplayText(): string {
    switch (this.signatoryType.value) {
      case "anyone":
        return this.language.isMalay() ? "Mana-mana Pengarah" : "Any Director"
      case "all":
        return this.language.isMalay() ? "Semua Pengarah" : "All Directors"
      case "normal":
        const selected = this.getSelectedSignatories()
        if (selected.length === 0) {
          return this.language.isMalay() ? "Tiada dipilih" : "None selected"
        }
        return selected.map((s) => s.name).join(", ")
      default:
        return ""
    }
  }

  handleSignatoryTypeChanged(type: string): void {
    this.signatoryType.value = type
    if (type !== "normal") {
      this.selectedSignatoryIds.value = []
    }
    this.syncToApplication()
    this.setContent()

    this.emitEvents("updated")
  }

  handleSignatorySelected(directorId: string, isSelected: boolean): void {
    if (isSelected) {
      if (!this.selectedSignatoryIds.value.includes(directorId)) {
        this.selectedSignatoryIds.value.push(directorId)
      }
    } else {
      this.selectedSignatoryIds.value = this.selectedSignatoryIds.value.filter((id) => id !== directorId)
    }
    this.syncToApplication()
    this.setContent()

    this.emitEvents("updated")
  }

  isSignatorySelected(directorId: string): boolean {
    return this.selectedSignatoryIds.value.includes(directorId)
  }

  // Online access methods
  getOnlineAccessDisplayText(): string {
    if (this.onlineAccessPersons.value.length === 0) {
      return this.language.isMalay() ? "Tiada dipilih" : "None selected"
    }
    return this.onlineAccessPersons.value.map((p) => `${p.name} (${_.upperFirst(p.role)})`).join(", ")
  }

  isOnlineAccessSelected(directorId: string): boolean {
    return this.onlineAccessPersons.value.some((p) => p.id === directorId)
  }

  getOnlineAccessRole(directorId: string): string {
    const person = this.onlineAccessPersons.value.find((p) => p.id === directorId)
    return person?.role || "checker"
  }

  authorisedOnlineAccess(): any[] {
    if (!this.application.value || !this.application.value.signatories) {
      return []
    }

    return _.chain(this.application.value.signatories)
      .reduce((data: any[], val: any) => {
        const existingSameIdDifferentRole = _.find(data, (item) => {
          return item?.identification === val?.identification && item?.role !== val?.role
        })

        if (existingSameIdDifferentRole) {
          const index = _.findIndex(data, (item) => {
            return item?.identification === val?.identification && item?.role !== val?.role
          })
          if (index !== -1) {
            data[index].role = "Checker / Maker"
          }
        } else if (
          !_.find(data, (item) => {
            return item?.identification === val?.identification
          })
        ) {
          data.push({ ...val, role: _.upperFirst(val?.role) })
        }
        return data
      }, [])
      .value()
  }

  getBranchId(): string {
    return this.selectedBranchId.value
  }

  getAuthorisedPersonsForOnlineBanking(): OnlineBanking[] {
    return this.onlineAccessPersons.value
  }

  getSignatoryType(): string {
    if (!this.application.value) {
      return ""
    }

    return this.application.value.signatoryType ?? ""
  }

  getSignatories(): CompanyBankSignatory[] {
    if (!this.application.value) {
      return []
    }

    return this.application.value.signatories || []
  }

  get resolutionPropsForBank() {
    // set all signature items to disabled
    this.signatureItems.value.forEach((si: SignatureItem) => {
      si.isSignatureEditable = false
    })

    return new PropsResolution(
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
      this.showWatermark.value, //showWatermark
      this.watermarkText.value, //watermarkText
      [], //contentPages
      this.isUsingTemplate.value, //isUsingTemplate
      this.isLoading.value, //isLoading
      true,
      "Wet Ink Required"
    )
  }
}
