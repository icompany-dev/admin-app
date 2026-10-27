import type { PropsSecretarialService } from "~/scripts/props/PropsSecretarialService"
import { SecretarialServiceController } from "./SecretarialServiceController"
import { CompanyShareholderTransfer } from "~/scripts/models/CompanyShareholderTransfer"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { CompanyConstants } from "~/scripts/constants/Company"
import { DocumentTargets } from "~/scripts/constants/DocumentTargets"
import { File as UploadedFile } from "~/scripts/models/File"
import { Form } from "~/scripts/models/Form"

export class TransferOfShareController extends SecretarialServiceController<
  CompanyShareholderTransfer,
  ReturnType<typeof useCompanyShareholderTransferStore>
> {
  application = ref<CompanyShareholderTransfer>(new CompanyShareholderTransfer())

  isMovingToDocuments: Ref<boolean> = ref<boolean>(false)
  isDocumentsMoved: Ref<boolean> = ref<boolean>(false)

  pdfUrl: Ref<string> = ref<string>("")

  zoomLevel: Ref<number> = ref<number>(0)

  constructor(props: PropsSecretarialService, emitEvents: any) {
    super(props, CompanyConstants.TARGET_SHAREHOLDER_TRANSFER_OF_SHARES, emitEvents)
  }

  async fetchApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.applicationId.value)) {
      return
    }

    let repository = useCompanyShareholderTransferStore()
    let response = await repository.fetch(this.applicationId.value)

    this.application.value = new CompanyShareholderTransfer(response)
  }

  async onMoveToDocuments(): Promise<void> {
    if (this.isMovingToDocuments.value || this.isDocumentsMoved.value) {
      return
    }

    this.isMovingToDocuments.value = true
    this.isDocumentsMoved.value = false

    try {
      let promises: any[] = []

      this.selectedDocumentTarget.value = DocumentTargets.TARGET_SECTION105
      await nextTick()

      setTimeout(async () => {
        let section105Blobs = await this.documentRef.onGenerateBlobs(`Section 105 - Form of Transfer of Securities.pdf`)
        section105Blobs.forEach((blob: Blob) => {
          promises.push(this.uploadToForms(blob, "Section 105 - Form of Transfer of Securities.pdf"))
        })

        this.selectedDocumentTarget.value = DocumentTargets.TARGET_SHAREHOLDER_POST_SHARE_TRANSFER
        await nextTick()

        setTimeout(async () => {
          let dcrBlob = await this.documentRef.onGenerateBlob("DCR - Register Transfer of Shares.pdf")
          if (dcrBlob) {
            promises.push(this.uploadToForms(dcrBlob, "DCR - Register Transfer of Shares.pdf"))
          }

          await Promise.allSettled(promises)

          this.canCompleteService.value = true
        }, 5000)
      }, 5000)
    } catch (e) {
    } finally {
      this.isMovingToDocuments.value = false
    }
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

  async uploadToForms(blob: Blob, filename: string): Promise<void> {
    let file = new File([blob], filename, {
      type: "application/pdf",
    })

    let uploadedFile = new UploadedFile()
    uploadedFile.name = filename.replace(".pdf", "")
    await uploadedFile.uploadFile(file, useFileStore())

    let dayjs = useDayjs()

    let form = new Form()
    form.companyId = this.companyId.value
    form.type = "business_detail"
    form.fileId = uploadedFile.id
    form.documentDate = dayjs().format("YYYY-MM-DD")
    form.status = "active"
    form.noOfPages = 1

    await form.create(useFormStore())
  }

  get showPdfViewer(): boolean {
    return !StringUtil.isNullOrEmpty(this.pdfUrl.value)
  }
}
