<template>
  <div
    ref="documentContainerRef"
    id="legal-documents-unaudited-financial-statement"
  >
    <Paper
      v-if="controller.isLoadingData"
      :additional-css-class="controller.additionalCssClass"
      :paper-orientation="controller.paperOrientation"
      :total-pages="controller.totalPages.value"
      :is-loader="true"
      :page-number="1"
      :show-page-number="false"
    >
      <template #paperContent>
        <LoaderPrepare
          :label="'Generating Your'"
          :sublabel="'Unaudited Financial Statements'"
        />
      </template>
    </Paper>
    <template v-if="!controller.isLoadingData">
      <Paper
        :additional-css-class="controller.additionalCssClass"
        :paper-orientation="controller.paperOrientation"
        :total-pages="controller.totalPages.value"
        :page-number="1"
        :show-page-number="false"
      >
        <template #paperContent>
          <div class="cover-page">
            <div class="company-name">
              {{ controller.companyName() }}
            </div>
            <div class="cover-page-item company-registration-number">
              {{ controller.registrationNumberNew() }} ({{ controller.registrationNumberOld() }})
            </div>
            <div class="cover-page-item document-title">Financial Statements</div>
            <div class="cover-page-item">
              Financial Year End
              <span :class="{ placeholder: controller.isPlaceholderRequired }">
                {{ controller.formattedFinancialYearEnd }}
              </span>
            </div>
            <div class="cover-page-item">Unaudited Financial Statements</div>
          </div>
        </template>
      </Paper>

      <Paper
        :additional-css-class="controller.additionalCssClass"
        :paper-orientation="controller.paperOrientation"
        :total-pages="controller.totalPages.value"
        :page-number="2"
        :show-page-number="true"
      >
        <template #paperContent>
          <div class="document-header">
            <div class="company-name">
              {{ controller.companyName() }}
            </div>
            <div class="registration-numbers">
              {{ controller.registrationNumberNew() }} ({{ controller.registrationNumberOld() }})
            </div>
          </div>
          <div class="document-content">
            <div class="ufs-item">
              <div class="ufs-section-title">Directors</div>
              <ol>
                <li v-for="(director, i) in controller.directors.value">
                  {{ director.name }}
                </li>
              </ol>
            </div>
            <div class="ufs-item">
              <div class="ufs-section-title">Registered Office</div>
              <div class="ufs-section-item">
                <span v-html="controller.registeredAddress" />
              </div>
            </div>
            <div class="ufs-item">
              <div class="ufs-section-title">Principal Place of Business</div>
              <div class="ufs-section-item">
                <span v-html="controller.businessAddress" />
              </div>
            </div>
            <div
              class="ufs-item"
              :class="{ 'grey-out no-print': !controller.isIncludeBankers.value }"
            >
              <div class="ufs-section-title">
                <div class="form-check">
                  <input
                    class="form-check"
                    type="checkbox"
                    v-model="controller.isIncludeBankers.value"
                  />
                  <span>Bankers</span>
                </div>
              </div>
              <div class="ufs-section-item">
                <textarea
                  :disabled="!controller.isIncludeBankers.value"
                  class="form-control"
                  v-model="controller.bankersDetails.value"
                />
              </div>
            </div>
            <div
              class="ufs-item"
              :class="{ 'grey-out no-print': !controller.isIncludeTaxAgents.value }"
            >
              <div class="ufs-section-title">
                <div class="form-check">
                  <input
                    class="form-check"
                    type="checkbox"
                    v-model="controller.isIncludeTaxAgents.value"
                  />
                  <span>Tax Agent</span>
                </div>
              </div>
              <div class="ufs-section-item">
                <textarea
                  :disabled="!controller.isIncludeTaxAgents.value"
                  class="form-control"
                  v-model="controller.taxAgentDetails.value"
                />
              </div>
            </div>
            <div
              class="ufs-item"
              :class="{ 'grey-out no-print': !controller.isIncludeCorporateSecretary.value }"
            >
              <div class="ufs-section-title">
                <div class="form-check">
                  <input
                    class="form-check"
                    type="checkbox"
                    v-model="controller.isIncludeCorporateSecretary.value"
                  />
                  <span>Corporate Secretary</span>
                </div>
              </div>
              <div class="ufs-section-item">
                <textarea
                  :disabled="!controller.isIncludeCorporateSecretary.value"
                  class="form-control"
                  v-model="controller.corporateSecretaryDetails.value"
                />
              </div>
            </div>
          </div>
        </template>
      </Paper>

      <Paper
        :additional-css-class="controller.additionalCssClass"
        :paper-orientation="controller.paperOrientation"
        :total-pages="controller.totalPages.value"
        :page-number="3"
        :show-page-number="true"
      >
        <template #paperContent>
          <div class="document-header">
            <div class="company-name">
              {{ controller.companyName() }}
            </div>
            <div class="registration-numbers">
              {{ controller.registrationNumberNew() }} ({{ controller.registrationNumberOld() }})
            </div>
          </div>
          <div class="document-section-title">Director's Report</div>
          <div class="document-content">
            <p>
              The Director hereby submit their report together with the unaudited financial statements of the Company
              for the financial year ended
              <b>
                <span :class="{ placeholder: controller.isPlaceholderRequired }">
                  {{ controller.formattedFinancialYearEnd }}
                </span>
              </b>
              .
            </p>
            <div class="content-subtitle">Principal Activities</div>
            <p>
              The principal activity of the Company is focused on
              <input
                type="text"
                class="form-control in-resolution fit-content"
                v-model="controller.businessNatureDetails.value"
              />
              <!-- <span :class="{ placeholder: controller.isPlaceholderRequired }">
                {{  }}
              </span> -->
              . The Company was incorporated on {{ controller.incorporatedAt }}. During the financial year, the Company
              <span :class="{ placeholder: controller.isPlaceholderRequired }">
                {{ controller.exemptionType }}
              </span>
            </p>
            <div class="content-subtitle">Results</div>
            <p>The results of the operations of the Company for the financial year are as follows:</p>
            <table class="result-table">
              <thead>
                <tr>
                  <th>Result</th>
                  <th>RM</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <span :class="{ placeholder: controller.isPlaceholderRequired }">
                      {{ controller.resultProfitOrLoss }}
                    </span>
                    for the Financial Year
                  </td>
                  <td>
                    <span :class="{ placeholder: controller.isPlaceholderRequired }">
                      {{ controller.resultProfitLossAmount }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              <span :class="{ placeholder: controller.isPlaceholderRequired }">
                {{ controller.reasonsForProfitOrLoss }}
              </span>
            </p>
            <div class="content-subtitle">Reserves and Provisions</div>
            <div class="form-check">
              <input
                type="checkbox"
                class="form-control"
                v-model="controller.application.value.hasAnyReservesOrProvisions"
              />
              <div>
                <span v-if="!controller.application.value.hasAnyReservesOrProvisions">
                  There are no transfers to or from reserves or provisions during the financial year.
                </span>
                <div v-if="controller.application.value.hasAnyReservesOrProvisions">
                  There were RM
                  <input
                    type="text"
                    class="form-control in-resolution"
                    v-model="controller.application.value.reservedAmount"
                  />
                  transferred
                  <select
                    class="form-control in-resolution"
                    v-model="controller.application.value.isTransferredToReserves"
                  >
                    <option value="1">to</option>
                    <option value="0">from</option>
                  </select>
                  reserves or provisions during the financial year.
                </div>
              </div>
            </div>
            <!-- <p>
              <span :class="{ placeholder: controller.isPlaceholderRequired }">
                {{ controller.reservesOrProvisions }}
              </span>
            </p> -->
            <div class="content-subtitle">Dividends</div>
            <div class="form-check">
              <input
                type="checkbox"
                class="form-control"
                v-model="controller.application.value.hasDeclaredAnyDividends"
              />
              <div>
                <span v-if="!controller.application.value.hasDeclaredAnyDividends">
                  No dividend was paid or declared during the financial year.
                </span>
                <div v-if="controller.application.value.hasDeclaredAnyDividends">
                  Dividend of RM
                  <input
                    type="text"
                    class="form-control in-resolution"
                    v-model="controller.application.value.dividendAmount"
                  />
                  was declared and paid during the financial year.
                </div>
              </div>
            </div>
            <!-- <p>
              <span :class="{ placeholder: controller.isPlaceholderRequired }">
                {{ controller.dividendDeclaration }}
              </span>
            </p> -->
            <div class="content-subtitle">Director</div>
            <p>The Director who held office during the financial year and up to the date of this report is:</p>
            <ol>
              <li v-for="(director, i) in controller.directors.value">
                {{ director.name }}
              </li>
            </ol>
            <template v-if="controller.isShowDirectorsInterestOnPage3">
              <div class="content-subtitle">Director's Interests</div>
              <p>
                The Director holding office at the end of the financial year had interest in the ordinary shares of the
                Company as follows:
              </p>
              <table class="directors-interest">
                <thead>
                  <tr>
                    <th>Shareholdings in the name of Director</th>
                    <th>
                      Balance at
                      <span :class="{ placeholder: controller.isPlaceholderRequired }">
                        {{ controller.formattedFinancialYearStart }}
                      </span>
                    </th>
                    <th>Bought</th>
                    <th>Sold</th>
                    <th>
                      Balance at
                      <span :class="{ placeholder: controller.isPlaceholderRequired }">
                        {{ controller.formattedFinancialYearEnd }}
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(director, i) in controller.directorsInterest">
                    <td>
                      {{ director.name }}
                    </td>
                    <td>{{ NumberUtil.thousandSeparator(director.ordinaryShares) }}</td>
                    <td>-</td>
                    <td>-</td>
                    <td>{{ NumberUtil.thousandSeparator(director.ordinaryShares) }}</td>
                  </tr>
                </tbody>
              </table>
            </template>
          </div>
        </template>
      </Paper>

      <Paper
        :additional-css-class="controller.additionalCssClass"
        :paper-orientation="controller.paperOrientation"
        :total-pages="controller.totalPages.value"
        :page-number="4"
        :show-page-number="true"
      >
        <template #paperContent>
          <div class="document-header">
            <div class="company-name">
              {{ controller.companyName() }}
            </div>
            <div class="registration-numbers">
              {{ controller.registrationNumberNew() }} ({{ controller.registrationNumberOld() }})
            </div>
          </div>
          <div class="document-content">
            <template v-if="!controller.isShowDirectorsInterestOnPage3">
              <div class="content-subtitle">Director's Interests</div>
              <p>
                The Director holding office at the end of the financial year had interest in the ordinary shares of the
                Company as follows:
              </p>
              <table class="directors-interest">
                <thead>
                  <tr>
                    <th>Shareholdings in the name of Director</th>
                    <th>
                      Balance at
                      <span :class="{ placeholder: controller.isPlaceholderRequired }">
                        {{ controller.formattedFinancialYearStart }}
                      </span>
                    </th>
                    <th>Bought</th>
                    <th>Sold</th>
                    <th>
                      Balance at
                      <span :class="{ placeholder: controller.isPlaceholderRequired }">
                        {{ controller.formattedFinancialYearEnd }}
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(director, i) in controller.directorsInterest">
                    <td>
                      {{ director.name }}
                    </td>
                    <td>{{ NumberUtil.thousandSeparator(director.ordinaryShares) }}</td>
                    <td>-</td>
                    <td>-</td>
                    <td>{{ NumberUtil.thousandSeparator(director.ordinaryShares) }}</td>
                  </tr>
                </tbody>
              </table>
            </template>
            <div class="content-subtitle">Issue of Shares and Debentures</div>
            <p>
              <span :class="{ placeholder: controller.isPlaceholderRequired }">
                {{ controller.shareIssuance }}
              </span>
            </p>
            <div class="content-subtitle">Director's Benefits</div>
            <p>
              <span :class="{ placeholder: controller.isPlaceholderRequired }">
                {{ controller.directorsBenefits }}
              </span>
            </p>
            <div class="content-subtitle">Director's Remunerations</div>
            <p>
              <span :class="{ placeholder: controller.isPlaceholderRequired }">
                {{ controller.directorsRemunerations }}
              </span>
            </p>
            <div class="content-subtitle">Other Statutory Information</div>
            <p>Before the financial statements of the Company were prepared, the Director took reasonable steps:</p>
            <ol class="lower-alpha-brackets">
              <li>
                to ascertain that proper action had been taken in relation to the writing-off of bad debts and the
                making of allowance for doubtful debts, and have satisfied themselves that all known bad debts had been
                written-off and the adequate allowances had been made for doubtful debts; and
              </li>
              <li>
                to ensure that any current assets which were unlikely to be realised at their book values in the
                ordinary course of business have been written down to their estimated realisable values.
              </li>
            </ol>
            <template v-if="controller.isShowDirectorsInterestOnPage3">
              <p>As of the date of this report, the Director are not aware of any circumstances:</p>
              <ol class="lower-alpha-brackets">
                <li>
                  which would render the amount written off for bad debts or the amount of the allowance for doubtful
                  debts inadequate to any substantial extent in the financial statement of the Company; or
                </li>
                <li>
                  which would render the values attributed to current assets in the financial statements of the Company
                  misleading; or
                </li>
                <li>
                  which have arisen which render adherence to the existing method of valuation of assets or liabilities
                  of the Company misleading or inappropriate; or
                </li>
                <li>
                  not otherwise dealt with in this report or financial statements which would render any amount stated
                  in the financial statements of the Company misleading.
                </li>
              </ol>
              <p>As of the date of this report, there does not exist:</p>
              <ol class="lower-alpha-brackets">
                <li>
                  any charge on the assets of the Company which has arisen since the end of the year and secures the
                  liability of any other person; or
                </li>
                <li>any contingent liability of the Company which has arisen since the end of the year.</li>
              </ol>
              <p>
                No contingent or other liability has become enforceable, or is likely to become enforceable within the
                period of twelve months after the end of the year which, in the opinion of the Director, will or may
                substantially affect the ability of the Company to meet its obligations as and when they fall due.
              </p>
            </template>
          </div>
        </template>
      </Paper>

      <Paper
        :additional-css-class="controller.additionalCssClass"
        :paper-orientation="controller.paperOrientation"
        :total-pages="controller.totalPages.value"
        :page-number="5"
        :show-page-number="true"
      >
        <template #paperContent>
          <div class="document-header">
            <div class="company-name">
              {{ controller.companyName() }}
            </div>
            <div class="registration-numbers">
              {{ controller.registrationNumberNew() }} ({{ controller.registrationNumberOld() }})
            </div>
          </div>
          <div class="document-content">
            <template v-if="!controller.isShowDirectorsInterestOnPage3">
              <p>As of the date of this report, the Director are not aware of any circumstances:</p>
              <ol class="lower-alpha-brackets">
                <li>
                  which would render the amount written off for bad debts or the amount of the allowance for doubtful
                  debts inadequate to any substantial extent in the financial statement of the Company; or
                </li>
                <li>
                  which would render the values attributed to current assets in the financial statements of the Company
                  misleading; or
                </li>
                <li>
                  which have arisen which render adherence to the existing method of valuation of assets or liabilities
                  of the Company misleading or inappropriate; or
                </li>
                <li>
                  not otherwise dealt with in this report or financial statements which would render any amount stated
                  in the financial statements of the Company misleading.
                </li>
              </ol>
              <p>As of the date of this report, there does not exist:</p>
              <ol class="lower-alpha-brackets">
                <li>
                  any charge on the assets of the Company which has arisen since the end of the year and secures the
                  liability of any other person; or
                </li>
                <li>any contingent liability of the Company which has arisen since the end of the year.</li>
              </ol>
              <p>
                No contingent or other liability has become enforceable, or is likely to become enforceable within the
                period of twelve months after the end of the year which, in the opinion of the Director, will or may
                substantially affect the ability of the Company to meet its obligations as and when they fall due.
              </p>
            </template>
            <p>In the opinion of the Director:</p>
            <ol class="lower-alpha-brackets">
              <li>
                the results of the operations of the Company during the year were not substantially affected by any
                item, transaction or event of material and unusual nature.
              </li>
              <li>
                no item, transaction or event of a material and unusual nature has arisen in the interval between the
                end of the year and the date of this report which is likely to affect substantially the results of
                operations of the Company for the year in which this report is made.
              </li>
            </ol>
            <div class="content-subtitle">Auditors</div>
            <p>The Company is exempt from audit pursuant to the Companies Act 2016.</p>
          </div>
          <div class="signature-section for-reports">
            <div class="sign-off-header">Signed on behalf of the Board of Director:</div>
            <div class="signatures-for-report">
              <div
                class="signature-pad"
                v-if="!controller.hasResponsiblePersons"
              >
                <div class="signature"></div>
                <div class="sign-off">
                  <select class="form-control in-resolution">
                    <option v-for="(director, i) in controller.responsiblePersons">
                      {{ director }}
                    </option>
                  </select>
                  <br />
                  <b>DIRECTOR</b>
                </div>
              </div>
              <template v-if="controller.hasResponsiblePersons">
                <Signature
                  v-for="(signatureItem, i) in controller.signatureItemsForDirectorsReport"
                  :signature-item="signatureItem"
                />
              </template>
            </div>
          </div>
        </template>
      </Paper>

      <Paper
        :additional-css-class="controller.additionalCssClass"
        :paper-orientation="controller.paperOrientation"
        :total-pages="controller.totalPages.value"
        :page-number="6"
        :show-page-number="true"
      >
        <template #paperContent>
          <div class="document-header">
            <div class="company-name">
              {{ controller.companyName() }}
            </div>
            <div class="registration-numbers">
              {{ controller.registrationNumberNew() }} ({{ controller.registrationNumberOld() }})
            </div>
          </div>
          <div class="document-section-title">STATEMENT BY DIRECTOR</div>
          <div class="document-content">
            <p>Pursuant to Section 251 of the Companies Act 2016, the Director hereby state that, in their opinion:</p>
            <ol>
              <li>
                this unaudited financial statements is drawn up in accordance with the
                <b>Malaysian Private Entities Reporting Standard (MPERS)</b>
                and the Companies Act 2016, and give a true and fair view of the financial position of the Company as at
                <span :class="{ placeholder: controller.isPlaceholderRequired }">
                  {{ controller.formattedFinancialYearEnd }}
                </span>
                and of its financial performance and cash flows for the financial year then ended; and
              </li>
              <li>
                during the financial year, the Company was
                <span :class="{ placeholder: controller.isPlaceholderRequired }">{{ controller.exemptionType }}</span>
                .
              </li>
            </ol>
          </div>
          <div class="signature-section for-reports">
            <div class="sign-off-header">Signed on behalf of the Board of Director:</div>
            <div class="signatures-for-report">
              <div
                class="signature-pad"
                v-if="!controller.hasResponsiblePersons"
              >
                <div class="signature"></div>
                <div class="sign-off">
                  <select class="form-control in-resolution">
                    <option v-for="(director, i) in controller.responsiblePersons">
                      {{ director }}
                    </option>
                  </select>
                  <br />
                  <b>DIRECTOR</b>
                </div>
              </div>
              <template v-if="controller.hasResponsiblePersons">
                <Signature
                  v-for="(signatureItem, i) in controller.signatureItemsForDirectorsReport"
                  :signature-item="signatureItem"
                />
              </template>
            </div>
          </div>
        </template>
      </Paper>

      <Paper
        :additional-css-class="controller.additionalCssClass"
        :paper-orientation="controller.paperOrientation"
        :total-pages="controller.totalPages.value"
        :page-number="7"
        :show-page-number="true"
      >
        <template #paperContent>
          <div class="document-header">
            <div class="company-name">
              {{ controller.companyName() }}
            </div>
            <div class="registration-numbers">
              {{ controller.registrationNumberNew() }} ({{ controller.registrationNumberOld() }})
            </div>
          </div>
          <div class="document-section-title">STATUTORY DECLARATION</div>
          <div class="document-section-subtitle">Pursuant to Section 251(1)(b) of the Companies Act 2016</div>
          <div class="document-content">
            <p>
              I,
              <b>
                <span :class="{ placeholder: controller.isPlaceholderRequired }">
                  {{ controller.responsiblePersonName }}
                </span>
              </b>
              being the Director primarily responsible for the financial management of
              <b>
                {{ controller.companyName() }} (Company No.: {{ controller.registrationNumberNew() }} ({{
                  controller.registrationNumberOld()
                }}))
              </b>
              , do solemnly and sincerely declare that the its unaudited financial statements are, in my opinion,
              correct and I make this solemn declaration conscientiously believing the same to be true, and by virtue of
              the provisions of the Statutory Declarations Act, 1960.
            </p>
          </div>
          <div class="signature-section statutory-declaration">
            <div class="declaration-signature">
              Subscribed and solemnly declared by the abovenamed
              <span :class="{ placeholder: controller.isPlaceholderRequired }">
                {{ controller.responsiblePersonName }}
              </span>
              at
              <input
                v-if="controller.isDocumentEditable"
                type="text"
                class="form-control in-resolution"
                v-model="controller.application.value.cityOfDeclaration"
              />
              <span
                v-if="!controller.isDocumentEditable"
                :class="{ placeholder: controller.isPlaceholderRequired }"
              >
                {{ controller.cityOfDeclaration }}
              </span>
              in the state of
              <input
                v-if="controller.isDocumentEditable"
                type="text"
                class="form-control in-resolution"
                v-model="controller.application.value.stateOfDeclaration"
              />
              <span
                v-if="!controller.isDocumentEditable"
                :class="{ placeholder: controller.isPlaceholderRequired }"
              >
                {{ controller.stateOfDeclaration }}
              </span>
              this day of
              <input
                v-if="controller.isDocumentEditable"
                type="date"
                class="form-control in-resolution"
                v-model="controller.application.value.dateOfDeclaration"
              />
              <span
                v-if="!controller.isDocumentEditable"
                :class="{ placeholder: controller.isPlaceholderRequired }"
              >
                {{ controller.formattedDateOfDeclaration }}
              </span>
            </div>
            <div
              class="signature-pad"
              v-if="!controller.hasResponsiblePersons"
            >
              <div class="signature"></div>
              <div class="sign-off">
                <select class="form-control in-resolution">
                  <option v-for="(director, i) in controller.responsiblePersons">
                    {{ director }}
                  </option>
                </select>
                <br />
                <b>DIRECTOR</b>
              </div>
            </div>
            <template v-if="controller.hasResponsiblePersons">
              <Signature :signature-item="controller.signatureItem" />
            </template>
          </div>
          <div class="signature-section">
            <div class="sign-off-header">Before me:</div>
            <Signature :signature-item="controller.commissionerForOathSignatureItem" />
          </div>
        </template>
      </Paper>

      <!-- <Paper
        :additional-css-class="controller.additionalCssClass"
        :paper-orientation="controller.paperOrientation"
        :total-pages="controller.totalPages.value"
        :page-number="8"
        :show-page-number="true"
      >
        <template #paperContent>
          <div class="document-header">
            <div class="company-name">
              {{ controller.companyName() }}
            </div>
            <div class="registration-numbers">
              {{ controller.registrationNumberNew() }} ({{ controller.registrationNumberOld() }})
            </div>
          </div>
          <div class="document-section-title">STATEMENT OF FINANCIAL POSITION</div>
          <div class="document-section-subtitle">
            FOR FINANCIAL PERIOD FROM
            <span :class="{ placeholder: controller.isPlaceholderRequired }">
              {{ controller.formattedFinancialYearStart.toUpperCase() }}
            </span>
            TO
            <span :class="{ placeholder: controller.isPlaceholderRequired }">
              {{ controller.formattedFinancialYearEnd.toUpperCase() }}
            </span>
          </div>
          <div class="document-content">
            <div class="financial-statement-table">
              <table>
                <tbody>
                  <tr
                    v-for="(item, i) in controller.statementOfFinancialPosition"
                    :class="item.itemType"
                  >
                    <td>{{ item.description }}</td>
                    <td>{{ controller.formatAmount(item.amount) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </template>
      </Paper>
      <Paper
        :additional-css-class="controller.additionalCssClass"
        :paper-orientation="controller.paperOrientation"
        :total-pages="controller.totalPages.value"
        :page-number="9"
        :show-page-number="true"
      >
        <template #paperContent>
          <div class="document-header">
            <div class="company-name">
              {{ controller.companyName() }}
            </div>
            <div class="registration-numbers">
              {{ controller.registrationNumberNew() }} ({{ controller.registrationNumberOld() }})
            </div>
          </div>
          <div class="document-section-title">STATEMENT OF PROFIT OR LOSS</div>
          <div class="document-section-subtitle">
            AS OF
            <span :class="{ placeholder: controller.isPlaceholderRequired }">
              {{ controller.formattedFinancialYearEnd.toUpperCase() }}
            </span>
          </div>
          <div class="financial-statement-table">
            <table>
              <tbody>
                <tr
                  v-for="(item, i) in controller.statementOfProfitOrLoss"
                  :class="item.itemType"
                >
                  <td>{{ item.description }}</td>
                  <td>{{ controller.formatAmount(item.amount) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </Paper>
      <Paper
        :additional-css-class="controller.additionalCssClass"
        :paper-orientation="controller.paperOrientation"
        :total-pages="controller.totalPages.value"
        :page-number="11"
        :show-page-number="true"
      >
        <template #paperContent>
          <div class="document-header">
            <div class="company-name">
              {{ controller.companyName() }}
            </div>
            <div class="registration-numbers">
              {{ controller.registrationNumberNew() }} ({{ controller.registrationNumberOld() }})
            </div>
          </div>
          <div class="document-section-title">STATEMENT OF CHANGES IN EQUITY</div>
          <div class="document-section-subtitle">
            FOR FINANCIAL YEAR ENDED
            <span :class="{ placeholder: controller.isPlaceholderRequired }">
              {{ controller.formattedFinancialYearEnd.toUpperCase() }}
            </span>
          </div>
          <div class="financial-statement-table">
            <table>
              <tbody>
                <tr
                  v-for="(item, i) in controller.statementOfChangesInEquity"
                  :class="item.itemType"
                >
                  <td>{{ item.description }}</td>
                  <td>{{ controller.formatAmount(item.amount) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </Paper>
      <Paper
        :additional-css-class="controller.additionalCssClass"
        :paper-orientation="controller.paperOrientation"
        :total-pages="controller.totalPages.value"
        :page-number="11"
        :show-page-number="true"
      >
        <template #paperContent>
          <div class="document-header">
            <div class="company-name">
              {{ controller.companyName() }}
            </div>
            <div class="registration-numbers">
              {{ controller.registrationNumberNew() }} ({{ controller.registrationNumberOld() }})
            </div>
          </div>
          <div class="document-section-title">STATEMENT OF CASH FLOWS</div>
          <div class="document-section-subtitle">
            FOR FINANCIAL YEAR ENDED
            <span :class="{ placeholder: controller.isPlaceholderRequired }">
              {{ controller.formattedFinancialYearEnd.toUpperCase() }}
            </span>
          </div>
          <div class="financial-statement-table">
            <table>
              <tbody>
                <tr
                  v-for="(item, i) in controller.statementOfCashFlows"
                  :class="item.itemType"
                >
                  <td>{{ item.description }}</td>
                  <td>{{ controller.formatAmount(item.amount) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </Paper>
      <Paper
        v-for="notePage in controller.pageRangeForNotes"
        :key="`note-page-${notePage}`"
        :additional-css-class="controller.additionalCssClass"
        :paper-orientation="controller.paperOrientation"
        :total-pages="controller.totalPages.value"
        :page-number="12 + notePage"
        :show-page-number="true"
      >
        <template #paperContent>
          <div class="document-header">
            <div class="company-name">
              {{ controller.companyName() }}
            </div>
            <div class="registration-numbers">
              {{ controller.registrationNumberNew() }} ({{ controller.registrationNumberOld() }})
            </div>
          </div>
          <div
            v-if="notePage === 0"
            class="document-section-title"
          >
            NOTES TO THE FINANCIAL STATEMENTS
          </div>
          <div
            v-if="notePage === 0"
            class="document-section-subtitle"
          >
            FOR FINANCIAL YEAR ENDED
            <span :class="{ placeholder: controller.isPlaceholderRequired }">
              {{ controller.formattedFinancialYearEnd.toUpperCase() }}
            </span>
          </div>
          <div class="financial-statement-notes">
            <template
              v-for="(note, i) in controller.getNoteForFSOnPage(notePage)"
              :key="`note-${i}`"
              :class="controller.getNoteClass(note)"
            >
              <template v-if="!controller.isNoteSubsection(note)">
                <div class="number-title">{{ note.noteNumber }}. {{ note.title }}</div>
                <p v-html="note.content" />
              </template>
              <template v-if="controller.isNoteSubsection(note)">
                <div class="subtitle">{{ note.subtitle }}</div>
                <p v-html="note.content" />
              </template>
            </template>
          </div>
        </template>
      </Paper> -->

      <Paper
        :additional-css-class="controller.additionalCssClass"
        :paper-orientation="controller.paperOrientation"
        :total-pages="controller.totalPages.value"
        :page-number="controller.pageNumberForExemptionCertificate"
        :show-page-number="false"
      >
        <template #paperContent>
          <div class="document-header">
            <div class="company-name">
              {{ controller.companyName() }}
            </div>
            <div class="registration-numbers">
              {{ controller.registrationNumberNew() }} ({{ controller.registrationNumberOld() }})
            </div>
          </div>
          <div class="document-section-title certificate">AUDIT EXEMPTION CERTIFICATE</div>
          <div class="document-content">
            <ol>
              <li>
                This is to certify and declared that to the best of our knowledge that this certificate is signed by the
                Director certifying to the best of their knowledge and belief for the financial year ended
                <span :class="{ placeholder: controller.isPlaceholderRequired }">
                  {{ controller.formattedFinancialYearEnd }}
                </span>
                , the Company is entitled to exemption from audit under section 267(2) of the Companies Act 2016
                relating to private companies.
              </li>
              <li>
                I hereby certify that to the best of my knowledge and belief that:
                <ol>
                  <li>Members have not required the company to perform an audit of its accounts for that year.</li>
                  <li>
                    The Directors acknowledge their responsibilities for complying with the requirements of the
                    Companies Act 2016 with respect to accounting records and the preparation of financial statements.
                  </li>
                  <li>
                    These financial statements have been prepared in accordance with applicable approved accounting
                    standards issued by Malaysian Accounting Standards Board (MASB), namely the Malaysian Private
                    Entities Reporting Standard (MPERS) and complies with the requirements of the Companies Act 2016.
                  </li>
                </ol>
              </li>
              <li>
                The unaudited financial statements and report made up from
                <span :class="{ placeholder: controller.isPlaceholderRequired }">
                  {{ controller.formattedFinancialYearStart }}
                </span>
                to
                <span :class="{ placeholder: controller.isPlaceholderRequired }">
                  {{ controller.formattedFinancialYearEnd }}
                </span>
                required under the Companies Act 2016 have been circulated to the members on
                <template v-if="controller.isDocumentEditable">
                  <input
                    type="date"
                    class="form-control in-resolution"
                    v-model="controller.application.value.circulationDate"
                  />
                </template>
                <template v-if="!controller.isDocumentEditable">
                  <span :class="{ placeholder: controller.isPlaceholderRequired }">
                    {{ controller.formattedCirculationDate }}
                  </span>
                </template>
                .
              </li>
            </ol>
            <div class="signature-section">
              <b>Approved and Certify By the Director</b>
              <div
                class="signature-pad"
                v-if="!controller.hasResponsiblePersons"
              >
                <div class="signature"></div>
                <div class="sign-off">
                  <select class="form-control in-resolution">
                    <option v-for="(director, i) in controller.responsiblePersons">
                      {{ director }}
                    </option>
                  </select>
                  <br />
                  <b>DIRECTOR</b>
                </div>
              </div>
              <template v-if="controller.hasResponsiblePersons">
                <Signature :signature-item="controller.signatureItem" />
              </template>
            </div>
          </div>
        </template>
      </Paper>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import LoaderPrepare from "../Loaders/Prepare.vue"
  import Paper from "../Papers/Paper.vue"
  import Signature from "@/components/Signatures/Signature.vue"
  import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
  import { UnauditedFinancialStatement } from "~/scripts/types/financial-statements/UnauditedFinancialStatement"
  import { UnauditedFinancialStatementController } from "~/scripts/components/legal-documents/UnauditedFinancialStatementController"
  import type { CompanyFinancialStatement } from "~/scripts/models/CompanyFinancialStatement"
  import { NumberUtil } from "~/scripts/utils/Number"

  const props = defineProps<IPropsResolutionDocument<CompanyFinancialStatement>>()

  const emit = defineEmits(["dataUpdated"])

  const documentContainerRef = ref(null)

  const controller = new UnauditedFinancialStatementController(props, emit)

  watch(
    documentContainerRef,
    (newVal) => {
      controller.setDocumentContainerRef(newVal)
    },
    { immediate: true }
  )

  watch(
    () => props.companyId,
    (newVal) => {
      controller.setCompanyId(newVal)
      controller.init()
    }
  )

  watch(
    () => props.application,
    (newVal) => {
      controller.setApplication(newVal)
    },
    { immediate: true }
  )

  watch(
    () => props.financialYearEnd,
    (newVal) => {
      controller.setFinancialYearEnd(newVal)
    }
  )

  watch(
    () => props.financialPeriodId,
    (newVal) => {
      controller.setFinancialPeriodId(newVal ?? "")
    }
  )

  watch(
    () => controller.application.value,
    (newVal, oldVal) => {
      if (oldVal.id === "") {
        return
      }

      emit("dataUpdated", newVal)
    },
    { deep: true }
  )

  defineExpose({
    getPdfElements: controller.getPdfElements.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/LegalDocuments/UnauditedFinancialStatement" as *;
</style>
