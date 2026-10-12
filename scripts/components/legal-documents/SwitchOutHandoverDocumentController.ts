import { DocumentHandover } from "~/scripts/models/DocumentHandover"
import { DocumentHandoverItem } from "~/scripts/models/DocumentHandoverItem"
import { SdnBhdLegalDocumentController } from "./SdnBhdLegalDocumentController"
import { PaperOrientation } from "~/scripts/constants/Paper"
import { User } from "~/scripts/models/User"
import { Error } from "~/scripts/library/Error"
import { CurrentUser } from "~/scripts/utils/CurrentUser"
import { StatusConstants } from "~/scripts/constants/Status"
import { StringUtil } from "~/scripts/utils/String"
import { SwitchOutDocumentTypes } from "~/scripts/constants/SwitchOuts"
import { SwitchDocumentTableRow } from "~/scripts/types/switches/SwitchDocumentTableRow"
import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"
import { CompanyConstants } from "~/scripts/constants/Company"
import { Company } from "~/scripts/models/Company"
import { ApplicationSwitch } from "~/scripts/models/ApplicationSwitch"
import { CompanyAmendmentRegisteredAddress } from "~/scripts/models/CompanyAmendmentRegisteredAddress"

export class SwitchOutHandoverDocumentController {
  targetType: Ref<string> = ref<string>("")
  targetId: Ref<string> = ref<string>("")

  companyName: Ref<string> = ref<string>("")
  registrationNumberNew: Ref<string> = ref<string>("")
  registrationNumberOld: Ref<string> = ref<string>("")

  applicationId: Ref<string> = ref<string>("")
  documentHandover = ref<DocumentHandover>(new DocumentHandover())

  emitEvents: any | null = null

  documentRef: any | null = null

  currentUser: Ref<User> = ref<User>(new User())

  isLoading: Ref<boolean> = ref<boolean>(false)
  isInPreviewMode: Ref<boolean> = ref<boolean>(false)

  paperOrientation: string = PaperOrientation.Portrait
  additionalCssClass: string = "switch-out-handover-document"

  time = useLocalTime()

  constructor(targetType: string, targetId: string, applicationId: string | null, emitEvents: any) {
    this.applicationId.value = applicationId ?? ""
    this.targetType.value = targetType
    this.targetId.value = targetId

    this.emitEvents = emitEvents

    this.init()
  }

  async init(): Promise<void> {
    try {
      this.isLoading.value = true

      this.currentUser.value = await CurrentUser.get()

      await Promise.all([this.fetchApplication(), this.fetchCompanyDetails()])
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.setForFetch()
        error.handle()
      }
    } finally {
      this.isLoading.value = false
    }
  }

  setDocumentRef(documentRef: any): void {
    this.documentRef = documentRef
  }

  setIsInPreviewMode(isInPreviewMode: boolean): void {
    this.isInPreviewMode.value = isInPreviewMode
  }

  async setTargetType(targetType: string): Promise<void> {
    this.targetType.value = targetType

    try {
      this.isLoading.value = true
      await this.fetchCompanyDetails()
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.setForFetch()
        error.handle()
      }
    } finally {
      this.isLoading.value = false
    }
  }

  async setTargetId(targetId: string): Promise<void> {
    this.targetId.value = targetId

    try {
      this.isLoading.value = true
      await this.fetchCompanyDetails()
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.setForFetch()
        error.handle()
      }
    } finally {
      this.isLoading.value = false
    }
  }

  async fetchCompanyDetails(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.targetType.value) || StringUtil.isNullOrEmpty(this.targetId.value)) {
      return
    }

    let repository = null
    switch (this.targetType.value) {
      case "company":
        repository = useCompanyStore()
        break
      case CompanyConstants.TARGET_APPLICATION_SWITCH:
        repository = useApplicationSwitchStore()
        break
      case CompanyConstants.TARGET_AMENDMENT_REGISTERED_ADDRESS:
        repository = useCompanyAmendmentRegisteredAddressStore()
        break
    }

    if (!repository) {
      return
    }

    let response = await repository.fetch(this.targetId.value)
    if (!response) {
      this.companyName.value = ""
      this.registrationNumberNew.value = ""
      this.registrationNumberOld.value = ""
      return
    }

    switch (this.targetType.value) {
      case "company":
        let company = new Company(response)
        this.companyName.value = company.getFullName()
        this.registrationNumberNew.value = company.registrationNumberNew
        this.registrationNumberOld.value = company.registrationNumberOld
        break
      case CompanyConstants.TARGET_APPLICATION_SWITCH:
        let applicationSwitch = new ApplicationSwitch(response)
        this.companyName.value = applicationSwitch.getFullName()
        this.registrationNumberNew.value = applicationSwitch.registrationNumberNew
        this.registrationNumberOld.value = applicationSwitch.registrationNumberOld
        break
      case CompanyConstants.TARGET_AMENDMENT_REGISTERED_ADDRESS:
        let application = new CompanyAmendmentRegisteredAddress(response)
        this.companyName.value = application.company?.getFullName() ?? ""
        this.registrationNumberNew.value = application.company?.registrationNumberNew ?? ""
        this.registrationNumberOld.value = application.company?.registrationNumberOld ?? ""
        break
    }
  }

  async setApplicationId(applicationId: string | null): Promise<void> {
    this.applicationId.value = applicationId ?? ""

    await this.fetchApplication()
  }

  async fetchApplication(): Promise<void> {
    // Fetch existing
  }

  getTableRowsForPage(page: number): SwitchDocumentTableRow[] {
    let maxRowsForPageOne = 30
    let maxRows = 40

    if (page === 1) {
      return this.tableRows.slice(0, maxRowsForPageOne)
    }

    let start = (page - 2) * maxRows + maxRowsForPageOne
    let end = start + maxRows

    return this.tableRows.slice(start, end)
  }

  async getPdfElements(): Promise<HTMLElement[]> {
    if (!this.documentRef) {
      return []
    }

    let pages = await PdfPaperUtil.getPdfElements(this.documentRef)
    return pages
  }

  get isPaid(): boolean {
    return (
      this.documentHandover.value.status !== StatusConstants.DRAFT &&
      this.documentHandover.value.status !== StatusConstants.PENDING
    )
  }

  get isDocumentEditable(): boolean {
    if (this.isInPreviewMode.value) {
      return false
    }

    if (this.documentHandover.value.signatureId !== null) {
      return false
    }

    return this.isPaid
  }

  get loaderLabel(): string {
    return "Preparing the"
  }

  get loaderSublabel(): string {
    return "Handover Document"
  }

  get statutoryRecords(): DocumentHandoverItem[] {
    if (StringUtil.isNullOrEmpty(this.documentHandover.value.id)) {
      return [
        new DocumentHandoverItem({ document_name: "Certificate of Incorporation" }),
        new DocumentHandoverItem({ document_name: "Certificate of Name Change" }),
        new DocumentHandoverItem({ document_name: "Constitution" }),
        new DocumentHandoverItem({ document_name: "Notice of Registration (Section 15)" }),
        new DocumentHandoverItem({ document_name: "Common Seal" }),
        new DocumentHandoverItem({ document_name: "Share Certificates" }),
        new DocumentHandoverItem({ document_name: "Superform (Section 14)" }),
        new DocumentHandoverItem({ document_name: "Others:" }),
      ]
    }

    return this.documentHandover.value.items.filter((d: DocumentHandoverItem) => {
      return d.documentType === SwitchOutDocumentTypes.StatutoryRecords
    })
  }

  get statutoryRegisters(): DocumentHandoverItem[] {
    if (StringUtil.isNullOrEmpty(this.documentHandover.value.id)) {
      return [
        new DocumentHandoverItem({ document_name: "Register of Members" }),
        new DocumentHandoverItem({ document_name: "Register of Directors" }),
        new DocumentHandoverItem({ document_name: "Register of Secretaries" }),
        new DocumentHandoverItem({ document_name: "Register of Beneficial Owners" }),
        new DocumentHandoverItem({ document_name: "Register of Charges" }),
        new DocumentHandoverItem({ document_name: "Register of Debenture Holders" }),
        new DocumentHandoverItem({ document_name: "Register of Seal" }),
        new DocumentHandoverItem({ document_name: "Others:" }),
      ]
    }

    return this.documentHandover.value.items.filter((d: DocumentHandoverItem) => {
      return d.documentType === SwitchOutDocumentTypes.StatutoryRegisters
    })
  }

  get minutesResolutions(): DocumentHandoverItem[] {
    if (StringUtil.isNullOrEmpty(this.documentHandover.value.id)) {
      return [
        new DocumentHandoverItem({ document_name: "Board of Director’s Minute Book" }),
        new DocumentHandoverItem({ document_name: "Members’ / Shareholder’s Minute Book" }),
        new DocumentHandoverItem({ document_name: "Written Resolutions of Directors" }),
        new DocumentHandoverItem({ document_name: "Written Resolutions of Members" }),
        new DocumentHandoverItem({ document_name: "Annual General Meeting (AGM) Minutes" }),
        new DocumentHandoverItem({ document_name: "Extraordinary General Meeting (EGM) Minutes" }),
        new DocumentHandoverItem({ document_name: "Notices & Circulations for AGM or EGM" }),
        new DocumentHandoverItem({ document_name: "Others:" }),
      ]
    }

    return this.documentHandover.value.items.filter((d: DocumentHandoverItem) => {
      return d.documentType === SwitchOutDocumentTypes.MinutesResolutions
    })
  }

  get ssmFilings(): DocumentHandoverItem[] {
    if (StringUtil.isNullOrEmpty(this.documentHandover.value.id)) {
      return [
        new DocumentHandoverItem({ document_name: "Annual Returns" }),
        new DocumentHandoverItem({ document_name: "Financial Statements lodged with SSM" }),
        new DocumentHandoverItem({ document_name: "Notification of Directors / Secretaries (Section 58)" }),
        new DocumentHandoverItem({ document_name: "Appointment / Removal / Resignation of Auditors" }),
        new DocumentHandoverItem({ document_name: "Consent of Appointment of Secretary (Section 236)" }),
        new DocumentHandoverItem({ document_name: "Beneficial Owners Declaration Form" }),
        new DocumentHandoverItem({ document_name: "Others:" }),
      ]
    }

    return this.documentHandover.value.items.filter((d: DocumentHandoverItem) => {
      return d.documentType === SwitchOutDocumentTypes.SsmFilings
    })
  }

  get shareCapitals(): DocumentHandoverItem[] {
    if (StringUtil.isNullOrEmpty(this.documentHandover.value.id)) {
      return [
        new DocumentHandoverItem({ document_name: "Allotment of Shares" }),
        new DocumentHandoverItem({ document_name: "Return of Allotment" }),
        new DocumentHandoverItem({ document_name: "Pre-emptive Rights Notice" }),
        new DocumentHandoverItem({ document_name: "Stamp Duty Receipts / Certificates" }),
        new DocumentHandoverItem({ document_name: "Instrument of Transfer (Form under Section 105)" }),
        new DocumentHandoverItem({ document_name: "Shareholders’ / Subscription Agreements" }),
        new DocumentHandoverItem({ document_name: "Bonus, Capitalisation or Rights Documents" }),
        new DocumentHandoverItem({ document_name: "Others:" }),
      ]
    }

    return this.documentHandover.value.items.filter((d: DocumentHandoverItem) => {
      return d.documentType === SwitchOutDocumentTypes.ShareCapitals
    })
  }

  get governanceDocuments(): DocumentHandoverItem[] {
    if (StringUtil.isNullOrEmpty(this.documentHandover.value.id)) {
      return [
        new DocumentHandoverItem({ document_name: "Consent to Act (Section 201)" }),
        new DocumentHandoverItem({ document_name: "Directors’ Declaration" }),
        new DocumentHandoverItem({ document_name: "Disclosure of Interest" }),
        new DocumentHandoverItem({ document_name: "Directors’ Terms / Service Agreement" }),
        new DocumentHandoverItem({ document_name: "Board Charter / Terms of Reference" }),
        new DocumentHandoverItem({ document_name: "Remunerations, Emoluments, Advances & Loans" }),
        new DocumentHandoverItem({ document_name: "Directors’ Indemnity / Insurance" }),
        new DocumentHandoverItem({ document_name: "Others:" }),
      ]
    }

    return this.documentHandover.value.items.filter((d: DocumentHandoverItem) => {
      return d.documentType === SwitchOutDocumentTypes.GovernanceDocuments
    })
  }

  get administrativeDocuments(): DocumentHandoverItem[] {
    if (StringUtil.isNullOrEmpty(this.documentHandover.value.id)) {
      return [
        new DocumentHandoverItem({ document_name: "Bank Account Opening Forms / Mandate" }),
        new DocumentHandoverItem({ document_name: "Outstanding Compliance Notice / Reminders" }),
        new DocumentHandoverItem({ document_name: "Section 47 Documents Not Kept" }),
        new DocumentHandoverItem({ document_name: "Business Licenses / Permits" }),
        new DocumentHandoverItem({ document_name: "Income Tax File Reference" }),
        new DocumentHandoverItem({ document_name: "SST Registration and Related Documents" }),
        new DocumentHandoverItem({ document_name: "Unclaimed Letters sent to Registered Address" }),
      ]
    }

    return this.documentHandover.value.items.filter((d: DocumentHandoverItem) => {
      return d.documentType === SwitchOutDocumentTypes.AdministrativeDocuments
    })
  }

  get tableRows(): SwitchDocumentTableRow[] {
    let rows: SwitchDocumentTableRow[] = []

    rows.push(
      new SwitchDocumentTableRow({
        number: "A.",
        isSectionRow: true,
        sectionTitle: "Statutory Records & Corporate Documents",
      })
    )

    this.statutoryRecords.forEach((st: DocumentHandoverItem, index: number) => {
      rows.push(
        new SwitchDocumentTableRow({
          number: `${index + 1}.`,
          document: st,
        })
      )
    })

    rows.push(
      new SwitchDocumentTableRow({
        number: "",
        isEmptyRow: true,
      })
    )

    rows.push(
      new SwitchDocumentTableRow({
        number: "B.",
        isSectionRow: true,
        sectionTitle: "Statutory & Administrative Registers",
      })
    )

    this.statutoryRegisters.forEach((st: DocumentHandoverItem, index: number) => {
      rows.push(
        new SwitchDocumentTableRow({
          number: `${index + 1}.`,
          document: st,
        })
      )
    })

    rows.push(
      new SwitchDocumentTableRow({
        number: "",
        isEmptyRow: true,
      })
    )

    rows.push(
      new SwitchDocumentTableRow({
        number: "C.",
        isSectionRow: true,
        sectionTitle: "Minutes & Resolutions",
      })
    )

    this.minutesResolutions.forEach((st: DocumentHandoverItem, index: number) => {
      rows.push(
        new SwitchDocumentTableRow({
          number: `${index + 1}.`,
          document: st,
        })
      )
    })

    rows.push(
      new SwitchDocumentTableRow({
        number: "",
        isEmptyRow: true,
      })
    )

    rows.push(
      new SwitchDocumentTableRow({
        number: "D.",
        isSectionRow: true,
        sectionTitle: "SSM Filings & Compliance Documents",
      })
    )

    this.ssmFilings.forEach((st: DocumentHandoverItem, index: number) => {
      rows.push(
        new SwitchDocumentTableRow({
          number: `${index + 1}.`,
          document: st,
        })
      )
    })

    rows.push(
      new SwitchDocumentTableRow({
        number: "",
        isEmptyRow: true,
      })
    )

    rows.push(
      new SwitchDocumentTableRow({
        number: "E.",
        isSectionRow: true,
        sectionTitle: "Share Capital & Allotment Records",
      })
    )

    this.shareCapitals.forEach((st: DocumentHandoverItem, index: number) => {
      rows.push(
        new SwitchDocumentTableRow({
          number: `${index + 1}.`,
          document: st,
        })
      )
    })

    rows.push(
      new SwitchDocumentTableRow({
        number: "",
        isEmptyRow: true,
      })
    )

    rows.push(
      new SwitchDocumentTableRow({
        number: "F.",
        isSectionRow: true,
        sectionTitle: "Directors’, Officers & Governance Documents",
      })
    )

    this.governanceDocuments.forEach((st: DocumentHandoverItem, index: number) => {
      rows.push(
        new SwitchDocumentTableRow({
          number: `${index + 1}.`,
          document: st,
        })
      )
    })

    rows.push(
      new SwitchDocumentTableRow({
        number: "",
        isEmptyRow: true,
      })
    )

    rows.push(
      new SwitchDocumentTableRow({
        number: "G.",
        isSectionRow: true,
        sectionTitle: "Other Operational & Administrative Documents",
      })
    )

    this.administrativeDocuments.forEach((st: DocumentHandoverItem, index: number) => {
      rows.push(
        new SwitchDocumentTableRow({
          number: `${index + 1}.`,
          document: st,
        })
      )
    })

    return rows
  }

  get totalPages(): number {
    let totalGroups = Math.ceil(this.tableRows.length / 30)

    return totalGroups
  }

  get pageRanges(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => {
      return i + 1
    })
  }
}
