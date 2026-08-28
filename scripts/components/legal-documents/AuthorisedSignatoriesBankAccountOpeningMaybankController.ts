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
import { SignatureItem } from "~/scripts/types/SignatureItem"
import { CurrentUser } from "~/scripts/utils/CurrentUser"
import { CompanyBankSignatory } from "~/scripts/models/CompanyBankSignatory"
import { BankBranch } from "~/scripts/models/BankBranch"
import { ObjectUtil } from "~/scripts/utils/Object"
import type { SignatureGroup } from "~/scripts/models/SignatureGroup"
import { StatusConstants } from "~/scripts/constants/Status"
import type { State } from "~/scripts/models/Location"
import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"

export class AuthorisedSignatoriesBankAccountOpeningMaybankController extends SdnBhdLegalDocumentController {
  companyBankAccountOpeningRepository = useCompanyBankAccountOpeningStore()
  documentTemplateRepository = useDocumentTemplateStore()
  bankRepository = useBankStore()
  directorRepository = useDirectorStore()

  directors = ref<Director[]>([])
  directorDetails = ref<string[]>([])
  signatories = ref<CompanyBankSignatory[]>([])
  signatureItem = ref<SignatureItem>(new SignatureItem("", false, false, false, "", "", "", false))

  documentTemplate = ref<DocumentTemplate>(new DocumentTemplate())
  resolutionContent = ref<string>("")
  originalContent = ref<string>("")
  application = ref<CompanyBankAccountOpening>(new CompanyBankAccountOpening())

  approvedResolutionDate: Ref<string> = ref<string>("")

  private documentTemplateId: string = "56fa748b-5ad1-4dee-be17-69cccef8a204"
  private bankId: string = "f112c274-f545-4596-830b-50e337aa9ed4"

  bank = ref<Bank>(new Bank())
  bankBranches = ref<BankBranch[]>([])

  bankBranchSearchText = ref<string>("")
  showBranchOption = ref<boolean>(false)

  isLoading: Ref<boolean> = ref<boolean>(false)
  isPrinting: Ref<boolean> = ref<boolean>(false)

  time = useLocalTime()
  language = useLanguage()

  emitEvents: any | null = null

  constructor(companyId: string, applicationId: string | null, isInPreviewMode: boolean, emitEvents: any | null) {
    super("AuthorisedSignatoriesBankAccountOpeningMaybank", companyId, PaperOrientation.Portrait)
    this.isInPreviewMode.value = isInPreviewMode
    this.emitEvents = emitEvents

    this.initializeDocument(applicationId, companyId)
  }

  async initializeDocument(applicationId: string | null, companyId: string): Promise<void> {
    this.isLoading.value = true

    await Promise.all([
      this.initializeApplication(applicationId, companyId),
      this.fetchDocumentTemplate(),
      this.fetchBank(),
      this.fetchDirectors(),
    ])

    this.setSignatureItem()

    this.setContent()

    this.isLoading.value = false
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

        this.bankBranches.value = this.bank.value.branches.map((b: BankBranch) => {
          return new BankBranch(b)
        })

        this.bankBranches.value = ObjectUtil.sort<BankBranch>(this.bankBranches.value, "stateId", "asc")
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
    } catch (e) {
      console.error("Failed to fetch directors:", e)
    }
  }

  async fetchApplication(id: string): Promise<void> {
    let response = await this.companyBankAccountOpeningRepository.fetch(id)
    if (!this.companyBankAccountOpeningRepository.error && response !== null) {
      this.application.value = new CompanyBankAccountOpening(response)
      this.signatories.value = this.application.value.signatories.map((d: any) => {
        return new CompanyBankSignatory(d)
      })
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
        let errorMessage: Error = new Error()
        errorMessage.setForFetch()
        errorMessage.handle()
      }
    }
  }

  getHiddenCheckbox(value: string): string {
    let selectedType = this.application.value.signatoryType ?? "anyone"
    if (StringUtil.isNullOrEmpty(selectedType)) {
      selectedType = "anyone"
    }

    let strikedThrough = value !== selectedType ? "strikedthrough" : ""
    return `<span class='hidden-check-box ${strikedThrough}' id='${value}'><b>${value.toUpperCase()}</b></span>`
  }

  getBankBranchSelect(): string {
    if (this.isInPreviewMode.value) {
      return `<span class='value-placeholder'>YOUR SELECTED BRANCH</span>`
    }

    if (!this.isDocumentEditable()) {
      return this.application.value.bankBranch.name
    }

    if (this.bankBranches.value.length <= 0) {
      return ""
    }

    let content: string[] = []

    let states = this.bankBranches.value.map((b: BankBranch) => {
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

  getSignatoryList(): string {
    let signatoryRows = []
    if (!this.isDocumentEditable() || this.isInPreviewMode.value) {
      if (this.application.value.signatories.length <= 0) {
        signatoryRows = this.directors.value.map((d: Director, index: number) => {
          let idType = d.identificationType === "passport" ? "Passport" : "NRIC"
          return `
            <tr>
              <td>${index + 1}</td>
              <td>${d.name}</td>
              <td>(${idType}) No.: ${d.identification}</td>
            </tr>
          `
        })
      } else {
        signatoryRows = this.application.value.signatories.map((d: CompanyBankSignatory, index: number) => {
          return `
            <tr>
              <td>${index + 1}</td>
              <td>${d.name}</td>
              <td>(${d.type}) No.: ${d.identification}</td>
            </tr>
          `
        })
      }
    } else {
      signatoryRows = this.directors.value.map((director: Director, index: number) => {
        let selected = this.signatories.value.some((d: CompanyBankSignatory) => {
          return (
            d.name === director.name &&
            d.identification === director.identification &&
            d.type === director.identificationType
          )
        })
        let checked = selected ? "checked" : ""

        let inputField = `
        <input type='checkbox' 
          class='form-control in-resolution signatory-check' 
          id='signatory-${index}' 
          value='${director.identification}' ${checked}>
      `

        let idType = director.identificationType === "passport" ? "Passport" : "NRIC"
        return `
          <tr>
            <td>${inputField}</td>
            <td>${director.name}</td>
            <td>(${idType}) No.: ${director.identification}</td>
          </tr>
        `
      })
    }

    let table = `<table class='no-border director-details'>${signatoryRows.join("")}</table>`

    return table
  }

  getApprovedResolutionDate(): string {
    if (this.isDocumentEditable()) {
      return `<input type='date' class='form-control in-resolution approved-resolution' value='${this.approvedResolutionDate.value}' >`
    }

    let time = useLocalTime()

    return time.formatDateOnlyFull(this.approvedResolutionDate.value)
  }

  setContent(): void {
    this.resolutionContent.value = this.getContent()
  }

  getContent(): string {
    this.documentTemplate.value.content = this.originalContent.value
    let stringToReplace = "$text.&lt;name=authorisedSignatory&gt;$"
    let stringReplacement = this.getSignatoryList()
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      stringToReplace,
      stringReplacement
    )

    //replace act or constitution
    let actOrConstitution = this.company.value.hasConstitution
      ? `Company's Constitution`
      : "the Paragraph 15 of the Third Schedule of the Companies Act 2016"
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      "$text.&lt;name=actOrConstitution&gt;$",
      actOrConstitution
    )

    let dayjs = useDayjs()
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      "$date.&lt;name=documentDate&gt;$",
      this.time.formatDateOnlyFull(dayjs().format("YYYY-MM-DD"))
    )

    let resolutionDateSearchString = "[To Be Determined By iCompany]"
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      resolutionDateSearchString,
      this.getApprovedResolutionDate()
    )

    //replace hidden checkboxes
    let values = ["solely", "all", "both", "anyone"]
    if (this.isDocumentEditable()) {
      values.forEach((value: string) => {
        let stringToReplace = `$hiddenCheckBox.&lt;name=${value}&gt;$<strong>${value.toUpperCase()}</strong>`
        let stringReplacement = this.getHiddenCheckbox(value)
        this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
          stringToReplace,
          stringReplacement
        )
      })

      let accountTypes = ["currentAccount", "masterForeignCurrency", "fixedDeposit"]
      accountTypes.forEach((value: string) => {
        let stringToReplace = `$inlineCheckbox.&lt;name=${value}&gt;$`
        let stringReplacement = `□`
        this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
          stringToReplace,
          stringReplacement
        )
      })
    } else {
      let signatoryType = this.application.value?.signatoryType ?? "anyone"
      let signatoryTypeString = values
        .map((value: string) => {
          return `$hiddenCheckBox.&lt;name=${value}&gt;$<strong>${value.toUpperCase()}</strong>`
        })
        .join("/")
      this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
        signatoryTypeString,
        `<strong>${signatoryType.toUpperCase()}</strong>`
      )
    }

    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      "$text.&lt;name=bankBranchId&gt;$",
      this.getBankBranchSelect()
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
    return !this.isPrinting.value //this.application.value.status === StatusConstants.PAID
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

    let signatureFile =
      this.application.value.signatureGroups.find((sg: SignatureGroup) => {
        return sg.email === user.email
      })?.signature ?? null

    let isSignatureEditable = signatureFile === null && !this.isInPreviewMode.value && director.email === user.email

    this.signatureItem.value = new SignatureItem(
      signatureFile?.url ?? null,
      signatureFile !== null,
      isSignatureEditable,
      false,
      director.name,
      director.email,
      "Director",
      false
    )
  }

  handleApprovedResolutionDate(event: Event): void {
    //approved-resolution
    let target = event.target as HTMLInputElement
    this.approvedResolutionDate.value = target.value
  }

  handleCheckBoxClicked(event: Event): void {
    let inputTarget = event.target as HTMLInputElement
    let value = inputTarget.value
    let selected = this.signatories.value.some((d: CompanyBankSignatory) => {
      return d.identification === value
    })

    if (selected) {
      this.signatories.value = this.signatories.value.filter((d: CompanyBankSignatory) => {
        return d.identification !== value
      })
    } else {
      let directorToSelect = this.directors.value.find((d: Director) => {
        return d.identification === value
      })

      if (!directorToSelect) {
        return
      }

      let newSignatory = new CompanyBankSignatory()
      newSignatory.name = directorToSelect.name
      newSignatory.type = directorToSelect.identificationType
      newSignatory.identification = directorToSelect.identification
      newSignatory.role = "checker" // check if this is correct
      this.signatories.value.push(newSignatory)
    }

    this.emitEvents("updated")
  }

  handleSelectTypeSignatory(event: Event): void {
    let target = event.target as HTMLSpanElement
    let value = (target.parentNode as HTMLSpanElement).id

    this.application.value.signatoryType = value

    nextTick(() => {
      this.setContent()
    })

    this.emitEvents("updated")
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
    let target = event.target as HTMLSpanElement
    let value = target.id

    let selectedBranch = this.bankBranches.value.find((b: BankBranch) => {
      return b.id === value
    })

    if (!selectedBranch) {
      return
    }

    this.application.value.bankBranchId = value
    this.application.value.bankBranch = selectedBranch

    this.showBranchOption.value = false
    nextTick(() => {
      this.setContent()
    })

    this.emitEvents("updated")
  }

  attachEventListeners(): void {
    if (!this.isDocumentEditable()) {
      return
    }

    const checkboxes = document.querySelectorAll(".signatory-check")
    checkboxes.forEach((box) => {
      box.removeEventListener("click", this.handleCheckBoxClicked.bind(this))
      box.addEventListener("click", this.handleCheckBoxClicked.bind(this))
    })

    const signatoryTypes = document.querySelectorAll(".hidden-check-box")
    signatoryTypes.forEach((signatoryType) => {
      signatoryType.removeEventListener("click", this.handleSelectTypeSignatory.bind(this))
      signatoryType.addEventListener("click", this.handleSelectTypeSignatory.bind(this))
    })

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

    const approvedDates = document.querySelectorAll(".approved-resolution")
    approvedDates.forEach((el) => {
      el.removeEventListener("change", this.handleApprovedResolutionDate.bind(this))
      el.addEventListener("change", this.handleApprovedResolutionDate.bind(this))
    })
  }

  totalPages(): number {
    return 1
  }

  updateApplicationData(applicationData: CompanyBankAccountOpening): void {
    let isSame = ObjectUtil.isEqual<CompanyBankAccountOpening>(
      this.application.value as CompanyBankAccountOpening,
      applicationData
    )

    if (isSame) {
      return
    }

    this.application.value = new CompanyBankAccountOpening(applicationData)
    this.signatories.value = this.application.value.signatories.map((d: any) => {
      return new CompanyBankSignatory(d)
    })
    this.setContent()
  }

  getBranchId(): string {
    return this.application.value.bankBranchId
  }

  getSignatories(): CompanyBankSignatory[] {
    return this.signatories.value
  }

  getSignatoryType(): string {
    return this.application.value.signatoryType ?? ""
  }

  loaderLabel(): string {
    return "Preparing"
  }

  loaderSublabel(): string {
    return "Authorised Signatories for Account"
  }

  override async getPdfPages(): Promise<HTMLElement[]> {
    if (!this.documentRef) {
      return []
    }

    this.isPrinting.value = true
    this.setContent()
    await nextTick()

    let pages = await PdfPaperUtil.getPdfElements(this.documentRef)

    setTimeout(() => {
      this.isPrinting.value = false
      this.setContent()
    }, 1000)

    return pages
  }
}
