import { Company } from "~/scripts/models/Company"
import { Director } from "~/scripts/models/Director"
import { SignatureGroup } from "~/scripts/models/SignatureGroup"
import { SignatureItem } from "~/scripts/types/SignatureItem"
import { PropsResolution } from "~/scripts/props/PropsResolution"
import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"

export class DcrResignationAndCessationOfCosecController {
  company = ref<Company>(new Company())
  signatureItems = ref<SignatureItem[]>([])
  documentDate = ref<string>(useDayjs()().format("YYYY-MM-DD"))

  isLoading = ref<boolean>(true)
  errorMessage = ref<string>("")

  directors = ref<Director[]>([])
  selectedDirectorIds = ref<string[]>([])
  signatureGroups = ref<SignatureGroup[]>([])

  documentRef: HTMLElement | null = null
  private loadVersion = 0

  async load(companyId: string): Promise<void> {
    const version = ++this.loadVersion

    this.isLoading.value = true
    this.errorMessage.value = ""
    this.signatureItems.value = []
    this.signatureGroups.value = []

    try {
      if (!companyId) {
        throw new Error("Company is required.")
      }

      const companyRepository = useCompanyStore()
      const signatureRepository = useSignatureStore()

      const [companyResponse, signatureResponse] = await Promise.all([
        companyRepository.fetch(companyId),
        signatureRepository.fetchByGroup(companyId, "director"),
      ])

      if (version !== this.loadVersion) {
        return
      }

      if (companyRepository.error || !companyResponse) {
        throw new Error("Unable to load company details.")
      }

      this.company.value = new Company(companyResponse)

      this.signatureGroups.value = (signatureResponse ?? []).map((item: any) => {
        return new SignatureGroup(item)
      })

      this.updateSignatureItems()
    } catch (error) {
      if (version !== this.loadVersion) {
        return
      }

      this.errorMessage.value = error instanceof Error ? error.message : "Unable to prepare the document."

      console.error(error)
    } finally {
      if (version === this.loadVersion) {
        this.isLoading.value = false
      }
    }
  }

  setDocumentRef(documentRef: HTMLElement | null): void {
    this.documentRef = documentRef
  }

  onDocumentDateUpdated(event: Event): void {
    this.documentDate.value = (event.target as HTMLInputElement).value
  }

  resolutionTitle(): string {
    const basis = this.company.value.hasConstitution
      ? "COMPANY'S CONSTITUTION"
      : "PARAGRAPH 15 OF THE THIRD SCHEDULE OF THE COMPANIES ACT 2016"

    return `DIRECTORS' RESOLUTION IN WRITING PURSUANT TO ${basis}`
  }

  setSelectedDirectors(directors: Director[], directorIds: string[]): void {
    this.directors.value = directors
    this.selectedDirectorIds.value = [...directorIds]

    this.updateSignatureItems()
  }

  updateSignatureItems(): void {
    const selectedIds = new Set(this.selectedDirectorIds.value)

    this.signatureItems.value = this.directors.value
      .filter((director: Director) => {
        return selectedIds.has(director.id)
      })
      .map((director: Director) => {
        const signatureGroup = this.signatureGroups.value.find((item: SignatureGroup) => {
          return item.group?.target === "director" && item.group?.id === director.id
        })

        const signatureUrl = signatureGroup?.signature?.url ?? null

        const directorName = director.name?.trim() || director.user?.name || ""

        return new SignatureItem(
          signatureUrl,
          signatureUrl !== null,
          false,
          false,
          directorName,
          director.email ?? "",
          "Director",
          false
        )
      })
  }

  get resolutionProps(): PropsResolution {
    const maxSignatureOnFirstPage = 2
    const maxSignatureOnOtherPages = 4

    const signatureCount = this.signatureItems.value.length

    const remainingSignatures = Math.max(0, signatureCount - maxSignatureOnFirstPage)

    const totalPages = 1 + Math.ceil(remainingSignatures / maxSignatureOnOtherPages)

    const signatureTitle = this.directors.value.length > 1 ? "Board of Directors" : "Sole Director"

    return new PropsResolution(
      this.company.value.getFullName(),
      this.company.value.registrationNumberOld,
      this.company.value.registrationNumberNew,
      this.resolutionTitle(),
      "RESIGNATION AND APPOINTMENT OF COMPANY SECRETARY",
      signatureTitle,
      this.signatureItems.value,
      this.documentDate.value,
      totalPages,
      1,
      maxSignatureOnFirstPage,
      maxSignatureOnOtherPages,
      false,
      true,
      false,
      "PREVIEW",
      [],
      false,
      this.isLoading.value,
      false,
      "",
      ""
    )
  }

  async getPdfPages(): Promise<HTMLElement[]> {
    if (this.isLoading.value) {
      throw new Error("Wait for the document to finish loading.")
    }

    if (this.errorMessage.value) {
      throw new Error(this.errorMessage.value)
    }

    if (!this.documentRef) {
      throw new Error("Document is not available.")
    }

    if (this.signatureItems.value.length === 0) {
      throw new Error("Select at least one director.")
    }

    await nextTick()

    return await PdfPaperUtil.getPdfElements(this.documentRef)
  }
}
