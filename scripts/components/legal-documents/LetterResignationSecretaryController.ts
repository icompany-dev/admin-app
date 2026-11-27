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

    this.emitEvents("cosecSelected", this.selectedSecretary)
  }

  get printAddressLines(): string[] {
    const addressLines = this.selectedAddress.split(/<br\s*\/?>|\r?\n/gi)
    const lines: string[] = []
    const maxLength = 35

    for (const addressLine of addressLines) {
      let line = ""

      for (const word of addressLine.trim().split(/\s+/)) {
        if (!word) {
          continue
        }

        const next = line ? `${line} ${word}` : word

        if (line && next.length > maxLength) {
          lines.push(line)
          line = word
        } else {
          line = next
        }
      }

      if (line) {
        lines.push(line)
      }
    }

    return lines
  }

  override async getPdfPages(): Promise<HTMLElement[]> {
    const wasPrinting = this.isPrinting.value
    this.isPrinting.value = true

    try {
      return await super.getPdfPages()
    } finally {
      this.isPrinting.value = wasPrinting
    }
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
