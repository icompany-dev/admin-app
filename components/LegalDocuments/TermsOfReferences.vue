<template>
  <div id="legal-document-terms-of-references">
    <Paper
      :paper-orientation="controller.paperOrientation"
      :is-use-letter-head="false"
      :additional-css-class="controller.additionalCssClass"
      :show-page-number="true"
      :total-pages="controller.totalPages()"
      :page-number="1"
      :show-watermark="props.showWatermark"
      :watermark-text="props.watermarkText"
    >
      <template #paperContent>
        <div class="document-header">
          <span class="company-name">
            <b>
              {{ controller.company.value.getFullName() }}
            </b>
          </span>
          <br />
          Company No:
          {{ controller.company.value.registrationNumberNew }}
          ({{ controller.company.value.registrationNumberOld }})
        </div>
        <div class="document-title">TERMS OF REFERENCE OF THE BOARD OF DIRECTORS</div>
        <div class="document-content">
          <table>
            <tbody>
              <tr class="section-title capitalize">
                <td>A.</td>
                <td>Purpose of the Terms of Reference</td>
              </tr>
              <tr class="section-content">
                <td>1.</td>
                <td>
                  The Board of Directors ("Board"), as constituted from time to time, shall be responsible for the
                  overall stewardship, leadership, and strategic direction of the Company.
                </td>
              </tr>
              <tr class="section-content">
                <td>2.</td>
                <td>
                  The Board shall act in the best interests of the Company as a whole, in accordance with the Companies
                  Act 2016, the Company's Constitution (if adopted), and all applicable written laws.
                </td>
              </tr>
              <tr class="section-content">
                <td>3.</td>
                <td>
                  This Terms of Reference is an internal governance instrument adopted by the Board and shall not limit,
                  derogate from, or replace any statutory or fiduciary duties imposed on Directors under the Company Act
                  2016 at law.
                </td>
              </tr>
              <tr class="section-title capitalize">
                <td>B.</td>
                <td>Authority of the Board</td>
              </tr>
              <tr class="section-content">
                <td>1.</td>
                <td>
                  This Terms of Reference is hereby confirmed, agreed and adopted by all the Board of Directors, as
                  constituted from time to time, deriving its authority form the Companies Act 2016
                  <span v-if="controller.hasConstitution()">and the Constitution</span>
                  <span v-if="!controller.isDocumentEditable()">
                    {{ controller.getAuthorityIncludeResolutionsOfMembers() }}
                  </span>
                  <div
                    class="form-check"
                    v-if="controller.isDocumentEditable()"
                  >
                    <input
                      type="checkbox"
                      v-model="controller.application.value.authorityIncludeResolutionsOfMembers"
                    />
                    <span>including, Resolutions of Members; in general meeting</span>
                  </div>
                  <br />
                  Subject to the foregoing, the Board may exercise all powers of the Company

                  <span v-if="!controller.isDocumentEditable()">
                    {{ controller.getAuthorityAcceptReservedMatters() }}
                  </span>
                  <div
                    class="form-check"
                    v-if="controller.isDocumentEditable()"
                  >
                    <input
                      type="checkbox"
                      v-model="controller.application.value.authorityAcceptReservedMatters"
                    />
                    <span>except certain matters which are expressly under Reserved Matters for Members</span>
                  </div>
                </td>
              </tr>
              <tr class="section-content">
                <td>2.</td>
                <td>
                  This Terms of Reference is effective and shall continue to be in full force and binding on all the
                  Board of Directors, as constituted from time to time,
                  <span v-if="!controller.isDocumentEditable()">
                    {{ controller.getEffectiveDateText() }}
                  </span>
                  <div
                    class="check-options"
                    v-if="controller.isDocumentEditable()"
                  >
                    <div class="form-check">
                      <input
                        type="checkbox"
                        v-model="controller.application.value.isEffectiveDateCustom"
                        @change="controller.onIsEffectiveDateCustom()"
                      />
                      from:
                      <input
                        type="date"
                        class="form-control in-resolution"
                        v-model="controller.application.value.effectiveDate"
                      />
                    </div>
                    <div class="form-check">
                      <input
                        type="checkbox"
                        v-model="controller.application.value.isEffectiveOnLastSignature"
                        @change="controller.onIsEffectiveOnLastSignature()"
                      />
                      from the date of this Term of Reference
                    </div>
                    <div class="form-check">
                      <input
                        type="checkbox"
                        v-model="controller.application.value.isEffectiveOnFirstSignature"
                        @change="controller.onIsEffectiveOnFirstSignature()"
                      />
                      since the incorporation date of this Company
                    </div>
                  </div>
                </td>
              </tr>
              <!-- <tr class="section-content">
                <td>3.</td>
                <td>
                  In the event of conflict or inconsistency betweeen the provisions of this Terms of Reference and the
                  Company's Constitution (if adopted), the provisions of the Constitution shall take precedence.
                </td>
              </tr> -->
              <tr class="section-title">
                <td>C.</td>
                <td>Effective Appointment of the Terms of Reference</td>
              </tr>
              <tr class="section-content">
                <td>1.</td>
                <td>
                  This Terms of Reference shall apply to the Board of Directors for the time being, and
                  <span v-if="!controller.isDocumentEditable()">
                    {{ controller.getEffectiveAppointmentText() }}
                  </span>

                  <div
                    class="check-options"
                    v-if="controller.isDocumentEditable()"
                  >
                    <div class="form-check">
                      <input
                        type="checkbox"
                        v-model="controller.application.value.continueRegardlessOfChange"
                        @change="controller.onContinueRegardlessOfChangeChanged()"
                      />
                      <span>shall continue in force regardless of change in the composition of the Board</span>
                    </div>

                    <div class="form-check">
                      <input
                        type="checkbox"
                        v-model="controller.application.value.ceasesUntilDirectorChange"
                        @change="controller.onCeasesUntilDirectorChangeChanged()"
                      />
                      <span>
                        shall cease to be of any effect if any of the Director resigned, removed, death and cessation of
                        office for whatever reason
                      </span>
                    </div>
                  </div>
                </td>
              </tr>
              <tr
                v-if="!controller.isDocumentEditable()"
                class="section-title"
              >
                <td>D.</td>
                <td>Duties & Responsibilities</td>
              </tr>
              <tr
                v-if="!controller.isDocumentEditable()"
                class="section-content"
              >
                <td>1.</td>
                <td>
                  The Board shall, collectively and individually, discharge the duties imposed under Sections 213, 214,
                  and related provisions of the Companies Act 2016, including but not limited to:
                </td>
              </tr>
              <tr
                v-if="!controller.isDocumentEditable()"
                class="section-subtitle"
              >
                <td></td>
                <td>Governance & Oversight Duties</td>
              </tr>
              <tr
                v-if="!controller.isDocumentEditable()"
                class="section-content"
              >
                <td>2.</td>
                <td>
                  The board shall be responsible for:
                  <ol>
                    <li v-if="controller.application.value.oversightCorporateGovernance">
                      Overall corporate governance framework
                    </li>
                    <li v-if="controller.application.value.oversightCompanyAffairs">
                      Oversight of Company affairs and conduct
                    </li>
                    <li v-if="controller.application.value.ensureStatutoryRecords">
                      Ensuring proper statutory and corporate records
                    </li>
                    <li v-if="controller.application.value.monitorCompliance">
                      Monitoring compliance obligations and filings
                    </li>
                    <li v-if="controller.application.value.ensureDecisionsMinuted">
                      Ensuring decisions are properly minuted and documented
                    </li>
                  </ol>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </Paper>
    <Paper
      :paper-orientation="controller.paperOrientation"
      :is-use-letter-head="false"
      :additional-css-class="controller.additionalCssClass"
      :show-page-number="true"
      :total-pages="controller.totalPages()"
      :page-number="2"
      :show-watermark="props.showWatermark"
      :watermark-text="props.watermarkText"
    >
      <template #paperContent>
        <div class="document-content">
          <table>
            <tbody>
              <tr
                v-if="controller.isDocumentEditable()"
                class="section-title"
              >
                <td>D.</td>
                <td>Duties & Responsibilities</td>
              </tr>
              <tr
                v-if="controller.isDocumentEditable()"
                class="section-content"
              >
                <td>1.</td>
                <td>
                  The Board shall, collectively and individually, discharge the duties imposed under Sections 213, 214,
                  and related provisions of the Companies Act 2016, including but not limited to:
                </td>
              </tr>
              <tr
                v-if="controller.isDocumentEditable()"
                class="section-subtitle"
              >
                <td></td>
                <td>Governance & Oversight Duties</td>
              </tr>
              <tr
                v-if="controller.isDocumentEditable()"
                class="section-content"
              >
                <td>2.</td>
                <td>
                  The board shall be responsible for:
                  <div class="check-options">
                    <div class="form-check">
                      <input
                        type="checkbox"
                        v-model="controller.application.value.oversightCorporateGovernance"
                      />
                      <span>Overall corporate governance framework</span>
                    </div>
                    <div class="form-check">
                      <input
                        type="checkbox"
                        v-model="controller.application.value.oversightCompanyAffairs"
                      />
                      <span>Oversight of Comapny affairs and conduct</span>
                    </div>
                    <div class="form-check">
                      <input
                        type="checkbox"
                        v-model="controller.application.value.ensureStatutoryRecords"
                      />
                      <span>Ensuring proper statutory and corporate records</span>
                    </div>
                    <div class="form-check">
                      <input
                        type="checkbox"
                        v-model="controller.application.value.monitorCompliance"
                      />
                      <span>Monitoring compliance obligations and filings</span>
                    </div>
                    <div class="form-check">
                      <input
                        type="checkbox"
                        v-model="controller.application.value.ensureDecisionsMinuted"
                      />
                      <span>Ensuring decisions are properly minuted and documented</span>
                    </div>
                  </div>
                </td>
              </tr>
              <tr class="section-subtitle">
                <td></td>
                <td>Strategy & Business Direction</td>
              </tr>
              <tr class="section-content">
                <td>3.</td>
                <td>
                  The Board shall have authority to:
                  <ol v-if="!controller.isDocumentEditable()">
                    <li v-if="controller.application.value.approveBusinessStrategy">
                      Approve business strategy and long-term plans
                    </li>
                    <li v-if="controller.application.value.approveAnnualBudgets">
                      Approve annual budgets, if any and material variations
                    </li>
                    <li v-if="controller.application.value.approveMajorInitiatives">
                      Approve major operational initiatives
                    </li>
                    <li v-if="controller.application.value.monitorPerformance">
                      Monitor performance based on the approved plans
                    </li>
                  </ol>
                  <div
                    class="check-options"
                    v-if="controller.isDocumentEditable()"
                  >
                    <div class="form-check">
                      <input
                        type="checkbox"
                        v-model="controller.application.value.approveBusinessStrategy"
                      />
                      <span>Approve business strategy and long-term plans</span>
                    </div>
                    <div class="form-check">
                      <input
                        type="checkbox"
                        v-model="controller.application.value.approveAnnualBudgets"
                      />
                      <span>Approve annual budgets, if any and material variations</span>
                    </div>

                    <div class="form-check">
                      <input
                        type="checkbox"
                        v-model="controller.application.value.approveMajorInitiatives"
                      />
                      <span>Approve major operational initiatives</span>
                    </div>

                    <div class="form-check">
                      <input
                        type="checkbox"
                        v-model="controller.application.value.monitorPerformance"
                      />
                      <span>Monitor performance based on the approved plans</span>
                    </div>
                  </div>
                </td>
              </tr>
              <tr class="section-subtitle">
                <td></td>
                <td>Financial & Solvency Matters</td>
              </tr>
              <tr class="section-content">
                <td>4.</td>
                <td>
                  The board shall diligently:
                  <ol v-if="!controller.isDocumentEditable()">
                    <li v-if="controller.application.value.approveFinancialStatements">
                      Approve financial statements prior to circulation or lodgement
                    </li>
                    <li v-if="controller.application.value.determineAuditRequirement">
                      Determine whether financial statements are audited or unaudited
                    </li>
                    <li v-if="controller.application.value.declareDividends">
                      Declare or recommended dividents (subject to Solvency and Profit Requirements)
                    </li>
                    <li v-if="controller.application.value.approveFinancing">
                      Approve financing, borrowings, or guarantees
                    </li>
                    <li v-if="controller.application.value.approveCapitalExpenditure">
                      Approve capital expenditure, if required and applicable
                    </li>
                  </ol>
                  <div
                    class="check-options"
                    v-if="controller.isDocumentEditable()"
                  >
                    <div class="form-check">
                      <input
                        type="checkbox"
                        v-model="controller.application.value.approveFinancialStatements"
                      />
                      <span>Approve financial statements prior to circulation or lodgement</span>
                    </div>
                    <div class="form-check">
                      <input
                        type="checkbox"
                        v-model="controller.application.value.determineAuditRequirement"
                      />
                      <span>Determine whether financial statements are audited or unaudited</span>
                    </div>
                    <div class="form-check">
                      <input
                        type="checkbox"
                        v-model="controller.application.value.declareDividends"
                      />
                      <span>Declare or recommended dividends (subject to Solvency and Profit Requirements)</span>
                    </div>
                    <div class="form-check">
                      <input
                        type="checkbox"
                        v-model="controller.application.value.approveFinancing"
                      />
                      <span>Approve financing, borrowings, or guarantees</span>
                    </div>
                    <div class="form-check">
                      <input
                        type="checkbox"
                        v-model="controller.application.value.approveCapitalExpenditure"
                      />
                      <span>Approve capital expenditure, if required and applicable</span>
                    </div>
                  </div>
                </td>
              </tr>
              <tr class="section-subtitle">
                <td></td>
                <td>Risk Management & Compliance</td>
              </tr>
              <tr class="section-content">
                <td>5.</td>
                <td>
                  The board shall without prejudice:
                  <ol v-if="!controller.isDocumentEditable()">
                    <li v-if="controller.application.value.identifyBusinessRisks">
                      Identify principal business and compliance risk
                    </li>
                    <li v-if="controller.application.value.ensureInternalControls">
                      Ensure appropriate internal controls are in place
                    </li>
                    <li v-if="controller.application.value.oversightSolvency">
                      Oversee solvency and going-concern matters
                    </li>
                    <li v-if="controller.application.value.ensureCompliance">
                      Ensure compliance with statutory, regulatory, and contractual obligations
                    </li>
                  </ol>
                  <div
                    class="check-options"
                    v-if="controller.isDocumentEditable()"
                  >
                    <div class="form-check">
                      <input
                        type="checkbox"
                        v-model="controller.application.value.identifyBusinessRisks"
                      />
                      <span>Identify principal business and compliance risk</span>
                    </div>
                    <div class="form-check">
                      <input
                        type="checkbox"
                        v-model="controller.application.value.ensureInternalControls"
                      />
                      <span>Ensure appropriate internal controls are in place</span>
                    </div>
                    <div class="form-check">
                      <input
                        type="checkbox"
                        v-model="controller.application.value.oversightSolvency"
                      />
                      <span>Oversee solvency and going-concern matters</span>
                    </div>
                    <div class="form-check">
                      <input
                        type="checkbox"
                        v-model="controller.application.value.ensureCompliance"
                      />
                      <span>Ensure compliance with statutory, regulatory, and contractual obligations</span>
                    </div>
                  </div>
                </td>
              </tr>
              <tr
                class="section-title"
                v-if="!controller.isDocumentEditable()"
              >
                <td>E.</td>
                <td>Confidentiality, Obligation of Secrecy & No Secret Profit</td>
              </tr>
              <tr
                class="section-content"
                v-if="!controller.isDocumentEditable()"
              >
                <td>1.</td>
                <td>
                  Each Director shall keep confidential, all information acquired by virtue of their position as a
                  Director that is deemed as "Confidential Information" by the Company which has not legally entered
                  public domain, including but not limited to:
                  <ol>
                    <li>Business plans, strategies and financial information</li>
                    <li>customer, supplier and contractual information</li>
                    <li>trade secrets, intellectual property and internal deliberations</li>
                  </ol>

                  unless such disclosure is required by law or regulatory authority
                  <span v-if="controller.application.value.authorizedDisclosure">
                    or that the disclosure is authorised by the Board
                  </span>
                </td>
              </tr>
              <tr
                class="section-content"
                v-if="!controller.isDocumentEditable()"
              >
                <td>2.</td>
                <td>The confidentiality obligation shall {{ controller.getConfidentialityObligationText() }}.</td>
              </tr>
              <tr
                class="section-subtitle"
                v-if="!controller.isDocumentEditable()"
              >
                <td></td>
                <td>Proper Use of Company Information</td>
              </tr>
              <tr
                class="section-content"
                v-if="!controller.isDocumentEditable()"
              >
                <td>3.</td>
                <td>
                  Nothing herein shall prevent a Director from engaging in a lawful business, provided that the Director
                  does not misuse confidential information or divert corporate opportunities belonging to the Company
                  <ol>
                    <li>by the use of Confidential Information for personal gain;</li>
                    <li>use confidential information to benefit any third party; or</li>
                    <li>
                      misuse any company information in a manner detrimental to the Company{{
                        controller.application.value.boardApprovalRequired ? "" : "."
                      }}
                    </li>
                  </ol>
                  <p v-if="controller.application.value.boardApprovalRequired">
                    unless expressly approved by the Board.
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </Paper>
    <Paper
      :paper-orientation="controller.paperOrientation"
      :is-use-letter-head="false"
      :additional-css-class="controller.additionalCssClass"
      :show-page-number="true"
      :total-pages="controller.totalPages()"
      :page-number="3"
      :show-watermark="props.showWatermark"
      :watermark-text="props.watermarkText"
    >
      <template #paperContent>
        <div class="document-content">
          <table>
            <tbody>
              <tr
                class="section-title"
                v-if="controller.isDocumentEditable()"
              >
                <td>E.</td>
                <td>Confidentiality, Obligation of Secrecy & No Secret Profit</td>
              </tr>
              <tr
                class="section-content"
                v-if="controller.isDocumentEditable()"
              >
                <td>1.</td>
                <td>
                  Each Director shall keep confidential, all information acquired by virtue of their position as a
                  Director that is deemed as "Confidential Information" by the Company which has not legally entered
                  public domain, including but not limited to:
                  <ol>
                    <li>Business plans, strategies and financial information</li>
                    <li>customer, supplier and contractual information</li>
                    <li>trade secrets, intellectual property and internal deliberations</li>
                  </ol>

                  unless such disclosure is required by law or regulatory authority
                  <div
                    class="form-check"
                    v-if="controller.isDocumentEditable()"
                  >
                    <input
                      type="checkbox"
                      v-model="controller.application.value.authorizedDisclosure"
                    />
                    <span>or that the disclosure is authorised by the Board</span>
                  </div>
                </td>
              </tr>
              <tr
                class="section-content"
                v-if="controller.isDocumentEditable()"
              >
                <td>2.</td>
                <td>
                  The confidentiality obligation shall:
                  <div class="check-options">
                    <div class="form-check">
                      <input
                        type="checkbox"
                        v-model="controller.application.value.confidentialityDuringTenureOnly"
                        @change="controller.onConfidentialityDuringTenureOnlyChanged()"
                      />
                      <span>only continue during the Director's tenure</span>
                    </div>
                    <div class="form-check">
                      <input
                        type="checkbox"
                        v-model="controller.application.value.confidentialitySurvivesCessation"
                        @change="controller.onConfidentialitySurvivesCessationChanged()"
                      />
                      <span>survive resignation, removal, death or Cessation of office</span>
                    </div>
                  </div>
                </td>
              </tr>
              <tr
                class="section-subtitle"
                v-if="controller.isDocumentEditable()"
              >
                <td></td>
                <td>Proper Use of Company Information</td>
              </tr>
              <tr
                class="section-content"
                v-if="controller.isDocumentEditable()"
              >
                <td>3.</td>
                <td>
                  Nothing herein shall prevent a Director from engaging in a lawful business, provided that the Director
                  does not misuse confidential information or divert corporate opportunities belonging to the Company
                  <ol>
                    <li>by the use of Confidential Information for personal gain;</li>
                    <li>use confidential information to benefit any third party; or</li>
                    <li>misuse any company information in a manner detrimental to the Company</li>
                  </ol>
                  <div class="form-check">
                    <input
                      type="checkbox"
                      v-model="controller.application.value.boardApprovalRequired"
                    />
                    <span>unless expressly approved by the Board</span>
                  </div>
                </td>
              </tr>
              <tr class="section-subtitle">
                <td></td>
                <td>No Secret Profit</td>
              </tr>
              <tr class="section-content">
                <td>4.</td>
                <td>
                  A Director shall not, without full disclosure and approval in accordance with the Comapnies Act 2016,
                  appropriate for themselves any business opportunity discovered through the role of being a Director of
                  the Company,
                  <ol>
                    <li>make any secret profit from the Comapny's business;</li>
                    <li>receive any undisclosed commission, benefit or advantage;</li>
                    <li>exploit a corporate opportunity where the Company has an interest;</li>
                  </ol>
                  Any such profit or benefit inproperly obtained shall{{ controller.isDocumentEditable() ? ":" : "" }}
                  <span v-if="!controller.isDocumentEditable()">
                    {{ controller.getSecretProfitText() }}
                  </span>
                  <div
                    class="check-options"
                    v-if="controller.isDocumentEditable()"
                  >
                    <div class="form-check">
                      <input
                        type="checkbox"
                        v-model="controller.application.value.secretProfitDisclosureRequired"
                      />
                      <span>be disclosed to the Board; and</span>
                    </div>
                    <div class="form-check">
                      <input
                        type="checkbox"
                        v-model="controller.application.value.secretProfitReturnRequired"
                      />
                      <span>be accounted for and returned to the Company</span>
                    </div>
                  </div>
                </td>
              </tr>
              <tr class="section-title">
                <td>F.</td>
                <td>Directors' conduct & Conflict of Interest</td>
              </tr>
              <tr class="section-content">
                <td>1.</td>
                <td>
                  Each Director shall act honestly, in good faith and in the best interests of the Company by exercise
                  reasonable care, skill and diligence and avoid placing themselves in a position of conflict.
                </td>
              </tr>
              <tr class="section-content">
                <td>2.</td>
                <td>
                  A Director who has any direct or indirect interest in a matter before the Board shall{{
                    controller.isDocumentEditable() ? ":" : ""
                  }}
                  <span v-if="!controller.isDocumentEditable()">
                    {{ controller.getDirectInterestText() }}
                  </span>
                  <div
                    class="check-options"
                    v-if="controller.isDocumentEditable()"
                  >
                    <div class="form-check">
                      <input
                        type="checkbox"
                        v-model="controller.application.value.declareConflictInterest"
                      />
                      <span>declare the nature and extent of such interest;</span>
                    </div>
                    <div class="form-check">
                      <input
                        type="checkbox"
                        v-model="controller.application.value.abstainFromVotingOnConflict"
                      />
                      <span>abstain from deliveration and voting, where required;</span>
                    </div>
                    <div class="form-check">
                      <input
                        type="checkbox"
                        v-model="controller.application.value.ensureDisclosureInMinute"
                      />
                      <span>ensure such disclosure is properly minuted</span>
                    </div>
                  </div>
                </td>
              </tr>
              <tr
                class="section-content"
                v-if="!controller.isDocumentEditable()"
              >
                <td>3.</td>
                <td>The Board shall ensure that {{ controller.getBoardAssuranceOnInterestText() }}</td>
              </tr>
              <tr
                class="section-title"
                v-if="!controller.isDocumentEditable()"
              >
                <td>G.</td>
                <td>Reliance on Information & Professional Advice</td>
              </tr>
              <tr
                class="section-content"
                v-if="!controller.isDocumentEditable()"
              >
                <td>1.</td>
                <td>
                  Reliance on information provided by a third party hired or assigned in good faith does not absolve
                  Directors from exercising independent judgement. The board may reasonably rely on
                  {{ controller.getBoardInformationReliance() }}
                </td>
              </tr>
              <tr
                class="section-title"
                v-if="!controller.isDocumentEditable()"
              >
                <td>H.</td>
                <td>Record-keeping & Board Papers</td>
              </tr>
              <tr
                class="section-content"
                v-if="!controller.isDocumentEditable()"
              >
                <td>1.</td>
                <td>
                  Board decisions shall be properly recorded.
                  <span v-if="controller.application.value.minutesReflectDeliberations">
                    Minutes shall reflect material deliverations and resolutions.
                  </span>
                  <span v-if="controller.application.value.electronicRecordsAcceptable">
                    Electronic records are acceptable if compliant with the Act.
                  </span>
                </td>
              </tr>
              <tr
                class="section-title"
                v-if="!controller.isDocumentEditable()"
              >
                <td>I.</td>
                <td>Access to Information</td>
              </tr>
              <tr
                class="section-content"
                v-if="!controller.isDocumentEditable()"
              >
                <td>1.</td>
                <td>Directors shall have the right to {{ controller.getAccessToInformationText() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </Paper>
    <Paper
      :paper-orientation="controller.paperOrientation"
      :is-use-letter-head="false"
      :additional-css-class="controller.additionalCssClass"
      :show-page-number="true"
      :total-pages="controller.totalPages()"
      :page-number="4"
      :show-watermark="props.showWatermark"
      :watermark-text="props.watermarkText"
    >
      <template #paperContent>
        <div class="document-content">
          <table>
            <tbody>
              <tr
                class="section-content"
                v-if="controller.isDocumentEditable()"
              >
                <td>3.</td>
                <td>
                  The Board shall ensure that:
                  <ul v-if="!controller.isDocumentEditable()">
                    <li v-if="controller.application.value.isEnsureAllTransactionsDisclosed">
                      all related party transactions are disclosed;
                    </li>
                    <li v-if="controller.application.value.isEnsureApprovalsObtained">
                      all approvals are obtained where required;
                    </li>
                    <li v-if="controller.application.value.isEnsureTransactionsTerms">
                      transactions are on arm’s-length terms unless otherwise approved.
                    </li>
                  </ul>
                  <div
                    class="check-options"
                    v-if="controller.isDocumentEditable()"
                  >
                    <div class="form-check">
                      <input
                        type="checkbox"
                        v-model="controller.application.value.isEnsureAllTransactionsDisclosed"
                      />
                      <span>all related party transactions are disclosed;</span>
                    </div>
                    <div class="form-check">
                      <input
                        type="checkbox"
                        v-model="controller.application.value.isEnsureApprovalsObtained"
                      />
                      <span>all approvals are obtained where required;</span>
                    </div>
                    <div class="form-check">
                      <input
                        type="checkbox"
                        v-model="controller.application.value.isEnsureTransactionsTerms"
                      />
                      <span>transactions are on arm’s-length terms unless otherwise approved.</span>
                    </div>
                  </div>
                </td>
              </tr>
              <tr
                class="section-title"
                v-if="controller.isDocumentEditable()"
              >
                <td>G.</td>
                <td>Reliance on Information & Professional Advice</td>
              </tr>
              <tr
                class="section-content"
                v-if="controller.isDocumentEditable()"
              >
                <td>1.</td>
                <td>
                  Reliance on information provided by a third party hired or assigned in good faith does not absolve
                  Directors from exercising independent judgement. The board may reasonably rely on:
                  <ul v-if="!controller.isDocumentEditable()">
                    <li v-if="controller.application.value.relianceOnManagement">
                      information prepared by Management or Employees
                    </li>
                    <li v-if="controller.application.value.relianceOnProfessionals">
                      professional advice from auditors, lawyers or advisers
                    </li>
                    <li v-if="controller.application.value.relianceOnDigitalAndAi">
                      information provided from artificial intelligence and other digital platforms
                    </li>
                  </ul>
                  <div
                    class="check-options"
                    v-if="controller.isDocumentEditable()"
                  >
                    <div class="form-check">
                      <input
                        type="checkbox"
                        v-model="controller.application.value.relianceOnManagement"
                      />
                      <span>information prepared by Management or Employees</span>
                    </div>
                    <div class="form-check">
                      <input
                        type="checkbox"
                        v-model="controller.application.value.relianceOnProfessionals"
                      />
                      <span>professional advice from auditors, lawyers or advisers</span>
                    </div>
                    <div class="form-check">
                      <input
                        type="checkbox"
                        v-model="controller.application.value.relianceOnDigitalAndAi"
                      />
                      <span>information provided from artificial intelligence and other digital platforms</span>
                    </div>
                  </div>
                </td>
              </tr>
              <tr
                class="section-title"
                v-if="controller.isDocumentEditable()"
              >
                <td>H.</td>
                <td>Record-keeping & Board Papers</td>
              </tr>
              <tr
                class="section-content"
                v-if="controller.isDocumentEditable()"
              >
                <td>1.</td>
                <td>
                  Board decisions shall be properly recorded
                  <ul v-if="!controller.isDocumentEditable()">
                    <li v-if="controller.application.value.minutesReflectDeliberations">
                      Minutes shall reflect material deliverations and resolutions
                    </li>
                    <li v-if="controller.application.value.electronicRecordsAcceptable">
                      Electronic records are acceptable if compliant with the Act
                    </li>
                  </ul>
                  <div
                    class="check-options"
                    v-if="controller.isDocumentEditable()"
                  >
                    <div class="form-check">
                      <input
                        type="checkbox"
                        v-model="controller.application.value.minutesReflectDeliberations"
                      />
                      <span>Minutes shall reflect material deliverations and resolutions</span>
                    </div>
                    <div class="form-check">
                      <input
                        type="checkbox"
                        v-model="controller.application.value.electronicRecordsAcceptable"
                      />
                      <span>Electronic records are acceptable if compliant with the Act</span>
                    </div>
                  </div>
                </td>
              </tr>
              <tr
                class="section-title"
                v-if="controller.isDocumentEditable()"
              >
                <td>I.</td>
                <td>Access to Information</td>
              </tr>
              <tr
                class="section-content"
                v-if="controller.isDocumentEditable()"
              >
                <td>1.</td>
                <td>
                  Directors shall have the right to:
                  <ul v-if="!controller.isDocumentEditable()">
                    <li v-if="controller.application.value.timelyAccessToInfo">
                      timely access to Company information;
                    </li>
                    <li v-if="controller.application.value.requestClarification">
                      request clarification or additional documentation;
                    </li>
                    <li v-if="controller.application.value.accessCompanySecretaryRecords">
                      access records maintained by the Company Secretary
                    </li>
                  </ul>
                  <div
                    class="check-options"
                    v-if="controller.isDocumentEditable()"
                  >
                    <div class="form-check">
                      <input
                        type="checkbox"
                        v-model="controller.application.value.timelyAccessToInfo"
                      />
                      <span>timely access to Company information;</span>
                    </div>
                    <div class="form-check">
                      <input
                        type="checkbox"
                        v-model="controller.application.value.requestClarification"
                      />
                      <span>request clarification or additional documentation;</span>
                    </div>
                    <div class="form-check">
                      <input
                        type="checkbox"
                        v-model="controller.application.value.accessCompanySecretaryRecords"
                      />
                      <span>access records maintained by the Company Secretary</span>
                    </div>
                  </div>
                </td>
              </tr>
              <tr class="section-content">
                <td colspan="2">
                  <b>RESOLVED</b>
                  that this Terms of Reference be furnished to the Company and the Secretary and that it shall remain in
                  force until notice in writing to the contrary is given.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="signatures-section">
          <div class="signature-title">
            {{ controller.signatureTitle() }}
          </div>
          <div
            class="signature-item"
            v-for="(signatureItem, index) in controller.getSignatureOnPage(4)"
            :key="index"
          >
            <Signature
              :signature-item="signatureItem"
              @signed="emit('signed', $event)"
            />
          </div>
        </div>
        <div
          v-if="controller.totalPages() === 4"
          class="document-date"
        >
          Date: To be determined by iCompany
        </div>
      </template>
    </Paper>
    <Paper
      v-for="p in controller.rangeOfOtherPage()"
      :key="p"
      :paper-orientation="controller.paperOrientation"
      :is-use-letter-head="false"
      :additional-css-class="controller.additionalCssClass"
      :show-page-number="true"
      :total-pages="controller.totalPages()"
      :page-number="p"
      :show-watermark="props.showWatermark"
      :watermark-text="props.watermarkText"
    >
      <template #paperContent>
        <div class="signatures-section">
          <div class="continued-section">Continued from previous page</div>
          <div
            class="signature-item"
            v-for="(signatureItem, index) in controller.getSignatureOnPage(p)"
            :key="index"
          >
            <Signature
              :signature-item="signatureItem"
              @signed="emit('signed', $event)"
            />
          </div>
        </div>
        <div class="document-date">Date: To be determined by iCompany</div>
      </template>
    </Paper>
  </div>
</template>

<script setup lang="ts">
  import Paper from "../Papers/Paper.vue"
  import Signature from "../Signatures/Signature.vue"
  import { TermsOfReferencesController } from "~/scripts/components/legal-documents/TermsOfReferencesController"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
    showWatermark: {
      type: Boolean,
      default: false,
    },
    watermarkText: {
      type: String,
      default: "DRAFT",
    },
    isInPreviewMode: {
      type: Boolean,
      default: false,
    },
  })

  const emit = defineEmits(["update", "signed"])

  const documentRef = ref(null)

  const controller = new TermsOfReferencesController(props.companyId, emit)

  watch(
    () => props.companyId,
    (newVal) => {
      controller.setCompanyId(newVal)
      controller.initializeData()
    }
  )

  watch(
    () => props.isInPreviewMode,
    (newVal) => {
      console.log("changed in document", newVal)
      controller.setIsInPreviewMode(newVal)
      controller.setSignatureItems()
    }
  )

  watch(
    documentRef,
    (newVal) => {
      if (newVal) {
        controller.setDocumentRef(newVal)
      }
    },
    { immediate: true }
  )

  defineExpose({
    getData: controller.getData.bind(controller),
    getLetterPdfElements: controller.getLetterPdfElements.bind(controller),
    totalPages: controller.totalPages.bind(controller),
    getApplication: controller.getApplication.bind(controller),
    updateApplicationContent: controller.updateApplicationContent.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/LegalDocuments/TermsOfReferences" as *;
</style>
