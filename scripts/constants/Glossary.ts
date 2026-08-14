import { Glossary } from "~/scripts/models/Glossary"

export class GlossaryConstants {
  static glossaryLink(target: string, text: string): string {
    return `<span class="glossary-link" data-target="${target}">${text}</span>`
  }

  static alternativeDirector = new Glossary({
    id: "alternative-director",
    number: 0,
    keywords: "alternate director",
    items: [
      {
        language: "en",
        title: "ALTERNATE DIRECTOR",
        summary: `An alternate director is a person appointed to act in place of a director when the de facto
        appointed director is unable to perform his duties, such as being absent from Malaysia for a
        prolonged period. The appointment is usually temporary and subject to the company’s
        constitution or board of directors' approval.`,
        description: `<b>What's Important</b>
        <br>
        An alternate director steps into the shoes of the de facto director, attending board meetings,
        voting, and exercising the powers of a director during the period of appointment. However,
        the alternate director’s authority is limited to representing the interests of the director who
        nominated them. Suitable for a parent to children transition in a family-owned business.
        <br><br>
        <b>Why it Matters</b>
        <br>
        The role ensures continuity in decision-making and governance when a director cannot be
        physically present. For companies with directors who travel frequently or reside overseas or
        whatever the reason may be, alternate directors help maintain compliance with statutory
        requirements and avoid delays in board approvals. They safeguard the company from
        governance gaps that might otherwise arise from absenteeism.
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        While the Companies Act 2016 does not provide a detailed definition of alternate directors,
        Section 210 allows for the appointment of alternate or substitute directors if permitted by the
        company’s constitution. The Act recognises their role and responsibilities as being equivalent
        to those of any director during the period they hold office.
        <br><br>
        <b>Exceptions</b>
        <br>
        An alternate director can only be appointed if the company’s constitution expressly allows it.
        Their powers end automatically when the original (de facto) director vacates office, returns
        from absence, or if the board or members revoke the appointment. Importantly, the alternate
        director is subject to the same fiduciary duties and liabilities as an ordinary de facto director
        under the Companies Act 2016, even though their position is temporary.`,
      },
    ],
  })

  static auditedFinancialStatement = new Glossary({
    id: "audited-financial-statement",
    number: 1,
    keywords: "audit financial statement, afs",
    items: [
      {
        language: "en",
        title: `AUDITED FINANCIAL STATEMENT`,
        summary: `A set of official yearly financial reports (like your company’s report card) that have been
        checked and verified by a licensed auditor from an audit firm to confirm they are accurate,
        true and fair.`,
        description: `<b>What's Important</b>
        <br>
        • Profit & Loss Statement (shows income and expenses) <br>
        • Balance Sheet (shows what the company owns and owes) <br>
        • Cash Flow Statement (shows money moving in and out) <br>
        • Notes to Accounts (extra details, policies, explanations) <br>
        • Auditor’s Report (the independent auditor’s opinion)
        <br><br>
        <b>Why it Matters</b>
        <br>• Gives shareholders and regulators confidence in your company’s financial health. <br>
        • Required for most Sdn Bhds unless they qualify for audit exemption. <br>
        • Forms part of the annual compliance filing with SSM.
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        • Section 248 – Every company must prepare financial statements. <br>
        • Section 251 – These statements must be audited by an approved auditor, unless exempted. <br>
        • Section 259 – Lays down duties of auditors and their report.
        <br><br>
        <b>Exceptions</b>
        <br>
        Certain small private companies may be exempted from audit (Schedule 2 of the Companies
        Act 2016) if they fall within the “audit exemption” criteria set by SSM (e.g., dormant, zero
        revenue, or small companies below threshold).`,
      },
    ],
  })

  static exemptPrivateCompany = new Glossary({
    id: "exempt-private-company",
    number: 2,
    keywords: "exempt private company",
    items: [
      {
        language: "en",
        title: `EXEMPT PRIVATE COMPANY`,
        summary: `An exempt private company (EPC) is a special classification of private company under
        Malaysian law. It is a private company that has no more than twenty members, none of whom
        is a corporation, and in which no shares are held directly or indirectly by a corporation. It is
        designed to be a small, closely-held company with a simpler compliance burden.`,
        description: `<b>What's Important</b>
        <br>
        An EPC retains the characteristics of a private company limited by shares but enjoys reduced
        disclosure obligations. It is not required to lodge its audited financial statements with the
        Registrar (SSM) but instead, a Certificate of Status as an EPC must be lodged and its financial
        information remains with its members with a signature of a licensed auditor and is not part of
        the publicly available SSM Corporate Profile.
        <br><br>
        <b>Why it Matters</b>
        <br>
        This classification is significant because it allows small and family-owned businesses to maintain
        financial privacy while still complying with statutory reporting to members. Whether this EPC
        reduces the cost of compliance and administrative exposure is debatable. The issue deserves
        further scrutiny, and it would be timely for the relevant authorities to fine-tune the framework
        — balancing the genuine need for regulatory oversight with the realities faced by small
        enterprises. By doing so, the law can better achieve its intent under the Companies Act 2016
        while also ensuring that compliance does not become unnecessarily burdensome.
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        The definition is contained in Section 2(1) of the Companies Act 2016. The exemption from
        lodging financial statements is governed by Section 260 .
        <br><br>
        <b>Exceptions</b>
        <br>
        The exemption only applies if the company continues to meet the strict criteria: no more than
        twenty individual members and no corporate shareholders. Once the company admits a
        corporate shareholder or exceeds the membership threshold, it ceases to qualify as an EPC
        and loses the exemption. In such cases, the company must lodge its audited financial
        statements with SSM like any other private company.`,
      },
    ],
  })

  static director = new Glossary({
    id: "director",
    number: 3,
    keywords: "director",
    items: [
      {
        language: "en",
        title: `DIRECTOR`,
        summary: `A director is the individual entrusted with managing the business and affairs of a company. In
        law, the term is broad—it covers anyone formally appointed as a director, as well as anyone
        who acts in the position of a director, regardless of the title used.`,
        description: `<b>What's Important</b>
        <br>
        Directors oversee company strategy, decision-making and compliance. They are responsible
        for calling meetings, approving accounts, entering into contracts on behalf of the company,
        and ensuring that statutory filings are made. The law imposes fiduciary duties (to act in good
        faith, in the best interest of the company, and for proper purposes) and statutory duties (such
        as keeping accounting records and ensuring solvency). A company must have at least one
        director who is ordinarily resident in Malaysia.
        <br><br>
        <b>Why it Matters</b>
        <br>
        Directors are the “mind and will” of the company. Their decisions bind the company legally
        and financially. Because companies enjoy limited liability, the law balances this by holding
        directors personally accountable in certain situations—for example, if they act dishonestly,
        breach fiduciary duties, or allow the company to trade while insolvent. For entrepreneurs and
        shareholders, choosing competent directors is crucial to protect the business and avoid
        personal or corporate liability.
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        The definition of “director” is in Section 2 of the Companies Act 2016, which includes de facto
        and shadow directors. Minimum directorship requirements and qualifications are in Section
        196, while disqualification grounds are set out in Section 198. General directors’ duties are in
        Part III, Division 2, particularly Section 213 (duty to act in good faith and for proper purpose)
        and Section 214 (duty to exercise reasonable care, skill and diligence).
        <br><br>
        <b>Exceptions</b>
        <br>
        Certain persons are prohibited from acting as directors, such as undischarged bankrupts or
        individuals convicted of offences involving fraud or dishonesty, unless leave of the court is
        obtained. Private companies with only one director are allowed under the Act, but public
        companies must have at least two.`,
      },
    ],
  })

  static nomineeDirector = new Glossary({
    id: "nominee-director",
    number: 4,
    keywords: "nominee director",
    items: [
      {
        language: "en",
        title: `NOMINEE DIRECTOR`,
        summary: `A nominee director is a person appointed to the board of a company to represent the interests
        of a particular shareholder, investor, creditor, or other stakeholder. Although appointed as a
        representative, the nominee director is legally a director of the company and must carry out
        the same duties as any other director.`,
        description: `<b>What's Important</b>
        <br>
        Nominee directors are often seen in joint ventures, subsidiaries, or investment structures where
        a shareholder or lender wants oversight or influence over the company’s affairs. While they
        may be expected to report back or safeguard the appointing party’s interests, the law requires
        them to act in the best interests of the company as a whole. They attend board meetings,
        vote on resolutions, and can be held accountable for the company’s actions in the same way
        as all directors.
        <br><br>
        <b>Why it Matters</b>
        <br>
        Nominee directors create a bridge between stakeholders and the company, providing
        confidence to investors or creditors. However, conflicts of interest can arise when the wishes of
        the nominator clash with what is best for the company. Understanding that nominee directors
        cannot blindly follow instructions but must exercise independent judgment is crucial to good
        governance and to avoid personal liability.
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        The Companies Act 2016 does not provide a separate definition of nominee director, but
        Section 217 recognises the concept by imposing disclosure obligations where a director acts
        as a nominee. Section 218 also imposes restrictions on improper use of position.
        <br><br>
        <b>Exceptions</b>
        <br>
        A nominee director is not exempt from fiduciary and statutory duties. Even if appointed
        specifically to protect a shareholder’s interest, the director must prioritise the company’s
        interests when making decisions. Any arrangement or instruction that forces a nominee
        director to act against the company’s best interests would not excuse liability. If a conflict of
        interest arises, the director must declare it under Section 219 of the Companies Act 2016 and
        may need to abstain from decision-making.`,
      },
    ],
  })

  static independentDirector = new Glossary({
    id: "independent-director",
    number: 5,
    keywords: "independent director",
    items: [
      {
        language: "en",
        title: `INDEPENDENT DIRECTOR`,
        summary: `An independent director is a member of the board who does not have any material
        relationship with the company, its subsidiaries, or its major shareholders. Their role is to provide
        unbiased judgment and act as a check and balance on the board, free from influence of
        management or controlling shareholders.`,
        description: `<b>What's Important</b>
        <br>
        Independent directors are common in public companies, especially those listed on Bursa
        Malaysia, where corporate governance codes require a certain proportion of independent
        directors on the board. They are expected to sit on key committees such as audit, nomination,
        and remuneration committees. Their independence is measured by criteria such as not being
        an employee, not having close family ties to management, and not having significant business
        dealings with the company.
        <br><br>
        <b>Why it Matters</b>
        <br>
        Independent directors strengthen transparency and accountability in a company. They bring
        objectivity in overseeing management decisions, reviewing financial reporting, and protecting
        minority shareholders’ interests. Their presence reassures investors, regulators, and the public
        that the company is managed in a fair and responsible manner.
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        The Companies Act 2016 does not define “independent director” directly. Instead, the
        requirement comes from the Bursa Malaysia Listing Requirements and the Malaysian Code on
        Corporate Governance (MCCG). Paragraph 1.01 of the Bursa Listing Requirements defines
        “independent director” and prescribes eligibility tests. Section 196 of the Companies Act 2016
        governs the minimum number of directors, but the independence criteria and obligations are
        set by listing rules and governance codes.
        <br><br>
        <b>Exceptions</b>
        <br>
        Independent directors are generally mandatory only for listed public companies and not for
        private companies (Sdn Bhd). A director who ceases to meet the independence criteria—
        such as by entering into a business contract with the company—must resign or be
        redesignated. Even though they are labelled “independent,” they remain subject to the same
        fiduciary and statutory duties under the Companies Act 2016 as any other director.`,
      },
    ],
  })

  static shadowDirector = new Glossary({
    id: "shadow-director",
    number: 6,
    keywords: "shadow director",
    items: [
      {
        language: "en",
        title: "SHADOW DIRECTOR",
        summary: `A shadow director is not formally appointed to the board but is a person in accordance with
        whose instructions or directions the actual directors of a company are accustomed to act. In
        other words, they exert influence or control behind the scenes, effectively directing the
        company without holding the official title of director.`,
        description: `<b>What's Important</b>
        <br>
        Shadow directors do not appear on statutory records such as the SSM register, but they may
        still influence board decisions, company policies, or financial dealings. The law treats them as
        directors for the purpose of imposing duties and liabilities if they act as one, to prevent
        individuals from avoiding accountability by hiding behind informal arrangements.
        <br><br>
        <b>Why it Matters</b>
        <br>
        Recognising shadow directors ensures that those who truly control a company cannot escape
        responsibility. This protects shareholders, creditors, and the public from manipulation or abuse
        of corporate structures. It also reinforces that corporate governance is based on substance
        rather than form—if someone behaves like a director, the law will treat them as one.
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        The definition of “director” under Section 2 of the Companies Act 2016 includes not only
        those formally appointed but also those “in accordance with whose directions or instructions
        the majority of the directors are accustomed to act.” This wording captures shadow directors
        within the scope of directors’ duties and liabilities.
        <br><br>
        <b>Exceptions</b>
        <br>
        A person giving advice in a professional capacity, such as a lawyer, accountant, or consultant,
        is not deemed a shadow director merely because the board acts on their advice. Similarly,
        influence must be habitual and substantial—occasional suggestions or recommendations are
        not enough to qualify someone as a shadow director.`,
      },
    ],
  })

  static sdnBhd = new Glossary({
    id: "sdn-bhd",
    number: 7,
    keywords: "sendirian berhad",
    items: [
      {
        language: "en",
        title: "SDN BHD",
        summary: `“Sdn Bhd” stands for Sendirian Berhad, the Malaysian term for a private limited company. It is
        the most common form of business entity in Malaysia, where the liability of shareholders is
        limited to the amount unpaid on their shares, and the company exists as a separate legal
        entity distinct from its owners.`,
        description: `<b>What's Important</b>
        <br>
        A Sdn Bhd must have at least one shareholder and one director ordinarily resident in
        Malaysia. It restricts the transfer of its shares, cannot offer its shares to the public, and is
        capped at a maximum of 50 shareholders. A Sdn Bhd enjoys perpetual succession, can own
        property, enter into contracts, and sue or be sued in its own name. Its obligations include
        lodging annual returns, maintaining proper accounting records, and circulating and lodging
        financial statements in accordance with the Companies Act 2016.
        <br><br>
        <b>Why it Matters</b>
        <br>
        The Sdn Bhd structure offers limited liability protection, which means the personal assets of
        shareholders are generally safe from business debts. It also carries more credibility with banks,
        suppliers, and investors compared to 
        ${this.glossaryLink("sole-proprietorship", "sole proprietorships")}
        or partnerships. At the same time, it
        is subject to stricter compliance requirements, including directors’ duties and statutory filings
        with the Companies Commission of Malaysia (SSM). For many entrepreneurs, it strikes the
        balance between protection, credibility, and control.
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        The requirements and framework for Sdn Bhd are contained in the Companies Act 2016.
        Section 42 defines private companies, while Section 9(1)(b) requires a private company
        limited by shares to include the words “Sendirian Berhad” or “Sdn. Bhd.” in its name. Section
        196 prescribes minimum director requirements, and various provisions in Part III cover duties of
        directors, members, and compliance obligations.
        <br><br>
        <b>Exceptions</b>
        <br>
        variations exist within Sdn Bhd companies. For example, an exempt private company (EPC) is
        a subset of Sdn Bhd with fewer than twenty shareholders and no corporate shareholders,
        enjoying reduced filing obligations. Additionally, while foreign individuals can be shareholders
        or directors, at least one director must be ordinarily resident in Malaysia. A private company
        that exceeds fifty shareholders or offers its shares to the public automatically converts into a
        public company (Berhad)`,
      },
    ],
  })

  static financialStatements = new Glossary({
    id: "financial-statements",
    number: 8,
    keywords: "financial statement, fs",
    items: [
      {
        language: "en",
        title: "FINANCIAL STATEMENTS",
        summary: `Financial statements are the formal records that summarise the financial performance and
        position of a company. They are prepared at the end of each financial year and circulated
        to members, serving as the main tool for assessing the company’s profitability, assets,
        liabilities, and overall financial health.`,
        description: `<b>What's Important</b>
        <br>
        A complete set of financial statements typically includes the statement of financial position
        (balance sheet), statement of profit or loss and other comprehensive income, statement of
        changes in equity, and statement of cash flows. Notes to the accounts, directors’ reports,
        and in audited cases, the auditor’s report, also form part of the package. These must comply
        with the approved accounting standards issued by the Malaysian Accounting Standards
        Board (MASB).
        <br><br>
        <b>Why it Matters</b>
        <br>
        Financial statements provide transparency and accountability. They allow shareholders to
        evaluate management performance, creditors to assess creditworthiness, and regulators to
        monitor compliance. In Malaysia, they also form the basis for tax filings with the Inland
        Revenue Board (LHDN). For Sdn Bhds, the timely preparation and circulation of financial
        statements are statutory duties, and failure to comply can result in penalties for directors.
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        Sections 248 to 259 of the Companies Act 2016 set out the requirements for keeping
        accounting records, preparing financial statements, circulating them to members, and
        lodging them with the Registrar (SSM). Section 244 requires compliance with approved
        accounting standards. Section 267 requires companies to appoint auditors unless exempted
        under audit exemption criteria. The Income Tax Act 1967 also governs the use of financial
        statements for tax submissions.
        <br><br>
        <b>Exceptions</b>
        <br>
        Certain private companies are eligible for audit exemption under Section 267(2) of the
        Companies Act 2016 and relevant Practice Directives (e.g., PD 10/2024). These companies
        may lodge unaudited financial statements instead, provided they meet qualifying criteria such
        as being dormant, zero-revenue, or within revenue/asset/employee thresholds. Exempt private
        companies that lodge a certificate of EPC status under Section 260 are not required to lodge
        financial statements with SSM for public inspection, though they must still prepare and circulate
        them to members.`,
      },
    ],
  })

  static managementAccounts = new Glossary({
    id: "management-accounts",
    number: 9,
    keywords: "management account, ma",
    items: [
      {
        language: "en",
        title: "MANAGEMENT ACCOUNTS",
        summary: `Management accounts are internal financial reports prepared periodically—often monthly
        or quarterly—to provide directors and management with up-to-date insights into the
        company’s financial performance. Unlike the statutory required financial statements, they
        are not filed with SSM or made public. Consider a Management Account as the subset or
        pre-cursor to a full financial statements.`,
        description: `<b>What's Important</b>
        <br>
        Management accounts usually contain a profit and loss statement, balance sheet, cash flow
        analysis, and key performance indicators tailored to the business. They may also include
        budgets, forecasts, and variance analysis to help managers track progress and make
        informed decisions. The format is flexible and designed to serve the company’s internal
        needs rather than comply with accounting standards.
        <br><br>
        <b>Why it Matters</b>
        <br>
        Management accounts give directors real-time visibility over the company’s finances,
        enabling proactive decision-making, cost control, and strategic planning. They are also
        critical for demonstrating solvency when making declarations such as 
        ${this.glossaryLink("dividends", "dividends")} or capital
        reductions. Banks and investors may request management accounts to evaluate funding
        applications, even though these are not legally required documents.
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        While the Companies Act 2016 does not explicitly mandate the preparation of management
        accounts, Section 245 requires companies to keep proper accounting records that
        sufficiently explain transactions and financial position. These records form the basis for both
        management accounts and annual financial statements. In practice, management
        accounts help directors fulfil their statutory duty under Section 213 to act with reasonable
        care, skill, and diligence.
        <br><br>
        <b>Exceptions</b>
        <br>
        Management accounts are not a statutory filing requirement and are not standardised in
        format. Their preparation is at the discretion of directors, unless specifically requested by
        auditors, regulators, banks, or shareholders or in the event of a striking off application. For
        dormant or very small companies, management accounts may not be prepared regularly,
        though directors must still ensure accounting records are accurate and up to date.`,
      },
    ],
  })

  static annualReturn = new Glossary({
    id: "annual-return",
    number: 10,
    keywords: "annual return, ar",
    items: [
      {
        language: "en",
        title: "ANNUAL RETURN",
        summary: `An annual return is a snapshot of a company’s key information lodged each year with the
        Companies Commission of Malaysia (SSM). It is not a financial statement but rather a
        statutory report that confirms the company’s basic particulars as at the anniversary of its
        incorporation.`,
        description: `<b>What's Important</b>
        <br>
        The annual return includes details such as the company’s registered office, business nature,
        shareholding structure, indebtedness, particulars of directors, secretaries, auditors, and a list
        of members. This is probably a document that is often confused and confused people but
        what it actually is essentially a corporate profile update, ensuring that SSM has current
        information on the company’s governance and ownership. The return must be signed by a
        director or secretary.
        <br><br>
        <b>Why it Matters</b>
        <br>
        Filing an annual return is a legal obligation that demonstrates the company is active and
        compliant. It allows regulators, banks, investors, and other stakeholders to verify the
        company’s standing. Failure to lodge on time can result in penalties, blacklisting, or even
        striking off of the company by SSM. Unlike financial statements, the annual return does not
        show profit or loss—it only confirms statutory particulars.
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        Section 68 of the Companies Act 2016 governs the requirement to lodge an annual return
        within 30 days from the anniversary of incorporation. The Companies Regulations 2017
        prescribe the form and content. The Registrar has powers under Section 549 to strike off a
        company that fails to lodge annual returns for three or more consecutive years.
        <br><br>
        <b>Exceptions</b>
        <br>
        There is no exemption from filing an annual return for any companies, whether private or
        public. The only exception is that a newly incorporated company is not required to lodge an
        annual return in its year of incorporation; the obligation starts from the first anniversary.
        Dormant or exempt private companies must still lodge annual returns even if they enjoy relief
        from filing audited financial statements. Why Annual Return does not become the singe
        source of truth for Corporate Documents and etc is any one’s guess.`,
      },
    ],
  })

  static superform = new Glossary({
    id: "superform",
    number: 11,
    keywords: "superform, section 14",
    items: [
      {
        language: "en",
        title: "SUPERFORM",
        summary: `The Superform is the single electronic form used to incorporate a new company in Malaysia.
        Introduced by SSM to replace multiple separate forms, it consolidates the required details for
        incorporation into one streamlined submission. It is filed through the MyCoID system.`,
        description: `<b>What's Important</b>
        <br>
        The Superform captures all the core information required under the Companies Act 2016 for
        incorporation: the proposed company name, status (private or public), nature of business,
        registered office, particulars of directors and shareholders, shareholding structure, and
        secretary details if any. Supporting documents such as identification and consent to act as
        director or secretary are also included.
        <br><br>
        <b>Why it Matters</b>
        <br>
        The Superform simplifies the process of setting up a company by eliminating the need for
        multiple separate forms (such as the old Form 24, 44, and 49). For entrepreneurs, it reduces
        paperwork, speeds up the incorporation timeline, and provides a single digital entry point.
        For regulators, it improves accuracy and record-keeping by standardising the incorporation
        process.
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        The Superform is provided for under Section 14 of the Companies Act 2016, which sets out
        the application for incorporation. It must be lodged with the Registrar together with the
        prescribed fee. Section 15 requires the Registrar to issue a notice of registration once satisfied
        that the requirements have been met.
        <br><br>
        <b>Exceptions</b>
        <br>
        The Superform is only used for incorporation of a new company. It is not used for post-
        incorporation filings such as annual returns, financial statements, or changes of particulars.
        Any subsequent changes (like appointment of directors, change of registered office, or share
        transfers) must be made using the relevant forms or electronic lodgements provided under
        other sections of the Companies Act 2016.`,
      },
    ],
  })

  static registeredAddress = new Glossary({
    id: "registered-address",
    number: 12,
    keywords: "registered address",
    items: [
      {
        language: "en",
        title: "REGISTERED ADDRESS",
        summary: `The registered address, also known as the registered office, is the address of a company recorded
        with the Companies Commission of Malaysia (SSM). It is the legal point of contact for all communications,
        notices, and statutory documents by any Relevant Authorities.`,
        description: `<b>What's Important</b>
        <br>
        Every company must have a registered office in Malaysia at all times. The office must be
        accessible to the public during ordinary business hours. Key statutory documents—including
        registers of members and directors, minutes of meetings, financial statements, and accounting
        records—are required to be kept at this address, unless the company has lodged a declaration
        with SSM that certain records are kept elsewhere.
        <br><br>
        <b>Why it Matters</b>
        <br>
        The registered address is the legal anchor of the company. It ensures transparency, compliance,
        and accessibility for regulators, shareholders, creditors, and other stakeholders. Any change to
        this address must be notified to SSM within 14 days. Failure to maintain or update the registered
        office can expose both the company and its officers to penalties.
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        Section 46(1) of the Companies Act 2016 requires every company to have a registered office in Malaysia.
        Section 47(1) specifies the documents to be kept there, while Section 47(2) allows certain documents
        to be kept elsewhere if a notice is lodged with the Registrar. Non-compliance may result in fines
        of up to RM50,000 or RM10,000 with further daily fines for continuing offences.
        <br><br>
        <b>Exceptions</b>
        <br>
        A company may keep some statutory documents (except minutes of members’ meetings and resolutions)
        at another place in Malaysia, provided a notice is given to SSM. However, the registered office
        itself must always remain within Malaysia and accessible during ordinary business hours.`,
      },
    ],
  })

  static subscription = new Glossary({
    id: "subscription",
    number: 13,
    keywords: "subscription",
    items: [
      {
        language: "en",
        title: "SUBSCRIPTION",
        summary: `Subscription is the annual fee payable to iCompany for continued access to iCompany Systems
        — our digital company secretary platform. Think of it as the traditional company secretary
        annual retainer, but streamlined, automated and on-the-go!
        And yes — this is also how we make money. So do the right thing: pay your subscription on time.`,
        description: `<b>What's Important</b>
        <br>
        The subscription (RM365 per year, waived in the first year of incorporation or switch) starts
        from the date your company is onboarded with iCompany Systems. It is not the same as your
        statutory obligations like annual returns or financial statement lodgements — those are
        still mandatory on their own. Any additional services you need are charged on a pay-per-use basis.
        <br><br>
        And non-payment does not render your Sdn Bhd on pause, inactive or make you free from any
        obligations. You are still a Director, remember?
        <br><br>
        <b>Why it Matters</b>
        <br>
        The RM365 subscription is what keeps your compliance engine running. It secures your
        place on iCompany Systems, ensures you never miss statutory deadlines, and keeps your corporate
        records continuously maintained. We have already priced everything else as low as possible
        — this is the one essential fee that sustains the platform and the people behind it.
        Without it, reminders stop and everything else on the platform will be locked out from access.
        Within three (3) months we reserve the right to resign as your Company Secretary under
        Section 237 of the Companies Act 2016.— exposing your company and its directors to penalties,
        fines, and unnecessary regulatory pain. And no –– we do not do credit, but we do offer BNPL.`,
      },
    ],
  })

  static switchToUs = new Glossary({
    id: "switch-to-us",
    number: 14,
    keywords: "switching, switch, switch out, switch to icompany",
    items: [
      {
        language: "en",
        title: "SWITCH TO US | SWITCHING | SWITCH OUT",
        summary: `Thinking of switching Company Secretary to iCompany — where digital actually means digital.
        Onboarding is seamless, your records stay intact, and compliance is automated. No gimmicks,
        no hidden costs — just a transparent RM499 to make the move (and yes, we show you
        exactly what goes into that).
        <br><br>
        We are API-ready; we cannot say the same for those who only claim to be “digital.”
        Until the industry catches up, someone still has to handle the papers, seals, signatures —
        and your previous Company Secretary too. That is why it remains RM499 –
        whether switching in or switching out.`,
        description: `<b>What's Important</b>
        <br>
        You have every right to switch or change your Company Secretary whenever you choose.
        If you prefer the conventional, or are tempted by promises of grandeur and gimmicks,
        that is your prerogative. We respect the choice — but we also know why more and
        more users choose us.
        <br><br>
        And let us be clear: “accounts,” “audits,” or “taxation” bundled as reasons to
        switch are often just scare tactics. Every Company Secretary provides the same statutory services.
        The choice should always be grounded in what serves the best interest of your
        Sdn Bhd — not fear, not favour, not personal bias.
        <br><br>
        <b>Why it Matters</b>
        <br>
        Switching is not just ticking a box. It involves transferring physical documents,
        updating the Registered Address, other couple of outstanding items, and more. Unless
        your new Company Secretary runs on an API like ours, the fee will remain RM499 —
        a fair reflection of the real work involved.
        <br><br>
        Nobody ever said compliance is cheap — but at iCompany, we have made it fair,
        simple, and transparent. In fact, your total baseline spend for compliance with us
        is just RM863 per year. For that peace of mind and certainty, the power is in your hands.`,
      },
    ],
  })

  static actionRequired = new Glossary({
    id: "action-required",
    number: 15,
    keywords: "action required",
    items: [
      {
        language: "en",
        title: "ACTION REQUIRED",
        summary: `Think of this as your service reminder — a timely nudge about all pending tasks
        or events tied to you and your Sdn Bhd inside iCompany Systems. It doubles as an
        in-Dashboard Compliance Reminder, tailored to your role whether you are a Shareholder,
        Director, or Corporate Representative, or even a combination of any.`,
        description: `<b>What's Important</b>
        <br>
        This is the heartbeat of compliance. Review or abstain, sign, and pay instantly
        — all in one dashboard. No paperwork, no typo error, no chasing signatures, just
        compliance made simple as the law intended.
        <br><br>
        <b>Why it Matters</b>
        <br>
        Ignoring this notification means ignoring your responsibilities to your Sdn Bhd.
        For a Director, that can warrant termination under the Companies Act 2016; for
        the company, it may trigger regulatory action by SSM — fines, penalties, even
        legal proceedings.
        And here is the bottom line: technology, process flows, and automation can
        only take you so far. At the end of the day, it rests with you. If you act,
        compliance flows. If you don’t, consequences follow.`,
      },
    ],
  })

  static certificateOfIncorporation = new Glossary({
    id: "certificate-of-incorporation",
    number: 16,
    keywords: "certificate of incorporation, section 17",
    items: [
      {
        language: "en",
        title: "CERTIFICATE OF INCORPORATION",
        summary: `A certificate of incorporation is the official document issued by the Companies Commission of
        Malaysia (SSM) confirming that a company has been legally incorporated under the
        Companies Act 2016. It serves as conclusive evidence that the company exists as a separate
        legal entity.`,
        description: `<b>What's Important</b>
        <br>
        The certificate sets out the company’s name, registration number, and the date of
        incorporation. It may also include the type of company (e.g. private limited or public) and is
        endorsed by the Registrar of SSM. While most statutory records are now kept electronically,
        companies often request a certified copy of the certificate of incorporation for banking,
        regulatory, or contractual purposes.
        <br><br>
        <b>Why it Matters</b>
        <br>
        This certificate is the “birth certificate” of the company. From the date stated on it, the
        company enjoys perpetual succession and the capacity to enter into contracts, own property,
        sue and be sued. It is also one of the key documents that banks, government authorities, and
        counterparties request when verifying the legal standing of a company.
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        Section 15 of the Companies Act 2016 requires the Registrar to issue a notice of registration
        once incorporation requirements are satisfied. Section 17 states that the notice of registration
        is conclusive evidence that the company has been duly incorporated. While the Act now
        recognises the electronic notice of registration as sufficient, Section 17A allows companies to
        apply for a certificate of incorporation as an additional document.
        <br><br>
        <b>Exceptions</b>
        <br>
        Not all companies automatically receive a physical certificate—by default, the Registrar
        issues a notice of registration electronically. A company must specifically apply and pay the
        prescribed fee if it wants a printed certificate of incorporation. The certificate does not
        expire, but if the company is later struck off or wound up, it ceases to have effect.`,
      },
    ],
  })

  static certificateOfChangeOfName = new Glossary({
    id: "certificate-of-change-of-name",
    number: 17,
    keywords: "certificate of change of name, Section 28",
    items: [
      {
        language: "en",
        title: "CERTIFICATE OF CHANGE OF NAME",
        summary: `A certificate of change of name is an official document issued by the Companies
        Commission of Malaysia (SSM) confirming that a company has legally altered its registered
        name. It is the formal evidence of a successful name change under the Companies Act
        2016.`,
        description: `<b>What's Important</b>
        <br>
        The certificate states the new name of the company, the company’s registration number,
        and the effective date of the change. Importantly, the certificate confirms that while the
        name has changed, the company’s legal identity, obligations, and rights remain the same.
        <br><br>
        <b>Why it Matters</b>
        <br>
        This certificate provides proof to third parties—such as banks, suppliers, regulators, and
        clients—that the company’s name change has been duly registered. It is crucial for updating
        statutory records, contracts, signage, bank accounts, and business dealings. Without it,
        stakeholders cannot be assured that the new name is officially recognised.
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        Section 28 of the Companies Act 2016 allows a company to change its name by special
        resolution. Section 30 requires the company to notify the Registrar, who will issue a notice of
        registration of the new name. The certificate of change of name is issued under Section 30 as
        conclusive evidence of the change.
        <br><br>
        <b>Exceptions</b>
        <br>
        The change of name does not affect the company’s existing rights, obligations, or legal
        proceedings. Any contracts or suits entered into under the former name continue to bind the
        company. For at least twelve months after the change, the former name must be displayed
        beneath the new name on business correspondence and notices. The certificate itself does
        not authorise any other alteration to the company’s structure or constitution—it strictly
        evidences the name change.`,
      },
    ],
  })

  static ssmCorporateProfile = new Glossary({
    id: "ssm-corporate-profile",
    number: 18,
    keywords: "ssm corporate profile, corporate profile",
    items: [
      {
        language: "en",
        title: "SSM CORPORATE PROFILE",
        summary: `The SSM Corporate Profile is the official extract of a company’s records kept by the
        Companies Commission of Malaysia (SSM). It is the most widely used reference document to
        verify a company’s legal existence, ownership, management, and statutory particulars.`,
        description: `<b>What's Important</b>
        <br>
        A corporate profile contains the company’s registration number, incorporation date,
        registered and business addresses, nature of business, details of directors and shareholders,
        shareholding structure, and where applicable, financial statements lodged with SSM. It also
        records changes such as past names, secretaries, and capital history. Essentially, it is the
        company’s “identity card” in the eyes of regulators and third parties.
        <br><br>
        <b>Why it Matters</b>
        <br>
        Banks, lawyers, regulators, suppliers, and potential business partners rely on the corporate
        profile as conclusive proof of a company’s standing. It ensures transparency in business
        dealings and reduces fraud risks. For companies, keeping information updated in the
        corporate profile is critical to maintaining credibility and compliance.
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        While the Companies Act 2016 does not use the term “corporate profile,” the obligation to
        maintain and update company records lies in provisions such as Section 47 (documents at
        registered office), Section 51 (register of members), Section 57 (register of directors,
        managers and secretaries), Section 68 (annual return), and Section 248 (accounting records
        and financial statements). The Registrar, under Section 20A of the Companies Commission of
        Malaysia Act 2001, has the power to certify and issue extracts of company records, which
        form the corporate profile.
        <br><br>
        <b>Exceptions</b>
        <br>
        An exempt private company (EPC) under Section 260 of the Companies Act 2016 is not
        required to lodge its financial statements with SSM. As a result, the corporate profile of an
        EPC will not display financial information. Similarly, if certain filings have not yet been made
        (e.g. overdue annual return), the corporate profile may reflect outdated or incomplete data
        until the company regularises its compliance.`,
      },
    ],
  })

  static beneficialOwnership = new Glossary({
    id: "beneficial-ownership",
    number: 19,
    keywords: "beneficial ownership, bo",
    items: [
      {
        language: "en",
        title: "BENEFICIAL OWNERSHIP",
        summary: `Beneficial Ownership refers to the person who ultimately owns or controls a company, even if the shares are registered in another person’s name. The beneficial owner is the person who enjoys the benefits of ownership such as control, voting rights, dividends, or the ability to influence the company, whether directly or indirectly.`,
        description: `<b>What's Important</b>
        <br>
        Companies are required to identify and keep records of their beneficial owners in the Register of Beneficial Owners. A beneficial owner is generally a person who holds, directly or indirectly, a significant interest in the company or has effective control over the company. The company must obtain and record the beneficial owner’s name, identification details, address, date of becoming a beneficial owner, and nature of ownership or control. This information must be kept as part of the company’s statutory records and may need to be lodged with the Registrar when required.
        <br><br>
        <b>Why it Matters</b>
        <br>
        Beneficial ownership requirements are part of anti-money laundering and transparency regulations to prevent the misuse of companies for illegal activities such as money laundering, fraud, or hiding ownership. It ensures that the authorities can identify the real person behind a company, even if nominee shareholders or corporate shareholders are used. Failure to identify and record beneficial owners may result in penalties and compliance issues.
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        Beneficial ownership requirements are governed under Sections 56 and 60A of the Companies Act 2016, together with the Companies Commission of Malaysia (SSM) Guidelines on Beneficial Ownership Reporting Framework. These laws require companies to identify, record, and maintain information on beneficial owners.
        <br><br>
        <b>Exceptions</b>
        <br>
        Public listed companies are generally exempt from beneficial ownership reporting requirements because their ownership disclosure is regulated under securities laws and Bursa Malaysia listing requirements. However, most private companies are required to maintain a Register of Beneficial Owners regardless of the number of shareholders.
        `,
      },
    ],
  })

  static listing = new Glossary({
    id: "listing",
    number: 20,
    keywords: "listing",
    items: [
      {
        language: "en",
        title: "LISTING",
        summary: `Listing is the process by which a company’s shares are offered to the public and admitted for
        trading on a stock exchange such as Bursa Malaysia. It transforms a private company into a
        public company with enhanced visibility, access to capital markets, and stricter compliance
        requirements.`,
        description: `<b>What's Important</b>
        <br>
        A listed company raises funds by offering its shares to the public, either through an initial
        public offering (IPO) or by way of additional share issuance. Once listed, its shares are freely
        transferable and traded on Bursa Malaysia. Listing brings obligations such as continuous
        disclosure of material information, publication of quarterly and annual financial reports, and
        compliance with the Malaysian Code on Corporate Governance (MCCG). Independent
        directors, audit committees, and shareholder meetings are mandatory features.
        <br><br>
        <b>Why it Matters</b>
        <br>
        For a company, listing provides access to a broader pool of investors, improved liquidity for its
        shares, and greater corporate profile. For investors and the public, it ensures transparency
        and regulatory oversight, reducing investment risks. However, it also means loss of privacy,
        higher compliance costs, and scrutiny from regulators, media, and shareholders. A Sdn Bhd
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        The Companies Act 2016 governs the incorporation and governance of public companies,
        but the listing process itself is regulated under the Capital Markets and Services Act 2007 and
        Bursa Malaysia Listing Requirements. Section 190 of the Companies Act requires a public
        company to issue a prospectus when offering shares to the public. The Securities Commission
        Malaysia oversees the approval of IPOs and compliance with securities laws.
        Exceptions, if any
        <br><br>
        <b>Exceptions</b>
        <br>
        Only public companies can list; private companies (Sdn Bhd) must first convert to Berhad
        status before seeking approval. Certain exemptions or fast-track processes may apply to
        specific markets or sectors, such as the ACE Market for growth companies and the LEAP
        Market for SMEs, which have lighter requirements compared to the Main Market. Foreign
        companies can also seek secondary listings on Bursa Malaysia subject to conditions.`,
      },
    ],
  })

  static initialPublicOfferingIpo = new Glossary({
    id: "initial-public-offering-ipo",
    number: 21,
    keywords: "initial public offering, ipo",
    items: [
      {
        language: "en",
        title: "INITIAL PUBLIC OFFERING (IPO)",
        summary: `An initial public offering (IPO) is the first time a company offers its shares to the public and lists
        them on a stock exchange, usually Bursa Malaysia. It marks the transition from being privately
        held to becoming a publicly traded company.`,
        description: `<b>What's Important</b>
        <br>
        In an IPO, the company issues a prospectus approved by the Securities Commission
        Malaysia. The prospectus discloses detailed information about the company’s business,
        financials, risks, and plans for the funds raised. Shares are then offered to institutional and
        retail investors, after which the company’s shares are listed on the Main Market, ACE Market,
        or LEAP Market of Bursa Malaysia.
        <br><br>
        <b>Why it Matters</b>
        <br>
        An IPO allows a company to raise substantial capital for expansion, debt repayment, or other
        corporate purposes. It also increases the company’s visibility and credibility. For early
        investors and founders, it provides liquidity and a chance to realise value from their holdings.
        For the public, it creates an opportunity to participate in the growth of the company.
        However, IPOs also subject the company to stricter disclosure rules, corporate governance
        requirements, and market scrutiny.
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        Section 190 of the Companies Act 2016 requires a public company issuing shares to the
        public to register a prospectus. The Capital Markets and Services Act 2007 and Bursa
        Malaysia Listing Requirements regulate IPO procedures, disclosures, and approvals. The
        Securities Commission Malaysia is the authority that vets and approves IPO applications.
        <br><br>
        <b>Exceptions</b>
        <br>
        Not all companies can pursue an IPO. A company must first be a public company (Berhad)
        and meet minimum financial, governance, and track record requirements. Some exemptions
        exist for SMEs under the LEAP Market, which is only open to sophisticated investors and has
        lighter requirements. Companies listing on the ACE Market are not required to meet profit
        track record tests but must show growth potential and have a sponsor to guide them.`,
      },
    ],
  })

  static prospectus = new Glossary({
    id: "prospectus",
    number: 22,
    keywords: "prospectus",
    items: [
      {
        language: "en",
        title: "PROSPECTUS",
        summary: `A prospectus is the official document issued by a public company when it offers shares,
        debentures, or other securities to the public. It serves as a disclosure tool, providing potential
        investors with all material information needed to make an informed investment decision.`,
        description: `<b>What's Important</b>
        <br>
        A prospectus contains details about the company’s business model, financial performance,
        risks, directors and management, use of proceeds from the fundraising, and any material
        contracts. It must include audited financial statements, forecasts where applicable, and
        legal disclosures. The document is vetted and registered with the Securities Commission
        Malaysia before being circulated to the public.
        <br><br>
        <b>Why it Matters</b>
        <br>
        The prospectus protects investors by ensuring transparency and reducing the risk of fraud or
        misinformation. For the company, it is a statutory requirement that builds credibility and
        facilitates capital raising. Misstatements or omissions in a prospectus can lead to liability for
        the company, its directors, promoters, and advisers.
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        Sections 190–194 of the Companies Act 2016 govern the issuance and content of a
        prospectus. The Capital Markets and Services Act 2007 further sets out requirements for
        registration, liability, and civil/criminal penalties for misstatements. Bursa Malaysia Listing
        Requirements also prescribe disclosures for listing applicants.
        <br><br>
        <b>Exceptions</b>
        <br>
        Certain offers are exempt from issuing a full prospectus, such as private placements, rights
        issues to existing shareholders, or issues targeted at sophisticated investors under specific
        exemptions in the Capital Markets and Services Act 2007. In such cases, an information
        memorandum or abridged prospectus may suffice.`,
      },
    ],
  })

  static rightsIssue = new Glossary({
    id: "rights-issue",
    number: 23,
    keywords: "rights issue",
    items: [
      {
        language: "en",
        title: "RIGHTS ISSUE",
        summary: `A rights issue is a method by which a company raises additional capital by offering new
        shares to its existing shareholders, usually in proportion to their current holdings. It gives
        shareholders the “right” (but not the obligation) to buy more shares at a specified price
        within a fixed timeframe.`,
        description: `<b>What's Important</b>
        <br>
        Under a rights issue, shareholders receive an offer notice setting out the entitlement ratio (for
        example, 1 new share for every 4 shares held), the issue price (usually at a discount to market
        value), and the closing date. Shareholders can choose to subscribe, sell their rights on the
        market (if renounceable), or let the rights lapse. Proceeds are typically used for expansion,
        debt repayment, or working capital.
        <br><br>
        <b>Why it Matters</b>
        <br>
        A rights issue allows a company to raise funds without diluting existing shareholders who
        participate, since they can maintain their proportionate ownership. It is also faster and more
        cost-effective than a public offering. For shareholders, it represents both an opportunity and
        a risk—participating requires additional investment, but non-participation results in dilution of
        ownership.
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        Section 75 of the Companies Act 2016 empowers directors to allot shares with shareholder
        approval, while Section 85 provides pre-emptive rights to existing shareholders unless waived.
        For listed companies, Bursa Malaysia Listing Requirements and the Capital Markets and
        Services Act 2007 regulate disclosures, pricing, and shareholder approval for rights issues.
        <br><br>
        <b>Exceptions</b>
        <br>
        Private companies may exclude pre-emptive rights in their constitution, allowing them to
        issue shares without offering them first to existing shareholders. In such cases, no rights issue
        process is required. For listed companies, certain small placements or issues under specific
        exemptions may not follow the rights issue framework but instead use private placement
        mechanisms.`,
      },
    ],
  })

  static bonusIssue = new Glossary({
    id: "bonus-issue",
    number: 24,
    keywords: "bonus issue",
    items: [
      {
        language: "en",
        title: "BONUS ISSUE",
        summary: `A bonus issue, also known as a scrip issue or capitalisation issue, is when a company issues
        new shares to its existing shareholders for free, in proportion to their current holdings. It is
        essentially the conversion of the company’s reserves into share capital.`,
        description: `<b>What's Important</b>
        <br>
        In a bonus issue, shareholders receive additional shares without having to pay anything. For
        example, a 1-for-5 bonus issue means every shareholder receives one extra share for every
        five shares held. The company’s overall value does not change, but the number of shares in
        circulation increases, reducing the price per share proportionately.
        <br><br>
        <b>Why it Matters</b>
        <br>
        Bonus issues reward shareholders without reducing the company’s cash reserves. They can
        signal confidence in the company’s financial health and often improve market liquidity by
        lowering the share price per unit. For shareholders, it is a way of receiving value without tax
        implications that typically apply to cash dividends. For private companies, it is a means of
        restructuring capital.
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        Section 84 of the Companies Act 2016 allows a company to issue bonus shares by
        capitalising its profits or reserves. Directors must ensure that the company’s constitution
        permits such an issue, or otherwise pass the necessary resolution. For listed companies, Bursa
        Malaysia Listing Requirements set out disclosure and approval rules for bonus issues.
        <br><br>
        <b>Exceptions</b>
        <br>
        A company cannot issue bonus shares out of revaluation reserves unless permitted by law.
        Bonus issues do not provide additional funds to the company since no cash is raised—they
        simply increase the number of shares. In private companies, bonus issues are less common
        unless shareholders want to adjust ownership proportions or formalise retained earnings into
        share capital.`,
      },
    ],
  })

  static shareBuyback = new Glossary({
    id: "share-buyback",
    number: 25,
    keywords: "share buyback",
    items: [
      {
        language: "en",
        title: "SHARE BUYBACK",
        summary: `A share buyback is when a company repurchases its own shares from existing shareholders.
        The bought-back shares are either cancelled or kept as treasury shares, reducing the
        number of shares in circulation.`,
        description: `<b>What's Important</b>
        <br>
        In a buyback, the company pays shareholders a set price to reacquire shares. For listed
        companies, this can be done on the open market or through a tender offer, subject to Bursa
        Malaysia rules. The repurchased shares may be cancelled permanently, or held as treasury
        shares that can later be resold, transferred, or used for employee share schemes.
        <br><br>
        <b>Why it Matters</b>
        <br>
        Share buybacks are a way for companies to return surplus cash to shareholders, support the
        share price, or improve financial ratios such as earnings per share (EPS). For shareholders, it
        may signal management’s confidence in the company’s prospects. However, it also reduces
        the company’s available cash, which may otherwise be used for reinvestment or dividends.
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        Sections 127 to 127Q of the Companies Act 2016 govern share buybacks. They allow a
        company to purchase its own shares if authorised by its constitution and approved by
        shareholders. Bursa Malaysia Listing Requirements provide additional rules for listed
        companies, including limits on the percentage of shares that can be bought back and
        reporting obligations.
        <br><br>
        <b>Exceptions</b>
        <br>
        Only companies with sufficient distributable profits or share premium reserves can carry out
        buybacks. Insolvent or financially distressed companies are prohibited from doing so. Private
        companies may also conduct share buybacks, but they must strictly comply with the
        solvency test and shareholder approval requirements. Treasury shares cannot confer voting
        rights or dividends while held by the company.`,
      },
    ],
  })

  static businessAddress = new Glossary({
    id: "business-address",
    number: 26,
    keywords: "business address",
    items: [
      {
        language: "en",
        title: "BUSINESS ADDRESS",
        summary: `The business address is the physical location where a company carries out its day-to-day
        operations. Unlike the registered office, which is the legal point of contact with SSM,
        the business address reflects the company’s actual place of trade or activity.`,
        description: `<b>What's Important</b>
        <br>
        A business address provides stakeholders, customers, and regulators with a clear picture
        of where the company operates. A company may have more than one business address, such as
        branch offices, but only Malaysian addresses may be recorded with SSM. Any change or addition
        must be notified to SSM within the prescribed timeframe.
        <br><br>
        <b>Why it Matters</b>
        <br>
        The business address signals your operational footprint and forms part of your official
        profile with SSM. Banks, suppliers, and clients often use it to verify legitimacy, while
        government tenders and certain industry standards require proof of a valid operating address.
        An incomplete or questionable address erodes trust, raises red flags with potential partners,
        and may even hinder access to financing or contracts. On top of that, local municipal councils
        regulate business premises through licensing, zoning, and signage rules — meaning the right
        address is not just a matter of perception, but also of compliance.
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        Section 14(3)(c) of the Companies Act 2016 requires the nature of business and business
        address to be stated at incorporation, while Section 30 governs the reporting of changes
        in particulars, including addresses. The SSM Corporate Profile reflects the latest information
        including business address if it is lodged.
        <br><br>
        <b>Exceptions</b>
        <br>
        A company may initially operate without a fixed business address, but this often creates
        problems — for instance, most banks require one before opening a corporate account.
        And because the Superform filed at incorporation cannot be altered, leaving the address
        blank means it will remain blank in your official records indefinitely, a detail also visible
        in your SSM Corporate Profile –– until of course you add a new address. This gap can erode
        confidence in your business, suggest instability, and complicate dealings with regulators,
        financiers, and even municipal councils that oversee business premises.`,
      },
    ],
  })

  static capitalReduction = new Glossary({
    id: "capital-reduction",
    number: 27,
    keywords: "capital reduction",
    items: [
      {
        language: "en",
        title: "CAPITAL REDUCTION",
        summary: `Capital reduction is a corporate exercise where a company reduces its share capital, either
        by cancelling shares or lowering the nominal value of shares. It is a way to restructure the
        company’s finances, return excess capital to shareholders, or write off accumulated losses.`,
        description: `<b>What's Important</b>
        <br>Capital reduction can take several forms: cancelling unissued shares, cancelling paid-up
        capital that is lost or unrepresented by assets, or returning surplus capital to shareholders. The
        reduction must not prejudice creditors’ rights, and in most cases, directors must make a
        solvency statement confirming the company can meet its debts. For listed companies, Bursa
        Malaysia requires disclosure and shareholder approval.
        <br><br>
        <b>Why it Matters</b>
        <br>
        Capital reduction gives companies flexibility to clean up their balance sheets, especially by
        offsetting accumulated losses against share capital. It can also return idle capital to
        shareholders without going through a winding-up. For investors, it often signals restructuring
        and can improve future dividend-paying capacity.
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        Sections 116 to 118 of the Companies Act 2016 govern capital reduction. The Act allows a
        private or public company to reduce its share capital if authorised by its constitution and
        approved by a special resolution. A solvency statement under Section 117 is usually required,
        and the company must lodge the relevant documents with SSM.
        <br><br>
        <b>Exceptions</b>
        <br>
        Capital reduction cannot be carried out if the company is insolvent or unable to meet its
        debts. Court approval is no longer mandatory under the Companies Act 2016, but the
        Registrar may intervene if procedures are not properly followed. Creditors’ interests must be
        protected, and reductions cannot be used to defraud them.`,
      },
    ],
  })

  static financialAssistance = new Glossary({
    id: "financial-assistance",
    number: 28,
    keywords: "financial assistance",
    items: [
      {
        language: "en",
        title: "FINANCIAL ASSISTANCE",
        summary: `Financial assistance refers to a company providing direct or indirect help—such as loans,
        guarantees, security, or gifts of assets—for the purpose of purchasing or subscribing to its own
        shares or the shares of its holding company.`,
        description: `<b>What's Important</b>
        <br>
        Examples of financial assistance include a company lending money to a third party to buy its
        shares, providing collateral for a loan used to acquire its shares, or releasing a debt owed by
        a shareholder to facilitate a share purchase. The concept is rooted in protecting a
        company’s capital base, ensuring that shareholders—not the company itself—fund the
        acquisition of its shares.
        <br><br>
        <b>Why it Matters</b>
        <br>
        Restrictions on financial assistance prevent erosion of company capital and protect
        creditors. If companies could freely use their assets to fund the purchase of their own shares,
        it would reduce the pool of resources available to pay debts. For directors, allowing
        prohibited financial assistance may expose them to personal liability and penalties.
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        Section 123 of the Companies Act 2016 prohibits financial assistance by a company for the
        purpose of acquiring its own shares or those of its holding company, subject to exceptions.
        Section 126 provides a “whitewash” procedure that allows certain forms of financial
        assistance if the company passes a special resolution and the directors make a solvency
        statement.
        <br><br>
        <b>Exceptions</b>
        <br>
        The Act allows specific exceptions, such as financial assistance given in the ordinary course
        of business by lending companies, employee share schemes, or transactions not materially
        reducing the company’s net assets. Private companies may also provide financial assistance
        under the whitewash procedure, provided the solvency test is met and proper filings are
        lodged with SSM.`,
      },
    ],
  })

  static charge = new Glossary({
    id: "charge",
    number: 29,
    keywords: "charge",
    items: [
      {
        language: "en",
        title: "CHARGE",
        summary: `A charge is a form of security interest created over a company’s assets to secure repayment
        of a loan or performance of an obligation. It gives the lender rights over the asset if the
        company defaults, but ownership of the asset remains with the company.`,
        description: `<b>What's Important</b>
        <br>
        Charges may be fixed or floating. A fixed charge attaches to specific assets such as land,
        buildings, or machinery, which the company cannot dispose of without the lender’s consent.
        A floating charge hovers over a class of assets, like stock-in-trade or receivables, allowing the
        company to use them in the ordinary course of business until the charge “crystallises” upon
        default. All registrable charges must be lodged with SSM to be enforceable against third
        parties.
        <br><br>
        <b>Why it Matters</b>
        <br>
        Charges protect lenders by reducing credit risk, making it easier for companies to access
        financing. For the company, granting a charge may be necessary to obtain loans or credit
        facilities. For creditors and investors, knowing what assets are charged helps assess the
        company’s financial exposure. Failure to register a charge can make it void against
        liquidators or other creditors.
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        Sections 352 to 364 of the Companies Act 2016 set out the rules on creation, registration, and
        effect of charges. A company must lodge prescribed particulars of a registrable charge with
        the Registrar within 30 days of its creation. The Registrar maintains a register of charges
        available for public inspection.
        <br><br>
        <b>Exceptions</b>
        <br>
        Not all charges are registrable. For example, a pledge of shares or certain short-term
        financing arrangements may fall outside the statutory regime. If a charge is not registrable
        under the Act, it can still be valid between the company and lender, but it will not enjoy
        statutory priority protection. Some charges, like floating charges, may rank behind
        preferential creditors (such as employees’ wages) in a winding-up.`,
      },
    ],
  })

  static windingUp = new Glossary({
    id: "winding-up",
    number: 30,
    keywords: "winding up",
    items: [
      {
        language: "en",
        title: "WINDING UP",
        summary: `Winding up is the legal process of bringing a company’s life to an end by liquidating its
        assets, paying off creditors, and distributing any surplus to shareholders. Once winding up is
        complete, the company is dissolved and ceases to exist as a legal entity.`,
        description: `<b>What's Important</b>
        <br>
        There are two main types of winding up in Malaysia: voluntary winding up and compulsory
        winding up. Voluntary winding up may be initiated by members (when the company is
        solvent) or creditors (when the company is insolvent). Compulsory winding up is ordered by
        the court, usually upon a creditor’s petition for unpaid debts. A liquidator is appointed to
        take control of the company, realise assets, settle liabilities, and distribute any remaining
        funds.
        <br><br>
        <b>Why it Matters</b>
        <br>
        Winding up ensures an orderly closure of a company while protecting the interests of
        creditors and shareholders. For directors, it is a safeguard against trading while insolvent, as
        failing to commence winding up when appropriate can expose them to personal liability. For
        creditors, it provides a structured process to recover debts. For shareholders, it brings finality
        and distribution of any residual value.
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        Winding up is governed by Part IV of the Companies Act 2016 (Sections 432–560). Section 433
        outlines the circumstances under which a company may be wound up by the court, such as
        inability to pay debts. Section 439 covers voluntary winding up initiated by members or
        creditors. The Insolvency Act 1967 and the Companies (Winding Up) Rules 1972 also apply in
        regulating the process.
        <br><br>
        <b>Exceptions</b>
        <br>
        Not all company closures require winding up. Companies with no assets or liabilities may
        apply for striking off under Section 549, which is simpler and faster. Certain statutory bodies,
        licensed institutions, or regulated entities may be subject to special winding up regimes under
        their respective laws. In voluntary winding up, if the directors cannot make a solvency
        declaration, the process automatically converts into a creditors’ voluntary winding up.`,
      },
    ],
  })

  static strikingOff = new Glossary({
    id: "striking-off",
    number: 31,
    keywords: "striking off",
    items: [
      {
        language: "en",
        title: "STRIKING OFF",
        summary: `Striking off is an administrative process where the Companies Commission of Malaysia (SSM)
        removes a company’s name from the register, effectively dissolving it without going through
        a formal winding-up procedure. It is generally used for companies that are dormant,
        inactive, or no longer carrying on business.`,
        description: `<b>What's Important</b>
        <br>
        A striking off application is made to SSM by the director, member, or company secretary on
        behalf of the company. The company must have no assets or liabilities, no outstanding
        charges, no pending legal proceedings, and must be up to date with statutory filings. If
        approved, SSM publishes a notice in the Gazette, and the company is deemed dissolved
        upon publication.
        <br><br>
        <b>Why it Matters</b>
        <br>
        Striking off provides a cost-effective and faster way to close down a company compared to
        winding up. It is often chosen by directors and shareholders when the business is no longer
        viable or needed, provided the company is clean of debts and obligations. It spares small
        businesses the complexity of appointing a liquidator or going through court proceedings.
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        Section 549 of the Companies Act 2016 empowers the Registrar to strike a company off the
        register if the company applies or if the Registrar believes the company is not carrying on
        business. Section 550 sets out the effect of striking off, and Section 551 allows for
        reinstatement of a company to the register within seven years upon court order.
        <br><br>
        <b>Exceptions</b>
        <br>
        Striking off is not available to companies with outstanding liabilities, ongoing disputes, or
        regulatory obligations. Licensed institutions such as banks, insurance companies, and
        companies regulated under sector-specific laws cannot use striking off and must undergo
        formal winding up. Even after striking off, liability of directors, officers, and members for
        offences or debts remains enforceable.`,
      },
    ],
  })

  static reinstatementOfCompany = new Glossary({
    id: "reinstatement-of-company",
    number: 32,
    keywords: "reinstatement of company, exhume, reanimate, revive",
    items: [
      {
        language: "en",
        title: "REINSTATEMENT OF COMPANY",
        summary: `Reinstatement is the process of restoring a company that has been struck off the register by
        SSM back to legal existence. Once reinstated, the company is deemed to have continued in
        existence as if it had never been struck off.`,
        description: `<b>What's Important</b>
        <br>
        An application for reinstatement must be made to the court within seven years of the striking
        off. The applicant may be a director, shareholder, or creditor who can show sufficient cause
        why the company should be revived—such as unresolved assets, ongoing business, or
        outstanding claims. If the court grants the order, the Registrar must reinstate the company’s
        name and issue a notice confirming the revival.
        <br><br>
        <b>Why it Matters</b>
        <br>
        Reinstatement protects stakeholders who may be prejudiced by a striking off. For example,
        shareholders may discover forgotten assets, creditors may still want to pursue debts, or the
        company may need to continue business. It provides a safety net so that striking off is not
        irreversible if done in error or prematurely.
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        Section 551 of the Companies Act 2016 allows an aggrieved party to apply to the court for
        reinstatement within seven years from the date of striking off. Once the order is lodged with
        SSM, the company is restored to the register and deemed never to have been dissolved.
        <br><br>
        <b>Exceptions</b>
        <br>
        If the seven-year period has lapsed, reinstatement is no longer possible and the company
        remains permanently dissolved. Certain regulated companies (such as banks or insurers) may
        face additional restrictions or sector-specific laws that override reinstatement. Reinstatement
        does not erase liabilities—the company, directors, and members remain accountable for
        obligations that existed before and during the striking off period.`,
      },
    ],
  })

  static liquidator = new Glossary({
    id: "liquidator",
    number: 33,
    keywords: "liquidator",
    items: [
      {
        language: "en",
        title: "LIQUIDATOR",
        summary: `A liquidator is the person appointed to take control of a company during the winding up
        process. The liquidator’s role is to collect and realise the company’s assets, settle its liabilities,
        and distribute any surplus to shareholders before the company is dissolved.`,
        description: `<b>What's Important</b>
        <br>
        The liquidator replaces the board of directors in managing the company once winding up
        begins. Their powers include selling assets, bringing or defending legal proceedings, paying
        creditors, and making distributions. A liquidator may be appointed by the court (in
        compulsory winding up), by members or creditors (in voluntary winding up), or by the Official
        Receiver in certain cases. Licensed liquidators are usually qualified accountants or insolvency
        practitioners registered with the Ministry of Finance.
        <br><br>
        <b>Why it Matters</b>
        <br>
        The liquidator ensures an orderly and fair closure of the company, protecting the rights of
        creditors and shareholders. They act as an officer of the court or as a fiduciary, with a duty to
        act impartially, efficiently, and in accordance with the law. Their conduct directly affects
        how much creditors recover and whether directors face scrutiny for misconduct or insolvent
        trading.
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        Sections 456 to 505 of the Companies Act 2016 govern the appointment, powers, duties, and
        removal of liquidators. Section 477 sets out their general powers, while Section 486 requires
        them to keep proper accounts of the winding up. The Insolvency Act 1967 and Companies
        (Winding Up) Rules 1972 also apply to liquidation proceedings.
        <br><br>
        <b>Exceptions</b>
        <br>
        In striking off under Section 549, no liquidator is appointed because the company is closed
        administratively without asset realisation. In voluntary winding up of a solvent company,
        directors may act as liquidators if the constitution allows, but in practice a licensed liquidator
        is usually appointed. Certain regulated companies, such as banks or insurers, may be subject
        to special liquidation regimes under sector-specific laws.`,
      },
    ],
  })

  static receiversAndManagers = new Glossary({
    id: "receivers-and-managers",
    number: 34,
    keywords: "receivers and managers, receiver, manager",
    items: [
      {
        language: "en",
        title: "RECEIVERS AND MANAGERS",
        summary: `A receiver or receiver and manager is a person appointed—usually by a secured creditor—
        to take control of specific company assets or the whole business when the company defaults
        on its obligations. Unlike a liquidator, a receiver’s focus is not to wind up the company but to
        recover debts owed to the appointing creditor.`,
        description: `<b>What's Important</b>
        <br>
        A receiver may be appointed over particular charged assets (like land, machinery, or
        receivables) or, if given wider powers, as a “receiver and manager” to run the company’s
        business. Their powers depend on the terms of the debenture or charge creating the security.
        They act primarily in the interest of the appointing creditor but must also observe duties to
        act in good faith and avoid unnecessary loss to the company.
        <br><br>
        <b>Why it Matters</b>
        <br>
        Receivership is a powerful remedy for secured creditors to enforce their rights without waiting
        for court liquidation proceedings. For the company, it often signals financial distress and loss
        of control over key assets. For other creditors, it may limit recovery since the appointing
        creditor takes priority over charged assets.
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        Sections 375 to 386 of the Companies Act 2016 regulate the appointment, powers, duties,
        and termination of receivers and managers. Section 385 requires notice of appointment to
        be lodged with SSM. Section 386 requires a receiver or manager to prepare accounts of
        receipts and payments and lodge them with the Registrar.
        <br><br>
        <b>Exceptions</b>
        <br>
        A receiver or manager can only be appointed if the company has created a charge or
        debenture allowing such appointment. Their authority is limited to the property subject to the
        charge, unless extended by the security instrument. Once a liquidator is appointed in a
        winding up, the receiver’s powers may continue only to the extent necessary to protect the
        appointing creditor’s interest, and they must cooperate with the liquidator.`,
      },
    ],
  })

  static officialReceiver = new Glossary({
    id: "official-receiver",
    number: 35,
    keywords: "official receiver",
    items: [
      {
        language: "en",
        title: "OFFICIAL RECEIVER",
        summary: `The Official Receiver (OR) is a public officer under the Insolvency Department who acts as
        the default liquidator or receiver in court-ordered proceedings when no private insolvency
        practitioner is appointed. The OR serves as an officer of the court and represents the state’s
        role in supervising insolvency matters`,
        description: `<b>What's Important</b>
        <br>
        The Official Receiver may be appointed as liquidator in a compulsory winding up, or as
        interim liquidator until a qualified private liquidator is chosen. The OR also has powers to
        investigate the affairs of companies, call for directors’ statements of affairs, and examine
        persons connected with the company. Beyond companies, the OR also plays a role in
        personal bankruptcy cases under the Insolvency Act 1967.
        <br><br>
        <b>Why it Matters</b>
        <br>
        The Official Receiver ensures that there is always an impartial authority to take charge of an
        insolvent company, even if creditors or shareholders cannot agree on a liquidator. This
        safeguards the winding-up process and protects public interest. The OR also serves as a
        watchdog, with powers to report misconduct by directors and to recover assets that may
        have been wrongfully disposed of.
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        Section 375(1) of the Companies Act 2016 empowers the court to appoint the Official
        Receiver as receiver. Sections 456 and 459 provide for the appointment of the OR as
        liquidator in compulsory winding up. The Insolvency Act 1967 and Companies (Winding Up)
        Rules 1972 also govern the OR’s functions and powers.
        <br><br>
        <b>Exceptions</b>
        <br>
        The Official Receiver usually steps in only when no private liquidator is appointed. In practice,
        creditors in larger insolvencies often prefer to appoint licensed insolvency practitioners with
        more resources. The OR’s role is also limited in voluntary winding up, where members or
        creditors normally appoint their own liquidator instead.`,
      },
    ],
  })

  static solvencyTest = new Glossary({
    id: "solvency-test",
    number: 36,
    keywords: "solvency test, insolvency test, insolvent, solvent, going concern",
    items: [
      {
        language: "en",
        title: "SOLVENCY TEST",
        summary: `The solvency test is a legal standard under the Companies Act 2016 that requires directors to
        declare that a company is able to pay its debts as they fall due within twelve months after
        certain corporate actions are taken. It ensures that shareholders’ interests are balanced with
        the protection of creditors.`,
        description: `<b>What's Important</b>
        <br>
        The solvency test is applied when companies undertake actions such as declaring dividends,
        reducing share capital, redeeming preference shares, or providing financial assistance.
        Directors must sign a solvency statement confirming that, in their opinion, the company will
        remain solvent after the transaction. Making a false or reckless declaration exposes directors
        to personal liability and penalties.
        <br><br>
        <b>Why it Matters</b>
        <br>
        The solvency test acts as a safeguard to prevent companies from stripping assets or
        distributing funds to shareholders at the expense of creditors. It forces directors to assess the
        company’s financial position carefully before approving significant transactions. For
        stakeholders, it provides assurance that the company will not recklessly compromise its ability
        to meet obligations.
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        Sections 113 and 117 of the Companies Act 2016 require a solvency statement for capital
        reductions. Section 132 requires it for dividend distributions. Section 126 applies the solvency
        test in the context of financial assistance. The statement must be signed by all or a majority of
        directors, depending on the transaction, and lodged with SSM where required.
        <br><br>
        <b>Exceptions</b>
        <br>
        The solvency test does not apply to every corporate action—ordinary day-to-day
        transactions are excluded. Public listed companies may be subject to additional disclosure
        and governance requirements under Bursa Malaysia Listing Requirements. If directors cannot
        in good faith sign the solvency statement, the transaction cannot proceed. In winding up
        situations, solvency is assessed differently under insolvency law, not through the statutory
        solvency test.`,
      },
    ],
  })

  static dividends = new Glossary({
    id: "dividends",
    number: 37,
    keywords: "dividents, divident",
    items: [
      {
        language: "en",
        title: "DIVIDENDS",
        summary: `Dividends are distributions of a company’s profits to its shareholders. They represent a return
        on investment and are usually paid in cash, though they may also be issued as shares (scrip
        dividends) or other forms of property.`,
        description: `<b>What's Important</b>
        <br>
        Dividends may be interim (declared by directors between financial years) or final (declared
        with shareholder approval at the end of a financial year). Payment of dividends must come
        from profits available for distribution, not from capital, and directors must make a solvency
        statement before declaring them. The amount and timing are determined by the board,
        subject to the company’s constitution and shareholder approval in the case of final
        dividends.
        <br><br>
        <b>Why it Matters</b>
        <br>
        Dividends are one of the main ways shareholders realise value from their investment in a
        company. They also signal the company’s financial health and profitability. For directors,
        declaring dividends requires careful balancing of rewarding shareholders while ensuring
        enough funds remain to run the business and meet creditor obligations. Improper declaration
        or payment of dividends can expose directors to personal liability.
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        Section 131 of the Companies Act 2016 governs dividends, requiring them to be paid only
        out of profits and in accordance with the solvency test. Section 132 requires directors to sign
        a solvency statement before making distributions. Section 133 prohibits payment of dividends
        if it would render the company insolvent.
        <br><br>
        <b>Exceptions</b>
        <br>
        Companies limited by guarantee do not issue dividends since they have no share capital.
        Interim dividends may be declared solely by directors without member approval, provided
        the constitution allows. Listed companies must comply with additional Bursa Malaysia
        disclosure requirements. Dividends are not guaranteed—if a company has insufficient profits
        or directors cannot make the solvency declaration, no dividend can be paid.`,
      },
    ],
  })

  static shareCapital = new Glossary({
    id: "share-capital",
    number: 38,
    keywords: "share capital",
    items: [
      {
        language: "en",
        title: "SHARE CAPITAL",
        summary: `Share capital is the total value of funds raised by a company through the issuance of shares
        to its shareholders. It represents the equity base of the company and forms the foundation of
        members’ ownership rights.`,
        description: `<b>What's Important</b>
        <br>
        Share capital is divided into shares, which may carry different rights such as voting, dividend
        entitlement, or priority on winding up. Under the Companies Act 2016, the concept of par
        value has been abolished, meaning shares are now issued at no par value. Share capital
        may be increased through allotment of new shares (rights issue, private placement, bonus
        issue) or reduced via capital reduction. The company must keep an up-to-date register of
        members reflecting all shareholdings.
        <br><br>
        <b>Why it Matters</b>
        <br>
        Share capital underpins ownership and control of the company. It determines voting power,
        entitlement to dividends, and distribution of assets on winding up. For directors and
        entrepreneurs, managing share capital is central to fundraising, protecting ownership
        proportions, and complying with pre-emptive rights. For creditors, the level of share capital
        signals the level of financial backing behind the company.
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        Sections 74 to 84 of the Companies Act 2016 regulate share capital, including the power to
        issue shares, restrictions, variation of class rights, and bonus issues. Section 75 requires
        shareholder approval for directors to allot shares. Section 78 requires the lodgement of
        returns of allotment. Section 85 provides shareholders with pre-emptive rights to new shares
        unless excluded by the constitution.
        <br><br>
        <b>Exceptions</b>
        <br>
        Private companies may exclude pre-emptive rights under their constitution, allowing
        directors to issue shares without first offering them to existing members. Certain special shares
        such as redeemable preference shares are allowed under Section 72, provided solvency
        requirements are met. Exempt private companies may keep share capital details private
        from public inspection, though records must still be maintained internally and circulated to
        members.`,
      },
    ],
  })

  static preferenceShares = new Glossary({
    id: "preference-shares",
    number: 39,
    keywords: "preference shares, preference share, shares, share",
    items: [
      {
        language: "en",
        title: "PREFERENCE SHARES",
        summary: `Preference shares are a special class of shares that give their holders preferential rights over
        ordinary shareholders, usually in respect of dividends and repayment of capital. They sit
        between equity and debt, often providing fixed returns but limited control.`,
        description: `<b>What's Important</b>
        <br>
        Preference shares typically carry the right to a fixed dividend before any dividend is paid to
        ordinary shareholders. They may also have priority in repayment of capital if the company is
        wound up. However, preference shareholders often have no voting rights, except in limited
        circumstances such as when their rights are varied or dividends are in arrears. Preference
        shares can be redeemable, cumulative, non-cumulative, convertible, or participating,
        depending on the terms of issue.
        <br><br>
        <b>Why it Matters</b>
        <br>
        Preference shares are a flexible financing tool for companies, allowing them to raise capital
        without diluting control of existing ordinary shareholders. For investors, they provide more
        security than ordinary shares, with predictable returns and preferential treatment. However,
        they do not usually offer the same upside potential or control as ordinary shares.
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        Section 72 of the Companies Act 2016 governs preference shares. It allows companies to
        issue redeemable preference shares provided they meet the solvency test and obtain
        shareholder approval. The section also requires that the rights attached to preference
        shares—such as dividend rate, redemption terms, and priority—be clearly set out in the
        constitution or terms of issue.
        <br><br>
        <b>Exceptions</b>
        <br>
        Preference shareholders generally cannot vote at general meetings, except in
        circumstances specified under Section 148 of the Companies Act 2016, such as when
        dividends are unpaid for more than twelve months, or when their rights are being varied.
        Redeemable preference shares cannot be redeemed out of capital unless the company
        passes the solvency test and complies with statutory procedures.`,
      },
    ],
  })

  static ordinaryShares = new Glossary({
    id: "ordinary-shares",
    number: 40,
    keywords: "ordinary shares, ordinary share, shares, share",
    items: [
      {
        language: "en",
        title: "ORDINARY SHARES",
        summary: `Ordinary shares are the most common type of shares issued by a company. They represent
        ownership in the company and carry voting rights, entitlement to dividends, and a share in
        the surplus assets on winding up, but without any preferential treatment.`,
        description: `<b>What's Important</b>
        <br>
        Holders of ordinary shares (also known as common shares) have the right to attend and vote
        at general meetings, usually on a one-share-one-vote basis. They are entitled to dividends,
        but only after preference shareholders (if any) have been paid. Ordinary shareholders also
        participate in the residual value of the company upon winding up, after creditors and
        preference shareholders are settled. Their returns depend on the company’s performance
        and the board’s decision on dividend distribution.
        <br><br>
        <b>Why it Matters</b>
        <br>
        Ordinary shares give shareholders both risk and reward: they carry the highest level of control
        through voting rights but also the highest exposure to business risk since dividends are not
        guaranteed. For entrepreneurs and founders, ordinary shares are typically the vehicle
        through which they retain control of the company. For investors, ordinary shares offer the
        potential for capital growth as well as dividend income.
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        The Companies Act 2016 does not explicitly define “ordinary shares,” but provisions on share
        capital (Sections 74–84) apply to them. Section 85 grants ordinary shareholders pre-emptive
        rights to new share issues unless waived. Section 36 requires at least one share to be issued at
        incorporation, which in practice is usually an ordinary share.
        <br><br>
        <b>Exceptions</b>
        <br>
        Ordinary shares carry no guaranteed dividends or repayment priority. Their rights can be
        varied only in accordance with the company’s constitution and the Act. In companies with
        multiple classes of shares, ordinary shareholders may have reduced influence if preference
        or special classes carry enhanced rights.`,
      },
    ],
  })

  static classRights = new Glossary({
    id: "class-rights",
    number: 41,
    keywords: "class rights",
    items: [
      {
        language: "en",
        title: "CLASS RIGHTS",
        summary: `Class rights are the specific rights attached to a particular class of shares in a company. They
        define how shareholders of that class are treated in terms of voting, dividends, return of
        capital, or other privileges compared to holders of other classes.`,
        description: `<b>What's Important</b>
        <br>
        Examples of class rights include the right to receive a fixed dividend (for preference shares),
        multiple voting rights, or priority on repayment of capital during winding up. Ordinary shares
        generally form one class with equal rights, but companies can issue different classes—such as
        “A” and “B” shares—each with tailored rights. Any variation or cancellation of class rights
        must follow strict procedures to protect shareholders of that class.
        <br><br>
        <b>Why it Matters</b>
        <br>
        Class rights allow companies flexibility in structuring ownership and raising capital, balancing
        control and return between founders, investors, and other stakeholders. For shareholders,
        they safeguard expectations: preference shareholders rely on dividend priority, while
        ordinary shareholders rely on voting power. Any change to class rights can significantly shift
        the balance of power or economic benefit in a company.
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        Sections 90 to 93 of the Companies Act 2016 regulate the variation of class rights. A
        company may not alter class rights unless approved by holders of at least 75% of that class or
        by a special resolution of the class. Dissenting shareholders have the right to apply to court to
        have variations cancelled if they are oppressive or unfair.
        <br><br>
        <b>Exceptions</b>
        <br>
        If a company has only one class of shares (as is common with many private companies), the
        concept of class rights does not arise. A company’s constitution may also expressly exclude or
        modify statutory procedures for varying class rights, subject to the Act.`,
      },
    ],
  })

  static minorityShareholderRights = new Glossary({
    id: "minority-shareholder-rights",
    number: 42,
    keywords: "minority shareholder rights, minority shareholder, rights",
    items: [
      {
        language: "en",
        title: "MINORITY SHAREHOLDER RIGHTS",
        summary: `Minority shareholder rights are the legal protections given to shareholders who do not control
        the majority of votes in a company. These rights safeguard them from unfair prejudice,
        oppression, or exclusion by majority shareholders or directors.`,
        description: `<b>What's Important</b>
        <br>
        Minority rights include the ability to call for meetings, inspect registers, receive dividends
        declared, and vote on key company matters. Under the Companies Act 2016, minority
        shareholders can also take legal action if they believe the company’s affairs are being
        conducted in a manner oppressive, prejudicial, or unfairly discriminatory. They may apply to
        court for remedies such as injunctions, buyouts, or regulation of company conduct.
        <br><br>
        <b>Why it Matters</b>
        <br>
        Without minority protections, majority shareholders could alter class rights, withhold dividends,
        or make decisions that benefit themselves at the expense of smaller shareholders. Strong
        minority rights ensure fairness, accountability, and investor confidence—important for both
        private companies with a small group of owners and public companies with dispersed
        shareholders.
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        Section 346 of the Companies Act 2016 provides remedies for oppression, prejudice, or unfair
        discrimination against members. Section 223 requires shareholder approval for directors to
        dispose of substantial company undertakings, ensuring minorities have a say in major
        decisions. Section 310 allows members holding at least 5% of voting rights to call for a
        meeting.
        <br><br>
        <b>Exceptions</b>
        <br>
        Minority rights are not absolute rights. Minority shareholders cannot override the principle of
        majority rule on ordinary business matters. Remedies under Section 346 require proof of unfair
        conduct, not just disagreement with management decisions.`,
      },
    ],
  })

  static sales = new Glossary({
    id: "sales",
    number: 43,
    keywords: "sales",
    items: [
      {
        language: "en",
        title: "SALES",
        summary: `Sales are the total value of goods sold or services rendered by a company to its customers
        during a financial period. They form the backbone of a company’s revenue stream and
        appear as the “top line” in the statement of profit or loss.`,
        description: `<b>What's Important</b>
        <br>
        Sales may be made in cash (payment received immediately) or on credit (payment
        received later). They can be local or export-based. In financial reporting, sales are
        recognised when control of the goods or services passes to the customer, not necessarily
        when cash is received. Net sales are calculated after deducting discounts, returns, and
        allowances.
        <br><br>
        <b>Why it Matters</b>
        <br>
        Sales are a vital measure of a company’s size, performance, and growth. For directors, sales
        data help in setting strategy, pricing, and forecasting. For shareholders and creditors, sales
        indicate market demand and business viability. Regulators, auditors, and tax authorities also
        rely on reported sales as the basis for financial statements, compliance checks, and tax
        assessments.
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        The Companies Act 2016 does not define “sales” specifically, but Section 244 requires that
        financial statements comply with approved accounting standards. Sections 248 to 259
        require companies to prepare and circulate financial statements that include sales figures as
        part of revenue reporting. For tax purposes, the Income Tax Act 1967 requires companies to
        report sales as part of gross income.
        <br><br>
        <b>Reference to MPERS and MFRS</b>
        <br>
        Sales recognition is governed by approved accounting standards under Section 244 of the
        Companies Act 2016. For private entities, MPERS (Malaysian Private Entities Reporting
        Standard) applies. Under MPERS Section 23 (Revenue), sales are recognised when risks and
        rewards of ownership transfer or services are rendered. For entities using full MFRS (Malaysian
        Financial Reporting Standards), MFRS 15 (Revenue from Contracts with Customers) applies,
        requiring recognition when control of goods or services passes to the customer, often
        through a five-step model (identify contract, performance obligations, transaction price,
        allocation, and recognition).
        <br><br>
        <b>Exceptions</b>
        <br>
        Proceeds from financing activities, such as issuing shares, loans, or selling capital assets, are
        not treated as sales since they do not arise from ordinary business activities. For exempt
        private companies (EPCs) lodging certificates under Section 260 of the Companies Act 2016,
        sales figures are not shown in the public corporate profile, although they must still be
        prepared internally for members and regulators.`,
      },
    ],
  })

  static pasca = new Glossary({
    id: "pasca",
    number: 44,
    keywords: "payment, affirmation, status, confirmation, archive",
    items: [
      {
        language: "en",
        title: `PASCA (PAYMENT - AFFIRMATION - STATUS - CONFIRMATION - ARCHIVE)`,
        summary: `PASCA is the guiding system within iCompany that
        ensure every application post incorporation— follows a structured
        journey of what iCompany define as five key stages: <b>Payment</b>, <b>Affirmation</b>,
        <b>Status</b>, <b>Confirmation</b>, and <b>Archive</b>. It always appears on the left side of
        your draft resolution as your real-time progress indicator, showing exactly
        where your application stands, what comes next and more.`,
        description: `<b>What's Important</b>
        <br>
        PASCA aims to provide clarity and order. Each stage must be completed before
        the next begins — ensuring that all corporate actions within your Sdn Bhd are
        properly sequenced, verified, and documented. Payment secures the process,
        Affirmation captures Director or Shareholder consent, Status reflects the
        ongoing progress, Confirmation validates completion, and Archive safely stores
        your records for future reference.
        <br><br>
        <b>Why it Matters</b>
        <br>
        Under the Companies Act 2016, especially Sections 47 and 245, companies must
        maintain proper records, filings, and resolutions that reflect actual decisions
        made by their officers. PASCA operationalises this compliance digitally —
        transforming what used to be scattered paperwork into a transparent and traceable
        workflow. It keeps your applications compliant, auditable, and accountable. You
        can refer everything in Transactions and download relevant documents in Documents.
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        Section 47 of the Companies Act 2016 requires a company to keep all statutory
        documents, registers, and records at its registered office or notified address.
        Section 245 requires the maintenance of proper accounting and related records for
        at least seven years. PASCA’s structured sequence ensures all applications align
        with these statutory duties.`,
      },
    ],
  })

  static paymentStrip = new Glossary({
    id: "payment-strip",
    number: 45,
    keywords: "settlement, transactions, records, invoices, payment",
    items: [
      {
        language: "en",
        title: `PAYMENT STRIP (SETTLEMENT, TRANSACTIONS, RECORDS, INVOICES & PAYMENT)`,
        summary: `The Payment STRIP appears at the bottom of every page — of your <b>Company
        Dashboard</b> to <b>Centre Stage</b>. It’s more than just a bar; it’s your running ledger.
        Here, every payable item is neatly summarised and itemised — from service fees,
        delivery methods, government lodgement charges, to any special requests — before
        you proceed for signature or we prepare your documents for submission. Each STRIP
        reflects the specific payments tied to your Sdn Bhd, ensuring nothing is lost in
        translation (or in transaction).`,
        description: `<b>What's Important</b>
        <br>
        The Payment STRIP acts as your settlement gateway. It lists every charge in sequence, with
        its description and amount due, so you always see the full picture. The moment a payment
        is made, it automatically syncs with <b>Transactions</b> — creating a digital audit trail
        that’s precise, permanent, and painless to retrieve. You’ll always know what you paid
        for, when, and why. No surprises. No mystery charges. Just clarity. And more importantly,
        in true iCompany fashion, no fluff and puff.
        <br><br>
        <b>Why it Matters</b>
        <br>
        In compliance, transparency is not optional — it is essential. Whether you are
        incorporating a company, filing an annual return, or applying for audit exemption,
        the Payment STRIP keeps every cost visible and verifiable before any official
        document is generated. It enforces one of iCompany principle of <i>“No Fine Print,
        Only Finer Service”</i> — and aligns with Section 245 of the Companies Act 2016, which
        requires proper accounting and record-keeping for every transaction.
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        We would love to say we run on dreams and compliments, but in the real world, compliance
        runs on payments. And we are the most affordable Company Secretary in town - stop asking
        us for discounts! If you do not make timely payments then you must be ready to suffer the
        consequences, not from us but from the Relevant Authority especially SSM.
        <br>
        So pay us or don't it is entirely up to you, Director.. 
        But you got fourteen (14) days to pay before the payment STRIP expire.`,
      },
    ],
  })

  static incorporation = new Glossary({
    id: "incorporation",
    number: 46,
    keywords: "incorporations, incorporation, incorp, incop",
    items: [
      {
        language: "en",
        title: `INCORPORATION`,
        summary: `Incorporation is the legal process by which a business becomes 
        a separate legal entity registered under the Companies Act 2016. Once incorporated, 
        a company exists independently from its founders, shareholders, or directors. In Malaysia, incorporation of a private company limited by shares (Sdn. Bhd.) is carried out through the Companies Commission of Malaysia (SSM).`,
        description: `<b>What's Important</b>
        <br>
        Upon incorporation, the company becomes a body corporate capable of owning property,
        entering contracts, suing or being sued, and carrying on business in its own name. 
        The liability of its shareholders is limited to the amount unpaid on their shares.
        The process generally involves submitting the company’s proposed name, details of
        directors and shareholders, registered office address, and share structure through SSM’s
        MyCoID or you can engage with a licensed and qualified Company Secretary. Once approved,
        SSM issues a 
        ${this.glossaryLink("", "Notice of Registration (Section 15)")}, 
        which serves as conclusive evidence that the company has been duly incorporated.

        <br><br>
        <b>Why it Matters</b>
        <br>
        Incorporation creates a 
        ${this.glossaryLink("sdn-bhd", "seperate legal personality")}, 
        meaning the company is legally distinct from its owners. This allows entrepreneurs 
        to operate a business with limited liability protection while establishing a formal 
        governance structure through directors and shareholders. It also enables the company 
        to open bank accounts, enter commercial agreements, hire employees, and build credibility 
        with regulators, financial institutions, and business partners. In essence, incorporation 
        transforms a business idea into a legally recognised corporate entity capable of 
        participating in the economic system.
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        The incorporation of a company in Malaysia is governed primarily by Companies Act 2016,
        particularly 
        ${this.glossaryLink("superform", "Section 14")}, which sets out the requirements 
        for the application for
        incorporation. Upon satisfaction of the statutory requirements, the Registrar registers
        the company and issues a 
        ${this.glossaryLink("section-15", "Notice of Registration under Section 15")}, confirming that the
        company is duly incorporated.
        <br><br>
        <b>Exceptions</b>
        <br>
        Certain types of entities cannot be incorporated as a standard private company 
        limited by shares, such as companies limited by guarantee, foreign companies 
        establishing a branch, or regulated entities that require additional approvals 
        from sectoral regulators. Additionally, while incorporation grants a company 
        legal existence, it does not automatically authorise the company to carry out 
        regulated activities. Depending on the nature of the business, licences, permits, 
        or regulatory approvals from relevant authorities may still be required before 
        operations can commence.
        `,
      },
    ],
  })

  static dashboard = new Glossary({
    id: "dashboard",
    number: 47,
    keywords: "",
    items: [
      {
        language: "en",
        title: `DASHBOARD`,
        summary: `Dashboard means the landing webpage use to navigate to the core services offered by iCompany`,
        description: `<b>What's Important</b>
        <br>
        Lorem Ipsum.
        <br><br>
        <b>Why it Matters</b>
        <br>
        Lorem Ipsum
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        Lorem Ipsum
        <br>
        Lorem Ipsum`,
      },
    ],
  })

  static nameReservation = new Glossary({
    id: "name-reservation",
    number: 48,
    keywords: "name reservation, reservation of name",
    items: [
      {
        language: "en",
        title: `NAME RESERVATION`,
        summary: `Name reservation is the process of securing a proposed company name with 
        the Companies Commission of Malaysia (SSM) before proceeding with incorporation 
        under the Companies Act 2016. It allows an applicant to temporarily reserve a 
        name so that it cannot be used by another party during the reservation period 
        while preparation for incorporation is being completed.`,
        description: `<b>What's Important</b>
        <br>
        A proposed company name must be submitted to SSM for approval to ensure that 
        it is not identical or confusingly similar to an existing registered company, 
        business, or trademark, and that it does not contain prohibited or undesirable words. 
        Once approved, the name will be reserved for a period of thirty (30) days from the 
        date of approval. During this period, the applicant may proceed to submit the 
        incorporation application using the reserved name. If the incorporation is 
        not completed within the reservation period, the name reservation will lapse 
        unless a further reservation application is made.
        <br><br>
        <b>Why it Matters</b>
        <br>
        Name reservation provides certainty and protection during the early stage of forming a company. It prevents other applicants from registering the same name while the founders are preparing the necessary incorporation documents, such as shareholder details, director appointments, and registered office information. This is particularly important for businesses that have already begun branding, marketing, or negotiating contracts under a proposed name. Reserving the name ensures that the intended corporate identity remains available until incorporation is completed.
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        The reservation and approval of company names are governed by the Companies Act 2016, 
        particularly 
        ${this.glossaryLink("section-26", "Section 26")}, which allows an applicant to apply to the Registrar for the 
        reservation of a name intended for use in the incorporation of a company. Upon approval, 
        the name is reserved for the statutory period prescribed by the Registrar.
        <br><br>
        <b>Exceptions</b>
        <br>
        A proposed name may be rejected or refused by the Registrar if it is considered undesirable, misleading, offensive, or identical to an existing registered name. Names that imply royal patronage, government affiliation, or regulated activities may also require prior approval from relevant authorities before the reservation can be granted. Even if a name is successfully reserved, the Registrar retains the power to direct a company to change its name after incorporation if it is later found to contravene statutory naming requirements or infringe on existing rights.
        `,
      },
    ],
  })

  static registerOfDirectors = new Glossary({
    id: "register-of-directors",
    number: 51,
    keywords: "register of directors, register of director",
    items: [
      {
        language: "en",
        title: `REGISTER OF DIRECTORS`,
        summary: `The Register of Directors is a statutory record maintained by a company that contains the prescribed particulars of all individuals who serve as directors of the company. It forms part of the company’s internal corporate records required under the Companies Act 2016 and must be kept at the company’s registered office or another location notified to the Companies Commission of Malaysia (SSM).`,
        description: `<b>What's Important</b>
        <br>
        The Register of Directors must include key particulars of each director, including their full name, identification number, nationality, residential address, date of appointment, and date of cessation (if applicable). The register must be kept accurate and up to date, and any change in the composition of directors must be recorded promptly.
        <br><br>
        This register serves as the company’s official internal record of who is entrusted with the management and oversight of the company’s affairs. It must be available for inspection by directors and, where permitted, by members or regulators.
        <br><br>
        <b>Why it Matters</b>
        <br>
        The Register of Directors provides transparency and accountability regarding who is responsible for directing the company’s management and strategic decisions. It ensures that the company maintains a clear and reliable record of its governing individuals, which is essential for corporate governance and regulatory compliance. Maintaining this register also assists regulators, auditors, financial institutions, and other stakeholders in verifying the identity and authority of individuals acting on behalf of the company.
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        The requirement to maintain a Register of Directors is provided under Section 58 of the Companies Act 2016. The section requires every company to keep a register containing the particulars of its directors and to update the register whenever there are changes to the board of directors.
        <br><br>
        <b>Exceptions</b>
        <br>
        It is a mandatory statutory record for all companies. However, the location of the register may differ if the company chooses to keep it at a place other than the registered office, provided the Registrar is duly notified. Failure to maintain or update the Register of Directors may constitute a statutory offence and may expose the company and its officers to penalties under the Companies Act 2016.`,
      },
    ],
  })

  static company = new Glossary({
    id: "company",
    number: 53,
    keywords: "company, sdn bhd, berhad",
    items: [
      {
        language: "en",
        title: `COMPANY`,
        summary: `A company is a legal entity incorporated under the Companies Act 2016 that exists separately from its shareholders, directors, and founders. Once registered with the Companies Commission of Malaysia (SSM), the company acquires its own legal personality and can carry out business activities in its own name.`,
        description: `<b>What's Important</b>
        <br>
        A company has the status of a body corporate, meaning it has the legal capacity 
        to own property, enter contracts, incur liabilities, sue, and be sued independently
        of its members. In Malaysia, the most common form is a private company limited by 
        shares (Sdn. Bhd.), where the liability of shareholders is limited to the amount 
        unpaid on their shares.
        <br>
        <br>
        The company operates through its 
        ${this.glossaryLink("director", "directors")}, 
        who manage its affairs, while 
        ${this.glossaryLink("shareholder", "shareholders")}
        act as the owners of the company through their shareholdings. 
        This separation between ownership and management forms the foundation of 
        modern corporate governance.
        <br><br>
        <b>Why it Matters</b>
        <br>
        The concept of a company enables businesses to operate with limited liability protection,
        meaning the personal assets of shareholders are generally protected from the company’s 
        debts and obligations. It also allows businesses to exist with perpetual succession, 
        meaning the company continues to exist even if its shareholders or directors change. 
        This provides stability, continuity, and credibility when dealing with regulators, 
        financial institutions, investors, and commercial partners.
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        The definition and legal recognition of a company are established under the Companies 
        Act 2016. Section 2 of the Act defines a company as a company incorporated under the 
        Act or under any corresponding previous written law.
        <br><br>
        Upon incorporation, the company becomes a body corporate with the powers and attributes 
        provided under the Act, including the ability to exercise all the functions of an 
        incorporated entity.
        <br><br>
        <b>Exceptions</b>
        <br>
        Not all business activities are carried out through companies. Businesses may 
        also operate as 
        ${this.glossaryLink("sole-propietorships", "sole proprietorships")}
        or 
        ${this.glossaryLink("partnership", "partnerships")}, which do not have separate 
        legal personality from their owners. Additionally, certain specialised entities 
        such as companies limited by guarantee, foreign company branches, and regulated 
        financial institutions may be subject to additional statutory requirements or 
        regulatory oversight beyond the general provisions applicable to standard private 
        companies limited by shares.`,
      },
    ],
  })

  static berhad = new Glossary({
    id: "berhad",
    number: 54,
    keywords: "berhad, bhd",
    items: [
      {
        language: "en",
        title: `BERHAD`,
        summary: `“Berhad” (abbreviated as Bhd) refers to a public company limited by shares incorporated 
        under the Companies Act 2016. The term “Berhad” must appear at the end of the company’s name to 
        indicate that the company’s shares may be offered to the public and that the liability of its 
        shareholders is limited to the amount unpaid on their shares. Such companies are registered 
        with the Companies Commission of Malaysia (SSM).`,
        description: `<b>What's Important</b>
        <br>
        A Berhad company differs from a 
        ${this.glossaryLink("sdn-bhd", "Sendirian Berhad (Sdn Bhd)")}
        primarily in its ability to offer shares to the public and have an unlimited number of shareholders. 
        Many Berhad companies choose to list their shares on the Bursa Malaysia, although listing is not mandatory 
        for all public companies. A Berhad company is also subject to stricter governance, disclosure, and 
        reporting requirements, including the holding of statutory meetings, greater transparency obligations, 
        and compliance with regulatory frameworks applicable to public companies.
        <br><br>
        <b>Why it Matters</b>
        <br>
        The Berhad structure enables companies to raise capital from the public by issuing shares, allowing 
        them to fund expansion, large-scale projects, or long-term strategic growth. It also increases the 
        company’s visibility and credibility in the market, particularly when listed on a stock exchange. 
        However, with greater access to capital comes greater regulatory scrutiny, requiring stronger 
        governance practices, more comprehensive reporting, and adherence to securities regulations.
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        The legal framework governing Berhad companies is provided under the Companies Act 2016, which 
        distinguishes between private companies and public companies. A public company must have at 
        least two directors who ordinarily reside in Malaysia and must comply with statutory requirements 
        applicable to public entities. If the company intends to offer shares to the public or list its 
        securities, it must also comply with the Capital Markets and Services Act 2007 and other regulatory 
        requirements of Securities Commission Malaysia and, where applicable, Bursa Malaysia.
        <br><br>
        <b>Exceptions</b>
        <br>
        Not all Berhad companies are publicly listed. A company may be incorporated as a Berhad without 
        listing its shares on a stock exchange. However, if it intends to offer securities to the public, 
        it must comply with additional capital market regulations. Conversely, a 
        ${this.glossaryLink("sdn-bhd", "Sendirian Berhad (Sdn Bhd)")}
        cannot offer its shares to the public and is restricted in the transferability of its shares, 
        which distinguishes it from the Berhad structure.`,
      },
    ],
  })

  static constitution = new Glossary({
    id: "constitution",
    number: 55,
    keywords: "constitution, constitutions",
    items: [
      {
        language: "en",
        title: `Constitution`,
        summary: `A Constitution is a legally binding document that governs a company’s internal management and affairs. Under Malaysian law, a company is not required to have a Constitution unless it chooses to adopt one. In the absence of a Constitution, the company is automatically governed by the Third Schedule of the Companies Act 2016, which sets out default rules on directors’ powers, meetings, share matters, and internal governance.`,
        description: `<b>What's Important</b>
        <br>
        The Constitution allows a company to customise its internal rules beyond the default statutory provisions.
        This may include tailored arrangements on directors’ authority, share transfers, dividend policies, quorum
        requirements, and decision-making thresholds. Once adopted, the Constitution binds the company, its directors,
        and its members as a statutory contract.
        <br><br>
        If no Constitution is adopted, the Third Schedule applies by operation of law, without flexibility.
        <br><br>
        <b>Why it Matters</b>
        <br>
        Whether to adopt a Constitution is a strategic decision.
        For simple or early-stage companies, relying on the Third Schedule may be sufficient. For companies with multiple founders, family ownership, investor involvement, or bespoke control arrangements, a Constitution provides clarity, certainty, and risk management.
        <br><br>
        That said, a Constitution does not eliminate compliance obligations. It merely shapes how the company operates internally within the framework of the law. It cannot abrogate nor can it change any mandatory provisions of any laws.
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        <ul class="padding-zero">
          <li>
            <b>Section 31</b> – Company may adopt a Constitution
          </li>
          <li>
            <b>Section 32</b> – Effect of Constitution (statutory contract)
          </li>
          <li>
            <b>Section 33</b> – Amendment of Constitution by special resolution
          </li>
          <li>
            <b>Third Schedule</b> – Default governance rules where no Constitution exists
          </li>
        </ul>
        <br>
        <b>Exceptions</b>
        <br>
        A Constitution is optional, not mandatory. Once adopted, it prevails over the Third Schedule to the extent permitted by law. Any amendment requires a special resolution and lodgement with SSM. The Constitution cannot override mandatory provisions of the Companies Act 2016.`,
      },
    ],
  })

  static memorandum = new Glossary({
    id: "memorandum-of-association",
    number: 56,
    keywords: "memorandum, articles of association, m&a, mna",
    items: [
      {
        language: "en",
        title: `MEMORANDUM AND ARTICLES OF ASSOCIATION`,
        summary: `The Memorandum of Association and Articles of Association (M&A) (not to be confused with another M&A which means mergers and acquisition) were historically the constitutional documents that governed the formation and internal management of a company. These documents were required under the former Companies Act 1965 and defined the company’s structure, objectives, and internal rules.
        <br><br>
        Under the current Companies Act 2016, the Memorandum and Articles of Association have been replaced by a single document known as the Constitution of a company, although older companies incorporated before the Act may still operate under their existing Memorandum and Articles.`,
        description: `<b>What's Important</b>
        <br>
        The Memorandum of Association traditionally defined the company’s fundamental characteristics, including its name, registered office, liability of members, share capital, and the objects or purposes of the company. The Articles of Association, on the other hand, governed the internal rules and procedures of the company, including matters such as the powers of directors, conduct of meetings, appointment of directors, transfer of shares, and rights of members.
        <br><br>
        Together, these documents functioned as the constitutional framework of the company, setting out both the external scope of the company’s activities and the internal governance mechanisms.
        <br><br>
        <b>Why it Matters</b>
        <br>
        These documents historically served as the contractual foundation between the company and its members, and among the members themselves. They established the legal boundaries within which the company could operate and provided a clear governance structure for decision-making and management. Although the modern Companies Act 2016 simplifies this structure by introducing the optional company constitution, understanding the Memorandum and Articles remains important, particularly for companies incorporated under earlier legislation or when interpreting legacy corporate documents.
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        Under the Companies Act 2016, the concept of the Memorandum and Articles of Association has been replaced with a single constitutional document known as the Constitution. Section 31 allows a company to adopt a constitution if it wishes to regulate its internal affairs beyond the default rules provided under the Act. Companies incorporated before the commencement of the Companies Act 2016 may continue to rely on their existing Memorandum and Articles, which are deemed to form part of the company’s constitution unless altered or replaced.
        <br><br>
        <b>Exceptions</b>
        <br>
        New companies incorporated under the Companies Act 2016 are not required to adopt a constitution. In the absence of one, the company will be governed by the default provisions of the Companies Act 2016, particularly those set out in the Third Schedule relating to internal governance. However, companies with specialised governance arrangements, shareholder rights structures, or investment frameworks may still adopt a customised constitution to regulate matters not fully addressed by the statutory defaults.
        `,
      },
    ],
  })

  static resolution = new Glossary({
    id: "resolution",
    number: 61,
    keywords: "resolutions, resolution, dcr, mcr",
    items: [
      {
        language: "en",
        title: `RESOLUTION`,
        summary: `A resolution is a formal decision or determination made by a company through its authorised
        decision-making body either the board of directors or the shareholders. Resolutions record approval,
        consent, or direction on specific corporate matters and serve as legal evidence that decisions have
        been properly made in accordance with the Companies Act 2016 and the company’s constitution.`,
        description: `<b>What's Important</b>
        <br>
        A resolution is not an informal agreement or verbal consent. It is recommended to be factual 
        and not opinionated to avoid legal implications.
        <br>
        It is a documented exercise of authority that authorises the company to act. Resolutions may 
        be passed at duly convened meetings or by written circulation, subject to statutory requirements
        and the company’s constitution. Not all resolutions are the same. Some are routine and administrative,
        while others require higher thresholds of approval, such as:
        <ul class="padding-zero">
          <li>
            <b>Ordinary resolutions</b> – simple majority
          </li>
          <li>
            <b>Special resolutions</b> – at least 75% approval
          </li>
        </ul>
        Understanding the correct type of resolution is essential for validity and compliance.
        <br><br>
        <b>Why it Matters</b>
        <br>
        Resolutions form the backbone of corporate governance and accountability. <br>
        They demonstrate that directors and shareholders have discharged their duties properly 
        and that corporate actions, such as opening bank accounts, appointing officers, approving 
        contracts, or making statutory filings are lawfully authorised. Banks, regulators, auditors, 
        investors, and courts rely on resolutions to verify that decisions were made correctly. Missing, 
        defective, or improperly passed resolutions may result in rejected applications, regulatory breaches, 
        delayed transactions, or personal liability for directors.
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        The Companies Act 2016 recognises resolutions as the lawful mechanism for corporate decision-making, including but not limited to:
        <ul class="padding-zero">
          <li>
            <b>Section 290</b> – Board decisions and directors’ resolutions
          </li>
          <li>
            <b>Section 291</b> – Written resolutions of the board
          </li>
          <li>
            <b>Sections 292–300</b> – Members’ resolutions (ordinary and special resolutions)
          </li>
        </ul>
        Numerous provisions of the Act require specific resolutions for actions such as appointments, 
        removals, approval of financial statements, constitutional amendments, and major transactions.
        <br><br>
        <b>Exceptions</b>
        <br>
        A resolution is only valid if it is:
        <ul class="padding-zero">
          <li>
            Passed by the correct authority (board or members),
          </li>
          <li>
            Approved in accordance with quorum, voting, and procedural requirements, and
          </li>
          <li>
            Consistent with the Companies Act 2016 and the company’s constitution.
          </li>
        </ul>
        Resolutions cannot legitimise illegal acts, override mandatory statutory provisions, or 
        absolve directors from their fiduciary duties. Even where a resolution exists, directors 
        remain accountable for the substance and consequences of the decision.
        `,
      },
    ],
  })

  static directorCircularResoltuion = new Glossary({
    id: "director-circular-resolution",
    number: 61,
    keywords: "dcr, director resolution, director circular resolution",
    items: [
      {
        language: "en",
        title: `DIRECTORS’ CIRCULAR RESOLUTION (DCR)`,
        summary: `A Directors’ Circular Resolution is a written board resolution passed without a physical board meeting, 
        where all directors are notified and the required majority (or unanimity, if required) signify their 
        agreement in writing or by electronic means.In substance, a DCR carries the same legal force as
        a resolution passed at a duly convened board meeting.`,
        description: `<b>What's Important</b>
        <br>
        A DCR is not informal consent and not a shortcut.
        <br>
        It is a formal board decision made through circulation instead of discussion in a meeting.
        <br>
        Key characteristics:
        <ul class="padding-zero">
          <li>
            Circulated to all directors entitled to vote
          </li>
          <li>
            Approved in writing or electronically (including digital platforms)
          </li>
          <li>
            Recorded as part of the company’s statutory records
          </li>
          <li>
            Effective on the date the required approval threshold is met
          </li>
        </ul>
        A director cannot abstain from a DCR unless the Companies Act 2016 or the company’s constitution expressly allows it.
        <br><br>
        <b>Why it Matters</b>
        <br>
        DCRs allow companies to:
        <ul class="padding-zero">
          <li>
            Make timely decisions without waiting for meetings
          </li>
          <li>
            Maintain governance continuity, especially for urgent or administrative matters
          </li>
          <li>
            Support digital and paperless board processes
          </li>
        </ul>
        Banks, auditors, regulators, and SSM routinely rely on DCRs as proof of valid board authorisation.
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        The legal basis for DCRs comes primarily from:
        <ul class="padding-zero">
          <li>
            <b>Section 291, Companies Act 2016</b> – Directors’ written resolutions
          </li>
        </ul>
        This section allows directors to pass resolutions by circulation, provided:
        <ul class="padding-zero">
          <li>
            The resolution is sent to every director, and
          </li>
          <li>
            The required number of directors agree to it in writing.
          </li>
        </ul>
        The company’s constitution may impose additional conditions or restrictions.
        <br><br>
        <b>Exceptions</b>
        <br>
        A DCR cannot be used where:
        <ul class="padding-zero">
          <li>
            The company’s constitution prohibits written resolutions
          </li>
          <li>
            The matter requires deliberation at a meeting (e.g. where discussion is mandatory)
          </li>
          <li>
            The resolution is passed without circulation to all directors
          </li>
        </ul>
        Importantly, directors approving a DCR remain fully subject to fiduciary duties, statutory duties,
        and liabilities under the Companies Act 2016, regardless of the absence of a meeting.
        `,
      },
    ],
  })

  static thirdSchedule = new Glossary({
    id: "third-schedule",
    number: 62,
    keywords:
      "third schedule of the act, third schedule, third schedule of the company act, third schedule company act",
    items: [
      {
        language: "en",
        title: `THIRD SCHEDULE OF THE ACT`,
        summary: `The Third Schedule is a basic statutory set of default governance rules prescribed under
        the Companies Act 2016. It automatically applies to a company that has not adopted a Constitution, regulating matters such as directors’ powers, board and members’ meetings, share issuance and transfers, dividends, and internal decision-making. It operates by force of law, without the need for adoption or member approval.`,
        description: `<b>What's Important</b>
        <br>
        Where a company does not have a Constitution, the Third Schedule fills the 'expected' governance gap . Its provisions are legally binding on the company, its directors, and its members, and serve as the baseline framework for corporate administration. The Third Schedule is designed to be functional and generic, ensuring that a company can operate lawfully even without bespoke internal rules.
        <br><br>
        <b>Why it Matters</b>
        <br>
        The Third Schedule provides certainty and continuity at incorporation, particularly for small or early-stage companies. However, because it is standardised, it may not reflect the commercial realities or control arrangements of more complex ownership structures. The best example of use of Third Schedule are written resolutions.
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        <ul class="padding-zero">
          <li>
            <b>Section 31(3)</b> – Application of Third Schedule where no Constitution is adopted
          </li>
          <li>
            <b>Section 32</b> – Binding effect of governance rules
          </li>
          <li>
            <b>Third Schedule</b> – Default rules on management, meetings, shares, and divide
          </li>
        </ul>`,
      },
    ],
  })

  static financialYearEnd = new Glossary({
    id: "financial-year-end",
    number: 63,
    keywords: "fye, financial, year end, first financial year end",
    items: [
      {
        language: "en",
        title: `FINANCIAL YEAR END`,
        summary: `The Financial Year End (or commonly referred to as FYE) is the date on which a company’s financial year concludes. It marks the point at which the company closes its accounting records and determines the period for which financial statements are prepared in accordance with the Companies Act 2016.`,
        description: `<b>What's Important</b>
        <br>
        The Financial Year End sets the timeline for the preparation of financial statements, audit (where applicable), tax reporting, and statutory filings, including to a certain extend information contained in the Annual Return. For newly incorporated companies, the first financial year may extend up to 18 months, providing flexibility in aligning accounting and operational cycles.
        <br><br>
        Once determined, changes to the Financial Year End are regulated and not freely adjustable.
        <br><br>
        <b>Why it Matters</b>
        <br>
        The Financial Year End anchors a company’s compliance calendar. An appropriate FYE supports orderly financial reporting, predictable statutory deadlines, and efficient engagement with auditors, tax agents, and regulators. An ill-considered FYE may lead to compressed timelines, avoidable compliance pressure, or regulatory exposure.
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        Section 248 of the Companies Act 2016 governs the duration of a company’s financial year, including the maximum period for the first financial year and restrictions on subsequent changes.
        <br><br>
        <b>Exceptions</b>
        <br>
        The extended period of up to 18 months applies only to the first financial year. Subsequent financial years must not exceed 12 months unless otherwise permitted under the Companies Act 2016 or approved by the Registrar. Failure to comply with prescribed financial year requirements may expose the company and its officers to regulatory action.`,
      },
    ],
  })

  static termsOfReference = new Glossary({
    id: "terms-of-reference",
    number: 64,
    keywords: "terms, terms of reference, term of reference, reference, tor, t.o.r",
    items: [
      {
        language: "en",
        title: `TERMS OF REFERENCE (TOR)`,
        summary: `
          Terms of Reference (ToR) is a formal governance document that defines the scope, authority, responsibilities, 
          and limitations of a body, committee, officer, or role within a company. It serves as an internal framework 
          to clarify <i>who is empowered to do what, within what boundaries</i>, and <i>subject to what oversight</i>.
          <br>
          In the corporate context, a ToR is commonly adopted for the Board of Directors, board committees (such as 
          Audit, Risk, or Nomination Committees), management committees, or specific officers. While not mandatory 
          under Malaysian law for all companies, it is <b>widely regarded as a hallmark of sound governance practice</b>.
        `,
        description: `
          <b>What’s important?</b>
          <br>
          A Terms of Reference:
          <ul class="padding-zero">
            <li>Clarifies decision-making authority and reporting lines</li>
            <li>Prevents overlap, ambiguity, or informal assumption of powers</li>
            <li>Promotes discipline, consistency, and accountability in governance</li>
            <li>Serves as an internal control mechanism, especially as the company grows</li>
          </ul>
          Where a company’s Constitution sets out what is legally permissible, the ToR governs how powers are exercised 
          in practice.
          <br><br>
          <b>Why it matters?</b>
          <br>
          In practice, many governance failures do not arise from bad faith, but from unclear roles and informal decision-making. 
          The absence of a clear ToR often results in:
          <ul class="padding-zero">
            <li>Decisions made without proper authority</li>
            <li>Committees acting beyond their intended remit</li>
            <li>Directors or officers assuming powers by convention rather than mandate</li>
            <li>Increased operational, governance, and regulatory risk</li>
          </ul>
          A well-drafted ToR strengthens internal governance by embedding structure and discipline into everyday decision-making. 
          For shareholders, regulators, auditors, and counterparties, it signals that the company operates with <b>defined 
          accountability rather than ad hoc control</b>.
          <br>
          From a risk perspective, a ToR also provides a reference point when assessing whether actions were taken <b>within authority</b>, 
          which can be critical in disputes, audits, or regulatory scrutiny.
          <br><br>
          <b>Companies Act 2016 or other applicable laws</b>
          <br>
          The Companies Act 2016 does not prescribe a mandatory Terms of Reference. However, its relevance is implied through:
          <ul class="padding-zero">
            <li>Section 211 – directors’ duty to act in good faith and for proper purpose</li>
            <li>Section 213 – duty to exercise reasonable care, skill, and diligence</li>
            <li>Section 216 – delegation of powers by the board</li>
          </ul>
          A ToR operationalises these statutory duties by defining how authority is delegated and exercised, and by whom.
          <br>
          In listed or regulated entities, ToRs are often required or strongly encouraged under <b>codes of corporate governance, 
          regulatory guidelines, or industry best practices</b>.
          <br><br>
          <b>Exceptions / Limitations</b>
          <br>
          A Terms of Reference:
          <ul class="padding-zero">
            <li>Cannot override the Companies Act 2016</li>
            <li>Cannot contradict the company’s Constitution</li>
            <li>Does not absolve directors of statutory duties or liabilities</li>
          </ul>
          Where there is any inconsistency, the Act prevails first, followed by the Constitution, and only then the ToR. 
          Accordingly, a ToR must be reviewed and updated whenever there are material changes to the law, the Constitution, 
          or the company’s governance structure.
          <br>
          Failure to observe a ToR may not automatically invalidate a decision, but <b>it may evidence weak governance practices<b> 
          and expose the company and its officers to heightened scrutiny and risk.
        `,
      },
    ],
  })

  static soleProprietorship = new Glossary({
    id: "sole-proprietorship",
    number: 65,
    keywords: "sole proprietorship, enterprise",
    items: [
      {
        language: "en",
        title: `SOLE PROPRIETORSHIP`,
        summary: `A sole proprietorship or an enterprise is a trade or business owned and operated by a single individual, where the owner and the business are legally the same person. In Malaysia, sole proprietorships are registered with the Companies Commission of Malaysia (SSM) under the Registration of Businesses Act 1956 rather than the Companies Act 2016.`,
        description: `<b>What's Important</b>
        <br>
        A sole proprietorship does not have a separate legal personality from its owner. This means the business owner is personally responsible for all debts, obligations, and liabilities incurred by the business. Registration typically requires the owner’s personal details, the business name (if different from the owner’s personal name), the nature of the business, and the business address. Once registered, the business operates under the registered name, but legally it remains inseparable from the proprietor.
        <br><br>
        <b>Why it Matters</b>
        <br>
        The structure offers simplicity and low administrative burden, making it a common starting point for small businesses, freelancers, and individual entrepreneurs. The owner retains full control over business decisions and profits without the governance structure required of companies. However, because there is no limited liability protection, the owner’s personal assets may be exposed to claims from business creditors. This risk is often the key reason why growing businesses eventually consider incorporating a company.        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        Sole proprietorships are governed primarily by the Registration of Businesses Act 1956 and administered by the Companies Commission of Malaysia (SSM). Unlike companies incorporated under the Companies Act 2016, sole proprietorships are not required to maintain corporate governance structures such as directors, shareholders, or statutory registers.
        <br><br>
        <b>Exceptions</b>
        <br>
        Only Malaysian citizens or permanent residents are allowed to register a sole proprietorship in Malaysia. Foreign individuals generally cannot operate a sole proprietorship unless they obtain the appropriate approvals under other regulatory frameworks. Additionally, certain regulated activities may require specific licences or permits from relevant authorities regardless of whether the business is operated as a sole proprietorship or another legal structure.`,
      },
    ],
  })

  static partnership = new Glossary({
    id: "partnership",
    number: 67,
    keywords: "partnership, partner",
    items: [
      {
        language: "en",
        title: `PARTNERSHIP`,
        summary: `A partnership is a business structure where two or more individuals carry on a business in common with a view of profit. In Malaysia, partnerships are registered with the Companies Commission of Malaysia (SSM) under the Registration of Businesses Act 1956 and are generally governed by the Partnership Act 1961.`,
        description: `<b>What's Important</b>
        <br>
        A partnership does not have a separate legal personality from its partners. This means each partner is jointly responsible for the obligations and liabilities of the business. In most cases, partners also have joint and several liability, meaning a creditor may pursue any partner individually for the full amount of the partnership’s debts. Partnerships typically operate based on a partnership agreement, which outlines matters such as profit sharing, decision-making authority, capital contributions, and procedures for admitting or retiring partners. In the absence of such an agreement, the default rules under the Partnership Act 1961 will apply.
        <br><br>
        <b>Why it Matters</b>
        <br>
        Partnerships allow individuals to pool resources, expertise, and capital while sharing profits and responsibilities in running the business. This structure is commonly used for professional practices, family businesses, or ventures where collaboration between partners is essential. However, because partners are personally liable for the actions and debts of the partnership, the conduct of one partner may legally bind the others. This creates both operational flexibility and potential legal exposure.        
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        Partnerships are primarily regulated under the Partnership Act 1961. The Act defines a partnership and establishes the default legal framework governing the rights, duties, and liabilities of partners. Registration of the partnership business name is required under the Registration of Businesses Act 1956 unless your are running a business that requires the approval of a Professional Body for example the Bar Council.
        <br><br>
        <b>Exceptions</b>
        <br>
        The number of partners in a conventional partnership is generally limited to twenty (20), except for certain professional partnerships regulated under separate legislation. Businesses that exceed this threshold must typically be incorporated as a company. Additionally, a partnership should not be confused with a 
        ${this.glossaryLink("limited-liability-partnership", "Limited Liability Partnership (LLP)")}
        , which is a separate legal structure established under the Limited Liability Partnerships Act 2012 and provides partners with limited liability protection.`,
      },
    ],
  })

  static limitedLiabilityPartnership = new Glossary({
    id: "limited-liability-partnership",
    number: 68,
    keywords: "limited liability partnership, llp, limited partnership",
    items: [
      {
        language: "en",
        title: `LIMITED LIABILITY PARTNERSHIP`,
        summary: `A Limited Liability Partnership (LLP) is a hybrid business structure that combines elements of a partnership and a company. It provides the operational flexibility of a partnership while granting its partners limited liability protection similar to that of a company. In Malaysia, LLPs are registered with the Companies Commission of Malaysia (SSM) under the Limited Liability Partnerships Act 2012.`,
        description: `<b>What's Important</b>
        <br>
        An LLP is a separate legal entity distinct from its partners. This means the LLP can own property, enter contracts, sue, and be sued in its own name. The partners are generally not personally liable for the debts and obligations of the LLP beyond their agreed contributions, except in cases of fraud, wrongful acts, or personal guarantees. An LLP must have at least two partners and at least one compliance officer who is either a partner or a person qualified to act as a company secretary and who is ordinarily resident in Malaysia. The compliance officer is responsible for ensuring that the LLP complies with statutory requirements.
        <br><br>
        <b>Why it Matters</b>
        <br>
        The LLP structure provides liability protection while maintaining the flexibility of internal management typically associated with partnerships. Unlike companies, LLPs are not required to have directors, shareholders, or complex corporate governance structures. This makes LLPs particularly suitable for professional practices, consulting firms, and collaborative ventures, where partners wish to share management responsibilities while limiting personal exposure to the liabilities of the business.
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        LLPs are primarily governed by the Limited Liability Partnerships Act 2012 and regulated by the Companies Commission of Malaysia (SSM). Although LLPs share certain characteristics with companies, they are not governed by the Companies Act 2016 and therefore are not subject to corporate governance requirements such as directors’ meetings, shareholder resolutions, or statutory registers typical of companies.
        <br><br>
        <b>Exceptions</b>
        <br>
        Despite providing limited liability protection, partners remain personally liable for their own wrongful acts, omissions, or professional negligence committed in the course of the LLP’s business. Additionally, certain regulated professions may be subject to additional licensing or regulatory requirements imposed by their respective professional bodies, even if they operate through an LLP structure.
        `,
      },
    ],
  })

  static shareholder = new Glossary({
    id: "shareholder",
    number: 69,
    keywords: "shareholder, shareholders",
    items: [
      {
        language: "en",
        title: `SHAREHOLDER`,
        summary: `A shareholder is a person or legal entity that owns one or more shares in a company, thereby holding an ownership interest in that company. In Malaysia, shareholders are members of a company incorporated under the Companies Act 2016 and their particulars are recorded in the company’s Register of Members maintained in accordance with the Act.`,
        description: `<b>What's Important</b>
        <br>
        Shareholders provide capital to the company in exchange for shares and are entitled to certain rights attached to those shares. 
        These rights commonly include the right to receive 
        ${this.glossaryLink("dividends", "dividends")} (if declared), the right to vote on certain company matters, and the right to share in the distribution of assets upon 
        ${this.glossaryLink("winding-up", "winding up")}.
        <br>
        <br>
        Although shareholders are the owners of the company, they do not manage its day-to-day operations. Management authority is typically delegated to the board of directors, while shareholders exercise their influence through resolutions at general meetings or through written resolutions.
        <br><br>
        <b>Why it Matters</b>
        <br>
        The shareholder structure determines ownership, control, and economic interest in a company. Shareholders collectively influence major corporate decisions such as the appointment or removal of directors, approval of financial statements, amendments to the company’s constitution, and other significant corporate actions. The concept of shareholding also enables companies to raise capital by issuing shares, allowing businesses to grow while distributing ownership among investors.
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        The rights and responsibilities of shareholders are governed primarily by the Companies Act 2016. The Act sets out provisions relating to membership of a company, shareholder meetings, voting rights, and the maintenance of the Register of Members as the official record of share ownership.
        <br><br>
        <b>Exceptions</b>
        <br>
        Not all shareholders have identical rights. Companies may issue different classes of shares with varying rights relating to voting, dividends, or capital distribution, depending on the company’s constitution or terms of issuance. Additionally, while shareholders enjoy limited liability protection in companies limited by shares, they may still be liable for any unpaid amount on their shares or for obligations personally guaranteed by them on behalf of the company.
        `,
      },
    ],
  })

  static declarationOfInterest = new Glossary({
    id: "declaration-of-interest",
    number: 70,
    keywords: "",
    items: [
      {
        language: "en",
        title: `DECLARATION OF INTEREST`,
        summary: `A declaration of interest refers to the statutory obligation of a director to disclose any direct or indirect interest that they have in a transaction, contract, or proposed arrangement involving the company. This disclosure ensures transparency in corporate decision-making and prevents conflicts between the personal interests of directors and the interests of the company under the Companies Act 2016.`,
        description: `<b>What's Important</b>
        <br>
        A director who is in any way interested in a contract or proposed contract with the company must formally declare the nature and extent of that interest to the board of directors. The declaration must be made as soon as practicable after the director becomes aware of the interest, typically during a board meeting or through a written notice to the company.
        <br><br>
        The declaration is usually recorded in the minutes of the board meeting, ensuring that the disclosure forms part of the company’s official corporate records. In many cases, the interested director may also refrain from participating in discussions or voting on the matter to avoid potential conflicts of interest.
        <br><br>
        <b>Why it Matters</b>
        <br>
        The requirement safeguards integrity and accountability in corporate governance. By disclosing personal interests, directors demonstrate that decisions affecting the company are made in the company’s best interests rather than for personal gain. It also protects the company and its stakeholders from situations where undisclosed conflicts could compromise business decisions, expose the company to legal disputes, or undermine trust among shareholders and regulators.
        <br><br>
        <b> Companies Act 2016 or other applicable laws</b>
        <br>
        The obligation for directors to declare their interests is provided under Section 221 of the Companies Act 2016. The section requires a director who is interested in a contract or proposed contract with the company to declare the nature of that interest at a meeting of the directors or by written notice to the company. Failure to properly disclose such interests may constitute a breach of statutory duty and may expose the director to penalties or other legal consequences under the Act.
        <br><br>
        <b>Exceptions</b>
        <br>
        A declaration may not be required in circumstances where the director’s interest is remote or insignificant, or where the interest arises solely from being a member of the company in common with other members. However, directors are generally expected to adopt a cautious and transparent approach, and where there is any reasonable possibility of a conflict, disclosure is advisable to ensure compliance with their fiduciary duties and statutory obligations.
        `,
      },
    ],
  })

  static commonSeal = new Glossary({
    id: "common-seal",
    number: 71,
    keywords: "common seal, seal, offical seal, register of seal",
    items: [
      {
        language: "en",
        title: `COMMON SEAL`,
        summary: `
          Also known as a Corporate Seal, is a traditional instrument used by a company to formally
          execute documents. Historically, the Common Seal served as the official signature of a
          company because a company, being a legal person, could not sign documents physically.
          The use of seals dates back to medieval times when seals were used to authenticate
          documents as signatures were uncommon and not standardised.
          <br><br>
          Under the Companies Act 2016, the use of a Common Seal is no longer mandatory, and
          companies may execute documents by authorised signatories instead. However, in practice,
          many banks, financial institutions, property transactions and legal documents still require the
          Common Seal due to internal policies, legacy procedures and institutional practices.
        `,
        description: `
          <b>What is important?</b>
          <br>
          If a company adopts a Common Seal, the Company should determine:
          <ul>
            <li>Where the Common Seal is kept (custody location)</li>
            <li>Who is authorised to use or affix the Common Seal</li>
            <li>The procedure for approving documents before the seal is affixed</li>
            <li>Maintaining a Seal Register or Register of Documents recording every document executed under seal</li>
          </ul>
          The Common Seal is usually affixed in the presence of directors, company secretary or
          authorised officers, and the document is signed to confirm that the seal was properly affixed.
          <br><br>
          <b>Why it matters?</b>
          <br>
          The Common Seal serves as an internal control mechanism to ensure that important
          documents are properly authorised before execution. It reduces the risk of unauthorised
          documents being executed on behalf of the company and creates a formal record of major
          corporate transactions such as property transfers, agreements, share certificates and deeds.
          <br><br>
          Although no longer required by law, many institutions still treat documents executed under
          Common Seal as more formal and authoritative.
          <br><br>
          <b>Companies Act 2016 or other applicable laws</b>
          <br>
          The Companies Act 2016 does not require a company to have a Common Seal.
          Section 66 of the Companies Act 2016 allows companies to execute documents by
          authorised signatories without using a Common Seal, unless the company’s Constitution
          requires otherwise.
          <br><br>
          If a Common Seal is used, the company should regulate its use through board resolutions or
          internal governance procedures.
          <br><br>
          <b>Exceptions</b>
          <br>
          Some documents, especially <b>land transfers, charge documents, banking facilities and certain
          legal documents</b>, may still require execution under Common Seal depending on the
          requirements of land offices, banks, lawyers or foreign jurisdictions.
          <br><br>
          In practice, the Common Seal continues to exist not because it is strictly required by law, but
          because many institutions and procedures still rely on it.
        `,
      },
    ],
  })

  static registerOfMembers = new Glossary({
    id: "register-of-members",
    number: 72,
    keywords: "register of members",
    items: [
      {
        language: "en",
        title: `REGISTER OF MEMBERS`,
        summary: `
          A Register of Members is the statutory register maintained by a company that records the details of its shareholders and their shareholdings in the company. A person is legally recognised as a member of a company once their name is entered into the Register of Members. The register serves as the official record of ownership of shares and membership in the company.
        `,
        description: `
          <b>What is important?</b>
          <br>
          The Register of Members must contain the name, identification or registration number, address of the member, number and class of shares held, and the date the person became or ceased to be a member. The register must be kept at the registered office or another approved location and must be updated whenever there is an allotment of shares, transfer of shares, transmission of shares, or any change in member particulars. Any changes to the Register of Members must be notified to the Registrar of Companies within the prescribed time period.
          <br><br>
          <b>Why it matters?</b>
          <br>
          The Register of Members is one of the most important statutory records of a company because it determines the legal ownership of shares, voting rights, dividend entitlements, and shareholder rights. In the event of disputes, the Register of Members is treated as prima facie evidence of share ownership. Failure to maintain an accurate and updated register may result in compliance issues, disputes among shareholders, and potential penalties under the Companies Act 2016.
          <br><br>
          <b>Companies Act 2016 or other applicable laws</b>
          <br>
          The Register of Members is governed primarily by Sections 50 and 51 of the Companies Act 2016, which require companies to keep a register of members and to notify the Registrar of any changes to the register. Other related provisions may include sections relating to share allotment, share transfer, and annual return disclosures.
          <br><br>
          <b>Exceptions</b>
          <br>
          There are generally no exemptions for maintaining a Register of Members as all companies are required to maintain this statutory register. However, updates to the register are only required when there are changes in shareholding, member details, or share structure. In companies with a single shareholder, the Register of Members is still required even though there is only one member recorded.
        `,
      },
    ],
  })

  static advanceFromDirector = new Glossary({
    id: "advance-from-director",
    number: 73,
    keywords: "advance from director",
    items: [
      {
        language: "en",
        title: `ADVANCE FROM DIRECTOR`,
        summary: `
          An Advance from Director refers to money provided by a director to the company to support the company’s operations, expenses, or cash flow. The amount is usually recorded in the company’s accounts as Amount Due to Director, which represents money owed by the company to the director.
        `,
        description: `
          <b>What is important?</b>
          <br>
          The advance should be properly recorded in the company’s accounting records with supporting documents such as bank transfer records or payment receipts. The company should keep a record of the amount advanced, date of advance, and any repayment terms. For governance purposes, the advance may also be documented through a Director’s Resolution.
          <br><br>
          <b>Why it matters?</b>
          <br>
          Properly recording advances from directors ensures accurate financial records and clear separation between the company’s money and the director’s personal money. It also avoids confusion between loans, capital contribution, and company income, and helps ensure proper governance and audit trail.
          <br><br>
          <b>Companies Act 2016 or other applicable laws</b>
          <br>
          While advances from directors are generally allowed, companies must maintain proper accounting records under Section 245 of the Companies Act 2016, and directors must act in the best interest of the company under Section 213 of the Companies Act 2016.
          <br><br>
          <b>Exceptions</b>
          <br>
          If the director does not intend to claim repayment, the amount may be treated as capital contribution instead of an advance. If the amount is intended to be converted into shares, it should be treated as share capital or share application money instead of an advance.
        `,
      },
    ],
  })

  static delegationOfAuthority = new Glossary({
    id: "delegation-of-authority",
    number: 74,
    keywords: "delegation, delegation of authority, section 216, kuasa,",
    items: [
      {
        language: "en",
        title: `DELEGATION OF AUTHORITY`,
        summary: `
          Delegation of Authority refers to the formal assignment of decision-making power and operational responsibility from the Board of Directors (or senior management) to designated individuals within the Company. It defines who can act, within what limits, and under what conditions on behalf of the Company.
        `,
        description: `
          <b>What is important?</b>
          <br>
          A Delegation of Authority is akin to setting up a framework that typically sets out:
          <ul>
            <li>The scope of powers delegated (e.g. entering contracts, approving payments, hiring decisions)</li>
            <li>Financial thresholds and approval limits</li>
            <li>Roles and hierarchy of authority (e.g. CEO, Manager, department heads)</li>
            <li>Matters reserved exclusively for the Board</li>
            <li>Conditions, reporting obligations, and accountability mechanisms</li>
          </ul>
          The delegation must be clear, documented, and aligned with the Company’s constitution, board resolutions, and internal governance policies.
          <br><br>
          <b>Why it matters?</b>
          <br>
          Delegation enables operational efficiency by allowing decisions to be made at the appropriate level without constant Board involvement. At the same time, it preserves governance integrity by ensuring that authority is exercised within defined boundaries.
          <br>
          Improper or unclear delegation may result in:
          <ul>
            <li>Unauthorised transactions</li>
            <li>Breach of directors’ duties</li>
            <li>Internal disputes over authority</li>
            <li>Potential invalidity of contracts entered into</li>
          </ul>
          <b>Companies Act 2016 or other applicable laws</b>
          <br>
          Under the Companies Act 2016, directors retain ultimate responsibility for the management of the Company, even when authority is delegated.
          <ul>
            <li>Section 211: Directors are responsible for the management of the business and affairs of the Company</li>
            <li>Common law principles: Delegation is permitted, but not abdication of duty</li>
          </ul>
          Directors must exercise reasonable care, skill, and diligence in supervising any delegated authority.
          <br><br>
          <b>Exceptions</b>
          <br>
          Certain matters generally cannot be delegated and must remain with the Board or shareholders, such as:
          <ul>
            <li>Approval of financial statements</li>
            <li>Declaration of dividends</li>
            <li>Issuance of shares</li>
            <li>Major corporate transactions (e.g. disposal of substantial assets)</li>
          </ul>
          These are typically referred to as reserved matters either by law, the constitution, or Board policy and is often observed by Company Secretary.
        `,
      },
    ],
  })

  static template = new Glossary({
    id: "",
    number: 99,
    keywords: "",
    items: [
      {
        language: "en",
        title: ``,
        summary: ``,
        description: ``,
      },
    ],
  })

  // The main list, now populated from the static properties above for a single source of truth.
  static GLOSSARY_LIST: Glossary[] = [
    this.alternativeDirector,
    this.auditedFinancialStatement,
    this.exemptPrivateCompany,
    this.director,
    this.nomineeDirector,
    this.independentDirector,
    this.shadowDirector,
    this.sdnBhd,
    this.financialStatements,
    this.managementAccounts,
    this.annualReturn,
    this.superform,
    this.registeredAddress,
    this.subscription,
    this.switchToUs,
    this.actionRequired,
    this.certificateOfIncorporation,
    this.certificateOfChangeOfName,
    this.ssmCorporateProfile,
    this.beneficialOwnership,
    this.listing,
    this.initialPublicOfferingIpo,
    this.prospectus,
    this.rightsIssue,
    this.bonusIssue,
    this.shareBuyback,
    this.businessAddress,
    this.capitalReduction,
    this.financialAssistance,
    this.charge,
    this.windingUp,
    this.strikingOff,
    this.reinstatementOfCompany,
    this.liquidator,
    this.receiversAndManagers,
    this.officialReceiver,
    this.solvencyTest,
    this.dividends,
    this.shareCapital,
    this.preferenceShares,
    this.ordinaryShares,
    this.classRights,
    this.minorityShareholderRights,
    this.sales,
    this.pasca,
    this.paymentStrip,
    this.incorporation,
    this.nameReservation,
    this.registerOfDirectors,
    this.company,
    this.berhad,
    this.constitution,
    this.memorandum,
    this.resolution,
    this.directorCircularResoltuion,
    this.thirdSchedule,
    this.financialYearEnd,
    this.termsOfReference,
    this.soleProprietorship,
    this.partnership,
    this.limitedLiabilityPartnership,
    this.shareholder,
    this.declarationOfInterest,
    // Draft Glossary Start form here
    this.dashboard,
    this.commonSeal,
    this.registerOfDirectors,
    this.advanceFromDirector,
    this.delegationOfAuthority,
  ]
}
