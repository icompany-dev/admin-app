import { PaperOrientation } from "~/scripts/constants/Paper"
import { SdnBhdLegalDocumentController } from "./SdnBhdLegalDocumentController"
import { SecretaryInformation } from "~/scripts/constants/SecretaryInformation"
import { Secretary } from "~/scripts/types/Secretary"
import { SelectOption } from "~/scripts/types/SelectOption"
import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"
import type { Location } from "~/scripts/models/Location"
import type { CompanyBranch } from "~/scripts/models/CompanyBranch"
import { StringUtil } from "~/scripts/utils/String"

export class LetterResignationSecretaryController extends SdnBhdLegalDocumentController {
  selectedSecretaryNric: Ref<string> = ref<string>(SecretaryInformation.SECRETARY_NAME_LIST[1].nric) // default to second

  emitEvents: any | null = null

  additionalCssClass: string = "letter-resign-cosec legal-document"

  isPrinting: Ref<boolean> = ref<boolean>(false)

  documentDate: Ref<string | null> = ref<string | null>(null)

  locationId: Ref<string> = ref<string>("")
  isShowAddressOptions: Ref<boolean> = ref<boolean>(false)

  constructor(companyId: string, emitEvents: any) {
    super("Letter of Resignation of Company Secretary", companyId, PaperOrientation.Portrait)

    this.emitEvents = emitEvents

    let dayjs = useDayjs()
    this.documentDate.value = dayjs().format("YYYY-MM-DD")

    this.locationId.value = this.companyAddressOptions[0]?.id
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

  onAddressOptionClicked(): void {
    this.isShowAddressOptions.value = !this.isShowAddressOptions.value
  }

  onHideAddressOption(): void {
    this.isShowAddressOptions.value = false
  }

  onSelectAddress(locationId: string): void {
    this.locationId.value = locationId
    this.emitEvents("locationSelected", this.locationId.value)
    this.isShowAddressOptions.value = false
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

  get companyAddressOptions(): Location[] {
    let addresses: Location[] = []

    if (this.company.value.businessAddressLocation !== null) {
      addresses.push(this.company.value.businessAddressLocation)
    }

    if (this.company.value.registeredAddressLocation !== null) {
      addresses.push(this.company.value.registeredAddressLocation)
    }

    this.company.value.branches.forEach((b: CompanyBranch) => {
      addresses.push(b.location)
    })

    return addresses
  }

  get locationOptions(): SelectOption[] {
    return this.companyAddressOptions
      .filter((l: Location) => {
        return !StringUtil.isNullOrEmpty(l.addressLine1)
      })
      .map((l: Location) => {
        return new SelectOption(l.id, l.id, l.getMultilineAddress(), false, l.id === this.locationId.value)
      })
  }

  get selectedAddress(): string {
    if (StringUtil.isNullOrEmpty(this.locationId.value)) {
      return ""
    }

    let selectedLocation = this.companyAddressOptions.find((l: Location) => {
      return l.id === this.locationId.value
    })

    return selectedLocation?.getMultilineAddress() ?? "(No Address Required)"
  }

  get isShowAddresses(): boolean {
    if (!this.isPrinting.value) {
      return true
    }

    return !StringUtil.isNullOrEmpty(this.locationId.value)
  }

  get isAddressEmpty(): boolean {
    return StringUtil.isNullOrEmpty(this.locationId.value)
  }
}
