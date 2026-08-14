import { CompanyConstants } from "./Company"
import { EmitMessages } from "./EmitMessages"
import { ServiceNames } from "./ServiceNames"

export abstract class SidebarLabel {
  en: string = ""
  bm: string = ""
}

export class SidebarButton extends SidebarLabel {
  id: string = ""
  icon: string = ""
  isDisabled: boolean = false

  constructor(id: string, en: string, bm: string, icon: string, isDisabled: boolean = false) {
    super()
    this.id = id
    this.en = en
    this.bm = bm
    this.icon = icon
    this.isDisabled = isDisabled
  }
}

export class SidebarButtons {
  static businessButton: SidebarButton = new SidebarButton("0", "Business", "Perniagaan", "fa-briefcase")
  static directorButton: SidebarButton = new SidebarButton("1", "Directorship", "Pengarah", "fa-user-tie")
  static documentButton: SidebarButton = new SidebarButton("2", "Documents", "Dokumen", "fa-files")
  static shareholderButton: SidebarButton = new SidebarButton(
    "3",
    "Shareholders",
    "Pemegang Saham",
    "fa-chart-pie-simple-circle-dollar"
  )
  static accountingButton: SidebarButton = new SidebarButton("4", "Accounting", "Akaun", "fa-calculator")
  static complianceButton: SidebarButton = new SidebarButton("5", "Compliance", "Kepatuhan", "fa-clipboard-list-check")

  static buttons: SidebarButton[] = [
    SidebarButtons.businessButton,
    SidebarButtons.directorButton,
    SidebarButtons.documentButton,
    SidebarButtons.shareholderButton,
    SidebarButtons.accountingButton,
    SidebarButtons.complianceButton,
  ]
}
export class SidebarOption extends SidebarLabel {
  url: string = ""
  target: string = ""
  isEmitMessageNeeded: boolean = false
  emitMessage: string | null = null
  isDisabled: boolean = false

  constructor(
    en: string,
    bm: string,
    url: string,
    target: string = "",
    isEmitMessageNeeded: boolean = false,
    emitMessage: string | null = null,
    isDisabled: boolean = false
  ) {
    super()
    this.en = en
    this.bm = bm
    this.url = url
    this.target = target
    this.isEmitMessageNeeded = isEmitMessageNeeded
    this.emitMessage = emitMessage
    this.isDisabled = isDisabled
  }
}

export class SidebarOptions {
  // Business Options
  static businessDetail = new SidebarOption("Details of Sdn Bhd", "Butiran Perniagaan", "", "")
  static openBankAccount = new SidebarOption(
    "Opening of Bank Account",
    "Pembukaan Akaun Bank",
    "banks",
    ServiceNames.openingOfBankAccount.target
  )
  static changeBusinessName = new SidebarOption(
    "Change of Company Name",
    "Perubahan Nama Syarikat",
    "business/change-business-name",
    ServiceNames.changeOfBusinessName.target
  )

  static changeBusinessAddress = new SidebarOption(
    "Update Business Address",
    "Kemas Kini Alamat Perniagaan",
    "business/change-business-address",
    ServiceNames.changeOfBusinessAddress.target
  )
  static changeBusinessBranch = new SidebarOption(
    "Update Company Branch",
    "Kemaskini Cawangan Syarikat",
    "business/change-business-branch",
    ServiceNames.changeOfBusinessBranch.target
  )
  static changeRegisteredAddress = new SidebarOption(
    "Change Registered Address",
    "Tukar Alamat Berdaftar",
    "business/change-registered-address",
    ServiceNames.changeOfRegisteredAddress.target
  )
  static changeBusinessDescription = new SidebarOption(
    "Update Business Nature",
    "Kemas Kini Sifat Perniagaan",
    "business/change-business-description",
    ServiceNames.changeOfBusinessDescription.target
  )
  static purchaseCompanyEssentials = new SidebarOption(
    "Company Essentials",
    "Keperluan Syarikat",
    "company-essentials",
    "" // TODO: Add service target here
  )
  static applicationForStrikingOff = new SidebarOption(
    "Application to Strike Off",
    "Permohonan Pembatalan (Striking Off)",
    "striking-off",
    "" // TODO: Add service target here
  )
  static businessAddressService = new SidebarOption(
    "Business Address Service",
    "Servis Alamat Perniagaan",
    "business/business-address-service",
    ServiceNames.addressSubscription.target
  )

  // Director Options
  static directorDetail = new SidebarOption("Details of Director", "Butiran Pengarah", "directors", "")
  static delegationOfAuthority = new SidebarOption(
    "Delegation of Authority",
    "Penurunan Kuasa",
    "director/delegation-of-authority",
    ServiceNames.delegationOfAuthority.target
  )
  static assignThirdPartyRoles = new SidebarOption(
    "Roles and Access",
    "Peranan and Akses",
    "roles-and-accesses",
    "" // TODO: Add service target here
  )
  static resignAsDirector = new SidebarOption(
    "Resign as Director",
    "Letak Jawatan sebagai Pengarah",
    "director/resign-director",
    ServiceNames.resignationOfDirector.target,
    true,
    EmitMessages.RESIGN_AS_DIRECTOR
  )
  static appointNewDirector = new SidebarOption(
    "Appoint New Director",
    "Lantik Pengarah Baharu",
    "director/appoint-director-new",
    ServiceNames.appointmentOfDirector.target
  )
  static appointNewManager = new SidebarOption(
    "Appoint a CEO",
    "Lantik CEO",
    "director/managers",
    ServiceNames.appointManager.target
  )
  static appointShadowDirector = new SidebarOption(
    "Appoint Shadow Director",
    "Lantik Pengarah Bayangan",
    "director/appoint-director-shadow",
    "" // TODO: Add service target here
  )
  static appointNomineeDirector = new SidebarOption(
    "Appoint Nominee Director",
    "Lantik Pengarah Penama",
    "director/appoint-director-nominee",
    "" // TODO: Add service target here
  )

  static newResolution = new SidebarOption(
    "New Resolution",
    "Resolusi Baharu",
    "director/new-resolution",
    "" // TODO: Add service target here
  )
  static declareDividend = new SidebarOption(
    "Declare Dividend",
    "Isytihar Dividen",
    "dividends/declare-dividend",
    "" // TODO: Add service target here
  )
  static declareConflictOfInterest = new SidebarOption(
    "Declare Conflict of Interest",
    "Isytihar Konflik Kepentingan",
    "directors/declare-conflict-interest",
    "" // TODO: Add service target here
  )
  static applicationOfStrikingOff = new SidebarOption(
    "Application to Strike Off",
    "Permohonan Pembatalan (Striking Off)",
    "striking-off",
    "" // TODO: Add service target here
  )

  static termsOfReference = new SidebarOption(
    "Terms of Reference",
    "Terma Rujukan",
    "directors/terms-of-reference",
    "" // TODO: Add service target here
  )
  static boardMeeting = new SidebarOption(
    "Board Meeting",
    "Mesyuarat Lembaga Pengarah",
    "director/board-meeting",
    "", // TODO: Add service target here
    false,
    null,
    true
  )
  static directorshipConstitution = new SidebarOption(
    "Constitution",
    "Perlembagaan",
    "constitution",
    ServiceNames.changeOfConstitution.target
  )
  static recommendRemoval = new SidebarOption(
    "Removal of Director",
    "Penyingkiran Pengarah",
    "director/recommend-removal",
    "", // TODO: Add service target here
    false,
    null,
    true
  )

  static activityRegister = new SidebarOption(
    "Activity Register",
    "Daftar Aktiviti",
    "activity-registers",
    "", // TODO: Add service target here
    false,
    null,
    false
  )

  // director loans and advances
  static directorLoans = new SidebarOption(
    "Loans & Advances",
    "Pinjaman & Pendahuluan",
    "loans-advances",
    CompanyConstants.TARGET_DIRECTOR_LOAN,
    false,
    null,
    false
  )

  static contracts = new SidebarOption(
    "Contracts & Agreement",
    "Kontrak & Perjanjian",
    "director/contracts",
    CompanyConstants.TARGET_CONTRACT_ENTER,
    false,
    null,
    false
  )

  // Common Seals Options
  static adoptCommonSeal = new SidebarOption(
    "Adopt Common Seal",
    "Guna Common Seal",
    "common-seals",
    CompanyConstants.TARGET_COMMON_SEAL,
    false,
    null,
    false
  )
  static replaceCommonSeals = new SidebarOption(
    "Replace Common Seal",
    "Ganti Common Seal",
    "common-seals",
    CompanyConstants.TARGET_COMMON_SEAL_REPLACEMENT,
    false,
    null,
    false
  )

  // Documents Options
  static documentDetail = new SidebarOption("Sdn Bhd Document", "Dokumen Syarikat", "documents", "")
  static statutoryForms = new SidebarOption(
    "Statutory Forms",
    "Borang Berkanun",
    "documents?tab=statutory-forms",
    "" // TODO: Add service target here
  )
  static companyDocuments = new SidebarOption(
    "Company Documents",
    "Dokument Syarikat",
    "documents",
    "" // TODO: Add service target here
  )
  static ssmCorporateProfile = new SidebarOption(
    "SSM Corporate Profile",
    "Profil Korporat SSM",
    "?tab=ssm-corporate-profile",
    ""
  )
  static documentsConstitution = new SidebarOption(
    "Constitution",
    "Perlembagaan",
    "constitution",
    ServiceNames.changeOfConstitution.target
  )

  static mailsAtRegisteredAddress = new SidebarOption(
    "Mails at Registered Address",
    "Mel di Alamat Berdaftar",
    "document/mail-at-registered-address",
    "",
    true,
    EmitMessages.MAILROOM_SERVICE,
    false
  )
  static documentsBusinessTemplates = new SidebarOption(
    "Business Templates",
    "Templat Perniagaan",
    "documents?tab=business-templates",
    "" // TODO: Add service target here
  )
  static notKeptInRegistrationAddress = new SidebarOption(
    "Not Kept in Registered Address",
    "Tidak Disimpan di Alamat Pendaftaran",
    "document/no-kept-registration-address",
    "" // TODO: Add service target here
  )

  static mofApplication = new SidebarOption("MOF Application", "Permohonan MOF", "documents?tab=mof-application", "")
  static cidbApplication = new SidebarOption(
    "CIDB Application",
    "Permohonan CIDB",
    "documents?tab=cidb-application",
    ""
  )
  static loanApplication = new SidebarOption(
    "Loan Application",
    "Permohonan Pinjaman",
    "documents?tab=loan-application",
    ""
  )
  static cdsAccountOpening = new SidebarOption(
    "CDS Account Opening",
    "Pembukaan Akaun CDS",
    "documents?tab=cds-account",
    ""
  )

  // Shareholder Options
  static shareholderDetail = new SidebarOption("Details of Shareholder", "Butiran Pemegang Saham", "shareholders", "")
  static transferOfExistingShare = new SidebarOption(
    "Transfer of Existing Shares",
    "Pindahan Saham Sedia Ada",
    "shareholders/transfer-of-shares",
    ServiceNames.transferOfShares.target
  )
  static allotmentOfNewShares = new SidebarOption(
    "Allotment of New Shares",
    "Peruntukan Saham Baharu",
    "shareholders/allotment-of-shares",
    ServiceNames.allotmentOfShares.target
  )

  static beneficialOwnerDisclosure = new SidebarOption(
    "Beneficial Owner Disclosure",
    "Pendedahan Pemilik Bermanfaat",
    "shareholders/beneficial-owner-disclosure",
    "" // TODO: Add service target here
  )
  static shareholderFinancialStatement = new SidebarOption(
    "Financial Statement",
    "Penyata Kewangan",
    "financial-statements",
    "" // TODO: Add service target here
  )
  static approveDividend = new SidebarOption(
    "Approve Dividend",
    "Luluskan Dividen",
    "dividends/approve-dividend",
    "" // TODO: Add service target here
  )

  static shareholderAppointDirector = new SidebarOption(
    "Appoint New Director",
    "Lantik Pengarah baru",
    "director/appoint-director-new?role=shareholder",
    ServiceNames.appointmentOfDirector.target
  )
  static removeDirector = new SidebarOption(
    "Remove a Director",
    "Singkirkan Pengarah",
    "director/resign-director",
    ServiceNames.resignationOfDirector.target
  )
  static shareReduction = new SidebarOption(
    "Reduction of Capital",
    "Pengurangan Modal Saham",
    "shareholder/share-reduction",
    "" // TODO: Add service target here
  )
  static bonusIssue = new SidebarOption(
    "Issue Bonus Shares",
    "Terbitan Saham Bonus",
    "shareholder/bonus-issue",
    "", // TODO: Add service target here
    false,
    null,
    true
  )
  static shareholderConstitution = new SidebarOption(
    "Constitution",
    "Perlembagaan",
    "constitution",
    ServiceNames.changeOfConstitution.target
  )
  static voluntaryWindingUp = new SidebarOption(
    "Voluntary Winding Up",
    "Penggulungan Sukarela",
    "shareholder/voluntary-winding-up",
    "", // TODO: Add service target here
    false,
    null,
    true
  )

  // Accountings Options
  static setFinancialYearEnd = new SidebarOption(
    "Set Financial Year End",
    "Tetapkan Tahun Kewangan Berakhir",
    "accountings/set-financial-year-end",
    ServiceNames.setFinancialYearEnd.target
  )

  static managementAccount = new SidebarOption(
    "Management Account",
    "Akaun Pengurusan",
    "accountings",
    ServiceNames.managementAccount.target
  )

  // Compliance Options
  static annualReturn = new SidebarOption(
    "Annual Return",
    "Penyata Tahunan",
    "compliance/annual-return",
    ServiceNames.annualReturnLodgment.target
  )
  static complianceFinancialStatement = new SidebarOption(
    "Financial Statement",
    "Penyata Kewangan",
    "financial-statements",
    "" // TODO: Add service target here
  )

  static complianceCompanyEssentials = new SidebarOption(
    "Company Essentials",
    "Keperluan Syarikat",
    "company-essentials",
    "" // TODO: Add service target here
  )
  static complianceBusinessTemplates = new SidebarOption(
    "Business Templates",
    "Templat Perniagaan",
    "documents?tab=business-templates",
    "" // TODO: Add service target here
  )
  static appointmentOfAuditor = new SidebarOption(
    "Appointment of Auditor",
    "Pelantikan Juruaudit",
    "compliance/appointment-of-auditor",
    ServiceNames.auditorAppointment.target
  )
}

export class SidebarSection extends SidebarLabel {
  options: SidebarOption[] = []

  constructor(en: string, bm: string, options: SidebarOption[]) {
    super()
    this.en = en
    this.bm = bm
    this.options = options.map((val: SidebarOption) => {
      return new SidebarOption(
        val.en,
        val.bm,
        val.url,
        val.target,
        val.isEmitMessageNeeded,
        val.emitMessage,
        val.isDisabled
      )
    })
  }
}

export class SidebarSections {
  // Business Section
  static businessGeneral: SidebarSection = new SidebarSection("General", "Umum", [SidebarOptions.businessDetail])
  static businessAffaris: SidebarSection = new SidebarSection("Business Affairs", "Hal Ehwal Perniagaan", [
    SidebarOptions.openBankAccount,
    SidebarOptions.changeBusinessName,
  ])
  static placeOfBusinessAddress = new SidebarSection("Place of Business & Address", "Tempat & Alamat Perniagaan", [
    SidebarOptions.changeBusinessAddress,
    SidebarOptions.changeBusinessBranch,
    SidebarOptions.businessAddressService,
    SidebarOptions.changeRegisteredAddress,
  ])
  static principalActivity = new SidebarSection("Principal Activity", "Aktiviti Utama", [
    SidebarOptions.changeBusinessDescription,
    SidebarOptions.purchaseCompanyEssentials,
    SidebarOptions.applicationForStrikingOff,
  ])

  // Directorship Options
  static directorshipGeneral: SidebarSection = new SidebarSection("General", "Umum", [SidebarOptions.directorDetail])
  static strategicManagement = new SidebarSection("Strategic Management", "Pengurusan Strategik", [
    SidebarOptions.delegationOfAuthority,
    SidebarOptions.assignThirdPartyRoles,
    SidebarOptions.resignAsDirector,
    SidebarOptions.appointNewDirector,
    SidebarOptions.appointNewManager,
    // SidebarOptions.appointShadowDirector,
    // SidebarOptions.appointNomineeDirector,
  ])
  static businessJudgement = new SidebarSection("Business Judgement", "Penilaian Perniagaan", [
    SidebarOptions.declareDividend,
    SidebarOptions.declareConflictOfInterest,
    SidebarOptions.applicationOfStrikingOff,
    SidebarOptions.directorLoans,
    SidebarOptions.contracts,
  ])
  static directorshipInternalGovernance = new SidebarSection("Internal Governance", "Tadbir Urus Dalaman", [
    SidebarOptions.adoptCommonSeal,
    SidebarOptions.termsOfReference,
    SidebarOptions.boardMeeting,
    SidebarOptions.directorshipConstitution,
    SidebarOptions.recommendRemoval,
    SidebarOptions.activityRegister,
  ])

  // Documents Sections
  static documentGeneral: SidebarSection = new SidebarSection("General", "Umum", [SidebarOptions.documentDetail])
  static complianceEssentials = new SidebarSection("Compliance & Governance", "Pematuhan & Tadbir Urus", [
    SidebarOptions.adoptCommonSeal,
    SidebarOptions.ssmCorporateProfile,
    SidebarOptions.statutoryForms,
    SidebarOptions.companyDocuments,
    SidebarOptions.documentsBusinessTemplates,
    SidebarOptions.documentsConstitution,
  ])
  static companyDocuments = new SidebarSection("Other Documents", "Dokumen Lain", [
    SidebarOptions.mailsAtRegisteredAddress,
    SidebarOptions.notKeptInRegistrationAddress,
  ])
  static resolutions = new SidebarSection("Resolutions", "Resolusi", [
    SidebarOptions.mofApplication,
    SidebarOptions.cidbApplication,
    SidebarOptions.loanApplication,
    SidebarOptions.cdsAccountOpening,
    SidebarOptions.contracts,
  ])

  // Shareholder Sections
  static shareholderGeneral: SidebarSection = new SidebarSection("General", "Umum", [SidebarOptions.shareholderDetail])
  static shareCapital = new SidebarSection("Share Capital", "Modal Saham", [
    SidebarOptions.transferOfExistingShare,
    SidebarOptions.allotmentOfNewShares,
  ])
  static membersRights = new SidebarSection(`Members' Rights`, "Hak Ahli", [
    SidebarOptions.beneficialOwnerDisclosure,
    SidebarOptions.shareholderFinancialStatement,
    SidebarOptions.approveDividend,
  ])
  static membersPowers = new SidebarSection(`Members' Powers`, "Kuasa Ahli", [
    SidebarOptions.shareholderAppointDirector,
    SidebarOptions.removeDirector,
    SidebarOptions.shareholderConstitution,
    SidebarOptions.shareReduction,
    SidebarOptions.bonusIssue,
    SidebarOptions.voluntaryWindingUp,
    SidebarOptions.directorLoans,
  ])

  // Accounting Section
  static accountingGenerals = new SidebarSection("General", "Umum", [
    SidebarOptions.setFinancialYearEnd,
    SidebarOptions.managementAccount,
  ])

  // Compliance Sections
  static oversightAndCompliance = new SidebarSection("Oversight and Compliance", "Pengawasan dan Pematuhan", [
    SidebarOptions.annualReturn,
    SidebarOptions.complianceFinancialStatement,
    SidebarOptions.appointmentOfAuditor,
  ])
  static complianceInternalGovernance = new SidebarSection("Internal Governance", "Tadbir Urus Dalaman", [
    SidebarOptions.complianceCompanyEssentials,
    SidebarOptions.complianceBusinessTemplates,
    SidebarOptions.activityRegister,
  ])

  // Sidebar Sections Groupping
  static businessSections: SidebarSection[] = [
    this.businessGeneral,
    this.businessAffaris,
    this.placeOfBusinessAddress,
    this.principalActivity,
  ]
  static directorshipSections: SidebarSection[] = [
    this.directorshipGeneral,
    this.strategicManagement,
    this.businessJudgement,
    this.directorshipInternalGovernance,
  ]
  static documentsSections: SidebarSection[] = [
    this.documentGeneral,
    this.complianceEssentials,
    this.companyDocuments,
    this.resolutions,
  ]
  static shareholderSections: SidebarSection[] = [
    this.shareholderGeneral,
    this.shareCapital,
    this.membersRights,
    this.membersPowers,
  ]
  static accountingSections: SidebarSection[] = [this.accountingGenerals]
  static complianceSections: SidebarSection[] = [this.oversightAndCompliance, this.complianceInternalGovernance]
}

export class Sidebar {
  button: SidebarButton
  sections: SidebarSection[]

  constructor(button: SidebarButton, sections: SidebarSection[]) {
    this.button = button
    this.sections = sections
  }
}

export class SdnBhdSidebarConstant {
  static SIDEBARS: Sidebar[] = [
    new Sidebar(SidebarButtons.businessButton, SidebarSections.businessSections),
    new Sidebar(SidebarButtons.directorButton, SidebarSections.directorshipSections),
    new Sidebar(SidebarButtons.documentButton, SidebarSections.documentsSections),
    new Sidebar(SidebarButtons.shareholderButton, SidebarSections.shareholderSections),
    new Sidebar(SidebarButtons.accountingButton, SidebarSections.accountingSections),
    new Sidebar(SidebarButtons.complianceButton, SidebarSections.complianceSections),
  ]
}
