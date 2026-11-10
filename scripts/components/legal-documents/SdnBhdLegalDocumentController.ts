import { PaperOrientation } from "~/scripts/constants/Paper"
import { Error } from "~/scripts/library/Error"
import { Company } from "~/scripts/models/Company"
import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"
import { StringUtil } from "~/scripts/utils/String"
import type { Location } from "~/scripts/models/Location"
import type { CompanyBranch } from "~/scripts/models/CompanyBranch"
import { SelectOption } from "~/scripts/types/SelectOption"

export abstract class SdnBhdLegalDocumentController {
  legalDocumentName = ref<string>("")
  companyId = ref<string>("")
  company = ref<Company>(new Company())

  companyRepository = useCompanyStore()

  paperOrientation: PaperOrientation = PaperOrientation.Portrait

  isFetchingCompany: Ref<boolean> = ref<boolean>(true)
  isInPreviewMode: Ref<boolean> = ref<boolean>(true)

  documentRef: any | null = null

  isPrinting: Ref<boolean> = ref<boolean>(false)

  locationId: Ref<string> = ref<string>("")
  isShowAddressOptions: Ref<boolean> = ref<boolean>(false)

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

      this.locationId.value = this.companyAddressOptions[0]?.id
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

  onAddressOptionClicked(): void {
    this.isShowAddressOptions.value = !this.isShowAddressOptions.value
  }

  onHideAddressOption(): void {
    this.isShowAddressOptions.value = false
  }

  onSelectAddress(locationId: string): void {
    this.locationId.value = locationId
    this.isShowAddressOptions.value = false
  }

  async getPdfPages(): Promise<HTMLElement[]> {
    if (!this.documentRef) {
      return []
    }

    await nextTick()
    let pdfPages = await PdfPaperUtil.getPdfElements(this.documentRef)

    return pdfPages
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
