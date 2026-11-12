import { PaperOrientation, PaperSize } from "~/scripts/constants/Paper"
import { Director } from "~/scripts/models/Director"
import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"

interface ResignationAndCessationDocument {
  isLoading: boolean
  errorMessage: string
  getPdfPages(): Promise<HTMLElement[]>
}

export class ResignationAndAppointmentOfCosecController {
  companyId = ref("")
  documentRef = ref<ResignationAndCessationDocument | null>(null)

  isShowDocument = ref(false)
  isDownloading = ref(false)
  isLoadingDirectors = ref(false)
  errorMessage = ref("")

  directors = ref<Director[]>([])
  selectedDirectorIds = ref<string[]>([])

  resigningSecretaryName = ref("NUR ASHIKIN BINTI SHAHARUDDIN")
  resigningSecretaryIdentification = ref("941024-04-5428")
  resigningSecretaryPractisingCertificateNumber = ref("202408000763")

  replacementSecretaryName = ref("AHMAD ASYRAQ BIN ABDUL RASID")
  replacementSecretaryIdentification = ref("870523-04-5275")
  replacementSecretaryPractisingCertificateNumber = ref("202608000324")

  private directorsLoadVersion = 0

  constructor(companyId: string) {
    this.companyId.value = companyId
  }

  get canDownload(): boolean {
    return (
      !this.isDownloading.value &&
      !this.isLoadingDirectors.value &&
      !!this.documentRef.value &&
      !this.documentRef.value.isLoading &&
      !this.documentRef.value.errorMessage &&
      this.selectedDirectorIds.value.length > 0
    )
  }

  setCompanyId(companyId: string): void {
    this.companyId.value = companyId

    if (this.isShowDocument.value) {
      void this.fetchDirectors()
    }
  }

  async fetchDirectors(): Promise<void> {
    const version = ++this.directorsLoadVersion

    this.isLoadingDirectors.value = true
    this.errorMessage.value = ""
    this.directors.value = []
    this.selectedDirectorIds.value = []

    try {
      if (!this.companyId.value) {
        throw new Error("Company is required.")
      }

      const repository = useDirectorStore()
      const response = await repository.fetchAllForCompany(this.companyId.value)

      if (version !== this.directorsLoadVersion) {
        return
      }

      if (repository.error) {
        throw new Error("Unable to load directors.")
      }

      this.directors.value = (response ?? []).map((item: any) => new Director(item))

      this.selectedDirectorIds.value = this.directors.value
        .filter((director: Director) => {
          return !!director.id
        })
        .map((director: Director) => {
          return director.id
        })

      if (this.directors.value.length === 0) {
        this.errorMessage.value = "No directors found for this company."
      }
    } catch (error) {
      if (version !== this.directorsLoadVersion) {
        return
      }

      this.errorMessage.value = error instanceof Error ? error.message : "Unable to load directors."

      console.error(error)
    } finally {
      if (version === this.directorsLoadVersion) {
        this.isLoadingDirectors.value = false
      }
    }
  }

  onOpenDocument(): void {
    if (this.isShowDocument.value) return

    this.isShowDocument.value = true
    void this.fetchDirectors()
  }

  onCloseDocument(): void {
    if (this.isDownloading.value) return

    this.isShowDocument.value = false
  }

  async onDownloadDocument(): Promise<void> {
    const document = this.documentRef.value

    if (!this.canDownload || !document) return

    this.isDownloading.value = true
    this.errorMessage.value = ""

    try {
      await nextTick()

      const pages = await document.getPdfPages()

      if (pages.length === 0) {
        throw new Error("No document pages available to download.")
      }

      await PdfPaperUtil.generatePdfFile(
        pages,
        19,
        "Resignation and Appointment of Company Secretary.pdf",
        PaperSize.A4,
        PaperOrientation.Portrait
      )
    } catch (error) {
      this.errorMessage.value = error instanceof Error ? error.message : "Unable to download the document."

      console.error(error)
    } finally {
      this.isDownloading.value = false
    }
  }
}
