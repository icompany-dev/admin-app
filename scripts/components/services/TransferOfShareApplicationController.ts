import type { CompanyShareholderTransfer } from "~/scripts/models/CompanyShareholderTransfer"
import { ApplicationController } from "../incorporations/ApplicationController"

export class TransferOfShareApplicationController extends ApplicationController<CompanyShareholderTransfer> {
  emitEvents: any | null = null

  constructor(props: any, emitEvents: any) {
    this.emitEvents = emitEvents
  }
}
