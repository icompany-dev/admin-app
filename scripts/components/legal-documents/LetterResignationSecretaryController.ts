import { PaperOrientation } from "~/scripts/constants/Paper"
import { SdnBhdLegalDocumentController } from "./SdnBhdLegalDocumentController"
import { SecretaryInformation } from "~/scripts/constants/SecretaryInformation"
import { Secretary } from "~/scripts/types/Secretary"
import { SelectOption } from "~/scripts/types/SelectOption"
import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"

export class LetterResignationSecretaryController extends SdnBhdLegalDocumentController {
  selectedSecretaryNric: Ref<string> = ref<string>(SecretaryInformation.SECRETARY_NAME_LIST[1].nric) // default to second

  emitEvents: any | null = null

  additionalCssClass: string = "letter-resign-cosec legal-document"

  documentDate: Ref<string | null> = ref<string | null>(null)

  constructor(companyId: string, emitEvents: any) {
    super("Letter of Resignation of Company Secretary", companyId, PaperOrientation.Portrait)

    this.emitEvents = emitEvents

    let dayjs = useDayjs()
    this.documentDate.value = dayjs().format("YYYY-MM-DD")
  }

  override async getPdfPages(): Promise<HTMLElement[]> {
    if (!this.documentRef) {
      return []
    }

    this.isPrinting.value = true
    await nextTick()
    let pdfPages = await PdfPaperUtil.getPdfElements(this.documentRef)

    setTimeout(() => {
      this.isPrinting.value = false
    }, 1000)

    return pdfPages
  }

  get secretaryOptions(): SelectOption[] {
    return SecretaryInformation.SECRETARY_NAME_LIST.map((s: Secretary) => {
      return new SelectOption(s.nric, s.nric, `${s.name} (${s.license})`)
    })
  }

  get selectedSecretary(): Secretary | null {
    return (
      SecretaryInformation.SECRETARY_NAME_LIST.find((s: Secretary) => {
        return s.nric === this.selectedSecretaryNric.value
      }) ?? null
    )
  }

  get selectedSecretaryName(): string {
    return this.selectedSecretary?.name ?? "(Select Secretary)"
  }

  get selectedSecretaryAddress(): string {
    return this.selectedSecretary?.address.getMultilineAddress() ?? "(Select Secretary)"
  }

  get selectedSecretaryLicense(): string {
    return this.selectedSecretary?.license ?? "(Select Secretary)"
  }

  get selectedSecretarySignature(): string {
    return this.selectedSecretary?.signatureUrl ?? ""
  }
}
