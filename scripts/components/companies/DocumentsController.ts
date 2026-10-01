import { DocumentsAndForms } from "~/scripts/library/DocumentsAndForms"
import { Filter } from "~/scripts/library/Filter"
import type { PropsCompanyDocument } from "~/scripts/props/PropsCompanyDocument"
import { PropsUploadDocument } from "~/scripts/props/PropsUploadDocument"

export class DocumentsController {
  companyId: Ref<string> = ref<string>("")
  filter: Ref<Filter> = ref<Filter>(new Filter())

  isLoading: Ref<boolean> = ref<boolean>(false)

  documentsAndForms = ref<DocumentsAndForms>(new DocumentsAndForms(""))

  emitEvents: any | null = null

  uploadDocumentRef: any | null = null

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

  get isLoadingPage(): boolean {
    return this.isLoading.value || this.documentsAndForms.value.isFetchingDocuments
  }

  get uploadDocumentProps(): PropsUploadDocument {
    return new PropsUploadDocument(this.companyId.value)
  }
}
