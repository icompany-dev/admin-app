<template>
  <div id="dcr-bank-account-opening-hong-leong-bank">
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
      >
        <template
          #paperMargins
          v-if="props.isShowTag"
        >
          <div class="paper-tag point-left branch-selection"><span>Insert Information</span></div>
        </template>
        <template #paperContent>
          <div class="document-footer">
            <div class="left-side">
              <b>
                Hong Leong Bank Berhad 193401000023 (97141-X) Hong Leong Islamic Bank Berhad 200501009144 (686191-W)
              </b>
              <br />
              <i>Version 2.0</i>
            </div>
            <div class="right-side">
              Page
              <span class="page-count">01</span>
            </div>
          </div>
          <div class="document-head">
            <div class="document-title">CERTIFIED EXTRACT OF DIRECTORS RESOLUTION</div>
            <div class="document-name">
              APPLICATION FOR HONG LEONG BANK BUSINESS DEPOSIT ACCOUNTS,
              <br />
              HONG LEONG BUSINESS INTERNET/ELECTRONIC BANKING, COLLECTION SERVICES AND/OR AUTO-SWEEP SERVICES
            </div>
            <div class="document-sub-title">
              (Where resolution was passed before the said application for and/or opening)
            </div>
          </div>
          <div class="document-section">
            <div class="document-section-content document-opening">
              <p>
                The Board of Directors of
                <span class="prefilled-field company-name">{{ controller.companyName() }}</span>
                [name of company] passed the following resolution on
                <span class="prefilled-field document-full-date"></span>
                [date]: -
              </p>
              <p>
                <b>IT IS HEREBY RESOLVED AS FOLLOWS</b>
              </p>
            </div>
          </div>
          <div class="document-section">
            <div class="document-section-title">A. OPENING OF ACCOUNT AND OPERATING MANDATE**</div>
            <div class="document-section-content">
              <p>
                <small>**Please draw a line diagonally across this part if not applicable.</small>
              </p>
              <ol>
                <li>
                  "THAT authority be and is hereby given for the Company to apply for Business Deposits Account(s) (the
                  “Account(s)”) with Hong Leong Bank Berhad (“HLB”)/Hong Leong Islamic Bank Berhad (“HLISB”) in
                  <BranchDropdown
                    :bank-id="controller.bank.value.id"
                    :selected-branch-id="controller.getBranchId()"
                    :is-disabled="!controller.isDocumentEditable()"
                    @branch-selected="controller.onBranchOptionSelected($event)"
                  />
                  [to state Branch] as required from time to time.”
                </li>
                <li>
                  "THAT authority be and is hereby given to the authorised signatory(ies) as set out in Item D. of this
                  Resolution (”Authorised Signatories”) to do the following:-
                  <ol class="lower-roman">
                    <li>
                      apply for, accept and sign, all relevant documents drawn or to be drawn up in connection with the
                      Account(s) and to act on any instructions and accept any receipts or other documents relating to
                      the Account(s), transactions or affairs of the Company, if so, signed on behalf of the Company;
                    </li>
                    <li>
                      pay and honour all cheques, bills of exchange, deposits, receipts, requests involving payment or
                      transfer of funds and promissory notes
                    </li>
                    <li>perform fixed deposit placements and/or withdrawals under the Account(s);</li>
                  </ol>
                </li>
                <li>
                  THAT, whenever necessary, authority be and is hereby given for the use of the Common Seal of the
                  Company to be affixed to all relevant documents drawn or to be drawn up in connection therewith in
                  accordance with the Company's Articles of Association or constitution (if any) for and on behalf of
                  the Company."
                </li>
                <li>
                  "THAT the Company and its Directors are aware of and hereby agree to abide by the Terms and Conditions
                  for the respective Accounts(s), HLB’s/HLISB’s General Terms and Conditions of Accounts and such other
                  terms and conditions as HLB/HLISB may stipulate from time to time.“
                </li>
              </ol>
            </div>
          </div>
          <div class="document-section">
            <div class="document-section-title">
              B. HONG LEONG BUSINESS INTERNET/ELECTRONIC BANKING - APPLICABLE TO ALL MODULES**
            </div>
            <div class="document-section-content">
              <p>
                <b>IT IS HEREBY RESOLVED AS FOLLOWS:</b>
              </p>
              <ol>
                <li>
                  “THAT approval be and is hereby given for the Company or its successors in title or assigns to apply
                  for and accept from time to time any one or more internet/ electronic banking facilities and/or
                  services (“the Online Services”) which may include but not be limited to cash management services,
                  trade services, collection services or such other facilities and/or services as may be added,
                  withdrawn, varied or replaced from time to time for business banking customers which may be offered by
                  Hong Leong Bank Berhad (“HLB”)/ Hong Leong Islamic Bank Berhad (“HLISB”) or its successors in title or
                  assigns upon such terms and conditions which are made available and may be varied or substituted from
                  time to time via HLB’s website at www.hlb.com.my and HLISB’s website at www.hlisb.com.my (“the Terms
                  and Conditions for Hong Leong Business Internet Banking”).”
                </li>
                <li>
                  “THAT authority be and is hereby given to the nominated authorised signatory(ies) of the Company,
                  whose signature(s) is/are set out in item D of this Resolution (“Authorised Signatories”) to do the
                  following:-
                  <ol class="lower-roman">
                    <li>
                      to apply for and link any one or more or all accounts maintained by the Company with HLB/HLISB
                      (both present and future) under any one or more of the modules pursuant to the Online Services,
                      and to nominate, add, remove or amend details of such person(s) as the user(s) to operate the
                      Online Services from time to time;
                    </li>
                    <li>
                      to nominate, add, remove or amend such person(s) as system user(s) to operate the Online Services
                      and to amend the details of such persons from time to time; and
                    </li>
                    <li>
                      to apply for, accept and sign, all relevant documents of whatsoever nature (including without
                      limitation letters, authorisations and undertakings) drawn up or to be drawn up howsoever in
                      connection with the Online Services (or each of them as and when required) from time to time.
                    </li>
                  </ol>
                </li>
                <li>
                  “THAT, whenever necessary, authority be and is hereby given for the use of the Common Seal of the
                  Company to be affixed to all relevant documents drawn up or to be drawn up in connection therewith in
                  accordance with the Company’s Articles of Association or constitution (if any) for and on behalf of
                  the Company.
                </li>
                <li>
                  “THAT the Company authorises (1) the appointment of one (1) or more authorised representative(s) of
                  the Company as the system administrator(s) on behalf of the Company to create and maintain the payment
                  authorisation workflow and the user profile or assign security code(s) to the user(s) within the Hong
                  Leong business internet/electronic banking (‘the System Administrators”), and (2) the appointment of
                  one (1) or more authorised representative(s) of the Company as the System Authoriser(s) to act on
                  behalf of the Company to approve the creation and maintenance of the payment authorisation workflow,
                  the user profile or assignment of the security code(s) within Hong Leong business internet/electronic
                  banking (“the System Authorisers”), as identified in the Hong Leong Business Internet /Electronic
                  Banking Application Form. In the event of the replacement of any of the System Administrators and/or
                  System Authorisers, the Company hereby authorises the Authorised Signatories to appoint such
                  replacement personnel from time to time and such replacement personnel shall be authorised to act as
                  the System Administrators and/or the System Authorisers, as the case may be.
                </li>
              </ol>
            </div>
          </div>
        </template>
      </Paper>
      <Paper
        :paper-orientation="PaperOrientation.Portrait"
        :show-page-number="false"
        :additional-css-class="controller.additionalCssClass"
      >
        <template #paperContent>
          <div class="document-footer">
            <div class="left-side">
              <b>
                Hong Leong Bank Berhad 193401000023 (97141-X) Hong Leong Islamic Bank Berhad 200501009144 (686191-W)
              </b>
              <br />
              <i>Version 2.0</i>
            </div>
            <div class="right-side">
              Page
              <span class="page-count">02</span>
            </div>
          </div>
          <div class="document-section">
            <div class="document-section-content">
              <ol start="5">
                <li>
                  "THAT the Company acknowledges and agrees that the user(s) will be duly authorised by the System
                  Administrators and/or System Authorisers to act for and on behalf of the Company to access and/or use
                  the Hong Leong business internet/electronic banking including without limitation to accept terms and
                  conditions or submit forms, applications or documents, whether physically, electronically or otherwise
                  (as the case may be).”
                </li>
              </ol>
            </div>
          </div>
          <div class="document-section">
            <div class="document-section-title">B. (i) TRADE SERVICES**</div>
            <div class="document-section-content">
              <p>**Please draw a line diagonally across this part if not applicable.</p>
              <ol>
                <li>
                  “THAT approval be and is hereby given for the Company to make trade inquiries and submit trade
                  drawdown instructions to the Bank which includes selecting and/or inputting the correct and accurate
                  information and uploading the respective trade document(s) to th e Bank via Hong Leong Business
                  Internet/Electronic Banking in accordance to the Terms and Conditions for Hong Leong Bank Business
                  Internet Banking and such other terms and conditions that HLB/HLISB may stipulate from time to time.”
                </li>
                <li>
                  “THAT the Board has read and agreed to the said terms & conditions (mentioned above) and wishes to
                  avail itself to provide such electronic trade drawdown instructions (“Electronic Instructions”) to the
                  Bank. In the event the Company encounters system failure / disruption, the Company is advised to
                  contact the Bank. Thereafter, provided that the issue is due to system failure or disruption on the
                  Bank’s part & upon advice by the Bank to do so, the Company may submit Electronic Instructions via
                  e-mail and/or fax, subject to the prior execution of the Authorisation for Electronic Instructions
                  (AEI) and submission of the same to the Bank; otherwise, the Company may submit physical documents and
                  physical trade drawdown instructions to the Bank.”
                </li>
              </ol>
            </div>
          </div>
          <div class="document-section">
            <div class="document-section-title">B. (ii) COLLECTION SERVICES**</div>
            <div class="document-section-content">
              <p>**Please draw a line diagonally across this part if not applicable.</p>
              <ol>
                <li>
                  “THAT approval be and is hereby given for the Company to enter into relevant agreement(s) from time to
                  time with HLB/HLISB for the collection services provided by HLB/HLISB (“the Collection Services”) to
                  the Company upon the terms and conditions as the Company and HLB/HLISB may mutually agree upon from
                  time to time (including, for the avoidance of doubt, revisions, supplements and substitutions as may
                  be mutually agreed from time to time).”
                </li>
              </ol>
            </div>
          </div>
          <div class="document-section">
            <div class="document-section-title">
              C. HONG LEONG CASH MANAGEMENT AUTO-SWEEP SERVICES**
              <span class="smaller">(ON APPLICATION BASIS AND SUBJECT TO HLB's/HLISB's APPROVAL)</span>
            </div>
            <div class="document-section-content">
              <p>**Please draw a line diagonally across this part if not applicable.</p>
              <ol>
                <li>
                  “THAT approval be and is hereby given for the Company to apply for the Hong Leong Cash Management
                  Auto-Sweep Service (“Auto- Sweep Service”) for an automated service to transfer its funds available in
                  the relevant Current Account/Current Account-i(s) into a Short Term Placement Account (“STP Account”)
                  managed by HLB/HLISB on a daily basis subject to the Auto-Sweep Service Terms and Conditions and such
                  other terms and conditions as HLB/HLISB may stipulate from time to time.”
                </li>
                <li>
                  “THAT the Authorised Signatory(ies) may apply for, accept and sign, all relevant documents drawn or to
                  be drawn up in connection with the Auto-Sweep Service and THAT the Auto-Sweep Services is only
                  applicable to the Current Account/Current Account-i(s) indicated in the Auto-Sweep Services
                  Application Form (“relevant Current Account(s)/Current Account-i(s)”).”
                </li>
                <li>
                  “THAT approval is hereby given to debit the relevant Current Account(s)/Current Account-i(s) in
                  accordance to the Auto-Sweep Services Terms and Conditions.”
                </li>
                <li>
                  “THAT approval be and is hereby given for the Company to make overnight placement funds in the STP
                  Account upon such terms and conditions advised by HLB/HLISB.”
                </li>
                <li>
                  “THAT, whenever necessary, authority be and is hereby given for the use of the Common Seal of the
                  Company to be affixed to all relevant documents drawn or to be drawn up in connection therewith in
                  accordance with the Company’s Articles of Association or constitution (if any) for and on behalf of
                  the Company.”
                </li>
              </ol>
            </div>
          </div>
        </template>
      </Paper>
      <Paper
        :paper-orientation="PaperOrientation.Portrait"
        :show-page-number="false"
        :additional-css-class="controller.additionalCssClass"
        v-for="pageNumber in controller.authorisedSignatoryPages"
        :key="`as-${pageNumber}`"
      >
        <template
          #paperMargins
          v-if="props.isShowTag && pageNumber === 3"
        >
          <div class="paper-tag point-left mandate-type"><span>Select signature condition</span></div>
          <div class="paper-tag point-left authorised-signatories"><span>Insert Information</span></div>
        </template>
        <template #paperContent>
          <div class="document-footer">
            <div class="left-side">
              <b>
                Hong Leong Bank Berhad 193401000023 (97141-X) Hong Leong Islamic Bank Berhad 200501009144 (686191-W)
              </b>
              <br />
              <i>Version 2.0</i>
            </div>
            <div class="right-side">
              Page
              <span class="page-count">0{{ pageNumber }}</span>
            </div>
          </div>
          <div class="document-section hlb-table-wrapper">
            <div
              class="document-section-title"
              v-if="pageNumber === 3"
            >
              D. AUTHORISED SIGNATORIES
            </div>
            <div class="document-section-content">
              <table class="hlb-table">
                <tbody>
                  <tr v-if="pageNumber === 3">
                    <td colspan="2">
                      <b>Condition of Authorisation Please tick (✓)</b>
                      <div class="form-check-wrapper">
                        <div class="form-check">
                          <input
                            type="checkbox"
                            class="form-check-input"
                            :checked="controller.isSignatoryTypeSelected('anyone')"
                            :disabled="!controller.isDocumentEditable()"
                            @click="controller.onSignatoryTypeChanged('anyone')"
                          />
                          <span class="label">Any One to sign</span>
                        </div>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            class="form-check-input"
                            :checked="controller.isSignatoryTypeSelected('any-two')"
                            :disabled="!controller.isDocumentEditable()"
                            @click="controller.onSignatoryTypeChanged('any-two')"
                          />
                          <span class="label">Any two to sign</span>
                        </div>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            class="form-check-input"
                            :checked="controller.isSignatoryTypeSelected('all')"
                            :disabled="!controller.isDocumentEditable()"
                            @click="controller.onSignatoryTypeChanged('all')"
                          />
                          <span class="label">All to sign</span>
                        </div>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            class="form-check-input"
                            :checked="controller.isSignatoryTypeSelected('others')"
                            :disabled="!controller.isDocumentEditable()"
                            @click="controller.onSignatoryTypeChanged('others')"
                          />
                          <span class="label">Others:</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>PERSONAL PARTICULARS</th>
                    <th>SPECIMEN SIGNATURE</th>
                  </tr>
                  <tr
                    v-for="(signatory, index) in controller.getCompanySignatoryOnPage(pageNumber)"
                    :key="index"
                  >
                    <td class="signatory-column">
                      <div
                        class="remove-button"
                        v-if="controller.isDocumentEditable()"
                        @click="controller.onRemoveSignatory(index)"
                      >
                        <i class="fa-regular fa-trash-alt" />
                      </div>
                      <table class="hlb-signatory-details">
                        <tbody>
                          <tr>
                            <td>Name as per NRIC/Passport</td>
                            <td>:</td>
                            <td>
                              <input
                                type="text"
                                class="form-control"
                                v-model="signatory.name"
                                :list="`name-${index}`"
                                :disabled="!controller.isDocumentEditable()"
                                @change="controller.onSignatoryNameChange(signatory)"
                              />
                              <datalist :id="`name-${index}`">
                                <option v-for="(name, j) in controller.directorDataList(signatory.name ?? '')">
                                  {{ name }}
                                </option>
                              </datalist>
                            </td>
                          </tr>
                          <tr>
                            <td>NRIC/Passport No</td>
                            <td>:</td>
                            <td>
                              <input
                                type="text"
                                class="form-control"
                                v-model="signatory.identification"
                                :readonly="controller.isReadOnlyField(signatory)"
                                :disabled="!controller.isDocumentEditable()"
                                @change="controller.onCompanySignatoryChanged()"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>Nationality</td>
                            <td>:</td>
                            <td>
                              <input
                                type="text"
                                class="form-control"
                                v-model="signatory.nationality"
                                :readonly="controller.isNationalityReadOnlyField(signatory)"
                                :disabled="!controller.isDocumentEditable()"
                                @change="controller.onCompanySignatoryChanged()"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>Designation</td>
                            <td>:</td>
                            <td>
                              <input
                                type="text"
                                class="form-control"
                                v-model="signatory.designation"
                                :readonly="controller.isReadOnlyField(signatory)"
                                :disabled="!controller.isDocumentEditable()"
                                @change="controller.onNationalityChanged(signatory)"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>Email Address</td>
                            <td>:</td>
                            <td>
                              <input
                                type="text"
                                class="form-control"
                                v-model="signatory.email"
                                :readonly="controller.isReadOnlyField(signatory)"
                                :disabled="!controller.isDocumentEditable()"
                                @change="controller.onCompanySignatoryChanged()"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>Mobile No.</td>
                            <td>:</td>
                            <td>
                              <input
                                type="text"
                                class="form-control"
                                v-model="signatory.phone"
                                :readonly="controller.isReadOnlyField(signatory)"
                                :disabled="!controller.isDocumentEditable()"
                                @change="controller.onCompanySignatoryChanged()"
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td class="signature-column">
                      {{ signatory.name ? "Wet Ink Required" : "" }}
                    </td>
                  </tr>
                  <tr v-if="controller.isDocumentEditable()">
                    <td
                      colspan="2"
                      class="add-more"
                    >
                      <span
                        class="action-link add-more"
                        @click="controller.onAddAnotherSignatoryClicked()"
                      >
                        Add Another Signatory
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div
            class="document-section"
            v-if="controller.isShowSignaturesOnLastSignatoryPage"
          >
            <div class="document-section-title">CERTIFICATION OF RESOLUTIONS</div>
            <div class="document-section-content">
              <p>
                These resolutions will remain in force unless and until the Company delivers to HLB/HLISB a new
                resolution(s) revoking, amending or superseding these resolutions, and HLB/HLISB has had a reasonable
                opportunity to update its records.
              </p>
              <p>
                We, the undersigned below, as Director(s) of the Company hereby certify that the above resolutions (a)
                have been duly passed and certified in accordance with the Articles of Association of the Company and
                entered in the minute book (b) are still in force (c) do not exceed the objects or powers of the Company
                or the powers of the Director(s). We acknowledge that the Bank places full reliance on our certification
                of the foregoing resolutions and accept our certification as conclusive evidence that this extract is a
                true and accurate record of the resolutions of the Board of Directors of the Company.
              </p>
              <p>
                Dated this
                <span class="prefilled-field document-date"></span>
                day of
                <span class="prefilled-field document-month"></span>
                20
                <span class="prefilled-field document-year"></span>
              </p>
              <div class="signatures-section">
                <div
                  class="signature"
                  v-for="(signature, index) in controller.getSignatureOnLastAuthoriseSignatoryPage()"
                  :key="index"
                >
                  <div class="signature-placeholder">Wet Ink Required</div>
                  <div class="role">
                    {{ index !== 1 ? "Director" : "Company Secretary" }}
                  </div>
                  <div class="name">Name: {{ signature }}</div>
                  <div class="date">Date:</div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Paper>
      <Paper
        :paper-orientation="PaperOrientation.Portrait"
        :show-page-number="false"
        :additional-css-class="controller.additionalCssClass"
        v-for="signaturePageNumber in controller.signaturePages"
        :key="`signature-${signaturePageNumber}`"
      >
        <template #paperContent>
          <div class="document-footer">
            <div class="left-side">
              <b>
                Hong Leong Bank Berhad 193401000023 (97141-X) Hong Leong Islamic Bank Berhad 200501009144 (686191-W)
              </b>
              <br />
              <i>Version 2.0</i>
            </div>
            <div class="right-side">
              Page
              <span class="page-count">0{{ signaturePageNumber }}</span>
            </div>
          </div>
          <div class="document-section">
            <div
              class="document-section-title"
              v-if="!controller.isShowSignaturesOnLastSignatoryPage"
            >
              CERTIFICATION OF RESOLUTIONS
            </div>
            <div class="document-section-content">
              <p v-if="!controller.isShowSignaturesOnLastSignatoryPage">
                These resolutions will remain in force unless and until the Company delivers to HLB/HLISB a new
                resolution(s) revoking, amending or superseding these resolutions, and HLB/HLISB has had a reasonable
                opportunity to update its records.
              </p>
              <p v-if="!controller.isShowSignaturesOnLastSignatoryPage">
                We, the undersigned below, as Director(s) of the Company hereby certify that the above resolutions (a)
                have been duly passed and certified in accordance with the Articles of Association of the Company and
                entered in the minute book (b) are still in force (c) do not exceed the objects or powers of the Company
                or the powers of the Director(s). We acknowledge that the Bank places full reliance on our certification
                of the foregoing resolutions and accept our certification as conclusive evidence that this extract is a
                true and accurate record of the resolutions of the Board of Directors of the Company.
              </p>
              <p v-if="!controller.isShowSignaturesOnLastSignatoryPage">
                Dated this
                <span class="prefilled-field document-date"></span>
                day of
                <span class="prefilled-field document-month"></span>
                20
                <span class="prefilled-field document-year"></span>
              </p>
              <div class="signatures-section">
                <div
                  class="signature"
                  v-for="(signature, index) in controller.getSignaturesOnPage(signaturePageNumber)"
                  :key="index"
                >
                  <div class="signature-placeholder">Wet Ink Required</div>
                  <div class="role">
                    {{ index !== 1 ? "Director" : "Company Secretary" }}
                  </div>
                  <div class="name">Name: {{ signature }}</div>
                  <div class="date">Date:</div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Paper>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import Paper from "@/components/Papers/Paper.vue"
  import BranchDropdown from "@/components/Banks/BranchDropdown.vue"
  import type { CompanyBankAccountOpening } from "~/scripts/models/CompanyBankAccountOpening"
  import { DcrBankAccountOpeningHongLeongBankController } from "~/scripts/components/resolutions/DcrBankAccountOpeningHongLeongBankController"
  import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
  import { StringUtil } from "~/scripts/utils/String"
  import { PaperOrientation } from "~/scripts/constants/Paper"

  const props = defineProps<IPropsResolutionDocument<CompanyBankAccountOpening>>()

  const emit = defineEmits(["startLoading", "doneLoading", "signed", "updated"])

  const resolutionContent = ref(null)
  const nonDirectorBankSignatoryRef = ref(null)

  const controller = new DcrBankAccountOpeningHongLeongBankController(props, emit)

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

  watch(nonDirectorBankSignatoryRef, (newVal) => {
    controller.setNonDirectorBankSignatoryRef(newVal)
  })

  defineExpose({
    totalPages: controller.totalPages.bind(controller),
    getApplication: controller.getApplication.bind(controller),
    updateApplicationContent: controller.updateApplicationContent.bind(controller),
    isLoading: controller.isLoading.value,
    getAuthorisedPersonsForOnlineBanking: controller.getAuthorisedPersonsForOnlineBanking.bind(controller),
    getSignatoryType: controller.getSignatoryType.bind(controller),
    getSignatories: controller.getSignatories.bind(controller),
    getBranchId: controller.getBranchId.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Resolutions/DcrBankAccountOpeningHongLeongBank" as *;
</style>
