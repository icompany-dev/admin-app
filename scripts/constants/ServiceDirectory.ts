import { StringUtil } from "../utils/String"
import { ServiceName, ServiceNames } from "./ServiceNames"

export class ServiceDirectory {
  en: string = ""
  bm: string = ""
  descriptionEn: string = ""
  descriptionBm: string = ""
  tooltipEn: string = ""
  tooltipBm: string = ""
  keywords: string[] = []
  root: string = ""
  uri: string = ""

  constructor(
    en: string = "",
    bm: string = "",
    descriptionEn: string,
    descriptionBm: string,
    tooltipEn: string,
    tooltipBm: string,
    keywords: string,
    root: string,
    uri: string
  ) {
    this.en = en
    this.bm = bm
    this.descriptionEn = descriptionEn
    this.descriptionBm = descriptionBm
    this.tooltipEn = tooltipEn
    this.tooltipBm = tooltipBm
    this.keywords = keywords.split(", ")
    this.root = root
    this.uri = uri
  }
}

export class ServiceDirectories {
  static getServiceUri(serviceName: ServiceName): string {
    let uri = serviceName.parentDirectory

    if (!StringUtil.isNullOrEmpty(serviceName.link)) {
      uri += `/ ${serviceName.link}`
    }

    return uri
  }

  static applicationIncorporation: ServiceDirectory = new ServiceDirectory(
    ServiceNames.applicationIncorporation.en,
    ServiceNames.applicationIncorporation.bm,
    `Submit new application to incorporate new Sdn Bhd`,
    `Hantar permohonan baharu untuk menubuhkan Sdn Bhd baharu`,
    `Register a new private limited (Sdn Bhd) company.`,
    `Daftar sebuah syarikat sendirian berhad (Sdn Bhd) baharu.`,
    "register company, start business, setup, formation, new company, incorporation, SSM registration, private limited, daftar syarikat, mula bisnes, penubuhan, syarikat baru, pendaftaran SSM, sendirian berhad",
    `incorporation`,
    this.getServiceUri(ServiceNames.applicationIncorporation)
  )

  static applicationSwitch: ServiceDirectory = new ServiceDirectory(
    ServiceNames.applicationSwitch.en,
    ServiceNames.applicationSwitch.bm,
    `Submit new application to switch your Company Secretary`,
    `Hantar permohonan baharu untuk menukarkan Setiausaha Syarikat anda`,
    `Change your current company secretary to a new one.`,
    `Tukar setiausaha syarikat sedia ada anda kepada yang baharu.`,
    "change cosec, new secretary, company secretary, appoint secretary, replace secretary, cosec, tukar setiausaha, setiausaha baru, lantik setiausaha, ganti setiausaha",
    `switch`,
    this.getServiceUri(ServiceNames.applicationSwitch)
  )

  static changeOfBusinessName: ServiceDirectory = new ServiceDirectory(
    ServiceNames.changeOfBusinessName.en,
    ServiceNames.changeOfBusinessName.bm,
    `Initiate a resolution to change your Business name`,
    `Mulakan resolusi untuk tukar nama Syarikat anda`,
    `Formally change the registered name of your company.`,
    `Tukar nama berdaftar syarikat anda secara rasmi.`,
    "rename company, update name, company name, name change, amend name, SSM name, tukar nama, nama baru, kemaskini nama, pinda nama, nama SSM",
    `sdnbhd`,
    this.getServiceUri(ServiceNames.changeOfBusinessName)
  )

  static changeOfBusinessAddress: ServiceDirectory = new ServiceDirectory(
    ServiceNames.changeOfBusinessAddress.en,
    ServiceNames.changeOfBusinessAddress.bm,
    `Initiate a resolution to change your Business address`,
    `Mulakan resolusi untuk tukar alamat Syarikat anda`,
    `Update your company's official business address.`,
    `Kemaskini alamat perniagaan rasmi syarikat anda.`,
    "update address, new address, business address, office address, change of address, business location, pindah alamat, alamat baru, kemaskini alamat, alamat perniagaan, alamat pejabat, lokasi perniagaan",
    `sdnbhd`,
    this.getServiceUri(ServiceNames.changeOfBusinessAddress)
  )

  static changeOfRegisteredAddress: ServiceDirectory = new ServiceDirectory(
    ServiceNames.changeOfRegisteredAddress.en,
    ServiceNames.changeOfRegisteredAddress.bm,
    `Initiate a resolution to change your Registered address`,
    `Mulakan resolusi untuk tukar alamat berdaftar Syarikat anda`,
    `Update your company's official registered address with SSM.`,
    `Kemaskini alamat berdaftar rasmi syarikat anda dengan SSM.`,
    "registered address, SSM address, company address, official address, change registered address, alamat berdaftar, alamat SSM, alamat syarikat, alamat rasmi, tukar alamat berdaftar",
    `sdnbhd`,
    this.getServiceUri(ServiceNames.changeOfRegisteredAddress)
  )

  static changeOfBusinessDescription: ServiceDirectory = new ServiceDirectory(
    ServiceNames.changeOfBusinessDescription.en,
    ServiceNames.changeOfBusinessDescription.bm,
    `Initiate a resolution to change your Business Nature`,
    `Mulakan resolusi untuk tukar perihal Syarikat anda`,
    `Change the official nature of business (MSIC code).`,
    `Tukar jenis perniagaan rasmi syarikat (kod MSIC).`,
    "business activity, update nature, M&A, memorandum, business code, MSIC code, objects of company, aktiviti perniagaan, kemaskini perihal, kod perniagaan, kod MSIC, objek syarikat",
    `sdnbhd`,
    this.getServiceUri(ServiceNames.changeOfBusinessDescription)
  )

  static changeOfBusinessBranch: ServiceDirectory = new ServiceDirectory(
    ServiceNames.changeOfBusinessBranch.en,
    ServiceNames.changeOfBusinessBranch.bm,
    `Initiate a resolution to add/remove business branch`,
    `Mulakan resolusi untuk tambah/bubar cawangan Syarikat anda`,
    `Register a new business branch or close an existing one.`,
    `Daftar cawangan perniagaan baharu atau tutup cawangan sedia ada.`,
    "new branch, close branch, add branch, remove branch, outlet, open branch, liquidate branch, store location, cawangan baru, tutup cawangan, tambah cawangan, buang cawangan, buka cawangan, pembubaran cawangan",
    `sdnbhd`,
    this.getServiceUri(ServiceNames.changeOfBusinessBranch)
  )

  static changeOfConstitution: ServiceDirectory = new ServiceDirectory(
    ServiceNames.changeOfConstitution.en,
    ServiceNames.changeOfConstitution.bm,
    `Add or initiate changes to your Constitution`,
    `Tambah atau tukar Perlembagaan Syarikat anda`,
    `Amend, replace, or adopt a new company constitution.`,
    `Pinda, ganti, atau terima pakai perlembagaan syarikat yang baharu.`,
    "M&A, memorandum, articles of association, amend constitution, adopt constitution, perlembagaan, tataurusan syarikat, pinda perlembagaan",
    `sdnbhd`,
    this.getServiceUri(ServiceNames.changeOfConstitution)
  )

  static appointmentOfDirector: ServiceDirectory = new ServiceDirectory(
    ServiceNames.appointmentOfDirector.en,
    ServiceNames.appointmentOfDirector.bm,
    `Initiate a resolution to appoint a new Director for your Sdn Bhd`,
    `Mulakan resolusi untuk melantik Pengarah baharu untuk Syarikat anda`,
    `Add a new individual to the board of directors.`,
    `Tambah individu baharu ke dalam lembaga pengarah.`,
    "directors, add director, new director, board member, appointment, director resolution, Section 58, form 49, tambah pengarah, pengarah baru, ahli lembaga, pelantikan, resolusi pengarah, Seksyen 58, borang 49",
    `sdnbhd`,
    this.getServiceUri(ServiceNames.appointmentOfDirector)
  )

  static resignationOfDirector: ServiceDirectory = new ServiceDirectory(
    ServiceNames.resignationOfDirector.en,
    ServiceNames.resignationOfDirector.bm,
    `Resign as a Director at your Sdn Bhd`,
    `Letak Jawatan sebagai Pengarah di Syarikat anda`,
    `Process the resignation or removal of a director.`,
    `Proses perletakan jawatan atau penyingkiran seorang pengarah.`,
    "directors, remove director, step down, director resignation, leave, director removal, cease to be director, buang pengarah, letak jawatan, perletakan jawatan pengarah, pemecatan pengarah, berhenti jadi pengarah",
    `sdnbhd`,
    this.getServiceUri(ServiceNames.resignationOfDirector)
  )

  static allotmentOfShares: ServiceDirectory = new ServiceDirectory(
    ServiceNames.allotmentOfShares.en,
    ServiceNames.allotmentOfShares.bm,
    `Initiate a resolution to issue and allot new shares for your Sdn Bhd`,
    `Mulakan resolusi untuk memperuntukan saham baharu untuk Sdn Bhd anda`,
    `Issue new shares to new or existing shareholders.`,
    `Terbitkan saham baharu kepada pemegang saham baharu atau sedia ada.`,
    "shareholders, members, issue shares, new shares, equity, shareholder, increase capital, share capital, allot, ahli syarikat, pemberian saham, terbit saham, saham baru, ekuiti, pemegang saham, tambah modal, modal saham, peruntukan",
    `sdnbhd`,
    this.getServiceUri(ServiceNames.allotmentOfShares)
  )

  static proposedAllotmentOfShares: ServiceDirectory = new ServiceDirectory(
    ServiceNames.proposedAllotmentOfShares.en,
    ServiceNames.proposedAllotmentOfShares.bm,
    `Propose and pass a resolution to allot new shares.`,
    `Cadang dan luluskan resolusi untuk peruntukan saham baharu.`,
    `Get shareholder approval to allot new shares in the future.`,
    `Dapatkan kelulusan pemegang saham untuk memperuntukkan saham baharu pada masa hadapan.`,
    "propose allotment, share resolution, shareholder approval, EGM, AGM, pass resolution, cadang peruntukan, resolusi saham, kelulusan pemegang saham, lulus resolusi",
    `sdnbhd`,
    this.getServiceUri(ServiceNames.proposedAllotmentOfShares)
  )

  static transferOfShares: ServiceDirectory = new ServiceDirectory(
    ServiceNames.transferOfShares.en,
    ServiceNames.transferOfShares.bm,
    `Initiate a resolution to transfer shares from a Shareholder to an existing or a new Shareholder`,
    `Mulakan resolusi untuk memindahkan saham daripada satu Pemegang Saham kepada Pemegang Saham lain`,
    `Transfer existing shares from one person to another.`,
    `Pindah milik saham sedia ada daripada seseorang kepada orang lain.`,
    "shareholders, members, sell shares, buy shares, shareholder change, remove shareholder, Section 105, form 32A, instrument of transfer, pindah milik saham, jual saham, beli saham, buang pemegang saham, tukar pemegang saham, Seksyen 105, borang 32A, surat cara pindah milik",
    `sdnbhd`,
    this.getServiceUri(ServiceNames.transferOfShares)
  )

  static postTransferOfShares: ServiceDirectory = new ServiceDirectory(
    ServiceNames.postTransferOfShares.en,
    ServiceNames.postTransferOfShares.bm,
    `Approve the registration of new members and update Section 106 register.`,
    `Luluskan pendaftaran pemegang saham baharu dan kemaskini daftar Seksyen 106.`,
    `Update the company's register of members after a share transfer.`,
    `Kemaskini daftar ahli syarikat selepas proses pindah milik saham.`,
    "register of members, update shareholder list, Section 106, shareholder register, daftar ahli, kemaskini senarai pemegang saham, Seksyen 106, daftar pemegang saham",
    `sdnbhd`,
    this.getServiceUri(ServiceNames.postTransferOfShares)
  )

  static openingOfBankAccount: ServiceDirectory = new ServiceDirectory(
    ServiceNames.openingOfBankAccount.en,
    ServiceNames.openingOfBankAccount.bm,
    `Initiate a resolution to open a new bank account for your Sdn Bhd`,
    `Mulakan resolusi untuk membuka akaun bank baharu untuk Sdn Bhd anda`,
    `Prepare the director's resolution to open a company bank account.`,
    `Sediakan resolusi pengarah untuk membuka akaun bank syarikat.`,
    "banking, resolution, bank resolution, open account, bank facilities, current account, perbankan, resolusi, resolusi bank, buka akaun, kemudahan bank, akaun semasa",
    `sdnbhd`,
    this.getServiceUri(ServiceNames.openingOfBankAccount)
  )

  static closureOfBankAccount: ServiceDirectory = new ServiceDirectory(
    ServiceNames.closureOfBankAccount.en,
    ServiceNames.closureOfBankAccount.bm,
    `Initiate a resolution to close a bank account.`,
    `Mulakan resolusi untuk menutup akaun bank.`,
    `Prepare the director's resolution to close a company bank account.`,
    `Sediakan resolusi pengarah untuk menutup akaun bank syarikat.`,
    "close bank account, terminate account, bank resolution, banking, tutup akaun bank, tamatkan akaun, resolusi bank, perbankan",
    `sdnbhd`,
    this.getServiceUri(ServiceNames.closureOfBankAccount)
  )

  static annualReturnLodgment: ServiceDirectory = new ServiceDirectory(
    ServiceNames.annualReturnLodgment.en,
    ServiceNames.annualReturnLodgment.bm,
    `Mandatory payment to SSM on the incorporation date of your Sdn Bhd`,
    `Bayaran wajib kepada SSM pada tarikh pemerbadanan Sdn Bhd anda`,
    `File the compulsory Annual Return with SSM.`,
    `Fail Penyata Tahunan yang wajib kepada SSM.`,
    "AR, file annual return, yearly filing, SSM compliance, statutory filing, anniversary payment, late filing penalty, Penyata Tahunan SSM, fail penyata tahunan, pematuhan SSM, bayaran tahunan, denda lewat, ulang tahun syarikat",
    `sdnbhd`,
    this.getServiceUri(ServiceNames.annualReturnLodgment)
  )

  static subscription: ServiceDirectory = new ServiceDirectory(
    ServiceNames.subscription.en,
    ServiceNames.subscription.bm,
    `Renew your annual secretarial and software subscription.`,
    `Perbaharui langganan setiausaha dan perisian tahunan anda.`,
    `Renew your yearly secretarial service and software plan.`,
    `Perbaharui pelan perkhidmatan setiausaha dan perisian tahunan anda.`,
    "renew subscription, secretarial fee, software fee, annual payment, perbaharui langganan, yuran setiausaha, yuran perisian, bayaran tahunan",
    `sdnbhd`,
    this.getServiceUri(ServiceNames.subscription)
  )

  static auditCirculation: ServiceDirectory = new ServiceDirectory(
    ServiceNames.auditCirculation.en,
    ServiceNames.auditCirculation.bm,
    `Circulate the audited financial statements to all members.`,
    `Edarkan penyata kewangan yang telah diaudit kepada semua pemegang saham.`,
    `Distribute the Audited Financial Statements to all shareholders.`,
    `Edarkan Penyata Kewangan Beraudit kepada semua pemegang saham.`,
    "audited financial statements, circulate accounts, shareholder report, AFS, Penyata Kewangan Beraudit, edar akaun, laporan pemegang saham",
    `sdnbhd`,
    this.getServiceUri(ServiceNames.auditCirculation)
  )

  static auditEot: ServiceDirectory = new ServiceDirectory(
    ServiceNames.auditEot.en,
    ServiceNames.auditEot.bm,
    `Apply for an Extension of Time (EOT) to lodge financial statements with SSM.`,
    `Mohon Lanjutan Masa (EOT) untuk menyerahsimpan penyata kewangan dengan SSM.`,
    `Request more time from SSM to file your financial statements.`,
    `Mohon masa tambahan daripada SSM untuk memfailkan penyata kewangan anda.`,
    "Extension of Time, EOT, SSM EOT, late financial statement, lodge accounts late, Lanjutan Masa, SSM Lanjutan Masa, lewat hantar penyata kewangan",
    `sdnbhd`,
    this.getServiceUri(ServiceNames.auditEot)
  )

  static auditorAppointment: ServiceDirectory = new ServiceDirectory(
    ServiceNames.auditorAppointment.en,
    ServiceNames.auditorAppointment.bm,
    `Appoint an auditor for your Sdn Bhd in compliance with the Companies Act 2016.`,
    `Lantik juruaudit untuk Sdn Bhd anda selaras dengan Akta Syarikat 2016.`,
    `Submit the appointment of your company auditor and ensure your financial statements can be audited and lodged with SSM.`,
    `Serahkan pelantikan juruaudit syarikat anda bagi memastikan penyata kewangan dapat diaudit dan dihantar kepada SSM.`,
    "auditor appointment, appoint auditor Malaysia, SSM auditor appointment, company auditor Malaysia, lantik juruaudit, juruaudit syarikat, SSM auditor",
    `sdnbhd`,
    this.getServiceUri(ServiceNames.auditorAppointment)
  )

  static customResolution: ServiceDirectory = new ServiceDirectory(
    ServiceNames.customResolution.en,
    ServiceNames.customResolution.bm,
    `Create and formalise a custom directors' or shareholders' resolution for your Sdn Bhd.`,
    `Sediakan dan memuktamadkan resolusi pengarah atau pemegang saham tersuai bagi Sdn Bhd anda.`,
    `Draft a legally formatted company resolution for internal decisions, approvals, or corporate actions.`,
    `Sediakan resolusi syarikat dalam format sah bagi keputusan dalaman, kelulusan, atau tindakan korporat.`,
    "custom resolution, directors resolution Malaysia, shareholders resolution Malaysia, company resolution template, resolusi pengarah, resolusi syarikat, resolusi pemegang saham",
    `sdnbhd`,
    this.getServiceUri(ServiceNames.customResolution)
  )

  static setFinancialYearEnd: ServiceDirectory = new ServiceDirectory(
    ServiceNames.setFinancialYearEnd.en,
    ServiceNames.setFinancialYearEnd.bm,
    `Set or update your company's Financial Year End (FYE) for statutory compliance.`,
    `Tetapkan atau kemas kini Tahun Kewangan Berakhir (FYE) syarikat anda bagi tujuan pematuhan.`,
    `Define the financial year end used for preparing financial statements and meeting Companies Act 2016 requirements.`,
    `Tentukan tahun kewangan berakhir yang digunakan untuk menyediakan penyata kewangan dan memenuhi keperluan Akta Syarikat 2016.`,
    "financial year end Malaysia, set FYE Malaysia, company financial year end, SSM financial year end, tahun kewangan berakhir, tetapkan FYE",
    `sdnbhd`,
    this.getServiceUri(ServiceNames.setFinancialYearEnd)
  )

  static delegationOfAuthority: ServiceDirectory = new ServiceDirectory(
    ServiceNames.delegationOfAuthority.en,
    ServiceNames.delegationOfAuthority.bm,
    `Authorise and document the delegation of powers within your company.`,
    `Benarkan dan dokumenkan penurunan kuasa dalam syarikat anda.`,
    `Create a formal delegation of authority resolution to assign specific powers or responsibilities.`,
    `Sediakan resolusi penurunan kuasa bagi menetapkan kuasa atau tanggungjawab tertentu.`,
    "delegation of authority Malaysia, board delegation resolution, company authority delegation, penurunan kuasa syarikat, resolusi penurunan kuasa",
    `sdnbhd`,
    this.getServiceUri(ServiceNames.delegationOfAuthority)
  )

  static directories: ServiceDirectory[] = [
    this.applicationIncorporation,
    this.applicationSwitch,
    this.changeOfBusinessName,
    this.changeOfBusinessAddress,
    this.changeOfRegisteredAddress,
    this.changeOfBusinessDescription,
    this.changeOfBusinessBranch,
    this.changeOfConstitution,
    this.appointmentOfDirector,
    this.resignationOfDirector,
    this.allotmentOfShares,
    this.proposedAllotmentOfShares,
    this.transferOfShares,
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
    this.delegationOfAuthority,
  ]
}
