import type { PropsSecretarialService } from "~/scripts/props/PropsSecretarialService"
import { SecretarialServiceController } from "./SecretarialServiceController"
import { CompanyDocumentRequest } from "~/scripts/models/CompanyDocumentRequest"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { CompanyConstants } from "~/scripts/constants/Company"
import { DocumentTargets } from "~/scripts/constants/DocumentTargets"

export class DocumentRequestController extends SecretarialServiceController<
  CompanyDocumentRequest,
  ReturnType<typeof useCompanyDocumentRequestStore>
> {
  application = ref<CompanyDocumentRequest>(new CompanyDocumentRequest())

  pdfUrl: Ref<string> = ref<string>("")

  zoomLevel: Ref<number> = ref<number>(0)

  constructor(props: PropsSecretarialService, emitEvents: any) {
    super(props, CompanyConstants.TARGET_DOCUMENT_REQUEST, emitEvents)
  }

  async fetchApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.applicationId.value)) {
      return
    }

    let repository = useCompanyDocumentRequestStore()
    let response = await repository.fetch(this.applicationId.value)

    this.application.value = new CompanyDocumentRequest(response)
  }

  async onConvertToForms(): Promise<void> {
    if (!this.documentRef) {
      return
    }

    await this.documentRef.onMoveToForms()
  }

  onShowPdf(url: string): void {
    this.zoomLevel.value = 0
    this.selectedDocumentTarget.value === "pdf"
    this.pdfUrl.value = url
  }

  onZoomPdf(zoomLevel: number): void {
    this.zoomLevel.value = zoomLevel
  }

  onMinimizePdf(): void {
    this.zoomLevel.value = 0
  }

  get showPdfViewer(): boolean {
    return !StringUtil.isNullOrEmpty(this.pdfUrl.value)
  }

  get isShowReceipt(): boolean {
    return this.selectedDocumentTarget.value === DocumentTargets.TARGET_RECEIPT
  }
}
