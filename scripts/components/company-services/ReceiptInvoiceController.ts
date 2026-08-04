import { CompanyConstants } from "~/scripts/constants/Company"
import { CompanyAmendmentName } from "~/scripts/models/CompanyAmendmentName"
import { PaymentOrder } from "~/scripts/models/PaymentOrder"
import { PropsCompanyServiceWrapper } from "~/scripts/props/PropsCompanyServiceWrapper"
import type { IPropsDocumentService } from "~/scripts/props/PropsDocumentService"

export class ReceiptInvoiceServiceController {
  companyId: Ref<string> = ref<string>("")
  paymentOrderId: Ref<string> = ref<string>("")

  emitEvents: any | null = null

  constructor(props: IPropsDocumentService, emitEvents: any) {
    this.emitEvents = emitEvents

    this.setValuesProps(props)
  }

  setValuesProps(props: IPropsDocumentService): void {
    this.companyId.value = props.companyId ?? ""
    this.paymentOrderId.value = props.targetId ?? ""
  }

  get serviceWrapperProps(): PropsCompanyServiceWrapper {
    let dummyApplication = new CompanyAmendmentName()
    dummyApplication.status = "paid"
    dummyApplication.id = "dummy"

    let props = new PropsCompanyServiceWrapper(
      dummyApplication,
      this.companyId.value,
      CompanyConstants.TARGET_RECEIPT,
      "",
      "new",
      true,
      false,
      "",
      1,
      1,
      "",
      false,
      true,
      19,
      false,
      false,
      null,
      false,
      false,
      1,
      1,
      false,
      false,
      "bacck",
      "proceed",
      "-",
      false,
      false,
      CompanyAmendmentName,
      useCompanyAmendmentNameStore(),
      false,
      false,
      false
    )

    return props
  }
}
