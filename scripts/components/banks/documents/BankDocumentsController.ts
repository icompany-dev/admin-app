import { BankDocumentFetcher } from "~/scripts/library/BankDocumentFetcher"
import { PdfRenderer } from "~/scripts/library/PdfRenderer"
import { StringUtil } from "~/scripts/utils/String"
import { CompanyBankAccountOpening } from "~/scripts/models/CompanyBankAccountOpening"
import { CompanyBankSignatory } from "~/scripts/models/CompanyBankSignatory"
import { OnlineBanking } from "~/scripts/types/banks/OnlineBanking"
import type { AllianceBankApplicationDetails } from "~/scripts/types/banks/AllianceBankApplicationDetails"

export class BankDocumentsController {
  companyId: Ref<string> = ref<string>("")

  documentFetcher = ref<BankDocumentFetcher>(new BankDocumentFetcher(""))

  dcrRef: any | null = null
  currentRef: any | null = null

  emitEvents: any | null = null

  pdfRenderers = ref<PdfRenderer[]>([])

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
    await this.documentFetcher.value.fetchForms()

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
}
