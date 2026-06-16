<template>
  <div id="dcr-bank-account-opening-affin-bank">
    <Paper
      :paper-orientation="PaperOrientation.Portrait"
      :is-loader="true"
      :show-page-number="false"
      v-if="controller.isLoading.value"
    >
      <template #paperContent>
        <LoaderPrepare
          :label="controller.loaderLabel"
          :sublabel="controller.loaderSublabel"
        />
      </template>
    </Paper>
    <template v-if="!controller.isLoading.value">
      <Paper
        :paper-orientation="PaperOrientation.Portrait"
        :show-page-number="false"
        :additional-css-class="controller.additionalCssClass"
        :show-watermark="props.showWatermark"
        :watermark-text="props.watermarkText"
      >
        <template
          #paperMargins
          v-if="props.isShowTag"
        >
          <div class="paper-tag select-branch point-left"><span>Select Branch</span></div>
        </template>
        <template #paperContent>
          <div class="paper-footer">V1.0 - C2M -20191008</div>
          <div class="resolution-header">
            <div class="company-name">
              {{ controller.companyName() }}
            </div>
            <div class="registration-number">
              {{ controller.registrationNumberNew() }} ({{ controller.registrationNumberOld() }})
            </div>
            <div class="subheader">(Incorporated in Malaysia)</div>
          </div>
          <div class="resolution-title">
            <div class="title">
              DIRECTORS' RESOLUTION PURSUANT TO A BOARD OF DIRECTORS’ MEETING HELD ON
              <span class="empty-input-field"></span>
            </div>
            <div class="subtitle">
              Pursuant to
              <b>
                Article [
                <span class="empty-input-field small no-border"></span>
              </b>
              ] of the Company’s Article of Association
            </div>
          </div>
          <div class="resolution-opening">
            <div>Business Current Account and Corporate Internet Banking (AFFINMAX) Services</div>
            <div>offered by AFFIN BANK BERHAD’S to</div>
            <div>
              <span class="prefilled-input-field wide">{{ controller.companyName() }}</span>
              ("Company")
            </div>
          </div>
          <div class="resolution-content">
            <p>
              <b>IT WAS RESOLVED:</b>
            </p>
            <ol class="upper-alpha">
              <li>
                The Company hereby agrees to open, maintain and/or close Current Account with Affin Bank Berhad/ Affin
                Islamic Bank Berhad at
                <BranchDropdown
                  v-if="controller.isDocumentEditable()"
                  :bank-id="controller.bankId"
                  :selected-branch-id="controller.selectedBranchId.value"
                  :is-show-address="false"
                  :is-disabled="!controller.isDocumentEditable()"
                  @branchSelected="controller.onBranchSelected($event)"
                />
                <span v-if="!controller.isDocumentEditable()">
                  <b>{{ controller.branchName }}</b>
                </span>
                ("the Bank"), in accordance with the subject to such terms and conditions as may be prescribed by the
                Bank which may be supplemented, amended and/or substituted from time to time.
              </li>
              <li>
                The Company wishes to apply to the Bank for access and/or use of Corporate Internet Banking services and
                in this regard, the Company submitted the Application Form for Corporate Internet Banking, duly
                authorized by the Board of Director’s Resolution.
              </li>
              <li v-if="controller.isDocumentEditable()">
                <div class="form-check">
                  <input
                    type="checkbox"
                    class="form-check-input"
                    v-model="controller.affinBankApplicationDetails.value.isAllowLinkAndTransactSubsidiary"
                    @change="emit('updated')"
                  />
                  <span
                    class="checkbox-label"
                    :class="{
                      optional: !controller.affinBankApplicationDetails.value.isAllowLinkAndTransactSubsidiary,
                    }"
                  >
                    The Company is desirous of allowing its subsidiary companies ("Subsidiaries") as listed in the last
                    page of the Board Resolution to Link Subsidiary to make use of the said services and/or to transact
                    on behalf of its Subsidiaries.
                    <span class="note">(**APPLICABLE ONLY TO LINK SUBSIDIARY ACCOUNT)</span>
                  </span>
                </div>
              </li>
              <li
                v-if="
                  !controller.isDocumentEditable() &&
                  controller.affinBankApplicationDetails.value.isAllowLinkAndTransactSubsidiary
                "
              >
                The Company is desirous of allowing its subsidiary companies ("Subsidiaries") as listed in the last page
                of the Board Resolution to Link Subsidiary to make use of the said services and/or to transact on behalf
                of its Subsidiaries.
              </li>
              <li>
                The Bank is hereby authorized and instructed to :
                <ol class="lower-roman">
                  <li>
                    Honour all cheques, promissory notes, and other order drawn by and all bills accepted on behalf of
                    the Company and to debit such cheque, notes, orders and bills to the Company’s account whether such
                    account be in credit or overdrawn or may become overdrawn in consequence of such debit, provided
                    that they are endorsed/signed by the authorised signatories, and to accept and credit to the account
                    of the Company all monies deposited with or owing by the Bank on the Account at any time or times
                    kept or to be kept in the name of the Company and the amount of all cheques, notes, bills, other
                    negotiable instruments, orders or receipts;
                  </li>
                  <li>
                    Acknowledge the appointed authorised signatories to sign and execute on behalf of the company all
                    documents, instruments, forms, application, letters of acknowledgment and/or all terms and
                    conditions pertaining to the use of Corporate Internet Banking services whether on the Company's
                    behalf
                    <div
                      class="form-check"
                      v-if="controller.isDocumentEditable()"
                    >
                      <input
                        type="checkbox"
                        class="fomr-check-input"
                        v-model="controller.affinBankApplicationDetails.value.isAcknowledgeOnSubsidiaryBehalf"
                        @change="emit('updated')"
                      />
                      <span
                        class="checkbox-label"
                        :class="{
                          optional: !controller.affinBankApplicationDetails.value.isAcknowledgeOnSubsidiaryBehalf,
                        }"
                      >
                        or on any of the Subsidiaries' behalf.
                        <span class="note">(**APPLICABLE ONLY TO LINK SUBSIDIARY ACCOUNT)</span>
                      </span>
                    </div>
                    <span
                      v-if="
                        !controller.isDocumentEditable() &&
                        controller.affinBankApplicationDetails.value.isAcknowledgeOnSubsidiaryBehalf
                      "
                    >
                      or on any of the Subsidiaries' behalf.
                    </span>
                  </li>
                </ol>
              </li>
            </ol>
          </div>
        </template>
      </Paper>
      <Paper
        :paper-orientation="PaperOrientation.Portrait"
        :show-page-number="false"
        :additional-css-class="controller.additionalCssClass"
        :show-watermark="props.showWatermark"
        :watermark-text="props.watermarkText"
      >
        <template
          #paperMargins
          v-if="props.isShowTag"
        >
          <div class="paper-tag signatory-type point-left"><span>Select One</span></div>
          <div class="paper-tag authorised-signatories point-left"><span>Insert Information</span></div>
          <div
            class="paper-tag administrators point-left"
            v-if="controller.isAdministratorDetailsOnPage2"
          >
            <span>Insert Information</span>
          </div>
        </template>
        <template #paperContent>
          <div class="paper-footer">V1.0 - C2M -20191008</div>
          <div class="resolution-content">
            <ol
              class="upper-alpha skip-first"
              start="4"
            >
              <li class="no-number">
                <ol
                  class="lower-roman"
                  start="3"
                >
                  <li>
                    Provided they be signed by
                    <span
                      class="prefilled-input-field wide"
                      v-if="controller.isDocumentEditable()"
                    >
                      (
                      <span
                        class="clickable-span"
                        :class="{ strikedthrough: !controller.isSignatoryTypeSelected('jointly') }"
                        @click="controller.onSignatoryTypeClicked('jointly')"
                      >
                        Jointly
                      </span>
                      /
                      <span
                        class="clickable-span"
                        :class="{ strikedthrough: !controller.isSignatoryTypeSelected('any-two') }"
                        @click="controller.onSignatoryTypeClicked('any-two')"
                      >
                        Any Two
                      </span>
                      /
                      <span
                        class="clickable-span"
                        :class="{ strikedthrough: !controller.isSignatoryTypeSelected('any-requirements') }"
                        @click="controller.onSignatoryTypeClicked('any-requirements')"
                      >
                        Any Requirements
                      </span>
                      )
                    </span>
                    <span
                      v-if="!controller.isDocumentEditable()"
                      :class="{ 'value-placeholder': controller.isInPreviewMode.value }"
                    >
                      {{ controller.signatoryTypeLabel }}
                    </span>
                    (“Authorised Signatories”) of the following:
                    <ol class="number margin-top">
                      <li>
                        Authorized Signatories for Current Account:
                        <ol class="lower-alpha-bracket margin-top">
                          <li v-for="(signatory, index) in controller.signatories.value">
                            <div class="form-group">
                              <span
                                class="clickable-span"
                                :class="{ strikedthrough: !controller.isSignatoryDesignation(signatory, 'Mr') }"
                                @click="controller.onSignatoryDesignationClicked(signatory, 'Mr')"
                              >
                                Mr
                              </span>
                              /
                              <span
                                class="clickable-span"
                                :class="{ strikedthrough: !controller.isSignatoryDesignation(signatory, 'Mrs') }"
                                @click="controller.onSignatoryDesignationClicked(signatory, 'Mrs')"
                              >
                                Mrs
                              </span>
                              <input
                                type="text"
                                class="form-control in-resolution"
                                placeholder="FULL NAME OF AUTHORISED SIGNATORY"
                                v-model="signatory.name"
                                :list="`signatory-name-${index}`"
                                :disabled="!controller.isDocumentEditable()"
                                @change="controller.onSignatoryNameUpdated(signatory)"
                              />
                              <span
                                v-if="controller.isDocumentEditable()"
                                class="action-link remove"
                                @click="controller.onRemoveSignatory(index)"
                              >
                                Remove
                              </span>
                              <datalist :id="`signatory-name-${index}`">
                                <option v-for="(name, j) in controller.directorDataListForSignatories(index)">
                                  {{ name }}
                                </option>
                              </datalist>
                            </div>
                            <div class="form-group">
                              <span class="clickable-span">NRIC / Passport No:</span>
                              <input
                                type="text"
                                class="form-control in-resolution"
                                placeholder="NRIC / Passport No."
                                v-model="signatory.identification"
                                :disabled="!controller.isDocumentEditable()"
                                @change="controller.onSignatoryUpdated()"
                              />
                            </div>
                          </li>
                          <li class="no-number">
                            <span
                              v-if="controller.isDocumentEditable()"
                              class="action-link add-more"
                              @click="controller.onAddMoreSignatoryClicked()"
                            >
                              + Add Another Signatory
                            </span>
                          </li>
                        </ol>
                        <div
                          class="note"
                          v-if="controller.isDocumentEditable()"
                        >
                          (The company needs to specify the Signing Limit per person i.e. Signatory A can sign up to
                          RM100,000.00, etc. a nd Conditions of Signing i.e. Signatory A to sign jointly with Signatory
                          B, etc.)
                        </div>
                        <div class="form-group margin-top">
                          <span>Signing Limit:</span>
                          <textarea
                            rows="4"
                            v-model="controller.affinBankApplicationDetails.value.authorisedSignatorySigningLimit"
                            v-if="controller.isDocumentEditable()"
                            @change="emit('updated')"
                          ></textarea>
                          <span
                            v-if="!controller.isDocumentEditable()"
                            :class="{ 'value-placeholder': controller.isInPreviewMode.value }"
                          >
                            {{ controller.authorisedSignatorySigningLimit }}
                          </span>
                        </div>
                      </li>
                      <li>
                        Authorized Signatories for Corporate Internet Banking services:
                        <ol class="lower-alpha-bracket margin-top">
                          <li v-for="(onlineBanking, i) in controller.onlineAccessPersons.value">
                            <div class="form-group">
                              <span
                                class="clickable-span"
                                :class="{ strikedthrough: !controller.isOnlineBankingDesignation(onlineBanking, 'Mr') }"
                                @click="controller.onOnlineBankingDesignationClicked(onlineBanking, 'Mr')"
                              >
                                Mr
                              </span>
                              /
                              <span
                                class="clickable-span"
                                :class="{
                                  strikedthrough: !controller.isOnlineBankingDesignation(onlineBanking, 'Mrs'),
                                }"
                                @click="controller.onOnlineBankingDesignationClicked(onlineBanking, 'Mrs')"
                              >
                                Mrs
                              </span>
                              <input
                                type="text"
                                class="form-control in-resolution"
                                placeholder="FULL NAME OF AUTHORISED SIGNATORY"
                                v-model="onlineBanking.name"
                                :list="`ob-name-${i}`"
                                :disabled="!controller.isDocumentEditable()"
                                @change="controller.onOnlineBankingNameUpdated(onlineBanking)"
                              />
                              <span
                                v-if="controller.isDocumentEditable()"
                                class="action-link remove"
                                @click="controller.onRemoveOnlineBanking(i)"
                              >
                                Remove
                              </span>
                              <datalist :id="`ob-name-${i}`">
                                <option v-for="(name, j) in controller.directorDataListforOnlineBanking(i)">
                                  {{ name }}
                                </option>
                              </datalist>
                            </div>
                            <div class="form-group">
                              <span class="clickable-span">NRIC / Passport No:</span>
                              <input
                                type="text"
                                class="form-control in-resolution"
                                placeholder="NRIC / Passport No."
                                v-model="onlineBanking.identification"
                                :disabled="!controller.isDocumentEditable()"
                                @change="controller.onOnlineBankingUpdated()"
                              />
                            </div>
                          </li>
                          <li class="no-number">
                            <span
                              v-if="controller.isDocumentEditable()"
                              class="action-link add-more"
                              @click="controller.onAddMoreOnlineBanking()"
                            >
                              + Add Another Signatory
                            </span>
                          </li>
                        </ol>
                        <div class="form-group margin-top">
                          <span>Signing Limit:</span>
                          <textarea
                            rows="4"
                            v-model="controller.affinBankApplicationDetails.value.onlineBankingSigningLimit"
                            v-if="controller.isDocumentEditable()"
                            @change="emit('updated')"
                          ></textarea>
                          <span
                            v-if="!controller.isDocumentEditable()"
                            :class="{ 'value-placeholder': controller.isInPreviewMode.value }"
                          >
                            {{ controller.onlineBankingSigningLimit }}
                          </span>
                        </div>
                      </li>
                    </ol>
                    AND THAT the aforesaid mode of operation shall remain in force until otherwise revoked by the Board
                    of Directors in written.
                  </li>
                </ol>
              </li>
              <li>
                THAT the Authorised signatories acknowledge and agree that through the appointment of System
                Administrator and System Approver, as well as the creation of the end user by System Administrator and
                System Approver, the Company authorizes System Administrator, System Approver and the end user to act
                for and on behalf of the Company to access and/or use the Corporate Internet Banking Services, including
                without limitation the acceptance of terms and conditions or submission of forms, applications or
                documents, whether physically, electronically or otherwise (as the case may be).
              </li>
              <li v-if="controller.isAdministratorDetailsOnPage2">
                “THAT we hereby appoint the System Administrator and System Approver as listed below to perform
                Administrative duties in Corporate Internet Banking for the Company [
                <span class="optional blue">
                  as well as on behalf of any its Subsidiaries. (**APPLICABLE ONLY TO LINK SUBSIDIARY ACCOUNT)
                </span>
                ]”
                <table class="authorised-persons">
                  <thead>
                    <tr>
                      <th>Role</th>
                      <th>Full Name (as per NRIC / Passport)</th>
                      <th>NRIC / Passport No.</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(adminApprove, a) in controller.affinBankApplicationDetails.value
                        .systemAdministratorApprovers"
                    >
                      <td class="role-column">
                        <div
                          class="action-link remove"
                          v-if="controller.isDocumentEditable()"
                        >
                          <i
                            class="fa-regular fa-trash-alt"
                            @click="controller.onRemoveSystemAdministratorApprover(a)"
                          ></i>
                        </div>
                        <select
                          class="form-control"
                          v-model="adminApprove.role"
                          :disabled="!controller.isDocumentEditable()"
                          v-if="controller.isDocumentEditable()"
                          @change="controller.onAdministratorApproverUpdated()"
                        >
                          <option value="system-administrator">System Administrator</option>
                          <option value="system-approver">System Approver</option>
                        </select>
                        <span
                          v-if="!controller.isDocumentEditable()"
                          :class="{ 'value-placeholder': controller.isInPreviewMode.value }"
                        >
                          {{
                            adminApprove.role === "system-administrator" ? "System Administrator" : "System Approver"
                          }}
                        </span>
                      </td>
                      <td>
                        <input
                          type="text"
                          class="form-control"
                          v-model="adminApprove.name"
                          placeholder="Full Name as in NRIC/Passport"
                          :disabled="!controller.isDocumentEditable()"
                          @change="controller.onAdministratorApproverNameUpdated(adminApprove)"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          class="form-control"
                          v-model="adminApprove.identification"
                          placeholder="NRIC/Passport No"
                          :disabled="!controller.isDocumentEditable()"
                          @change="controller.onAdministratorApproverUpdated()"
                        />
                      </td>
                    </tr>
                    <tr v-if="controller.isDocumentEditable()">
                      <td
                        class="add-more-row"
                        colspan="3"
                      >
                        <span
                          class="action-link add-more"
                          @click="controller.onAddSystemAdministratorApprover()"
                        >
                          + Add Another System Administrator / Approver
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </li>
            </ol>
          </div>
        </template>
      </Paper>
      <Paper
        :paper-orientation="PaperOrientation.Portrait"
        :show-page-number="false"
        :additional-css-class="controller.additionalCssClass"
        :show-watermark="props.showWatermark"
        :watermark-text="props.watermarkText"
      >
        <template
          #paperMargins
          v-if="props.isShowTag"
        >
          <div
            class="paper-tag administrators-page3 point-left"
            v-if="!controller.isAdministratorDetailsOnPage2"
          >
            <span>Insert Information</span>
          </div>
          <div
            class="paper-tag transfer-limit point-left"
            :style="controller.tagPositionForTransferLimit"
          >
            <span>Insert Information</span>
          </div>
        </template>
        <template #paperContent>
          <div class="paper-footer">V1.0 - C2M -20191008</div>
          <div class="resolution-content">
            <ol
              class="upper-alpha"
              :start="controller.isAdministratorDetailsOnPage2 ? 7 : 6"
            >
              <li v-if="!controller.isAdministratorDetailsOnPage2">
                “THAT we hereby appoint the System Administrator and System Approver as listed below to perform
                Administrative duties in Corporate Internet Banking for the Company [
                <span class="optional blue">
                  as well as on behalf of any its Subsidiaries. (**APPLICABLE ONLY TO LINK SUBSIDIARY ACCOUNT)
                </span>
                ]”
                <table class="authorised-persons">
                  <thead>
                    <tr>
                      <th>Role</th>
                      <th>Full Name (as per NRIC / Passport)</th>
                      <th>NRIC / Passport No.</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(adminApprove, a) in controller.affinBankApplicationDetails.value
                        .systemAdministratorApprovers"
                    >
                      <td class="role-column">
                        <div
                          class="action-link remove"
                          v-if="controller.isDocumentEditable()"
                        >
                          <i
                            class="fa-regular fa-trash-alt"
                            @click="controller.onRemoveSystemAdministratorApprover(a)"
                          ></i>
                        </div>
                        <select
                          class="form-control"
                          v-model="adminApprove.role"
                          :disabled="!controller.isDocumentEditable()"
                          v-if="controller.isDocumentEditable()"
                          @change="controller.onAdministratorApproverUpdated()"
                        >
                          <option value="system-administrator">System Administrator</option>
                          <option value="system-approver">System Approver</option>
                        </select>
                        <span
                          v-if="!controller.isDocumentEditable()"
                          :class="{ 'value-placeholder': controller.isInPreviewMode.value }"
                        >
                          {{
                            adminApprove.role === "system-administrator" ? "System Administrator" : "System Approver"
                          }}
                        </span>
                      </td>
                      <td>
                        <input
                          type="text"
                          class="form-control"
                          v-model="adminApprove.name"
                          placeholder="Full Name as in NRIC/Passport"
                          :disabled="!controller.isDocumentEditable()"
                          @change="controller.onAdministratorApproverNameUpdated(adminApprove)"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          class="form-control"
                          v-model="adminApprove.identification"
                          placeholder="NRIC/Passport No"
                          :disabled="!controller.isDocumentEditable()"
                          @change="controller.onAdministratorApproverUpdated()"
                        />
                      </td>
                    </tr>
                    <tr v-if="controller.isDocumentEditable()">
                      <td
                        class="add-more-row"
                        colspan="3"
                      >
                        <span
                          class="action-link add-more"
                          @click="controller.onAddSystemAdministratorApprover()"
                        >
                          + Add Another System Administrator / Approver
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </li>
              <li>
                “THAT any termination, cessation, dismissal, retirement, resignation, contract expiry, or death of above
                authorised personnel will be informed by the Company to the Bank officially with the submission of
                Maintenance form. In the event of the replacement of any of the System Administrator and/or System
                Approver, the Company hereby authorises the Authorised Signatories to appoint such replacement personnel
                from time to time and such replacement personnel shall be authorised to act as the System Administrator
                (for creation of Company users of the Corporate Internet Banking services) and/or the System Approver
                (for the approval of the creation of Company users of the Corporate Internet Banking services), as the
                case may be.”
              </li>
              <li>
                “THAT the transfer of funds made via the said facility shall be limited to
                <b>
                  RM
                  <input
                    v-if="controller.isDocumentEditable()"
                    type="text"
                    class="form-control small"
                    v-model="controller.affinBankApplicationDetails.value.transferLimit"
                    :disabled="!controller.isDocumentEditable()"
                    @change="emit('updated')"
                  />
                  <span v-if="controller.isDocumentEditable()">.00</span>
                  <span v-if="!controller.isDocumentEditable()">
                    {{ controller.affinBankApplicationDetails.value.transferLimit }}.00
                  </span>
                </b>
                per day”
              </li>
              <li>
                “THAT the Company be and hereby acknowledge that the Terms and Conditions is required to be executed.
                The Authorised Signatories of the Company is authorised to accept the Terms and Conditions; for purposes
                of obtaining the transactional services under the Corporate Internet Banking services applied for by the
                Company and made available by the Bank from time to time. The Company hereby appoints the Authorised
                Signatories herein to accept the Terms and Conditions of Corporate Internet Banking services, if need be
                and to deal with and liaise with the Bank on all matters in relation thereto. The details and specimen
                signature(s) of the Authorised Signatories are set forth below.”
              </li>
              <li>
                “THAT a certified true copy of this resolution is to be furnished to the Bank and this resolution shall
                remain in force until notice in writing to the contrary is given to the Bank by the Company which notice
                has to be duly acknowledged in writing by the Bank.”
              </li>
              <li v-if="controller.isDocumentEditable()">
                <div class="form-check">
                  <input
                    type="checkbox"
                    class="fomr-check-input"
                    v-model="controller.affinBankApplicationDetails.value.isTermCompanyForSubsidiary"
                    @change="emit('updated')"
                  />
                  <span
                    class="checkbox-label"
                    :class="{ optional: !controller.affinBankApplicationDetails.value.isTermCompanyForSubsidiary }"
                  >
                    “The term "Company" wherever appearing herein shall include and mean any transaction(s) in Corporate
                    Internet Banking services conducted by the Company for itself or on behalf of by any of its
                    Subsidiaries. The Company shall notify the Bank of any changes in its Subsidiaries/Subsidiaries
                    Account(s).” (
                    <span class="note">**APPLICABLE ONLY TO LINK SUBSIDIARY ACCOUNT</span>
                    )
                  </span>
                </div>
              </li>
              <li
                v-if="
                  !controller.isDocumentEditable() &&
                  controller.affinBankApplicationDetails.value.isTermCompanyForSubsidiary
                "
              >
                “The term "Company" wherever appearing herein shall include and mean any transaction(s) in Corporate
                Internet Banking services conducted by the Company for itself or on behalf of by any of its
                Subsidiaries. The Company shall notify the Bank of any changes in its Subsidiaries/Subsidiaries
                Account(s).”
              </li>
            </ol>
            <p>
              <br />
            </p>
            <p>
              <br />
            </p>
            <p v-if="controller.firstPageSignature === 3">
              Dated this
              <span class="empty-input-field small"></span>
              day of
              <span class="empty-input-field small"></span>
              , 20
              <span class="empty-input-field small"></span>
            </p>
            <p v-if="controller.firstPageSignature === 3">Certified Correct</p>
            <div
              class="signature-section"
              v-if="controller.firstPageSignature === 3"
            >
              <div
                class="signature-placeholder"
                v-for="(signature, si) in controller.getSignaturesOnPage(3)"
              >
                <div class="signature-container">Wet Ink Required</div>
                <div class="name">{{ signature }}</div>
              </div>
            </div>
          </div>
        </template>
      </Paper>
      <Paper
        v-for="(signaturePage, i) in controller.otherSignaturePages"
        :paper-orientation="PaperOrientation.Portrait"
        :show-page-number="false"
        :additional-css-class="controller.additionalCssClass"
        :show-watermark="props.showWatermark"
        :watermark-text="props.watermarkText"
      >
        <template #paperContent>
          <div class="paper-footer">V1.0 - C2M -20191008</div>
          <div class="resolution-content">
            <p v-if="controller.firstPageSignature === 4 && i === 0">
              Dated this
              <span class="empty-input-field small"></span>
              day of
              <span class="empty-input-field small"></span>
              , 20
              <span class="empty-input-field small"></span>
            </p>
            <p v-if="controller.firstPageSignature === 4 && i === 0">Certified Correct</p>
            <div class="signature-section">
              <div
                class="signature-placeholder"
                v-for="(signature, si) in controller.getSignaturesOnPage(4 + i)"
              >
                <div class="signature-container">Wet Ink Required</div>
                <div class="name">{{ signature }}</div>
              </div>
            </div>
          </div>
        </template>
      </Paper>
      <Paper
        :paper-orientation="PaperOrientation.Portrait"
        :show-page-number="false"
        :additional-css-class="controller.additionalCssClass"
        :show-watermark="props.showWatermark"
        :watermark-text="props.watermarkText"
      >
        <template
          #paperMargins
          v-if="props.isShowTag"
        >
          <div
            class="paper-tag authorised-details point-left"
            :style="controller.tagPositionForAuthorisedSignatories"
          >
            <span>Insert Information</span>
          </div>
          <div
            class="paper-tag authorised-details-online-banking point-left"
            :style="controller.tagPositionForAuthorisedOnlineBanking"
          >
            <span>Insert Information</span>
          </div>
        </template>
        <template #paperContent>
          <div class="paper-footer">V1.0 - C2M -20191008</div>
          <div class="resolution-content">
            <div class="heading">Appendix A</div>
            <div class="page-title">
              Details and Specimen Signature of the Authorized Signatory(ies) for Current Account and Corporate Internet
              Banking (CIB).
            </div>
            <div class="page-subtitle">
              Pursuant to this Resolution, the details and specimen signature of the Authorized Representative(s) are as
              follows:
            </div>
            <div class="margin-top">
              <table class="authorised-specimens">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Authorised Representative Name</th>
                    <th>NRIC / Passport No.</th>
                    <th>Designation</th>
                    <th>Signature</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(signatory, s) in controller.signatories.value"
                    :key="s"
                  >
                    <td class="number">{{ s + 1 }}</td>
                    <td>{{ signatory.name }}</td>
                    <td>{{ signatory.identification }}</td>
                    <td>{{ signatory.designation }}</td>
                    <td class="signature-specimen">Wet Ink Required</td>
                  </tr>
                  <tr>
                    <td colspan="5">
                      Mode of Operation
                      <b>over the counter</b>
                      :-
                      <div class="form-checks-container">
                        <div class="form-check">
                          <input
                            type="checkbox"
                            class="form-check-input"
                            :checked="controller.isCurrentBankingSignatoryType('any-one')"
                            :disabled="!controller.isDocumentEditable()"
                            @click="controller.onCurrentBankingSignatoryTypeClicked('any-one')"
                          />
                          <span>Any One to Authorise</span>
                        </div>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            class="form-check-input"
                            :checked="controller.isCurrentBankingSignatoryType('any-two')"
                            :disabled="!controller.isDocumentEditable()"
                            @click="controller.onCurrentBankingSignatoryTypeClicked('any-two')"
                          />
                          <span>Any Two to Authorise</span>
                        </div>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            class="form-check-input"
                            :checked="controller.isCurrentBankingSignatoryType('all')"
                            :disabled="!controller.isDocumentEditable()"
                            @click="controller.onCurrentBankingSignatoryTypeClicked('all')"
                          />
                          <span>All to Authorise</span>
                        </div>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            class="form-check-input"
                            :checked="controller.isCurrentBankingSignatoryType('others')"
                            :disabled="!controller.isDocumentEditable()"
                            @click="controller.onCurrentBankingSignatoryTypeClicked('others')"
                          />
                          <span>Others:</span>
                          <input
                            type="text"
                            class="form-control in-resolution"
                            :disabled="!controller.isCurrentBankingSignatoryType('others')"
                            v-model="controller.affinBankApplicationDetails.value.currentBankingSignatoryTypeOther"
                            @change="emit('updated')"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="table-note">(Please attach Photocopy of NRIC / Passport)</div>
            </div>
            <div class="margin-top">
              <table class="authorised-specimens">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Authorised Representative Name</th>
                    <th>NRIC / Passport No.</th>
                    <th>Designation</th>
                    <th>Signature</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(onlineBanking, ob) in controller.onlineAccessPersons.value"
                    :key="ob"
                  >
                    <td class="number">{{ ob + 1 }}</td>
                    <td>{{ onlineBanking.name }}</td>
                    <td>{{ onlineBanking.identification }}</td>
                    <td>{{ onlineBanking.designation }}</td>
                    <td class="signature-specimen">Wet Ink Required</td>
                  </tr>
                  <tr>
                    <td colspan="5">
                      Mode of Operation
                      <b>CIB Services</b>
                      :-
                      <div class="form-checks-container">
                        <div class="form-check">
                          <input
                            type="checkbox"
                            class="form-check-input"
                            :checked="controller.isOnlineBankingSignatoryType('any-one')"
                            :disabled="!controller.isDocumentEditable()"
                            @click="controller.onOnlineBankingSignatoryTypeClicked('any-one')"
                          />
                          <span>Any One to Authorise</span>
                        </div>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            class="form-check-input"
                            :checked="controller.isOnlineBankingSignatoryType('any-twp')"
                            :disabled="!controller.isDocumentEditable()"
                            @click="controller.onOnlineBankingSignatoryTypeClicked('any-twp')"
                          />
                          <span>Any Two to Authorise</span>
                        </div>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            class="form-check-input"
                            :checked="controller.isOnlineBankingSignatoryType('all')"
                            :disabled="!controller.isDocumentEditable()"
                            @click="controller.onOnlineBankingSignatoryTypeClicked('all')"
                          />
                          <span>All to Authorise</span>
                        </div>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            class="form-check-input"
                            :checked="controller.isOnlineBankingSignatoryType('others')"
                            :disabled="!controller.isDocumentEditable()"
                            @click="controller.onOnlineBankingSignatoryTypeClicked('others')"
                          />
                          <span>Others:</span>
                          <input
                            type="text"
                            class="form-control in-resolution"
                            :disabled="!controller.isOnlineBankingSignatoryType('others')"
                            v-model="controller.affinBankApplicationDetails.value.onlineBankingSignatoryTypeOther"
                            @change="emit('updated')"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </template>
      </Paper>
    </template>
    <Teleport to="body">
      <NonDirectorBankSignatory
        ref="nonDirectorBankSignatoryRef"
        @proceed="controller.onAddMoreSignatory()"
      />
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import Paper from "@/components/Papers/Paper.vue"
  import BranchDropdown from "@/components/Banks/BranchDropdown.vue"
  import NonDirectorBankSignatory from "../Popups/NonDirectorBankSignatory.vue"
  import type { CompanyBankAccountOpening } from "~/scripts/models/CompanyBankAccountOpening"
  import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
  import { StringUtil } from "~/scripts/utils/String"
  import { DcrBankAccountOpeningAffinBankController } from "~/scripts/components/resolutions/DcrBankAccountOpeningAffinBankController"
  import { PaperOrientation } from "~/scripts/constants/Paper"

  const props = defineProps<IPropsResolutionDocument<CompanyBankAccountOpening>>()

  const resolutionContent = ref(null)
  const nonDirectorBankSignatoryRef = ref(null)

  const emit = defineEmits(["startLoading", "doneLoading", "signed", "updated"])

  const controller = new DcrBankAccountOpeningAffinBankController(props, emit)

  watch(
    () => props.applicationId,
    (newVal) => {
      if (!StringUtil.isNullOrEmpty(newVal)) {
        controller.fetchApplication(newVal ?? "")
      }
    }
  )

  watch(
    () => props.isInPreviewMode,
    (newVal) => {
      console.log(newVal)
      controller.setIsInPreviewMode(newVal)
      controller.setContent()
    }
  )

  watch(
    resolutionContent,
    (newVal) => {
      if (newVal) {
        controller.setResolutionContentRef(newVal)
      }
    },
    { immediate: true }
  )

  watch(
    () => props.showWatermark,
    (newVal) => {
      controller.setShowWatermark(newVal)
    }
  )

  watch(
    () => props.watermarkText,
    (newVal) => {
      controller.setWatermarkText(newVal)
    }
  )

  watch(
    () => props.application,
    (newVal) => {
      if (!newVal) {
        return
      }

      controller.updateApplicationContent(newVal)
    },
    { deep: true }
  )

  watch(
    nonDirectorBankSignatoryRef,
    (newVal) => {
      controller.setNonDirectorBankSignatoryRef(newVal)
    },
    { immediate: true }
  )

  defineExpose({
    totalPages: controller.totalPages.bind(controller),
    getApplication: controller.getApplication.bind(controller),
    updateApplicationContent: controller.updateApplicationContent.bind(controller),
    isLoading: controller.isLoading.value,
    getAuthorisedPersonsForOnlineBanking: controller.getAuthorisedPersonsForOnlineBanking.bind(controller),
    getSignatoryType: controller.getSignatoryType.bind(controller),
    getSignatories: controller.getSignatories.bind(controller),
    getBranchId: controller.getBranchId.bind(controller),
    getOtherDetails: controller.getOtherDetails.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Resolutions/DcrBankAccountOpeningAffinBank" as *;
</style>
