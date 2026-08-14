export class ServiceName {
  en: string = ""
  bm: string = ""
  target: string = ""
  link: string = ""
  parentDirectory: string = ""

  constructor(
    en: string,
    bm: string,
    target: string,
    link: string | null = null,
    parentDirectory: string | null = null
  ) {
    this.en = en
    this.bm = bm
    this.target = target
    this.link = link ?? ""
    this.parentDirectory = parentDirectory ?? ""
  }
}

export class ServiceNames {
  static default: ServiceName = new ServiceName("Initiated Resolution", "Resolusi", "") // Get better default??

  static applicationIncorporation: ServiceName = new ServiceName(
    "New Sdn Bhd Incorporation",
    "Pemerbadanan Sdn Bhd Baharu",
    "application_incorporate"
  )
  static applicationSwitch: ServiceName = new ServiceName(
    "Switch to iCompany",
    "Penukaran ke iCompany",
    "application_switch"
  )
  static changeOfBusinessName: ServiceName = new ServiceName(
    "Change of Company Name",
    "Ubah Nama Syarikat",
    "company_amendment_name",
    "change-business-name",
    "business"
  )
  static changeOfBusinessAddress: ServiceName = new ServiceName(
    "Change of Company Address",
    "Penukaran Alamat Syarikat",
    "company_amendment_address",
    "change-business-address",
    "business"
  )
  static changeOfRegisteredAddress: ServiceName = new ServiceName(
    "Change of Registered Address",
    "Penukaran Alamat Berdaftar",
    "company_amendment_registered_address",
    "change-registered-address",
    "business"
  )
  static changeOfBusinessDescription: ServiceName = new ServiceName(
    "Change of Business Description",
    "Penukaran Perihal Syarikat",
    "company_amendment_description",
    "change-business-description",
    "business"
  )
  static changeOfBusinessBranch: ServiceName = new ServiceName(
    "Add/Remove Business Branch",
    "Ubah Cawangan Syarikat",
    "company_amendment_branch",
    "change-business-branch",
    "business"
  )
  static changeOfConstitution: ServiceName = new ServiceName(
    "Company Constitution",
    "Perlembagaan Syarikat",
    "company_amendment_constitution",
    "",
    "constitution"
  )
  static section47: ServiceName = new ServiceName(
    "Company Document Not Kept (section 47)",
    "Dokumen Syarikat Tidak Disimpan (seksyen 47)",
    "company_record_storage",
    "no-kept-registration-address",
    "document"
  )
  static appointmentOfDirector: ServiceName = new ServiceName(
    "Appoint New Director",
    "Perlantikan Pengarah",
    "company_director_appointment",
    "appoint-director-new",
    "director"
  )
  static resignationOfDirector: ServiceName = new ServiceName(
    "Director Resignation",
    "Perletakan Jawatan Pengarah",
    "company_director_resignation",
    "resign-director",
    "director"
  )
  static allotmentOfShares: ServiceName = new ServiceName(
    "Allot New Shares",
    "Peruntukan Saham Baharu",
    "company_shareholder_allotment",
    "allotment-of-shares",
    "shareholder"
  )
  static proposedAllotmentOfShares: ServiceName = new ServiceName(
    "Propose Allot New Shares",
    "Cadangan Peruntukan Saham Baharu",
    "company_share_issuance",
    "allotment-of-shares",
    "shareholders"
  )
  static transferOfShares: ServiceName = new ServiceName(
    "Transfer of Shares",
    "Pemindahan Saham",
    "company_shareholder_transfer",
    "transfer-of-shares",
    "shareholders"
  )
  static proposedTransferOfShares: ServiceName = new ServiceName(
    "Proposed Transfer of Shares",
    "Cadangan Pemindahan Saham",
    "company_shareholder_transfer_proposal",
    "transfer-of-shares",
    "shareholders"
  )
  static postTransferOfShares: ServiceName = new ServiceName(
    "Approval of Registration of Members and Section 106",
    "Kelulusan Pendaftaran Pemegang Saham dan Seksyen 106",
    "company_post_share_transfer",
    "transfer-of-shares",
    "shareholders"
  )
  static openingOfBankAccount: ServiceName = new ServiceName(
    "Open New Bank Account",
    "Pembukaan Akaun Bank Baharu",
    "company_bank_resolution",
    "",
    "banks"
  )
  static closureOfBankAccount: ServiceName = new ServiceName(
    "Closure of Bank Account",
    "Penutupan Akaun Bank",
    "company_bank_account_closure",
    "",
    "banks"
  )
  static annualReturnLodgment: ServiceName = new ServiceName(
    "Lodgment of Annual Return",
    "Failkan Penyata Tahunan",
    "company_annual_return_request",
    "annual-return",
    "compliance"
  )
  static subscription: ServiceName = new ServiceName(
    "Subscription Renewal",
    "Perbaharui Langganan",
    "company_subscription"
  )
  static auditCirculation: ServiceName = new ServiceName(
    "Circulation of Financial Statements",
    "Pengedaran Penyata Kewangan",
    "company_audit_circulation"
  )
  static auditEot: ServiceName = new ServiceName(
    "Extension of Time to Lodge Financial Statements and Reports",
    "Lanjutan Masa untuk Mengemukakan Penyata Kewangan dan Laporan",
    "company_audit_extension_of_time"
  )
  static auditorAppointment: ServiceName = new ServiceName(
    "Appointment of Auditor",
    "Perlantikan Juruaudit",
    "company_auditor_appointment",
    "appointment-of-auditor",
    "compliance"
  )
  static customResolution: ServiceName = new ServiceName(
    "Draft Resolution",
    "Resolusi Draf",
    "company_custom_resolution"
  )
  static setFinancialYearEnd: ServiceName = new ServiceName(
    "Financial Year End",
    "Tarikh Akhir Tahun Kewangan",
    "company_set_financial_year_end",
    "set-financial-year-end",
    "accountings"
  )
  static managementAccount: ServiceName = new ServiceName(
    "Management Account",
    "Akaun Pengurusan",
    "company_management_account",
    "",
    "accountings"
  )
  static delegationOfAuthority: ServiceName = new ServiceName(
    "Delegation of Authority",
    "Penurunan Kuasa",
    "company_delegation_of_authority",
    "delegation-of-authority",
    "director"
  )
  static addressSubscription: ServiceName = new ServiceName(
    "Use of iCompany Business Address",
    "Penggunaan Alamat Perniagaan iCompany",
    "company_address_subscription",
    "business-address-service",
    "business"
  )
  static adoptCommonSeal: ServiceName = new ServiceName(
    "Adoption of Common Seal",
    "Penggunaan Meterai Umum",
    "company_common_seal",
    "adopt",
    "common-seals"
  )
  static replaceCommonSeal: ServiceName = new ServiceName(
    "Replacement of Common Seal",
    "Penggantian Meterai Umum",
    "company_common_seal_replacement",
    "replace",
    "common-seals"
  )
  static enteringContract: ServiceName = new ServiceName(
    "Contracts & Agreements",
    "Kontrak & Perjanjian",
    "company_contract_enter",
    "contracts",
    "director"
  )
  static appointManager: ServiceName = new ServiceName(
    "Appoint New Manager",
    "Lantik Pengurus Baharu",
    "company_director_manager_appointment",
    "managers",
    "director"
  )

  static names: ServiceName[] = [
    this.applicationIncorporation,
    this.applicationSwitch,
    this.changeOfBusinessName,
    this.changeOfBusinessAddress,
    this.changeOfRegisteredAddress,
    this.changeOfBusinessDescription,
    this.changeOfBusinessBranch,
    this.changeOfConstitution,
    this.section47,
    this.appointmentOfDirector,
    this.resignationOfDirector,
    this.allotmentOfShares,
    this.proposedAllotmentOfShares,
    this.transferOfShares,
    this.proposedTransferOfShares,
    this.postTransferOfShares,
    this.openingOfBankAccount,
    this.closureOfBankAccount,
    this.annualReturnLodgment,
    this.subscription,
    this.auditCirculation,
    this.auditEot,
    this.auditorAppointment,
    this.customResolution,
    this.setFinancialYearEnd,
    this.managementAccount,
    this.delegationOfAuthority,
    this.addressSubscription,
    this.adoptCommonSeal,
    this.replaceCommonSeal,
    this.enteringContract,
    this.appointManager,
  ]
}
