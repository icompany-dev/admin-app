import { Error } from "~/scripts/library/Error"
import { Company } from "~/scripts/models/Company"
import { CompanyManagementAccount } from "~/scripts/models/CompanyManagementAccount"
import { CompanyManagementAccountData } from "~/scripts/models/CompanyManagementAccountData"
import { DragAndDropFile } from "~/scripts/library/DragAndDropFile"
import {
  ManagementAccountConstants,
  ManagementAccountItem,
  ManagementAccountItemExample,
} from "~/scripts/constants/ManagementAccounts"
import { ManagementAccountTable } from "~/scripts/types/management-accounts/ManagementAccountTable"
import { ManagementAccountTableColumn } from "~/scripts/types/management-accounts/ManagementAccountTableColumn"
import { ManagementAccountTableRow } from "~/scripts/types/management-accounts/ManagementAccountTableRow"
import { StringUtil } from "~/scripts/utils/String"
import { Ocr } from "~/scripts/library/Ocr"
import { GeminiAiJobStatusResponse } from "~/scripts/models/GeminiAiJobStatusResponse"
import { DocumentTypes } from "~/scripts/constants/DocumentTypes"
import { AutoSave } from "~/scripts/library/AutoSave"
import { CompanyConstants } from "~/scripts/constants/Company"
import type { PostOcrManagementAccountData } from "~/scripts/types/management-accounts/PostOcrManagementAccountData"
import { StatusConstants } from "~/scripts/constants/Status"
import { DocumentScaler } from "~/scripts/library/DocumentScaler"
import { PaperOrientation } from "~/scripts/constants/Paper"
import type { ProcessedOcrManagementAccountData } from "~/scripts/types/management-accounts/ProcessedOcrManagementAccountData"
import { ActionTrayDropdown } from "~/scripts/types/action-trays/ActionTrayDropdown"
import { ActionTrayElement, ActionTrayLabel } from "~/scripts/types/action-trays/ActionTrayElement"
import type { CompanyFinancialPeriod } from "~/scripts/models/CompanyFinancialPeriod"
import { Filter } from "~/scripts/library/Filter"

//NOTE: This is needed for AutoSave -- workaround eslint and ref issues
type CompanyManagementAccountRepositoryStore = ReturnType<typeof useCompanyManagementAccountStore>

export class DocumentController {
  companyId = ref<string>("")
  company = ref<Company>(new Company())

  companyManagementAccountId = ref<string | null>(null)
  companyManagementAccount = ref<CompanyManagementAccount>(new CompanyManagementAccount())

  companyRepository = useCompanyStore()
  companyManagementAccountRepository = useCompanyManagementAccountStore()
  time = useLocalTime()
  language = useLanguage()

  financialYearStartDate = ref<string>("")
  financialYearEndDate = ref<string>("")

  isLoading: Ref<boolean> = ref<boolean>(false)

  tables = ref<ManagementAccountTable[]>([])
  tableRows = ref<ManagementAccountTableRow[]>([])
  maxRowsPerPage: number = 44

  showInitialInstructions = ref<boolean>(true)

  dragAndDropFile = ref<DragAndDropFile>(new DragAndDropFile(null))
  isOcrActivated = ref<boolean>(false)
  isOcrRunning = ref<boolean>(false)
  isOcrCompleted = ref<boolean>(false)
  ocr = ref<Ocr>(new Ocr())
  jobStatusResponses = ref<GeminiAiJobStatusResponse[]>([])

  //pagination
  currentPage = ref<number>(1)
  documentContainerRef: any | null = null
  isEnlarged = ref<boolean>(false)
  documentInstructionRef: any | null = null

  postOcrProcessPopupRef: any | null = null
  selectedDocumentType = ref<string>("")

  //auto save functions
  initialRecord = ref<CompanyManagementAccount>(new CompanyManagementAccount())
  autoSave = ref<AutoSave<CompanyManagementAccount, CompanyManagementAccountRepositoryStore>>(
    new AutoSave<CompanyManagementAccount, CompanyManagementAccountRepositoryStore>()
  )

  //more info
  moreInfoDetail = ref<ManagementAccountItem>(new ManagementAccountItem("", "", "", "", "", []))
  showMoreInfo = ref<boolean>(false)
  popupLeft = ref<number>(0)
  popupTop = ref<number>(0)

  eventManager = useEventManagerStore()

  isDocumentEditable = ref<boolean>(true)
  canEnlargeDocument = ref<boolean>(true)

  emitEvents: any | null

  actionTrayElements = ref<ActionTrayElement[]>([])
  isShowSection219And221 = ref<boolean>(false)

  isShowInfo = ref<boolean>(false)
  isShowInfoOCR = ref<boolean>(false)

  financialPeriodForManagementAccountRef: any | null = null

  constructor(
    companyId: string,
    financialYearStartDate: string,
    financialYearEndDate: string,
    companyManagementAccountId: string | null,
    isDocumentEditable: boolean,
    canEnlargeDocument: boolean,
    isEnlarged: boolean,
    emitEvents: any | null
  ) {
    this.companyId.value = companyId
    this.financialYearStartDate.value = financialYearStartDate
    this.financialYearEndDate.value = financialYearEndDate
    this.emitEvents = emitEvents

    this.autoSave.value.setRepository(this.companyManagementAccountRepository)

    this.setIsDocumentEditable(isDocumentEditable)
    this.setCanEnlargeDocument(canEnlargeDocument)
    this.setIsEnlarged(isEnlarged)
    this.setActionTrayElements()
    this.init(companyManagementAccountId)

    useAutoSave(this.companyManagementAccount.value, this.handleSave.bind(this))
  }

  async init(companyManagementAccountId: string | null): Promise<void> {
    this.isLoading.value = true
    await Promise.all([this.fetchCompany(), this.setCompanyManagementAccountId(companyManagementAccountId)])

    await this.setupDocument()
    this.isLoading.value = false
  }

  setIsDocumentEditable(isDocumentEditable: boolean): void {
    this.isDocumentEditable.value = isDocumentEditable
    this.setupDocument()
  }

  setCanEnlargeDocument(canEnlargeDocument: boolean): void {
    this.canEnlargeDocument.value = canEnlargeDocument
  }

  setIsEnlarged(isEnlarged: boolean): void {
    this.isEnlarged.value = isEnlarged
  }

  setDragAndDropTarget(dropTarget: HTMLElement | null): void {
    this.dragAndDropFile.value.dropTarget = dropTarget
  }

  setDocumentContainerRef(documentContainerRef: any): void {
    this.documentContainerRef = documentContainerRef

    this.setDocumentContainerScale()
  }

  setDocumentInstructionRef(documentInstructionRef: any): void {
    this.documentInstructionRef = documentInstructionRef
    this.setDocumentContainerScale()
  }

  setPostOcrProcessPopupRef(postOcrProcessPopupRef: any): void {
    this.postOcrProcessPopupRef = postOcrProcessPopupRef

    // NOTE: This is a test script to check if it is working
    // if (this.postOcrProcessPopupRef) {
    //   this.jobStatusResponses.value.push(
    //     new GeminiAiJobStatusResponse({
    //       isSuccesful: true,
    //       status: "completed",
    //       result: `
    //     \`\`\`json
    //     {
    //       "document_date": "2025-12-09",
    //       "ref_no": "8130099065",
    //       "bank_name": "Maybank",
    //       "opening_balance": "",
    //       "total": "75.60",
    //       "from": ""
    //     }
    //     \`\`\`
    //     `,
    //     })
    //   )
    //   this.postOcrProcessPopupRef.show()
    // }
  }

  setFinancialYearStartDate(financialYearStartDate: string) {
    this.financialYearStartDate.value = financialYearStartDate
    this.companyManagementAccount.value.financialYearStartDate = this.financialYearStartDate.value
    this.setupDocument()
  }

  setFinancialYearEndDate(financialYearEndDate: string) {
    this.financialYearEndDate.value = financialYearEndDate
    this.companyManagementAccount.value.financialYearEndDate = this.financialYearEndDate.value
    this.setupDocument()
  }

  setFinancialPeriodForManagementAccountRef(financialPeriodForManagementAccountRef: any): void {
    this.financialPeriodForManagementAccountRef = financialPeriodForManagementAccountRef
  }

  async setCompanyId(companyId: string): Promise<void> {
    this.companyId.value = companyId
    this.companyManagementAccount.value.companyId = this.companyId.value
    await this.fetchCompany()
  }

  async setCompanyManagementAccountId(companyManagementAccountId: string | null): Promise<void> {
    if (StringUtil.isNullOrEmpty(companyManagementAccountId)) {
      this.companyManagementAccountId.value = null
    } else {
      this.companyManagementAccountId.value = companyManagementAccountId
    }

    await this.fetchCompanyManagementAccount()
  }

  async fetchCompanyManagementAccount(): Promise<void> {
    if (!this.companyManagementAccountId.value) {
      this.companyManagementAccount.value = new CompanyManagementAccount()
      this.companyManagementAccount.value.companyId = this.companyId.value
      this.companyManagementAccount.value.financialYearStartDate = this.financialYearStartDate.value
      this.companyManagementAccount.value.financialYearEndDate = this.financialYearEndDate.value
      this.initialRecord.value = new CompanyManagementAccount()

      return
    }

    try {
      let response = await this.companyManagementAccountRepository.fetch(this.companyManagementAccountId.value)
      if (this.companyManagementAccountRepository.error !== null) {
        throw this.companyManagementAccountRepository.error
      }

      this.companyManagementAccount.value = new CompanyManagementAccount(response)
      this.initialRecord.value = new CompanyManagementAccount(response)

      if (this.companyManagementAccount.value.status !== StatusConstants.DRAFT) {
        this.setIsDocumentEditable(false)
      }
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error: Error = new Error()
        error.setForFetch()
        error.handle()
      }
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
        let error: Error = new Error()
        error.setForFetch()
        error.handle()
      }
    }
  }

  onInstructionsConfirmed(): void {
    this.showInitialInstructions.value = false

    if (this.financialPeriodForManagementAccountRef) {
      this.financialPeriodForManagementAccountRef.show()
    }
  }

  handleUnmounting(): void {
    this.handleSave()
    this.eventManager.setIsDocumentActive(false)
  }

  async onFinancialPeriodSelected(companyManagementAccount: CompanyManagementAccount): Promise<void> {
    this.isLoading.value = true
    this.companyManagementAccount.value = new CompanyManagementAccount(companyManagementAccount)
    this.initialRecord.value = new CompanyManagementAccount(companyManagementAccount)

    this.financialYearStartDate.value = this.companyManagementAccount.value.financialYearStartDate ?? ""
    this.financialYearEndDate.value = this.companyManagementAccount.value.financialYearEndDate ?? ""
    await this.setupDocument()
    this.isLoading.value = false
  }

  //Document section
  addToBalanceSheet(target: string): void {
    this.companyManagementAccount.value.balanceSheet.add(target)
    this.setupDocument()
  }

  removeFromBalanceSheet(target: string, id: string): void {
    this.companyManagementAccount.value.balanceSheet.remove(target, id)
    this.setupDocument()
  }

  addToProfitLoss(target: string): void {
    this.companyManagementAccount.value.profitLoss.add(target)
    this.setupDocument()
  }

  removeFromProfitLoss(target: string, id: string): void {
    this.companyManagementAccount.value.profitLoss.remove(target, id)
    this.setupDocument()
  }

  onMoreInfoClicked(target: string, event: MouseEvent): void {
    if (this.isInPreviewMode) {
      return
    }

    this.showMoreInfo.value = false

    let listToSearch = this.language.isMalay()
      ? ManagementAccountConstants.CONTENT_TYPES_MORE_INFO_BM
      : ManagementAccountConstants.CONTENT_TYPES_MORE_INFO_EN
    let moreInfoDetail = listToSearch.find((moreInfo: ManagementAccountItem) => {
      return moreInfo.target === target
    })

    if (!moreInfoDetail) {
      return
    }

    this.calculatePopupPosition(event)
    this.moreInfoDetail.value = moreInfoDetail
    this.showMoreInfo.value = true
  }

  calculatePopupPosition(event: MouseEvent): void {
    const buttonEl = event.currentTarget as HTMLElement
    const rect = buttonEl.getBoundingClientRect()

    let popupWidth = 200
    const popupGap = 15

    if (rect.right + popupWidth + popupGap > window.innerWidth) {
      this.popupLeft.value = rect.left + window.scrollX - popupWidth - popupGap
    } else {
      this.popupLeft.value = rect.right + window.scrollX + popupGap
    }

    this.popupTop.value = rect.top + window.scrollY
  }

  handleOnClickEvent(column: ManagementAccountTableColumn): void {
    if (this.isInPreviewMode) {
      return
    }

    try {
      column.onClick(column.type)
    } catch (e) {
      console.error(e)
    }
  }

  handleOnDeleteClickEvent(column: ManagementAccountTableColumn): void {
    if (!column.isDeletable) {
      return
    }

    try {
      column.onDeleteClick(column.type, column.id)
    } catch (e) {
      console.error(e)
    }
  }

  getEmptyRow(): ManagementAccountTableColumn[] {
    return [new ManagementAccountTableColumn("", "", "empty-row", 2, () => {})]
  }

  addBalanceSheetHeader(): void {
    let emptyRow = this.getEmptyRow()

    let companyNameHeaderColumn = new ManagementAccountTableColumn(
      this.company.value.getFullName(),
      "header",
      "company-name",
      2,
      () => {}
    )
    this.addToTableRow([companyNameHeaderColumn], true)

    let companyIncorporatedInColumn = new ManagementAccountTableColumn(
      "(Incorporated in Malaysia)",
      "header",
      "header",
      2,
      () => {}
    )
    this.addToTableRow([companyIncorporatedInColumn], true)

    let registrationNumberColumn = new ManagementAccountTableColumn(
      `Registration No. ${this.company.value.registrationNumberNew} (${this.company.value.registrationNumberOld})`,
      "header",
      "header",
      2,
      () => {}
    )
    this.addToTableRow([registrationNumberColumn], true)

    let balanceSheetTitleColumn = new ManagementAccountTableColumn(
      `Statement of Financial Position for the financial period as at ${this.time.formatDateOnlyFull(this.financialYearEndDate.value)}`,
      "header",
      "document-title",
      2,
      () => {}
    )
    this.addToTableRow([balanceSheetTitleColumn], true)

    this.addToTableRow(emptyRow, true)
    this.addToTableRow(emptyRow, true)
  }

  addPageBreak(isBalanceSheet: boolean): void {
    this.tables.value.push(new ManagementAccountTable(this.tableRows.value, isBalanceSheet))
    this.tableRows.value = []

    if (isBalanceSheet) {
      this.addBalanceSheetHeader()
    } else {
      this.addProfitLossHeader()
    }
  }

  addToTableRow(columns: ManagementAccountTableColumn[], isBalanceSheet: boolean, cssClass: string = ""): void {
    if (this.tableRows.value.length >= this.maxRowsPerPage) {
      this.addPageBreak(isBalanceSheet)
    }

    this.tableRows.value.push(new ManagementAccountTableRow(columns, cssClass))
  }

  addNoteColumnRow(content: string, type: string, isBalanceSheet: boolean, rowCssClass: string = "") {
    if (!this.isDocumentEditable.value) {
      return
    }

    let noteColumn = new ManagementAccountTableColumn(content, type, "note", 2, () => {})
    noteColumn.hasMoreInfo = true
    this.addToTableRow([noteColumn], isBalanceSheet, rowCssClass)
  }

  addAddItemColumnRow(type: string, isBalanceSheet: boolean, cta: Function, rowCssClass: string = ""): void {
    if (!this.isDocumentEditable.value) {
      return
    }

    let emptyRow = this.getEmptyRow()

    let addItemColumn = new ManagementAccountTableColumn("+ Add Item", type, "add-item", 2, cta)
    this.addToTableRow([addItemColumn], isBalanceSheet, rowCssClass)

    this.addToTableRow(emptyRow, true)
  }

  addManagementAccountDataToTableRows(
    data: CompanyManagementAccountData[],
    type: string,
    isBalanceSheet: boolean,
    cssClass: string = ""
  ): void {
    data.forEach((ca: CompanyManagementAccountData) => {
      let itemClass = !this.isDocumentEditable.value ? "" : "item"
      let itemColumn = new ManagementAccountTableColumn(ca.name, type, itemClass, 1, () => {}, ca.id)
      itemColumn.isEditable = this.isDocumentEditable.value
      itemColumn.hasOptions = true

      let itemAmountClass = !this.isDocumentEditable.value ? "amount-column" : "item-amount"
      let amountColumn = new ManagementAccountTableColumn(ca.amount, type, itemAmountClass, 1, () => {}, ca.id)
      amountColumn.isDeletable = this.isDocumentEditable.value
      amountColumn.isEditable = this.isDocumentEditable.value

      if (isBalanceSheet) {
        amountColumn.onDeleteClick = this.removeFromBalanceSheet.bind(this)
      } else {
        amountColumn.onDeleteClick = this.removeFromProfitLoss.bind(this)
      }

      this.addToTableRow([itemColumn, amountColumn], isBalanceSheet, cssClass)
    })
  }

  addSubtotalRow(totalName: string, total: number, isBalanceSheet: boolean, cssClass: string = ""): void {
    let itemColumn = new ManagementAccountTableColumn(totalName, "total", "sub-total-label", 1, () => {})

    let totalString = total.toFixed(2)
    if (total < 0) {
      totalString = `(${(-1 * total).toFixed(2)})`
    }
    let amountColumn = new ManagementAccountTableColumn(totalString, "total", "sub-total-amount", 1, () => {})

    this.addToTableRow([itemColumn, amountColumn], isBalanceSheet, cssClass)
  }

  addTotalRow(totalName: string, total: number, isBalanceSheet: boolean): void {
    let itemColumn = new ManagementAccountTableColumn(totalName, "total", "total-label", 1, () => {})

    let totalString = total.toFixed(2)
    if (total < 0) {
      totalString = `(${(-1 * total).toFixed(2)})`
    }
    let amountColumn = new ManagementAccountTableColumn(totalString, "total", "total-amount", 1, () => {})

    this.addToTableRow([itemColumn, amountColumn], isBalanceSheet)
  }

  addSectionTotalRow(totalName: string, total: number, isBalanceSheet: boolean): void {
    let itemColumn = new ManagementAccountTableColumn(totalName, "total", "section-total-label", 1, () => {})

    let totalString = total.toFixed(2)
    if (total < 0) {
      totalString = `(${(-1 * total).toFixed(2)})`
    }
    let amountColumn = new ManagementAccountTableColumn(totalString, "total", "section-total-amount", 1, () => {})

    this.addToTableRow([itemColumn, amountColumn], isBalanceSheet)
  }

  addGrandTotalRow(totalName: string, total: number, isBalanceSheet: boolean): void {
    this.addToTableRow(this.getEmptyRow(), isBalanceSheet)
    let itemColumn = new ManagementAccountTableColumn(totalName, "total", "grand-total-label", 1, () => {})

    let totalString = total.toFixed(2)
    if (total < 0) {
      totalString = `(${(-1 * total).toFixed(2)})`
    }
    let amountColumn = new ManagementAccountTableColumn(totalString, "total", "grand-total-amount", 1, () => {})

    this.addToTableRow([itemColumn, amountColumn], isBalanceSheet)
  }

  checkAddPageBreak(totalRowsToAdd: number, isBalanceSheet: boolean): void {
    let numberOfAccompanyingRows = this.isDocumentEditable.value ? 4 : 2
    let outcomeRows = this.tableRows.value.length + totalRowsToAdd + numberOfAccompanyingRows // always have accompanying rows
    if (outcomeRows > this.maxRowsPerPage) {
      this.addPageBreak(isBalanceSheet)
    }
  }

  addCurrentAssetsToTable(): void {
    this.checkAddPageBreak(this.companyManagementAccount.value.balanceSheet.currentAssets.length, true)
    let emptyRow = this.getEmptyRow()

    let currentAssetsTitleColumn = new ManagementAccountTableColumn(
      "Current Assets",
      "title",
      "sub-section-title",
      2,
      () => {}
    )
    this.addToTableRow([currentAssetsTitleColumn], true)

    this.addNoteColumnRow(
      "E.g. Inventory, Amount Due from Director, Trade Receivable or Debtor.",
      ManagementAccountConstants.MORE_INFO_TARGET_CURRENT_ASSETS,
      true
    )

    this.addManagementAccountDataToTableRows(
      this.companyManagementAccount.value.balanceSheet.currentAssets,
      ManagementAccountConstants.CONTENT_TYPE_CURRENT_ASSETS,
      true
    )

    this.addAddItemColumnRow(
      ManagementAccountConstants.CONTENT_TYPE_CURRENT_ASSETS,
      true,
      this.addToBalanceSheet.bind(this)
    )

    //Bank & cash
    this.checkAddPageBreak(this.companyManagementAccount.value.balanceSheet.bankCash.length, true)
    let bankCashTitleColumn = new ManagementAccountTableColumn(
      "Bank & Cash Equivalent",
      ManagementAccountConstants.CONTENT_TYPE_BANK_CASH,
      "child-section-title",
      2,
      () => {}
    )
    this.addToTableRow([bankCashTitleColumn], true, "child")

    this.addNoteColumnRow(
      "E.g. Cash in Hand, Bank, Petty Cash",
      ManagementAccountConstants.MORE_INFO_TARGET_CURRENT_ASSETS,
      true,
      "child"
    )

    this.addManagementAccountDataToTableRows(
      this.companyManagementAccount.value.balanceSheet.bankCash,
      ManagementAccountConstants.CONTENT_TYPE_BANK_CASH,
      true,
      "child"
    )

    this.addAddItemColumnRow(
      ManagementAccountConstants.CONTENT_TYPE_BANK_CASH,
      true,
      this.addToBalanceSheet.bind(this),
      "child"
    )

    this.addSubtotalRow(
      "Total Bank & Cash Equivalent",
      this.companyManagementAccount.value.balanceSheet.getTotalBankCash(),
      true,
      "child"
    )
    this.addTotalRow(
      "Total Current Assets",
      this.companyManagementAccount.value.balanceSheet.getTotalCurrentAssets(),
      true
    )
  }

  addNonCurrentAssetsToTable(): void {
    let emptyRow = this.getEmptyRow()

    let nonCurrentAssetsTitleColumn = new ManagementAccountTableColumn(
      "Non-Current Assets",
      "title",
      "sub-section-title",
      2,
      () => {}
    )
    this.addToTableRow([nonCurrentAssetsTitleColumn], true)

    this.addToTableRow(emptyRow, true)

    // PPE
    this.checkAddPageBreak(this.companyManagementAccount.value.balanceSheet.propertyPlantEquipment.length, true)
    let propertyPlantEquipmentTitleColumn = new ManagementAccountTableColumn(
      "Property, Plant & Equipment",
      ManagementAccountConstants.CONTENT_TYPE_PPE,
      "child-section-title",
      2,
      () => {}
    )
    this.addToTableRow([propertyPlantEquipmentTitleColumn], true, "child")

    this.addNoteColumnRow(
      "E.g. E.g. Property, Plant & Equipment at Cost and Accumulated Depreciation",
      ManagementAccountConstants.MORE_INFO_TARGET_NON_CURRENT_ASSETS,
      true,
      "child"
    )

    this.addManagementAccountDataToTableRows(
      this.companyManagementAccount.value.balanceSheet.propertyPlantEquipment,
      ManagementAccountConstants.CONTENT_TYPE_PPE,
      true,
      "child"
    )

    this.addAddItemColumnRow(
      ManagementAccountConstants.CONTENT_TYPE_PPE,
      true,
      this.addToBalanceSheet.bind(this),
      "child"
    )

    this.addSubtotalRow(
      "Total Property, Plant & Equipment",
      this.companyManagementAccount.value.balanceSheet.getTotalPropertyPlantEquipment(),
      true,
      "child"
    )

    // Motor vehicle
    this.checkAddPageBreak(this.companyManagementAccount.value.balanceSheet.motorVehicle.length, true)
    let motorVehicleTitleColumn = new ManagementAccountTableColumn(
      "Motor Vehicle",
      "title",
      "child-section-title",
      2,
      () => {}
    )
    this.addToTableRow([motorVehicleTitleColumn], true, "child")

    this.addNoteColumnRow(
      "E.g. Motor Vehicle at Cost and Accumulated Depreciation",
      ManagementAccountConstants.MORE_INFO_TARGET_NON_CURRENT_ASSETS,
      true,
      "child"
    )

    this.addManagementAccountDataToTableRows(
      this.companyManagementAccount.value.balanceSheet.motorVehicle,
      ManagementAccountConstants.CONTENT_TYPE_MOTOR_VEHICLE,
      true,
      "child"
    )

    this.addAddItemColumnRow(
      ManagementAccountConstants.CONTENT_TYPE_MOTOR_VEHICLE,
      true,
      this.addToBalanceSheet.bind(this),
      "child"
    )

    this.addSubtotalRow(
      "Total Motor Vehicle",
      this.companyManagementAccount.value.balanceSheet.getTotalMotorVehicle(),
      true,
      "child"
    )

    // Furnitures & Fittings
    this.checkAddPageBreak(this.companyManagementAccount.value.balanceSheet.furnituresFittings.length, true)
    let furnituresFittingsTitleColumn = new ManagementAccountTableColumn(
      "Furnitures & Fittings",
      ManagementAccountConstants.CONTENT_TYPE_FURNITURE_FITTINGS,
      "child-section-title",
      2,
      () => {}
    )
    this.addToTableRow([furnituresFittingsTitleColumn], true, "child")

    this.addNoteColumnRow(
      "E.g. Furnitures & Fittings at Cost and Accumulated Depreciation",
      ManagementAccountConstants.MORE_INFO_TARGET_NON_CURRENT_ASSETS,
      true,
      "child"
    )

    this.addManagementAccountDataToTableRows(
      this.companyManagementAccount.value.balanceSheet.furnituresFittings,
      ManagementAccountConstants.CONTENT_TYPE_FURNITURE_FITTINGS,
      true,
      "child"
    )

    this.addAddItemColumnRow(
      ManagementAccountConstants.CONTENT_TYPE_FURNITURE_FITTINGS,
      true,
      this.addToBalanceSheet.bind(this),
      "child"
    )

    this.addSubtotalRow(
      "Total Furnitures & Fittings",
      this.companyManagementAccount.value.balanceSheet.getTotalFurnituresFittings(),
      true,
      "child"
    )

    // Computer Software
    this.checkAddPageBreak(this.companyManagementAccount.value.balanceSheet.computerSoftware.length, true)
    let computerSoftwareTitleColumn = new ManagementAccountTableColumn(
      "Computer Software",
      ManagementAccountConstants.CONTENT_TYPE_COMPUTER_SOFTWARE,
      "child-section-title",
      2,
      () => {}
    )
    this.addToTableRow([computerSoftwareTitleColumn], true, "child")

    this.addNoteColumnRow(
      "E.g. Computer Software at Cost and Accumulated Depreciation",
      ManagementAccountConstants.MORE_INFO_TARGET_NON_CURRENT_ASSETS,
      true,
      "child"
    )

    this.addManagementAccountDataToTableRows(
      this.companyManagementAccount.value.balanceSheet.computerSoftware,
      ManagementAccountConstants.CONTENT_TYPE_COMPUTER_SOFTWARE,
      true,
      "child"
    )

    this.addAddItemColumnRow(
      ManagementAccountConstants.CONTENT_TYPE_COMPUTER_SOFTWARE,
      true,
      this.addToBalanceSheet.bind(this),
      "child"
    )

    this.addSubtotalRow(
      "Total Computer Software",
      this.companyManagementAccount.value.balanceSheet.getTotalComputerSoftware(),
      true,
      "child"
    )

    // Renovation
    this.checkAddPageBreak(this.companyManagementAccount.value.balanceSheet.renovation.length, true)
    let renovationTitleColumn = new ManagementAccountTableColumn(
      "Renovation",
      ManagementAccountConstants.CONTENT_TYPE_RENOVATION,
      "child-section-title",
      2,
      () => {}
    )
    this.addToTableRow([renovationTitleColumn], true, "child")

    this.addNoteColumnRow(
      "E.g. Renovation at Cost and Accumulated Depreciation",
      ManagementAccountConstants.MORE_INFO_TARGET_NON_CURRENT_ASSETS,
      true,
      "child"
    )

    this.addManagementAccountDataToTableRows(
      this.companyManagementAccount.value.balanceSheet.renovation,
      ManagementAccountConstants.CONTENT_TYPE_RENOVATION,
      true,
      "child"
    )

    this.addAddItemColumnRow(
      ManagementAccountConstants.CONTENT_TYPE_RENOVATION,
      true,
      this.addToBalanceSheet.bind(this),
      "child"
    )

    this.addSubtotalRow(
      "Total Renovation",
      this.companyManagementAccount.value.balanceSheet.getTotalRenovation(),
      true,
      "child"
    )

    this.addTotalRow(
      "Total Non-Current Assets",
      this.companyManagementAccount.value.balanceSheet.getTotalNonCurrentAssets(),
      true
    )
  }

  addOtherAssetsToTable(): void {
    this.checkAddPageBreak(this.companyManagementAccount.value.balanceSheet.otherAssets.length, true)
    let otherAssetsTitleColumn = new ManagementAccountTableColumn(
      "Other Assets",
      ManagementAccountConstants.CONTENT_TYPE_OTHER_ASSETS,
      "sub-section-title",
      2,
      () => {}
    )
    this.addToTableRow([otherAssetsTitleColumn], true)

    this.addNoteColumnRow(
      "E.g. Investment, Deposit & Repayment, Advance & Loan",
      ManagementAccountConstants.MORE_INFO_TARGET_OTHER_ASSETS,
      true,
      "child"
    )

    this.addManagementAccountDataToTableRows(
      this.companyManagementAccount.value.balanceSheet.otherAssets,
      ManagementAccountConstants.CONTENT_TYPE_OTHER_ASSETS,
      true
    )

    this.addAddItemColumnRow(
      ManagementAccountConstants.CONTENT_TYPE_OTHER_ASSETS,
      true,
      this.addToBalanceSheet.bind(this)
    )

    this.addTotalRow("Total Other Assets", this.companyManagementAccount.value.balanceSheet.getTotalOtherAssets(), true)
  }

  addEquityToTable(): void {
    this.checkAddPageBreak(this.companyManagementAccount.value.balanceSheet.equity.length, true)
    let equityTitleColumn = new ManagementAccountTableColumn(
      "Equity",
      ManagementAccountConstants.CONTENT_TYPE_EQUITY,
      "sub-section-title",
      2,
      () => {}
    )
    this.addToTableRow([equityTitleColumn], true)

    this.addNoteColumnRow(
      "E.g. Share Capital, Retained Earning",
      ManagementAccountConstants.MORE_INFO_TARGET_EQUITY,
      true
    )

    this.addManagementAccountDataToTableRows(
      this.companyManagementAccount.value.balanceSheet.equity,
      ManagementAccountConstants.CONTENT_TYPE_EQUITY,
      true
    )

    this.addAddItemColumnRow(ManagementAccountConstants.CONTENT_TYPE_EQUITY, true, this.addToBalanceSheet.bind(this))

    this.addTotalRow("Total Equity", this.companyManagementAccount.value.balanceSheet.getTotalEquity(), true)
  }

  addCurrentLiabilitiesToTable(): void {
    this.checkAddPageBreak(this.companyManagementAccount.value.balanceSheet.currentLiabilities.length, true)
    let emptyRow = this.getEmptyRow()

    let currentLiabilitiesTitleColumn = new ManagementAccountTableColumn(
      "Current Liabilities",
      "title",
      "sub-section-title",
      2,
      () => {}
    )
    this.addToTableRow([currentLiabilitiesTitleColumn], true)

    this.addNoteColumnRow(
      "E.g. Trade Payable or Creditor",
      ManagementAccountConstants.MORE_INFO_TARGET_CURRENT_LIABILITIES,
      true
    )

    this.addManagementAccountDataToTableRows(
      this.companyManagementAccount.value.balanceSheet.currentLiabilities,
      ManagementAccountConstants.CONTENT_TYPE_CURRENT_LIABILITIES,
      true
    )

    this.addAddItemColumnRow(
      ManagementAccountConstants.CONTENT_TYPE_CURRENT_LIABILITIES,
      true,
      this.addToBalanceSheet.bind(this)
    )

    this.addToTableRow(emptyRow, true)

    //Accruals
    this.checkAddPageBreak(this.companyManagementAccount.value.balanceSheet.accruals.length, true)
    let accrualsTitleColumn = new ManagementAccountTableColumn(
      "Accruals",
      ManagementAccountConstants.CONTENT_TYPE_ACCRUALS,
      "child-section-title",
      2,
      () => {}
    )
    this.addToTableRow([accrualsTitleColumn], true, "child")

    this.addNoteColumnRow(
      "E.g. Accrual Salary, PCB, EPF, SOCSO & EIS",
      ManagementAccountConstants.MORE_INFO_TARGET_CURRENT_LIABILITIES,
      true,
      "child"
    )

    this.addManagementAccountDataToTableRows(
      this.companyManagementAccount.value.balanceSheet.accruals,
      ManagementAccountConstants.CONTENT_TYPE_ACCRUALS,
      true,
      "child"
    )

    this.addAddItemColumnRow(
      ManagementAccountConstants.CONTENT_TYPE_ACCRUALS,
      true,
      this.addToBalanceSheet.bind(this),
      "child"
    )

    this.addSubtotalRow(
      "Total Accruals",
      this.companyManagementAccount.value.balanceSheet.getTotalAccruals(),
      true,
      "child"
    )
    this.addTotalRow(
      "Total Current Liabilities",
      this.companyManagementAccount.value.balanceSheet.getTotalCurrentLiabilities(),
      true
    )
  }

  addNonCurrentLiabilitiesToTable(): void {
    let emptyRow = this.getEmptyRow()

    let totalRowToFollow = this.companyManagementAccount.value.balanceSheet.corporateFinancing.length
    if (totalRowToFollow <= 0) {
      totalRowToFollow = this.companyManagementAccount.value.balanceSheet.hirePurchase.length
    }
    this.checkAddPageBreak(totalRowToFollow + 1, true)

    let nonCurrentLiabilitiesTitleColumn = new ManagementAccountTableColumn(
      "Non-Current Liabilities",
      "title",
      "sub-section-title",
      2,
      () => {}
    )
    this.addToTableRow([nonCurrentLiabilitiesTitleColumn], true)

    this.addToTableRow(emptyRow, true)

    // CorporateFinancing
    if (
      this.isDocumentEditable.value ||
      (!this.isDocumentEditable.value && this.companyManagementAccount.value.balanceSheet.corporateFinancing.length > 0)
    ) {
      this.checkAddPageBreak(this.companyManagementAccount.value.balanceSheet.corporateFinancing.length, true)
      let corporateFinancingTitleColumn = new ManagementAccountTableColumn(
        "Corporate Financing",
        ManagementAccountConstants.CONTENT_TYPE_CORPORATE_FINANCING,
        "child-section-title",
        2,
        () => {}
      )
      this.addToTableRow([corporateFinancingTitleColumn], true, "child")

      this.addNoteColumnRow(
        "E.g. Corporate Loan or Financing and interest",
        ManagementAccountConstants.MORE_INFO_TARGET_NON_CURRENT_LIABILITIES,
        true,
        "child"
      )

      this.addManagementAccountDataToTableRows(
        this.companyManagementAccount.value.balanceSheet.corporateFinancing,
        ManagementAccountConstants.CONTENT_TYPE_CORPORATE_FINANCING,
        true,
        "child"
      )

      this.addAddItemColumnRow(
        ManagementAccountConstants.CONTENT_TYPE_CORPORATE_FINANCING,
        true,
        this.addToBalanceSheet.bind(this),
        "child"
      )

      this.addSubtotalRow(
        "Total Corporate Financing",
        this.companyManagementAccount.value.balanceSheet.getTotalCorporateFinancing(),
        true,
        "child"
      )
    }

    // HirePurchase
    if (
      this.isDocumentEditable.value ||
      (!this.isDocumentEditable.value && this.companyManagementAccount.value.balanceSheet.hirePurchase.length > 0)
    ) {
      this.checkAddPageBreak(this.companyManagementAccount.value.balanceSheet.hirePurchase.length, true)
      let hirePurchaseTitleColumn = new ManagementAccountTableColumn(
        "Hire Purchase",
        ManagementAccountConstants.CONTENT_TYPE_HIRE_PURCHASE,
        "child-section-title",
        2,
        () => {}
      )
      this.addToTableRow([hirePurchaseTitleColumn], true, "child")

      this.addNoteColumnRow(
        "E.g. Hire Purchase Financing and interest",
        ManagementAccountConstants.MORE_INFO_TARGET_NON_CURRENT_LIABILITIES,
        true,
        "child"
      )

      this.addManagementAccountDataToTableRows(
        this.companyManagementAccount.value.balanceSheet.hirePurchase,
        ManagementAccountConstants.CONTENT_TYPE_HIRE_PURCHASE,
        true,
        "child"
      )

      this.addAddItemColumnRow(
        ManagementAccountConstants.CONTENT_TYPE_HIRE_PURCHASE,
        true,
        this.addToBalanceSheet.bind(this),
        "child"
      )

      this.addSubtotalRow(
        "Total Hire Purchase",
        this.companyManagementAccount.value.balanceSheet.getTotalHirePurchase(),
        true,
        "child"
      )
    }

    this.addTotalRow(
      "Total Non-Current Liabilities",
      this.companyManagementAccount.value.balanceSheet.getTotalNonCurrentLiabilities(),
      true
    )
  }

  addOtherLiabilitiesToTable(): void {
    if (
      !this.isDocumentEditable.value &&
      this.companyManagementAccount.value.balanceSheet.otherLiabilities.length <= 0
    ) {
      return
    }

    this.checkAddPageBreak(this.companyManagementAccount.value.balanceSheet.otherLiabilities.length, true)
    let otherLiabilitiesTitleColumn = new ManagementAccountTableColumn(
      "Other Liabilities",
      ManagementAccountConstants.CONTENT_TYPE_OTHER_LIABILITIES,
      "sub-section-title",
      2,
      () => {}
    )
    this.addToTableRow([otherLiabilitiesTitleColumn], true)

    this.addNoteColumnRow(
      "E.g. Investment, Deposit & Repayment, Advance & Loan",
      ManagementAccountConstants.MORE_INFO_TARGET_OTHER_LIABILITIES,
      true
    )

    this.addManagementAccountDataToTableRows(
      this.companyManagementAccount.value.balanceSheet.otherLiabilities,
      ManagementAccountConstants.CONTENT_TYPE_OTHER_LIABILITIES,
      true
    )

    this.addAddItemColumnRow(
      ManagementAccountConstants.CONTENT_TYPE_OTHER_LIABILITIES,
      true,
      this.addToBalanceSheet.bind(this)
    )

    this.addTotalRow(
      "Total Other Liabilities",
      this.companyManagementAccount.value.balanceSheet.getTotalOtherLiabilities(),
      true
    )

    this.addToTableRow(this.getEmptyRow(), true)
  }

  addProfitLossHeader(): void {
    let emptyRow = this.getEmptyRow()

    let companyNameHeaderColumn = new ManagementAccountTableColumn(
      this.company.value.getFullName(),
      "header",
      "company-name",
      2,
      () => {}
    )
    this.addToTableRow([companyNameHeaderColumn], false)

    let companyIncorporatedInColumn = new ManagementAccountTableColumn(
      "(Incorporated in Malaysia)",
      "header",
      "header",
      2,
      () => {}
    )
    this.addToTableRow([companyIncorporatedInColumn], false)

    let registrationNumberColumn = new ManagementAccountTableColumn(
      `Registration No. ${this.company.value.registrationNumberNew} (${this.company.value.registrationNumberOld})`,
      "header",
      "header",
      2,
      () => {}
    )
    this.addToTableRow([registrationNumberColumn], false)

    let balanceSheetTitleColumn = new ManagementAccountTableColumn(
      `Detailed Income Statement for the financial period for ${this.time.formatDateOnlyFull(this.financialYearStartDate.value)} to ${this.time.formatDateOnlyFull(this.financialYearEndDate.value)}`,
      "header",
      "document-title",
      2,
      () => {}
    )
    this.addToTableRow([balanceSheetTitleColumn], false)

    this.addToTableRow(emptyRow, false)
    this.addToTableRow(emptyRow, false)
  }

  addRevenuesToTable(): void {
    this.checkAddPageBreak(this.companyManagementAccount.value.profitLoss.revenue.length, false)
    let emptyRow = this.getEmptyRow()

    let revenueTitleColumn = new ManagementAccountTableColumn(
      "Revenue",
      ManagementAccountConstants.CONTENT_TYPE_REVENUE,
      "section-title",
      2,
      () => {}
    )
    this.addToTableRow([revenueTitleColumn], false)

    this.addNoteColumnRow(
      "E.g. Sales, Discount Given, Sales Return",
      ManagementAccountConstants.MORE_INFO_TARGET_REVENUE,
      false
    )

    this.addManagementAccountDataToTableRows(
      this.companyManagementAccount.value.profitLoss.revenue,
      ManagementAccountConstants.CONTENT_TYPE_REVENUE,
      false
    )

    this.addAddItemColumnRow(ManagementAccountConstants.CONTENT_TYPE_REVENUE, true, this.addToProfitLoss.bind(this))

    this.addSubtotalRow("Total Revenue", this.companyManagementAccount.value.profitLoss.getTotalRevenue(), false)
  }

  addCostOfGoodSoldsToTable(): void {
    this.checkAddPageBreak(this.companyManagementAccount.value.profitLoss.costOfGoodSold.length, false)
    let emptyRow = this.getEmptyRow()

    let costOfGoodSoldTitleColumn = new ManagementAccountTableColumn(
      "Cost of Good Sold",
      ManagementAccountConstants.CONTENT_TYPE_COGS,
      "sub-section-title",
      2,
      () => {}
    )
    this.addToTableRow([costOfGoodSoldTitleColumn], false)

    this.addNoteColumnRow(
      "E.g. Cost of Sales, Discount Received, Purchase Return",
      ManagementAccountConstants.MORE_INFO_TARGET_COST_OF_GOODS_SOLD,
      false
    )

    this.addManagementAccountDataToTableRows(
      this.companyManagementAccount.value.profitLoss.costOfGoodSold,
      ManagementAccountConstants.CONTENT_TYPE_COGS,
      false
    )

    this.addAddItemColumnRow(ManagementAccountConstants.CONTENT_TYPE_COGS, true, this.addToProfitLoss.bind(this))

    this.addSubtotalRow(
      "Total Cost of Good Sold",
      this.companyManagementAccount.value.profitLoss.getTotalCostOfGoodSold(),
      false
    )
  }

  addOtherIncomesToTable(): void {
    this.checkAddPageBreak(this.companyManagementAccount.value.profitLoss.otherIncome.length, false)
    let emptyRow = this.getEmptyRow()

    let otherIncomeTitleColumn = new ManagementAccountTableColumn(
      "Other Income",
      ManagementAccountConstants.CONTENT_TYPE_OTHER_INCOME,
      "sub-section-title",
      2,
      () => {}
    )
    this.addToTableRow([otherIncomeTitleColumn], false)

    this.addNoteColumnRow("E.g. Delivery Income", ManagementAccountConstants.MORE_INFO_TARGET_OTHER_INCOME, false)

    this.addManagementAccountDataToTableRows(
      this.companyManagementAccount.value.profitLoss.otherIncome,
      ManagementAccountConstants.CONTENT_TYPE_OTHER_INCOME,
      false
    )

    this.addAddItemColumnRow(
      ManagementAccountConstants.CONTENT_TYPE_OTHER_INCOME,
      true,
      this.addToProfitLoss.bind(this)
    )

    this.addSubtotalRow(
      "Total Other Income",
      this.companyManagementAccount.value.profitLoss.getTotalOtherIncome(),
      false
    )
  }

  addAdministrationExpensesToTable(): void {
    if (
      !this.isDocumentEditable.value &&
      this.companyManagementAccount.value.profitLoss.administrationExpenses.length <= 0
    ) {
      return
    }

    this.checkAddPageBreak(this.companyManagementAccount.value.profitLoss.administrationExpenses.length, false)

    let administrationExpensesTitleColumn = new ManagementAccountTableColumn(
      "Administration Expenses",
      ManagementAccountConstants.CONTENT_TYPE_ADMIN_EXPENSES,
      "sub-section-title",
      2,
      () => {}
    )
    this.addToTableRow([administrationExpensesTitleColumn], false, "child")

    this.addNoteColumnRow(
      "E.g. Water & Electricity, Audit Fees, Dues & Subscriptions",
      ManagementAccountConstants.MORE_INFO_TARGET_EXPENSES,
      false,
      "child"
    )

    this.addManagementAccountDataToTableRows(
      this.companyManagementAccount.value.profitLoss.administrationExpenses,
      ManagementAccountConstants.CONTENT_TYPE_ADMIN_EXPENSES,
      false,
      "child"
    )

    this.addAddItemColumnRow(
      ManagementAccountConstants.CONTENT_TYPE_ADMIN_EXPENSES,
      true,
      this.addToProfitLoss.bind(this),
      "child"
    )

    this.addSubtotalRow(
      "Total Administration Expenses",
      this.companyManagementAccount.value.profitLoss.getTotalAdministrationExpenses(),
      false,
      "child"
    )
  }

  addEmploymentExpensesToTable(): void {
    if (
      !this.isDocumentEditable.value &&
      this.companyManagementAccount.value.profitLoss.employmentExpenses.length <= 0
    ) {
      return
    }

    this.checkAddPageBreak(this.companyManagementAccount.value.profitLoss.employmentExpenses.length, false)

    let employmentExpensesTitleColumn = new ManagementAccountTableColumn(
      "Employment Expenses",
      ManagementAccountConstants.CONTENT_TYPE_EMPLOYMENT_EXPENSES,
      "sub-section-title",
      2,
      () => {}
    )
    this.addToTableRow([employmentExpensesTitleColumn], false, "child")

    this.addNoteColumnRow(
      "E.g. Salaries & Wages, Overtime, Medical & Insurance",
      ManagementAccountConstants.MORE_INFO_TARGET_EXPENSES,
      false,
      "child"
    )

    this.addManagementAccountDataToTableRows(
      this.companyManagementAccount.value.profitLoss.employmentExpenses,
      ManagementAccountConstants.CONTENT_TYPE_EMPLOYMENT_EXPENSES,
      false,
      "child"
    )

    this.addAddItemColumnRow(
      ManagementAccountConstants.CONTENT_TYPE_EMPLOYMENT_EXPENSES,
      true,
      this.addToProfitLoss.bind(this),
      "child"
    )

    this.addSubtotalRow(
      "Total Employment Expenses",
      this.companyManagementAccount.value.profitLoss.getTotalEmploymentExpenses(),
      false,
      "child"
    )
  }

  addTravellingExpensesToTable(): void {
    if (
      !this.isDocumentEditable.value &&
      this.companyManagementAccount.value.profitLoss.travellingExpenses.length <= 0
    ) {
      return
    }

    this.checkAddPageBreak(this.companyManagementAccount.value.profitLoss.travellingExpenses.length, false)

    let travellingExpensesTitleColumn = new ManagementAccountTableColumn(
      "Travelling Expenses",
      ManagementAccountConstants.CONTENT_TYPE_TRAVELLING_EXPENSES,
      "sub-section-title",
      2,
      () => {}
    )
    this.addToTableRow([travellingExpensesTitleColumn], false, "child")

    this.addNoteColumnRow(
      "E.g. Accommodation, Visa & Permit, Petrol, Toll & Parking",
      ManagementAccountConstants.MORE_INFO_TARGET_EXPENSES,
      false,
      "child"
    )

    this.addManagementAccountDataToTableRows(
      this.companyManagementAccount.value.profitLoss.travellingExpenses,
      ManagementAccountConstants.CONTENT_TYPE_TRAVELLING_EXPENSES,
      false,
      "child"
    )

    this.addAddItemColumnRow(
      ManagementAccountConstants.CONTENT_TYPE_TRAVELLING_EXPENSES,
      true,
      this.addToProfitLoss.bind(this),
      "child"
    )

    this.addSubtotalRow(
      "Total Travelling Expenses",
      this.companyManagementAccount.value.profitLoss.getTotalTravellingExpenses(),
      false,
      "child"
    )
  }

  addMaintenanceExpensesToTable(): void {
    if (
      !this.isDocumentEditable.value &&
      this.companyManagementAccount.value.profitLoss.maintenanceExpenses.length <= 0
    ) {
      return
    }

    this.checkAddPageBreak(this.companyManagementAccount.value.profitLoss.maintenanceExpenses.length, false)

    let maintenanceExpensesTitleColumn = new ManagementAccountTableColumn(
      "Maintenance Expenses",
      ManagementAccountConstants.CONTENT_TYPE_MAINTENANCE_EXPENSES,
      "sub-section-title",
      2,
      () => {}
    )
    this.addToTableRow([maintenanceExpensesTitleColumn], false, "child")

    this.addNoteColumnRow(
      "E.g. Accommodation, Visa & Permit, Petrol, Toll & Parking",
      ManagementAccountConstants.MORE_INFO_TARGET_EXPENSES,
      false,
      "child"
    )

    this.addManagementAccountDataToTableRows(
      this.companyManagementAccount.value.profitLoss.maintenanceExpenses,
      ManagementAccountConstants.CONTENT_TYPE_MAINTENANCE_EXPENSES,
      false,
      "child"
    )

    this.addAddItemColumnRow(
      ManagementAccountConstants.CONTENT_TYPE_MAINTENANCE_EXPENSES,
      true,
      this.addToProfitLoss.bind(this),
      "child"
    )

    this.addSubtotalRow(
      "Total Maintenance Expenses",
      this.companyManagementAccount.value.profitLoss.getTotalMaintenanceExpenses(),
      false,
      "child"
    )
  }

  addGeneralExpensesToTable(): void {
    if (!this.isDocumentEditable.value && this.companyManagementAccount.value.profitLoss.generalExpenses.length <= 0) {
      return
    }

    this.checkAddPageBreak(this.companyManagementAccount.value.profitLoss.generalExpenses.length, false)

    let generalExpensesTitleColumn = new ManagementAccountTableColumn(
      "General Expenses",
      ManagementAccountConstants.CONTENT_TYPE_GENERAL_EXPENSES,
      "sub-section-title",
      2,
      () => {}
    )
    this.addToTableRow([generalExpensesTitleColumn], false, "child")

    this.addNoteColumnRow(
      "E.g. Accommodation, Visa & Permit, Petrol, Toll & Parking",
      ManagementAccountConstants.MORE_INFO_TARGET_EXPENSES,
      false,
      "child"
    )

    this.addManagementAccountDataToTableRows(
      this.companyManagementAccount.value.profitLoss.generalExpenses,
      ManagementAccountConstants.CONTENT_TYPE_GENERAL_EXPENSES,
      false,
      "child"
    )

    this.addAddItemColumnRow(
      ManagementAccountConstants.CONTENT_TYPE_GENERAL_EXPENSES,
      true,
      this.addToProfitLoss.bind(this),
      "child"
    )

    this.addSubtotalRow(
      "Total General Expenses",
      this.companyManagementAccount.value.profitLoss.getTotalGeneralExpenses(),
      false,
      "child"
    )
  }

  //NOTE: This function is called every single time there is a change in the record
  async setupDocument(): Promise<void> {
    // await this.handleSave()
    this.tables.value = []
    this.tableRows.value = []

    let emptyRow = this.getEmptyRow()

    // Region balance sheet
    this.addBalanceSheetHeader()

    let assetsTitleColumn = new ManagementAccountTableColumn("Assets", "title", "section-title", 2, () => {})
    this.addToTableRow([assetsTitleColumn], true)
    this.addToTableRow(emptyRow, true)

    if (
      this.isDocumentEditable.value ||
      (!this.isDocumentEditable.value && this.companyManagementAccount.value.balanceSheet.hasCurrentAssets())
    ) {
      this.addCurrentAssetsToTable()
      this.addToTableRow(emptyRow, true)
    }

    if (
      this.isDocumentEditable.value ||
      (!this.isDocumentEditable.value && this.companyManagementAccount.value.balanceSheet.hasNonCurrentAssets())
    ) {
      this.addNonCurrentAssetsToTable()
      this.addToTableRow(emptyRow, true)
    }

    this.addOtherAssetsToTable()
    this.addSectionTotalRow("Total Assets", this.companyManagementAccount.value.balanceSheet.getTotalAssets(), true)
    this.addToTableRow(emptyRow, true)
    this.addToTableRow(emptyRow, true)

    this.addEquityToTable()
    this.addToTableRow(emptyRow, true)
    this.addToTableRow(emptyRow, true)

    let liabilitiesTitleColumn = new ManagementAccountTableColumn("Liabilities", "title", "section-title", 2, () => {})
    this.addToTableRow([liabilitiesTitleColumn], true)
    this.addToTableRow(emptyRow, true)

    if (
      this.isDocumentEditable.value ||
      (!this.isDocumentEditable.value && this.companyManagementAccount.value.balanceSheet.hasCurrentLiabilities())
    ) {
      this.addCurrentLiabilitiesToTable()
      this.addToTableRow(emptyRow, true)
    }

    if (
      this.isDocumentEditable.value ||
      (!this.isDocumentEditable.value && this.companyManagementAccount.value.balanceSheet.hasNonCurrentLiabilities())
    ) {
      this.addNonCurrentLiabilitiesToTable()
      this.addToTableRow(emptyRow, true)
    }

    this.addOtherLiabilitiesToTable()
    this.addTotalRow("Total Liabilities", this.companyManagementAccount.value.balanceSheet.getTotalLiabilities(), true)
    this.addSectionTotalRow(
      "Total Equity & Liabilities",
      this.companyManagementAccount.value.balanceSheet.getTotalEquityLiabilities(),
      true
    )
    // end region

    this.tables.value.push(new ManagementAccountTable(this.tableRows.value, true))
    this.tableRows.value = []

    //region p&l -- totally new page
    this.addProfitLossHeader()

    this.addRevenuesToTable()
    this.addToTableRow(emptyRow, false)
    this.addCostOfGoodSoldsToTable()
    this.addTotalRow("Gross Profit/(Loss)", this.companyManagementAccount.value.profitLoss.getTotalGrossProfit(), false)
    this.addToTableRow(emptyRow, false)
    this.addOtherIncomesToTable()
    this.addToTableRow(emptyRow, false)
    this.addToTableRow(emptyRow, false)

    if (
      this.isDocumentEditable.value ||
      (!this.isDocumentEditable.value && this.companyManagementAccount.value.profitLoss.hasExpensess())
    ) {
      let expensesTitleColumn = new ManagementAccountTableColumn("Expenses", "title", "section-title", 2, () => {})
      this.addToTableRow([expensesTitleColumn], false)
      this.addToTableRow(emptyRow, false)
    }

    this.addAdministrationExpensesToTable()
    this.addEmploymentExpensesToTable()
    this.addTravellingExpensesToTable()
    this.addMaintenanceExpensesToTable()
    this.addGeneralExpensesToTable()

    this.addTotalRow("Total Expenses", this.companyManagementAccount.value.profitLoss.getTotalExpenses(), false)
    this.addSectionTotalRow(
      "Profit/(Loss) Before Tax",
      this.companyManagementAccount.value.profitLoss.getTotalProfitBeforeTax(),
      false
    )

    this.tables.value.push(new ManagementAccountTable(this.tableRows.value, false))
  }

  getTables(): ManagementAccountTable[] {
    return this.tables.value
  }

  getTableForPage(pageNumber: number): ManagementAccountTable {
    let index = !this.isEnlarged.value ? this.currentPage.value - 1 : pageNumber
    let page = Math.max(0, Math.min(index, this.tables.value.length - 1))

    let table = this.tables.value[page]
    if (!table) {
      return new ManagementAccountTable([], true)
    }

    return this.tables.value[page]
  }

  getOptions(target: string): string[] {
    switch (target) {
      case ManagementAccountConstants.CONTENT_TYPE_BANK_CASH:
        return ManagementAccountConstants.BANK_CASH_OPTIONS
      case ManagementAccountConstants.CONTENT_TYPE_CURRENT_ASSETS:
        return ManagementAccountConstants.CURRENT_ASSETS_OPTIONS
      case ManagementAccountConstants.CONTENT_TYPE_PPE:
        return ManagementAccountConstants.PROPERTY_PLANT_EQUIPMENT_OPTIONS
      case ManagementAccountConstants.CONTENT_TYPE_MOTOR_VEHICLE:
        return ManagementAccountConstants.MOTOR_VEHICLE_OPTIONS
      case ManagementAccountConstants.CONTENT_TYPE_FURNITURE_FITTINGS:
        return ManagementAccountConstants.FURNITURES_FITTINGS_OPTIONS
      case ManagementAccountConstants.CONTENT_TYPE_COMPUTER_SOFTWARE:
        return ManagementAccountConstants.COMPUTER_SOFTWARE_OPTIONS
      case ManagementAccountConstants.CONTENT_TYPE_RENOVATION:
        return ManagementAccountConstants.RENOVATION_OPTIONS
      case ManagementAccountConstants.CONTENT_TYPE_OTHER_ASSETS:
        return ManagementAccountConstants.OTHER_ASSETS_OPTIONS
      case ManagementAccountConstants.CONTENT_TYPE_CURRENT_LIABILITIES:
        return ManagementAccountConstants.CURRENT_LIABILITIES_OPTIONS
      case ManagementAccountConstants.CONTENT_TYPE_ACCRUALS:
        return ManagementAccountConstants.ACCRUALS_OPTIONS
      case ManagementAccountConstants.CONTENT_TYPE_CORPORATE_FINANCING:
        return ManagementAccountConstants.CORPORATE_FINANCING_OPTIONS
      case ManagementAccountConstants.CONTENT_TYPE_HIRE_PURCHASE:
        return ManagementAccountConstants.HIRE_PURCHASE_OPTIONS
      case ManagementAccountConstants.CONTENT_TYPE_OTHER_LIABILITIES:
        return ManagementAccountConstants.OTHER_LIABILITIES_OPTIONS
      case ManagementAccountConstants.CONTENT_TYPE_EQUITY:
        return ManagementAccountConstants.EQUITY_OPTIONS
      case ManagementAccountConstants.CONTENT_TYPE_REVENUE:
        return ManagementAccountConstants.REVENUE_OPTIONS
      case ManagementAccountConstants.CONTENT_TYPE_COGS:
        return ManagementAccountConstants.COST_OF_GOOD_SOLD_OPTIONS
      case ManagementAccountConstants.CONTENT_TYPE_OTHER_INCOME:
        return ManagementAccountConstants.OTHER_INCOME_OPTIONS
      case ManagementAccountConstants.CONTENT_TYPE_ADMIN_EXPENSES:
        return ManagementAccountConstants.ADMINISTRATION_EXPENSES_OPTIONS
      case ManagementAccountConstants.CONTENT_TYPE_EMPLOYMENT_EXPENSES:
        return ManagementAccountConstants.EMPLOYMENT_EXPENSES_OPTIONS
      case ManagementAccountConstants.CONTENT_TYPE_TRAVELLING_EXPENSES:
        return ManagementAccountConstants.TRAVELLING_EXPENSES_OPTIONS
      case ManagementAccountConstants.CONTENT_TYPE_MAINTENANCE_EXPENSES:
        return ManagementAccountConstants.MAINTENANCE_EXPENSES_OPTIONS
      case ManagementAccountConstants.CONTENT_TYPE_GENERAL_EXPENSES:
        return ManagementAccountConstants.GENERAL_EXPENSES_OPTIONS
      default:
        return []
    }
  }

  isValueEditable(column: ManagementAccountTableColumn): boolean {
    return column.cssClass === "item" || column.cssClass === "item-amount"
  }

  isValueHasOptions(column: ManagementAccountTableColumn): boolean {
    return column.cssClass === "item"
  }

  hasMoreInfo(column: ManagementAccountTableColumn): boolean {
    return column.cssClass === "note"
  }

  onValueChanged(column: ManagementAccountTableColumn) {
    let listValues = []
    switch (column.type) {
      case ManagementAccountConstants.CONTENT_TYPE_BANK_CASH:
        listValues = this.companyManagementAccount.value.balanceSheet.bankCash
        break
      case ManagementAccountConstants.CONTENT_TYPE_CURRENT_ASSETS:
        listValues = this.companyManagementAccount.value.balanceSheet.currentAssets
        break
      case ManagementAccountConstants.CONTENT_TYPE_PPE:
        listValues = this.companyManagementAccount.value.balanceSheet.propertyPlantEquipment
        break
      case ManagementAccountConstants.CONTENT_TYPE_MOTOR_VEHICLE:
        listValues = this.companyManagementAccount.value.balanceSheet.motorVehicle
        break
      case ManagementAccountConstants.CONTENT_TYPE_FURNITURE_FITTINGS:
        listValues = this.companyManagementAccount.value.balanceSheet.furnituresFittings
        break
      case ManagementAccountConstants.CONTENT_TYPE_COMPUTER_SOFTWARE:
        listValues = this.companyManagementAccount.value.balanceSheet.computerSoftware
        break
      case ManagementAccountConstants.CONTENT_TYPE_RENOVATION:
        listValues = this.companyManagementAccount.value.balanceSheet.renovation
        break
      case ManagementAccountConstants.CONTENT_TYPE_OTHER_ASSETS:
        listValues = this.companyManagementAccount.value.balanceSheet.otherAssets
        break
      case ManagementAccountConstants.CONTENT_TYPE_CURRENT_LIABILITIES:
        listValues = this.companyManagementAccount.value.balanceSheet.currentLiabilities
        break
      case ManagementAccountConstants.CONTENT_TYPE_ACCRUALS:
        listValues = this.companyManagementAccount.value.balanceSheet.accruals
        break
      case ManagementAccountConstants.CONTENT_TYPE_CORPORATE_FINANCING:
        listValues = this.companyManagementAccount.value.balanceSheet.corporateFinancing
        break
      case ManagementAccountConstants.CONTENT_TYPE_HIRE_PURCHASE:
        listValues = this.companyManagementAccount.value.balanceSheet.hirePurchase
        break
      case ManagementAccountConstants.CONTENT_TYPE_OTHER_LIABILITIES:
        listValues = this.companyManagementAccount.value.balanceSheet.otherLiabilities
        break
      case ManagementAccountConstants.CONTENT_TYPE_EQUITY:
        listValues = this.companyManagementAccount.value.balanceSheet.equity
        break
      case ManagementAccountConstants.CONTENT_TYPE_REVENUE:
        listValues = this.companyManagementAccount.value.profitLoss.revenue
        break
      case ManagementAccountConstants.CONTENT_TYPE_COGS:
        listValues = this.companyManagementAccount.value.profitLoss.costOfGoodSold
        break
      case ManagementAccountConstants.CONTENT_TYPE_OTHER_INCOME:
        listValues = this.companyManagementAccount.value.profitLoss.otherIncome
        break
      case ManagementAccountConstants.CONTENT_TYPE_ADMIN_EXPENSES:
        listValues = this.companyManagementAccount.value.profitLoss.administrationExpenses
        break
      case ManagementAccountConstants.CONTENT_TYPE_EMPLOYMENT_EXPENSES:
        listValues = this.companyManagementAccount.value.profitLoss.employmentExpenses
        break
      case ManagementAccountConstants.CONTENT_TYPE_TRAVELLING_EXPENSES:
        listValues = this.companyManagementAccount.value.profitLoss.travellingExpenses
        break
      case ManagementAccountConstants.CONTENT_TYPE_MAINTENANCE_EXPENSES:
        listValues = this.companyManagementAccount.value.profitLoss.maintenanceExpenses
        break
      case ManagementAccountConstants.CONTENT_TYPE_GENERAL_EXPENSES:
        listValues = this.companyManagementAccount.value.profitLoss.generalExpenses
        break
      default:
        return []
    }

    let record = listValues.find((ca: CompanyManagementAccountData) => {
      return ca.id === column.id
    })

    if (!record) {
      return
    }

    if (column.cssClass === "item") {
      record.name = column.content
    }

    if (column.cssClass === "item-amount") {
      record.amount = column.content
    }

    this.setupDocument()
  }

  getDocumentName(pageNumber: number): string {
    let table = this.getTableForPage(pageNumber)
    if (!table) {
      return "Balance<br>Sheet"
    }

    return table.isBalanceSheet ? "Balance<br>Sheet" : "Profit &<br>Loss"
  }

  async onGoToPage(pageNumber: number): Promise<void> {
    if (pageNumber <= 0) {
      pageNumber = 1
    }

    if (pageNumber > this.tables.value.length) {
      pageNumber = this.tables.value.length
    }

    this.currentPage.value = pageNumber
  }

  onPageClick(): void {
    if (!this.canEnlargeDocument.value) {
      return
    }

    if (this.isEnlarged.value) {
      return
    }

    this.isEnlarged.value = true
    this.setDocumentContainerScale()
    this.eventManager.setIsDocumentActive(true)
  }

  onMinimizePage(): void {
    // this.emitEvents("back")
    this.isEnlarged.value = false
    this.setDocumentContainerScale()
    this.eventManager.setIsDocumentActive(false)
  }

  setDocumentContainerScale(): void {
    if (!this.canEnlargeDocument.value) {
      return
    }

    if (!this.documentContainerRef) {
      return
    }

    let scaleFactor = 1
    if (!this.isEnlarged.value) {
      let documentScaler = new DocumentScaler(PaperOrientation.Portrait)
      scaleFactor = documentScaler.scaleFactor
    }
    scaleFactor *= 100

    this.documentContainerRef.style.transform = `scale(${scaleFactor}%)`

    let paperHeightInPx = (297 / 25.4) * 96
    let paperWidthInPx = (210 / 25.4) * 96
    let scaledWidth = (scaleFactor / 100) * paperWidthInPx
    let scaledHeight = (scaleFactor / 100) * paperHeightInPx

    let instructionContainer = document.getElementById("document-slipcase-container")
    if (instructionContainer) {
      let top = scaledHeight - 150
      instructionContainer.style.width = `${scaledWidth}px`
      instructionContainer.style.top = `${top}px`
    }

    let documentWrapper = document.getElementById("document-wrapper")
    if (documentWrapper) {
      documentWrapper.style.width = `${scaledWidth}px`
      documentWrapper.style.height = `${scaledHeight}px`
    }
  }

  isInitialInstructionsShowing(): boolean {
    return this.tables.value.length > 0 && this.showInitialInstructions.value && this.isDocumentEditable.value
  }

  isSavingMarkerShowing(): boolean {
    return this.autoSave.value.isSaving || this.autoSave.value.hasSaveOnce
  }

  async handleSave(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyManagementAccount.value.id)) {
      return
    }
    // await setTimeout(async () => {
    await this.autoSave.value.save(this.initialRecord.value, this.companyManagementAccount.value)
    this.initialRecord.value.cloneDetails(this.companyManagementAccount.value as CompanyManagementAccount)
    // }, 1000)
  }

  async onSaveDocumentClicked(): Promise<void> {
    await this.autoSave.value.save(this.initialRecord.value, this.companyManagementAccount.value)
    this.initialRecord.value.cloneDetails(this.companyManagementAccount.value as CompanyManagementAccount)
  }

  // OCR feature
  showOcrContainer(): boolean {
    if (this.isInPreviewMode) {
      return false
    }

    return (
      this.tables.value.length > 0 &&
      (this.dragAndDropFile.value.isDragging || this.isOcrRunning.value) &&
      this.isDocumentEditable.value
    )
  }

  preventDefaults(e: Event): void {
    this.dragAndDropFile.value.preventDefaults(e)
  }

  handleDragEnter(e: DragEvent): void {
    this.dragAndDropFile.value.handleDragEnter(e)
  }

  handleDragLeave(e: DragEvent): void {
    this.dragAndDropFile.value.handleDragLeave(e)
  }

  handleDrop(e: DragEvent): void {
    if (!this.isDocumentEditable.value) {
      return
    }

    this.dragAndDropFile.value.handleDrop(e)

    if (!this.dragAndDropFile.value.files) {
      this.isOcrActivated.value = false
      return
    }

    if (this.isOcrActivated.value) {
      return
    }

    this.isOcrActivated.value = true
    this.activateOcr()
  }

  async activateOcr(): Promise<void> {
    if (this.isOcrRunning.value || !this.dragAndDropFile.value.file) {
      return
    }

    let droppedFile = this.dragAndDropFile.value.file as File
    this.ocr.value.documentCategory = DocumentTypes.CATEGORY_FINANCIAL
    this.isOcrRunning.value = true
    this.isOcrCompleted.value = false
    await this.ocr.value.processFile(droppedFile)
    await this.ocr.value.run()

    this.checkOcrStatus()
  }

  checkOcrStatus(): void {
    if (this.ocr.value.isProcessing) {
      setTimeout(() => {
        this.checkOcrStatus()
      }, 500)
      return
    }

    this.isOcrRunning.value = false
    this.postOcrCompleted()
  }

  getOcrProgress(): number {
    if (!this.isOcrRunning.value) {
      return 0
    }

    return this.ocr.value.progressValue()
  }

  postOcrCompleted(): void {
    this.isOcrCompleted.value = true

    if (!this.postOcrProcessPopupRef) {
      return
    }

    this.jobStatusResponses.value = this.ocr.value.geminiAi.jobStatuses.map((js: GeminiAiJobStatusResponse) => {
      return new GeminiAiJobStatusResponse(js)
    })

    this.postOcrProcessPopupRef.show()
  }

  onSelectedDocumentTypeChanged(selectedDocumentType: string): void {
    this.selectedDocumentType.value = selectedDocumentType
    this.ocr.value.selectedDocumentType = selectedDocumentType
  }

  onRerun(): void {
    this.deactivateOcr()
  }

  async onDataAccepted(postOcrManagementAccountDatas: PostOcrManagementAccountData[]): Promise<void> {
    postOcrManagementAccountDatas.forEach((data: PostOcrManagementAccountData) => {
      this.ocr.value.ocrDataProcessor.addToManagementAccount(
        this.selectedDocumentType.value,
        data,
        this.companyManagementAccount.value as CompanyManagementAccount
      )
    })

    await this.setupDocument()

    this.ocr.value.target = CompanyConstants.TARGET_MANAGEMENT_ACCOUNT
    this.ocr.value.targetId = this.companyManagementAccount.value.id
    await this.ocr.value.saveGeminiAiSession()

    this.deactivateOcr()
  }

  async onAddOcrData(data: ProcessedOcrManagementAccountData): Promise<void> {
    if (data.isDebitBalanceSheet) {
      let dataList = this.companyManagementAccount.value.balanceSheet.getList(data.debitTarget)
      let matchedRecord = dataList.find((d: CompanyManagementAccountData) => {
        return d.name === data.debitData.name
      })
      if (matchedRecord) {
        matchedRecord.amount = (Number(matchedRecord.amount) + Number(data.debitData.amount)).toFixed(2)
      } else {
        dataList.push(data.debitData)
      }

      this.companyManagementAccount.value.balanceSheet.setList(data.debitTarget, dataList)
    }

    if (data.isDebitProfitLoss) {
      let dataList = this.companyManagementAccount.value.profitLoss.getList(data.debitTarget)
      let matchedRecord = dataList.find((d: CompanyManagementAccountData) => {
        return d.name === data.debitData.name
      })
      if (matchedRecord) {
        matchedRecord.amount = (Number(matchedRecord.amount) + Number(data.debitData.amount)).toFixed(2)
      } else {
        dataList.push(data.debitData)
      }

      this.companyManagementAccount.value.profitLoss.setList(data.debitTarget, dataList)
    }

    if (data.isCreditBalanceSheet) {
      let dataList = this.companyManagementAccount.value.balanceSheet.getList(data.creditTarget)
      let matchedRecord = dataList.find((d: CompanyManagementAccountData) => {
        return d.name === data.creditData.name
      })
      if (matchedRecord) {
        matchedRecord.amount = (Number(matchedRecord.amount) - Number(data.creditData.amount)).toFixed(2)
      } else {
        data.creditData.amount = (1 * Number(data.creditData.amount)).toFixed(2)
        dataList.push(data.creditData)
      }

      this.companyManagementAccount.value.balanceSheet.setList(data.creditTarget, dataList)
    }

    if (data.isCreditProfitLoss) {
      let dataList = this.companyManagementAccount.value.profitLoss.getList(data.creditTarget)
      let matchedRecord = dataList.find((d: CompanyManagementAccountData) => {
        return d.name === data.creditData.name
      })
      if (matchedRecord) {
        matchedRecord.amount = (Number(matchedRecord.amount) - Number(data.creditData.amount)).toFixed(2)
      } else {
        data.creditData.amount = (1 * Number(data.creditData.amount)).toFixed(2)
        dataList.push(data.creditData)
      }

      this.companyManagementAccount.value.profitLoss.setList(data.creditTarget, dataList)
    }

    await this.setupDocument()

    this.ocr.value.target = CompanyConstants.TARGET_MANAGEMENT_ACCOUNT
    this.ocr.value.targetId = this.companyManagementAccount.value.id
    await this.ocr.value.saveGeminiAiSession()

    this.deactivateOcr()
  }

  deactivateOcr(): void {
    this.isOcrActivated.value = false

    //reset Ocr class?
    this.ocr.value.resetValues()
    this.jobStatusResponses.value = []
  }

  getOcrPdfFileUrl(): string | null {
    return this.ocr.value.pdfFileUrl
  }

  getOcrBase64Image(): string | null {
    if (!this.ocr.value.base64Image) {
      return null
    }

    let mimeType = this.dragAndDropFile.value.file?.type
    let base64Image = `data:${mimeType};base64,${this.ocr.value.base64Image}`

    return base64Image
  }

  //copywriting
  backButtonLabel(): string {
    return this.language.isMalay() ? "Kembali" : "Back"
  }

  proceedButtonLabel(): string {
    return this.language.isMalay() ? "Teruskan" : "Proceed"
  }

  dragAndDropCopywriting(): string {
    if (this.isOcrRunning.value) {
      return this.language.isMalay() ? "Kami sedang memproses" : "We are processing"
    }

    return this.language.isMalay() ? "Seret dan Lepas" : "Drag and Drop"
  }

  documentCopywriting(): string {
    return this.language.isMalay() ? "Dokumen Anda" : "Your Document"
  }

  hereCopywriting(): string {
    if (this.isOcrRunning.value) {
      return ""
    }

    return this.language.isMalay() ? "Di Sini" : "Here"
  }

  instructionNoteCopywriting(): string {
    if (this.isOcrRunning.value) {
      return this.language.isMalay()
        ? "Sila sabar... jangan muat semula muka ini!"
        : "Please be patient... do not refresh!"
    }

    return this.language.isMalay()
      ? "Sila maklum bahawa OCR kami hanya dapat mengesan nombor."
      : "Please note that our OCR can only detect numbers."
  }

  documentInstructionTitleCopwriting(): string {
    return this.language.isMalay() ? "Ini adalah Akaun Pengurusan" : "This is a Management Account."
  }

  documentLearnMoreTitleCopwriting(): string {
    if (this.isShowInfoOCR.value) {
      return this.language.isMalay() ? "OCR Feature (Experimental)" : "OCR Feature (Experimental)"
    }

    return this.language.isMalay() ? "Learn More: Management Accounts" : "Learn More: Management Accounts"
  }

  documentLearnMoreContentCopywriting(): string {
    if (this.isShowInfoOCR.value) {
      return this.language.isMalay()
        ? `
          <p>
            Ciri OCR ini masih dalam peringkat percubaan, dan kami sedang menambah baik ketepatannya secara berterusan.<br>
            Anda boleh seret dan lepaskan mana-mana imej ke atas dokumen Management Account untuk mula menggunakan ciri ini.<br>
            Sila elakkan daripada menyegarkan (refresh) halaman semasa proses sedang berjalan.
          </p>
          <p>
            Buat masa ini, penggunaan ciri ini adalah tanpa had.<br>
            Walau bagaimanapun, ini mungkin berubah pada masa akan datang, di mana penggunaan akan dikenakan caj berdasarkan token.
          </p>
          <p>
            Terima kasih kerana menggunakan ciri ini, dan kami berharap ia dapat membantu anda.
          </p>`
        : `
          <p>
            Our OCR feature is still experimental, and we’re continuously working to improve its accuracy.<br>
            Simply drag and drop any image onto the Management Account document to get started.<br>
            Please avoid refreshing the page while processing is in progress.
          </p>
          <p>
            Currently, usage for this feature is unlimited.<br>
            This may change in the future, where usage will be charged based on tokens.
          </p>
          <p>
            Thank you for using this feature, and we hope you find it helpful.
          </p>`
    }

    return this.language.isMalay()
      ? `
      <p>  
        Akaun Pengurusan merujuk kepada laporan kewangan dalaman yang disediakan oleh Syarikat untuk pemantauan operasi, analisis prestasi, dan tujuan membuat keputusan. Laporan ini tidak mempunyai format yang ditetapkan dan boleh disediakan secara bulanan, suku tahunan, atau secara ad hoc bergantung kepada keperluan perniagaan. Berbeza dengan Penyata Kewangan, Akaun Pengurusan bukanlah dokumen statutori dan tidak perlu dikemukakan kepada Suruhanjaya Syarikat Malaysia (SSM) atau mana-mana pihak berkuasa kawal selia.
      <p>
      <p>
        Di bawah Akta Syarikat 2016, sesebuah syarikat dikehendaki untuk menyimpan rekod perakaunan yang teratur dan menyediakan Penyata Kewangan bagi setiap tahun kewangan. Akaun Pengurusan tidak diwajibkan secara khusus oleh undang-undang. Walau bagaimanapun, ia lazimnya diperoleh daripada rekod perakaunan asas yang sama seperti yang dikehendaki di bawah Seksyen 245 Akta Syarikat 2016, yang mewajibkan Pengarah memastikan rekod perakaunan dan rekod lain disimpan dengan sempurna untuk menerangkan transaksi dan kedudukan kewangan Syarikat dengan mencukupi. Oleh itu, walaupun Akaun Pengurusan tidak difailkan atau dikawal selia, ia memainkan peranan sokongan dalam memastikan Syarikat mampu menyediakan Penyata Kewangan yang tepat dan mematuhi keperluan.
      </p>
      <p>
        Dalam amalan, Akaun Pengurusan berfungsi sebagai alat dalaman yang penting. Ia membolehkan pemantauan prestasi melalui penjejakan hasil, kos, dan margin bagi setiap tempoh, menyokong pembuatan keputusan oleh pengurusan dan Pengarah, memberikan gambaran aliran tunai dan kecairan, serta membolehkan pengesanan awal risiko kewangan atau ketidakteraturan sebelum akhir tahun. Ia juga berfungsi sebagai asas kerja bagi penyediaan Penyata Kewangan akhir sama ada diaudit atau tidak diaudit.
      </p>
      <p>
        Akaun Pengurusan boleh disediakan oleh kakitangan kewangan dalaman, akauntan luar atau penyedia perkhidmatan, malah oleh Pengarah atau pemilik perniagaan bagi PKS yang lebih kecil. Tiada keperluan statutori untuk akaun ini diaudit atau disediakan oleh juruaudit berlesen. Namun begitu, ketepatan, konsistensi, dan penyimpanan rekod yang baik tetap penting kerana rekod ini menjadi asas kepada Penyata Kewangan statutori Syarikat.
      </p>
      <p>
        Adalah penting untuk membezakan Akaun Pengurusan daripada Penyata Kewangan. Akaun Pengurusan digunakan untuk tujuan dalaman, fleksibel dari segi format, disediakan mengikut keperluan, dan tidak dihantar kepada SSM. Sebaliknya, Penyata Kewangan adalah keperluan statutori, disediakan setiap tahun, mematuhi piawaian pelaporan seperti MPERS atau MFRS, dan mungkin tertakluk kepada audit bergantung kepada kelayakan Syarikat. Hanya satu set Penyata Kewangan diperlukan bagi setiap tahun kewangan untuk tujuan statutori.
      </p>
      <p>
        Walaupun tidak diwajibkan oleh undang-undang, penyediaan Akaun Pengurusan yang terkini memastikan Syarikat sentiasa peka dan mengawal kedudukan kewangannya sepanjang tahun, serta meningkatkan ketepatan dan kecekapan penyediaan Penyata Kewangan pada akhir tahun. Dalam konteks ini, Akaun Pengurusan bukan sekadar keperluan pematuhan, tetapi merupakan keperluan tadbir urus dan operasi yang menghubungkan aktiviti harian perniagaan dengan pelaporan statutori.
      </p>
      <b>Rujukan:</b> Seksyen 245 dan Seksyen 248 Akta Syarikat 2016.`
      : `
      <p>  
        Management Accounts refer to internally prepared financial reports used by the Company for operational monitoring, performance analysis, and decision-making. These reports are not prescribed in format and may be prepared on a monthly, quarterly, or ad hoc basis depending on the needs of the business. Unlike Financial Statements, Management Accounts are not statutory documents and are not required to be lodged with the Companies Commission of Malaysia (SSM) or any regulatory authority.
      <p>
      <p>
        Under the Companies Act 2016, a company is required to keep proper accounting records and to prepare Financial Statements for each financial year. Management Accounts are not expressly mandated by law. However, they are commonly derived from the same underlying accounting records required under Section 245 of the Companies Act 2016, which obliges Directors to ensure that proper accounting and other records are kept to sufficiently explain the transactions and financial position of the Company. As such, while Management Accounts themselves are not filed or regulated, they play a supporting role in ensuring that the Company is able to produce accurate and compliant Financial Statements.
      </p>
      <p>
        In practice, Management Accounts serve as a critical internal tool. They enable performance monitoring by tracking revenue, costs, and margins across periods, support informed decision-making by management and Directors, provide visibility over cash flow and liquidity, and allow early detection of financial risks or irregularities before year-end. They also function as the working layer from which the final Financial Statements—whether audited or unaudited—are prepared.
      </p>
      <p>
        Management Accounts may be prepared by internal finance personnel, external accountants or service providers, or even Directors and business owners in smaller SMEs. There is no statutory requirement for these accounts to be audited or prepared by a licensed auditor. However, accuracy, consistency, and proper record-keeping remain essential, as these records ultimately underpin the Company’s statutory Financial Statements.
      </p>
      <p>
        It is important to distinguish Management Accounts from Financial Statements. Management Accounts are for internal use, flexible in format, prepared as frequently as needed, and not submitted to SSM. Financial Statements, on the other hand, are a statutory requirement, prepared annually, follow prescribed reporting standards such as MPERS or MFRS, and may be subject to audit depending on the Company’s eligibility. Only one set of Financial Statements is required per financial year for statutory purposes.
      </p>
      <p>
        While not legally required, maintaining up-to-date Management Accounts ensures that the Company remains financially aware and in control throughout the year, and significantly improves the accuracy and efficiency of year-end Financial Statement preparation. In this sense, Management Accounts are not a compliance obligation, but a governance and operational necessity that bridges daily business activity with statutory reporting.
      </p>
      <b>Reference:</b> Section 245 and Section 248 of the Companies Act 2016.`
  }

  savingMarkerCopywriting(): string {
    return this.language.isMalay() ? "Sedang dikemaskini..." : "Saving..."
  }

  savingIconClass(): string {
    return this.autoSave.value.isSaving ? "fa-spinner fa-spin" : "fa-circle-check"
  }

  savingIconTooltip(): string {
    if (!this.autoSave.value.hasSaveOnce) {
      return ""
    }

    if (this.autoSave.value.isSaving) {
      return ""
    }

    return this.language.isMalay() ? "Perubahan dikemaskini" : "Your changes saved!"
  }

  moreInfoTitle(): string {
    return this.moreInfoDetail.value.name
  }

  moreInfoDescription(): string {
    let examples = this.moreInfoDetail.value.examples
      .map((example: ManagementAccountItemExample) => {
        return `
        <li>
          <b>${example.name}</b>
          <br>
          ${example.description}
          <br><br>
          <b>${this.language.isMalay() ? "Kenapa penting" : "Why it matters"}?</b>: ${example.whyItMatters}
        </li>
      `
      })
      .join("")

    let description = `
      ${this.moreInfoDetail.value.whatIsIt}   
      <br><br>
      <b>${this.language.isMalay() ? "Kenapa" : "Why are"} ${this.moreInfoDetail.value.name} ${this.language.isMalay() ? "penting" : "important"}?</b>
      <br><br>
      ${this.moreInfoDetail.value.importance}
    `
    return description
  }

  setActionTrayElements(): void {
    this.actionTrayElements.value = [
      new ActionTrayElement("back", this.onBackButtonClicked.bind(this), {
        label: new ActionTrayLabel("Back", "Kembali"),
        iconClass: "fa-solid fa-arrow-left",
        isIconStart: true,
      }),

      new ActionTrayElement("amend", this.onSaveDocumentClicked.bind(this), {
        label: new ActionTrayLabel("Save Document", "Simpan"),
      }),

      new ActionTrayDropdown(
        "ocr-feature",
        {
          label: new ActionTrayLabel("OCR:", "OCR:"),
          badge: new ActionTrayLabel("Unlimited", "Unlimited"),
        },
        [
          new ActionTrayElement("add-token", this.onOCRInfoClicked.bind(this), {
            label: new ActionTrayLabel("Add OCR Token", "Add OCR Token"),
            subLabel: new ActionTrayLabel("Unlimited Token remaining", "Unlimited Token remaining"),
          }),
          new ActionTrayElement("learn-more-ocr", this.onOCRInfoClicked.bind(this), {
            label: new ActionTrayLabel("About OCR Feature", "About OCR Feature"),
            subLabel: new ActionTrayLabel("Learn More about OCR feature", "Learn More about OCR feature"),
          }),
        ]
      ),

      new ActionTrayDropdown(
        "more-dropdown",
        {
          iconClass: "fa-solid fa-ellipsis",
          isIconOnly: true,
        },
        [
          new ActionTrayElement("certify", () => {}, {
            label: new ActionTrayLabel("Certify", "Sahkan"),
            isDisabled: true,
          }),
          new ActionTrayElement("download", () => {}, {
            label: new ActionTrayLabel("Download", "Muat Turun"),
            isDisabled: true,
          }),
          new ActionTrayElement("learn-more", this.onMoreDetailClicked.bind(this), {
            label: new ActionTrayLabel("Learn More", "Maklumat Lanjut"),
          }),
        ]
      ),
    ]
  }

  onBackButtonClicked(): void {
    if (this.isEnlarged.value) {
      this.onMinimizePage()
    } else {
      this.emitEvents("back")
    }
  }

  onMoreDetailClicked(): void {
    this.isShowInfoOCR.value = false
    this.isShowInfo.value = !this.isShowInfo.value
    this.setActionTrayElements()
  }

  onOCRInfoClicked(): void {
    this.isShowInfoOCR.value = true
    this.isShowInfo.value = !this.isShowInfo.value
    this.setActionTrayElements()
  }

  loaderLabel(): string {
    return this.language.isMalay() ? "Sedang Menyediakan" : "Preparing Your"
  }

  loaderSublabel(): string {
    return this.language.isMalay() ? "Akaun Pengurusan Anda" : "Management Account"
  }

  get isInPreviewMode(): boolean {
    return StringUtil.isNullOrEmpty(this.companyManagementAccount.value.id)
  }
}
