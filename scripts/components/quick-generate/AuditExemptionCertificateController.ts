import { PaperOrientation, PaperSize } from "~/scripts/constants/Paper"
import { Director } from "~/scripts/models/Director"
import { SignatureGroup } from "~/scripts/models/SignatureGroup"
import { User } from "~/scripts/models/User"
import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"
import { StringUtil } from "~/scripts/utils/String"

export class AuditExemptionCertificateController {
  emitEvents: any | null = null

  isShowDocument: Ref<boolean> = ref<boolean>(false)
  isDownloading: Ref<boolean> = ref<boolean>(false)

  auditExemptionCertificateRef: any | null = null

  companyId: Ref<string> = ref<string>("")
  directors: Ref<Director[]> = ref<Director[]>([])
  directorId: Ref<string> = ref<string>("")
  signatureGroups: Ref<SignatureGroup[]> = ref<SignatureGroup[]>([])

  constructor(props: any, emitEvents: any) {
    this.emitEvents = emitEvents
    this.setCompanyId(props.companyId)
    this.fetchDirectors()
  }

  setCompanyId(val: string): void {
    this.companyId.value = val
  }

  async fetchDirectors(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId.value)) {
      return
    }

    let directorRepository = useDirectorStore()
    let response = await directorRepository.fetchAllForCompany(this.companyId.value)

    this.directors.value = response.map((d: any) => {
      return new Director(d)
    })

    let promises = this.directors.value.map((d: Director) => {
      return d.getRegisteredUser(useUserStore()).then((response) => {
        d.user = new User(response)
      })
    })

    await Promise.allSettled(promises)
  }

  setAuditExemptionCertificateRef(auditExemptionCertificateRef: any): void {
    this.auditExemptionCertificateRef = auditExemptionCertificateRef
  }

  onOpenDocument(): void {
    this.isShowDocument.value = true
  }

  onCloseDocument(): void {
    if (this.isDownloading.value) {
      return
    }

    this.isShowDocument.value = false
  }

  async onDownloadDocument(): Promise<void> {
    if (!this.auditExemptionCertificateRef) {
      return
    }

    if (this.isDownloading.value) {
      return
    }

    this.isDownloading.value = true

    try {
      let promises = []

      if (this.auditExemptionCertificateRef) {
        let pages = await this.auditExemptionCertificateRef.getPdfPages()
        promises.push(
          PdfPaperUtil.generatePdfFile(
            pages,
            19,
            "Audit Exemption Certificate.pdf",
            PaperSize.A4,
            PaperOrientation.Portrait
          )
        )
      }

      if (promises.length <= 0) {
        return
      }

      await Promise.allSettled(promises)
    } catch (e) {
      console.error(e)
    } finally {
      this.isDownloading.value = false
    }
  }
}
