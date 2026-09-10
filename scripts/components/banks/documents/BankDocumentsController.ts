import { BankDocumentFetcher } from "~/scripts/library/BankDocumentFetcher"
import { PdfRenderer } from "~/scripts/library/PdfRenderer"
import { StringUtil } from "~/scripts/utils/String"
import { CompanyBankAccountOpening } from "~/scripts/models/CompanyBankAccountOpening"
import { CompanyBankSignatory } from "~/scripts/models/CompanyBankSignatory"
import { OnlineBanking } from "~/scripts/types/banks/OnlineBanking"
import type { AllianceBankApplicationDetails } from "~/scripts/types/banks/AllianceBankApplicationDetails"
import { DownloadFileData } from "~/scripts/types/DownloadFileData"
import { FileZipper } from "~/scripts/utils/FileZipper"
import { Director } from "~/scripts/models/Director"
import { PropsIdentificationDocumentWatermark } from "~/scripts/props/PropsIdentificationDocumentWatermark"
import { PaperOrientation, PaperSize } from "~/scripts/constants/Paper"
import { User } from "~/scripts/models/User"

export class BankDocumentsController {
  companyId: Ref<string> = ref<string>("")

  documentFetcher = ref<BankDocumentFetcher>(new BankDocumentFetcher(""))

  directors: Ref<Director[]> = ref<Director[]>([])

  dcrRef: any | null = null
  currentRef: any | null = null

  emitEvents: any | null = null

  pdfRenderers = ref<PdfRenderer[]>([])
  identificationRefs = ref<any[]>([])

  language = useLanguage()

  constructor(companyId: string, emitEvents: any) {
    this.setCompanyId(companyId)
    this.emitEvents = emitEvents
  }

  async setCompanyId(companyId: string): Promise<void> {
    this.pdfRenderers.value = []

    if (this.documentFetcher.value.isLoading) {
      setTimeout(() => {
        this.setCompanyId(companyId)
      }, 500)
      return
    }

    this.companyId.value = companyId
    this.documentFetcher.value.setCompanyId(this.companyId.value)
    await Promise.all([this.documentFetcher.value.fetchForms(), this.fetchDirectors()])

    this.setupPdfRenderers()

    let promises = this.pdfRenderers.value
      .map((pdf: PdfRenderer, index: number) => {
        let document = this.documentsToDisplay[index] ?? ""
        if (StringUtil.isNullOrEmpty(document)) {
          return null
        }

        pdf.pdfUrl = document
        return pdf.renderPdf()
      })
      .filter((p: any) => {
        return p !== null
      })

    await Promise.all(promises)
  }

  setDcrRef(dcrRef: any): void {
    this.dcrRef = dcrRef
  }

  setCurrentRef(currentRef: any): void {
    this.currentRef = currentRef
  }

  setIdentificationRefs(ref: any, index: number): void {
    this.identificationRefs.value[index] = ref
  }

  setupPdfRenderers(): void {
    this.pdfRenderers.value = this.documentsToDisplay.map((s: string) => {
      return new PdfRenderer("")
    })
  }

  setCanvasesForDocument(index: number, pageNumber: number, canvas: HTMLCanvasElement | null): void {
    let pdfRenderer = this.pdfRenderers.value[index] ?? null

    if (!pdfRenderer) {
      return
    }

    pdfRenderer.setPageCanvas(pageNumber, canvas)
  }

  hasDocument(index: number): boolean {
    let document = this.documentsToDisplay[index] ?? ""
    return !StringUtil.isNullOrEmpty(document)
  }

  documentName(index: number): string {
    return this.documentNames[index] ?? "Document Name"
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

  getIdentificationDocumentWatermarkProps(director: Director): PropsIdentificationDocumentWatermark {
    let userDetail = director.user?.detail
    return new PropsIdentificationDocumentWatermark(
      userDetail?.verificationFile?.url ?? "",
      userDetail?.verificationFileAlt?.url ?? "",
      "FOR OPENING BANK ONLY",
      PaperOrientation.Portrait,
      PaperSize.A4
    )
  }

  //getters
  get documentsToDisplay(): string[] {
    if (this.documentFetcher.value.isLoading || StringUtil.isNullOrEmpty(this.companyId.value)) {
      return []
    }

    let documents = [
      this.documentFetcher.value.section14FileUrl,
      this.documentFetcher.value.section15FileUrl,
      this.documentFetcher.value.section17FileUrl,
    ]

    if (!StringUtil.isNullOrEmpty(this.documentFetcher.value.section46FileUrl)) {
      documents.push(this.documentFetcher.value.section46FileUrl)
    }

    documents = documents.concat([
      this.documentFetcher.value.section51FileUrl,
      this.documentFetcher.value.section58FileUrl,
    ])

    if (!StringUtil.isNullOrEmpty(this.documentFetcher.value.section78FileUrl)) {
      documents.push(this.documentFetcher.value.section78FileUrl)
    }

    if (!StringUtil.isNullOrEmpty(this.documentFetcher.value.constitutionFileUrl)) {
      documents.push(this.documentFetcher.value.constitutionFileUrl)
    }

    return documents
  }

  get documentNames(): string[] {
    if (this.documentFetcher.value.isLoading || StringUtil.isNullOrEmpty(this.companyId.value)) {
      return []
    }

    let documents = [
      this.language.isMalay() ? "Seksyen 14<br>Superform" : "Section 14<br>Superform",
      this.language.isMalay()
        ? "Seksyen 15<br>Makluman<br>Pemerbadanan"
        : "Section 15<br>Notification of<br>Incorporation",
      this.language.isMalay() ? "Seksyen 17<br>Sijil Pemerbadanan" : "Section 17<br>Certificate of<br>Incorporation",
    ]

    if (!StringUtil.isNullOrEmpty(this.documentFetcher.value.section46FileUrl)) {
      documents.push(
        this.language.isMalay()
          ? "Seksyen 46<br>Makluman<br>Pertukaran<br>Alamat Berdaftar"
          : "Section 46<br>Notification of<br>Change<br>Registered Address"
      )
    }

    documents = documents.concat([
      this.language.isMalay() ? "Seksyen 51<br>Daftar<br>Pemegang Saham" : "Section 51<br>Register of<br>Members",
      this.language.isMalay() ? "Seksyen 58<br>Daftar<br>Pengarah..." : "Section 58<br>Register of<br>Directors...",
    ])

    if (!StringUtil.isNullOrEmpty(this.documentFetcher.value.section78FileUrl)) {
      documents.push(
        this.language.isMalay() ? "Seksyen 78<br>Return of<br>Allotment" : "Section 78<br>Return of<br>Allotment"
      )
    }

    if (!StringUtil.isNullOrEmpty(this.documentFetcher.value.constitutionFileUrl)) {
      documents.push(this.language.isMalay() ? "Perlembagaan<br>Syarikat" : "Company's<br>Constitution")
    }

    return documents
  }

  getBranchId(): string {
    if (!this.dcrRef) {
      return ""
    }

    return this.dcrRef.getBranchId()
  }

  getSignatories(): CompanyBankSignatory[] {
    if (!this.currentRef) {
      if (this.dcrRef) {
        return this.dcrRef.getSignatories()
      }

      return []
    }

    return this.currentRef.getSignatories()
  }

  getSignatoryType(): string {
    if (!this.dcrRef) {
      return ""
    }

    return this.dcrRef.getSignatoryType()
  }

  getAuthorisedPersonsForOnlineBanking(): OnlineBanking[] {
    if (!this.dcrRef) {
      return []
    }

    return this.dcrRef.getAuthorisedPersonsForOnlineBanking()
  }

  getOtherDetails(): AllianceBankApplicationDetails | null {
    if (!this.dcrRef) {
      return null
    }

    return this.dcrRef.getOtherDetails()
  }

  async downloadPdfs(): Promise<void> {
    let files: DownloadFileData[] = []

    for (let index = 0; index < this.documentsToDisplay.length; index++) {
      let url = this.documentsToDisplay[index]

      if (StringUtil.isNullOrEmpty(url)) {
        continue
      }

      let filename = ""
      switch (url) {
        case this.documentFetcher.value.section14FileUrl:
          filename = "Section 14 - Superform.pdf"
          break
        case this.documentFetcher.value.section15FileUrl:
          filename = "Section 15 - Notification of Incorporation.pdf"
          break
        case this.documentFetcher.value.section17FileUrl:
          filename = "Section 17 - Certificate of Incorporation.pdf"
          break
        case this.documentFetcher.value.section46FileUrl:
          filename = "Section 46 - Notification of Change of Registered Address.pdf"
          break
        case this.documentFetcher.value.section51FileUrl:
          filename = "Section 51 - Register of Members.pdf"
          break
        case this.documentFetcher.value.section58FileUrl:
          filename = "Section 58 - Register of Directors.pdf"
          break
        case this.documentFetcher.value.section78FileUrl:
          filename = "Section 78 - Return of Allotment.pdf"
          break
        case this.documentFetcher.value.constitutionFileUrl:
          filename = "Constitution.pdf"
          break
        case "https://icompany-public.s3.ap-southeast-1.amazonaws.com/public/documents/samples/affin-bank-application-form.pdf":
          filename = "Affin Bank Universal Business Banking Form.pdf"
          break
        case "https://icompany-public.s3.ap-southeast-1.amazonaws.com/public/documents/samples/Alliance-BankUniversal-Business-Banking-Form.pdf":
          filename = "Alliance Bank Universal Business Banking Form.pdf"
          break
      }

      if (StringUtil.isNullOrEmpty(filename)) {
        continue
      }

      const response = await fetch(url)
      if (!response.ok) {
        continue
      }

      const blob = await response.blob()
      files.push(new DownloadFileData(URL.createObjectURL(blob), filename))
    }

    let zipFilename = `Bank Account Opening.zip`

    await FileZipper.zipAndDownload(files, zipFilename)
  }
}
