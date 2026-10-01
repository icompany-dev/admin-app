import { DocumentsAndForms } from "~/scripts/library/DocumentsAndForms"
import { Filter } from "~/scripts/library/Filter"
import { PropsCompanyDocument } from "~/scripts/props/PropsCompanyDocument"
import { PropsDocument } from "~/scripts/props/PropsDocument"
import { PropsUploadDocument } from "~/scripts/props/PropsUploadDocument"
import type { CompanyDocument } from "~/scripts/types/CompanyDocument"

export class DocumentsController {
  companyId: Ref<string> = ref<string>("")
  filter: Ref<Filter> = ref<Filter>(new Filter())

  isLoading: Ref<boolean> = ref<boolean>(false)

  documentsAndForms = ref<DocumentsAndForms>(new DocumentsAndForms(""))

  emitEvents: any | null = null

  uploadDocumentRef: any | null = null

  language = useLanguage()

  constructor(props: PropsCompanyDocument, emitEvents: any) {
    this.emitEvents = emitEvents

    this.setDataFromProps(props)
  }

  async setDataFromProps(props: PropsCompanyDocument): Promise<void> {
    this.companyId.value = props.companyId
    this.filter.value = props.filter

    if (this.documentsAndForms.value.companyId !== this.companyId.value) {
      this.documentsAndForms.value.companyId = this.companyId.value
      await this.documentsAndForms.value.init()
    }
  }

  setUploadDocumentRef(uploadDocumentRef: any): void {
    this.uploadDocumentRef = uploadDocumentRef
  }

  onUploadDocumentClicked(): void {
    if (!this.uploadDocumentRef) {
      return
    }

    this.uploadDocumentRef.show()
  }

  async postUploadDocument(): Promise<void> {
    await this.documentsAndForms.value.init()
  }

  getNoRecordTitle(documentType: string): string {
    return this.language.isMalay() ? "Tiada Dokumen Sedia Ada" : `No ${documentType} Available`
  }

  getNoRecordSubtitle(documentType: string): string {
    return this.language.isMalay()
      ? "Tiada resolution, dokumen atau borang sedia ada atau di dalam record Sistem iCompany buat Syarikat ini."
      : `No ${documentType} is currently recorded or available in iCompany System for this Company.`
  }

  getPropsDocument(companyDocument: CompanyDocument): PropsDocument {
    let props = new PropsDocument(
      companyDocument.id,
      companyDocument.isSelected,
      companyDocument.documentName,
      companyDocument.fileUrl,
      companyDocument.isFromMyData,
      companyDocument.documentDate,
      companyDocument.isDisabled
    )

    props.isShowName = true
    props.canvasScale = 0.25

    return props
  }

  get isLoadingPage(): boolean {
    return this.isLoading.value || this.documentsAndForms.value.isFetchingDocuments
  }

  get uploadDocumentProps(): PropsUploadDocument {
    return new PropsUploadDocument(this.companyId.value)
  }

  get resolutions(): CompanyDocument[] {
    let documents = this.documentsAndForms.value.getResolutions()
    documents.forEach((cd: CompanyDocument) => {
      cd.isSelected = false
    })

    return documents
  }

  get statutoryForms(): CompanyDocument[] {
    let documents = this.documentsAndForms.value.getStatutoryForms()
    documents.forEach((cd: CompanyDocument) => {
      cd.isSelected = false
    })

    return documents
  }

  get others(): CompanyDocument[] {
    let documents = this.documentsAndForms.value.getNonResolutionStatutoryForms()
    documents.forEach((cd: CompanyDocument) => {
      cd.isSelected = false
    })

    return documents
  }

  get numberOfDocuments(): number {
    return this.statutoryForms.length + this.resolutions.length + this.others.length
  }

  get resolutionsLabel(): string {
    return this.language.isMalay() ? "Resolusi" : "Resolutions"
  }

  get statutoryFormsLabel(): string {
    return this.language.isMalay() ? "Borang Berkanun" : "Statutory Forms"
  }

  get otherDocumentsLabel(): string {
    return this.language.isMalay() ? "Lain-Lain" : "Others"
  }

  get loaderLabel(): string {
    return this.language.isMalay() ? "Sedang Memaut" : "Preparing Your"
  }

  get loaderSublabel(): string {
    return this.language.isMalay() ? "Dokumen Syarikat Anda" : "Company Documents"
  }

  get noRecord(): string {
    return this.language.isMalay() ? "Tiada Dokumen Sedia Ada" : "No Documents Available"
  }

  get noRecordDetails(): string {
    return this.language.isMalay()
      ? "Tiada resolution, dokumen atau borang sedia ada atau di dalam record Sistem iCompany buat Syarikat ini."
      : "No resolution, documents or forms is currently recorded or available in iCompany System for this Company."
  }

  get noRecordTooltipTitle(): string {
    return this.language.isMalay() ? "Tiada Dokumen Sedia Ada" : "No Documents Available"
  }

  get noRecordTooltipDetails(): string {
    if (this.language.isMalay()) {
      return `
        This may be because:
        <ol>
          <li>the relevant application, document or statutory fee has not been paid;</li>
          <li>for resolutions, the Directors may not have signed or completed the relevant application;</li>
          <li>the document is not yet due, required or available at this stage;</li>
          <li>the relevant transaction, filing or corporate action was undertaken outside iCompany Systems, or the prescribed process was skipped, and the document is therefore not within our records or control;</li>
          <li>the relevant matter, application or process has lapsed, expired, been superseded or otherwise no longer requires further action; or</li>
          <li>the document may be available through the SSM Middleware System and should be checked separately.</li>
        </ol>
      `
    }

    return `
      This may be because:
      <ol>
        <li>the relevant application, document or statutory fee has not been paid;</li>
        <li>for resolutions, the Directors may not have signed or completed the relevant application;</li>
        <li>the document is not yet due, required or available at this stage;</li>
        <li>the relevant transaction, filing or corporate action was undertaken outside iCompany Systems, or the prescribed process was skipped, and the document is therefore not within our records or control;</li>
        <li>the relevant matter, application or process has lapsed, expired, been superseded or otherwise no longer requires further action; or</li>
        <li>the document may be available through the SSM Middleware System and should be checked separately.</li>
      </ol>
    `
  }
}
