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

export class DcrBankAccountOpeningCurrentController extends ResolutionController<CompanyBankAccountOpening> {
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

  private documentTemplateId: string = "8f03ebb5-4feb-4761-aac2-50acb1884880"

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

    this.signatureStartOnPage.value = 1
    this.maxSignatureOnFirstPage.value = 2
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
        this.bank.value.name = this.bank.value.name.toUpperCase()
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

      this.signatureStartOnPage.value = this.application.value.signatories.length > 2 ? 2 : 1
      this.maxSignatureOnFirstPage.value = this.application.value.signatories.length > 1 ? 2 : 4
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

    this.signatureStartOnPage.value = this.application.value.signatories.length > 2 ? 2 : 1
    this.maxSignatureOnFirstPage.value = this.application.value.signatories.length > 1 ? 2 : 4
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

    this.signatureStartOnPage.value = this.application.value.signatories.length > 2 ? 2 : 1
    this.maxSignatureOnFirstPage.value = this.application.value.signatories.length > 1 ? 2 : 4

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

    let stringSearch = "%bank.signatorydetails%"
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      stringSearch,
      this.getSignatoryDetails()
    )

    let templateProcessor = new TemplateProcessor(this.documentTemplate.value)

    let template = null

    if (this.application.value)
      [(this.application.value.signatoryType = this.application.value.signatoryType.toUpperCase())]

    if (this.isInPreviewMode.value) {
      template = templateProcessor.getContentForPreview(this.application.value)
    } else {
      template = this.isDocumentEditable()
        ? templateProcessor.getContent(this.application.value, this.isInPreviewMode.value)
        : templateProcessor.getContentForPrint(this.application.value)
    }

    return template
  }

  getDatalistForIndex(index: number): string {
    let selectedNames: string[] = []
    if (this.application.value !== null) {
      selectedNames = this.application.value.signatories
        .filter((cbs: CompanyBankSignatory) => {
          return StringUtil.isNullOrEmpty(cbs.name)
        })
        .map((cbs: CompanyBankSignatory) => {
          return cbs.name ?? ""
        })
    }

    let dataList = this.directors.value
      .filter((d: Director, i: number) => {
        return !selectedNames.includes(d.name) && i !== index
      })
      .map((d: Director) => {
        return `
        <option>${name}</option>
      `
      })

    return `
      <datalist id="name-list-${index}">
        ${dataList.join("")}
      </datalist>
    `
  }

  getSignatoryDetails(): string {
    if (!this.application.value) {
      return ""
    }
    let tableRow = []
    if (this.application.value.signatories.length <= 0) {
      this.application.value.signatories = this.directors.value.map((d: Director) => {
        let newSignatory = new CompanyBankSignatory()
        newSignatory.name = d.name
        newSignatory.designation = "COMPANY DIRECTOR"
        newSignatory.identification = d.identification
        newSignatory.type = d.identificationType
        newSignatory.role = "maker"

        return newSignatory
      })
    }

    this.application.value.signatories.forEach((signatory: CompanyBankSignatory, index: number) => {
      let idType = signatory.type === "passport" ? "Passport" : "NRIC"
      tableRow.push(`
        <tr>
          <td class='signatory-detail'>
            <div class='action-link remove'>
              <i class='fa-regular fa-trash-alt' id='remove-${index}'></i>
            </div>
            <div class='form-group'>
              <span>Name:</span>
              <input type='text' class='form-control in-resolution signatory-names' id='signatory-name-${index}' value='${signatory.name}' list="name-list-${index}">
              ${this.getDatalistForIndex(index)}
            </div>
            <div class='form-group'>
              <span>Designation:</span>
              <input type='text' class='form-control in-resolution signatory-designations' id='signatory-designation-${index}' value='${signatory.designation}'>
            </div>
            <div class='form-group'>
              <span>${idType} No.:</span>
              <input type='text' class='form-control in-resolution signatory-identifications' id='signatory-identification-${index}' value='${signatory.identification}'>
            </div>
          </td>
          <td class='specimen'>
            <span class='placeholder'>Wet Ink Required</span>
          </td>
        </tr>
      `)
    })

    tableRow.push(`
      <tr>
        <td colspan='2'>
          Mandate:<br>
          - <b>${this.application.value.signatoryType.toUpperCase()}</b> of the above Directors.
        </td>
      </tr>
    `)

    tableRow.push(`
      <tr>
        <td colspan='2' class='add-more-signatory'>
          <span class='action-link add-more'>Add Another Signatory</span>
        </td>
      </tr>
    `)

    let table = `
      <table class='signatory-details'>
        <thead>
          <tr>
            <th>Particulars of Authorised Signatories</th>
            <th>Specimen Signature</th>
          </tr>
        </thead>
        <tbody>
          ${tableRow.join("")}
        </tbody>
      </table>
    `

    return table
  }

  getBankName(): string {
    return this.bank.value?.name || ""
  }

  handleAddMoreClicked(): void {
    if (!this.application.value) {
      return
    }

    this.application.value.signatories.push(new CompanyBankSignatory())

    this.setContent()
  }

  handleRemoveSignatoryClicked(event: Event): void {
    console.log("remove clicked", event)
    let target = event.target as HTMLElement
    if (!target.id.includes("remove") || target.classList.contains("fa-trash-alt")) {
      return
    }

    if (!this.application.value) {
      return
    }

    let targetFieldId = target.id
    let index = parseInt(targetFieldId.replace("remove-", ""))

    if (index >= this.application.value.signatories.length) {
      return
    }

    this.application.value.signatories.splice(index, 1)
    this.setContent()
    this.emitEvents("updated")
  }

  handleNameChanged(event: Event): void {
    const inputField = event.target as HTMLInputElement
    let inputFieldId = inputField.id
    if (!inputFieldId.includes("name")) {
      return
    }

    if (!this.application.value) {
      return
    }

    let name = inputField.value

    let index = parseInt(inputFieldId.replace("signatory-name-", ""))

    if (index >= this.application.value.signatories.length) {
      return
    }
    this.application.value.signatories[index].name = name

    let matchedDirector = this.directors.value.find((d: Director) => {
      return d.name === name
    })

    if (matchedDirector) {
      this.application.value.signatories[index].type = matchedDirector.identificationType
      this.application.value.signatories[index].identification = matchedDirector.identification
      this.application.value.signatories[index].role = "maker"
      this.application.value.signatories[index].designation = "COMPANY DIRECTOR"
    }

    this.setContent()
    this.emitEvents("updated")
  }

  handleDesignationChanged(event: Event): void {
    const inputField = event.target as HTMLInputElement
    let inputFieldId = inputField.id
    if (!inputFieldId.includes("designation")) {
      return
    }

    if (!this.application.value) {
      return
    }

    let designation = inputField.value

    let index = parseInt(inputFieldId.replace("signatory-designation-", ""))

    if (index >= this.application.value.signatories.length) {
      return
    }
    this.application.value.signatories[index].designation = designation

    this.setContent()
    this.emitEvents("updated")
  }

  handleIdentificationChanged(event: Event): void {
    const inputField = event.target as HTMLInputElement
    let inputFieldId = inputField.id
    if (!inputFieldId.includes("identification")) {
      return
    }

    if (!this.application.value) {
      return
    }

    let designation = inputField.value

    let index = parseInt(inputFieldId.replace("signatory-designation-", ""))

    if (index >= this.application.value.signatories.length) {
      return
    }
    this.application.value.signatories[index].designation = designation

    this.setContent()
    this.emitEvents("updated")
  }

  attachEventListeners(): void {
    if (!this.isDocumentEditable()) {
      return
    }

    const signatoryNames = document.querySelectorAll(".signatory-names")
    signatoryNames.forEach((field) => {
      field.removeEventListener("change", this.handleNameChanged.bind(this))
      field.addEventListener("change", this.handleNameChanged.bind(this))
    })

    const signatoryDesignations = document.querySelectorAll(".signatory-designations")
    signatoryDesignations.forEach((field) => {
      field.removeEventListener("change", this.handleDesignationChanged.bind(this))
      field.addEventListener("change", this.handleDesignationChanged.bind(this))
    })

    const signatoryIdentifications = document.querySelectorAll(".signatory-identifications")
    signatoryIdentifications.forEach((field) => {
      field.removeEventListener("change", this.handleIdentificationChanged.bind(this))
      field.addEventListener("change", this.handleIdentificationChanged.bind(this))
    })

    const addMore = document.querySelectorAll(".add-more")
    addMore.forEach((field) => {
      field.removeEventListener("click", this.handleAddMoreClicked.bind(this))
      field.addEventListener("click", this.handleAddMoreClicked.bind(this))
    })

    const remove = document.querySelectorAll(".fa-trash-alt")
    remove.forEach((field) => {
      field.removeEventListener("click", this.handleRemoveSignatoryClicked.bind(this))
      field.addEventListener("click", this.handleRemoveSignatoryClicked.bind(this))
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
