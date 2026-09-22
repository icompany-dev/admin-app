import type { PropsSecretarialService } from "~/scripts/props/PropsSecretarialService"
import { SecretarialServiceController } from "./SecretarialServiceController"
import { CompanyDocumentRequest } from "~/scripts/models/CompanyDocumentRequest"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { CompanyConstants } from "~/scripts/constants/Company"

export class DocumentRequestController extends SecretarialServiceController<
  CompanyDocumentRequest,
  ReturnType<typeof useCompanyDocumentRequestStore>
> {
  application = ref<CompanyDocumentRequest>(new CompanyDocumentRequest())

  pdfUrl: Ref<string> = ref<string>("")

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
    this.pdfUrl.value = url
  }

  get showPdfViewer(): boolean {
    return !StringUtil.isNullOrEmpty(this.pdfUrl.value)
  }
}
