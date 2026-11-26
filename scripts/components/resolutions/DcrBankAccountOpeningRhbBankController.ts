import { OpenBankAccountResolutionController } from "./OpenBankAccountResolutionController"
import { CompanyBankAccountOpening } from "~/scripts/models/CompanyBankAccountOpening"
import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

interface RhbPerson {
  name: string
  identification: string
}

export class DcrBankAccountOpeningRhbBankController extends OpenBankAccountResolutionController<CompanyBankAccountOpening> {
  constructor(props: IPropsResolutionDocument<CompanyBankAccountOpening>, emitEvents: any) {
    super(
      props.companyId,
      props.application,
      CompanyBankAccountOpening,
      props.isInPreviewMode,
      props.showWatermark,
      props.watermarkText,
      emitEvents
    )

    this.maxSignatureOnFirstPage.value = 2
    this.maxSignatureOnOtherPages.value = 6
    this.setContent()
  }

  setContent(): void {
    this.signatureStartOnPage.value = this.lastClausePage
  }

  getBranchId(): string {
    return this.application.value?.bankBranchId ?? ""
  }

  getSignatories() {
    return this.application.value?.signatories ?? []
  }

  getSignatoryType(): string {
    return this.application.value?.signatoryType ?? ""
  }

  getAuthorisedPersonsForOnlineBanking() {
    return this.application.value?.onlineBanking ?? []
  }

  get branchName(): string {
    return this.application.value?.bankBranch?.name || "________________"
  }

  get signingInstruction(): string {
    const type = this.getSignatoryType().trim().toLowerCase()

    switch (type) {
      case "anyone":
      case "any":
        return "All transaction shall be signed by ANY of the following Authorised Signatories for Current Account:"
      case "all":
        return "All transaction shall be signed by ALL of the following Authorised Signatories for Current Account:"
      case "both":
        return "All transaction shall be signed by BOTH of the following Authorised Signatories for Current Account:"
      case "solely":
        return "All transaction shall be signed solely by the following Authorised Signatory for Current Account:"
      default:
        return "Authorised Signatories for Current Account:"
    }
  }

  get accountSignatories(): RhbPerson[] {
    return this.uniquePeople(this.getSignatories())
  }

  get reflexRepresentatives(): RhbPerson[] {
    return this.uniquePeople(this.getAuthorisedPersonsForOnlineBanking())
  }

  private uniquePeople(people: RhbPerson[]): RhbPerson[] {
    const result: RhbPerson[] = []
    const seen = new Set<string>()

    for (const person of people) {
      const name = person.name.trim()
      const identification = person.identification.trim()

      if (!name && !identification) {
        continue
      }

      if (identification) {
        const key = identification.replace(/[\s-]/g, "").toUpperCase()

        if (seen.has(key)) {
          continue
        }

        seen.add(key)
      }

      result.push({ name, identification })
    }

    return result
  }

  get mandatePages() {
    const rows = [
      ...this.accountSignatories.map((person, index) => ({
        section: "account" as const,
        index,
        person,
      })),
      ...this.reflexRepresentatives.map((person, index) => ({
        section: "reflex" as const,
        index,
        person,
      })),
    ]

    const pages = []
    let offset = 0

    do {
      const capacity = offset === 0 ? 4 : 10
      const items = rows.slice(offset, offset + capacity)

      pages.push({
        number: pages.length + 2,
        accounts: items.filter((item) => item.section === "account"),
        representatives: items.filter((item) => item.section === "reflex"),
      })

      offset += capacity
    } while (offset < rows.length)

    return pages
  }

  get lastClausePage(): number {
    return this.mandatePages.length + 2
  }

  totalPages(): number {
    const remaining = Math.max(0, this.signatureItems.value.length - this.maxSignatureOnFirstPage.value)

    return this.lastClausePage + Math.ceil(remaining / this.maxSignatureOnOtherPages.value)
  }

  get selectedCompanyAddress(): string {
    const application = this.application.value
    const company = application?.company
    const locationId = application?.metaData?.location_id

    if (!this.isShowCompanyAddres.value || !company || !locationId) {
      return ""
    }

    const locations = [
      company.businessAddressLocation,
      company.registeredAddressLocation,
      ...(company.branches ?? []).map((branch) => branch.location),
    ]

    const selected = locations.find((location) => location?.id === locationId)
    return selected?.getMultilineAddress() ?? ""
  }

  async loadSignatures(): Promise<void> {
    this.signatureItems.value = []

    if (!this.application.value?.companyId) {
      return
    }

    this.isLoading.value = true

    try {
      await this.getPersonsToSign()

      for (const item of this.signatureItems.value) {
        item.isSignatureEditable = false
      }
    } finally {
      this.isLoading.value = false
    }
  }
}
