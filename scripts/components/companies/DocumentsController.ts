import { PDFDocument, PDFPage } from "pdf-lib"
import ThirdSchedule from "~/components/LegalDocuments/ThirdSchedule.vue"
import { DocumentsAndForms } from "~/scripts/library/DocumentsAndForms"
import { Error } from "~/scripts/library/Error"
import { Filter } from "~/scripts/library/Filter"
import { Toast } from "~/scripts/library/Toast"
import { EmailAttachment } from "~/scripts/models/AdminEmail"
import { File } from "~/scripts/models/File"
import { PropsCompanyDocument } from "~/scripts/props/PropsCompanyDocument"
import { PropsDocument } from "~/scripts/props/PropsDocument"
import { PropsEditFilenames } from "~/scripts/props/PropsEditFilenames"
import { PropsSendEmail } from "~/scripts/props/PropsSendEmail"
import { PropsUploadDocument } from "~/scripts/props/PropsUploadDocument"
import { CompanyDocument } from "~/scripts/types/CompanyDocument"
import { DownloadFileData } from "~/scripts/types/DownloadFileData"
import { ActionTrayDropdown } from "~/scripts/types/action-trays/ActionTrayDropdown"
import { ActionTrayElement, ActionTrayLabel } from "~/scripts/types/action-trays/ActionTrayElement"
import { FileZipper } from "~/scripts/utils/FileZipper"
import { StringUtil } from "~/scripts/utils/String"

export class DocumentsController {
  companyId: Ref<string> = ref<string>("")
  filter: Ref<Filter> = ref<Filter>(new Filter())

  isLoading: Ref<boolean> = ref<boolean>(false)

  documentsAndForms = ref<DocumentsAndForms>(new DocumentsAndForms(""))

  emitEvents: any | null = null

  uploadDocumentRef: any | null = null
  viewDocumentRef: any | null = null
  editFilenamesRef: any | null = null
  confirmDeleteRef: any | null = null

  selectedDocuments: Ref<CompanyDocument[]> = ref<CompanyDocument[]>([])

  isDownloading: Ref<boolean> = ref<boolean>(false)
  isPrinting: Ref<boolean> = ref<boolean>(false)
  isDeleting: Ref<boolean> = ref<boolean>(false)
  isUpdating: Ref<boolean> = ref<boolean>(false)
  isEmailing: Ref<boolean> = ref<boolean>(false)

  isSelectAll: Ref<boolean> = ref<boolean>(false)

  pdfUrlToView: Ref<string> = ref<string>("")
  pdfFileNameToView: Ref<string> = ref<string>("")
  isShowingDocument: Ref<boolean> = ref<boolean>(false)

  language = useLanguage()
  eventManager = useEventManagerStore()

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

  setViewDocumentRef(viewDocumentRef: any | null): void {
    this.viewDocumentRef = viewDocumentRef
  }

  setUploadDocumentRef(uploadDocumentRef: any): void {
    this.uploadDocumentRef = uploadDocumentRef
  }

  setEditFilenamesRef(editFilenamesRef: any): void {
    this.editFilenamesRef = editFilenamesRef
  }

  setConfirmDeleteRef(confirmDeleteRef: any): void {
    this.confirmDeleteRef = confirmDeleteRef
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

  onDocumentClicked(companyDocument: CompanyDocument): void {
    this.pdfUrlToView.value = companyDocument.fileUrl ?? ""
    this.pdfFileNameToView.value = companyDocument.documentName ?? ""
    this.isShowingDocument.value = true
    if (this.viewDocumentRef && !StringUtil.isNullOrEmpty(this.pdfUrlToView.value)) {
      this.viewDocumentRef.show()
    }
  }

  onHideViewDocument(): void {
    this.pdfUrlToView.value = ""
    this.pdfFileNameToView.value = ""
    this.isShowingDocument.value = false
  }

  onSelectionChanged(value: boolean, companyDocument: CompanyDocument): void {
    companyDocument.isSelected = value

    if (!companyDocument.isSelected) {
      this.selectedDocuments.value = this.selectedDocuments.value.filter((cd: CompanyDocument) => {
        return cd.id !== companyDocument.id
      })
    } else {
      this.selectedDocuments.value.push(companyDocument)
    }
  }

  onRemoveDocumentsClicked(): void {
    if (!this.confirmDeleteRef) {
      return
    }

    this.isDeleting.value = true
    this.confirmDeleteRef.show()
  }

  onCancelDelete(): void {
    this.isDeleting.value = false
  }

  async onProceedDelete(): Promise<void> {
    try {
      let promises = this.selectedDocuments.value.map((cd: CompanyDocument) => {
        let repository = useFormStore()
        return repository.remove(cd.id)
      })

      await Promise.all(promises)

      let toastTitle = this.language.isMalay()
        ? "Dokumen yang dipilih telah berjaya dipadamkan daripada sistem iCompany."
        : "The selected documents have been successfully removed from the iCompany system."
      let toastMessage = this.language.isMalay()
        ? "Sila tunggu sementara kami memaut semula senarai dokumen."
        : "Please wait while we refresh the documents list."
      let toast = new Toast(toastTitle, toastMessage)
      toast.success()

      this.selectedDocuments.value = []

      await this.documentsAndForms.value.init()
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.isMalay = this.language.isMalay()
        error.setForCUD()
        error.handle()
      }
    } finally {
      this.isDeleting.value = false
    }
  }

  async onDownloadClicked(): Promise<void> {
    if (this.isDownloading.value) {
      return
    }

    try {
      this.isDownloading.value = true

      let files = []
      for (let i = 0; i < this.selectedDocuments.value.length; i++) {
        let companyDocument = this.selectedDocuments.value[i] ?? null
        if (!companyDocument) {
          continue
        }

        if (!companyDocument.fileUrl || StringUtil.isNullOrEmpty(companyDocument.fileUrl)) {
          continue
        }

        let response = await fetch(companyDocument.fileUrl)
        if (!response.ok) {
          continue
        }

        let blob = await response.blob()
        let filename = companyDocument.documentName
        if (!StringUtil.contains(companyDocument.documentName, ".pdf")) {
          filename = `${filename}.pdf`
        }
        files.push(new DownloadFileData(URL.createObjectURL(blob), `${i + 1}. ${filename}`))
      }

      await FileZipper.zipAndDownload(files, `Company Documents.zip`)
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.isMalay = this.language.isMalay()
        error.setForCUD()
        error.handle()
      }
    } finally {
      this.isDownloading.value = false
    }
  }

  async onPrintClicked(): Promise<void> {
    if (this.isPrinting.value) {
      return
    }

    this.isPrinting.value = true

    try {
      let promises = this.selectedDocuments.value
        .filter((cd: CompanyDocument) => {
          return !StringUtil.isNullOrEmpty(cd.fileUrl)
        })
        .map(async (cd: CompanyDocument) => {
          try {
            let response = await fetch(cd.fileUrl ?? "")
            if (!response.ok) {
              return null
            }

            return {
              name: cd.documentName || "Document",
              buffer: await response.arrayBuffer(),
            }
          } catch (e) {
            return null
          }
        })

      const fetchedDocs = (await Promise.all(promises)).filter(Boolean)

      const mergedPdf = await PDFDocument.create()
      const encryptedBuffers: ArrayBuffer[] = []
      let hasMergeablePages = false

      for (const doc of fetchedDocs) {
        if (!doc?.buffer) {
          continue
        }

        try {
          const sourcedPdf = await PDFDocument.load(doc.buffer)

          if (sourcedPdf.isEncrypted) {
            encryptedBuffers.push(doc.buffer)
            continue
          }

          const copiedPages = await mergedPdf.copyPages(sourcedPdf, sourcedPdf.getPageIndices())
          copiedPages.forEach((page: PDFPage) => {
            mergedPdf.addPage(page)
          })
          hasMergeablePages = true
        } catch (e) {
          encryptedBuffers.push(doc.buffer)
        }
      }

      if (hasMergeablePages) {
        const mergedBytes = await mergedPdf.save()
        this.openAndPrintBlob(new Blob([mergedBytes], { type: "application/pdf" }))
      }

      for (const encBuffer of encryptedBuffers) {
        this.openAndPrintBlob(new Blob([encBuffer], { type: "application/pdf" }))
      }
    } catch (e) {
      console.error(e)
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.isMalay = this.language.isMalay()
        error.setForCUD()
        error.handle()
      }
    } finally {
      this.isPrinting.value = false
    }
  }

  private openAndPrintBlob(blob: Blob): void {
    const blobUrl = URL.createObjectURL(blob)

    const printWindow = window.open(blobUrl, "_blank")
    if (!printWindow) {
      throw "Fail to open new window"
    }

    printWindow.onload = () => {
      printWindow.focus()
      printWindow.print()
    }
  }

  async onEmailClicked(): Promise<void> {
    if (this.isEmailing.value) {
      return
    }

    try {
      let files: globalThis.File[] = []
      let promises = this.selectedDocuments.value
        .filter((cd: CompanyDocument) => {
          return !StringUtil.isNullOrEmpty(cd.fileUrl)
        })
        .map((cd: CompanyDocument) => {
          return fetch(cd.fileUrl ?? "").then(async (response) => {
            if (!response.ok) {
              return
            }

            let blob = await response.blob()
            files.push(new globalThis.File([blob], cd.documentName, { type: "application/pdf" }))
          })
        })

      await Promise.all(promises)

      // let emailAttachments: EmailAttachment[] = this.selectedDocuments.value
      //   .filter((cd: CompanyDocument) => {
      //     return !StringUtil.isNullOrEmpty(cd.fileUrl)
      //   })
      //   .map((cd: CompanyDocument) => {
      //     let emailAttachment = new EmailAttachment()
      //     emailAttachment.url = cd.fileUrl ?? ""
      //     emailAttachment.fileName = cd.documentName
      //     emailAttachment.mimeType = `application/pdf`
      //     return emailAttachment
      //   })

      let propsSendEmail = new PropsSendEmail([], "", "", [], files)
      this.eventManager.setPropsSendEmail(propsSendEmail)
      this.eventManager.setIsSendingEmail(true)

      console.log(this.eventManager.propsSendEmail)
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.isMalay = this.language.isMalay()
        error.setForCUD()
        error.handle()
      }
    } finally {
      this.isEmailing.value = false
    }
  }

  onCancelUpdateFilenameClicked(): void {
    this.isUpdating.value = false
  }

  onUpdateFilenameClicked(): void {
    if (!this.editFilenamesRef) {
      return
    }

    this.isUpdating.value = true
    this.editFilenamesRef.show()
  }

  onSelectUnselectClicked(): void {
    this.isSelectAll.value = !this.isSelectAll.value
    if (this.isSelectAll.value) {
      this.selectedDocuments.value = this.documentsAndForms.value.documents.map((cd: CompanyDocument) => {
        return cd
      })
    } else {
      this.selectedDocuments.value = []
    }
  }

  async onCompleteUpdateFilename(): Promise<void> {
    try {
      this.selectedDocuments.value = []

      await this.documentsAndForms.value.init()
    } catch (e) {
      //
    } finally {
      this.isUpdating.value = false
    }
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
      cd.isSelected = this.isSelectAll.value
    })

    return documents
  }

  get statutoryForms(): CompanyDocument[] {
    let documents = this.documentsAndForms.value.getStatutoryForms()
    documents.forEach((cd: CompanyDocument) => {
      cd.isSelected = this.isSelectAll.value
    })

    return documents
  }

  get others(): CompanyDocument[] {
    let documents = this.documentsAndForms.value.getNonResolutionStatutoryForms()
    documents.forEach((cd: CompanyDocument) => {
      cd.isSelected = this.isSelectAll.value
    })

    return documents
  }

  get vouchersAndCerts(): CompanyDocument[] {
    let documents = this.documentsAndForms.value.getVouchersAndCertificates()
    documents.forEach((cd: CompanyDocument) => {
      cd.isSelected = this.isSelectAll.value
    })

    return documents
  }

  get hasVouchersOrCerts(): boolean {
    return this.vouchersAndCerts.length > 0
  }

  get numberOfDocuments(): number {
    return this.statutoryForms.length + this.resolutions.length + this.others.length + this.vouchersAndCerts.length
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

  get vouchersCertsLabel(): string {
    return this.language.isMalay() ? "Baucar & Sijil" : "Vouchers & Certificates"
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

  get actionTrayElements(): ActionTrayElement[] {
    let prependElements = []
    if (this.canCarryOutActions) {
      let titleEn = this.isSelectAll.value ? "Clear Selection" : "Select All"
      let titleBm = this.isSelectAll.value ? "Clear Selection" : "Pilih Semua"
      prependElements.push(
        new ActionTrayElement("select", this.onSelectUnselectClicked.bind(this), {
          label: new ActionTrayLabel(titleEn, titleBm),
        })
      )
    }

    return [
      ...prependElements,
      new ActionTrayElement("download", this.onDownloadClicked.bind(this), {
        label: new ActionTrayLabel("Download", "Muat Turun"),
        isDisabled: !this.canCarryOutActions,
        iconClass: this.isDownloading.value ? "fa-regular fa-spin fa-spinner" : "",
        isIconStart: this.isDownloading.value,
      }),
      new ActionTrayElement("print", this.onPrintClicked.bind(this), {
        label: new ActionTrayLabel("Print", "Cetak"),
        isDisabled: !this.canCarryOutActions,
        iconClass: this.isPrinting.value ? "fa-regular fa-spin fa-spinner" : "",
        isIconStart: this.isPrinting.value,
      }),
      new ActionTrayElement("email", this.onEmailClicked.bind(this), {
        label: new ActionTrayLabel("Email", "Emel"),
        isDisabled: !this.canCarryOutActions,
        iconClass: this.isEmailing.value ? "fa-regular fa-spin fa-spinner" : "",
        isIconStart: this.isEmailing.value,
      }),
      new ActionTrayDropdown(
        "more",
        {
          iconClass: this.isAnyMoreActionsOngoing ? "fa-regular fa-spin fa-spinner" : "fa-solid fa-ellipsis",
          isIconOnly: true,
        },
        [
          new ActionTrayElement("edit", this.onUpdateFilenameClicked.bind(this), {
            label: new ActionTrayLabel("Update Name", "Kemaskini Nama"),
            isDisabled: !this.canCarryOutActions,
            iconClass: this.isUpdating.value ? "fa-regular fa-spin fa-spinner" : "",
            isIconStart: this.isUpdating.value,
          }),
          new ActionTrayElement("delete", this.onRemoveDocumentsClicked.bind(this), {
            label: new ActionTrayLabel("Remove", "Padam"),
            isDisabled: !this.canCarryOutActions,
            iconClass: this.isDeleting.value ? "fa-regular fa-spin fa-spinner" : "",
            isIconStart: this.isDeleting.value,
          }),
        ]
      ),
    ]
  }

  get isAnyMoreActionsOngoing(): boolean {
    return this.isUpdating.value || this.isDeleting.value
  }

  get numberOfSelection(): number {
    return this.selectedDocuments.value.length
  }

  get canCarryOutActions(): boolean {
    return (
      !this.isDownloading.value &&
      !this.isDeleting.value &&
      !this.isUpdating.value &&
      this.selectedDocuments.value.length > 0
    )
  }

  get editFilenamesProps(): PropsEditFilenames {
    let props = new PropsEditFilenames(
      this.selectedDocuments.value
        .filter((cd: CompanyDocument) => {
          return !StringUtil.isNullOrEmpty(cd.fileId)
        })
        .map((cd: CompanyDocument) => {
          let file = new File()
          file.id = cd.fileId
          file.name = cd.documentName
          return file
        })
    )

    return props
  }

  get removeItemName(): string {
    if (this.language.isMalay()) {
      return this.selectedDocuments.value.length > 1 ? "Dokumen ini" : "Dokumen - Dokumen ini"
    }

    return this.selectedDocuments.value.length > 1 ? "these Documents" : "this Document"
  }
}
