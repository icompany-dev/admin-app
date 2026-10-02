import { CompanyBankAccountOpening } from "~/scripts/models/CompanyBankAccountOpening"
import type { CompanyBankSignatory } from "~/scripts/models/CompanyBankSignatory"
import { BankDocumentsController } from "./BankDocumentsController"
import { BankConstants } from "~/scripts/constants/Banks"
import type { OnlineBanking } from "~/scripts/types/banks/OnlineBanking"
import { CimbBankApplicationDetails } from "~/scripts/types/banks/CimbBankApplicationDetails"

export class CimbBankDocumentsController extends BankDocumentsController {
  bankId: string = BankConstants.CIMB_DETAIL.id

  applicationRef: any | null = null
  omnibusRef: any | null = null
  bankResolutionRef: any | null = null

  // Readonly document data supplied by the parent.
  application = ref<CompanyBankAccountOpening>(new CompanyBankAccountOpening())

  typeOfApplicationSelected: Ref<string | null> = ref<string | null>(null)
  overlayPage: Ref<number> = ref<number>(1)

  private omnibusDetails: CimbBankApplicationDetails | null = null
  private omnibusApplicationId: string | null = null
  private omnibusSignatoryType: string | null = null

  constructor(props: any, emitEvents: any) {
    super(props.companyId, emitEvents)
  }

  setApplicationRef(applicationRef: any): void {
    this.applicationRef = applicationRef
  }

  setBankResolutionRef(bankResolutionRef: any): void {
    this.bankResolutionRef = bankResolutionRef
    this.setDcrRef(bankResolutionRef)
  }

  setOmnibusRef(omnibusRef: any): void {
    this.omnibusRef = omnibusRef
  }

  setResolutionDocument(application: CompanyBankAccountOpening | null): void {
    const previousId = this.application.value?.id ?? ""
    const nextId = application?.id ?? ""
    if (!application || previousId !== nextId) {
      this.clearOmnibusDetails()
      this.overlayPage.value = 1
    }

    this.application.value = application ?? new CompanyBankAccountOpening()
    this.typeOfApplicationSelected.value = application?.cimbBankApplicationDetails?.typeOfApplication ?? null
  }

  getDocumentApplication(): CompanyBankAccountOpening | null {
    return (
      this.applicationRef?.getApplication?.() ??
      this.bankResolutionRef?.getApplication?.() ??
      this.application.value ??
      null
    )
  }

  private hasCurrentOmnibusDetails(): boolean {
    return this.omnibusDetails !== null && this.omnibusApplicationId === (this.getDocumentApplication()?.id ?? "")
  }

  getApplication(): CompanyBankAccountOpening | null {
    const application = this.getDocumentApplication()
    if (application) {
      application.cimbBankApplicationDetails = this.getOtherDetails()
      application.signatoryType = this.getSignatoryType()
    }
    return application
  }

  clearOmnibusDetails(): void {
    this.omnibusDetails = null
    this.omnibusApplicationId = null
    this.omnibusSignatoryType = null
  }

  onOmnibusUpdated(): void {
    const details = this.omnibusRef?.getOtherDetails?.()
    if (details) {
      this.omnibusDetails = new CimbBankApplicationDetails(details)
      this.omnibusApplicationId = this.omnibusRef?.getApplication?.()?.id ?? this.getDocumentApplication()?.id ?? ""
      this.omnibusSignatoryType = this.omnibusRef?.getSignatoryType?.() ?? null
    }
    this.emitEvents("updated")
  }

  override getBranchId(): string {
    return (
      this.applicationRef?.getBranchId?.() ??
      this.bankResolutionRef?.getBranchId?.() ??
      this.application.value.bankBranchId ??
      ""
    )
  }

  override getSignatories(): CompanyBankSignatory[] {
    return (
      this.applicationRef?.getSignatories?.() ??
      this.bankResolutionRef?.getSignatories?.() ??
      this.application.value.signatories ??
      []
    )
  }

  override getSignatoryType(): string {
    // An empty string is also an update: it means the selection was cleared.
    if (this.hasCurrentOmnibusDetails() && this.omnibusSignatoryType !== null) {
      return this.omnibusSignatoryType
    }
    return (
      this.applicationRef?.getSignatoryType?.() ??
      this.bankResolutionRef?.getSignatoryType?.() ??
      this.application.value.signatoryType ??
      ""
    )
  }

  override getAuthorisedPersonsForOnlineBanking(): OnlineBanking[] {
    return (
      this.applicationRef?.getAuthorisedPersonsForOnlineBanking?.() ??
      this.bankResolutionRef?.getAuthorisedPersonsForOnlineBanking?.() ??
      this.application.value.onlineBanking ??
      []
    )
  }

  override getOtherDetails(): CimbBankApplicationDetails {
    const applicationDetails =
      this.applicationRef?.getOtherDetails?.() ?? this.getDocumentApplication()?.cimbBankApplicationDetails
    const details = applicationDetails
      ? new CimbBankApplicationDetails(applicationDetails)
      : new CimbBankApplicationDetails()

    if (this.hasCurrentOmnibusDetails() && this.omnibusDetails) {
      const omnibus = this.omnibusDetails
      details.generalOperationAuthorisedPersons = omnibus.generalOperationAuthorisedPersons
      details.omnibusAuthorisedCount = omnibus.omnibusAuthorisedCount
      details.generalOperationSigningCondition = omnibus.generalOperationSigningCondition
      details.generalOperationSigningCount = omnibus.generalOperationSigningCount
      details.boardResolutionDate = omnibus.boardResolutionDate
      details.extractPassedDate = omnibus.extractPassedDate
      details.extractCertificationDate = omnibus.extractCertificationDate
      details.omnibusCertifiers = omnibus.omnibusCertifiers
    }

    details.typeOfApplication = this.typeOfApplicationSelected.value
    return details
  }

  override async getPdfPages(): Promise<HTMLElement[]> {
    await nextTick()

    const pages: HTMLElement[] = []

    if (this.applicationRef) {
      const applicationPages = await this.applicationRef.getPdfPages()
      pages.push(...applicationPages)
    }

    if (this.omnibusRef) {
      const omnibusPages = await this.omnibusRef.getPdfPages()
      pages.push(...omnibusPages)
    }

    const resolutionPages = await super.getPdfPages()
    pages.push(...resolutionPages)

    return pages
  }

  onClickTypeOfApplicationOption(optionValue: string): void {
    this.typeOfApplicationSelected.value = this.typeOfApplicationSelected.value === optionValue ? null : optionValue
  }

  onOverlayNextClick(): void {
    this.overlayPage.value = 2
  }

  onOverlayBackClick(): void {
    this.overlayPage.value = 1
  }

  onOverlaySubmitClick(): void {
    if (!this.typeOfApplicationSelected.value) return
    this.emitEvents("updated")
  }

  get isShowOverlay(): boolean {
    return (
      this.application.value.status === "paid" && !this.application.value.cimbBankApplicationDetails?.typeOfApplication
    )
  }

  get isShowCimbApplication(): boolean {
    return this.application.value.cimbBankApplicationDetails?.typeOfApplication === "prefilled-information"
  }

  async getPdfDocumentGroups(): Promise<{ filename: string; pages: HTMLElement[] }[]> {
    await nextTick()

    const groups: { filename: string; pages: HTMLElement[] }[] = []

    if (this.isShowCimbApplication) {
      if (!this.applicationRef) {
        throw new Error("CIMB application document is not mounted.")
      }

      if (!this.omnibusRef) {
        throw new Error("CIMB omnibus document is not mounted. Check isShowAllDocuments and omnibusRef.")
      }

      const applicationPages: HTMLElement[] = await this.applicationRef.getPdfPages()

      if (!applicationPages.length) {
        throw new Error("No CIMB application pages found.")
      }

      groups.push({
        filename: "CIMB Application.pdf",
        pages: applicationPages,
      })

      const omnibusPages: HTMLElement[] = await this.omnibusRef.getPdfPages()

      if (!omnibusPages.length) {
        throw new Error("No CIMB omnibus pages found.")
      }

      groups.push({
        filename: "CIMB Omnibus Board Resolution.pdf",
        pages: omnibusPages,
      })
    }

    // Get only the basic resolution.
    // super.getPdfPages() would include the IC pages too.
    if (!this.bankResolutionRef) {
      throw new Error("CIMB bank account opening resolution document is not mounted.")
    }

    const resolutionPages: HTMLElement[] = await this.bankResolutionRef.getPdfPages()

    if (!resolutionPages.length) {
      throw new Error("No CIMB bank account opening resolution pages found.")
    }

    groups.push({
      filename: "CIMB Bank Account Opening Resolution.pdf",
      pages: resolutionPages,
    })

    // Collect IC pages into their own PDF.
    const identificationPages: HTMLElement[] = []

    for (const identificationRef of this.identificationRefs.value) {
      if (!identificationRef) {
        continue
      }

      const pages: HTMLElement[] = await identificationRef.getPdfPages()

      identificationPages.push(...pages)
    }

    if (identificationPages.length > 0) {
      groups.push({
        filename: "CIMB Identification Documents.pdf",
        pages: identificationPages,
      })
    }

    return groups
  }
}
