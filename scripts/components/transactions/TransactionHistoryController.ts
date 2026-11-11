import { StatusConstants } from "~/scripts/constants/Status"
import { TransactionConstants } from "~/scripts/constants/Transactions"
import { Error } from "~/scripts/library/Error"
import { Filter } from "~/scripts/library/Filter"
import { ReceiptInvoiceGenerator } from "~/scripts/library/ReceiptInvoiceGenerator"
import { TransactionHistory } from "~/scripts/models/TransactionHistory"
import { ActionTrayDropdown } from "~/scripts/types/action-trays/ActionTrayDropdown"
import {
  ActionTrayElement,
  ActionTrayElementParams,
  ActionTrayLabel,
} from "~/scripts/types/action-trays/ActionTrayElement"
import { SortConstants } from "~/scripts/constants/Sorts"
import { FileZipper } from "~/scripts/utils/FileZipper"
import { PaymentOrder } from "~/scripts/models/PaymentOrder"
import { DownloadFileData } from "~/scripts/types/DownloadFileData"
import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"
import { SelectOption } from "~/scripts/types/SelectOption"
import { StringUtil } from "~/scripts/utils/String"

export class TransactionHistoryController {
  dayjs = useDayjs()
  language = useLanguage()
  router = useRouter()
  awsApi = useAwsStore()
  orderRepository = useOrderStore()
  servicePricingRepository = useServicePricingStore()

  searchText: Ref<string> = ref<string>("")

  firstRecordYear: number = 2023 //This is const and cannot change

  sortBy: Ref<string> = ref<string>(TransactionConstants.LABEL_PAY_DATE)
  orderBy: Ref<string> = ref<string>(SortConstants.ORDER_ASC)

  currentYear = ref<number>(0)
  previousYear = ref<number>(0)
  twoYearsAgo = ref<number>(0)
  years = ref<number[]>([])

  isLoading: Ref<boolean> = ref<boolean>(true)
  totalTransactionSelected: Ref<number> = ref<number>(0)
  transactionHistoriesByYear = ref<Record<number, TransactionHistory[]>>({})
  emptyYears = ref<number[]>([])
  hasInitializedEmptyYears = false

  transactionRepository = useTransactionStore()
  userArchiveAccessRepository = useUserArchiveAccessStore()
  receiptInvoiceGenerator: ReceiptInvoiceGenerator = new ReceiptInvoiceGenerator()

  hasArchivedData = ref<boolean>(false)
  hasAccessToArchivedData = ref<boolean>(false)

  isGeneratingDocuments = ref<boolean>(false)

  paymentOrderForReceipt = ref<PaymentOrder>(new PaymentOrder())
  paymentOrderIdForReceipt = ref<string | null>(null)

  transactionYearRefs: any = ref([])
  actionTrayRef: any | null = null
  receiptRef: any | null = null

  actionTrayElements: Ref<ActionTrayElement[]> = ref<ActionTrayElement[]>([])

  constructor() {
    this.currentYear.value = this.dayjs().year()
    this.previousYear.value = this.dayjs().year() - 1
    this.twoYearsAgo.value = this.dayjs().year() - 2

    this.init()
  }

  async init(): Promise<void> {
    this.hasAccessToArchivedData.value = true
    this.hasArchivedData.value = true
    // await this.checkHasArchivedTransactions()

    this.setupYears()
    this.setTrayActions()
  }

  setTransactionYearRefs(ref: any): void {
    this.transactionYearRefs = ref
  }

  setActionTrayRef(ref: any): void {
    this.actionTrayRef = ref
    this.setTrayActions()
  }

  setReceiptRef(receiptRef: any) {
    this.receiptRef = receiptRef
  }

  setTrayActions(): void {
    let actionDropDownElement = new ActionTrayDropdown(
      "share-dropdown",
      {
        label: new ActionTrayLabel("Action", "Action"),
        isDisabled: this.isGeneratingDocuments.value,
        iconClass: this.isGeneratingDocuments.value ? "fa-solid fa-spinner fa-spin" : "",
        isIconStart: true,
      },
      [
        new ActionTrayElement("download-all", this.onDownloadAllSelected.bind(this), {
          label: new ActionTrayLabel("Download", "Download"),
          subLabel: new ActionTrayLabel("Selected Item", "Selected Item"),
          isDisabled: this.isActionDisabled(),
        }),

        new ActionTrayElement("print-all", this.onPrintAllSelected.bind(this), {
          label: new ActionTrayLabel("Print", "Print"),
          subLabel: new ActionTrayLabel("Selected Item", "Selected Item"),
          isDisabled: this.isActionDisabled(),
        }),

        new ActionTrayElement("email-all", this.onEmailAllSelected.bind(this), {
          label: new ActionTrayLabel("Email", "Email"),
          subLabel: new ActionTrayLabel("Selected Item", "Selected Item"),
          isDisabled: this.isActionDisabled(),
        }),
      ],
      this.isShareDropdownOpen()
    )
    actionDropDownElement.isDefaultOpen = this.isShareDropdownOpen()

    this.actionTrayElements.value = [
      new ActionTrayElement("back", this.onGoToPreviousPage.bind(this), {
        label: new ActionTrayLabel("Back", "Back"),
        isHidden: this.isBackActionHidden(),
        isIconStart: true,
        iconClass: "icon-large icon-primary fa-solid fa-circle-arrow-left",
      }),

      new ActionTrayElement("search", this.onSearchTransactionHistory.bind(this), {
        label: new ActionTrayLabel("Search", "Search"),
        isSearchElement: true,
        isVisibleOnSearch: true,
      }),

      actionDropDownElement,

      new ActionTrayDropdown(
        "more-dropdown",
        {
          iconClass: "fa-solid fa-ellipsis",
          isIconOnly: true,
        },
        [
          new ActionTrayElement("sort", this.onSelectSortBy.bind(this), {
            label: new ActionTrayLabel("Sort By:", "Sort By:"),
            isSelectElement: true,
            selectedElementValue: this.sortBy.value,
            selectElementOptions: [
              new SelectOption(TransactionConstants.LABEL_PAY_DATE, TransactionConstants.LABEL_PAY_DATE, "Most Recent"),
              new SelectOption(TransactionConstants.LABEL_NAME, TransactionConstants.LABEL_NAME, "Company Name"),
              new SelectOption(
                TransactionConstants.LABEL_PAY_FOR,
                TransactionConstants.LABEL_PAY_FOR,
                "Product/Service"
              ),
              new SelectOption(TransactionConstants.LABEL_REF_NO, TransactionConstants.LABEL_REF_NO, "Alphabetical"),
            ],
          }),
        ]
      ),
    ]
  }

  async checkHasArchivedTransactions(): Promise<void> {
    try {
      this.hasArchivedData.value = await this.transactionRepository.hasArchivedData()
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error()
        errorMessage.setForFetchAll()
        errorMessage.handle()
      }
    }
  }

  async checkHasAccessToArchivedTransactions(): Promise<void> {
    try {
      this.hasAccessToArchivedData.value = await this.userArchiveAccessRepository.hasAccess("transactions")
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error()
        errorMessage.setForFetchAll()
        errorMessage.handle()
      }
    }
  }

  async setupYears(): Promise<void> {
    this.isLoading.value = true
    this.transactionHistoriesByYear.value = {}
    this.years.value = []

    try {
      const recentYears: number[] = []
      recentYears.push(this.currentYear.value)
      recentYears.push(this.previousYear.value)
      if (this.hasArchivedData.value) {
        recentYears.push(this.twoYearsAgo.value)
      }
      const archiveYears: number[] = []
      if (this.hasArchivedData.value && this.hasAccessToArchivedData.value) {
        for (let y = this.firstRecordYear; y < this.twoYearsAgo.value; y++) {
          archiveYears.push(y)
        }
      }

      const yearsToFetch = Array.from(new Set(recentYears.concat(archiveYears))).sort((a, b) => {
        return b - a
      })

      for (const year of yearsToFetch) {
        try {
          const data = await this.fetchTransactionHistoryByYear(year)
          this.transactionHistoriesByYear.value[year] = data

          if (!this.hasInitializedEmptyYears && data.length === 0) {
            this.emptyYears.value.push(year)
          }
        } catch (e) {
          console.error(`Failed to fetch data for year ${year}:`, e)
          this.transactionHistoriesByYear.value[year] = []

          if (!this.hasInitializedEmptyYears) {
            this.emptyYears.value.push(year)
          }
        } finally {
          this.years.value.push(year)
        }
      }

      this.hasInitializedEmptyYears = true
    } catch (e) {
      let errorMessage: Error = new Error()
      errorMessage.setForFetchAll()
      errorMessage.handle()
    } finally {
      this.isLoading.value = false
    }
  }

  async fetchTransactionHistoryByYear(year: number): Promise<TransactionHistory[]> {
    const filter = new Filter()
    filter.takeAll = true
    filter.statuses.push(StatusConstants.PAID)
    filter.searchText = this.searchText.value ?? ""
    const response = await this.transactionRepository.fetchTransactionHistory(filter, year)
    const histories = response.data
      .map((d: any) => {
        return new TransactionHistory(d)
      })
      .filter((t: TransactionHistory) => {
        return !StringUtil.contains(t.payee, "lorem ipsum")
      })
    const sortedHistories = this.sortTransactionHistories(histories)
    return sortedHistories
  }

  isArchived(year: number): boolean {
    return year <= this.twoYearsAgo.value
  }

  isBackActionHidden(): boolean {
    const previousPageUrl = window.history.state?.back
    if (!previousPageUrl) {
      return true
    }
    const previousPagePath = previousPageUrl.split("?")[0]
    return previousPagePath === "/"
  }

  isHidden(year: number): boolean {
    return this.isArchived(year) && !this.hasAccessToArchivedData.value
  }

  isActionDisabled(): boolean {
    return !this.receiptRef || this.totalTransactionSelected.value <= 0 || this.totalTransactionSelected.value > 5
  }

  isSortActive(sortBy: string): boolean {
    if (!this.orderBy.value) {
      return false
    }

    return this.sortBy.value === sortBy
  }

  isShareDropdownOpen(): boolean {
    return this.totalTransactionSelected.value > 0 && !this.isGeneratingDocuments.value
  }

  sortTransactionHistories(histories: TransactionHistory[]): TransactionHistory[] {
    return histories.sort((a, b) => {
      const sortBy = this.sortBy.value
      const orderBy = this.orderBy.value

      switch (sortBy) {
        case TransactionConstants.LABEL_REF_NO: {
          return orderBy === SortConstants.ORDER_DESC ? b.refNo.localeCompare(a.refNo) : a.refNo.localeCompare(b.refNo)
        }

        case TransactionConstants.LABEL_PAY_FOR: {
          const aFirst = a.services[0] ?? ""
          const bFirst = b.services[0] ?? ""
          return orderBy === SortConstants.ORDER_DESC ? bFirst.localeCompare(aFirst) : aFirst.localeCompare(bFirst)
        }

        case TransactionConstants.LABEL_NAME: {
          return orderBy === SortConstants.ORDER_DESC ? b.payee.localeCompare(a.payee) : a.payee.localeCompare(b.payee)
        }

        case TransactionConstants.LABEL_PAY_DATE: {
          const aDate = this.dayjs(a.paymentDate)
          const bDate = this.dayjs(b.paymentDate)

          if (aDate.isBefore(bDate)) {
            return orderBy === SortConstants.ORDER_DESC ? 1 : -1
          }
          if (aDate.isAfter(bDate)) {
            return orderBy === SortConstants.ORDER_DESC ? -1 : 1
          }
          return 0
        }

        default:
          return 0
      }
    })
  }

  getTransactionHistoryFileName(history: TransactionHistory): string {
    const year = this.dayjs(history.paymentDate).format("YYYY")
    const filename = history.refNo.replaceAll("/", "_")
    return `iCompany_receipts/${year}/${filename}.pdf`
  }

  getAllSelectedHistories(): TransactionHistory[] {
    let selectedTransactionHistories: TransactionHistory[] = []
    for (const ref of this.transactionYearRefs) {
      const selectedList = ref.getSelectedTransactionHistories()
      selectedTransactionHistories = selectedTransactionHistories.concat(selectedList)
    }

    return selectedTransactionHistories
  }

  onGoToPreviousPage(): void {
    const previousPageUrl = window.history.state?.back
    if (!previousPageUrl) {
      return
    }

    this.router.push(previousPageUrl)
  }

  getTransactionHistories(year: number): TransactionHistory[] {
    let transactions = this.transactionHistoriesByYear.value[year] ?? []

    if (StringUtil.isNullOrEmpty(this.searchText.value)) {
      return transactions
    }

    return transactions.filter((t: TransactionHistory) => {
      let paymentFor = t.services.join(" ")
      return (
        StringUtil.contains(t.payee, this.searchText.value) ||
        StringUtil.contains(paymentFor, this.searchText.value) ||
        StringUtil.contains(t.refNo, this.searchText.value)
      )
    })
  }

  isYearEmpty(year: number): boolean {
    return this.emptyYears.value.includes(year)
  }

  async getReceiptInvoiceGenerator(transactionHistory: TransactionHistory): Promise<ReceiptInvoiceGenerator | null> {
    const receiptInvoiceGenerator = new ReceiptInvoiceGenerator()
    await receiptInvoiceGenerator.setPaymentOrderFromTransactionHistory(transactionHistory)

    this.receiptRef.payeeName = receiptInvoiceGenerator.payeeName
    this.paymentOrderForReceipt.value = new PaymentOrder(receiptInvoiceGenerator.paymentOrder)

    await nextTick()
    const documentTemplate = this.receiptRef.getDocumentRef()
    if (!documentTemplate) {
      return null
    }

    receiptInvoiceGenerator.setDocumentTemplate(documentTemplate)

    return receiptInvoiceGenerator
  }

  async onDownloadAllSelected(): Promise<void> {
    const histories = this.getAllSelectedHistories()

    if (!histories.length || this.isGeneratingDocuments.value) {
      return
    }

    this.isGeneratingDocuments.value = true
    const files: any[] = []

    try {
      for (const h of histories) {
        const receiptInvoiceGenerator = await this.getReceiptInvoiceGenerator(h)
        if (!receiptInvoiceGenerator) {
          continue
        }

        const blob = await receiptInvoiceGenerator.getBlob()
        files.push(new DownloadFileData(URL.createObjectURL(blob), this.getTransactionHistoryFileName(h)))
      }

      await FileZipper.zipAndDownload(files, "iCompany_Receipts.zip")
    } catch (e) {
      console.error(e)
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error()
        errorMessage.setForDocumentDownload()
        errorMessage.handle()
      }
    } finally {
      this.isGeneratingDocuments.value = false
    }
  }

  async onEmailAllSelected(): Promise<void> {
    // TODO: email logic here
  }

  async onPrintAllSelected(): Promise<void> {
    const histories = this.getAllSelectedHistories()

    if (!histories.length || this.isGeneratingDocuments.value) {
      return
    }

    this.isGeneratingDocuments.value = true
    let pages: any[] = []

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write("Please wait, generating your document for printing...")
    } else {
      throw "Fail to open new window"
    }

    try {
      for (const h of histories) {
        const receiptInvoiceGenerator = await this.getReceiptInvoiceGenerator(h)
        if (!receiptInvoiceGenerator) {
          continue
        }
        const page = await receiptInvoiceGenerator.getPdfElements()
        pages = pages.concat(page)
      }

      if (pages.length <= 0) {
        printWindow.close()
        return
      }

      const blob = await PdfPaperUtil.getPdfBlob(pages, 0, "iCompany_Receipts.pdf", "a4", "portrait")
      const blobURL = URL.createObjectURL(blob)

      await nextTick()
      printWindow.location.href = blobURL

      setTimeout(() => {
        printWindow.print()
      }, 500)
    } catch (e) {
      console.error(e)
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error()
        errorMessage.setForDocumentPrint()
        errorMessage.handle()
      }
    } finally {
      this.isGeneratingDocuments.value = false
    }
  }

  async onSearchTransactionHistory(param?: ActionTrayElementParams): Promise<void> {
    if (!param) {
      this.searchText.value = ""
      // await this.setupYears()

      return
    }

    this.searchText.value = param.outcome
    // await this.setupYears()
    // this.setTrayActions()
  }

  sortTransactions(): void {
    for (const year of this.years.value) {
      const histories = this.transactionHistoriesByYear.value[year]

      if (!histories) {
        continue
      }

      this.transactionHistoriesByYear.value[year] = this.sortTransactionHistories(histories)
    }
  }

  onSelectSortBy(param?: ActionTrayElementParams): void {
    if (!param) {
      return
    }

    if (param.outcome === TransactionConstants.LABEL_PAY_DATE) {
      this.sortBy.value = TransactionConstants.LABEL_PAY_DATE
      this.orderBy.value = SortConstants.ORDER_DESC

      this.sortTransactions()
      this.setTrayActions()
    } else {
      this.onSortBy(param.outcome)
    }
  }

  onSortBy(sortBy: string): void {
    if (this.sortBy.value !== sortBy) {
      this.onSortTransactions(new ActionTrayElementParams(sortBy, true))
    } else {
      this.onSortTransactions(new ActionTrayElementParams(sortBy, this.orderBy.value !== SortConstants.ORDER_ASC))
    }
  }

  onSortTransactions(param?: ActionTrayElementParams): void {
    if (!param) {
      return
    }

    this.sortBy.value = param.id
    this.orderBy.value = param.outcome ? SortConstants.ORDER_ASC : SortConstants.ORDER_DESC

    this.sortTransactions()

    this.setTrayActions()
  }

  onTransactionYearSelected(): void {
    this.totalTransactionSelected.value = 0
    for (const ref of this.transactionYearRefs) {
      const refSelected = ref.getSelectedTransactionHistories()
      this.totalTransactionSelected.value += refSelected.length
    }

    this.setTrayActions()
  }

  // Copywriting Section
  loaderLabel(): string {
    return this.language.isMalay() ? "Sedang Memaut" : "Retrieving"
  }

  loaderSublabel(): string {
    return this.language.isMalay() ? "Transaksi" : "Past Transactions"
  }

  get actionTray(): ActionTrayElement[] {
    let actionDropDownElement = new ActionTrayDropdown(
      "share-dropdown",
      {
        label: new ActionTrayLabel("Action", "Action"),
        isDisabled: this.isGeneratingDocuments.value,
        iconClass: this.isGeneratingDocuments.value ? "fa-solid fa-spinner fa-spin" : "",
        isIconStart: this.isGeneratingDocuments.value,
      },
      [
        new ActionTrayElement("download-all", this.onDownloadAllSelected.bind(this), {
          label: new ActionTrayLabel("Download", "Download"),
          subLabel: new ActionTrayLabel("Selected Item", "Selected Item"),
          isDisabled: this.isActionDisabled(),
        }),

        new ActionTrayElement("print-all", this.onPrintAllSelected.bind(this), {
          label: new ActionTrayLabel("Print", "Print"),
          subLabel: new ActionTrayLabel("Selected Item", "Selected Item"),
          isDisabled: this.isActionDisabled(),
        }),

        new ActionTrayElement("email-all", this.onEmailAllSelected.bind(this), {
          label: new ActionTrayLabel("Email", "Email"),
          subLabel: new ActionTrayLabel("Selected Item", "Selected Item"),
          isDisabled: this.isActionDisabled(),
        }),
      ],
      this.isShareDropdownOpen()
    )
    actionDropDownElement.isDefaultOpen = this.isShareDropdownOpen()

    return [
      // new ActionTrayElement("back", this.onGoToPreviousPage.bind(this), {
      //   label: new ActionTrayLabel("Back", "Back"),
      //   isHidden: this.isBackActionHidden(),
      //   isIconStart: true,
      //   iconClass: "icon-large icon-primary fa-solid fa-circle-arrow-left",
      // }),

      new ActionTrayElement("search", this.onSearchTransactionHistory.bind(this), {
        label: new ActionTrayLabel("Search", "Search"),
        isSearchElement: true,
        isVisibleOnSearch: true,
      }),

      actionDropDownElement,

      new ActionTrayDropdown(
        "more-dropdown",
        {
          iconClass: "fa-solid fa-ellipsis",
          isIconOnly: true,
        },
        [
          new ActionTrayElement("sort", this.onSelectSortBy.bind(this), {
            label: new ActionTrayLabel("Sort By:", "Sort By:"),
            isSelectElement: true,
            selectedElementValue: this.sortBy.value,
            selectElementOptions: [
              new SelectOption(TransactionConstants.LABEL_PAY_DATE, TransactionConstants.LABEL_PAY_DATE, "Most Recent"),
              new SelectOption(TransactionConstants.LABEL_NAME, TransactionConstants.LABEL_NAME, "Company Name"),
              new SelectOption(
                TransactionConstants.LABEL_PAY_FOR,
                TransactionConstants.LABEL_PAY_FOR,
                "Product/Service"
              ),
              new SelectOption(TransactionConstants.LABEL_REF_NO, TransactionConstants.LABEL_REF_NO, "Alphabetical"),
            ],
          }),
        ]
      ),
    ]
  }
}
