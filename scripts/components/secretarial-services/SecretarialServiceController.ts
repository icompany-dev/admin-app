import type { PropsSecretarialService } from "~/scripts/props/PropsSecretarialService"
import { PaymentOrder } from "~/scripts/models/PaymentOrder"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import type { IModelApplication } from "~/scripts/models/IModelApplication"
import { PropsApplication } from "~/scripts/props/PropsApplication"
import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"
import { DocumentTargets } from "~/scripts/constants/DocumentTargets"
import type { Company } from "~/scripts/models/Company"

export abstract class SecretarialServiceController<T, R> {
  companyId: Ref<string> = ref<string>("")
  applicationId: Ref<string> = ref<string>("")
  paymentOrderId: Ref<string> = ref<string>("")

  emitEvents: any | null = null

  language = useLanguage()

  abstract application: Ref<IModelApplication<T, R>>

  isLoading: Ref<boolean> = ref<boolean>(false)

  paymentOrder: Ref<PaymentOrder> = ref<PaymentOrder>(new PaymentOrder())

  target: string

  documentRef: any | null = null
  isDownloading: Ref<boolean> = ref<boolean>(false)
  selectedDocumentTarget: Ref<string> = ref<string>(DocumentTargets.TARGET_RECEIPT)

  constructor(props: PropsSecretarialService, target: string, emitEvents: any) {
    this.emitEvents = emitEvents
    this.target = target

    this.setDataFromProps(props)
  }

  async setDataFromProps(props: PropsSecretarialService): Promise<void> {
    this.companyId.value = props.companyId
    this.applicationId.value = props.applicationId
    this.paymentOrderId.value = props.paymentOrderId

    await this.initializeService()
  }

  setDocumentRef(documentRef: any): void {
    this.documentRef = documentRef
  }

  async initializeService(): Promise<void> {
    if (this.isLoading.value) {
      return
    }

    try {
      this.isLoading.value = true

      await Promise.allSettled([this.fetchApplication(), this.fetchPaymentOrder()])
    } catch (e) {
      if (e instanceof Error) {
        e.isMalay = this.language.isMalay()
        e.handle()
      } else {
        let error = new Error()
        error.isMalay = this.language.isMalay()
        error.setForFetch()
        error.handle()
      }
    } finally {
      this.isLoading.value = false
    }
  }

  abstract fetchApplication(): Promise<void>

  async fetchPaymentOrder(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.paymentOrderId.value)) {
      return
    }

    let repository = usePaymentOrderStore()
    let response = await repository.fetch(this.paymentOrderId.value)
    this.paymentOrder.value = new PaymentOrder(response)
  }

  onPaymentOrderIdUpdated(id: string): void {
    this.paymentOrderId.value = id
  }

  onCompanyUpdated(company: Company): void {
    this.companyId.value = company.id
    this.emitEvents("company", company)
  }

  async onDownloadClicked(): Promise<void> {
    if (this.isDownloading.value || !this.documentRef) {
      return
    }

    try {
      this.isDownloading.value = true

      await this.documentRef.onDownloadClicked()
    } catch (e) {
      console.error(e)
    } finally {
      this.isDownloading.value = false
    }
  }

  onDocumentTargetSelected(target: string): void {
    this.selectedDocumentTarget.value = target
  }

  get applicationProps(): PropsApplication {
    return new PropsApplication("", this.applicationId.value)
  }
}
