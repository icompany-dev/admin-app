import { BankConstants } from "./Banks"
import { BankDetail } from "../types/banks/BankDetail"

export enum BankOpeningAdditionalRequirements {
  ExtractDcr = "extract-dcr",
  NoConstitutionDeclaration = "no-constitution-declaration",
  RubberStamp = "rubber-stamp",
  CorporateProfile = "corporate-profile",
}

export class BankDetailsConstants {
  static getBankDefaultRequirement(bankName: string, url: string): string {
    return `<div class="requirement-title">
        General Bank Requirements:
      </div>
      <p>
        Please visit
        <a href="${url}" target="_blank" class="text-blue text-decoration-none">${bankName} Official Website</a>
        to learn more on the requirements and package provided by the bank.
      </p>
      <span>
        The contents do not constitute financial advice. Please conduct your own research before making a
        financial decision.
      </span>`
  }

  static MAYBANK = new BankDetail({
    id: BankConstants.MAYBANK_DETAIL.id,
    requirements: `
    <div class="requirement-title">
        General Bank Requirements:
      </div>
      <ul>
        <li>
          <div class="list-content">
            Initial deposit of minimum RM2,000
          </div>
          <div class="list-notes">
            (lower amount subject to your existing banking relationship)
          </div>
        </li>
        <li>
          <div class="list-content">
            Designated role of at least one Checker
          </div>
          <div class="list-notes">
            (with a valid Malaysian mobile number)
          </div>
        </li>
        <li>
          <div class="list-content">
            Designated role of at least one Maker
          </div>
          <div class="list-notes">
            (with a valid Malaysian mobile number)
          </div>
          </li>
        </ul>
        <div>
          Find out about other banks? Comparison <span class="bank-comparison-link-trigger">here</span>.
        <div>
      `,
    forDirectors: `<div class="requirement-title">
        For Directors of this Sdn Bhd:
      </div>
      <ul>
        <li>
          <div class="list-content">
            All Directors must visit a branch
          </div>
          <div class="list-notes">
            (bring together original MyKad / Passport for KYC & Verification purposes)
          </div>
        </li>

        <li>
          <div class="list-content">
            Bring the iCompany Folder delivered to you
          </div>
          <div class="list-notes">
            (contains all the required Statutory Documents)
          </div>
        </li>

        <li>
          <div class="list-content">
            Bring the Company Rubber Stamp / Company Chop
          </div>
          <div class="list-notes">
            (if you do not order with us, please ensure it is rounded without a Business Address)
          </div>
        </li>

        <li>
          <div class="list-content">
            Bring all other Supporting Documents (send to us prior if require to CTC)
          </div>
          <div class="list-notes">
            (if you are non-Malaysians, please bring your valid working permit)
          </div>
        </li>
      </ul>`,
    additionalNotes: `
      <div>
        The Bank reserves their right to refuse or reject your Application for any reasonable reasons. Our rights under the law are also reserved.
        <br>
        <br>
        No refunds, replacements, or extensions to rectify any resolutions or any parts of the documents shall be granted, as expenses and costs have already been incurred once you completed this Application.
        <br>
        <br>
        Should you encounter any unsatisfactory experience during the bank account opening process, a feedback survey will be made available at the end of this Application. 
        <br>
        <br>
        We would appreciate your assistance in completing the survey to enable us to engage with the bank and continuously improve the banking experience in the future.
      </div>`,
  })

  static OCBC_BANK = new BankDetail({
    // Online
    id: BankConstants.OCBC_BANK_DETAIL.id,
    requirements: this.getBankDefaultRequirement("OCBC Bank", BankConstants.OCBC_BANK_DETAIL.url),
    forDirectors: ``,
    additionalNotes: ``,
  })

  static AFFIN_BANK = new BankDetail({
    id: BankConstants.AFFIN_BANK_DETAIL.id,
    requirements: `<div class="requirement-title">
        General Bank Requirements:
    </div>
    <p>
        General requirements to open a Corporate Bank Account with Affin Bank are as follows
      </p>
      <ul>
        <li>
          A valid Sdn Bhd Business Address displayed in SSM Corporate Profile;
        </li>
        <li>
          A company chop / company stamp;
        </li>
        <li>
          A readable NRICs as all the directors need to walk in to the designated Affin Bank Branch;
        </li>
        <li>
          A minimum initial deposit from RM500 to RM2,000 depending on the type of account you choose;
        </li>
        <li>
          Certified Documents for Bank Account Opening prepared by iCompany to be provided to the Bank Officers;
        </li>
        <li>
          For Digital Bank Access or Online Banking, at least one person with valid
          Malaysian Mobile Number to act as "System Administrator" and at least one
          person with valid Malaysian Mobile Number to act as "System Approver". For
          this purpose, no requirement that those persons must be a director of the Sdn
          Bhd.
        </li>
      </ul>`,
    forDirectors: ``,
    additionalNotes: `<div class="requirement-title">
        Timeline
      </div>
      <p>
        Depending on Bank Officer, Bank Branch, Bank Account Type and Your Sdn Bhd set
        up, the Bank Account Opening can be activated <b>between 3 - 14 days</b>.
      </p>

      <p>
        Please note that a Bank Account Number may be obtained within a day but the
        digital activation requires at least 12 hours after the initial deposit.
      </p>

      <span>
        The contents do not constitute financial advice. Please conduct your own research before making a
        financial decision.
      </span>`,
  })

  static CIMB = new BankDetail({
    id: BankConstants.CIMB_DETAIL.id,
    requirements: `<p>
      General requirements to open a Corporate Bank Account with CIMB bank are as follows
    </p>
    <ul>
      <li>
        A valid Sdn Bhd Business Address displayed in SSM Corporate Profile;
      </li>
      <li>
        A company chop / company stamp;
      </li>
      <li>
        A readable NRICs of all Authorised Signatories who need to be present at the designated CIMB Bank Branch;
      </li>
      <li>
        A minimum initial deposit from RM3,000;
      </li>
      <li>
        Certified Documents for Bank Account Opening prepared by iCompany to be provided to the Bank Officers;
      </li>
      <li>
        For Digital Bank Access or Online Banking, at least one person with valid
        Malaysian Mobile Number to act as the Authorised Person for the Digital
        Banking. For this purpose, no requirement that those persons must be a director
        of the Sdn Bhd but must be present at the chosen CIMB Branch.
      </li>
      <li>
        Download the CIMB Bank Business Account Application Form*
        <a href="https://www.cimb.com.my/en/business/solutions-products/deposit-investments/current-account/online-business-current-account.html" target="_blank" class="text-decoration-none text-blue fw-bold">here</a>
        or ask a copy from any CIMB Bank Officer at your nearest branch.
        <div>
          .*to be completed by you to bring together with your Company Chop/Company Rubber Stamp and
          Certified Documents for Bank Account Opening from iCompany.
        </div>
      </li>
    </ul>`,
    forDirectors: ``,
    additionalNotes: `<div class="requirement-title">
        Timeline
      </div>
    <p>
      Depending on Bank Officer, Bank Branch, Bank Account Type and Your Sdn Bhd set
      up, the Bank Account Opening can be activated <b>between 1 - 14 days</b>.
    </p>

    <p>
      Please note that a Bank Account Number may be obtained within a day but the
      digital activation requires at least 12 hours after the initial deposit.
    </p>

    <span>
      The contents do not constitute financial advice. Please conduct your own research before making a
      financial decision.
    </span>`,
  })

  static STANDARD_CHARTERED = new BankDetail({
    id: BankConstants.STANDARD_CHARTERED_DETAIL.id,
    requirements: `
      <div class="requirement-title">
        General Bank Requirements:
      </div>
      <ul>
        <li>
          <div class="list-content">
            Minimum Deposit: RM5,000
          </div>
        </li>
        <li>
          <div class="list-content">
            Designated role of at least one Checker
          </div>
        </li>
        <li>
          <div class="list-content">
            Designated role of at least one Maker
          </div>
          <div class="list-notes">
            (Checker and maker Can be the same person)
          </div>
          </li>
        </ul>
    `,
    forDirectors: `<div class="requirement-title">
        For Directors of this Sdn Bhd:
      </div>
      <ul>
        <li>
          <div class="list-content">
            All Directors must visit a branch
          </div>
          <div class="list-notes">
            (bring together original MyKad / Passport for KYC & Verification purposes)
          </div>
        </li>

        <li>
          <div class="list-content">
            Bring the iCompany Folder delivered to you
          </div>
          <div class="list-notes">
            (contains all the required Statutory Documents)
          </div>
        </li>
      </ul>`,
    additionalNotes: "",
  })

  static AMBANK = new BankDetail({
    id: BankConstants.AMBANK_DETAIL.id,
    requirements: `
      <div class="requirement-title">
        General Bank Requirements:
      </div>
      <ul>
        <li>
          <div class="list-content">
            Minimum Deposit: RM500
          </div>
        </li>
        <li>
          <div class="list-content">
            Designated role of at least one Checker
          </div>
        </li>
        <li>
          <div class="list-content">
            Designated role of at least one Maker
          </div>
          <div class="list-notes">
            (Checker and maker Can be the same person)
          </div>
          </li>
        </ul>
    `,
    forDirectors: `<div class="requirement-title">
        For Directors of this Sdn Bhd:
      </div>
      <ul>
        <li>
          <div class="list-content">
            All Directors must visit a branch
          </div>
          <div class="list-notes">
            (bring together original MyKad / Passport for KYC & Verification purposes)
          </div>
        </li>

        <li>
          <div class="list-content">
            Bring the iCompany Folder delivered to you
          </div>
          <div class="list-notes">
            (contains all the required Statutory Documents)
          </div>
        </li>
      </ul>`,
    additionalNotes: ``,
  })

  static AGROBANK = new BankDetail({
    id: BankConstants.AGROBANK_DETAIL.id,
    requirements: this.getBankDefaultRequirement("Agrobank", BankConstants.AGROBANK_DETAIL.url),
    forDirectors: ``,
    additionalNotes: ``,
  })

  static MUAMALAT = new BankDetail({
    id: BankConstants.MUAMALAT_DETAIL.id,
    requirements: `
      <div class="requirement-title">
        General Bank Requirements:
      </div>
      <ul>
        <li>
          <div class="list-content">
            Minimum Deposit: RM500
          </div>
        </li>
        <li>
          <div class="list-content">
            Designated role of at least one Checker
          </div>
        </li>
        <li>
          <div class="list-content">
            Designated role of at least one Maker
          </div>
          <div class="list-notes">
            (Checker and maker Can be the same person)
          </div>
        </li>
        <li>
          <div class="list-content">
            Introducer is Required.
          </div>
        </li>
      </ul>
    `,
    forDirectors: `<div class="requirement-title">
        For Directors of this Sdn Bhd:
      </div>
      <ul>
        <li>
          <div class="list-content">
            All Directors must visit a branch
          </div>
          <div class="list-notes">
            (bring together original MyKad / Passport for KYC & Verification purposes)
          </div>
        </li>

        <li>
          <div class="list-content">
            Bring the iCompany Folder delivered to you
          </div>
          <div class="list-notes">
            (contains all the required Statutory Documents)
          </div>
        </li>
      </ul>`,
    additionalNotes: ``,
  })

  static ALLIANCE_BANK = new BankDetail({
    id: BankConstants.ALLIANCE_BANK_DETAIL.id,
    requirements: `
      <div class="requirement-title">
        General Bank Requirements:
      </div>
      <ul>
        <li>
          <div class="list-content">
            Minimum Deposit: RM500
          </div>
        </li>
        <li>
          <div class="list-content">
            Designated role of at least one Checker
          </div>
        </li>
        <li>
          <div class="list-content">
            Designated role of at least one Maker
          </div>
          <div class="list-notes">
            (Checker and maker Can be the same person)
          </div>
        </li>
      </ul>
    `,
    forDirectors: `<div class="requirement-title">
        For Directors of this Sdn Bhd:
      </div>
      <ul>
        <li>
          <div class="list-content">
            All Directors must visit a branch
          </div>
          <div class="list-notes">
            (bring together original MyKad / Passport for KYC & Verification purposes)
          </div>
        </li>

        <li>
          <div class="list-content">
            Bring the iCompany Folder delivered to you
          </div>
          <div class="list-notes">
            (contains all the required Statutory Documents)
          </div>
        </li>
      </ul>`,
    additionalNotes: ``,
  })

  static PUBLIC_BANK = new BankDetail({
    id: BankConstants.PUBLIC_BANK_DETAIL.id,
    requirements: `
      <div class="requirement-title">
        General Bank Requirements:
      </div>
      <ul>
        <li>
          <div class="list-content">
            Minimum Deposit: RM5,000
          </div>
        </li>
        <li>
          <div class="list-content">
            Designated role of at least one Checker
          </div>
        </li>
        <li>
          <div class="list-content">
            Designated role of at least one Maker
          </div>
          <div class="list-notes">
            (Checker and maker Can be the same person)
          </div>
        </li>
        <li>
          <div class="list-content">
            Introducer is Required.
          </div>
        </li>
      </ul>
    `,
    forDirectors: `<div class="requirement-title">
        For Directors of this Sdn Bhd:
      </div>
      <ul>
        <li>
          <div class="list-content">
            All Directors must visit a branch
          </div>
          <div class="list-notes">
            (bring together original MyKad / Passport for KYC & Verification purposes)
          </div>
        </li>

        <li>
          <div class="list-content">
            Bring the iCompany Folder delivered to you
          </div>
          <div class="list-notes">
            (contains all the required Statutory Documents)
          </div>
        </li>
      </ul>`,
    additionalNotes: ``,
  })

  static UOB = new BankDetail({
    // Online
    id: BankConstants.UOB_DETAIL.id,
    requirements: this.getBankDefaultRequirement("UOB", BankConstants.UOB_DETAIL.url),
    forDirectors: ``,
    additionalNotes: ``,
  })

  static MBSB = new BankDetail({
    // TODO
    id: BankConstants.MBSB_DETAIL.id,
    requirements: this.getBankDefaultRequirement("MBSB Bank", BankConstants.MBSB_DETAIL.url),
    forDirectors: ``,
    additionalNotes: ``,
  })

  static BANK_ISLAM = new BankDetail({
    id: BankConstants.BANK_ISLAM_DETAIL.id,
    requirements: `
      <div class="requirement-title">
        General Bank Requirements:
      </div>
      <ul>
        <li>
          <div class="list-content">
            Minimum Deposit: RM500 to RM1,000
          </div>
        </li>
        <li>
          <div class="list-content">
            Designated role of at least one Checker
          </div>
        </li>
        <li>
          <div class="list-content">
            Designated role of at least one Maker
          </div>
          <div class="list-notes">
            (Checker and maker Can be the same person)
          </div>
          </li>
        </ul>
    `,
    forDirectors: `<div class="requirement-title">
        For Directors of this Sdn Bhd:
      </div>
      <ul>
        <li>
          <div class="list-content">
            All Directors must visit a branch
          </div>
          <div class="list-notes">
            (bring together original MyKad / Passport for KYC & Verification purposes)
          </div>
        </li>

        <li>
          <div class="list-content">
            Bring the iCompany Folder delivered to you
          </div>
          <div class="list-notes">
            (contains all the required Statutory Documents)
          </div>
        </li>
      </ul>`,
    additionalNotes: ``,
  })

  static HSBC = new BankDetail({
    id: BankConstants.HSBC_DETAIL.id,
    requirements: `
      <div class="requirement-title">
        General Bank Requirements:
      </div>
      <ul>
        <li>
          <div class="list-content">
            Minimum Business Turnover: RM225 million
          </div>
        </li>
        <li>
          <div class="list-content">
            Designated role of at least one Checker
          </div>
        </li>
        <li>
          <div class="list-content">
            Designated role of at least one Maker
          </div>
          <div class="list-notes">
            (Checker and maker Can be the same person)
          </div>
          </li>
        </ul>
    `,
    forDirectors: `<div class="requirement-title">
        For Directors of this Sdn Bhd:
      </div>
      <ul>
        <li>
          <div class="list-content">
            All Directors must visit a branch
          </div>
          <div class="list-notes">
            (bring together original MyKad / Passport for KYC & Verification purposes)
          </div>
        </li>

        <li>
          <div class="list-content">
            Bring the iCompany Folder delivered to you
          </div>
          <div class="list-notes">
            (contains all the required Statutory Documents)
          </div>
        </li>
      </ul>`,
    additionalNotes: ``,
  })

  static HONG_LEONG_BANK = new BankDetail({
    id: BankConstants.HONG_LEONG_BANK_DETAIL.id,
    requirements: `
      <div class="requirement-title">
        General Bank Requirements:
      </div>
      <ul>
        <li>
          <div class="list-content">
            Minimum Deposit: RM500
          </div>
        </li>
        <li>
          <div class="list-content">
            Designated role of at least one Checker
          </div>
        </li>
        <li>
          <div class="list-content">
            Designated role of at least one Maker
          </div>
          <div class="list-notes">
            (Checker and maker Can be the same person)
          </div>
          </li>
        </ul>
    `,
    forDirectors: `<div class="requirement-title">
        For Directors of this Sdn Bhd:
      </div>
      <ul>
        <li>
          <div class="list-content">
            All Directors must visit a branch
          </div>
          <div class="list-notes">
            (bring together original MyKad / Passport for KYC & Verification purposes)
          </div>
        </li>

        <li>
          <div class="list-content">
            Bring the iCompany Folder delivered to you
          </div>
          <div class="list-notes">
            (contains all the required Statutory Documents)
          </div>
        </li>

        <li>
          <div class="list-content">
            Additional Application Form will be given to you at the branch.
          </div>
          <div class="list-notes">
            (Additional Application will be provided by banker)
          </div>
        </li>
      </ul>`,
    additionalNotes: ``,
  })

  static RHB_BANK = new BankDetail({
    id: BankConstants.RHB_BANK_DETAIL.id,
    requirements: `
      <div class="requirement-title">
        General Bank Requirements:
      </div>
      <ul>
        <li>
          <div class="list-content">
            Minimum Deposit: RM3,000
          </div>
        </li>
        <li>
          <div class="list-content">
            Designated role of at least one Checker
          </div>
        </li>
        <li>
          <div class="list-content">
            Designated role of at least one Maker
          </div>
          <div class="list-notes">
            (Checker and maker Can be the same person)
          </div>
          </li>
        </ul>
    `,
    forDirectors: `<div class="requirement-title">
        For Directors of this Sdn Bhd:
      </div>
      <ul>
        <li>
          <div class="list-content">
            All Directors must visit a branch
          </div>
          <div class="list-notes">
            (bring together original MyKad / Passport for KYC & Verification purposes)
          </div>
        </li>

        <li>
          <div class="list-content">
            Bring the iCompany Folder delivered to you
          </div>
          <div class="list-notes">
            (contains all the required Statutory Documents)
          </div>
        </li>
      </ul>`,
    additionalNotes: ``,
  })

  static BANK_RAKYAT = new BankDetail({
    id: BankConstants.BANK_RAKYAT_DETAIL.id,
    requirements: `
      <div class="requirement-title">
        General Bank Requirements:
      </div>
      <ul>
        <li>
          <div class="list-content">
            Minimum Deposit: RM1,000
          </div>
        </li>
        <li>
          <div class="list-content">
            Designated role of at least one Checker
          </div>
        </li>
        <li>
          <div class="list-content">
            Designated role of at least one Maker
          </div>
          <div class="list-notes">
            (Checker and maker Can be the same person)
          </div>
          </li>
        </ul>
    `,
    forDirectors: `<div class="requirement-title">
        For Directors of this Sdn Bhd:
      </div>
      <ul>
        <li>
          <div class="list-content">
            All Directors must visit a branch
          </div>
          <div class="list-notes">
            (bring together original MyKad / Passport for KYC & Verification purposes)
          </div>
        </li>

        <li>
          <div class="list-content">
            Bring the iCompany Folder delivered to you
          </div>
          <div class="list-notes">
            (contains all the required Statutory Documents)
          </div>
        </li>
      </ul>`,
    additionalNotes: ``,
  })

  static CDS_TRADING = new BankDetail({
    id: BankConstants.CDS_TRADING_DETAIL.id,
    requirements: this.getBankDefaultRequirement("BURSA Malaysia", BankConstants.CDS_TRADING_DETAIL.url),
    forDirectors: ``,
    additionalNotes: ``,
  })

  static BANK_DETAIL_LIST: Array<BankDetail> = [
    this.MAYBANK,
    this.OCBC_BANK,
    this.AFFIN_BANK,
    this.CIMB,
    this.STANDARD_CHARTERED,
    this.AMBANK,
    this.AGROBANK,
    this.MUAMALAT,
    this.ALLIANCE_BANK,
    this.PUBLIC_BANK,
    this.UOB,
    this.BANK_ISLAM,
    this.HSBC,
    this.HONG_LEONG_BANK,
    this.RHB_BANK,
    this.MBSB,
    this.BANK_RAKYAT,
    this.CDS_TRADING,
  ]
}
