import { PaperOrientation } from "~/scripts/constants/Paper"
import { PaymentConstants } from "~/scripts/constants/Payment"
import { ActivityLogger } from "~/scripts/library/ActivityLogger"
import { Error } from "~/scripts/library/Error"
import { ReceiptInvoiceGenerator } from "~/scripts/library/ReceiptInvoiceGenerator"
import { BillplzPaymentGateway } from "~/scripts/models/BillplzPaymentGateway"
import { PaymentOrder } from "~/scripts/models/PaymentOrder"
import type { PaymentOrderItem } from "~/scripts/models/PaymentOrderItem"
import type { PaymentOrderItemBreakdown } from "~/scripts/models/PaymentOrderItemBreakdown"
import type { PaymentOrderItemMandatory } from "~/scripts/models/PaymentOrderItemMandatory"
import type { PaymentOrderItemOptional } from "~/scripts/models/PaymentOrderItemOptional"
import { ServicePricing } from "~/scripts/models/ServicePricing"
import { ReceiptTableColumn, ReceiptTableRow } from "~/scripts/types/carts/ReceiptTableRow"
import { CurrentUser } from "~/scripts/utils/CurrentUser"
import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"
import { StringUtil } from "~/scripts/utils/String"

export class ReceiptInvoiceController {
  paymentOrderId = ref<string>("")
  paymentOrder = ref<PaymentOrder>(new PaymentOrder())
  payeeName = ref<string>("")
  paymentGateways = ref<BillplzPaymentGateway[]>([])

  isPaid = ref<boolean>(false)

  time = useLocalTime()
  language = useLanguage()
  paymentOrderRepository = usePaymentOrderStore()
  servicePricingRepository = useServicePricingStore()
  fileRepository = useFileStore()
  userRepository = useUserStore()
  billplzPaymentGatewayRepository = useBillplzPaymentGatewayStore()

  documentRef: any | null = null

  isSettingPaymentOrder = ref<boolean>(false)
  isLoading = ref<boolean>(false)
  isDownloading = ref<boolean>(false)

  totalPages = ref<number>(1)
  pageRange = ref<number[]>([])

  maxRowOnPageOne: number = 21
  maxRowOnOtherPages: number = 30
  tableRows = ref<ReceiptTableRow[]>([])

  emitEvents: any | null = null

  logoBase64: Ref<string> = ref<string>("")

  receiptInvoiceGenerator: ReceiptInvoiceGenerator = new ReceiptInvoiceGenerator()

  additionalCssClass: string = "receipt-paper print"
  paperOrientation: string = PaperOrientation.Portrait

  constructor(paymentOrderId: string, paymentOrder: PaymentOrder | null = null, emitEvents: any | null) {
    this.emitEvents = emitEvents
    this.fetchPaymentGateways()
    this.setLogoBase64()
    if (!StringUtil.isNullOrEmpty(paymentOrderId)) {
      this.setPaymentOrderId(paymentOrderId)
    } else if (paymentOrder !== null) {
      this.setPaymentOrder(paymentOrder)
    }
  }

  async setPaymentOrderId(paymentOrderId: string): Promise<void> {
    this.isSettingPaymentOrder.value = true
    this.paymentOrderId.value = paymentOrderId

    if (StringUtil.isNullOrEmpty(this.paymentOrderId.value)) {
      return
    }

    await this.fetchPaymentOrder()
  }

  async setPaymentOrder(paymentOrder: PaymentOrder): Promise<void> {
    this.isSettingPaymentOrder.value = true
    this.paymentOrder.value = new PaymentOrder(paymentOrder)

    for (let i = 0; i < this.paymentOrder.value.items.length; i++) {
      let paymentOrderItem = this.paymentOrder.value.items[i]

      if (
        paymentOrderItem.additionalServicePricingIds.length > 0 &&
        paymentOrderItem.additionalServicePricings.length <= 0
      ) {
        let additionalServicePricings: ServicePricing[] = []
        for (let aspId of paymentOrderItem.additionalServicePricingIds) {
          let aspResponse = await this.servicePricingRepository.fetch(aspId)
          if (aspResponse) {
            additionalServicePricings.push(new ServicePricing(aspResponse))
          }
        }

        this.paymentOrder.value.items[i].additionalServicePricings = additionalServicePricings
      }

      if (
        StringUtil.isNullOrEmpty(paymentOrderItem.servicePricingId) ||
        !StringUtil.isNullOrEmpty(paymentOrderItem.serviceName)
      ) {
        continue
      }

      let spResponse = await this.servicePricingRepository.fetch(paymentOrderItem.servicePricingId)
      if (spResponse) {
        let servicePricing = new ServicePricing(spResponse)
        this.paymentOrder.value.items[i].serviceName = servicePricing.serviceName
      }
    }

    this.isPaid.value = this.paymentOrder.value.status === PaymentConstants.PAYMENT_ORDER_STATUS_PAID

    this.setTableRows()

    let totalRows: number = this.getNumberOfRows()
    if (totalRows <= this.maxRowOnPageOne) {
      this.totalPages.value = 1
    } else {
      let balanceRow = totalRows - this.maxRowOnPageOne
      this.totalPages.value = Math.ceil(balanceRow / this.maxRowOnOtherPages) + 1
    }

    this.pageRange.value = Array.from({ length: this.totalPages.value }, (_, i) => i + 1)

    if (!this.isPaid.value) {
      let user = await CurrentUser.get()
      this.payeeName.value = user.name
    } else {
      await this.fetchPayee()
    }

    this.isSettingPaymentOrder.value = false
  }

  setDocumentRef(documentRef: any | null): void {
    this.documentRef = documentRef
  }

  async setLogoBase64(): Promise<void> {
    let fileRepository = useFileStore()
    let fileUrl = "https://icompany-public.s3.ap-southeast-1.amazonaws.com/public/landing-res/logos/icompany_long.png"
    let response = await fileRepository.convertImgToBase64(fileUrl)
    if (response) {
      this.logoBase64.value = `data:image/png;base64, ${response.base64}`
    } else {
      this.logoBase64.value = fileUrl
    }
  }

  getDocumentRef(): HTMLElement | null {
    if (!this.documentRef) {
      return null
    }

    return this.documentRef as HTMLElement
  }

  async fetchPaymentOrder(): Promise<void> {
    this.isLoading.value = true
    this.paymentOrder.value = new PaymentOrder()

    try {
      let response = await this.paymentOrderRepository.fetch(this.paymentOrderId.value)
      if (this.paymentOrderRepository.error !== null) {
        throw this.paymentOrderRepository.error
      }

      this.setPaymentOrder(response)
    } catch (error) {
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage: Error = new Error()
        errorMessage.setForPaymentDetails()
        errorMessage.handle()
      }
    } finally {
      this.isLoading.value = false
    }
  }

  async fetchPayee(): Promise<void> {
    if (!this.paymentOrder.value.paidBy || !this.isPaid.value) {
      return
    }

    try {
      let response = await this.userRepository.fetch(this.paymentOrder.value.paidBy)
      if (this.userRepository.error !== null) {
        throw this.userRepository.error
      }

      this.payeeName.value = response.name
    } catch (error) {
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage: Error = new Error()
        errorMessage.setForPaymentDetails()
        errorMessage.handle()
      }
    }
  }

  async fetchPaymentGateways(): Promise<void> {
    try {
      await this.billplzPaymentGatewayRepository.fetchGateways()
      if (this.billplzPaymentGatewayRepository.error) {
        throw this.billplzPaymentGatewayRepository.error
      }

      this.paymentGateways.value = this.billplzPaymentGatewayRepository.billplzPaymentGateways.map(
        (gateway: BillplzPaymentGateway) => {
          return new BillplzPaymentGateway(gateway)
        }
      )
    } catch (error) {
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage: Error = new Error()
        errorMessage.setForPaymentGateways()
        errorMessage.handle()
      }
    }
  }

  getNumberOfRows(): number {
    let totalRows: number = 1

    if (this.isPaid.value) {
      totalRows++
    }

    let numberOfPaymentOrderItems: number = this.paymentOrder.value.items.length
    let numberOfConfigurationRows: number = numberOfPaymentOrderItems * 3
    let numberOfSubtotalRows: number = numberOfPaymentOrderItems
    let numberOfBreakdowns: number = this.paymentOrder.value.items
      .map((item: PaymentOrderItem) => {
        return item.breakdowns.length
      })
      .reduce((a: number, b: number) => {
        return a + b
      }, 0)
    let numberOfMandatories: number = this.paymentOrder.value.items
      .map((item: PaymentOrderItem) => {
        return item.mandatories.length
      })
      .reduce((a: number, b: number) => {
        return a + b
      }, 0)
    let numberOfExpressFiling: number = this.paymentOrder.value.items.filter((item: PaymentOrderItem) => {
      return item.isExpressFilingRequired
    }).length
    totalRows =
      totalRows +
      numberOfPaymentOrderItems +
      numberOfConfigurationRows +
      numberOfSubtotalRows +
      numberOfBreakdowns +
      numberOfMandatories +
      numberOfExpressFiling

    return totalRows
  }

  setTableRows(): void {
    this.tableRows.value = []

    this.paymentOrder.value.items.forEach((item: PaymentOrderItem) => {
      let serviceNameRow: ReceiptTableRow = new ReceiptTableRow(
        "",
        new ReceiptTableColumn(item.serviceName, "service-name", true, 3),
        new ReceiptTableColumn("", "", false, 1),
        new ReceiptTableColumn("", "", false, 1)
      )
      this.tableRows.value.push(serviceNameRow)

      item.breakdowns.forEach((breakdown: PaymentOrderItemBreakdown) => {
        if (breakdown.price <= 0) {
          return
        }

        let breakdownRow: ReceiptTableRow = new ReceiptTableRow(
          "subitem",
          new ReceiptTableColumn(
            `<div class="name">${StringUtil.capitalize(breakdown.itemName.toLowerCase())}</div>`,
            "item-name",
            true,
            1
          ),
          new ReceiptTableColumn(`${item.quantity}`, "quantity", true, 1),
          new ReceiptTableColumn(Number(breakdown.price).toFixed(2), "price", true, 1)
        )
        this.tableRows.value.push(breakdownRow)
      })

      item.mandatories.forEach((mandatory: PaymentOrderItemMandatory) => {
        let mandatoryRow: ReceiptTableRow = new ReceiptTableRow(
          "subitem",
          new ReceiptTableColumn(
            `<div class="name">${StringUtil.capitalize(mandatory.serviceName.toLowerCase())}</div>`,
            "item-name",
            true,
            1
          ),
          new ReceiptTableColumn(`${item.quantity}`, "quantity", true, 1),
          new ReceiptTableColumn(Number(mandatory.basePrice).toFixed(2), "price", true, 1)
        )
        this.tableRows.value.push(mandatoryRow)
      })

      if (item.additionalServicePricings.length > 0) {
        let additionalServicePricings: ServicePricing[] = []

        item.additionalServicePricings.forEach((asp: ServicePricing) => {
          let existing = additionalServicePricings.find((sp: ServicePricing) => {
            return sp.id === asp.id
          })

          if (!existing) {
            additionalServicePricings.push(new ServicePricing(asp))
            return
          }

          existing.baseGrandTotal = Number(existing.baseGrandTotal) + Number(asp.baseGrandTotal)
        })

        additionalServicePricings.forEach((asp: ServicePricing) => {
          let aspRow: ReceiptTableRow = new ReceiptTableRow(
            "subitem",
            new ReceiptTableColumn(
              `<div class="name">${StringUtil.capitalize(asp.serviceName)}</div>`,
              "item-name",
              true,
              1
            ),
            new ReceiptTableColumn(`${item.quantity}`, "quantity", true, 1),
            new ReceiptTableColumn(Number(asp.baseGrandTotal).toFixed(2), "price", true, 1)
          )
          this.tableRows.value.push(aspRow)
        })
      }

      item.optionals.forEach((optional: PaymentOrderItemOptional) => {
        let optionalRow: ReceiptTableRow = new ReceiptTableRow(
          "subitem",
          new ReceiptTableColumn(
            `<div class="name">${StringUtil.capitalize(optional.serviceName)}</div>`,
            "item-name",
            true,
            1
          ),
          new ReceiptTableColumn(`${item.quantity}`, "quantity", true, 1),
          new ReceiptTableColumn(Number(optional.basePrice).toFixed(2), "price", true, 1)
        )
        this.tableRows.value.push(optionalRow)
      })

      if (item.isExpressFilingRequired) {
        let expressFilingRow: ReceiptTableRow = new ReceiptTableRow(
          "subitem",
          new ReceiptTableColumn(`<div class="name">Express Filing payable to SSM</div>`, "item-name", true, 1),
          new ReceiptTableColumn("", "quantity", true, 1),
          new ReceiptTableColumn(Number(item.expressFilingAmount ?? "0.00").toFixed(2), "price", true, 1)
        )
        this.tableRows.value.push(expressFilingRow)
      }

      let cosecServiceFeeRow: ReceiptTableRow = new ReceiptTableRow(
        "configuration-row",
        new ReceiptTableColumn("CoSec Service Fee", "item", true, 2),
        new ReceiptTableColumn("", "", false, 1),
        new ReceiptTableColumn(Number(item.cosecServiceFee ?? "0.00").toFixed(2), "price", true, 1)
      )
      this.tableRows.value.push(cosecServiceFeeRow)

      let digitalServiceFeeRow: ReceiptTableRow = new ReceiptTableRow(
        "configuration-row",
        new ReceiptTableColumn("Digital Service Fee", "item", true, 2),
        new ReceiptTableColumn("", "", false, 1),
        new ReceiptTableColumn(Number(item.digitalServiceFee ?? "0.00").toFixed(2), "price", true, 1)
      )
      this.tableRows.value.push(digitalServiceFeeRow)

      let handlingFeesRow: ReceiptTableRow = new ReceiptTableRow(
        "configuration-row",
        new ReceiptTableColumn("Handling Fees", "item", true, 2),
        new ReceiptTableColumn("", "", false, 1),
        new ReceiptTableColumn(Number(item.handlingFees ?? "0.00").toFixed(2), "price", true, 1)
      )
      this.tableRows.value.push(handlingFeesRow)

      if (item.isDeliveryRequired) {
        let deliveryRow: ReceiptTableRow = new ReceiptTableRow(
          "configuration-row",
          new ReceiptTableColumn("Delivery Fees", "item", true, 2),
          new ReceiptTableColumn("", "", false, 1),
          new ReceiptTableColumn(Number(item.deliveryFees() ?? "0.00").toFixed(2), "price", true, 1)
        )

        this.tableRows.value.push(deliveryRow)
      }

      let subtotal = Number(item.subtotal ?? "0.00") + Number(item.discountAmount ?? "0.00")
      let subtotalRow: ReceiptTableRow = new ReceiptTableRow(
        "subtotal-row",
        new ReceiptTableColumn("", "", false, 1),
        new ReceiptTableColumn("", "", false, 1),
        new ReceiptTableColumn(`RM ${Number(subtotal ?? "0.00").toFixed(2)}`, "subtotal", true, 3)
      )
      this.tableRows.value.push(subtotalRow)
    })

    if (this.paymentOrder.value.totalDiscount() > 0) {
      let discountRow: ReceiptTableRow = new ReceiptTableRow(
        "configuration-row",
        new ReceiptTableColumn("Discount", "item", true, 2),
        new ReceiptTableColumn("", "", false, 1),
        new ReceiptTableColumn(
          `- RM ${Number(this.paymentOrder.value.totalDiscount() ?? "0.00").toFixed(2)}`,
          "price",
          true,
          1
        )
      )

      this.tableRows.value.push(discountRow)
    }

    let grandTotalRow: ReceiptTableRow = new ReceiptTableRow(
      "grand-total",
      new ReceiptTableColumn(`Amount ${this.dueOrPaid()}:`, "total-title", true, 2),
      new ReceiptTableColumn("", "", false, 1),
      new ReceiptTableColumn(`RM ${Number(this.paymentOrder.value.total ?? "0.00").toFixed(2)}`, "price", true, 1)
    )
    this.tableRows.value.push(grandTotalRow)

    if (this.isPaid.value) {
      let paymentMethodRow: ReceiptTableRow = new ReceiptTableRow(
        "payment-method",
        new ReceiptTableColumn("Payment Method:", "method-title", true, 2),
        new ReceiptTableColumn("", "", false, 1),
        new ReceiptTableColumn(this.paymentMethod(), "method", true, 1)
      )
      this.tableRows.value.push(paymentMethodRow)
    }
  }

  getRowsOnPage(page: number): ReceiptTableRow[] {
    if (page === 1) {
      return this.tableRows.value.slice(0, this.maxRowOnPageOne)
    }

    let start = (page - 2) * this.maxRowOnOtherPages + this.maxRowOnPageOne
    let end = start + this.maxRowOnOtherPages

    return this.tableRows.value.slice(start, end)
  }

  async downloadReceipt(): Promise<void> {
    if (this.isSettingPaymentOrder.value) {
      setTimeout(() => {
        this.downloadReceipt()
      }, 300)

      return
    }

    let activityLogger = new ActivityLogger()
    await activityLogger.init()
    let companyId =
      this.paymentOrder.value.entityType === PaymentConstants.PAYMENT_CART_ENTITY_TYPE_COMPANY
        ? this.paymentOrder.value.entityId
        : ""
    let status = ""
    let target = this.paymentOrder.value.entityType
    let targetId = this.paymentOrder.value.entityId
    let additionalInfo = this.isPaid.value ? "receipt" : "invoice"

    try {
      this.isDownloading.value = true
      this.receiptInvoiceGenerator.setPaymentOrderFromPaymentOrder(this.paymentOrder.value)
      this.receiptInvoiceGenerator.setDocumentTemplate(this.documentRef as HTMLElement)
      await this.receiptInvoiceGenerator.download()

      status = "success"
    } catch (error) {
      let errorMessage: Error = new Error()
      errorMessage.setForDocumentDownload()
      errorMessage.handle()

      status = "failed"
      additionalInfo = `failed to download ${additionalInfo}: ${error}`
    } finally {
      this.isDownloading.value = false

      await activityLogger.addDownloadLog(companyId, additionalInfo, target, targetId, status)
      this.emitEvents("downloaded")
    }
  }

  receiptInvoiceTitle(): string {
    return this.isPaid.value ? "Receipt" : "Tax Invoice"
  }

  dueOrPaid(): string {
    return this.isPaid.value ? "Paid" : "Due"
  }

  billId(): string {
    return this.isPaid.value ? "" : "-"
  }

  footerDisclaimer(): string {
    if (!this.isPaid.value) {
      return "This Tax Invoice is system-generated and does not constitute proof of payment, regardless of any annotation.<br>Please download the corresponding Receipt as your official proof of payment."
    }

    return "This Receipt is system-generated. No signature is required."
  }

  datePaid(): string {
    if (!this.paymentOrder.value || !this.paymentOrder.value.paidAt) {
      return "Payment is Due"
    }

    return this.isPaid.value ? this.time.formatDateOnlyShort(this.paymentOrder.value.paidAt) : "Payment is Due"
  }

  paymentMethod(): string {
    if (!this.isPaid.value) {
      return "Payment Method Not Selected"
    }

    let paymentGateway = this.paymentGateways.value.find((pg: BillplzPaymentGateway) => {
      return pg.code === this.paymentOrder.value.paymentMethod
    })

    if (!paymentGateway) {
      return this.paymentOrder.value.paymentMethod
    }

    return paymentGateway.gatewayName()
  }

  get loaderLabel(): string {
    return "Generating the"
  }

  get loaderSublabel(): string {
    return "Receipt"
  }
}
