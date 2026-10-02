<template>
  <div id="dcr-bank-account-opening-cimb-omnibus">
    <Paper
      :paper-orientation="PaperOrientation.Portrait"
      :is-loader="true"
      :show-page-number="false"
      v-if="!controller.showDocument"
    >
      <template #paperContent>
        <LoaderPrepare
          :label="controller.loaderLabel"
          :sublabel="controller.loaderSublabel"
        />
      </template>
    </Paper>
    <template v-if="controller.showDocument">
      <Paper
        :paper-orientation="PaperOrientation.Portrait"
        :show-page-number="false"
        additional-css-class="cimb-form-paper"
      >
        <template
          #paperMargins
          v-if="props.isShowTag"
        >
          <div
            class="paper-tag point-left authorised-person-type"
            v-if="controller.isAuthorisedPersonTypeIncomplete()"
          >
            <span>Insert Information</span>
          </div>
        </template>
        <template #paperContent>
          <div class="document-page resolution-page-1">
            <div class="document-header">
              <div class="confidential">
                CONFIDENTIAL /
                <i>SULIT</i>
              </div>
            </div>
            <div class="document-head">
              <p class="document-title"><b>OMNIBUS BOARD RESOLUTION</b></p>
              <p>(Applicable for Sdn Bhd, Bhd and Labuan Companies only)</p>
            </div>
            <div class="company-details">
              <div class="form-group">
                <p class="field-label">Company Name (“Company”)</p>
                <div class="field-lines">
                  <input
                    type="text"
                    class="form-control"
                    name="resolution-9-company"
                    placeholder="SAMPLE COMPANY SDN BHD"
                    autocomplete="off"
                    :value="controller.companyName()"
                    :style="'padding:0px  5px;'"
                    readonly
                  />
                  <!-- TODO Fix me -->
                </div>
              </div>
              <div class="registration-row">
                <span>Business Registration Number</span>
                <input
                  type="text"
                  class="form-control"
                  name="resolution-9-registration"
                  placeholder="000000000000"
                  autocomplete="off"
                  style="padding: 0px 5px; width: 268pt; letter-spacing: 9pt; border: 1px solid black"
                  :value="controller.registrationNumberNew()"
                  readonly
                />
                <!-- TODO Fix me -->
              </div>
            </div>
            <div class="resolution-preamble">
              <p>
                Resolutions of the Board of Directors of the Company pursuant to the Company’s Article of Association /
                *Company’s Constitution /
                <br />
                *the Companies Act 2016
              </p>
            </div>
            <p class="resolution-subject">
              <b>
                <u>
                  Opening of Bank Account(s) and Subscription of Banking Product / Services with CIMB Bank Berhad and /
                  or
                  <br />
                  CIMB Islamic Bank Berhad
                </u>
              </b>
            </p>
            <p class="resolved-statement"><b>IT IS RESOLVED THAT:</b></p>
            <div class="document-section authorised-person">
              <div class="document-section-title">
                A.
                <u>AUTHORISED PERSON</u>
              </div>
              <div class="document-section-content">
                <p>
                  Approval and authorisation be given for any *one / two /
                  <select
                    class="form-control inline-number"
                    name="resolution-9-authorised-count"
                    autocomplete="off"
                    style="text-align: center; width: 50px"
                    :disabled="!controller.isDocumentEditable()"
                    :value="controller.application.value?.signatoryType ?? ''"
                    @change="controller.onSignatoryTypeChanged(($event.target as HTMLSelectElement).value)"
                  >
                    <option
                      disabled
                      value=""
                    >
                      Select Amount
                    </option>
                    <option value="solely">SOLELY</option>
                    <option value="one">ONE</option>
                    <option value="two">TWO</option>
                    <option value="anyone">ANYONE</option>
                  </select>
                  of the persons with specimen signatures appended in Annexure
                  <br />
                  <span v-html="controller.getBoldQuote('Authorised Person')" />
                  <sup>1</sup>
                  to do the following for and on behalf of the Company:
                </p>
                <ol class="lower-alpha">
                  <li>
                    to open, maintain and / or close any account(s)
                    <span v-html="controller.getBoldQuote('Accounts')" />
                    with CIMB Bank Berhad and / or CIMB Islamic Bank Berhad (“Bank”)
                    <br />
                    at any time subject to the terms and conditions of such Accounts;
                  </li>
                  <li>
                    to subscribe, maintain and / or terminate any electronic banking services and / or cash management
                    services, remittances and
                    <br />
                    payment services, including to book foreign exchange rates and to authorize foreign exchange
                    transactions and any other services
                    <br />
                    of a similar nature offered by the Bank
                    <span v-html="controller.getBoldQuote('Services')" />
                    at any time subject to the terms and conditions of such Services;
                  </li>
                  <li>
                    to appoint, change and / or revoke the appointment of:
                    <ol class="lower-roman">
                      <li>
                        any person whose signatures may be appended in the Signature Form (“
                        <b>Authorised Signatory</b>
                        ”)
                        <sup>2</sup>
                        in connection with the
                        <br />
                        operation of the Accounts, including signing and / or issuing any cheques, promissory notes,
                        orders, bills, instructions or
                        <br />
                        receipts;
                      </li>
                      <li>
                        any users to use and / or operate the Services
                        <span v-html="controller.getBoldQuote('Authorised User')" />
                        <sup>3</sup>
                        ; and
                      </li>
                    </ol>
                  </li>
                  <li>
                    to negotiate, accept, execute and / or issue any documents or agreements including any supplemental,
                    letters, forms, indemnities,
                    <br />
                    undertakings, notices or communications
                    <span v-html="controller.getBoldQuote('Documents')" />
                    in connection with the Accounts and / or the Services.
                  </li>
                </ol>
              </div>
            </div>
            <div class="document-section common-seal">
              <div class="document-section-title">
                B.
                <u>COMMON SEAL</u>
              </div>
              <div class="document-section-content">
                <p>
                  Approval and authorisation be given for the Common Seal of the Company to be affixed, wherever
                  necessary or required by the Bank
                  <br />
                  on any Documents.
                </p>
              </div>
            </div>
            <div class="document-section ratification">
              <div class="document-section-title">
                C.
                <u>RATIFICATION</u>
              </div>
              <div class="document-section-content">
                <p>
                  Approval and authorisation be given to the Company to ratify, confirm, declare and adopt each and
                  every action, deeds, agreements,
                  <br />
                  transactions done or made prior to the date of this resolution in connection with the Accounts and /
                  or Services undertaken by the
                  <br />
                  Company.
                </p>
              </div>
            </div>
            <div class="document-section certification">
              <div class="document-section-title">
                D.
                <u>CERTIFICATION</u>
              </div>
              <div class="document-section-content">
                <p>Approval and authorization be given to:</p>
                <ol class="lower-alpha">
                  <li>
                    the sole Director
                    <b>OR</b>
                    Company Secretary and one (1) Director
                    <b>OR</b>
                    two (2) Directors to certify any extract Resolution; and
                  </li>
                  <li>
                    the Company Secretary or Company Director(s) to certify any company documents other than the extract
                    Resolution.
                  </li>
                </ol>
              </div>
            </div>
            <div class="document-section supersession">
              <div class="document-section-title">
                E.
                <u>SUPERSESSION</u>
              </div>
              <div class="document-section-content">
                <p>
                  This resolution shall supersede all existing resolutions for the operation of the Accounts and / or
                  Services solely operated by the
                  <br />
                  Company previously received and recorded by the Bank. For avoidance of doubt, all or any Accounts
                  which are operated solely by
                  <br />
                  third parties or jointly with third parties including but not limited to, the Bank or its affiliates
                  shall not be superseded by this resolution.
                </p>
              </div>
            </div>
            <div class="document-footer">
              <p>Version: BUSINESSACCOUNTAPPLICATIONFORM - DEC2023</p>
              <div class="footer-bottom">
                <span></span>
                <span>[Page I]</span>
              </div>
            </div>
          </div>
        </template>
      </Paper>

      <Paper
        :paper-orientation="PaperOrientation.Portrait"
        :show-page-number="false"
        additional-css-class="cimb-form-paper"
      >
        <template
          #paperMargins
          v-if="props.isShowTag"
        >
          <div
            class="paper-tag point-left authorised-persons"
            v-if="controller.isBoardAnnexureIncomplete()"
          >
            <span>Insert Information</span>
          </div>
        </template>
        <template #paperContent>
          <div class="document-page resolution-page-2">
            <div class="document-header">
              <div class="confidential">
                CONFIDENTIAL /
                <i>SULIT</i>
              </div>
            </div>
            <div class="annexure-heading">
              <p>ANNEXURE</p>
              <p><b>AUTHORISED PERSONS</b></p>
            </div>
            <table class="form-table resolution-signatories authorised-person">
              <colgroup>
                <col class="column-1" />
                <col class="column-2" />
                <col class="column-3" />
              </colgroup>
              <thead>
                <tr>
                  <th>Name of Authorised Person</th>
                  <th>
                    Identity Card Number /
                    <br />
                    Passport Number
                  </th>
                  <th>Specimen Signature</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="i in 4">
                  <td>
                    <input
                      type="text"
                      class="form-control"
                      :name="`authorised-person-${i - 1}-name`"
                      placeholder="SAMPLE NAME"
                      autocomplete="off"
                      :list="`signatory-name-${i - 1}`"
                      style="text-transform: uppercase; padding: 0px 5px; width: calc(100% - 10px)"
                      :disabled="!controller.isDocumentEditable()"
                      v-model="controller.authorisedPersonAt(i - 1).name"
                      @change="controller.onSignatoryNameChange(controller.authorisedPersonAt(i - 1))"
                    />
                    <datalist :id="`signatory-name-${i - 1}`">
                      <option v-for="(name, j) in controller.directorDataListForSignatories(i - 1)">
                        {{ name }}
                      </option>
                    </datalist>
                  </td>
                  <td>
                    <input
                      type="text"
                      class="form-control"
                      :name="`authorised-person-${i - 1}-identity`"
                      placeholder="000000-00-0000"
                      autocomplete="off"
                      :disabled="!controller.isDocumentEditable()"
                      v-model="controller.authorisedPersonAt(i - 1).identification"
                      @change="controller.onCompanySignatoryChanged()"
                    />
                  </td>
                  <td>
                    <div
                      class="specimen-signature"
                      aria-label="Specimen signature"
                    />
                  </td>
                </tr>

                <tr class="signing-condition-row">
                  <td colspan="3">
                    <div class="signing-conditions">
                      <p>Signing Conditions: Tick where applicable</p>
                      <div>
                        <label class="form-check">
                          <input
                            type="checkbox"
                            name="authorised-person-any"
                            :disabled="!controller.isDocumentEditable()"
                            :checked="controller.isSigningConditionSelected('any')"
                            @change="controller.onSigningConditionClicked('any')"
                          />
                          <span>
                            Any
                            <input
                              type="text"
                              class="form-control inline-number"
                              name="authorised-person-count"
                              placeholder="NUMBER"
                              autocomplete="off"
                              :disabled="!controller.isDocumentEditable()"
                              :value="controller.cimbBankApplicationDetails.value.generalOperationSigningCount ?? ''"
                              @change="controller.onSigningCountChanged(($event.target as HTMLInputElement).value)"
                            />
                            to sign
                          </span>
                        </label>
                        <label class="form-check">
                          <input
                            type="checkbox"
                            name="authorised-person-all"
                            :disabled="!controller.isDocumentEditable()"
                            :checked="controller.isSigningConditionSelected('all')"
                            @change="controller.onSigningConditionClicked('all')"
                          />
                          <span>All to sign</span>
                        </label>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <p class="directors-heading"><b>Signed and passed by the ALL Board of Directors</b></p>
            <table class="form-table resolution-signatories director">
              <colgroup>
                <col class="column-1" />
                <col class="column-2" />
                <col class="column-3" />
              </colgroup>
              <thead>
                <tr>
                  <th>Name of Director</th>
                  <th>
                    Identity Card Number /
                    <br />
                    Passport Number
                  </th>
                  <th>Specimen Signature</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="i in 5">
                  <td>
                    <div style="text-align: center">
                      {{ controller.getDirectorName(i - 1) }}
                    </div>
                  </td>
                  <td>
                    <div style="text-align: center">
                      {{ controller.getDirectorIdentification(i - 1) }}
                    </div>
                  </td>
                  <td>
                    <div
                      class="specimen-signature"
                      aria-label="Specimen signature"
                    ></div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="resolution-date">
              <span>Date :</span>
              <div class="date-fields">
                <input
                  type="text"
                  class="form-control"
                  name="board-resolution-date-day"
                  placeholder="DD"
                  maxlength="2"
                  autocomplete="off"
                  :disabled="!controller.isDocumentEditable()"
                  :value="controller.getDatePart('boardResolutionDate', 'day')"
                  @change="
                    controller.onDatePartChanged(
                      'boardResolutionDate',
                      'day',
                      ($event.target as HTMLInputElement).value
                    )
                  "
                />
                <span>/</span>
                <input
                  type="text"
                  class="form-control"
                  name="board-resolution-date-month"
                  placeholder="MM"
                  maxlength="2"
                  autocomplete="off"
                  :disabled="!controller.isDocumentEditable()"
                  :value="controller.getDatePart('boardResolutionDate', 'month')"
                  @change="
                    controller.onDatePartChanged(
                      'boardResolutionDate',
                      'month',
                      ($event.target as HTMLInputElement).value
                    )
                  "
                />
                <span>/</span>
                <input
                  type="text"
                  class="form-control"
                  name="board-resolution-date-year"
                  placeholder="YYYY"
                  maxlength="4"
                  autocomplete="off"
                  :disabled="!controller.isDocumentEditable()"
                  :value="controller.getDatePart('boardResolutionDate', 'year')"
                  @change="
                    controller.onDatePartChanged(
                      'boardResolutionDate',
                      'year',
                      ($event.target as HTMLInputElement).value
                    )
                  "
                />
              </div>
            </div>
            <div class="resolution-footnotes">
              <p>
                <i><u>Footnote</u></i>
              </p>
              <p>
                <sup>1</sup>
                Authorised Person - Signing limit of Account is NOT applicable.
              </p>
              <p>
                <sup>2</sup>
                Authorised Signatory - Please indicate the signing conditions and signing limit in the Signature Form.
              </p>
              <p>
                <sup>3</sup>
                Authorised User - Please indicate the appointment in the application / maintenance form.
              </p>
            </div>
            <div class="document-footer">
              <p>Version: BUSINESSACCOUNTAPPLICATIONFORM - DEC2023</p>
              <div class="footer-bottom">
                <span></span>
                <span>[Page II]</span>
              </div>
            </div>
          </div>
        </template>
      </Paper>

      <Paper
        :paper-orientation="PaperOrientation.Portrait"
        :show-page-number="false"
        additional-css-class="cimb-form-paper"
      >
        <template
          #paperMargins
          v-if="props.isShowTag"
        >
          <div
            class="paper-tag point-left authorised-person-type"
            v-if="controller.isExtractResolutionIncomplete()"
          >
            <span>Insert Information</span>
          </div>
        </template>
        <template #paperContent>
          <div class="document-page resolution-page-3">
            <div class="document-header">
              <div class="confidential">
                CONFIDENTIAL /
                <i>SULIT</i>
              </div>
            </div>
            <div class="document-head">
              <p class="document-title"><b>EXTRACT OMNIBUS BOARD RESOLUTION</b></p>
              <p>(Applicable for Sdn Bhd, Bhd and Labuan Companies only)</p>
            </div>
            <div class="company-details">
              <div class="form-group">
                <p class="field-label">Company Name (“Company”)</p>
                <div class="field-lines">
                  <input
                    type="text"
                    class="form-control"
                    name="resolution-11-company"
                    placeholder="SAMPLE COMPANY SDN BHD"
                    autocomplete="off"
                    :value="controller.companyName()"
                    :style="'padding:0px  5px;'"
                    readonly
                  />
                </div>
              </div>
              <div class="registration-row">
                <span>Business Registration Number</span>
                <input
                  type="text"
                  class="form-control"
                  name="resolution-11-registration"
                  placeholder="000000000000"
                  autocomplete="off"
                  style="padding: 0px 5px; width: 268pt; letter-spacing: 9pt; border: 1px solid black"
                  :value="controller.registrationNumberOld()"
                  readonly
                />
              </div>
            </div>
            <div class="resolution-preamble">
              Certified Extract of Board Resolution passed on
              <span class="inline-date">
                <div
                  class="date-fields"
                  style="width: 183px"
                >
                  <input
                    type="text"
                    class="form-control"
                    name="extract-passed-date-day"
                    placeholder="DD"
                    maxlength="2"
                    autocomplete="off"
                    style="padding-left: 4.3pt; letter-spacing: 7pt"
                    :disabled="!controller.isDocumentEditable()"
                    :value="controller.getDatePart('extractPassedDate', 'day')"
                    @change="
                      controller.onDatePartChanged(
                        'extractPassedDate',
                        'day',
                        ($event.target as HTMLInputElement).value
                      )
                    "
                  />
                  <span style="border-left: unset">/</span>
                  <input
                    type="text"
                    class="form-control"
                    name="extract-passed-date-month"
                    placeholder="MM"
                    maxlength="2"
                    autocomplete="off"
                    style="padding-left: 2pt; letter-spacing: 7pt"
                    :disabled="!controller.isDocumentEditable()"
                    :value="controller.getDatePart('extractPassedDate', 'month')"
                    @change="
                      controller.onDatePartChanged(
                        'extractPassedDate',
                        'month',
                        ($event.target as HTMLInputElement).value
                      )
                    "
                  />
                  <span style="border-left: unset">/</span>
                  <input
                    type="text"
                    class="form-control"
                    name="extract-passed-date-year"
                    placeholder="YYYY"
                    maxlength="4"
                    autocomplete="off"
                    style="padding-left: 5pt; letter-spacing: 7pt"
                    :disabled="!controller.isDocumentEditable()"
                    :value="controller.getDatePart('extractPassedDate', 'year')"
                    @change="
                      controller.onDatePartChanged(
                        'extractPassedDate',
                        'year',
                        ($event.target as HTMLInputElement).value
                      )
                    "
                  />
                </div>
              </span>
              in accordance with the Company’s *Constitution
              <br />
              / Articles of Association.
            </div>
            <p class="resolution-subject">
              <b>
                <u>
                  Opening of Bank Account(s) and Subscription of Banking Product / Services with CIMB Bank Berhad and /
                  or
                  <br />
                  CIMB Islamic Bank Berhad
                </u>
              </b>
            </p>
            <p class="resolved-statement"><b>IT IS RESOLVED THAT:</b></p>
            <div class="document-section authorised-person">
              <div class="document-section-title">
                A.
                <u>AUTHORISED PERSON</u>
              </div>
              <div class="document-section-content">
                <p>
                  Approval and authorisation be given for any *one / two /
                  <select
                    class="form-control inline-number"
                    name="resolution-9-authorised-count"
                    autocomplete="off"
                    style="text-align: center; width: 50px"
                    :disabled="!controller.isDocumentEditable()"
                    :value="controller.application.value?.signatoryType ?? ''"
                    @change="controller.onSignatoryTypeChanged(($event.target as HTMLSelectElement).value)"
                  >
                    <option
                      disabled
                      value=""
                    >
                      Select Amount
                    </option>
                    <option value="solely">SOLELY</option>
                    <option value="one">ONE</option>
                    <option value="two">TWO</option>
                    <option value="anyone">ANYONE</option>
                  </select>
                  of the persons with specimen signatures appended in Annexure
                  <br />
                  (“
                  <b>Authorised Person</b>
                  ”)
                  <sup>1</sup>
                  to do the following for and on behalf of the Company:
                </p>
                <ol class="lower-alpha">
                  <li>
                    to open, maintain and / or close any account(s) (“
                    <b>Accounts</b>
                    ”) with CIMB Bank Berhad and / or CIMB Islamic Bank Berhad (“Bank”)
                    <br />
                    at any time subject to the terms and conditions of such Accounts;
                  </li>
                  <li>
                    to subscribe, maintain and / or terminate any electronic banking services and / or cash management
                    services, remittances and
                    <br />
                    payment services, including to book foreign exchange rates and to authorize foreign exchange
                    transactions and any other services
                    <br />
                    of a similar nature offered by the Bank (“
                    <b>Services</b>
                    ”) at any time subject to the terms and conditions of such Services;
                  </li>
                  <li>
                    to appoint, change and / or revoke the appointment of:
                    <ol class="lower-roman">
                      <li>
                        any person whose signatures may be appended in the Signature Form (“
                        <b>Authorised Signatory</b>
                        ”)
                        <sup>2</sup>
                        in connection with the
                        <br />
                        operation of the Accounts, including signing and / or issuing any cheques, promissory notes,
                        orders, bills, instructions or
                        <br />
                        receipts;
                      </li>
                      <li>
                        any users to use and / or operate the Services (“
                        <b>Authorised User</b>
                        ”)
                        <sup>3</sup>
                        ; and
                      </li>
                    </ol>
                  </li>
                  <li>
                    to negotiate, accept, execute and / or issue any documents or agreements including any supplemental,
                    letters, forms, indemnities,
                    <br />
                    undertakings, notices or communications (“Documents”) in connection with the Accounts and / or the
                    Services.
                  </li>
                </ol>
              </div>
            </div>
            <div class="document-section common-seal">
              <div class="document-section-title">
                B.
                <u>COMMON SEAL</u>
              </div>
              <div class="document-section-content">
                <p>
                  Approval and authorisation be given for the Common Seal of the Company to be affixed, wherever
                  necessary or required by the Bank
                  <br />
                  on any Documents.
                </p>
              </div>
            </div>
            <div class="document-section ratification">
              <div class="document-section-title">
                C.
                <u>RATIFICATION</u>
              </div>
              <div class="document-section-content">
                <p>
                  Approval and authorisation be given to the Company to ratify, confirm, declare and adopt each and
                  every action, deeds, agreements,
                  <br />
                  transactions done or made prior to the date of this resolution in connection with the Accounts and /
                  or Services undertaken by the
                  <br />
                  Company.
                </p>
              </div>
            </div>
            <div class="document-section certification">
              <div class="document-section-title">
                D.
                <u>CERTIFICATION</u>
              </div>
              <div class="document-section-content">
                <p>Approval and authorization be given to:</p>
                <ol class="lower-alpha">
                  <li>
                    the sole Director
                    <b>OR</b>
                    Company Secretary and one (1) Director
                    <b>OR</b>
                    Two (2) Directors to certify any extract Resolution; and
                  </li>
                  <li>
                    the Company Secretary or Company Director(s) to certify any company documents other than the extract
                    Resolution.
                  </li>
                </ol>
              </div>
            </div>
            <div class="document-section supersession">
              <div class="document-section-title">
                E.
                <u>SUPERSESSION</u>
              </div>
              <div class="document-section-content">
                <p>
                  This resolution shall supersede all existing resolutions for the operation of the Accounts and / or
                  Services solely operated by the
                  <br />
                  Company previously received and recorded by the Bank. For avoidance of doubt, all or any Accounts
                  which are operated solely by
                  <br />
                  third parties or jointly with third parties including but not limited to, the Bank or its affiliates
                  shall not be superseded by this resolution.
                </p>
              </div>
            </div>
            <div class="resolution-footnotes">
              <p>
                <i><u>Footnote</u></i>
              </p>
              <p>
                <sup>1</sup>
                Authorised Person - Signing limit of Account is NOT applicable.
              </p>
              <p>
                <sup>2</sup>
                Authorised Signatory - Please indicate the signing conditions and signing limit in the Signature Form.
              </p>
              <p>
                <sup>3</sup>
                Authorised User - Please indicate the appointment in the application / maintenance form.
              </p>
            </div>
            <div class="document-footer">
              <p>Version: BUSINESSACCOUNTAPPLICATIONFORM - DEC2023</p>
              <div class="footer-bottom">
                <span></span>
                <span>[Page I]</span>
              </div>
            </div>
          </div>
        </template>
      </Paper>

      <Paper
        :paper-orientation="PaperOrientation.Portrait"
        :show-page-number="false"
        additional-css-class="cimb-form-paper"
      >
        <template
          #paperMargins
          v-if="props.isShowTag"
        >
          <div
            class="paper-tag point-left authorised-person-list"
            v-if="controller.isExtractAnnexureIncomplete()"
          >
            <span>Insert Information</span>
          </div>
        </template>
        <template #paperContent>
          <div class="document-page resolution-page-4">
            <div class="document-header">
              <div class="confidential">
                CONFIDENTIAL /
                <i>SULIT</i>
              </div>
            </div>
            <div class="extract-certification">
              <p class="certification-heading">
                <b><u>CERTIFICATION OF THE EXTRACT RESOLUTION</u></b>
              </p>
              <p>I / We, the undersigned below, certify that the above is the accurate extract of the resolution.</p>
            </div>
            <div class="two-columns certifier-signatures">
              <div class="signature-block">
                <p>Director / Company Secretary</p>
                <div class="signature-placeholder"></div>
                <div class="form-group">
                  <p class="field-label">Full Name</p>
                  <div class="field-lines">
                    <input
                      type="text"
                      class="form-control"
                      name="certifier-1-name-1"
                      placeholder="SAMPLE NAME"
                      autocomplete="off"
                      list="omnibus-certifier-director-0"
                      :disabled="!controller.isDocumentEditable()"
                      v-model="controller.certifierAt(0).nameLine1"
                      @change="controller.onCertifierNameChanged(0)"
                    />
                    <datalist id="omnibus-certifier-director-0">
                      <option
                        v-for="name in controller.directorDataListForCertifier(0)"
                        :key="name"
                        :value="name"
                      >
                        {{ name }}
                      </option>
                    </datalist>
                    <input
                      type="text"
                      class="form-control"
                      name="certifier-1-name-2"
                      placeholder="SAMPLE NAME"
                      autocomplete="off"
                      :disabled="!controller.isDocumentEditable()"
                      v-model="controller.certifierAt(0).nameLine2"
                      @change="controller.onOtherDetailsChanged()"
                    />
                  </div>
                </div>
                <div class="form-group">
                  <p class="field-label">NRIC / Passport Number</p>
                  <div class="field-lines">
                    <input
                      type="text"
                      class="form-control"
                      name="certifier-1-identity"
                      placeholder="000000-00-0000"
                      autocomplete="off"
                      :disabled="!controller.isDocumentEditable()"
                      v-model="controller.certifierAt(0).identification"
                      @change="controller.onOtherDetailsChanged()"
                    />
                  </div>
                </div>
              </div>
              <div class="signature-block">
                <p>Director / Company Secretary</p>
                <div class="signature-placeholder"></div>
                <div class="form-group">
                  <p class="field-label">Full Name</p>
                  <div class="field-lines">
                    <input
                      type="text"
                      class="form-control"
                      name="certifier-2-name-1"
                      placeholder="SAMPLE NAME"
                      autocomplete="off"
                      list="omnibus-certifier-director-1"
                      :disabled="!controller.isDocumentEditable()"
                      v-model="controller.certifierAt(1).nameLine1"
                      @change="controller.onCertifierNameChanged(1)"
                    />
                    <datalist id="omnibus-certifier-director-1">
                      <option
                        v-for="name in controller.directorDataListForCertifier(1)"
                        :key="name"
                        :value="name"
                      >
                        {{ name }}
                      </option>
                    </datalist>
                    <input
                      type="text"
                      class="form-control"
                      name="certifier-2-name-2"
                      placeholder="SAMPLE NAME"
                      autocomplete="off"
                      :disabled="!controller.isDocumentEditable()"
                      v-model="controller.certifierAt(1).nameLine2"
                      @change="controller.onOtherDetailsChanged()"
                    />
                  </div>
                </div>
                <div class="form-group">
                  <p class="field-label">NRIC / Passport Number</p>
                  <div class="field-lines">
                    <input
                      type="text"
                      class="form-control"
                      name="certifier-2-identity"
                      placeholder="000000-00-0000"
                      autocomplete="off"
                      :disabled="!controller.isDocumentEditable()"
                      v-model="controller.certifierAt(1).identification"
                      @change="controller.onOtherDetailsChanged()"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="resolution-date">
              <span>Date :</span>
              <div class="date-fields">
                <input
                  type="text"
                  class="form-control"
                  name="extract-certification-date-day"
                  placeholder="DD"
                  maxlength="2"
                  autocomplete="off"
                  :disabled="!controller.isDocumentEditable()"
                  :value="controller.getDatePart('extractCertificationDate', 'day')"
                  @change="
                    controller.onDatePartChanged(
                      'extractCertificationDate',
                      'day',
                      ($event.target as HTMLInputElement).value
                    )
                  "
                />
                <span>/</span>
                <input
                  type="text"
                  class="form-control"
                  name="extract-certification-date-month"
                  placeholder="MM"
                  maxlength="2"
                  autocomplete="off"
                  :disabled="!controller.isDocumentEditable()"
                  :value="controller.getDatePart('extractCertificationDate', 'month')"
                  @change="
                    controller.onDatePartChanged(
                      'extractCertificationDate',
                      'month',
                      ($event.target as HTMLInputElement).value
                    )
                  "
                />
                <span>/</span>
                <input
                  type="text"
                  class="form-control"
                  name="extract-certification-date-year"
                  placeholder="YYYY"
                  maxlength="4"
                  autocomplete="off"
                  :disabled="!controller.isDocumentEditable()"
                  :value="controller.getDatePart('extractCertificationDate', 'year')"
                  @change="
                    controller.onDatePartChanged(
                      'extractCertificationDate',
                      'year',
                      ($event.target as HTMLInputElement).value
                    )
                  "
                />
              </div>
            </div>
            <div class="annexure-heading">
              <p>ANNEXURE</p>
              <p><b>LIST OF AUTHORISED PERSONS</b></p>
            </div>
            <table class="form-table resolution-signatories extract-authorised-person">
              <colgroup>
                <col class="column-1" />
                <col class="column-2" />
                <col class="column-3" />
              </colgroup>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>
                    Identity Card Number /
                    <br />
                    Passport Number
                  </th>
                  <th>Specimen Signature</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="i in 6">
                  <td>
                    <input
                      type="text"
                      class="form-control"
                      :name="`extract-authorised-person-${i - 1}-name`"
                      placeholder="SAMPLE NAME"
                      autocomplete="off"
                      :list="`extract-authorised-person-director-${i - 1}`"
                      :disabled="!controller.isDocumentEditable()"
                      v-model="controller.authorisedPersonAt(i - 1).name"
                      @change="controller.onSignatoryNameChange(controller.authorisedPersonAt(i - 1))"
                    />
                    <datalist :id="`extract-authorised-person-director-${i - 1}`">
                      <option
                        v-for="name in controller.directorDataListForSignatories(i - 1)"
                        :key="name"
                        :value="name"
                      >
                        {{ name }}
                      </option>
                    </datalist>
                  </td>
                  <td>
                    <input
                      type="text"
                      class="form-control"
                      :name="`extract-authorised-person-${i - 1}-identity`"
                      placeholder="000000-00-0000"
                      autocomplete="off"
                      :disabled="!controller.isDocumentEditable()"
                      v-model="controller.authorisedPersonAt(i - 1).identification"
                      @change="controller.onCompanySignatoryChanged()"
                    />
                  </td>
                  <td>
                    <div
                      class="specimen-signature"
                      aria-label="Specimen signature"
                    ></div>
                  </td>
                </tr>

                <tr class="signing-condition-row">
                  <td colspan="3">
                    <div class="signing-conditions">
                      <p>Signing Conditions: Tick where applicable</p>
                      <div>
                        <label class="form-check">
                          <input
                            type="checkbox"
                            name="extract-authorised-person-any"
                            :disabled="!controller.isDocumentEditable()"
                            :checked="controller.isSigningConditionSelected('any')"
                            @change="controller.onSigningConditionClicked('any')"
                          />
                          <span>
                            Any
                            <input
                              type="text"
                              class="form-control inline-number"
                              name="extract-authorised-person-count"
                              placeholder="NUMBER"
                              autocomplete="off"
                              :disabled="!controller.isDocumentEditable()"
                              :value="controller.cimbBankApplicationDetails.value.generalOperationSigningCount ?? ''"
                              @change="controller.onSigningCountChanged(($event.target as HTMLInputElement).value)"
                            />
                            to sign
                          </span>
                        </label>
                        <label class="form-check">
                          <input
                            type="checkbox"
                            name="extract-authorised-person-all"
                            :disabled="!controller.isDocumentEditable()"
                            :checked="controller.isSigningConditionSelected('all')"
                            @change="controller.onSigningConditionClicked('all')"
                          />
                          <span>All to sign</span>
                        </label>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="document-footer">
              <p>Version: BUSINESSACCOUNTAPPLICATIONFORM - DEC2023</p>
              <div class="footer-bottom">
                <span></span>
                <span>[Page II]</span>
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
  import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
  import { StringUtil } from "~/scripts/utils/String"
  import { PaperOrientation } from "~/scripts/constants/Paper"
  import { DcrBankAccountOpeningCimbOmnibusController } from "~/scripts/components/resolutions/DcrBankAccountOpeningCimbOmnibusController"

  const props = defineProps<IPropsResolutionDocument<CompanyBankAccountOpening>>()

  const emit = defineEmits(["startLoading", "doneLoading", "signed", "updated"])

  const resolutionContent = ref(null)
  const nonDirectorBankSignatoryRef = ref(null)

  const controller = new DcrBankAccountOpeningCimbOmnibusController(props, emit)

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
    getOtherDetails: controller.getOtherDetails.bind(controller),
    getPdfPages: controller.getPdfPages.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Resolutions/DcrBankAccountOpeningCimbOmnibus" as *;
</style>
