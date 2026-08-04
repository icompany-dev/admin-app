export class ReceiptInvoiceController {
  emitEvents: any | null = null

  constructor(props: any, emitEvents: any) {
    this.emitEvents = emitEvents
  }
}
