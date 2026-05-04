import { BankOpeningAdditionalRequirements } from "../constants/BankDetails"
import { Company } from "../models/Company"
import { CompanyBankAccountOpening } from "../models/CompanyBankAccountOpening"
import { BankChecklistItem } from "../types/banks/BankChecklistItem"
import { DocumentsAndForms } from "./DocumentsAndForms"

export class BankRequirementChecklist {
  companyId: string = ""
  company: Company = new Company()

  documentsAndForms: DocumentsAndForms = new DocumentsAndForms("")

  statutoryDocuments: BankChecklistItem[] = []

  additionalRequirements: BankChecklistItem[] = []

  constructor(companyId: string) {
    this.companyId = companyId
    this.documentsAndForms = new DocumentsAndForms(companyId)
  }

  async init(): Promise<void> {
    await this.documentsAndForms.init()
    const companyRepository = useCompanyStore()
    const response = await companyRepository.fetch(this.companyId)
    this.company = new Company(response)

    this.setStatutoryDocuments()
  }

  setStatutoryDocuments(): void {
    this.statutoryDocuments = []

    let superform = this.documentsAndForms.getSection14("Superform", false, false)
    this.statutoryDocuments.push(
      new BankChecklistItem("Section 14", "Superform", superform.totalPages, superform.fileUrl)
    )

    let section15 = this.documentsAndForms.getSection15("Notification of Incorporation", false, false)
    this.statutoryDocuments.push(
      new BankChecklistItem("Section 15", "Notification of Incorporation", section15.totalPages, section15.fileUrl)
    )

    let coi = this.documentsAndForms.getCertificateOfIncorporation("Certificate of Incorporation", false, false)
    this.statutoryDocuments.push(
      new BankChecklistItem("Section 17", "Certificate of Incorporation", coi.totalPages, coi.fileUrl)
    )

    let section46 = this.documentsAndForms.getSection46("Notification of Change Registered Address", false, false)
    if (section46) {
      this.statutoryDocuments.push(
        new BankChecklistItem(
          "Section 46(3)",
          "Notification of Change of Registered Address",
          section46?.totalPages ?? 1,
          section46.fileUrl,
        )
      )
    }

    let section51 = this.documentsAndForms.getSection51("Register of Member", false, false)
    this.statutoryDocuments.push(
      new BankChecklistItem("Section 51", "Register of Member", section51?.totalPages ?? 1, section51?.fileUrl)
    )

    let section58 = this.documentsAndForms.getSection58(
      "Notification of Change of Directors/Secretary/Manager",
      false,
      false
    )
    this.statutoryDocuments.push(
      new BankChecklistItem(
        "Section 58 & 236(2)",
        "Notification of Appointment First Cosec",
        section58?.totalPages ?? 1,
        section58?.fileUrl
      )
    )

    this.statutoryDocuments.push(
      new BankChecklistItem(
        "Section 58",
        "Notification of Change of Directors, Managers and Secretaries",
        section58?.totalPages ?? 1,
        section58?.fileUrl
      )
    )

    let section78 = this.documentsAndForms.getLatestSection78("Return of Allotment", false, false)
    if (section78) {
      this.statutoryDocuments.push(
        new BankChecklistItem("Section 78", "Return of Allotment", section78?.totalPages ?? 1, section78?.fileUrl)
      )
    }

    let pd2 = this.documentsAndForms.getPD2(
      "Notification of change in the Business Address and / or Nature of Business",
      false,
      false
    )
    if (pd2) {
      this.statutoryDocuments.push(
        new BankChecklistItem(
          "PD2/17",
          "Notification of Change of Business Address / Business Nature",
          pd2?.totalPages ?? 2,
          pd2?.fileUrl
        )
      )
    }

    if (this.company.hasConstitution) {
          this.statutoryDocuments.push(
        new BankChecklistItem("Company Constitution", "", 0, null)
      )
    }

    this.statutoryDocuments.push(
      new BankChecklistItem("Certified True Copy of MyKad", "", 1, null,
      [
        "For all Directors Certified by the Company Secretary",
      ])
    )
  }

  setAdditionalRequirements(application: CompanyBankAccountOpening): void {
    this.additionalRequirements = []

    this.additionalRequirements.push(
      new BankChecklistItem(
        BankOpeningAdditionalRequirements.ExtractDcr,
        `Extract of Directors’ Resolution for Bank Account Opening`,
        1,
        null,
        ["(Please complete the required information)"],
        true
      )
    )

    if (!this.company.hasConstitution) {
      this.additionalRequirements.push(
        new BankChecklistItem(
          BankOpeningAdditionalRequirements.NoConstitutionDeclaration,
          `Printed Confirmation Letter of No Constitution`,
          1,
          null,
          ["(Compulsory with this Application)"],
          true
        )
      )
    }

    let selectedForRubberStamp = application.requirements.some((d: string) => {
      return d === BankOpeningAdditionalRequirements.RubberStamp
    })

    this.additionalRequirements.push(
      new BankChecklistItem(
        BankOpeningAdditionalRequirements.RubberStamp,
        `Company Rubber Stamp / Company Chop`,
        1,
        null,
        ["(delivered together with Statutory Document when ready)"],
        selectedForRubberStamp
      )
    )

    let selectedForCorporateProfile = application.requirements.some((d: string) => {
      return d === BankOpeningAdditionalRequirements.CorporateProfile
    })

    this.additionalRequirements.push(
      new BankChecklistItem(
        BankOpeningAdditionalRequirements.CorporateProfile,
        `Printed SSM Corporate Profile`,
        1,
        null,
        ["(not compulsory but Bank Officer will accept)"],
        selectedForCorporateProfile
      )
    )
  }
}
