import { Transaction } from "~/scripts/types/Transaction"

export class TransactionController {
  transaction = ref<Transaction>(new Transaction("", [], "", "", false))
  isPaidForMoreThanOne = ref<boolean>(false)

  isExpanded = ref<boolean>(false)

  emitEvents: any | null = null

  constructor(transaction: Transaction, emitEvents: any | null) {
    this.emitEvents = emitEvents
    this.setTransaction(transaction)
  }

  setTransaction(transaction: Transaction): void {
    this.transaction.value = transaction
    this.isPaidForMoreThanOne.value = this.transaction.value.paymentFor.length > 1
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
}
