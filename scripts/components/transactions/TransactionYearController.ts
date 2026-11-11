import { SortConstants } from "~/scripts/constants/Sorts"
import { StatusConstants } from "~/scripts/constants/Status"
import { Error } from "~/scripts/library/Error"
import { Filter } from "~/scripts/library/Filter"
import { ReceiptInvoiceGenerator } from "~/scripts/library/ReceiptInvoiceGenerator"
import { BillingInfo } from "~/scripts/models/BillingInfo"
import { DeliveryInfo } from "~/scripts/models/DeliveryInfo"
import { PaymentCart } from "~/scripts/models/PaymentCart"
import { PaymentCartItem } from "~/scripts/models/PaymentCartItem"
import { PaymentOrder } from "~/scripts/models/PaymentOrder"
import { TransactionHistory } from "~/scripts/models/TransactionHistory"
import { UserArchiveAccess } from "~/scripts/models/UserArchiveAccess"
import { Transaction } from "~/scripts/types/Transaction"
import { CurrentUser } from "~/scripts/utils/CurrentUser"

export class TransactionYearController {
  dayjs = useDayjs()
  time = useLocalTime()
  language = useLanguage()

  year = ref<number>(0)
  transactionHistories = ref<TransactionHistory[]>([])
  transactions = ref<Transaction[]>([]) // this is for display

  userArchiveAccessRepository = useUserArchiveAccessStore()
  servicePricingRepository = useServicePricingStore()
  paymentCartRepository = usePaymentCartStore()

  filter: Filter = new Filter()
  isHidden = ref<boolean>(false)
  isYearEmpty = ref<boolean>(false)

  sortBy: Ref<string> = ref<string>("")
  orderBy: Ref<string> = ref<string>("")

  emitEvents: any | null = null

  receiptRef: any | null = null
  transactionHistoryForReceipt = ref<TransactionHistory | null>(null)
  isDownloadingReceipt = ref<boolean>(false)
  paymentOrderForReceipt = ref<PaymentOrder>(new PaymentOrder())
  paymentOrderIdForReceipt = ref<string | null>(null)

  cartRef: any | null = null
  paymentCart = ref<PaymentCart>(new PaymentCart())

  receiptInvoiceGenerator: ReceiptInvoiceGenerator = new ReceiptInvoiceGenerator()

  constructor(
    year: number,
    transactionHistories: TransactionHistory[],
    isHidden: boolean,
    isYearEmpty: boolean,
    sortBy: string,
    orderBy: string,
    emitEvents: any | null
  ) {
    this.filter.takeAll = true
    this.filter.statuses.push(StatusConstants.PAID)

    this.setYear(year)
    this.setOrderBy(orderBy)
    this.setSortBy(sortBy)
    this.setIsHidden(isHidden)
    this.setIsYearEmpty(isYearEmpty)
    this.setTransactionHistories(transactionHistories)
    this.emitEvents = emitEvents
  }

  setCartRef(cartRef: any): void {
    this.cartRef = cartRef
  }

  setReceiptRef(receiptRef: any) {
    this.receiptRef = receiptRef
  }

  setIsHidden(isHidden: boolean): void {
    this.isHidden.value = isHidden
  }

  setIsYearEmpty(isYearEmpty: boolean): void {
    this.isYearEmpty.value = isYearEmpty
  }

  setTransactionHistories(transactionHistories: TransactionHistory[]): void {
    this.transactionHistories.value = transactionHistories
    const selectedList = this.getSelectedTransactionHistories()

    this.transactions.value = this.transactionHistories.value.map((th: TransactionHistory) => {
      const isSelected = selectedList.some((sth: TransactionHistory) => {
        return th.id === sth.id
      })

      return new Transaction(th.refNo, th.services, th.payee, this.time.formatDateOnlyShort(th.paymentDate), isSelected)
    })
  }

  setSortBy(sortBy: string): void {
    this.sortBy.value = sortBy
  }

  setOrderBy(orderBy: string): void {
    this.orderBy.value = orderBy
  }

  setYear(year: number): void {
    this.year.value = year
  }

  getTransactionHistory(transaction: Transaction): TransactionHistory {
    let transactionHistory =
      this.transactionHistories.value.find((t: TransactionHistory) => {
        return t.refNo === transaction.referenceNumber
      }) ?? null

    return transactionHistory ?? new TransactionHistory()
  }

  getSelectedTransactionHistories(): TransactionHistory[] {
    const selectedReferenceNos = this.transactions.value
      .filter((t: Transaction) => {
        return t.isSelected
      })
      .map((t: Transaction) => {
        return t.referenceNumber
      })

    return this.transactionHistories.value.filter((th: TransactionHistory) => {
      return selectedReferenceNos.includes(th.refNo)
    })
  }

  async onDownloadClicked(transaction: Transaction, index: number): Promise<void> {
    if (!this.receiptRef || this.isDownloadingReceipt.value) {
      return
    }

    this.isDownloadingReceipt.value = true
    this.transactionHistoryForReceipt.value = this.transactionHistories.value[index] ?? null
    if (
      !this.transactionHistoryForReceipt.value ||
      this.transactionHistoryForReceipt.value === null ||
      this.transactionHistoryForReceipt.value.refNo !== transaction.referenceNumber
    ) {
      let errorMessage: Error = new Error()
      errorMessage.setForDocumentDownload()
      errorMessage.handle()
      return
    }

    try {
      this.receiptInvoiceGenerator = new ReceiptInvoiceGenerator()
      await this.receiptInvoiceGenerator.setPaymentOrderFromTransactionHistory(this.transactionHistoryForReceipt.value)
      this.receiptRef.payeeName = this.receiptInvoiceGenerator.payeeName
      this.paymentOrderForReceipt.value = new PaymentOrder(this.receiptInvoiceGenerator.paymentOrder)
      setTimeout(async () => {
        let documentTemplate = this.receiptRef.getDocumentRef()
        if (!documentTemplate) {
          return
        }
        this.receiptInvoiceGenerator.setDocumentTemplate(documentTemplate)
        await this.receiptInvoiceGenerator.download()
      }, 500)
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error()
        errorMessage.setForGenerateReceipt()
        errorMessage.handle()
      }
    } finally {
      this.isDownloadingReceipt.value = false
    }
  }

  onReceiptDownloaded(): void {
    this.isDownloadingReceipt.value = false
  }

  async onGetAccessClicked(): Promise<void> {
    if (!this.cartRef) {
      return
    }

    try {
      let hasAccess = await this.userArchiveAccessRepository.hasAccess("transactions")
      if (hasAccess) {
        return
      }

      let targetType = "user_archive_access"

      let currentUser = await CurrentUser.get()
      let billingInfo = new BillingInfo({
        billing_name: currentUser.name,
        billing_email: currentUser.email,
        billing_phone: currentUser.phone,
      })
      let deliveryInfo = new DeliveryInfo({
        delivery_name: currentUser.name,
        delivery_email: currentUser.email,
        delivery_phone: currentUser.phone,
      })

      let detail = currentUser.detail ?? null
      let address = detail?.location ?? null
      if (detail && address) {
        billingInfo.addressLine1 = address.addressLine1
        billingInfo.addressLine2 = address.addressLine2
        billingInfo.addressPostcode = address.city?.name ?? ""
        billingInfo.addressCity = address.state?.name ?? ""
        billingInfo.addressState = address.postcode
        billingInfo.addressCountry = address.country?.name ?? ""

        deliveryInfo.addressLine1 = address.addressLine1
        deliveryInfo.addressLine2 = address.addressLine2
        deliveryInfo.addressPostcode = address.city?.name ?? ""
        deliveryInfo.addressCity = address.state?.name ?? ""
        deliveryInfo.addressState = address.postcode
        deliveryInfo.addressCountry = address.country?.name ?? ""
      }

      let userArchiveAccess: UserArchiveAccess = new UserArchiveAccess()
      userArchiveAccess.type = "transactions"
      await userArchiveAccess.create(this.userArchiveAccessRepository)
      if (userArchiveAccess.status !== StatusConstants.PENDING) {
        let message = this.language.isMalay()
          ? "Bayaran sudah dibuat untuk akses arkib. Sila muat semula muka ini."
          : "Payment is already made for archive access. Please refresh this page."
        let error = new Error()
        error.type = Error.ERROR_TYPE_DATA
        error.message = message
        throw error
      }

      let servicePricing = await this.servicePricingRepository.fetchForTarget(targetType, userArchiveAccess.id)
      if (!servicePricing) {
        let errorMessage: Error = new Error()
        errorMessage.setForFetchCustom("Price", "Harga")
        throw errorMessage
      }

      let paymentCartItem: PaymentCartItem = new PaymentCartItem()
      paymentCartItem.servicePricingId = servicePricing.id
      paymentCartItem.targetType = targetType
      paymentCartItem.targetId = userArchiveAccess.id

      this.paymentCart.value = new PaymentCart()
      this.paymentCart.value.entityType = "user"
      this.paymentCart.value.entityId = currentUser.id
      this.paymentCart.value.billingInfo = new BillingInfo(billingInfo)
      this.paymentCart.value.deliveryInfo = new DeliveryInfo(deliveryInfo)
      this.paymentCart.value.items.push(paymentCartItem)
      await this.paymentCart.value.create(this.paymentCartRepository)

      this.cartRef.show()
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error()
        errorMessage.setForMakePayment()
        errorMessage.handle()
      }
    }
  }

  isAllSelected(): boolean {
    if (this.transactions.value.length <= 0) {
      return false
    }

    return this.transactions.value.every((t) => {
      return t.isSelected
    })
  }

  isNoSearchResultVisible(): boolean {
    return this.transactions.value.length <= 0
  }

  onToggleSelectAll(): void {
    if (this.transactions.value.length <= 0) {
      return
    }

    const setAsSelect = !this.isAllSelected()
    this.transactions.value.forEach((t) => {
      t.isSelected = setAsSelect
    })

    this.emitEvents("selected")
  }

  onToggleSort(sortBy: string): void {
    this.emitEvents("sort", sortBy)
  }

  getSelectedCount(): number {
    return this.transactions.value.filter((t: Transaction) => {
      return t.isSelected
    }).length
  }

  getCheckboxClass(): string {
    return this.isAllSelected() ? "fa-regular fa-square-check" : "fa-regular fa-square"
  }

  getArrowClass(): string {
    return this.orderBy.value === SortConstants.ORDER_DESC ? "fa-regular fa-arrow-up" : "fa-regular fa-arrow-down"
  }

  //Copywriting region
  referenceNumberLabel(): string {
    return this.language.isMalay() ? "No. Rujukan" : "Ref. No."
  }

  productOrServiceDescriptionLabel(): string {
    return this.language.isMalay() ? "Produk atau Keterangan Servis" : "Product or Service Description"
  }

  nameOfCompanyOrApplicantLabel(): string {
    return this.language.isMalay() ? "Nama Sdn Bhd / Name Pemohon" : "Name of Sdn Bhd / Name of Applicant"
  }

  paymentDateLabel(): string {
    return this.language.isMalay() ? "Tarikh Bayaran" : "Payment Date"
  }

  getNoSearchResultAlert(): string {
    if (this.isYearEmpty.value) {
      return this.language.isMalay() ? `Nampaknya tiada<br>Transaksi–` : `Looks like there is<br>No Transaction–`
    }

    return this.language.isMalay()
      ? `Nampaknya tiada<br>hasil padanan ditemui–`
      : `Looks like there is<br>no matching result found–`
  }

  getNoSearchResultSubalert(): string {
    if (this.isYearEmpty.value) {
      return this.language.isMalay()
        ? `Sejarah transaksi anda akan dipaparkan di sini<br>sebaik sahaja anda membuat pembayaran.`
        : `Your transaction history will appear here<br>once you make a payment.`
    }

    return this.language.isMalay()
      ? `Sila perhalusi carian anda atau<br>cari satu demi satu.`
      : `Please refine your search query or<br>search item by item.`
  }

  archivedDataAlert(): string {
    return this.language.isMalay()
      ? "Transaksi lebih dari dua (2) tahun disimpan di dalam Arkib, untuk tujuh (7) tahun sahaja seperti yang dituntut di bawah Seksyen 245 Akta Syarikat 2016."
      : "Transactions older than two (2) years are stored in Archives, for seven (7) years only as required under Section 245 of the Companies Act 2016."
  }

  archivedDataSubalert(): string {
    return this.language.isMalay()
      ? "Bagi kelestarian, dapatkan akses selama 30 hari pada bila-bila masa dengan harga RM5."
      : "For sustainability, get access for 30 days anytime for RM5."
  }

  archivedDataButtonLabel(): string {
    return this.language.isMalay() ? "Dapatkan Akses" : "Get Access"
  }

  loaderLabel(): string {
    return this.language.isMalay() ? "Sedang Memaut" : "Retrieving"
  }

  loaderSublabel(): string {
    return this.language.isMalay() ? "Transaksi Anda" : "Your Past Transactions"
  }
}
