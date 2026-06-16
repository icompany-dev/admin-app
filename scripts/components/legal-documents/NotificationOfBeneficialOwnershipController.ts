import { PaperOrientation } from "~/scripts/constants/Paper"
import { Error } from "~/scripts/library/Error"
import { Company } from "~/scripts/models/Company"
import { CompanyBODeclaration } from "~/scripts/models/CompanyBODeclaration"
import { Shareholder } from "~/scripts/models/Shareholder"
import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"
import { StringUtil } from "~/scripts/utils/String"

export class NotificationOfBeneficialOwnershipController {
  declarationId: Ref<string> = ref<string>("")
  declaration = ref<CompanyBODeclaration>(new CompanyBODeclaration())

  isLoading = ref<boolean>(false)

  language = useLanguage()
  time = useLocalTime()
  repository = useCompanyBODeclarationStore()

  emitEvents: any | null = null

  additionalCssClass: string = "legal-document notification-of-bo print"
  totalPages: number = 3
  paperOrientation: PaperOrientation = PaperOrientation.Portrait

  documentRef: any | null = null

  constructor(declarationId: string, emitEvents: any) {
    this.emitEvents = emitEvents

    this.setDeclarationId(declarationId)
  }

  async setDeclarationId(declarationId: string): Promise<void> {
    this.declarationId.value = declarationId
    await this.fetchDeclaration()
  }

  setDeclaration(declaration: CompanyBODeclaration): void {
    this.declaration.value = new CompanyBODeclaration(declaration)
  }

  async fetchDeclaration(): Promise<void> {
    if (this.isLoading.value || StringUtil.isNullOrEmpty(this.declarationId.value)) {
      return
    }

    try {
      this.isLoading.value = true

      let response = await this.repository.fetch(this.declarationId.value)
      if (this.repository.error !== null) {
        throw this.repository.error
      }

      this.declaration.value = new CompanyBODeclaration(response)
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error("", "")
        error.setForFetch()
        error.handle()
      }
    } finally {
      this.isLoading.value = false
    }
  }

  async getPdfElements(): Promise<HTMLElement[]> {
    if (!this.documentRef) {
      return []
    }

    return await PdfPaperUtil.getPdfElements(this.documentRef as HTMLElement)
  }

  setDocumentRef(documentRef: any): void {
    this.documentRef = documentRef
  }

  // details
  get company(): Company {
    return this.declaration.value.company ?? new Company()
  }
  get companyName(): string {
    return this.company.getFullName()
  }

  get registrationNumber(): string {
    return `${this.company.registrationNumberNew} (${this.company.registrationNumberOld})`
  }

  get declarationStatus(): string {
    return "New" // need to check if this is a redeclaration for this shareholder
  }

  get dateBecomingBO(): string {
    return this.time.formatDateFullForEmail(this.declaration.value.dateOfAppointment)
  }

  get dateRecorded(): string {
    return this.time.formatDateFullForEmail(this.declaration.value.createdAt)
  }

  get type(): string {
    return "individual" // need to check with asyikin
  }

  get category(): string {
    return "individual" // need to check with asyikin
  }

  get name(): string {
    return this.declaration.value.fullName
  }

  get identificationNo(): string {
    return this.declaration.value.identificationNumber
  }

  get dateOfBirth(): string {
    return this.time.formatDateFullForEmail(this.declaration.value.dateOfBirth)
  }

  get gender(): string {
    return this.declaration.value.gender
  }

  get race(): string {
    return this.declaration.value.race
  }

  get nationality(): string {
    return this.declaration.value.nationality
  }

  get citizenship(): string {
    return this.declaration.value.nationality // need to change this accordingly
  }

  get designation(): string {
    return `Company ${this.declaration.value.position}`
  }

  get residentialAddress(): string {
    return this.declaration.value.residentialAddress // need to change to multi line
  }

  get businessAddress(): string {
    return "NIL"
  }

  get emailAddress(): string {
    return this.declaration.value.emailAddress
  }

  get contactNo(): string {
    return this.declaration.value.phone
  }

  get typeOfBO(): string {
    return `DIRECT OWNERSHIP` // will need to change according to details
  }

  get typeOfBOCriteria(): string {
    return `Criteria A - Holds director in not less than 20% of the shares in the company` // must change accordingly
  }

  get percentage(): string {
    return `Criteria A - Direct Ownership: ${this.declaration.value.percentageOfShares}`
  }

  get loaderLabel(): string {
    return `Retrieving Your`
  }

  get loaderSublabel(): string {
    return "Notification of Beneficial Ownership"
  }
}
