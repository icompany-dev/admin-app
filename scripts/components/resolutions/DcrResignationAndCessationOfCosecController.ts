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

  documentRef: HTMLElement | null = null
  private loadVersion = 0

  async load(companyId: string, directorId: string): Promise<void> {
    const version = ++this.loadVersion

    this.isLoading.value = true
    this.errorMessage.value = ""
    this.signatureItems.value = []

    try {
      if (!companyId) {
        throw new Error("Company is required.")
      }

      const companyRepository = useCompanyStore()
      const companyResponse = await companyRepository.fetch(companyId)

      if (companyRepository.error || !companyResponse) {
        throw new Error("Unable to load company details.")
      }

      if (version !== this.loadVersion) return

      this.company.value = new Company(companyResponse)

      if (!directorId) {
        return
      }

      const directorRepository = useDirectorStore()
      const directorResponse = await directorRepository.fetch(directorId)

      if (directorRepository.error || !directorResponse) {
        throw new Error("Unable to load the selected director.")
      }

      const signatureResponse = await useSignatureStore().fetchByGroup(companyId, "director")

      if (version !== this.loadVersion) return

      const director = new Director(directorResponse)
      director.name = director.name?.trim() || directorResponse.user?.name || ""

      const signatureGroups = (signatureResponse ?? []).map((item: any) => new SignatureGroup(item))

      const signatureGroup = signatureGroups.find(
        (item: SignatureGroup) => item.group?.target === "director" && item.group?.id === directorId
      )

      const signatureUrl = signatureGroup?.signature?.url ?? null

      this.signatureItems.value = [
        new SignatureItem(
          signatureUrl,
          signatureUrl !== null,
          false,
          false,
          director.name,
          director.email ?? "",
          "Director",
          false
        ),
      ]
    } catch (error) {
      if (version !== this.loadVersion) return

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

  get resolutionProps(): PropsResolution {
    return new PropsResolution(
      this.company.value.getFullName(),
      this.company.value.registrationNumberOld,
      this.company.value.registrationNumberNew,
      this.resolutionTitle(),
      "RESIGNATION AND APPOINTMENT OF COMPANY SECRETARY",
      "Director",
      this.signatureItems.value,
      this.documentDate.value,
      1, // Total pages
      1, // Signature starts on page
      1, // Signatures on first page
      1, // Signatures on other pages
      false, // Has accompanying document
      true, // Is DCR
      false, // Show watermark
      "PREVIEW",
      [], // Content pages
      false, // Is using template
      this.isLoading.value,
      false, // Is signature tinted
      "", // Signature tint label
      "" // Company address; blank to match the original DCR
    )
  }

  async getPdfPages(): Promise<HTMLElement[]> {
    if (
      this.isLoading.value ||
      this.errorMessage.value ||
      !this.documentRef ||
      this.signatureItems.value.length === 0
    ) {
      throw new Error("Select a director and wait for the document to finish loading.")
    }

    await nextTick()

    return await PdfPaperUtil.getPdfElements(this.documentRef)
  }
}
