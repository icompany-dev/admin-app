import { CompanyBankAccountOpening } from "~/scripts/models/CompanyBankAccountOpening"
import { ResolutionController } from "./ResolutionController"
import { DocumentTemplate } from "~/scripts/models/DocumentTemplate"
import { StringUtil } from "~/scripts/utils/String"
import { Company } from "~/scripts/models/Company"
import { BankBranch } from "~/scripts/models/BankBranch"
import { Bank } from "~/scripts/models/Bank"
import { Error } from "~/scripts/library/Error"
import { TemplateProcessor } from "~/scripts/library/TemplateProcessor"
import { ObjectUtil } from "~/scripts/utils/Object"
import { Director } from "~/scripts/models/Director"
import { CompanyBankSignatory } from "~/scripts/models/CompanyBankSignatory"
import type { User } from "~/scripts/models/User"
import { OnlineBanking } from "~/scripts/types/banks/OnlineBanking"
import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { PropsResolution } from "~/scripts/props/PropsResolution"
import type { SignatureItem } from "~/scripts/types/SignatureItem"
import type { State } from "~/scripts/models/Location"

export class DcrBankAccountOpeningBankIslamController extends ResolutionController<CompanyBankAccountOpening> {
  companyBankAccountOpeningRepository = useCompanyBankAccountOpeningStore()
  companyRepository = useCompanyStore()
  documentTemplateRepository = useDocumentTemplateStore()
  bankRepository = useBankStore()

  directors = ref<Director[]>([])
  directorUsers = ref<User[]>([])
  signatories = ref<CompanyBankSignatory[]>([])

  documentTemplate = ref<DocumentTemplate>(new DocumentTemplate())
  resolutionContent = ref<string>("")
  originalContent = ref<string>("")

  private documentTemplateId: string = "42c51e54-7c05-4dd6-89d0-fd8019628f56"
  private bankId: string = "7ccda4e9-d883-45bc-be47-6c62ac034065"

  company: Ref<Company> = ref<Company>(new Company())
  bank = ref<Bank>(new Bank())
  bankBranches = ref<BankBranch[]>([])

  bankBranchSearchText = ref<string>("")
  showBranchOption = ref<boolean>(false)

  // Editable fields
  selectedBranchId = ref<string>("")
  onlineAccessPersons: Ref<OnlineBanking[]> = ref<OnlineBanking[]>([])

  time = useLocalTime()

  constructor(props: IPropsResolutionDocument<CompanyBankAccountOpening>, emitEvents: any | null) {
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
  }

  async otherDataInitiation(): Promise<void> {
    await Promise.all([this.fetchCompany(), this.fetchBank(), this.fetchDirectors()])
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
    } catch (e) {
      console.error("Failed to fetch directors:", e)
    }
  }

  async fetchCompany(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId.value)) {
      return
    }

    try {
      let response = await this.companyRepository.fetch(this.companyId.value)
      if (this.companyRepository.error !== null) {
        throw this.companyRepository.error
      }

      this.company.value = new Company(response)
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error: Error = new Error(
          Error.ERROR_TYPE_API,
          "Unable to fetch details of company. Please refresh the page and try again."
        )
        error.handle()
      }
    }
  }

  async fetchBank(): Promise<void> {
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

  async fetchApplication(id: string): Promise<void> {
    let response = await this.companyBankAccountOpeningRepository.fetch(id)
    if (!this.companyBankAccountOpeningRepository.error && response !== null) {
      this.application.value = new CompanyBankAccountOpening(response)
      let companyRepository = useCompanyStore()
      let companyResponse = await companyRepository.fetch(this.application.value.companyId)
      this.application.value.company = new Company(companyResponse)
      this.selectedBranchId.value = this.application.value.bankBranchId

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
      this.application.value.bankId = this.bankId
      // Set bank on application if already fetched
      if (this.bank.value?.id) {
        this.application.value.bank = this.bank.value
      }
      this.initializeData()
    }
  }

  updateMaxSignatureOnFirstPage(): void {
    this.maxSignatureOnFirstPage.value = 2

    const totalRows = this.signatories.value.length + this.onlineAccessPersons.value.length
    if (totalRows >= 4) {
      this.maxSignatureOnFirstPage.value = 0
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
        let errorMessage: Error = new Error("", "")
        errorMessage.setForFetch()
        errorMessage.handle()
      }
    }
  }

  setContent(): void {
    this.updateMaxSignatureOnFirstPage()
    this.resolutionContent.value = this.getContent()
  }

  getPlaceholder(text: string): string {
    return `<span class="placeholder">${text}</span>`
  }

  getSignatoryDatalist(itemIndex: number): string {
    let selectedNames: string[] = this.signatories.value
      .map((item: CompanyBankSignatory, index: number) => {
        if (index === itemIndex) {
          return ""
        }
        return item.name
      })
      .filter((name: string | null) => {
        return !StringUtil.isNullOrEmpty(name)
      }) as string[]

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
    let datalist = this.getSignatoryDatalist(itemIndex)

    if (this.isInPreviewMode.value) {
      return `
        <tr>
          <td>${this.getPlaceholder("Signator Name")}</td>
          <td>${this.getPlaceholder("Signator Identification")}</td>
          <td class="signature-cell"></td>
        </tr>
      `
    } else if (this.isDocumentEditable()) {
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
          </td>
          <td class="signature-cell">
          </td>
          <td class="remove-section">${removeButton}</td>
        </tr>
      `
    } else {
      return `
        <tr>
          <td>${!StringUtil.isNullOrEmpty(item.name) ? item.name : ""}</td>
          <td>${!StringUtil.isNullOrEmpty(item.identification) ? item.identification : ""}</td>
          <td class="signature-cell"></td>
        </tr>
      `
    }
  }

  getBankAuthorisedSignatoriesTable(): string {
    let tableContent: string[] = []

    if (this.signatories.value.length <= 0) {
      let newSignatory = new CompanyBankSignatory()
      newSignatory.role = "Director"
      this.signatories.value.push(newSignatory)
    }

    this.signatories.value.forEach((signatory: CompanyBankSignatory, index: number) => {
      const signatoryRowItem = this.getSignatoryRowForItem(index)
      tableContent.push(signatoryRowItem)
    })

    let addMoreButton = ""

    if (this.isDocumentEditable()) {
      addMoreButton = '<span class="add-more-signatory action-link">+ Add More</span>'
    }

    return `
      <table class="authorised-signatory-table">
        <thead>
          <tr>
            <th>
              Name
            </th>
            <th>
              NRIC/ Passport No.
            </th>
            <th>
              Specimen Signatures
            </th>
          </tr>
        </thead>
        <tbody>
          ${tableContent.join("")}
        </tbody>
      </table>
      ${addMoreButton}
    `
  }

  getOnlineBankingDatalist(itemIndex: number): string {
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

  getOnlineBankingRowForItem(itemIndex: number): string {
    let item = this.onlineAccessPersons.value[itemIndex] ?? null
    let datalist = this.getOnlineBankingDatalist(itemIndex)
    let role = item?.role ?? "checker"

    if (this.isInPreviewMode.value) {
      return `
        <tr>
          <td>${this.getPlaceholder("Authorised person name")}</td>
          <td>${this.getPlaceholder("Authorised person identification")}</td>
          <td class="signature-cell"></td>
          <td>${this.getPlaceholder("Authorised role")}</td>
        </tr>
      `
    } else if (this.isDocumentEditable()) {
      let canRemove = itemIndex > 0 && itemIndex === this.onlineAccessPersons.value.length - 1
      let removeButton = ""
      if (canRemove) {
        removeButton = `<i class="fa-regular fa-trash-alt remove-button remove-online-banking" />`
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
          <td class="signature-cell">
          </td>
          <td>
            <select class='form-select form-control in-resolution online-banking-role' id='online-banking-role-${itemIndex}' value='${role}'>
              <option value='checker' ${role === "checker" ? "selected" : ""}>Checker</option>
              <option value='maker' ${role === "maker" ? "selected" : ""}>Maker</option>
              <option value='checker & maker' ${role === "checker & maker" ? "selected" : ""}>Checker & Maker</option>
            </select>
          </td>
          <td class="remove-section">${removeButton}</td>
        </tr>
      `
    } else {
      return `
        <tr>
          <td>${!StringUtil.isNullOrEmpty(item?.name) ? item.name : ""}</td>
          <td>${!StringUtil.isNullOrEmpty(item?.identification) ? item?.identification : ""}</td>
          <td class="signature-cell"></td>
          <td>${!StringUtil.isNullOrEmpty(role) ? role : ""}</td>
        </tr>
      `
    }
  }

  getOnlineBankingTable(): string {
    let tableContent: string[] = []

    if (this.onlineAccessPersons.value.length <= 0) {
      this.onlineAccessPersons.value.push({
        id: "",
        name: "",
        role: "",
        identification: "",
        designation: "Director",
      })
    }

    this.onlineAccessPersons.value.forEach((onlineBankingPerson: OnlineBanking, index: number) => {
      const signatoryRowItem = this.getOnlineBankingRowForItem(index)
      tableContent.push(signatoryRowItem)
    })

    let addMoreButton = ""
    if (this.isDocumentEditable()) {
      addMoreButton = '<span class="add-more-online-banking action-link">+ Add More</span>'
    }

    return `
      <table class='basic-bank-authorised-signatory-table'>
        <thead>
          <tr>
            <th>Name</th>
            <th>NRIC / Passport No.</th>
            <th>Specimen Signatures</th>
            <th>Assign As</th>
          </tr>
        </thead>
        <tbody>
          ${tableContent.join("")}
        </tbody>
      </table>
      ${addMoreButton}
    `
  }

  getBankBranchSelect(): string {
    if (!this.isDocumentEditable()) {
      return !StringUtil.isNullOrEmpty(this.application.value?.bankBranch?.name ?? "")
        ? (this.application.value?.bankBranch?.name ?? "")
        : this.getPlaceholder("Your Bank Branch")
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

          return `<span id='${b.id}' class='branch-to-select dropdown-item'>${b.name}</span>`
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

    let selectedValue = StringUtil.isNullOrEmpty(this.application?.value?.bankBranchId ?? "")
      ? "YOUR SELECTED BRANCH"
      : (this.application.value?.bankBranch?.name ?? "")

    let placeholderClass = StringUtil.isNullOrEmpty(this.application?.value?.bankBranchId ?? "")
      ? "value-placeholder"
      : ""

    this.selectedBranchId.value = this.application.value?.bankBranch?.id
      ? this.application.value?.bankBranch?.id
      : this.bankBranches.value[0].id

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

  getBankBranchAddress(): string {
    const placeholder = this.getPlaceholder("Your Bank Islam Branch address location")

    if (!this.isDocumentEditable()) {
      return !StringUtil.isNullOrEmpty(this.application.value?.bankBranch?.address ?? "")
        ? (this.application.value?.bankBranch?.address ?? "")
        : placeholder
    }

    if (this.application.value === null) {
      return placeholder
    }

    let selectedValue = StringUtil.isNullOrEmpty(this.application?.value?.bankBranchId ?? "")
      ? ""
      : (this.application.value?.bankBranch?.address ?? "")

    if (StringUtil.isNullOrEmpty(selectedValue)) {
      return placeholder
    }

    return `<b>${selectedValue}</b>`
  }

  getContent(): string {
    if (!this.originalContent.value) {
      return ""
    }

    this.documentTemplate.value.content = this.originalContent.value

    let stringToReplace = "$textarea.&lt;name=authorisedSignatory&gt;$"
    let stringReplacement = this.getBankAuthorisedSignatoriesTable()

    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      stringToReplace,
      stringReplacement
    )

    let onlineBankingStringToReplace = "$textarea.&lt;name=onlineBanking&gt;$"
    let onlineBankingReplacement = this.getOnlineBankingTable()

    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      onlineBankingStringToReplace,
      onlineBankingReplacement
    )

    let dayjs = useDayjs()
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      "$date.&lt;name=documentDate&gt;$",
      this.time.formatDateOnlyFull(dayjs().format("YYYY-MM-DD"))
    )

    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      "$text.&lt;name=bankBranchId&gt;$",
      this.getBankBranchSelect()
    )

    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      "$text.&lt;name=bankBranchLocation&gt;$",
      this.getBankBranchAddress()
    )

    let templateProcessor = new TemplateProcessor(this.documentTemplate.value)

    if (this.isInPreviewMode.value) {
      return templateProcessor.getContentForPreview(this.application.value)
    }

    return this.isDocumentEditable()
      ? templateProcessor.getContent(this.application.value, this.isInPreviewMode.value)
      : templateProcessor.getContentForPrint(this.application.value)
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

  override async updateApplicationContent(updatedApplicationData: CompanyBankAccountOpening): Promise<void> {
    if (!this.application.value) {
      this.application.value = new CompanyBankAccountOpening()
    }

    this.application.value.cloneDetails(updatedApplicationData)
    this.setContent()
    await this.getPersonsToSign()
  }

  // Handler
  handleAddMoreSignatoryClick(): void {
    let newSignatory = new CompanyBankSignatory()
    newSignatory.role = "Director"
    this.signatories.value.push(newSignatory)

    nextTick(() => {
      this.setContent()
    })

    this.emitEvents("updated")
  }

  handleRemoveSignatoryClick(): void {
    this.signatories.value.pop()

    nextTick(() => {
      this.setContent()
    })

    this.emitEvents("updated")
  }

  handleAddMoreOnlineBankingClick(): void {
    const newOnlineBanking = {
      id: "",
      name: "",
      role: "checker",
      identification: "",
      designation: "Director",
    }
    this.onlineAccessPersons.value.push(newOnlineBanking)

    nextTick(() => {
      this.setContent()
    })

    this.emitEvents("updated")
  }

  handleRemoveOnlineBankingClick(): void {
    this.onlineAccessPersons.value.pop()

    nextTick(() => {
      this.setContent()
    })

    this.emitEvents("updated")
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
    this.signatories.value[index].role = "Director"

    nextTick(() => {
      this.setContent()
    })

    this.emitEvents("updated")
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

    this.emitEvents("updated")
  }

  handleOnlineBankingNameSelected(event: Event): void {
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
    let designationFieldId = `online-banking-role-${index}`
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

    this.emitEvents("updated")
  }

  handleOnlineBankingIdChanged(event: Event): void {
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

  handleOnlineBankingRoleChanged(event: Event): void {
    const inputField = event.target as HTMLInputElement
    let inputFieldId = inputField.id
    if (!inputFieldId.includes("online-banking-role")) {
      return
    }

    let role = inputField.value
    let index = parseInt(inputFieldId.replace("online-banking-role-", ""))

    if (index >= this.onlineAccessPersons.value.length) {
      return
    }
    this.onlineAccessPersons.value[index].role = role.toLowerCase()

    this.emitEvents("updated")
  }

  handlebranchSelectClick(event: Event): void {
    this.showBranchOption.value = !this.showBranchOption.value

    nextTick(() => {
      this.setContent()
    })

    this.emitEvents("updated")
  }

  handleSearchSelect(event: Event): void {
    let target = event.target as HTMLInputElement
    let value = target.value

    this.bankBranchSearchText.value = value

    nextTick(() => {
      this.setContent()
    })

    this.emitEvents("updated")
  }

  handleBranchSelect(event: Event): void {
    if (this.application.value === null) {
      return
    }

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

  // Event Listener
  attachEventListeners(): void {
    if (!this.isDocumentEditable()) {
      return
    }

    const container = document.getElementById("dcr-bank-account-opening-bank-islam")
    if (!container) {
      return
    }

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

    //Signatories
    const signatoryNameInputs = document.querySelectorAll(".signatory-name")
    signatoryNameInputs.forEach((input) => {
      input.removeEventListener("change", this.handleSignatoryNameSelected.bind(this))
      input.addEventListener("change", this.handleSignatoryNameSelected.bind(this))
    })

    const signatoryIdInputs = document.querySelectorAll(".signatory-id")
    signatoryIdInputs.forEach((input) => {
      input.removeEventListener("change", this.handleSignatoryIdChanged.bind(this))
      input.addEventListener("change", this.handleSignatoryIdChanged.bind(this))
    })

    const addMoreSignatoryButtons = document.querySelectorAll(".add-more-signatory")
    addMoreSignatoryButtons.forEach((btn) => {
      btn.removeEventListener("click", this.handleAddMoreSignatoryClick.bind(this))
      btn.addEventListener("click", this.handleAddMoreSignatoryClick.bind(this))
    })

    const removeSignatoryButtons = document.querySelectorAll(".remove-authorised-signatories")
    removeSignatoryButtons.forEach((btn) => {
      btn.removeEventListener("click", this.handleRemoveSignatoryClick.bind(this))
      btn.addEventListener("click", this.handleRemoveSignatoryClick.bind(this))
    })

    const onlineBankingNameInputs = document.querySelectorAll(".authorised-persons")
    onlineBankingNameInputs.forEach((input) => {
      input.removeEventListener("change", this.handleOnlineBankingNameSelected.bind(this))
      input.addEventListener("change", this.handleOnlineBankingNameSelected.bind(this))
    })

    const onlineBankingIdInputs = document.querySelectorAll(".authorised-person-id")
    onlineBankingIdInputs.forEach((input) => {
      input.removeEventListener("change", this.handleOnlineBankingIdChanged.bind(this))
      input.addEventListener("change", this.handleOnlineBankingIdChanged.bind(this))
    })

    const onlineBankingRoleSelects = document.querySelectorAll(".online-banking-role")
    onlineBankingRoleSelects.forEach((select) => {
      select.removeEventListener("change", this.handleOnlineBankingRoleChanged.bind(this))
      select.addEventListener("change", this.handleOnlineBankingRoleChanged.bind(this))
    })

    const addMoreOnlineBankingButtons = document.querySelectorAll(".add-more-online-banking")
    addMoreOnlineBankingButtons.forEach((btn) => {
      btn.removeEventListener("click", this.handleAddMoreOnlineBankingClick.bind(this))
      btn.addEventListener("click", this.handleAddMoreOnlineBankingClick.bind(this))
    })

    const removeOnlineBankingButtons = document.querySelectorAll(".remove-online-banking")
    removeOnlineBankingButtons.forEach((btn) => {
      btn.removeEventListener("click", this.handleRemoveOnlineBankingClick.bind(this))
      btn.addEventListener("click", this.handleRemoveOnlineBankingClick.bind(this))
    })
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
