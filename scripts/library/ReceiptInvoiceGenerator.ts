//NOTE: This class is to generate receipt. It handles the following:
//  1. Populating data from all types of input - Payment Order Id, Payment Order, Transaction, Order (old method)
//  2. Retrieving the HTML elements
//  3. Generation of single Blob
//  4. Download

import { PaperOrientation, PaperSize } from "../constants/Paper"
import { StatusConstants } from "../constants/Status"
import { BillingInfo } from "../models/BillingInfo"
import { Company } from "../models/Company"
import { PaymentOrder } from "../models/PaymentOrder"
import { PaymentOrderItem } from "../models/PaymentOrderItem"
import { PaymentOrderItemMandatory } from "../models/PaymentOrderItemMandatory"
import { ReceiptData, ReceiptDataItem } from "../models/ReceiptData"
import { TransactionHistory } from "../models/TransactionHistory"
import { PdfPaperUtil } from "../utils/PdfPaper"
import { StringUtil } from "../utils/String"
import { Error } from "./Error"

export class ReceiptInvoiceGenerator {
  documentTemplate: HTMLElement | null = null
  paymentOrder: PaymentOrder = new PaymentOrder()
  payeeName: string = "" //For older data

  transactionRepository = useTransactionStore()
  paymentOrderRepository = usePaymentOrderStore()
  orderRepository = useOrderStore()
  userRepository = useUserStore()
  awsApi = useAwsStore()

  constructor() {
    this.paymentOrder = new PaymentOrder()
  }

  setDocumentTemplate(documentTemplate: HTMLElement): void {
    this.documentTemplate = documentTemplate
  }

  async setPaymentOrderFromTransactionHistory(transactionHistory: TransactionHistory): Promise<void> {
    this.payeeName = ""
    if (!transactionHistory.isOrder) {
      await this.fetchPaymentOrder(transactionHistory.id)
      await this.fetchPayee()
      return
    }

    await this.fetchOrderReceipt(transactionHistory.id, transactionHistory.services[0])
  }

  setPaymentOrderFromReceiptData(receiptData: ReceiptData, serviceName: string): void {
    this.paymentOrder = new PaymentOrder()
    this.paymentOrder.referenceNumber = receiptData.referenceNumber
    let tempCompany = new Company()
    tempCompany.name = receiptData.biller.name
    tempCompany.nameType = receiptData.biller.nameType
    this.paymentOrder.billingInfo = new BillingInfo({
      billing_name: tempCompany.getFullName(),
      billing_email: receiptData.biller.email,
      billing_phone: receiptData.biller.phone,
      billing_address_line_1: receiptData.biller.address.line1,
      billing_address_line_2: receiptData.biller.address.line2,
      billing_address_postcode: receiptData.biller.address.city,
      billing_address_city: receiptData.biller.address.state,
      billing_address_state: receiptData.biller.address.postcode,
      billing_address_country: receiptData.biller.address.country,
    })

    this.paymentOrder.items = []
    let paymentOrderItem = new PaymentOrderItem()
    paymentOrderItem.serviceName = serviceName ?? "Service"
    paymentOrderItem.breakdowns = []
    paymentOrderItem.mandatories = []
    receiptData.items.forEach((item: ReceiptDataItem) => {
      let paymentOrderItemMandatory = new PaymentOrderItemMandatory()
      paymentOrderItemMandatory.serviceName = !StringUtil.isNullOrEmpty(item.altName) ? item.altName : item.name
      paymentOrderItemMandatory.basePrice = Number(item.price)
      paymentOrderItem.mandatories.push(paymentOrderItemMandatory)
    })
    paymentOrderItem.subtotal = receiptData.orderSummary.total
    this.paymentOrder.items.push(paymentOrderItem)
    this.paymentOrder.paidAt = receiptData.date
    this.paymentOrder.total = receiptData.orderSummary.total
    this.paymentOrder.paymentMethod = receiptData.paymentMethod
    this.paymentOrder.status = StatusConstants.PAID

    this.payeeName = receiptData.biller.attentionTo
  }

  setPaymentOrderFromPaymentOrder(paymentOrder: PaymentOrder): void {
    this.paymentOrder = new PaymentOrder(paymentOrder)
  }

  async setPaymentOrderFromTarget(target: string, targetId: string): Promise<void> {
    try {
      let response = await this.transactionRepository.fetchByTarget(target, targetId)
      if (!response) {
        let errorMessage: Error = new Error()
        errorMessage.setForFetch()
        throw errorMessage
      }

      if (this.transactionRepository.error !== null) {
        throw this.transactionRepository.error
      }

      let transactionHistory = new TransactionHistory(response)
      await this.setPaymentOrderFromTransactionHistory(transactionHistory)
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error()
        errorMessage.setForFetch()
        errorMessage.handle()
      }
    }
  }

  async addToPaymentOrderFromTransactionHistory(transactionHistory: TransactionHistory): Promise<void> {
    //TODO: Add?
  }

  async fetchPaymentOrder(paymentOrderId: string): Promise<void> {
    try {
      let response = await this.paymentOrderRepository.fetch(paymentOrderId)
      if (this.paymentOrderRepository.error !== null) {
        throw this.paymentOrderRepository.error
      }

      this.paymentOrder = new PaymentOrder(response)
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error()
        errorMessage.setForFetch()
        errorMessage.handle()
      }
    }
  }

  async fetchOrderReceipt(orderId: string, serviceName: string): Promise<void> {
    try {
      let response = await this.orderRepository.receipt(orderId)
      if (this.orderRepository.error !== null || response === null) {
        throw this.orderRepository.error
      }

      let receiptData = new ReceiptData(response)
      this.setPaymentOrderFromReceiptData(receiptData, serviceName)
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error()
        errorMessage.setForFetch()
        errorMessage.handle()
      }
    }
  }

  async fetchPayee(): Promise<void> {
    let isPaid = this.paymentOrder.status === StatusConstants.PAID
    if (!this.paymentOrder.paidBy || !isPaid) {
      return
    }

    try {
      let response = await this.userRepository.fetch(this.paymentOrder.paidBy)
      if (this.userRepository.error !== null) {
        throw this.userRepository.error
      }

      this.payeeName = response.name
    } catch (error) {
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage = new Error()
        errorMessage.type = Error.ERROR_TYPE_API
        errorMessage.title = "Unable to fetch payment details. Please refresh the page and try again."
        errorMessage.handle()
      }
    }
  }

  // This function assumes that the setPaymentOrderFromTransactionHistory is already called.
  async downloadFromTransactionHistory(transactionHistory: TransactionHistory): Promise<void> {
    try {
      if (!this.documentTemplate) {
        let errorMessage: Error = new Error()
        errorMessage.setForIncompleteData()
        throw errorMessage
      }

      if (StringUtil.isNullOrEmpty(this.paymentOrder.referenceNumber)) {
        let errorMessage: Error = new Error()
        errorMessage.setForIncompleteData()
        throw errorMessage
      }

      if (transactionHistory.isOrder) {
        let awsFileResponse = await this.awsApi.getReceipt(transactionHistory.id)
        if (awsFileResponse !== null) {
          const blob = await new Blob([awsFileResponse.Body], {
            type: awsFileResponse.ContentType,
          })
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement("a")
          link.href = url
          link.setAttribute("download", `${transactionHistory.refNo}.pdf`)
          document.body.appendChild(link)
          link.click()
          link.parentNode?.removeChild(link)
          return
        }
      }

      await this.download()
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error()
        errorMessage.setForDocumentDownload()
        errorMessage.handle()
      }
    }
  }

  async download(): Promise<void> {
    const filename = this.getFilename()
    const pages = await this.getPdfElements()
    await PdfPaperUtil.generatePdfFile(pages, 0, filename, PaperSize.A4, PaperOrientation.Portrait)
  }

  async getPdfElements(): Promise<HTMLElement[]> {
    if (!this.documentTemplate) {
      return []
    }

    return PdfPaperUtil.getPdfElements(this.documentTemplate)
  }

  async getBlob(): Promise<Blob> {
    const filename = this.getFilename()
    const pages = await this.getPdfElements()

    const blob = await PdfPaperUtil.getPdfBlob(pages, 0, filename, PaperSize.A4, PaperOrientation.Portrait)

    return blob
  }

  getFilename(): string {
    let isReceipt = this.paymentOrder.status === StatusConstants.PAID
    let receiptOrInvoice = isReceipt ? "Receipt" : "Invoice"

    return `iCompany ${receiptOrInvoice} - ${this.paymentOrder.referenceNumber}.pdf`
  }
}
