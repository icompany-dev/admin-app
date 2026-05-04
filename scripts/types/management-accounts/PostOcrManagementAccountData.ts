import { DocumentTypes } from "~/scripts/constants/DocumentTypes"
import type { OcrData } from "../ocr/OcrData"
import { ManagementAccountConstants } from "~/scripts/constants/ManagementAccounts"

export class PostOcrManagementAccountData {
  ocrData: OcrData

  isMoneyIn: boolean = false
  isMoneyOut: boolean = false
  bankCashOption: string | null = null

  isRevenue: boolean = false
  isOtherIncome: boolean = false

  isExpense: boolean = false
  expenseType: string | null = null
  isAsset: boolean = false
  isCurrentAsset: boolean = false
  isNonCurrentAsset: boolean = false
  isOtherAsset: boolean = false
  assetType: string | null = null

  constructor(ocrData: OcrData, selectedDocumentType: string) {
    this.ocrData = ocrData

    switch (selectedDocumentType) {
      case DocumentTypes.BANK_STATEMENT:
        this.bankCashOption = ocrData.bankName
        break
      case DocumentTypes.SALE_INVOICE:
        break
      case DocumentTypes.PURCHASE_INVOICE:
        break
      case DocumentTypes.CASH_PAYMENT_MADE:
        this.isMoneyOut = true
        break
      case DocumentTypes.CASH_PAYMENT_RECEIVED:
        this.isMoneyIn = true
        break
    }
  }
}
