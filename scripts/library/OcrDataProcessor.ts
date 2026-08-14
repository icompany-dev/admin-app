import { DocumentTypes } from "../constants/DocumentTypes"
import { BankStatementOcrData } from "../types/ocr/BankStatementOcrData"
import { CashPaymentMadeOcrData } from "../types/ocr/CashPaymentMadeOcrData"
import { CashPaymentReceivedOcrData } from "../types/ocr/CashPaymentReceivedOcrData"
import { PurchaseInvoiceOcrData } from "../types/ocr/PurchaseInvoiceOcrData"
import { SaleInvoiceOcrData } from "../types/ocr/SaleInvoiceOcrData"
import { ObjectUtil } from "../utils/Object"
import { GeminiAiJobStatusResponse } from "../models/GeminiAiJobStatusResponse"
import { StatusConstants } from "../constants/Status"
import type { CompanyManagementAccount } from "../models/CompanyManagementAccount"
import { OcrData } from "../types/ocr/OcrData"
import { CompanyManagementAccountData } from "../models/CompanyManagementAccountData"
import type { PostOcrManagementAccountData } from "../types/management-accounts/PostOcrManagementAccountData"
import { FinancialStatementOcrData } from "../types/ocr/FinancialStatementOcrData"

export class OcrDataProcessor {
  processData(jobStatuses: GeminiAiJobStatusResponse | GeminiAiJobStatusResponse[], documentType: string) {
    const jsonObject = this.extractJsonObjects(jobStatuses)
    switch (documentType) {
      case DocumentTypes.BANK_STATEMENT:
        return new BankStatementOcrData(jsonObject)
      case DocumentTypes.SALE_INVOICE:
        return new SaleInvoiceOcrData(jsonObject)
      case DocumentTypes.PURCHASE_INVOICE:
        return new PurchaseInvoiceOcrData(jsonObject)
      case DocumentTypes.CASH_PAYMENT_MADE:
        return new CashPaymentMadeOcrData(jsonObject)
      case DocumentTypes.CASH_PAYMENT_RECEIVED:
        return new CashPaymentReceivedOcrData(jsonObject)
      case DocumentTypes.CATEGORY_AUDIT:
        return new FinancialStatementOcrData(jsonObject)
    }

    return new OcrData(jsonObject)
  }

  extractJsonObjects(jobStatuses: GeminiAiJobStatusResponse | GeminiAiJobStatusResponse[]): any {
    let jsonObjects = {}

    try {
      if (Array.isArray(jobStatuses)) {
        jobStatuses.forEach((js) => {
          if (!(js instanceof GeminiAiJobStatusResponse)) {
            return
          }

          if (js.status !== StatusConstants.COMPLETED) {
            return
          }

          const jsonObject = this.getJsonObject(js.result)
          if (jsonObject === null) {
            return
          }

          jsonObjects = ObjectUtil.deepMerge(jsonObjects, jsonObject)
        })
      } else {
        if (!(jobStatuses instanceof GeminiAiJobStatusResponse)) {
          return jsonObjects
        }

        jsonObjects = this.getJsonObject(jobStatuses.result)
      }

      return jsonObjects
    } catch (e) {
      console.error(e)
    }
  }

  getJsonObject(data: any): any {
    const regex = /```([\s\S]*?)```/
    const matchedData = data.match(regex)

    if (!matchedData || !matchedData[0]) {
      return null
    }

    let info = matchedData[1].trim()
    info = info.replace("json", "")

    return JSON.parse(info)
  }

  updateDataForBankStatement(
    postOcrManagementAccountData: PostOcrManagementAccountData,
    companyManagementAccount: CompanyManagementAccount
  ): CompanyManagementAccount {
    let ocrData = postOcrManagementAccountData.ocrData
    let newRecord = new CompanyManagementAccountData()
    newRecord.name = ocrData.bankName
    newRecord.amount = typeof ocrData.total === "string" ? ocrData.total : ocrData.total.toFixed(2)
    let bankName = ocrData.bankName
    let existingRecord = companyManagementAccount.balanceSheet.bankCash.find((bc: CompanyManagementAccountData) => {
      return bc.name === bankName
    })
    if (existingRecord) {
      existingRecord.amount = (ocrData.total + Number(existingRecord.amount)).toFixed(2)
    } else {
      newRecord.name = bankName
      companyManagementAccount.balanceSheet.bankCash.push(newRecord)
    }

    return companyManagementAccount
  }

  updateDataForSaleInvoice(
    postOcrManagementAccountData: PostOcrManagementAccountData,
    companyManagementAccount: CompanyManagementAccount
  ): CompanyManagementAccount {
    let ocrData = postOcrManagementAccountData.ocrData
    let newRecord = new CompanyManagementAccountData()
    newRecord.name = ocrData.from
    newRecord.amount = typeof ocrData.total === "string" ? ocrData.total : ocrData.total.toFixed(2)

    // trade payable -- service not rendered
    let existingRecord = companyManagementAccount.balanceSheet.currentLiabilities.find(
      (bc: CompanyManagementAccountData) => {
        return bc.name === ocrData.from
      }
    )
    if (existingRecord) {
      existingRecord.amount = (ocrData.total + Number(existingRecord.amount)).toFixed(2)
    } else {
      companyManagementAccount.balanceSheet.currentLiabilities.push(newRecord)
    }

    // debtor -- payment not received yet
    let currentAssetsRecord = companyManagementAccount.balanceSheet.currentAssets.find(
      (bc: CompanyManagementAccountData) => {
        return bc.name === ocrData.from
      }
    )
    if (currentAssetsRecord) {
      currentAssetsRecord.amount = (ocrData.total + Number(currentAssetsRecord.amount)).toFixed(2)
    } else {
      companyManagementAccount.balanceSheet.currentAssets.push(newRecord)
    }

    return companyManagementAccount
  }

  updateDataForPurchaseInvoice(
    postOcrManagementAccountData: PostOcrManagementAccountData,
    companyManagementAccount: CompanyManagementAccount
  ): CompanyManagementAccount {
    let ocrData = postOcrManagementAccountData.ocrData
    let newRecord = new CompanyManagementAccountData()
    newRecord.name = ocrData.from
    newRecord.amount = typeof ocrData.total === "string" ? ocrData.total : ocrData.total.toFixed(2)

    // This will need to check if it is for non-current assets
    let existingRecord = companyManagementAccount.balanceSheet.currentAssets.find(
      (bc: CompanyManagementAccountData) => {
        return bc.name === ocrData.from
      }
    )
    if (existingRecord) {
      existingRecord.amount = (ocrData.total + Number(existingRecord.amount)).toFixed(2)
    } else {
      companyManagementAccount.balanceSheet.currentAssets.push(newRecord)
    }

    // Should add to liability since this is invoice, no payment made - creditor
    let liabilitiesRecord = companyManagementAccount.balanceSheet.currentLiabilities.find(
      (bc: CompanyManagementAccountData) => {
        return bc.name === ocrData.from
      }
    )
    if (liabilitiesRecord) {
      liabilitiesRecord.amount = (ocrData.total + Number(liabilitiesRecord.amount)).toFixed(2)
    } else {
      companyManagementAccount.balanceSheet.currentLiabilities.push(newRecord)
    }

    return companyManagementAccount
  }

  updateDataForCashPayment(
    postOcrManagementAccountData: PostOcrManagementAccountData,
    companyManagementAccount: CompanyManagementAccount
  ): CompanyManagementAccount {
    let ocrData = postOcrManagementAccountData.ocrData
    let newRecord = new CompanyManagementAccountData()
    newRecord.name = ocrData.from
    newRecord.amount = typeof ocrData.total === "string" ? ocrData.total : ocrData.total.toFixed(2)

    let existingRecord = companyManagementAccount.balanceSheet.bankCash.find((bc: CompanyManagementAccountData) => {
      if (postOcrManagementAccountData.bankCashOption !== null) {
        return bc.name === postOcrManagementAccountData.bankCashOption
      }

      return bc.name === "Bank"
    })
    if (existingRecord) {
      existingRecord.amount = postOcrManagementAccountData.isMoneyOut
        ? (Number(existingRecord.amount) - Number(ocrData.total)).toFixed(2)
        : (Number(existingRecord.amount) + Number(ocrData.total)).toFixed(2)
    } else {
      let bankCashRecord = new CompanyManagementAccountData()
      bankCashRecord.name = postOcrManagementAccountData.bankCashOption ?? "Bank"
      bankCashRecord.amount = postOcrManagementAccountData.isMoneyOut
        ? (-1 * Number(ocrData.total)).toFixed(2)
        : Number(ocrData.total).toFixed(2)
      companyManagementAccount.balanceSheet.bankCash.push(bankCashRecord)
    }

    if (postOcrManagementAccountData.isRevenue) {
      let revenueRecord = companyManagementAccount.profitLoss.revenue.find((cma: CompanyManagementAccountData) => {
        return cma.name === ocrData.from
      })

      if (revenueRecord) {
        revenueRecord.amount = (Number(revenueRecord.amount) + Number(ocrData.total)).toFixed(2)
      } else {
        companyManagementAccount.profitLoss.revenue.push(newRecord)
      }
    }

    if (postOcrManagementAccountData.isOtherIncome) {
      let otherIncomeRecord = companyManagementAccount.profitLoss.otherIncome.find(
        (cma: CompanyManagementAccountData) => {
          return cma.name === ocrData.from
        }
      )

      if (otherIncomeRecord) {
        otherIncomeRecord.amount = (Number(otherIncomeRecord.amount) + Number(ocrData.total)).toFixed(2)
      } else {
        companyManagementAccount.profitLoss.otherIncome.push(newRecord)
      }
    }

    if (postOcrManagementAccountData.isExpense && postOcrManagementAccountData.expenseType !== null) {
      let list = companyManagementAccount.profitLoss.getList(postOcrManagementAccountData.expenseType)

      let expenseRecord = list.find((bc: CompanyManagementAccountData) => {
        return bc.name === ocrData.from
      })
      if (expenseRecord) {
        expenseRecord.amount = (Number(expenseRecord.amount) + Number(ocrData.total)).toFixed(2)
      } else {
        list.push(newRecord)
        companyManagementAccount.profitLoss.setList(postOcrManagementAccountData.expenseType, list)
      }
    }

    if (postOcrManagementAccountData.isCurrentAsset) {
      let currentAssetRecord = companyManagementAccount.balanceSheet.currentAssets.find(
        (ca: CompanyManagementAccountData) => {
          return ca.name === ocrData.from
        }
      )

      if (currentAssetRecord) {
        currentAssetRecord.amount = (Number(currentAssetRecord.amount) + Number(ocrData.total)).toFixed(2)
      } else {
        companyManagementAccount.balanceSheet.currentAssets.push(newRecord)
      }
    }

    if (postOcrManagementAccountData.isOtherAsset) {
      let otherAssetRecord = companyManagementAccount.balanceSheet.otherAssets.find(
        (ca: CompanyManagementAccountData) => {
          return ca.name === ocrData.from
        }
      )

      if (otherAssetRecord) {
        otherAssetRecord.amount = (Number(otherAssetRecord.amount) + Number(ocrData.total)).toFixed(2)
      } else {
        companyManagementAccount.balanceSheet.otherAssets.push(newRecord)
      }
    }

    if (postOcrManagementAccountData.isNonCurrentAsset && postOcrManagementAccountData.assetType !== null) {
      let list = companyManagementAccount.balanceSheet.getList(postOcrManagementAccountData.assetType)

      let nonCurrentAssetRecord = list.find((bc: CompanyManagementAccountData) => {
        return bc.name === ocrData.from
      })
      if (nonCurrentAssetRecord) {
        nonCurrentAssetRecord.amount = (Number(nonCurrentAssetRecord.amount) + Number(ocrData.total)).toFixed(2)
      } else {
        list.push(newRecord)
        companyManagementAccount.balanceSheet.setList(postOcrManagementAccountData.assetType, list)
      }
    }

    // Do we need to deduct the current assets etc -- payment made to a purchase invoice?
    return companyManagementAccount
  }

  addToManagementAccount(
    selectedDocumentType: string,
    postOcrManagementAccountData: PostOcrManagementAccountData,
    companyManagementAccount: CompanyManagementAccount
  ) {
    switch (selectedDocumentType) {
      case DocumentTypes.BANK_STATEMENT:
        return this.updateDataForBankStatement(postOcrManagementAccountData, companyManagementAccount)
      case DocumentTypes.SALE_INVOICE:
        return this.updateDataForSaleInvoice(postOcrManagementAccountData, companyManagementAccount)
      case DocumentTypes.PURCHASE_INVOICE:
        return this.updateDataForPurchaseInvoice(postOcrManagementAccountData, companyManagementAccount)
      case DocumentTypes.CASH_PAYMENT_MADE:
        return this.updateDataForCashPayment(postOcrManagementAccountData, companyManagementAccount)
      case DocumentTypes.CASH_PAYMENT_RECEIVED:
        return this.updateDataForCashPayment(postOcrManagementAccountData, companyManagementAccount)
    }

    return companyManagementAccount
  }
}
