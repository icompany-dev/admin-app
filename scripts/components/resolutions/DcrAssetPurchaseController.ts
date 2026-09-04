import { CompanyAssetPurchase } from "~/scripts/models/CompanyAssetPurchase"
import { Company } from "~/scripts/models/Company"
import { Director } from "~/scripts/models/Director"
import { DocumentTemplate } from "~/scripts/models/DocumentTemplate"
import { ResolutionController } from "./ResolutionController"
import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { TemplateProcessor } from "~/scripts/library/TemplateProcessor"
import { CompanyDirectorManagerTnCDocumentType } from "~/scripts/constants/CompanyDirectorManagers"
import { ObjectUtil } from "~/scripts/utils/Object"
import { AssetCategory, AssetModeOfAcquisition, AssetPurchases } from "~/scripts/constants/AssetPurchases"
import { NumberUtil } from "~/scripts/utils/Number"

export class DcrAssetPurchaseController extends ResolutionController<CompanyAssetPurchase> {
  companyAssetPurchaseRepository = useCompanyAssetPurchaseStore()
  companyRepository = useCompanyStore()
  documentTemplateRepository = useDocumentTemplateStore()

  directors = ref<Director[]>([])

  documentTemplate = ref<DocumentTemplate>(new DocumentTemplate())

  secondPageItemContent: Ref<string> = ref<string>("")
  originalTemplateContent: string = ""

  private documentTemplateId: string = "7cadd926-82f0-4403-ab94-419ddeefe1f1"

  constructor(props: IPropsResolutionDocument<CompanyAssetPurchase>, emitEvents: any | null) {
    super(
      props.companyId,
      props.applicationId,
      props.application,
      CompanyAssetPurchase,
      props.isInPreviewMode,
      true,
      false,
      props.showWatermark,
      props.watermarkText,
      emitEvents
    )

    this.signatureStartOnPage.value = 2
    this.maxSignatureOnFirstPage.value = 4
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
    let response = await this.companyAssetPurchaseRepository.fetch(id)
    if (!this.companyAssetPurchaseRepository.error && response !== null) {
      this.application.value = new CompanyAssetPurchase(response)
      this.initializeData()
    }
  }

  async setApplication(): Promise<void> {
    if (this.application.value && !StringUtil.isNullOrEmpty(this.application.value.id)) {
      return
    }

    this.application.value = new CompanyAssetPurchase()
    this.application.value.companyId = this.companyId.value

    let response = await this.companyRepository.fetch(this.companyId.value)
    if (!this.companyRepository.error) {
      this.application.value.company = new Company(response)
    }

    this.initializeData()
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
        let errorMessage: Error = new Error()
        errorMessage.setForFetch()
        errorMessage.handle()
      }
    }
  }

  async otherDataInitiation(): Promise<void> {
    let response = await this.directorRepository.fetchAllForCompany(this.companyId.value)
    this.directors.value = response.map((d: Director) => {
      return new Director(d)
    })
  }

  setContent(): void {
    this.resolutionContent.value = this.getContent()
  }

  getAssetCategory(): string {
    if (!this.application.value || this.isInPreviewMode.value) {
      return `<span class='value-placeholder'>e.g. Motor Vehicle</span>`
    }

    if (this.isDocumentEditable()) {
      let values = Object.values(AssetCategory)
      let options = values.map((s: string) => {
        let selected = s === this.application.value?.assetCategory ? "selected" : ""
        return `
          <option value='${s}' ${selected}>
            ${AssetPurchases.getAssetCategoryName(s as AssetCategory)}
          </option>
        `
      })

      return `
        <select class='form-control in-resolution asset-category'>
          ${options.join("")}
        </select>
      `
    }

    return AssetPurchases.getAssetCategoryName(this.application.value.assetCategory as AssetCategory)
  }

  getModeOfAcquisition(): string {
    if (!this.application.value || this.isInPreviewMode.value) {
      return `<span class='value-placeholder'>e.g. Cash Purchase</span>`
    }

    if (this.isDocumentEditable()) {
      let values = Object.values(AssetModeOfAcquisition)
      let options = values.map((s: string) => {
        let selected = s === this.application.value?.modeOfAcquisition ? "selected" : ""
        return `
          <option value='${s}' ${selected}>
            ${AssetPurchases.getAssetModeOfAcquisition(s as AssetModeOfAcquisition)}
          </option>
        `
      })

      return `
        <select class='form-control in-resolution mode-acquisition'>
          ${options.join("")}
        </select>
      `
    }

    return AssetPurchases.getAssetModeOfAcquisition(this.application.value.modeOfAcquisition as AssetModeOfAcquisition)
  }

  getNameOptions(): string {
    if (this.isInPreviewMode.value || !this.application.value) {
      return `<span class='value-placeholder'>NAME OF NEW CHAIRMAN</span>`
    }

    if (this.isDocumentEditable()) {
      let directorOptions = this.directors.value.map((d: Director) => {
        let selected = d.name === this.application.value?.nameOfDirector ? "selected" : ""

        return `
          <option value="${d.name}" ${selected}>
            ${d.name}
          </option>
        `
      })

      return `
        <select class='form-control in-resolution director-name' name='directorName'>
          <option></option>
          ${directorOptions.join("")}
        </select> 
      `
    }

    return this.application.value.nameOfDirector?.toUpperCase() ?? ""
  }

  getDirectorName(): string {
    if (
      this.isInPreviewMode.value ||
      !this.application.value ||
      StringUtil.isNullOrEmpty(this.application.value.nameOfDirector)
    ) {
      return `<span class='value-placeholder'>NAME OF DIRECTOR</span>`
    }

    return this.application.value.nameOfDirector?.toUpperCase() ?? ""
  }

  getFinancingOptionsString(): string {
    let regex =
      /<p[^>]*>\s*(?:<[^>]+>)*\s*\[financing-option\]\s*(?:<\/[^>]+>)*\s*<\/p>([\s\S]*?)<p[^>]*>\s*(?:<[^>]+>)*\s*\[\/financing-option\]\s*(?:<\/[^>]+>)*\s*<\/p>/gi

    const matches: string[] = []
    let match: RegExpExecArray | null

    while ((match = regex.exec(this.documentTemplate.value.content)) !== null) {
      matches.push(match[1].trim())
    }

    return matches.join("")
  }

  getFinancingOptions(): string {
    let string = this.getFinancingOptionsString()

    if (!this.application.value || this.isInPreviewMode.value) {
      return `<p class="ql-align-justify"><br></p>${string}`
    }

    if (this.application.value.isFinancingRequired) {
      return `<p class="ql-align-justify"><br></p>${string}`
    }

    return ""
  }

  getDirectorAdvancesString(): string {
    let regex =
      /<p[^>]*>\s*(?:<[^>]+>)*\s*\[director-advance-option\]\s*(?:<\/[^>]+>)*\s*<\/p>([\s\S]*?)<p[^>]*>\s*(?:<[^>]+>)*\s*\[\/director-advance-option\]\s*(?:<\/[^>]+>)*\s*<\/p>/gi

    const matches: string[] = []
    let match: RegExpExecArray | null

    while ((match = regex.exec(this.documentTemplate.value.content)) !== null) {
      matches.push(match[1].trim())
    }

    return matches.join("")
  }

  getDirectorAdvances(): string {
    let string = this.getDirectorAdvancesString()

    if (!this.application.value || this.isInPreviewMode.value) {
      return `<p class="ql-align-justify"><br></p>${string}`
    }

    if (this.application.value.isDirectorAdvanced) {
      return `<p class="ql-align-justify"><br></p>${string}`
    }

    return ""
  }

  getMachineEquimentsString(): string {
    let regex =
      /<p[^>]*>\s*(?:<[^>]+>)*\s*\[machine-equipment-option\]\s*(?:<\/[^>]+>)*\s*<\/p>([\s\S]*?)<p[^>]*>\s*(?:<[^>]+>)*\s*\[\/machine-equipment-option\]\s*(?:<\/[^>]+>)*\s*<\/p>/gi

    const matches: string[] = []
    let match: RegExpExecArray | null

    while ((match = regex.exec(this.documentTemplate.value.content)) !== null) {
      matches.push(match[1].trim())
    }

    return matches.join("")
  }

  getMachineEquiments(): string {
    let string = this.getMachineEquimentsString()

    if (!this.application.value || this.isInPreviewMode.value) {
      return `<p class="ql-align-justify"><br></p>${string}`
    }

    if (this.application.value.isMachineInstallationRequired) {
      return `<p class="ql-align-justify"><br></p>${string}`
    }

    return ""
  }

  getSecondPage(): string {
    const pageBreakRegex = /<p[^>]*>\s*(?:<[^>]+>)*\s*\[page-break\]\s*(?:<\/[^>]+>)*\s*<\/p>/i

    const parts = this.documentTemplate.value.content.split(pageBreakRegex)
    let secondPage = parts.length > 1 ? parts[1].trim() : ""

    if (this.application.value && parts.length > 1) {
      if (this.application.value.isFinancingRequired || this.application.value.isDirectorAdvanced) {
        if (this.application.value.isMachineInstallationRequired) {
          let regex =
            /<p[^>]*>\s*(?:<[^>]+>)*\s*\[machine-equipment-option\]\s*(?:<\/[^>]+>)*\s*<\/p>([\s\S]*?)<p[^>]*>\s*(?:<[^>]+>)*\s*\[\/machine-equipment-option\]\s*(?:<\/[^>]+>)*\s*<\/p>/gi

          const matches: string[] = []
          let match: RegExpExecArray | null

          while ((match = regex.exec(this.originalTemplateContent)) !== null) {
            matches.push(match[1].trim())
          }

          let additionalString = matches.join("")
          secondPage = `${additionalString}<p><br></p>${secondPage}`
        }
      }
    }

    return secondPage
  }

  getSecondPageToReplace(): string {
    const pageBreakRegex = /<p[^>]*>\s*(?:<[^>]+>)*\s*\[page-break\]\s*(?:<\/[^>]+>)*\s*<\/p>/i

    const parts = this.documentTemplate.value.content.split(pageBreakRegex)
    let secondPage = parts.length > 1 ? parts[1].trim() : ""

    if (this.application.value && parts.length > 1) {
      if (this.application.value.isFinancingRequired || this.application.value.isDirectorAdvanced) {
        if (this.application.value.isMachineInstallationRequired) {
          let regex =
            /<p[^>]*>\s*(?:<[^>]+>)*\s*\[machine-equipment-option\]\s*(?:<\/[^>]+>)*\s*<\/p>([\s\S]*?)<p[^>]*>\s*(?:<[^>]+>)*\s*\[\/machine-equipment-option\]\s*(?:<\/[^>]+>)*\s*<\/p>/gi

          const matches: string[] = []
          let match: RegExpExecArray | null

          while ((match = regex.exec(this.originalTemplateContent)) !== null) {
            matches.push(match[1].trim())
          }

          let additionalString = matches.join("")
          secondPage = `${additionalString}<p class="ql-align-justify">[page-break]</p>${secondPage}`
        }
      }
    }

    return secondPage
  }

  getContent(): string {
    this.documentTemplate.value.content = this.originalTemplateContent

    let purchaseDetailsSearchString = `<p class="ql-align-justify">[details]</p>`
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      purchaseDetailsSearchString,
      `<div class="purchase-details">`
    )

    let purchaseDetailsEndSearchString = `<p class="ql-align-justify">[/details]</p>`
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      purchaseDetailsEndSearchString,
      `</div>`
    )

    let assetCategorySearchString = "$text.&lt;name=assetCategory&gt;$"
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      assetCategorySearchString,
      this.getAssetCategory()
    )

    let modeSearchString = "$text.&lt;name=modeOfAcquisition&gt;$"
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      modeSearchString,
      this.getModeOfAcquisition()
    )

    let vendorNameSearchString = "%vendorName%"
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      vendorNameSearchString,
      this.vendorName
    )

    let purchaseAmountSearchString = "%purchaseAmount%"
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      purchaseAmountSearchString,
      this.purchaseAmount
    )

    let financingOptionSearchString = `<p class="ql-align-justify"><br></p><p>[financing-option]</p>${this.getFinancingOptionsString()}<p class="ql-align-justify">[/financing-option]</p>`
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      financingOptionSearchString,
      this.getFinancingOptions()
    )

    let directorAdvanceSearchString = `<p class="ql-align-justify"><br></p><p class="ql-align-justify">[director-advance-option]</p>${this.getDirectorAdvancesString()}<p class="ql-align-justify">[/director-advance-option]</p>`
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      directorAdvanceSearchString,
      this.getDirectorAdvances()
    )

    let machineEquipmentSearchString = `<p class="ql-align-justify"><br></p><p class="ql-align-justify">[machine-equipment-option]</p>${this.getMachineEquimentsString()}<p class="ql-align-justify">[/machine-equipment-option]</p>`
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      machineEquipmentSearchString,
      this.getMachineEquiments()
    )

    let nameSearchString = "$text.&lt;name=nameOfDirector&gt;$"
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      nameSearchString,
      this.getNameOptions()
    )

    let directorNameSearchString = "%directorName%"
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      directorNameSearchString,
      this.getDirectorName()
    )

    let secondPage = this.getSecondPage()
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(this.getSecondPage(), "")
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(this.getSecondPageToReplace(), "")
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace("[page-break]", "")

    let templateProcessor = new TemplateProcessor(this.documentTemplate.value)
    let secondPageTemplate = new DocumentTemplate()
    secondPageTemplate.content = secondPage
    let additionalTemplateProcessor = new TemplateProcessor(secondPageTemplate)

    if (this.isInPreviewMode.value) {
      this.secondPageItemContent.value = additionalTemplateProcessor.getContentForPreview(this.application.value)
      return templateProcessor.getContentForPreview(this.application.value)
    }

    this.secondPageItemContent.value = this.isDocumentEditable()
      ? additionalTemplateProcessor.getContent(this.application.value, this.isInPreviewMode.value)
      : additionalTemplateProcessor.getContentForPrint(this.application.value)

    let content = this.isDocumentEditable()
      ? templateProcessor.getContent(this.application.value, this.isInPreviewMode.value)
      : templateProcessor.getContentForPrint(this.application.value)

    return content
  }

  totalPages(): number {
    if (this.directorRepository.isLoading || this.signatureItems.value.length <= 0) {
      return 2
    }

    return (
      this.signatureStartOnPage.value +
      Math.ceil(
        (this.signatureItems.value.length - this.maxSignatureOnFirstPage.value) / this.maxSignatureOnOtherPages.value
      )
    )
  }

  handleDirectorName(event: Event): void {
    if (!this.application.value) {
      return
    }

    const target = event.target as HTMLSelectElement

    this.application.value.nameOfDirector = target.value
    this.setContent()
  }

  handleAssetCategoryChanged(event: Event): void {
    if (!this.application.value) {
      return
    }

    const target = event.target as HTMLSelectElement

    this.application.value.assetCategory = target.value
    this.application.value.isMachineInstallationRequired = this.isMachineInstallationRequired
    this.setContent()
  }

  handleDescriptionChanged(event: Event): void {
    if (!this.application.value) {
      return
    }

    const target = event.target as HTMLInputElement

    this.application.value.assetDescription = target.value.toUpperCase()
    this.setContent()
  }

  handleMakeModelChanged(event: Event): void {
    if (!this.application.value) {
      return
    }

    const target = event.target as HTMLInputElement

    this.application.value.makeModel = target.value.toUpperCase()
    this.setContent()
  }

  handleSerialNoChanged(event: Event): void {
    if (!this.application.value) {
      return
    }

    const target = event.target as HTMLInputElement

    this.application.value.serialNo = target.value.toUpperCase()
    this.setContent()
  }

  handlePurposeChanged(event: Event): void {
    if (!this.application.value) {
      return
    }

    const target = event.target as HTMLInputElement

    this.application.value.purpose = target.value.toUpperCase()
    this.setContent()
  }

  handleVendorNameChanged(event: Event): void {
    if (!this.application.value) {
      return
    }

    const target = event.target as HTMLInputElement

    this.application.value.vendorName = target.value.toUpperCase()
    this.setContent()
  }

  handlePurchaseAmountChanged(event: Event): void {
    if (!this.application.value) {
      return
    }

    const target = event.target as HTMLInputElement

    this.application.value.purchaseAmount = Number(target.value)
    this.setContent()
  }

  handleModeAcquisitionChanged(event: Event): void {
    if (!this.application.value) {
      return
    }

    const target = event.target as HTMLSelectElement

    this.application.value.modeOfAcquisition = target.value
    this.application.value.isFinancingRequired = this.isFinancingRequired
    this.application.value.isDirectorAdvanced = this.isDirectorAdvanced
    this.setContent()
  }

  attachEventListeners(): void {
    if (!this.isDocumentEditable()) {
      return
    }

    const directorNameElements = document.querySelectorAll(".director-name")
    directorNameElements.forEach((element) => {
      element.removeEventListener("change", this.handleDirectorName.bind(this))
      element.addEventListener("change", this.handleDirectorName.bind(this))
    })

    const assetCategories = document.querySelectorAll(".asset-category")
    assetCategories.forEach((element) => {
      element.removeEventListener("change", this.handleAssetCategoryChanged.bind(this))
      element.addEventListener("change", this.handleAssetCategoryChanged.bind(this))
    })

    const assetDescriptions = document.querySelectorAll(".assetDescription")
    assetDescriptions.forEach((element) => {
      element.removeEventListener("change", this.handleDescriptionChanged.bind(this))
      element.addEventListener("change", this.handleDescriptionChanged.bind(this))
    })

    const makeModels = document.querySelectorAll(".makeModel")
    makeModels.forEach((element) => {
      element.removeEventListener("change", this.handleMakeModelChanged.bind(this))
      element.addEventListener("change", this.handleMakeModelChanged.bind(this))
    })

    const serialNos = document.querySelectorAll(".serialNo")
    serialNos.forEach((element) => {
      element.removeEventListener("change", this.handleSerialNoChanged.bind(this))
      element.addEventListener("change", this.handleSerialNoChanged.bind(this))
    })

    const purposes = document.querySelectorAll(".purpose")
    purposes.forEach((element) => {
      element.removeEventListener("change", this.handlePurposeChanged.bind(this))
      element.addEventListener("change", this.handlePurposeChanged.bind(this))
    })

    const vendorNames = document.querySelectorAll(".vendorName")
    vendorNames.forEach((element) => {
      element.removeEventListener("change", this.handleVendorNameChanged.bind(this))
      element.addEventListener("change", this.handleVendorNameChanged.bind(this))
    })

    const purchaseAmounts = document.querySelectorAll(".purchaseAmount")
    purchaseAmounts.forEach((element) => {
      element.removeEventListener("change", this.handlePurchaseAmountChanged.bind(this))
      element.addEventListener("change", this.handlePurchaseAmountChanged.bind(this))
    })

    const modeAcquisitions = document.querySelectorAll(".mode-acquisition")
    modeAcquisitions.forEach((element) => {
      element.removeEventListener("change", this.handleModeAcquisitionChanged.bind(this))
      element.addEventListener("change", this.handleModeAcquisitionChanged.bind(this))
    })
  }

  override async updateApplicationContent(updatedApplicationData: CompanyAssetPurchase): Promise<void> {
    if (!this.application.value) {
      this.application.value = new CompanyAssetPurchase(null)
    }

    let isSame = ObjectUtil.isEqual<CompanyAssetPurchase>(
      this.application.value as CompanyAssetPurchase,
      updatedApplicationData
    )
    if (isSame) {
      this.setContent()
      return
    }

    nextTick(async () => {
      this.application.value?.cloneDetails(updatedApplicationData)
      this.setContent()
      await this.getPersonsToSign()
    })
  }

  get vendorName(): string {
    if (!this.application.value || StringUtil.isNullOrEmpty(this.application.value.vendorName)) {
      return `<span class='value-placeholder'>VENDOR NAME</span>`
    }

    return this.application.value.vendorName ?? `<span class='value-placeholder'>VENDOR NAME</span>`
  }

  get purchaseAmount(): string {
    if (!this.application.value || !this.application.value.purchaseAmount) {
      return `<span class='value-placeholder'> PURCHASE AMOUNT</span>`
    }

    return (
      NumberUtil.currency(this.application.value.purchaseAmount) ??
      `<span class='value-placeholder'> PURCHASE AMOUNT</span>`
    )
  }

  get isShowNameTagForDetails(): boolean {
    if (!this.application.value) {
      return false
    }

    return (
      this.isDocumentEditable() &&
      (StringUtil.isNullOrEmpty(this.application.value.assetCategory) ||
        StringUtil.isNullOrEmpty(this.application.value.assetDescription) ||
        StringUtil.isNullOrEmpty(this.application.value.vendorName) ||
        !(this.application.value.purchaseAmount !== null && this.application.value.purchaseAmount > 0) ||
        StringUtil.isNullOrEmpty(this.application.value.purpose))
    )
  }

  get isFinancingRequired(): boolean {
    return (
      this.application.value !== null &&
      (this.application.value.modeOfAcquisition === AssetModeOfAcquisition.BankFinancing ||
        this.application.value.modeOfAcquisition === AssetModeOfAcquisition.HirePurchase ||
        this.application.value.modeOfAcquisition === AssetModeOfAcquisition.Leasing)
    )
  }

  get isShowNameTagForFinancingOption(): boolean {
    if (!this.application.value) {
      return false
    }

    return (
      this.isDocumentEditable() &&
      this.application.value.isFinancingRequired &&
      (StringUtil.isNullOrEmpty(this.application.value.financier) ||
        !(this.application.value.financeAmount !== null && this.application.value.financeAmount > 0))
    )
  }

  get isDirectorAdvanced(): boolean {
    return (
      this.application.value !== null &&
      this.application.value.modeOfAcquisition === AssetModeOfAcquisition.DirectorAdvance
    )
  }

  get isShowNameTagForDirectorAdvance(): boolean {
    if (!this.application.value) {
      return false
    }

    return (
      this.isDocumentEditable() &&
      this.application.value.isDirectorAdvanced &&
      StringUtil.isNullOrEmpty(this.application.value.nameOfDirector)
    )
  }

  get isMachineInstallationRequired(): boolean {
    return (
      this.application.value !== null &&
      (this.application.value.assetCategory === AssetCategory.Equipment ||
        this.application.value.assetCategory === AssetCategory.Machinery)
    )
  }

  get isShowNameTagForAuthorisedPerson(): boolean {
    if (!this.application.value) {
      return false
    }

    return this.isDocumentEditable() && StringUtil.isNullOrEmpty(this.application.value.authorisedPerson)
  }
}
