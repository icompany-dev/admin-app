import { ServiceController } from "./ServiceController"

export class ReceiptInvoiceController extends ServiceController {
  documentRef: any | null = null

  constructor(props: any, emitEvents: any) {
    super("", "", emitEvents)
  }

  setDocumentRef(documentRef: any): void {
    this.documentRef = documentRef
  }

  override async getServicePrice(): Promise<void> {
    //
  }

  override onSubmitClicked(): Promise<void> {
    throw new Error("Method not implemented.")
  }

  override async onDownloadClicked(): Promise<void> {
    if (!this.documentRef) {
      return
    }

    await this.documentRef.downloadReceipt()
  }
}
