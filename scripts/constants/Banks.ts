import { BankDetails } from "~/scripts/models/BankDetails"

export class BankConstants {
  static UOB_URL = "https://uob.my/oaocosectech"
  // static UOB_URL =
  //   "https://www.uob.com.my/business/transact/online-account-opening.page?stfid=USJZIC&s_cid=bb:my:earned:onl:refprg:na:tx:na:oao:011124-evergreen:icmpny:main_banner:partners&vid=partners"
  static OCBC_CONVENTIONAL_URL =
    "https://openbizaccountmy.ocbc.com/obaoMY/#/start?product=U8&source1=CorpSec&source2=3328PCH"
  static OCBC_ISLAMIC_URL =
    "https://openbizaccountmy.ocbc.com/obaoMY/#/start?product=U9&source1=CorpSec&source2=3328PCH"

  static MAYBANK_DETAIL: BankDetails = new BankDetails({
    id: "f112c274-f545-4596-830b-50e337aa9ed4",
    name: "Maybank",
    bankType: "Conventional & Shariah",
    documentRequired: [
      { type: "document", text: "Statutory Forms" },
      { type: "stamp", text: "Company Chop" },
      { type: "resolution", text: "Board Resolution" },
    ],
    documentRequiredNotes: "",
    requireBranchVisit: true,
    branchVisitReason: "For verification",
    verificationProcess: [{ type: "thumbprint", text: "Thumbprint verification", notes: "" }],
    onlineBanking: {
      days: 1,
      name: "Next Working Day",
      notes: "12 Hours cooling off period",
    },
    digitalServices: [
      { type: "mobile", text: "M2U Biz MY App", link: "" },
      { type: "website", text: "Maybank2u", link: "" },
    ],
    branchesToAvoid: [
      { name: "TTDI (Tun Fuad)", notes: "" },
      { name: "Sentul Raya", notes: "" },
      { name: "Bandar Puteri Puchong", notes: "Not foreigner friendly" },
    ],
    hasMinimumDeposit: true,
    minimumDeposit: 500,
    minimumDepositNotes: "",
    plusPoint: [
      { name: "One of the largest network of branches", notes: "" },
      { name: "More recognisable Digital Banking UIUX", notes: "" },
    ],
    otherNotes: [{ name: "Queue in branch would be longer.", notes: "" }],
    activationTimeline: "1 working day",
    url: "https://www.maybank2u.com.my/maybank2u/malaysia/en/business/index.page",
  })

  static OCBC_BANK_DETAIL: BankDetails = new BankDetails({
    id: "81a1e0d6-b467-4b89-b281-a5e1864962a3",
    name: "OCBC",
    bankType: "Conventional",
    documentRequired: [{ type: "online_form", text: "Online Forms" }],
    documentRequiredNotes: "",
    requireBranchVisit: false,
    branchVisitReason: "",
    verificationProcess: [
      {
        type: "ekyc",
        text: '<span class="tooltip-text" title="Electronic Know Your Customer (eKYC)">eKYC</span> verification',
        notes: "new incorporation only",
      },
    ],
    onlineBanking: {
      days: 1,
      name: "Next Working Day",
      notes: "12 Hours cooling off period",
    },
    digitalServices: [
      { type: "mobile", text: "OCBC Velocity App", link: "" },
      { type: "website", text: "OCBC Velocity", link: "" },
    ],
    branchesToAvoid: [],
    hasMinimumDeposit: true,
    minimumDeposit: 500,
    minimumDepositNotes: "",
    plusPoint: [
      { name: "Easier to manage if you are a single Director/Shareholder", notes: "" },
      { name: "Get a Corporate Debit Card with Bank Account Opening", notes: "" },
    ],
    otherNotes: [
      {
        name: 'Random audit and queries under <span class="tooltip-text" title="Suspicious Transaction Report (STR)">STR</span> and <span class="tooltip-text" title="Know Your Customer (KYC)">KYC</span>',
        notes: "",
      },
    ],
    activationTimeline: "1 working day",
    url: "https://www.ocbc.com.my/business-banking/smes/running-a-business.page",
  })

  static UOB_DETAIL: BankDetails = new BankDetails({
    id: "26701784-5b36-4508-8f46-96019b6b4516",
    name: "UOB",
    bankType: "Conventional",
    documentRequired: [{ type: "online_form", text: "Online Form" }],
    documentRequiredNotes: "Supporting Documents may be requested",
    requireBranchVisit: false,
    branchVisitReason: "",
    verificationProcess: [
      { type: "appointment", text: "Physical Appointment", notes: "A Bank Officer will contact you" },
    ],
    onlineBanking: {
      days: 7,
      name: "Within 7 Working Days",
      notes: "Subject to Bank Officer",
    },
    digitalServices: [
      { type: "mobile", text: "UOB Infinity App", link: "" },
      { type: "website", text: "UOB Infinity", link: "" },
    ],
    branchesToAvoid: [{ name: "Kota Damansara", notes: "" }],
    hasMinimumDeposit: true,
    minimumDeposit: 10000,
    minimumDepositNotes: "Less is possible only if you are already an existing customer",
    plusPoint: [
      {
        name: "Certified True Copy (CTC) Statutory Forms not required unless your Sdn Bhd has a Constitution",
        notes: "",
      },
    ],
    otherNotes: [{ name: "Deduction on remaining balance if minimum is not achieved.", notes: "" }],
    activationTimeline: "Within 7 working days",
    url: "https://www.uob.com.my/business/index.page",
  })

  static CIMB_DETAIL: BankDetails = new BankDetails({
    id: "88abc2dc-9060-4cd9-8b02-f2d037b491bd",
    name: "CIMB",
    bankType: "Conventional & Shariah",
    documentRequired: [
      { type: "document", text: "Statutory Forms" },
      { type: "stamp", text: "Company Chop" },
      { type: "downloadable_form", text: "CIMB Forms" },
    ],
    documentRequiredNotes: "",
    requireBranchVisit: true,
    branchVisitReason: "For signing of forms and verification",
    verificationProcess: [{ type: "thumbprint", text: "Thumbprint verification", notes: "" }],
    onlineBanking: {
      days: 14,
      name: "Within 14 Working Days",
      notes: "Subject to Bank Officer",
    },
    digitalServices: [
      { type: "mobile", text: "Biz Channel Octo App", link: "" },
      { type: "website", text: "CIMB Biz Channel Octo", link: "" },
    ],
    branchesToAvoid: [
      { name: "Plaza Azalea", notes: "" },
      { name: "Jaya One", notes: "" },
      { name: "Kluang", notes: "" },
      { name: "Jalan Mahsuri, Bayan Baru", notes: "" },
    ],
    hasMinimumDeposit: true,
    minimumDeposit: 3000,
    minimumDepositNotes: "",
    plusPoint: [
      { name: "One of the largest network of branches", notes: "" },
      { name: "Bank Account Number is possibly the shortest", notes: "" },
    ],
    otherNotes: [],
    activationTimeline: "Within 14 working days",
    url: "https://www.cimb.com.my/en/business/home.html",
  })

  static AFFIN_BANK_DETAIL: BankDetails = new BankDetails({
    id: "6e7c5542-1d5f-42be-872c-3a8bfe2b4c16",
    name: "Affin",
    bankType: "Conventional",
    documentRequired: [
      { type: "document", text: "Statutory Forms" },
      { type: "stamp", text: "Company Chop" },
      { type: "resolution", text: "Board Resolution" },
      { type: "downloadable_form", text: "AffinMax Form" },
    ],
    documentRequiredNotes: "",
    requireBranchVisit: true,
    branchVisitReason: "For signing of forms and verification",
    verificationProcess: [{ type: "thumbprint", text: "Thumbprint verification", notes: "" }],
    onlineBanking: {
      days: 21,
      name: "Within 7-21 Working Days",
      notes: "Subject to Bank Officer",
    },
    digitalServices: [
      { type: "mobile", text: "AFFINMAXMobile", link: "" },
      { type: "website", text: "Affin Online", link: "" },
    ],
    branchesToAvoid: [{ name: "Ipoh", notes: "" }],
    hasMinimumDeposit: false,
    minimumDeposit: 0,
    minimumDepositNotes: "Based on Branch & Bank Officer",
    plusPoint: [{ name: "Able to choose Device Token or Digital Token for approval of transaction", notes: "" }],
    otherNotes: [
      { name: "AFFINMAX is improving", notes: "" },
      { name: "Checker and Maker cannot be the same person", notes: "" },
    ],
    activationTimeline: "Within 7-21 working days",
    url: "https://www.affinalways.com/en/homepage",
  })

  static PUBLIC_BANK_DETAIL: BankDetails = new BankDetails({
    id: "c13432d5-cd1a-4288-ae16-fac660617a0e",
    name: "Public Bank",
    bankType: "Conventional",
    documentRequired: [
      { type: "document", text: "Statutory Forms" },
      { type: "address", text: "Business Address" },
      { type: "bill", text: "Utility Bill" },
      { type: "introducer", text: "Introducer's reference letter" },
    ],
    documentRequiredNotes: "",
    requireBranchVisit: true,
    branchVisitReason: "For signing of forms and verification",
    verificationProcess: [{ type: "thumbprint", text: "Thumbprint verification", notes: "" }],
    onlineBanking: {
      days: 7,
      name: "Within 7 Working Days",
      notes: "Subject to Bank Officer",
    },
    digitalServices: [
      { type: "mobile", text: "PBe App", link: "" },
      { type: "website", text: "PBe", link: "" },
    ],
    branchesToAvoid: [
      { name: "Sea Park", notes: "" },
      { name: "Taman Perling", notes: "" },
      { name: "Taman Malim Jaya", notes: "" },
      { name: "Nilai", notes: "" },
    ],
    hasMinimumDeposit: true,
    minimumDeposit: 500,
    minimumDepositNotes: "RM500 for Basic Current Account, RM3,000 for Plus Current Account-i",
    plusPoint: [],
    otherNotes: [{ name: "Introducer required in some situation.", notes: "" }],
    activationTimeline: "Within 7 working days",
    url: "https://www.pbenterprise.com/",
  })

  static MUAMALAT_DETAIL: BankDetails = new BankDetails({
    id: "1a51cb14-c6dd-4b01-bb0d-fef8be3662e7",
    name: "Bank Muamalat",
    bankType: "Islamic",
    documentRequired: [
      { type: "document", text: "Statutory Forms" },
      { type: "document", text: "Company Profile" },
      { type: "stamp", text: "Company Chop" },
    ],
    documentRequiredNotes: "",
    requireBranchVisit: true,
    branchVisitReason: "For signing of forms and verification",
    verificationProcess: [{ type: "thumbprint", text: "Thumbprint verification", notes: "" }],
    onlineBanking: {
      days: 7,
      name: "Within 7 Working Days",
      notes: "Subject to Bank Officer",
    },
    digitalServices: [{ type: "website", text: "iBiz Muamalat", link: "" }],
    branchesToAvoid: [],
    hasMinimumDeposit: true,
    minimumDeposit: 500,
    minimumDepositNotes: "",
    plusPoint: [],
    otherNotes: [{ name: "May only open Business Account with a Bank Officer", notes: "" }],
    activationTimeline: "Within 7 working days",
    url: "https://www.muamalat.com.my/banking/business/current-account-i/",
  })

  static RHB_BANK_DETAIL: BankDetails = new BankDetails({
    id: "f4c84e80-e26e-4b4b-9d5f-4827037238f3",
    name: "RHB",
    bankType: "Conventional",
    documentRequired: [
      { type: "document", text: "Statutory Forms" },
      { type: "stamp", text: "Company Chop" },
      { type: "resolution", text: "Board Resolution" },
      { type: "form", text: "RHB Form" },
      { type: "introducer", text: "Introducer's reference letter" },
    ],
    documentRequiredNotes: "",
    requireBranchVisit: true,
    branchVisitReason: "For signing of forms and verification",
    verificationProcess: [
      {
        type: "thumbprint",
        text: "Thumbprint verification",
        notes: "Bank officer will contacts Co. Secretary for board resolution verification.",
      },
    ],
    onlineBanking: {
      days: 14,
      name: "Within 14 Working Days",
      notes: "Subject to Bank Officer",
    },
    digitalServices: [
      { type: "mobile", text: "RHB Reflex App", link: "" },
      { type: "website", text: "RHB Reflex", link: "" },
    ],
    branchesToAvoid: [],
    hasMinimumDeposit: true,
    minimumDeposit: 3000,
    minimumDepositNotes: "",
    plusPoint: [],
    otherNotes: [
      { name: "Complicated login, access, and roles", notes: "" },
      { name: "Checker and Maker can be the same person", notes: "" },
    ],
    activationTimeline: "Within 14 working days",
    url: "https://www.rhbgroup.com/overview/business/index.html",
  })

  static HONG_LEONG_BANK_DETAIL: BankDetails = new BankDetails({
    id: "3a81958c-b458-467f-a7a4-dc0e1c348ccf",
    name: "Hong Leong Bank",
    bankType: "Conventional",
    documentRequired: [
      { type: "document", text: "Statutory Forms" },
      { type: "stamp", text: "Company Chop" },
      { type: "resolution", text: "Board Resolution" },
      { type: "downloadable_form", text: "HLB Forms" },
    ],
    documentRequiredNotes: "",
    requireBranchVisit: true,
    branchVisitReason: "For signing of forms and verification",
    verificationProcess: [{ type: "thumbprint", text: "Thumbprint verification", notes: "" }],
    onlineBanking: {
      days: 7,
      name: "Within 3-7 Working Days",
      notes: "Subject to Bank Officer",
    },
    digitalServices: [{ type: "website", text: "HLB ConnectFirst", link: "" }],
    branchesToAvoid: [],
    hasMinimumDeposit: false,
    minimumDeposit: 0,
    minimumDepositNotes: "Subject to Bank Officer",
    plusPoint: [{ name: "Online Banking is rapidly improving", notes: "" }],
    otherNotes: [],
    activationTimeline: "Within 3-7 working days",
    url: "https://www.hlb.com.my/en/business-banking/home.html?icp=hlb-en-home-header-txt-bcb-segment",
  })

  static STANDARD_CHARTERED_DETAIL: BankDetails = new BankDetails({
    id: "080b07b5-2e74-4e37-9f97-5e50d66de88a",
    name: "Standard Chartered",
    bankType: "Conventional",
    documentRequired: [],
    documentRequiredNotes: "",
    requireBranchVisit: false,
    branchVisitReason: "",
    verificationProcess: [],
    onlineBanking: { days: 0, name: "", notes: "" },
    digitalServices: [],
    branchesToAvoid: [],
    hasMinimumDeposit: false,
    minimumDeposit: 0,
    minimumDepositNotes: "",
    plusPoint: [],
    otherNotes: [],
    activationTimeline: "",
    url: "https://www.sc.com/my/business-banking/",
  })

  static AMBANK_DETAIL: BankDetails = new BankDetails({
    id: "99e1aefe-e4eb-4b29-b195-dfa03de32157",
    name: "AmBank",
    bankType: "Conventional",
    documentRequired: [],
    documentRequiredNotes: "",
    requireBranchVisit: false,
    branchVisitReason: "",
    verificationProcess: [],
    onlineBanking: { days: 0, name: "", notes: "" },
    digitalServices: [],
    branchesToAvoid: [],
    hasMinimumDeposit: false,
    minimumDeposit: 0,
    minimumDepositNotes: "",
    plusPoint: [],
    otherNotes: [],
    activationTimeline: "",
    url: "https://www.ambank.com.my/small-medium-enterprise",
  })

  static AGROBANK_DETAIL: BankDetails = new BankDetails({
    id: "d82aeab0-8510-432a-8d65-fff58b5e42a9",
    name: "Agro Bank",
    bankType: "Conventional",
    documentRequired: [],
    documentRequiredNotes: "",
    requireBranchVisit: false,
    branchVisitReason: "",
    verificationProcess: [],
    onlineBanking: { days: 0, name: "", notes: "" },
    digitalServices: [],
    branchesToAvoid: [],
    hasMinimumDeposit: false,
    minimumDeposit: 0,
    minimumDepositNotes: "",
    plusPoint: [],
    otherNotes: [],
    activationTimeline: "",
    url: "https://www.agrobank.com.my/",
  })

  static ALLIANCE_BANK_DETAIL: BankDetails = new BankDetails({
    id: "42700ec6-cf21-4a85-82d1-3a0be45f75a6",
    name: "Alliance",
    bankType: "Conventional",
    documentRequired: [],
    documentRequiredNotes: "",
    requireBranchVisit: false,
    branchVisitReason: "",
    verificationProcess: [],
    onlineBanking: { days: 0, name: "", notes: "" },
    digitalServices: [],
    branchesToAvoid: [],
    hasMinimumDeposit: false,
    minimumDeposit: 0,
    minimumDepositNotes: "",
    plusPoint: [],
    otherNotes: [],
    activationTimeline: "",
    url: "https://www.alliancebank.com.my/Business",
  })

  static BANK_ISLAM_DETAIL: BankDetails = new BankDetails({
    id: "7ccda4e9-d883-45bc-be47-6c62ac034065",
    name: "Bank Islam",
    bankType: "Islamic",
    documentRequired: [],
    documentRequiredNotes: "",
    requireBranchVisit: false,
    branchVisitReason: "",
    verificationProcess: [],
    onlineBanking: { days: 0, name: "", notes: "" },
    digitalServices: [],
    branchesToAvoid: [],
    hasMinimumDeposit: false,
    minimumDeposit: 0,
    minimumDepositNotes: "",
    plusPoint: [],
    otherNotes: [],
    activationTimeline: "",
    url: "https://www.bankislam.com/business-banking/corporate-banking/",
  })

  static MBSB_DETAIL: BankDetails = new BankDetails({
    id: "8174d9f1-f9f9-4e7e-a844-9ef4bbac221b",
    name: "MBSB",
    bankType: "Conventional",
    documentRequired: [],
    documentRequiredNotes: "",
    requireBranchVisit: false,
    branchVisitReason: "",
    verificationProcess: [],
    onlineBanking: { days: 0, name: "", notes: "" },
    digitalServices: [],
    branchesToAvoid: [],
    hasMinimumDeposit: false,
    minimumDeposit: 0,
    minimumDepositNotes: "",
    plusPoint: [],
    otherNotes: [],
    activationTimeline: "",
    url: "https://www.mbsbbank.com/consumer-banking/deposit/current-account-i",
  })

  static HSBC_DETAIL: BankDetails = new BankDetails({
    id: "6bf9f067-001f-4842-b16f-03e07f2a7ce1",
    name: "HSBC",
    bankType: "Conventional",
    documentRequired: [],
    documentRequiredNotes: "",
    requireBranchVisit: false,
    branchVisitReason: "",
    verificationProcess: [],
    onlineBanking: { days: 0, name: "", notes: "" },
    digitalServices: [],
    branchesToAvoid: [],
    hasMinimumDeposit: false,
    minimumDeposit: 0,
    minimumDepositNotes: "",
    plusPoint: [],
    otherNotes: [],
    activationTimeline: "",
    url: "https://www.business.hsbc.com.my/en-gb",
  })

  static BANK_RAKYAT_DETAIL: BankDetails = new BankDetails({
    id: "2e207ea6-8e82-4128-a6b3-399df898c3c4",
    name: "Bank Rakyat",
    bankType: "Conventional",
    documentRequired: [],
    documentRequiredNotes: "",
    requireBranchVisit: false,
    branchVisitReason: "",
    verificationProcess: [],
    onlineBanking: { days: 0, name: "", notes: "" },
    digitalServices: [],
    branchesToAvoid: [],
    hasMinimumDeposit: false,
    minimumDeposit: 0,
    minimumDepositNotes: "",
    plusPoint: [],
    otherNotes: [],
    activationTimeline: "",
    url: "https://www.bankrakyat.com.my/",
  })

  static CDS_TRADING_DETAIL: BankDetails = new BankDetails({
    id: "affc3799-744d-4961-8190-dc686a3aeaf7",
    bankType: "Conventional",
    documentRequired: [],
    documentRequiredNotes: "",
    requireBranchVisit: false,
    branchVisitReason: "",
    verificationProcess: [],
    onlineBanking: { days: 0, name: "", notes: "" },
    digitalServices: [],
    branchesToAvoid: [],
    hasMinimumDeposit: false,
    minimumDeposit: 0,
    minimumDepositNotes: "",
    plusPoint: [],
    otherNotes: [],
    activationTimeline: "",
    url: "https://www.bursamalaysia.com/bm/trade/trading_resources/listing_directory/company-profile?stock_code=5258",
  })

  static BANK_DETAIL_LIST: Array<BankDetails> = [
    this.MAYBANK_DETAIL,
    this.OCBC_BANK_DETAIL,
    this.UOB_DETAIL,
    this.CIMB_DETAIL,
    this.AFFIN_BANK_DETAIL,
    this.PUBLIC_BANK_DETAIL,
    this.MUAMALAT_DETAIL,
    this.RHB_BANK_DETAIL,
    this.HONG_LEONG_BANK_DETAIL,
    this.STANDARD_CHARTERED_DETAIL,
    this.AMBANK_DETAIL,
    this.AGROBANK_DETAIL,
    this.ALLIANCE_BANK_DETAIL,
    this.BANK_ISLAM_DETAIL,
    this.HSBC_DETAIL,
    this.MBSB_DETAIL,
    this.BANK_RAKYAT_DETAIL,
    this.CDS_TRADING_DETAIL,
  ]

  static getBankDetailsById(bankId: string): BankDetails {
    const matchBank = this.BANK_DETAIL_LIST.find((bankDetails) => {
      return bankDetails.id === bankId
    })

    if (matchBank) {
      return matchBank
    }

    return new BankDetails()
  }
}
