import { PaperOrientation } from "~/scripts/constants/Paper"
import { Error } from "~/scripts/library/Error"
import { Company } from "~/scripts/models/Company"
import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"
import { StringUtil } from "~/scripts/utils/String"

export abstract class SdnBhdLegalDocumentController {
  legalDocumentName = ref<string>("")
  companyId = ref<string>("")
  company = ref<Company>(new Company())

  companyRepository = useCompanyStore()

  paperOrientation: PaperOrientation = PaperOrientation.Portrait

  isFetchingCompany: Ref<boolean> = ref<boolean>(true)
  isInPreviewMode: Ref<boolean> = ref<boolean>(true)

  documentRef: any | null = null

  constructor(legalDocumentName: string, companyId: string, paperOrientation: PaperOrientation) {
    this.paperOrientation = paperOrientation
    this.setLegalDocumentName(legalDocumentName)
    this.setCompanyId(companyId)
  }

  setLegalDocumentName(legalDocumentName: string): void {
    this.legalDocumentName.value = legalDocumentName
  }

  async setCompanyId(companyId: string): Promise<void> {
    this.companyId.value = companyId
    await this.fetchCompany()
  }

  setIsInPreviewMode(isInPreviewMode: boolean): void {
    this.isInPreviewMode.value = isInPreviewMode
  }

  setDocumentRef(documentRef: any): void {
    this.documentRef = documentRef
  }

  async fetchCompany(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId.value)) {
      return
    }

    try {
      this.isFetchingCompany.value = true
      let response = await this.companyRepository.fetch(this.companyId.value)
      if (this.companyRepository.error !== null) {
        throw this.companyRepository.error
      }

      this.company.value = new Company(response)
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error: Error = new Error()
        error.setForFetch()
        error.handle()
      }
    } finally {
      this.isFetchingCompany.value = false
    }
  }

  companyName(): string {
    return this.company.value.getFullName().toUpperCase()
  }

  registrationNumberNew(): string {
    return this.company.value.registrationNumberNew
  }

  registrationNumberOld(): string {
    return this.company.value.registrationNumberOld
  }

  companyAddress(): string {
    if (!this.company.value.businessAddressLocation) {
      return this.company.value.registeredAddressLocation?.getMultilineAddress() ?? ""
    }

    return this.company.value.businessAddressLocation.getMultilineAddress()
  }

  async getPdfPages(): Promise<HTMLElement[]> {
    if (!this.documentRef) {
      return []
    }

    await nextTick()
    let pdfPages = await PdfPaperUtil.getPdfElements(this.documentRef)

    return pdfPages
  }
}
