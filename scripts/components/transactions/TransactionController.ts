import { ReceiptInvoiceGenerator } from "~/scripts/library/ReceiptInvoiceGenerator"
import { PaymentOrder } from "~/scripts/models/PaymentOrder"
import { TransactionHistory } from "~/scripts/models/TransactionHistory"
import { Transaction } from "~/scripts/types/Transaction"
import { StringUtil } from "~/scripts/utils/String"

export class TransactionController {
  transaction = ref<Transaction>(new Transaction("", [], "", "", false))
  transactionHistory = ref<TransactionHistory>(new TransactionHistory())
  isPaidForMoreThanOne = ref<boolean>(false)

  isExpanded = ref<boolean>(false)
  isShowReceipt = ref<boolean>(false)

  emitEvents: any | null = null

  receiptRef: any | null = null

  paymentOrder: Ref<PaymentOrder> = ref<PaymentOrder>(new PaymentOrder())

  constructor(transaction: Transaction, transactionHistory: TransactionHistory, emitEvents: any | null) {
    this.emitEvents = emitEvents
    this.setTransaction(transaction)
    this.setTransactionHistory(transactionHistory)
  }

  setReceiptRef(receiptRef: any): void {
    this.receiptRef = receiptRef
  }

  setTransaction(transaction: Transaction): void {
    this.transaction.value = transaction
    this.isPaidForMoreThanOne.value = this.transaction.value.paymentFor.length > 1
  }

  setTransactionHistory(transactionHistory: TransactionHistory): void {
    this.transactionHistory.value = new TransactionHistory(transactionHistory)
    // await this.setPaymentOrder()
  }

  toggleSelected(): void {
    this.transaction.value.isSelected = !this.transaction.value.isSelected
    this.emitEvents("selected", this.transaction.value.isSelected)
  }

  toggleShowPaymentFor(): void {
    this.isExpanded.value = !this.isExpanded.value
  }

  onDownloadClicked(): void {
    this.emitEvents("download")
  }

  onEmailClicked(): void {
    this.emitEvents("email")
  }

  onPrintClicked(): void {
    this.emitEvents("print")
  }

  async onShowReceipt(): Promise<void> {
    console.log("called?")
    this.isShowReceipt.value = true

    // if (StringUtil.isNullOrEmpty(this.paymentOrder.value.id)) {
    //   await this.setPaymentOrder()
    // }
  }

  onHideReceipt(): void {
    console.log("hide")
    this.isShowReceipt.value = false
  }

  async setPaymentOrder(): Promise<void> {
    const receiptInvoiceGenerator = new ReceiptInvoiceGenerator()
    await receiptInvoiceGenerator.setPaymentOrderFromTransactionHistory(this.transactionHistory.value)

    this.receiptRef.payeeName = receiptInvoiceGenerator.payeeName
    this.paymentOrder.value = new PaymentOrder(receiptInvoiceGenerator.paymentOrder)
  }
}
