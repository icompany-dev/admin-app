<template>
  <div id="legal-documents-alliance-bank-application-form">
    <Paper
      v-if="controller.isLoading.value"
      :is-loader="true"
      :show-page-number="false"
      :paper-orientation="controller.paperOrientation"
    >
      <template #paperContent>
        <LoaderPrepare
          :label="controller.loaderLabel()"
          :sublabel="controller.loaderSublabel()"
        />
      </template>
    </Paper>
    <template v-if="!controller.isLoading.value">
      <Paper
        :paper-orientation="controller.paperOrientation"
        :additional-css-class="controller.additionalCssClass"
        :show-page-number="false"
      >
        <template #paperContent>
          <div class="logos-container">
            <div class="logo">//Alliance Bank</div>
            <div class="logo">//Alliance islamic Bank</div>
          </div>
          <div class="document-name-version">
            <span class="document-name">Universal Business Banking Application Form</span>
            <span class="document-version">(Version 4.5)</span>
          </div>
          <div class="split-section">
            <div class="product-selection-section">
              <div class="heading strong">This form is to apply for the following products</div>
              <div class="sub-heading">
                (Please tick
                <i class="fa-regular fa-square-check"></i>
                where applicable):
              </div>
              <div class="product-selection">
                <div class="form-check">
                  <i class="fa-sharp fa-light fa-square"></i>
                  <div class="label product">
                    <div class="product-name">Current Account, Deposit & Foreign Currency Products</div>
                    <div class="product-instruction">
                      <b>To print:</b>
                      Section A, B, C, G & H
                      <b>To complete:</b>
                      A, B, C & G
                    </div>
                  </div>
                </div>
                <div class="form-check">
                  <i class="fa-sharp fa-light fa-square"></i>
                  <div class="label product">
                    <div class="product-name">Alliance BizSmart® Online Banking</div>
                    <div class="product-instruction">
                      <b>To print:</b>
                      Section A, D, G & H
                      <b>To complete:</b>
                      A, D & G
                    </div>
                  </div>
                </div>
                <div class="form-check">
                  <i class="fa-sharp fa-light fa-square"></i>
                  <div class="label product">
                    <div class="product-name">Merchant Facility</div>
                    <div class="product-instruction">
                      <b>To print:</b>
                      Section A, E, G & H
                      <b>To complete:</b>
                      A, E & G
                    </div>
                  </div>
                </div>
                <div class="form-check">
                  <i class="fa-sharp fa-light fa-square"></i>
                  <div class="label product">
                    <div class="product-name">Biz-Xpress Card (Business Debit Card)</div>
                    <div class="product-instruction">
                      <b>To print:</b>
                      Section A, B, G & H
                      <b>To complete:</b>
                      A, B & G
                    </div>
                  </div>
                </div>
                <div class="form-check">
                  <i class="fa-sharp fa-light fa-square"></i>
                  <div class="label product">
                    <div class="product-name">Loan/Financing Facility</div>
                    <div class="product-instruction">
                      <b>To print:</b>
                      Section A, F, G & H
                      <b>To complete:</b>
                      A, F & G
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="account-details-section">
              <table class="alliance-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>GIF No.:</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="i in Array.from({ length: 5 }, (_, i) => i)"
                    :key="i"
                  >
                    <td colspan="2">
                      <ol
                        :start="i + 1"
                        class="account-detail-list"
                      >
                        <li>
                          Account No.:
                          <br />
                          Account Type:
                        </li>
                      </ol>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="application-detail-section">
            <table class="alliance-application-table">
              <thead>
                <tr>
                  <th colspan="12">
                    <div class="section-head">
                      <span>SECTION</span>
                      <span class="section-number">A</span>
                      <span>. BUSINESS INFORMATION</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colspan="12">
                    <b>Incorporated/Registered Name:</b>
                    {{ controller.companyName() }}
                  </td>
                </tr>
                <tr>
                  <td colspan="12">
                    <b>Trading Name</b>
                    <small>(if applicable)</small>
                    <b>:</b>
                  </td>
                </tr>
                <tr>
                  <td colspan="7">
                    <b>Business/Company Registration No.:</b>
                    {{ controller.registrationNumberNew() }} ({{ controller.registrationNumberOld() }})
                  </td>
                  <td colspan="5">
                    <b>Date of Incorporation/Registration:</b>
                    {{ controller.dateOfIncorporation }}
                  </td>
                </tr>
                <tr>
                  <td colspan="12">
                    <b>Business Type</b>
                    <small>
                      (Please tick
                      <i class="fa-regular fa-square-check"></i>
                      ONE only)
                    </small>
                    :
                    <div class="business-type-selection form-checks-container">
                      <div class="first-section">
                        <div class="form-check">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>Sole Proprietor (21)</span>
                        </div>
                        <div class="form-check">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>Partnership (22)</span>
                        </div>
                        <div class="form-check">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>Professional Agency (23)</span>
                        </div>
                        <div class="form-check">
                          <i class="fa-sharp fa-light fa-square-check"></i>
                          <span>Company (24)</span>
                        </div>
                      </div>
                      <div class="second-section">
                        <div class="form-check">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>Limited Liability Partnership (26)</span>
                        </div>
                        <div class="form-check">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>Trade Union (41)</span>
                        </div>
                        <div class="form-check">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>Co-operative Society (42)</span>
                        </div>
                        <div class="form-check">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>Society/Association (46)</span>
                        </div>
                      </div>
                      <div class="third-section">
                        <div class="form-check">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <div class="other-business-type">
                            For other business types, please refer to Appendix 1 and fill in the code:
                            <div class="empty-boxes">
                              <span></span>
                              <span></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="6">
                    <b>Business/Company Address 1</b>
                    <small>
                      (Please tick
                      <i class="fa-regular fa-square-check"></i>
                      where applicable)
                    </small>
                    :
                    <div class="form-checks-container compact">
                      <div class="form-check">
                        <i class="fa-sharp fa-light fa-square-check"></i>
                        <span>Main/HQ</span>
                      </div>
                      <div class="form-check">
                        <i class="fa-sharp fa-light fa-square"></i>
                        <span>Mailing</span>
                      </div>
                      <div class="form-check">
                        <i class="fa-sharp fa-light fa-square"></i>
                        <span>Other Business Location</span>
                      </div>
                    </div>
                    <b>Business Premises</b>
                    <small>
                      (Please tick
                      <i class="fa-regular fa-square-check"></i>
                      ONE only)
                    </small>
                    :
                    <div class="form-checks-container compact">
                      <div class="form-check">
                        <i class="fa-sharp fa-light fa-square"></i>
                        <span>Owned</span>
                      </div>
                      <div class="form-check">
                        <i class="fa-sharp fa-light fa-square"></i>
                        <span>Rented</span>
                      </div>
                    </div>
                    <div class="address-section">
                      {{ controller.companyAddressLine1 }},
                      <br />
                      <span v-if="controller.companyAddressLine2.length > 1">
                        {{ controller.companyAddressLine2 }},
                        <br />
                      </span>
                      {{ controller.companyAddressCity }}
                    </div>
                    <div class="state-postcode">
                      <div class="state-side">
                        <b>State:</b>
                        {{ controller.companyAddressState }}
                      </div>
                      <div class="postcode-side empty-boxes">
                        <span v-for="i in Array.from({ length: 5 }, (_, i) => i)">
                          {{ controller.companyAddressPostcode(i) }}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td colspan="6">
                    <b>Business/Company Address 2</b>
                    <small>
                      (Please tick
                      <i class="fa-regular fa-square-check"></i>
                      where applicable)
                    </small>
                    :
                    <div class="form-checks-container compact">
                      <div class="form-check">
                        <i class="fa-sharp fa-light fa-square"></i>
                        <span>Main/HQ</span>
                      </div>
                      <div class="form-check">
                        <i class="fa-sharp fa-light fa-square"></i>
                        <span>Mailing</span>
                      </div>
                      <div class="form-check">
                        <i class="fa-sharp fa-light fa-square"></i>
                        <span>Other Business Location</span>
                      </div>
                    </div>
                    <b>Business Premises</b>
                    <small>
                      (Please tick
                      <i class="fa-regular fa-square-check"></i>
                      ONE only)
                    </small>
                    :
                    <div class="form-checks-container compact">
                      <div class="form-check">
                        <i class="fa-sharp fa-light fa-square"></i>
                        <span>Owned</span>
                      </div>
                      <div class="form-check">
                        <i class="fa-sharp fa-light fa-square"></i>
                        <span>Rented</span>
                      </div>
                    </div>
                    <div class="address-section"></div>
                    <div class="state-postcode">
                      <div class="state-side"><b>State:</b></div>
                      <div class="postcode-side empty-boxes">
                        <span v-for="i in Array.from({ length: 5 }, (_, i) => i)"></span>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="12">
                    <div class="form-checks-container compact no-margin">
                      <div>
                        <b>Shareholding Status</b>
                        <small>
                          (Please tick
                          <i class="fa-regular fa-square-check"></i>
                          ONE only)
                        </small>
                        :
                      </div>
                      <div class="form-check">
                        <i class="fa-sharp fa-light fa-square"></i>
                        <span>Bumi Controlled</span>
                      </div>
                      <div class="form-check">
                        <i class="fa-sharp fa-light fa-square"></i>
                        <span>Non-Bumi Controlled</span>
                      </div>
                      <div class="form-check">
                        <i class="fa-sharp fa-light fa-square"></i>
                        <span>Others, please specify:</span>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="4"><b>Telephone No.:</b></td>
                  <td colspan="4"><b>Fax No.:</b></td>
                  <td colspan="4"><b>No. of Full Time Employees:</b></td>
                </tr>
                <tr>
                  <td colspan="12"><b>Email/Website:</b></td>
                </tr>
                <tr>
                  <td colspan="12"><b>Sales & Service Tax (SST) Registration Number:</b></td>
                </tr>
                <tr>
                  <td colspan="6"><b>Tax Identification Number (TIN):</b></td>
                  <td colspan="6"><b>Nature of Business (NOB):</b></td>
                </tr>
                <tr>
                  <td colspan="12"><b>Purpose for Opening Account/Applying for Facility:</b></td>
                </tr>
                <tr>
                  <td colspan="12">
                    <b>I/We hereby declare the funds for this account were obtained from the following source</b>
                    <small>(For Deposit Product Application ONLY)</small>
                    :
                    <div class="form-checks-container compact">
                      <div class="form-check">
                        <i class="fa-sharp fa-light fa-square"></i>
                        <span>Business Proceeds</span>
                      </div>
                      <div class="form-check">
                        <i class="fa-sharp fa-light fa-square"></i>
                        <span>Rental Collection</span>
                      </div>
                      <div class="form-check">
                        <i class="fa-sharp fa-light fa-square"></i>
                        <span>Others, (Please specify):</span>
                        <span class="empty-input-field wide"></span>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="6">
                    <b>Related Companies</b>
                    <small>(if any)</small>
                    :
                  </td>
                  <td colspan="6"><b>Annual Sales/Business Turnover: RM</b></td>
                </tr>
                <tr>
                  <td
                    colspan="12"
                    class="subheading"
                  >
                    AUTHORISED CONTACT PERSON
                  </td>
                </tr>
                <tr>
                  <td colspan="9"><b>Name:</b></td>
                  <td colspan="3">
                    <div class="form-check">
                      <i class="fa-sharp fa-light fa-square"></i>
                      <b>An Authorised Signatory</b>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="9"><b>Designation:</b></td>
                  <td colspan="3"><b>I.C. No.:</b></td>
                </tr>
                <tr>
                  <td colspan="6"><b>Email Address:</b></td>
                  <td colspan="3"><b>Mobile No.:</b></td>
                  <td colspan="3"><b>Office No.:</b></td>
                </tr>
                <tr>
                  <td
                    colspan="12"
                    class="subheading"
                  >
                    FOR BANK USE ONLY
                  </td>
                </tr>
                <tr>
                  <td colspan="12"><b>Industry Code:</b></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="paper-footer">
            <b>
              For Alliance Bank’s Use Only and
              <span class="text-danger">Strictly</span>
              Private & Confidential
            </b>
            <br />
            (Universal Business Banking Form - Version 4.5)
          </div>
          <div class="page-number">1</div>
        </template>
      </Paper>

      <Paper
        :paper-orientation="controller.paperOrientation"
        :additional-css-class="controller.additionalCssClass"
        :show-page-number="false"
      >
        <template #paperContent>
          <div class="application-detail-section">
            <table class="alliance-application-table">
              <tbody>
                <tr>
                  <td
                    colspan="12"
                    class="heading font-weight-bold"
                  >
                    COMMON REPORTING STANDARD (CRS):
                    <small>
                      Country/Jurisdiction of Residence for Tax Purposes & related Taxpayer Identification Number
                    </small>
                  </td>
                </tr>
                <tr>
                  <td
                    class="subheading"
                    colspan="12"
                  >
                    Part 1 - Country/Jurisdiction of Residence declaration
                  </td>
                </tr>
                <tr>
                  <td colspan="12">
                    <b>We represent and declare that we are:</b>
                    <div class="form-checks">
                      <div class="form-check">
                        <i class="fa-sharp fa-light fa-square"></i>
                        <span>Malaysia tax resident (Not required to complete Part 2 and Part 3)</span>
                      </div>
                      <div class="form-check">
                        <i class="fa-sharp fa-light fa-square"></i>
                        <span>
                          Non-Malaysia tax resident (Please proceed to complete Part 2 and Part 3 (if applicable))
                        </span>
                      </div>
                      <div class="form-check">
                        <i class="fa-sharp fa-light fa-square"></i>
                        <span>
                          Malaysia and Non-Malaysia tax resident (Please proceed to complete Part 2 and Part 3 (if
                          applicable))
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td
                    class="subheading"
                    colspan="12"
                  >
                    Part 2 - Non-Malaysian Taxpayer Identification Number declaration
                  </td>
                </tr>
                <tr>
                  <td colspan="12">
                    <b>
                      Please declare the countries and the respective Taxpayer Identification Number(s) that you are a
                      Non-Malaysian tax resident of:
                    </b>
                    <table class="inner-grid-table">
                      <thead>
                        <tr>
                          <th>
                            Country/Jurisdiction of
                            <br />
                            tax residence
                          </th>
                          <th>
                            Taxpayer Identification
                            <br />
                            Number (TIN)
                          </th>
                          <th>
                            TIN not available due to
                            <br />
                            (please select one, refer definition below)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="row in [1, 2, 3]"
                          :key="row"
                        >
                          <td class="empty-cell-line"></td>
                          <td class="empty-cell-line"></td>
                          <td>
                            <div class="form-checks-container compact no-margin">
                              <div class="form-check">
                                <i class="fa-sharp fa-light fa-square"></i>
                                <span>Reason 1</span>
                              </div>
                              <div class="form-check">
                                <i class="fa-sharp fa-light fa-square"></i>
                                <span>Reason 2</span>
                              </div>
                              <div class="form-check">
                                <i class="fa-sharp fa-light fa-square"></i>
                                <span>Reason 3:</span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <p>TIN not available due to the following reasons:</p>
                    <p>Reason 1: The country/jurisdiction of tax residence does not issue TINs to its residents</p>
                    <p>
                      Reason 2: No TIN is required. (Note: Only select this reason if the domestic law of the relevant
                      jurisdiction does not require the collection of TIN issued by such jurisdiction)
                    </p>
                    <p>Reason 3: No TIN because of other reasons. Please specify reason.</p>
                  </td>
                </tr>
                <tr>
                  <td
                    class="subheading"
                    colspan="12"
                  >
                    Part 3 - Entity Type
                  </td>
                </tr>
                <tr>
                  <td colspan="12">
                    <ol>
                      <li>
                        If you are a Financial Institution, please select either one of the following type of Financial
                        Institution:
                        <table class="inner-grid-table">
                          <tbody>
                            <tr>
                              <td>
                                <div class="form-check">
                                  <span>a)</span>
                                  <i class="fa-sharp fa-light fa-square"></i>
                                  <span>
                                    Depository Institutions, Custodial Institutions or Specified Insurance Company
                                  </span>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div class="form-check">
                                  <span>b)</span>
                                  <i class="fa-sharp fa-light fa-square"></i>
                                  <span>Investment Entity (refer page 15 for definition)</span>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div class="form-check">
                                  <span>c)</span>
                                  <i class="fa-sharp fa-light fa-square"></i>
                                  <span>
                                    Investment Entity located in a non-participating jurisdiction (refer page 15 for
                                    definition)
                                  </span>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </li>
                      <li>
                        If you have selected Part 3(1)(c) above or you have selected in the FATCA section/supplementary
                        form (delete where applicable) that you are a Passive NFFE (i.e. an entity whose revenue is
                        mainly (at least 50%) derived from investment activities), please complete (a) and (b) below:
                        <ol class="lower-alpha">
                          <li>
                            Indicate the name of any Controlling Person(s):
                            <table class="inner-grid-table">
                              <tbody>
                                <tr>
                                  <td>1.</td>
                                  <td>2.</td>
                                  <td>3.</td>
                                </tr>
                              </tbody>
                            </table>
                          </li>
                          <li>
                            Complete the Individual tax Residency Self-Declaration Form for each of the Controlling
                            Person (please request for the form from the sales officer)
                          </li>
                        </ol>
                      </li>
                    </ol>
                  </td>
                </tr>
                <tr>
                  <td
                    class="subheading"
                    colspan="9"
                  >
                    Foreign Account Tax Compliance Act (FATCA)
                    <small>
                      (Please tick
                      <i class="fa-regular fa-square-check" />
                      ONE only)
                    </small>
                  </td>
                  <td
                    colspan="3"
                    class="sub-subheading"
                  >
                    For Bank Use Only
                    <br />
                    <span class="sub-title">FATCA status code</span>
                    <br />
                    <span class="sub-title">(Refer to page 15 for guidance)</span>
                  </td>
                </tr>
                <tr>
                  <td colspan="7">
                    <div class="form-check">
                      <i class="fa-sharp fa-light fa-square"></i>
                      <span>Non-US government entities</span>
                    </div>
                  </td>
                  <td colspan="2">-</td>
                  <td
                    colspan="3"
                    class="guideline"
                  >
                    C
                  </td>
                </tr>
                <tr>
                  <td colspan="7">
                    <div class="form-check">
                      <i class="fa-sharp fa-light fa-square"></i>
                      <span>Non-US central bank</span>
                    </div>
                  </td>
                  <td colspan="2">-</td>
                  <td
                    colspan="3"
                    class="guideline"
                  >
                    C
                  </td>
                </tr>
                <tr>
                  <td colspan="7">
                    <div class="form-check">
                      <i class="fa-sharp fa-light fa-square"></i>
                      <span>
                        Public listed entity (non-FI) that is regularly traded on Bursa Malaysia or another stock
                        exchange outside the US, including its subsidiaries.
                      </span>
                    </div>
                  </td>
                  <td colspan="2">-</td>
                  <td
                    colspan="3"
                    class="guideline"
                  >
                    D
                  </td>
                </tr>
                <tr>
                  <td colspan="7">
                    <div class="form-check">
                      <i class="fa-sharp fa-light fa-square"></i>
                      <div>
                        The entity's revenue is mainly (at least 50%) derived from its core business activity (other
                        than investment activities)
                        <br />
                        <u>Declaration:</u>
                        <div class="form-check">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>
                            An entity, out of US, engaged in an active business other than that of a financial
                            institution.
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td colspan="2">-</td>
                  <td
                    colspan="3"
                    class="guideline"
                  >
                    F
                  </td>
                </tr>
                <tr>
                  <td colspan="7">
                    <div class="form-check">
                      <i class="fa-sharp fa-light fa-square"></i>
                      <div>
                        Financial institutions (FI)
                        <sup>(1) FATCA definition – page 15</sup>
                        outside US
                        <br />
                        FATCA Classification (Refer to Form W8-BEN-E):
                        <span class="empty-input-field"></span>
                      </div>
                    </div>
                  </td>
                  <td colspan="2">If selected, Please fill up Form W- 8BEN-E</td>
                  <td
                    colspan="3"
                    class="guideline"
                  >
                    G - T
                  </td>
                </tr>
                <tr>
                  <td colspan="7">
                    <div class="form-check">
                      <i class="fa-sharp fa-light fa-square"></i>
                      <div>
                        The entity is incorporated/organised in US (Refer to Form W9)
                        <br />
                        Please select one of the categories:
                        <div class="form-check">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>Specified US person (Refer to Form W9)</span>
                        </div>
                        <div class="form-check">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>Non specified US person (Refer to Form W9)</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td colspan="2">If selected, Please fill up Form W-9</td>
                  <td
                    colspan="3"
                    class="guideline"
                  >
                    A
                    <br />
                    B
                    <br />
                    W (if W9 is
                    <u>NOT</u>
                    filled)
                  </td>
                </tr>
                <tr>
                  <td colspan="7">
                    <div class="form-check">
                      <i class="fa-sharp fa-light fa-square"></i>
                      <div>
                        The entity’s revenue is mainly (at least 50%) derived from investment activities
                        <br />
                        <u>Declaration:</u>
                        <div class="form-check">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>
                            An entity, out of US, engaged in business other than that of a financial institution.
                          </span>
                        </div>
                        <u>Please select one of the followings</u>
                        <br />
                        Does the entity have substantial United States Owners
                        <sup>(3) FATCA definition – page 15</sup>
                        ?
                        <div class="form-checks-container compact no-margin">
                          <div class="form-check">
                            <i class="fa-sharp fa-light fa-square"></i>
                            <span>Yes</span>
                          </div>
                          <div class="form-check">
                            <i class="fa-sharp fa-light fa-square"></i>
                            <span>No</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td colspan="2">If “Yes” is selected: Please fill up Form W- 8BEN-E (Part xxx)</td>
                  <td
                    colspan="3"
                    class="guideline"
                  >
                    U
                    <br />
                    V (if W-8BEN-E is NOT filled)
                    <br />
                    E
                  </td>
                </tr>
                <tr>
                  <td colspan="7">
                    <div class="form-check">
                      <i class="fa-sharp fa-light fa-square"></i>
                      <span>None of the above</span>
                    </div>
                  </td>
                  <td colspan="2">Please fill up Form W- 8BEN-E</td>
                  <td
                    colspan="3"
                    class="guideline"
                  >
                    1 - 13
                    <br />
                    G (if W-8BEN-E is NOT filled)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="paper-footer">
            <b>
              For Alliance Bank’s Use Only and
              <span class="text-danger">Strictly</span>
              Private & Confidential
            </b>
            <br />
            (Universal Business Banking Form - Version 4.5)
          </div>
          <div class="page-number">2</div>
        </template>
      </Paper>

      <Paper
        :paper-orientation="controller.paperOrientation"
        :additional-css-class="controller.additionalCssClass"
        :show-page-number="false"
      >
        <template #paperContent>
          <div class="application-detail-section">
            <table class="alliance-application-table">
              <thead>
                <tr>
                  <th colspan="12">
                    <div class="section-head">
                      <span>SECTION</span>
                      <span class="section-number">B</span>
                      <span>. DEPOSIT PRODUCTS</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colspan="12">
                    Please Tick
                    <i class="fa-regular fa-square-check" />
                    Where Applicable
                    <table class="inner-grid-table">
                      <tbody>
                        <tr>
                          <td
                            colspan="12"
                            class="subheading"
                          >
                            MALAYSIAN RINGGIT (MYR) ACCOUNTS
                          </td>
                        </tr>
                        <tr>
                          <td colspan="12">
                            <div class="form-check">
                              <i class="fa-sharp fa-light fa-square"></i>
                              <div>
                                <b>
                                  MYR Business Current Account / Current Account-i / Savings Account / Savings Account-i
                                </b>
                                <div class="form-checks-container compact">
                                  <div class="first-section">
                                    <div class="form-check">
                                      <i class="fa-sharp fa-light fa-square"></i>
                                      <span>Conventional Current Account</span>
                                    </div>
                                    <div class="form-check">
                                      <i class="fa-sharp fa-light fa-square"></i>
                                      <span>Islamic Current Account-i</span>
                                    </div>
                                  </div>
                                  <div class="second-section">
                                    <div class="form-check">
                                      <i class="fa-sharp fa-light fa-square"></i>
                                      <span>Conventional Basic Current Account</span>
                                    </div>
                                    <div class="form-check">
                                      <i class="fa-sharp fa-light fa-square"></i>
                                      <span>Islamic Basic Current Account-i</span>
                                    </div>
                                  </div>
                                  <div class="third-section">
                                    <div class="form-check">
                                      <i class="fa-sharp fa-light fa-square"></i>
                                      <span>Conventional Basic Savings Account</span>
                                    </div>
                                    <div class="form-check">
                                      <i class="fa-sharp fa-light fa-square"></i>
                                      <span>Islamic Basic Savings Account-i</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <table class="inner-grid-table">
                              <tbody>
                                <tr>
                                  <td class="sub-subheading text-regular">
                                    <div class="form-checks-container split-between no-margin">
                                      <span>(a) Request for Chequebook</span>
                                      <div class="form-checks-container compact no-margin">
                                        <div class="form-check">
                                          <i class="fa-sharp fa-light fa-square"></i>
                                          <span>Yes</span>
                                        </div>
                                        <div class="form-check">
                                          <i class="fa-sharp fa-light fa-square"></i>
                                          <span>No</span>
                                        </div>
                                        <i>*Applicable to Current Account/Current Account-i only</i>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td colspan="12">
                                    I/We request for
                                    <span class="empty-input-field"></span>
                                    chequebook(s) with 50 leaves each. Please debit my/our account with the cost of
                                    stamp duty and postage/courier charges (if any).
                                    <br />
                                    <br />
                                    <u>Instruction for Delivery/Collection of Chequebook (choose ONE only)</u>
                                    <div class="form-checks-container">
                                      <div class="form-check">
                                        <i class="fa-sharp fa-light fa-square"></i>
                                        <span>
                                          Send the chequebook(s) to my/our account registered address by registered
                                          post/courier service at my/our own risk and expense.
                                        </span>
                                      </div>
                                      <div class="form-check indent-sm">
                                        <i class="fa-sharp fa-light fa-square"></i>
                                        <div>
                                          Collected by me/us/representative below at my/our own risk:
                                          <table class="inner-grid-table">
                                            <tr>
                                              <td class="sub-subheading text-regular">Full Name</td>
                                              <td></td>
                                            </tr>
                                            <tr>
                                              <td class="sub-subheading text-regular">IC/Passport No. & Country</td>
                                              <td></td>
                                            </tr>
                                          </table>
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td colspan="12">
                    <p class="font-weight-bold no-margin">(b) Application for Biz-Xpress card (Business Debit Card)</p>
                    <p class="small text-muted no-margin">
                      Please fill in the details below for the Biz-Xpress Card that is automatically issued with your
                      Business Current Account / Current Account-i. For additional cardholder(s), please fill up the
                      Biz-Xpress Card Service Request Form.
                    </p>

                    <table class="inner-grid-table compact margin-top-sm">
                      <thead>
                        <tr>
                          <th
                            colspan="4"
                            class="text-left font-weight-bold"
                          >
                            Cardholder Details
                          </th>
                          <th>Card No. (For Bank Use)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td colspan="4">
                            <div class="margin-bottom-xs">
                              <b>Cardholder Full Name:</b>
                              <span class="bottom-dash line-fill"></span>
                            </div>
                            <div class="grid-two-columns">
                              <div>
                                <b>I.C./Passport No.:</b>
                                <span class="bottom-dash line-fill"></span>
                              </div>
                              <div>
                                <b>Mobile No. (for OTP):</b>
                                <span class="bottom-dash line-fill"></span>
                                <br />
                                <small class="text-muted">*Include country code, e.g., +601xxxxxxxx</small>
                              </div>
                            </div>
                            <div class="margin-top-xs">
                              <b>Email Address:</b>
                              <span class="bottom-dash line-fill"></span>
                            </div>
                          </td>
                          <td class="bg-light-grey"></td>
                        </tr>
                        <tr>
                          <td colspan="3">
                            <b>Account Linkage</b>
                            <small>(Please tick ONE only)</small>
                            :
                            <br />
                            <div class="form-check">
                              <i class="fa-sharp fa-light fa-square"></i>
                              <span>
                                Full Access High Limit (ATM Deposit & Withdrawal/Retail & Online Purchases)
                                <br />
                                <small class="text-muted">
                                  *ATM Withdrawal/Retail & Online Purchases Limit: RM8,000 Daily; RM30,000 Monthly
                                </small>
                              </span>
                            </div>
                            <div class="form-check">
                              <i class="fa-sharp fa-light fa-square"></i>
                              <span>Deposit only</span>
                            </div>
                          </td>
                          <td colspan="2">
                            <b>Other Services:</b>
                            <br />
                            <div class="form-check">
                              <i class="fa-sharp fa-light fa-square"></i>
                              <span>Allow Contactless / Card-Not-Present Purchase</span>
                            </div>
                            <div class="form-check">
                              <i class="fa-sharp fa-light fa-square"></i>
                              <span>Overseas & Online Purchase</span>
                            </div>
                            <div class="form-check">
                              <i class="fa-sharp fa-light fa-square"></i>
                              <span>Overseas Cash Withdrawal</span>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <div class="split-flex-container margin-top-xs">
                      <div
                        class="flex-left-table"
                        style="width: 55%"
                      >
                        <div class="form-check no-margin">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>All accounts</span>
                        </div>
                        <div class="form-check no-margin">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>Account number(s) as specified below:</span>
                        </div>
                        <table class="inner-grid-table mini no-margin margin-top-xs">
                          <thead>
                            <tr>
                              <th>No.</th>
                              <th>Account Number</th>
                              <th>Primary</th>
                              <th>No.</th>
                              <th>Account Number</th>
                              <th>Primary</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>1</td>
                              <td></td>
                              <td><i class="fa-sharp fa-light fa-square"></i></td>
                              <td>4</td>
                              <td></td>
                              <td><i class="fa-sharp fa-light fa-square"></i></td>
                            </tr>
                            <tr>
                              <td>2</td>
                              <td></td>
                              <td><i class="fa-sharp fa-light fa-square"></i></td>
                              <td>5</td>
                              <td></td>
                              <td><i class="fa-sharp fa-light fa-square"></i></td>
                            </tr>
                            <tr>
                              <td>3</td>
                              <td></td>
                              <td><i class="fa-sharp fa-light fa-square"></i></td>
                              <td>6</td>
                              <td></td>
                              <td><i class="fa-sharp fa-light fa-square"></i></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div
                        class="flex-right-notes small text-muted font-italic padding-left-sm"
                        style="width: 45%"
                      >
                        <p>
                          Applicable to all business current accounts and savings accounts under the same business
                          entity & customer information records (CIF) with the Bank. Each card can link up to six (6)
                          accounts only.
                        </p>
                        <p>
                          <b>Note:</b>
                          For enhanced security measures, customers are required to send in official requests and signed
                          by the Authorised Signatories for any subsequent changes.
                        </p>
                      </div>
                    </div>
                    <div class="form-check margin-top-sm font-weight-bold">
                      <i class="fa-sharp fa-light fa-square"></i>
                      <span>I/We DO NOT want to apply for a Biz-Xpress Debit Card</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="12">
                    <div class="form-check font-weight-bold no-margin">
                      <i class="fa-sharp fa-light fa-square"></i>
                      <span>MYR FIXED DEPOSIT / TERM DEPOSIT-i</span>
                    </div>
                    <div class="indent-md margin-top-xs">
                      <div class="form-check inline-layout">
                        <i class="fa-sharp fa-light fa-square"></i>
                        <span>Conventional Fixed Deposit</span>
                      </div>
                      <div class="form-check inline-layout margin-left-xl">
                        <i class="fa-sharp fa-light fa-square"></i>
                        <span>Islamic Term Deposit-i</span>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="paper-footer">
            <b>
              For Alliance Bank’s Use Only and
              <span class="text-danger">Strictly</span>
              Private & Confidential
            </b>
            <br />
            (Universal Business Banking Form - Version 4.5)
          </div>
          <div class="page-number">3</div>
        </template>
      </Paper>

      <Paper
        :paper-orientation="controller.paperOrientation"
        :additional-css-class="controller.additionalCssClass"
        :show-page-number="false"
      >
        <template #paperContent>
          <div class="application-detail-section">
            <table class="alliance-application-table">
              <tbody>
                <tr>
                  <td
                    colspan="12"
                    class="subheading bg-primary text-white"
                  >
                    FOREIGN CURRENCY ACCOUNTS
                  </td>
                </tr>
                <tr>
                  <td colspan="12">
                    <div class="form-check font-weight-bold">
                      <i class="fa-sharp fa-light fa-square"></i>
                      <span>Foreign Currency Current Account (FCCA)</span>
                    </div>

                    <div class="indent-md margin-top-xs box-border-outline">
                      <div class="form-check font-weight-bold">
                        <i class="fa-sharp fa-light fa-square"></i>
                        <span>Trade FCCA</span>
                      </div>
                      <div class="indent-md flex-row-checkboxes">
                        <div class="form-check">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>USD</span>
                        </div>
                        <div class="form-check">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>EUR</span>
                        </div>
                        <div class="form-check">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>SGD</span>
                        </div>
                        <div class="form-check">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>GBP</span>
                        </div>
                        <div class="form-check">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>AUD</span>
                        </div>
                        <div class="form-check">
                          <span>
                            Others, please specify:
                            <span class="bottom-dash short"></span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div class="indent-md margin-top-sm box-border-outline">
                      <div class="form-check font-weight-bold">
                        <i class="fa-sharp fa-light fa-square"></i>
                        <span>Investment FCCA</span>
                      </div>
                      <div class="indent-md flex-row-checkboxes">
                        <div class="form-check">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>USD</span>
                        </div>
                        <div class="form-check">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>EUR</span>
                        </div>
                        <div class="form-check">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>SGD</span>
                        </div>
                        <div class="form-check">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>GBP</span>
                        </div>
                        <div class="form-check">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>AUD</span>
                        </div>
                        <div class="form-check">
                          <span>
                            Others, please specify:
                            <span class="bottom-dash short"></span>
                          </span>
                        </div>
                      </div>

                      <div class="declaration-subbox margin-top-xs border-top-dash padding-top-xs">
                        <p class="small font-weight-bold no-margin">
                          Declaration for Investment FCCA (applicable to Resident only):
                        </p>
                        <div class="form-check text-justify small">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>
                            I/We DO NOT have any Domestic Ringgit Borrowing/Financing (DRB Definition on Page 16) with
                            any financial institutions in Malaysia and in the event I/We have any Domestic Ringgit
                            Borrowing/Financing, I/We undertake to inform the bank immediately;
                            <b>or</b>
                          </span>
                        </div>
                        <div class="form-check text-justify small margin-top-2xs">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>
                            I/We have Domestic Ringgit Borrowing/Financing with any financial institutions in Malaysia
                            and my/our total investment in foreign currency assets including this application do not
                            exceed RM1 million (for resident individual, sole proprietor or general partnership) or RM50
                            million (for resident entity within its group of entities with parent - subsidiary
                            relationship) equivalent in aggregate this calendar year;
                            <b>or</b>
                          </span>
                        </div>
                        <div class="form-check text-justify small margin-top-2xs">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>
                            I/We have Domestic Ringgit Borrowing/Financing with any financial institutions in Malaysia
                            and my/our total investment in foreign currency assets including this application has
                            exceeded RM1 million (for resident individual, sole proprietor or general partnership) or
                            RM50 million (for resident entity within its group of entities with parent subsidiary
                            relationship) equivalent in aggregate this calendar year with BNM approval obtained;
                          </span>
                        </div>
                      </div>
                    </div>

                    <div class="form-check font-weight-bold margin-top-sm">
                      <i class="fa-sharp fa-light fa-square"></i>
                      <span>Foreign Currency Fixed Deposit (FCFD)</span>
                    </div>
                    <div class="indent-md flex-row-checkboxes">
                      <div class="form-check">
                        <i class="fa-sharp fa-light fa-square"></i>
                        <span>USD</span>
                      </div>
                      <div class="form-check">
                        <i class="fa-sharp fa-light fa-square"></i>
                        <span>EUR</span>
                      </div>
                      <div class="form-check">
                        <i class="fa-sharp fa-light fa-square"></i>
                        <span>SGD</span>
                      </div>
                      <div class="form-check">
                        <i class="fa-sharp fa-light fa-square"></i>
                        <span>GBP</span>
                      </div>
                      <div class="form-check">
                        <i class="fa-sharp fa-light fa-square"></i>
                        <span>AUD</span>
                      </div>
                      <div class="form-check">
                        <span>
                          Others, specify:
                          <span class="bottom-dash short"></span>
                        </span>
                      </div>
                    </div>
                    <div class="text-muted small margin-top-2xs indent-md">
                      <i>
                        USD - US Dollar; EUR - Euro; SGD - Singapore Dollar; GBP - British Pound; AUD - Australian
                        Dollar.
                        <b class="text-dark">Protected by PIDM up to RM250,000 for each depositor.</b>
                      </i>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td
                    colspan="12"
                    class="subheading text-uppercase"
                  >
                    NOMINATION OF AUTHORISED PERSONNEL
                  </td>
                </tr>
                <tr>
                  <td colspan="12">
                    <p class="small no-margin">
                      I/We hereby nominate the person(s) detailed below as the person(s) authorised to perform
                      activities and/or transactions indicated below on my/our behalf:
                    </p>
                    <table class="inner-grid-table compact layout-fixed margin-top-xs">
                      <thead>
                        <tr>
                          <th style="width: 35%">Name & IC No./Passport No. & Country / Contact No.</th>
                          <th style="width: 25%">Specimen Signature</th>
                          <th style="width: 40%">
                            Authorised Scope / Activities
                            <small>(Please Tick Where Applicable)</small>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="n in [1, 2, 3]"
                          :key="n"
                        >
                          <td class="empty-cell-line vertical-align-top">
                            <div class="num-prefix-container">{{ n }}.</div>
                          </td>
                          <td class="empty-cell-line"></td>
                          <td>
                            <div class="form-check mini">
                              <i class="fa-sharp fa-light fa-square"></i>
                              <span>Cheque Encashment</span>
                            </div>
                            <div class="form-check mini">
                              <i class="fa-sharp fa-light fa-square"></i>
                              <span>Account Information</span>
                            </div>
                            <div class="form-check mini">
                              <i class="fa-sharp fa-light fa-square"></i>
                              <span>Cheque Confirmation</span>
                            </div>
                            <div class="form-check mini">
                              <i class="fa-sharp fa-light fa-square"></i>
                              <span>Document Submission/Collection/Chequebook Collection</span>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <div class="scope-definitions text-muted x-small margin-top-xs">
                      <p class="no-margin">
                        <b>Cheque Encashment:</b>
                        Person(s) authorised to encash my/our cheque(s) over the counter at my/our branches, on my/our
                        behalf. I/We also declare that the person(s) mentioned are known to me/us and they are my/our
                        employee/Director(s)/Partner(s)/Office Bearer(s).
                      </p>
                      <p class="no-margin margin-top-3xs">
                        <b>Account Information:</b>
                        Person(s) authorised to request for and obtain my/our account and transaction information,
                        either over the counter or over the phone, on my/our behalf.
                      </p>
                      <p class="no-margin margin-top-3xs">
                        <b>Cheque Confirmation:</b>
                        Person(s) authorised to confirm details of cheque(s) issued and collected, either over the
                        counter or over the phone, on my/our behalf.
                      </p>
                      <p class="no-margin margin-top-3xs">
                        <b>Document Submission/Collection:</b>
                        Person(s) authorised to send-in/submit and/or collect and/or acknowledge receipt of documents
                        relating to operation of this account (including but not limited to returned cheques, remittance
                        application/instrument, etc.), on my/our behalf.
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="paper-footer">
            <b>
              For Alliance Bank’s Use Only and
              <span class="text-danger">Strictly</span>
              Private & Confidential
            </b>
            <br />
            (Universal Business Banking Form - Version 4.5)
          </div>
          <div class="page-number">4</div>
        </template>
      </Paper>

      <Paper
        :paper-orientation="controller.paperOrientation"
        :additional-css-class="controller.additionalCssClass"
        :show-page-number="false"
      >
        <template #paperContent>
          <div class="application-detail-section">
            <table class="alliance-application-table">
              <thead>
                <tr>
                  <th colspan="12">
                    <div class="section-head">
                      <span>SECTION</span>
                      <span class="section-number">C</span>
                      <span>. KEY PERSONNEL & ACCOUNT OPERATION MANDATE</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colspan="6">
                    <table class="inner-grid-table mini no-margin line-grid-sm">
                      <thead>
                        <tr>
                          <th>ACCOUNT NUMBER</th>
                          <th>ACCOUNT TYPE</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="idx in [1, 2, 3, 4, 5]"
                          :key="idx"
                        >
                          <td>{{ idx }}.</td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                  <td
                    colspan="6"
                    class="vertical-align-top"
                  >
                    <p class="font-weight-bold no-margin small">
                      OPERATION OF ACCOUNT
                      <small>(Please tick ONE only):</small>
                    </p>
                    <div class="form-checks-vertical indent-sm font-weight-bold small margin-top-3xs">
                      <div class="form-check">
                        <i class="fa-sharp fa-light fa-square"></i>
                        <span>Any one (1) to sign</span>
                      </div>
                      <div class="form-check">
                        <i class="fa-sharp fa-light fa-square"></i>
                        <span>All to sign</span>
                      </div>
                      <div class="form-check flex-align-center">
                        <i class="fa-sharp fa-light fa-square"></i>
                        <span>
                          Any
                          <span class="bottom-dash short text-center"></span>
                          to sign
                        </span>
                      </div>
                      <div class="form-check">
                        <i class="fa-sharp fa-light fa-square"></i>
                        <span>
                          Others (please specify):
                          <span class="bottom-dash line-fill"></span>
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr
                  v-for="person in [1, 2, 3, 4, 5]"
                  :key="person"
                >
                  <td
                    colspan="12"
                    class="padding-xs border-heavy-profile"
                  >
                    <div class="signatory-profile-grid">
                      <div class="field-row-full">
                        <b>Name ({{ person }}):</b>
                        <span class="bottom-dash line-fill"></span>
                      </div>
                      <div class="profile-layout-split margin-top-3xs">
                        <div class="split-left-checkboxes font-weight-bold xs-small">
                          <span>Position:</span>
                          <div class="form-check inline-layout margin-left-xs">
                            <i class="fa-sharp fa-light fa-square"></i>
                            <span>Authorised Signatory</span>
                          </div>
                          <div class="form-check inline-layout margin-left-xs">
                            <i class="fa-sharp fa-light fa-square"></i>
                            <span>Director</span>
                          </div>
                          <div class="form-check inline-layout margin-left-xs">
                            <i class="fa-sharp fa-light fa-square"></i>
                            <span>Management Team</span>
                          </div>
                          <div class="form-check inline-layout margin-left-xs">
                            <i class="fa-sharp fa-light fa-square"></i>
                            <span>Shareholder</span>
                          </div>

                          <div class="metadata-line-fields margin-top-3xs font-weight-normal">
                            <div class="grid-triple-equal">
                              <div>
                                <b>Marital Status:</b>
                                <span class="bottom-dash max-fill"></span>
                              </div>
                              <div>
                                <b>Religion:</b>
                                <span class="bottom-dash max-fill"></span>
                              </div>
                              <div>
                                <b>Race:</b>
                                <span class="bottom-dash max-fill"></span>
                              </div>
                            </div>
                            <div class="grid-triple-equal margin-top-3xs">
                              <div>
                                <b>Date of Birth:</b>
                                <span class="bottom-dash max-fill text-muted text-center">DD / MM / YYYY</span>
                              </div>
                              <div>
                                <b>IC/Passport & Country:</b>
                                <span class="bottom-dash max-fill"></span>
                              </div>
                              <div>
                                <b>Industry Exp (Years):</b>
                                <span class="bottom-dash max-fill"></span>
                              </div>
                            </div>
                            <div class="grid-double-equal margin-top-3xs">
                              <div>
                                <b>Mobile No.:</b>
                                <span class="bottom-dash max-fill"></span>
                              </div>
                              <div>
                                <b>Email Address:</b>
                                <span class="bottom-dash max-fill"></span>
                              </div>
                            </div>
                            <div class="margin-top-3xs">
                              <b>Mailing/Residential Address:</b>
                              <span class="bottom-dash line-fill"></span>
                            </div>
                            <div class="grid-quad-fields margin-top-3xs">
                              <div>
                                <b>Preferred Language:</b>
                                <span class="bottom-dash max-fill"></span>
                              </div>
                              <div>
                                <b>Shareholdings (RM'000 / %):</b>
                                <span class="bottom-dash max-fill"></span>
                              </div>
                              <div>
                                <b>Gross Annual Income (RM'000):</b>
                                <span class="bottom-dash max-fill"></span>
                              </div>
                              <div>
                                <b>Limit:</b>
                                <span class="bottom-dash max-fill"></span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="split-right-signature-box">
                          <span class="center-label text-muted">Specimen Signature</span>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="paper-footer">
            <b>
              For Alliance Bank’s Use Only and
              <span class="text-danger">Strictly</span>
              Private & Confidential
            </b>
            <br />
            (Universal Business Banking Form - Version 4.5)
          </div>
          <div class="page-number">5</div>
        </template>
      </Paper>

      <Paper
        :paper-orientation="controller.paperOrientation"
        :additional-css-class="controller.additionalCssClass"
        :show-page-number="false"
      >
        <template #paperContent>
          <div class="application-detail-section">
            <table class="alliance-application-table">
              <thead>
                <tr>
                  <th colspan="12">
                    <div class="section-head">
                      <span>SECTION</span>
                      <span class="section-number">D</span>
                      <span>. REGISTRATION FOR ALLIANCE BizSmart® ONLINE BANKING</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colspan="12">
                    <p class="font-weight-bold text-uppercase no-margin">
                      ALLIANCE BizSmart MODULE
                      <small>(Please tick ONE OPTION only)</small>
                    </p>
                    <p class="small text-justify text-muted no-margin">
                      As part of the Bank's commitment towards sustainable business practices, the Bank has transitioned
                      from physical statement to electronic statement. Enjoy the convenience of accessing and
                      downloading your statements anytime, anywhere by signing up for Alliance BizSmart®.
                    </p>

                    <div class="split-flex-container margin-top-xs">
                      <div
                        class="left-box-module border-box-sm padding-xs"
                        style="width: 55%"
                      >
                        <div class="form-check font-weight-bold no-margin">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>
                            OPTION 1: Alliance BizSmart® Transactional Module (Transactional & Inquiry Services)
                          </span>
                        </div>
                        <div class="indent-md font-weight-bold small">
                          <div class="form-check">
                            <i class="fa-sharp fa-light fa-square"></i>
                            <span>BizSmart SME Solution Package (SME and Sole Proprietor ONLY)</span>
                          </div>
                          <div class="form-check">
                            <i class="fa-sharp fa-light fa-square"></i>
                            <span>Standard Package**</span>
                          </div>
                          <div class="form-check">
                            <span>
                              Others, Billing Profile Code (Internal Use ONLY):
                              <span class="bottom-dash short"></span>
                            </span>
                          </div>
                        </div>
                        <div
                          class="form-check font-weight-bold no-margin border-top-dash padding-top-3xs margin-top-xs"
                        >
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>OPTION 2: Alliance BizSmart® Inquiry Module (Inquiry Services ONLY)</span>
                        </div>
                      </div>
                      <div
                        class="right-box-notes small text-muted font-italic padding-left-sm"
                        style="width: 45%"
                      >
                        <p class="no-margin">
                          <b>Note:</b>
                          "BizSmart SME Solution Package" is defaulted and only applicable to SME and Sole Proprietor
                          where "BizSmart SME Solution Package" customers are bound by the T&Cs which can be found on
                          Alliance Bank Website.
                        </p>
                        <p class="margin-top-3xs no-margin">
                          **Standard Fees and Charges shall apply. More information is available on Alliance Bank
                          Website.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="12">
                    <p class="font-weight-bold small no-margin">
                      AUTHORISED CONTACT PERSON
                      <small class="text-muted font-weight-normal">
                        (Please indicate if details differ from Section A - Authorised Contact Person)
                      </small>
                    </p>
                    <div class="grid-quad-fields margin-top-3xs">
                      <div>
                        <b>Name:</b>
                        <span class="bottom-dash max-fill"></span>
                      </div>
                      <div>
                        <b>I.C. No.:</b>
                        <span class="bottom-dash max-fill"></span>
                      </div>
                      <div>
                        <b>Mobile No.:</b>
                        <span class="bottom-dash max-fill"></span>
                      </div>
                      <div>
                        <b>Email:</b>
                        <span class="bottom-dash max-fill"></span>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="12">
                    <div class="form-check font-weight-bold no-margin">
                      <i class="fa-sharp fa-light fa-square"></i>
                      <span>SOLE PROPRIETOR - BANK TO MANAGE ONLY</span>
                    </div>
                    <p class="x-small text-muted indent-md no-margin">
                      User will be defaulted to the Authorised Contact Person in Section A unless a different name has
                      been indicating as Authorised Contact Person in this Section.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td colspan="12">
                    <p class="font-weight-bold small no-margin">
                      COMPANY / SOCIETY / PARTNERSHIP
                      <small class="text-muted font-weight-normal">
                        (Board resolution is required for both Transactional and Inquiry Module)
                      </small>
                    </p>
                    <p class="small font-weight-bold no-margin indent-2xs margin-top-3xs">
                      Mode of Profile Maintenance (As per indicated in board resolution) - Please tick ONE OPTION only
                    </p>

                    <div class="form-check indent-sm font-weight-bold margin-top-3xs">
                      <i class="fa-sharp fa-light fa-square"></i>
                      <span>OPTION 1 - SELF MANAGE</span>
                    </div>
                    <p class="x-small text-muted indent-md no-margin">
                      I/We would like to appoint the following persons to manage my/our user and company/business
                      profile in Alliance BizSmart® online banking.
                      <br />
                      • At least one (1) System Administrator and one (1) System Authoriser to be appointed where it is
                      not allowed to be the same person.
                    </p>

                    <p class="font-weight-bold small indent-md margin-top-xs no-margin">
                      System Administrator* - Corporate Back Office
                    </p>
                    <table
                      class="inner-grid-table compact layout-fixed indent-md"
                      style="width: 95%"
                    >
                      <thead>
                        <tr>
                          <th style="width: 5%">No</th>
                          <th style="width: 35%">Name (in block letters)</th>
                          <th style="width: 15%">I.C. No.</th>
                          <th style="width: 15%">Mobile No. (for TAC)</th>
                          <th style="width: 25%">Email Address (for ePIN)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1</td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td>2</td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>

                    <p class="font-weight-bold small indent-md margin-top-xs no-margin">
                      System Authoriser - Corporate Back Office
                    </p>
                    <table
                      class="inner-grid-table compact layout-fixed indent-md"
                      style="width: 95%"
                    >
                      <thead>
                        <tr>
                          <th style="width: 5%">No</th>
                          <th style="width: 35%">Name (in block letters)</th>
                          <th style="width: 15%">I.C. No.</th>
                          <th style="width: 15%">Mobile No. (for TAC)</th>
                          <th style="width: 25%">Email Address (for ePIN)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1</td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td>2</td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                    <p class="x-small text-muted indent-md margin-top-3xs">
                      *By default, all users will be assigned with Mobile Token. Please download Alliance BizSmart
                      Mobile application to activate Mobile Token.
                    </p>

                    <div class="form-check indent-sm font-weight-bold margin-top-sm">
                      <i class="fa-sharp fa-light fa-square"></i>
                      <span>OPTION 2 - BANK TO MANAGE</span>
                    </div>
                    <p class="x-small text-muted indent-md no-margin">
                      I/We would like to appoint Alliance Bank Malaysia Bhd (ABMB) to manage the company/business users
                      and profiles in Alliance BizSmart® online banking.
                      <br />
                      • Please submit additional
                      <b>MANDATORY</b>
                      form
                      <b>APPENDIX - Alliance BizSmart® Profile Setup Form</b>
                      available in Alliance BizSmart® Download Forms. Note that charges are applicable for appointing
                      ABMB to manage the company/business users and profiles.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td colspan="12">
                    <p class="font-weight-bold small no-margin">OPTIONAL: HARDWARE TOKEN REQUEST</p>
                    <p class="x-small text-muted no-margin">
                      Users with incompatible mobile devices may request hardware token. A fee of RM70/token is
                      applicable, and the charges will be debited from designated account number or first (1st) account
                      number. Please refer to FAQ at Alliance Bank website on Minimum Operating System Requirement for
                      BizSmart® Mobile.
                    </p>
                    <div class="grid-two-columns margin-top-xs font-weight-bold small">
                      <div>
                        QUANTITY REQUESTED (for Corporate Front Office):
                        <span class="bottom-dash short text-center"></span>
                      </div>
                      <div>
                        Delivery of Hardware Tokens (Choose ONE):
                        <br />
                        <div class="form-check inline-layout">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>Account Branch</span>
                        </div>
                        <div class="form-check inline-layout margin-left-md">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>Mailing Address*</span>
                        </div>
                      </div>
                    </div>
                    <p class="x-small text-muted indent-md no-margin">
                      * Will be defaulted to the Mailing Address if not selected. For P.O.Box address, the Hardware
                      Tokens will be sent to the Account Branch for collection.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td colspan="12">
                    <p class="font-weight-bold small text-uppercase no-margin">ACCOUNT MAINTENANCE</p>
                    <div class="grid-two-columns small margin-top-3xs">
                      <div>
                        <b>Designated Account No. (To debit internet banking charges):</b>
                        <span class="bottom-dash line-fill"></span>
                        <br />
                        <small class="text-muted">
                          *Account no. must be indicated above or charges will be debited by default from first (1st)
                          account no.
                        </small>
                      </div>
                      <div>
                        <b>Account Linkage</b>
                        <small class="text-muted">(Defaulted to ALL ACCOUNTS if left empty)</small>
                        :
                        <br />
                        <div class="form-check no-margin">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>All accounts</span>
                        </div>
                        <div class="form-check no-margin">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>Account(s) number(s) specified below:</span>
                        </div>
                        <div class="indent-md flex-row-fields small">
                          <span>
                            a)
                            <span class="bottom-dash short"></span>
                          </span>
                          <span class="margin-left-sm">
                            b)
                            <span class="bottom-dash short"></span>
                          </span>
                          <span class="margin-left-sm">
                            c)
                            <span class="bottom-dash short"></span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <p class="x-small text-muted no-margin margin-top-3xs">
                      * Applicable to all Conventional and Islamic account under the same business entity and customer
                      information records (CIF) with ABMB/AIS.
                    </p>
                    <div class="grid-triple-equal margin-top-sm font-weight-bold small">
                      <div>
                        <b>Company/Business Transaction Limit:</b>
                        <br />
                        <small class="text-muted font-weight-normal">
                          (Defaulted to max limit of RM50 million if not declared)
                        </small>
                      </div>
                      <div>
                        Single Payment: RM
                        <span class="bottom-dash short"></span>
                      </div>
                      <div>
                        Bulk Payment: RM
                        <span class="bottom-dash short"></span>
                      </div>
                    </div>
                    <div class="margin-top-xs small">
                      <b>Merchant ID</b>
                      <small class="text-muted">(applicable for Credit Card merchant only)</small>
                      :
                      <span class="bottom-dash short"></span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="paper-footer">
            <b>
              For Alliance Bank’s Use Only and
              <span class="text-danger">Strictly</span>
              Private & Confidential
            </b>
            <br />
            (Universal Business Banking Form - Version 4.5)
          </div>
          <div class="page-number">6</div>
        </template>
      </Paper>

      <Paper
        :paper-orientation="controller.paperOrientation"
        :additional-css-class="controller.additionalCssClass"
        :show-page-number="false"
      >
        <template #paperContent>
          <div class="application-detail-section">
            <table class="alliance-application-table">
              <thead>
                <tr>
                  <th colspan="12">
                    <div class="section-head">
                      <span>SECTION</span>
                      <span class="section-number">E</span>
                      <span>. APPLICATION FOR MERCHANT FACILITY</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colspan="12">
                    <p class="font-weight-bold small no-margin">
                      MERCHANT FACILITY TYPE
                      <small class="text-muted font-weight-normal">
                        (Please tick where appropriate. Note: Dual - Contact & Contactless)
                      </small>
                    </p>
                    <div class="grid-quad-fields font-weight-bold small margin-top-3xs">
                      <div class="form-check">
                        <i class="fa-sharp fa-light fa-square"></i>
                        <span>Terminal</span>
                      </div>
                      <div class="form-check">
                        <i class="fa-sharp fa-light fa-square"></i>
                        <span>E-Commerce</span>
                      </div>
                      <div class="form-check">
                        <i class="fa-sharp fa-light fa-square"></i>
                        <span>MOTO (Mail/Telephone Order)</span>
                      </div>
                      <div class="form-check">
                        <i class="fa-sharp fa-light fa-square"></i>
                        <span>Installment Payment Plan</span>
                      </div>
                    </div>
                    <p class="small font-weight-bold margin-top-xs no-margin">
                      Please indicate number of unit(s) on selected terminal type:
                    </p>
                    <div class="indent-md flex-row-fields small font-weight-bold">
                      <div class="form-check">
                        <i class="fa-sharp fa-light fa-square"></i>
                        <span>
                          Desktop:
                          <span class="bottom-dash short"></span>
                          unit(s)
                        </span>
                      </div>
                      <div class="form-check margin-left-lg">
                        <i class="fa-sharp fa-light fa-square"></i>
                        <span>
                          GPRS:
                          <span class="bottom-dash short"></span>
                          unit(s)
                        </span>
                      </div>
                      <div class="form-check margin-left-lg">
                        <span>
                          Others:
                          <span class="bottom-dash short"></span>
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="12">
                    <p class="font-weight-bold small no-margin">
                      MERCHANT INFORMATION
                      <small class="text-muted font-weight-normal">
                        (Please indicate if details differ from Registered Business Details)
                      </small>
                    </p>
                    <div class="margin-top-3xs small">
                      <div>
                        <b>Outlet Address 1:</b>
                        <span class="bottom-dash line-fill"></span>
                      </div>
                      <div class="margin-top-3xs">
                        <b>Outlet Address 2:</b>
                        <span class="bottom-dash line-fill"></span>
                      </div>
                      <div class="grid-double-equal margin-top-3xs">
                        <div>
                          <b>State:</b>
                          <span class="bottom-dash max-fill"></span>
                        </div>
                        <div>
                          <b>Postcode:</b>
                          <span class="bottom-dash max-fill"></span>
                        </div>
                      </div>
                    </div>
                    <div class="grid-double-equal margin-top-sm border-top-dash padding-top-xs small">
                      <div>
                        <b>Anticipated Average No. of Card Transaction per Month:</b>
                        <br />
                        <div class="form-check inline-layout">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>&lt; 500</span>
                        </div>
                        <div class="form-check inline-layout margin-left-md">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>500 - 1,000</span>
                        </div>
                        <div class="form-check inline-layout margin-left-md">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>&gt; 1,001</span>
                        </div>
                      </div>
                      <div>
                        <b>Mode of Payment</b>
                        <small>(Please tick ONE only)</small>
                        :
                        <br />
                        <div class="form-check">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>
                            Direct Credit ABMB - Branch:
                            <span class="bottom-dash short"></span>
                            Account No:
                            <span class="bottom-dash short"></span>
                          </span>
                        </div>
                        <div class="form-check">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>
                            GIRO Bank:
                            <span class="bottom-dash short"></span>
                            Account No:
                            <span class="bottom-dash short"></span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="margin-top-xs small">
                      <b>CS Phone (Customer Service Phone) [Optional]:</b>
                      <span class="bottom-dash short"></span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="12">
                    <p class="font-weight-bold small no-margin">
                      SETUP FEE
                      <small class="text-muted font-weight-normal">
                        (For E-Commerce Application ONLY. Please tick ONE only)
                      </small>
                    </p>
                    <p class="small no-margin indent-2xs">
                      For setup fee payment of
                      <b>RM900.00</b>
                      ,
                    </p>
                    <div class="form-check indent-sm small">
                      <i class="fa-sharp fa-light fa-square"></i>
                      <span>
                        I/We hereby authorise Alliance Bank Malaysia Berhad to debit our Company's Current Account: ABMB
                        Account No:
                        <span class="bottom-dash short"></span>
                      </span>
                    </div>
                    <div class="form-check indent-sm small margin-top-3xs">
                      <i class="fa-sharp fa-light fa-square"></i>
                      <span>I/We enclose herewith a cheque from:</span>
                      <div class="grid-quad-fields indent-md margin-top-3xs">
                        <div>
                          Issuing Bank:
                          <span class="bottom-dash max-fill"></span>
                        </div>
                        <div>
                          Cheque No:
                          <span class="bottom-dash max-fill"></span>
                        </div>
                        <div>
                          Branch:
                          <span class="bottom-dash max-fill"></span>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="12">
                    <p class="font-weight-bold small no-margin">
                      PA-DSS COMPLIANCE
                      <small class="text-muted font-weight-normal">(Please tick where appropriate)</small>
                    </p>
                    <p class="small indent-2xs no-margin">Do you also insert/swipe the card on your POS machine?</p>
                    <div class="form-check inline-layout margin-left-md small">
                      <i class="fa-sharp fa-light fa-square"></i>
                      <span>Yes</span>
                    </div>
                    <div class="form-check inline-layout margin-left-lg small">
                      <i class="fa-sharp fa-light fa-square"></i>
                      <span>No</span>
                    </div>

                    <p class="small indent-2xs margin-top-xs no-margin">If yes, I hereby confirm that:</p>
                    <div class="form-check indent-sm small">
                      <i class="fa-sharp fa-light fa-square"></i>
                      <span>
                        Our POS Terminal/Cash Register Machine does
                        <b>NOT</b>
                        retain any Prohibited Credit/Debit Card Magnetic Stripe data, CVV2 and PIN data.
                      </span>
                    </div>
                    <div class="form-check indent-sm small">
                      <i class="fa-sharp fa-light fa-square"></i>
                      <span>
                        Our POS Terminal/Cash Register Machine does retain any Prohibited Credit/Debit Card Magnetic
                        Stripe Data, CVV2 and PIN Data.
                      </span>
                    </div>
                    <div class="indent-md font-weight-bold xs-small flex-row-fields">
                      <div class="form-check">
                        <i class="fa-sharp fa-light fa-square"></i>
                        <span>Compliance with PADSS</span>
                      </div>
                      <div class="form-check margin-left-xl">
                        <i class="fa-sharp fa-light fa-square"></i>
                        <span>
                          Non-Compliance with PADSS (POS Terminal Model:
                          <span class="bottom-dash short"></span>
                          )
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td
                    colspan="12"
                    class="bg-light-grey small font-weight-bold"
                  >
                    FOR BANK USE ONLY &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Merchant Category Code:
                    <span class="bottom-dash short"></span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="paper-footer">
            <b>
              For Alliance Bank’s Use Only and
              <span class="text-danger">Strictly</span>
              Private & Confidential
            </b>
            <br />
            (Universal Business Banking Form - Version 4.5)
          </div>
          <div class="page-number">7</div>
        </template>
      </Paper>

      <Paper
        :paper-orientation="controller.paperOrientation"
        :additional-css-class="controller.additionalCssClass"
        :show-page-number="false"
      >
        <template #paperContent>
          <div class="application-detail-section">
            <table class="alliance-application-table">
              <thead>
                <tr>
                  <th colspan="12">
                    <div class="section-head">
                      <span>SECTION</span>
                      <span class="section-number">F</span>
                      <span>. LOAN / FINANCING FACILITY</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    colspan="12"
                    class="subheading bg-primary text-white font-weight-bold"
                  >
                    CONVENTIONAL
                  </td>
                </tr>
                <tr>
                  <td colspan="12">
                    <p class="font-weight-bold small no-margin">
                      Type of Facilities
                      <small class="text-muted font-weight-normal">(Please tick where appropriate)</small>
                    </p>
                    <div class="split-flex-container margin-top-xs">
                      <div
                        style="width: 50%"
                        class="border-box-sm padding-xs"
                      >
                        <p class="font-weight-bold small text-underline no-margin">Working Capital Financing</p>
                        <div class="form-check small">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>
                            Term Loan &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Amount: RM
                            <span class="bottom-dash short"></span>
                          </span>
                        </div>
                        <div class="form-check small">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>
                            Overdraft &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Amount: RM
                            <span class="bottom-dash short"></span>
                          </span>
                        </div>
                        <div class="form-check small">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>
                            Foreign Exchange Line Amount: RM
                            <span class="bottom-dash short"></span>
                          </span>
                        </div>
                        <div class="form-check small">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>
                            Trade Financing (specify):
                            <span class="bottom-dash short"></span>
                            Amount: RM
                            <span class="bottom-dash short"></span>
                          </span>
                        </div>
                      </div>
                      <div
                        style="width: 50%"
                        class="border-box-sm padding-xs margin-left-xs"
                      >
                        <p class="font-weight-bold small text-underline no-margin">Equipment Financing</p>
                        <div class="form-check small">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>
                            Industrial Hire Purchase Amount: RM
                            <span class="bottom-dash short"></span>
                          </span>
                        </div>
                        <div class="form-check small">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>
                            Term Loan &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Amount: RM
                            <span class="bottom-dash short"></span>
                          </span>
                        </div>
                        <div class="form-check small">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>
                            Foreign Exchange Line Amount: RM
                            <span class="bottom-dash short"></span>
                          </span>
                        </div>
                        <div class="form-check small">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>
                            Trade Financing (specify):
                            <span class="bottom-dash short"></span>
                            Amount: RM
                            <span class="bottom-dash short"></span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="split-flex-container margin-top-xs">
                      <div
                        style="width: 50%"
                        class="border-box-sm padding-xs"
                      >
                        <p class="font-weight-bold small text-underline no-margin">Business Premises Financing (BPF)</p>
                        <div class="form-check small">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>
                            Term Loan &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Amount: RM
                            <span class="bottom-dash short"></span>
                          </span>
                        </div>
                        <div class="form-check small">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>
                            Overdraft &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Amount: RM
                            <span class="bottom-dash short"></span>
                          </span>
                        </div>
                      </div>
                      <div
                        style="width: 50%"
                        class="border-box-sm padding-xs margin-left-xs"
                      >
                        <p class="font-weight-bold small text-underline no-margin">Other Financing</p>
                        <div class="form-check small">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>
                            Others (please specify):
                            <span class="bottom-dash short"></span>
                            Amount: RM
                            <span class="bottom-dash short"></span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td
                    colspan="12"
                    class="padding-xs"
                  >
                    <p class="font-weight-bold small no-margin">Business Credit Card</p>
                    <div class="grid-two-columns small">
                      <div>
                        <b>Preferred Company/Business Credit Limit:</b>
                        RM
                        <span class="bottom-dash short"></span>
                      </div>
                      <div>
                        <b>Company/Business Name to Appear on Card:</b>
                        <span class="bottom-dash line-fill"></span>
                      </div>
                    </div>
                    <table class="inner-grid-table compact mini margin-top-xs no-margin">
                      <thead>
                        <tr>
                          <th>Product Selection</th>
                          <th>
                            Card Feature Options
                            <small>(Please tick ONE only)</small>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <div class="form-check">
                              <i class="fa-sharp fa-light fa-square"></i>
                              <span>
                                <b>VISA</b>
                                Visa Infinite Business Credit Card
                              </span>
                            </div>
                            <div class="form-check margin-top-xs">
                              <i class="fa-sharp fa-light fa-square"></i>
                              <span>
                                <b>VISA</b>
                                Visa Platinum Business Credit Card
                              </span>
                            </div>
                          </td>
                          <td>
                            <div class="form-check">
                              <i class="fa-sharp fa-light fa-square"></i>
                              <span>
                                <b>Feature A:</b>
                                Up to 1.5% Retail Spending Cash Back. 26 Days Interest-Free Repayment Period.
                              </span>
                            </div>
                            <div class="form-check">
                              <i class="fa-sharp fa-light fa-square"></i>
                              <span>
                                <b>Feature B:</b>
                                Up to 2x Timeless Bonus Points. Finance charge of 8.88% p.a. subject to cardholders
                                prompt payment last 12 months. 26 Days Interest-Free Repayment Period.
                              </span>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div class="form-check">
                              <i class="fa-sharp fa-light fa-square"></i>
                              <span>
                                <b>Mastercard</b>
                                Business Platinum Card
                              </span>
                            </div>
                          </td>
                          <td>
                            <div class="form-check">
                              <i class="fa-sharp fa-light fa-square"></i>
                              <span>
                                <b>Feature A:</b>
                                Up to 0.25% Retail Spending Cash Back. 26 Days Interest-Free Repayment Period
                              </span>
                            </div>
                            <div class="form-check">
                              <i class="fa-sharp fa-light fa-square"></i>
                              <span>
                                <b>Feature B:</b>
                                13% Cash Rebate on Interest Paid. 20 Days Interest-Free Repayment Period
                              </span>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <p class="x-small text-muted font-italic mt-1">
                      * Please refer to our Product Disclosure Sheet uploaded in our corporate website for detailed card
                      features.
                    </p>
                    <div
                      class="form-checks-container compact border-box-sm padding-xs font-weight-bold xs-small no-margin"
                    >
                      <span>FINANCING SUPPLEMENTARY PRODUCT:</span>
                      <div class="form-check">
                        <i class="fa-sharp fa-light fa-square"></i>
                        <span>Keyman Insurance</span>
                      </div>
                      <div class="form-check">
                        <i class="fa-sharp fa-light fa-square"></i>
                        <span>BLRTA</span>
                      </div>
                      <div class="form-check">
                        <i class="fa-sharp fa-light fa-square"></i>
                        <span>BLLTA</span>
                      </div>
                      <div class="form-check">
                        <i class="fa-sharp fa-light fa-square"></i>
                        <span>FEC</span>
                      </div>
                      <div class="form-check">
                        <span>
                          Others:
                          <span class="bottom-dash short"></span>
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td
                    colspan="12"
                    class="subheading bg-primary text-white font-weight-bold"
                  >
                    ISLAMIC
                  </td>
                </tr>
                <tr>
                  <td colspan="12">
                    <p class="font-weight-bold small no-margin">
                      Type of Facilities
                      <small class="text-muted font-weight-normal">(Please tick where appropriate)</small>
                    </p>
                    <div class="split-flex-container margin-top-xs">
                      <div
                        style="width: 50%"
                        class="border-box-sm padding-xs"
                      >
                        <p class="font-weight-bold small text-underline no-margin">Working Capital Financing-i</p>
                        <div class="form-check small">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>
                            Term Financing-i &nbsp;&nbsp;&nbsp; Amount: RM
                            <span class="bottom-dash short"></span>
                          </span>
                        </div>
                        <div class="form-check small">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>
                            Cashline Facility-i &nbsp;&nbsp; Amount: RM
                            <span class="bottom-dash short"></span>
                          </span>
                        </div>
                        <div class="form-check small">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>
                            Islamic Trade Facilities:
                            <span class="bottom-dash short"></span>
                            Amount: RM
                            <span class="bottom-dash short"></span>
                          </span>
                        </div>
                      </div>
                      <div
                        style="width: 50%"
                        class="border-box-sm padding-xs margin-left-xs"
                      >
                        <p class="font-weight-bold small text-underline no-margin">Equipment Financing-i</p>
                        <div class="form-check small">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>
                            Industrial Hire Purchase-i Amount: RM
                            <span class="bottom-dash short"></span>
                          </span>
                        </div>
                        <div class="form-check small">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>
                            Term Financing-i &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Amount: RM
                            <span class="bottom-dash short"></span>
                          </span>
                        </div>
                        <div class="form-check small">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>
                            Islamic Trade Facilities:
                            <span class="bottom-dash short"></span>
                            Amount: RM
                            <span class="bottom-dash short"></span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="split-flex-container margin-top-xs">
                      <div
                        style="width: 50%"
                        class="border-box-sm padding-xs"
                      >
                        <p class="font-weight-bold small text-underline no-margin">
                          Business Premises Financing-i (BPF-i)
                        </p>
                        <div class="form-check small">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>
                            Term Financing-i &nbsp;&nbsp;&nbsp; Amount: RM
                            <span class="bottom-dash short"></span>
                          </span>
                        </div>
                        <div class="form-check small">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>
                            Cashline Facility-i &nbsp;&nbsp; Amount: RM
                            <span class="bottom-dash short"></span>
                          </span>
                        </div>
                      </div>
                      <div
                        style="width: 50%"
                        class="border-box-sm padding-xs margin-left-xs"
                      >
                        <p class="font-weight-bold small text-underline no-margin">Other Financings</p>
                        <div class="form-check small">
                          <i class="fa-sharp fa-light fa-square"></i>
                          <span>
                            Others (please specify):
                            <span class="bottom-dash short"></span>
                            Amount: RM
                            <span class="bottom-dash short"></span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div
                      class="form-checks-container compact border-box-sm padding-xs font-weight-bold xs-small margin-top-xs no-margin"
                    >
                      <span>
                        FINANCING SUPPLEMENTARY PRODUCT
                        <small class="font-weight-normal text-muted">(Select Takaful plan requiring coverage)</small>
                        :
                      </span>
                      <div class="form-check">
                        <i class="fa-sharp fa-light fa-square"></i>
                        <span>Keyman Takaful</span>
                      </div>
                      <div class="form-check">
                        <i class="fa-sharp fa-light fa-square"></i>
                        <span>BLRTT</span>
                      </div>
                      <div class="form-check">
                        <i class="fa-sharp fa-light fa-square"></i>
                        <span>BLLTT</span>
                      </div>
                      <div class="form-check">
                        <i class="fa-sharp fa-light fa-square"></i>
                        <span>FEC</span>
                      </div>
                      <div class="form-check">
                        <span>
                          Others:
                          <span class="bottom-dash short"></span>
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="paper-footer">
            <b>
              For Alliance Bank’s Use Only and
              <span class="text-danger">Strictly</span>
              Private & Confidential
            </b>
            <br />
            (Universal Business Banking Form - Version 4.5)
          </div>
          <div class="page-number">8</div>
        </template>
      </Paper>

      <Paper
        :paper-orientation="controller.paperOrientation"
        :additional-css-class="controller.additionalCssClass"
        :show-page-number="false"
      >
        <template #paperContent>
          <div class="application-detail-section">
            <table class="alliance-application-table">
              <thead>
                <tr>
                  <th colspan="12">
                    <div class="section-head">
                      <span>SECTION</span>
                      <span class="section-number">G</span>
                      <span>. DECLARATION</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    colspan="12"
                    class="subheading font-weight-bold"
                  >
                    General Declaration
                  </td>
                </tr>
                <tr>
                  <td
                    colspan="12"
                    class="legal-clause-block small text-justify"
                  >
                    <p><b>a. I/We hereby:</b></p>
                    <ol class="clause-ordered-list">
                      <li>
                        Declare that I/we am/are authorised to open the account(s) and apply for the
                        financing/service(s) stated herein.
                      </li>
                      <li>
                        Agree to comply with all the requirements imposed on me/us for account(s) opening, application
                        for Online Banking Services, financing facilities or merchant facilities and further agree that
                        Alliance Bank Malaysia Bhd/Alliance Islamic Bank Bhd (the Bank) reserves the right to terminate
                        or close my/our account(s), financing facilities or merchant facilities where applicable at its
                        absolute discretion without giving any reasons if I/we fail to comply with any of the Bank's
                        requirements.
                      </li>
                      <li>
                        Declare that I/we have not committed any act of bankruptcy as at the time the account(s) is/are
                        opened.
                      </li>
                      <li>
                        Agree that the Bank reserves the right to offset any debit balance in my/our Current
                        Account/Current Account-i from my/our Savings Account/Savings Account-i/AllianceSave and/or
                        Fixed Deposit/Term Deposit-i Account.
                      </li>
                      <li>
                        Confirm that the Bank is authorised to verify and check the information given herein and to
                        obtain credit and other relevant information on me/us from permitted sources at any time.
                      </li>
                      <li>
                        Understand that it is the Bank's policy to conduct business/company searches in respect of all
                        business accounts.
                      </li>
                      <li>
                        Confirm that I/we am/are aware and agree to abide by the Terms and Condition governing the
                        respective account(s) and/or Online Banking Service that I/we have with the Bank.
                      </li>
                      <li>
                        Confirm that the information given above is correct and complete and authorise the Bank to
                        confirm this from permitted source the Bank may choose and further seek and obtain credit
                        information related to my/our application from any credit reporting agencies governed by the
                        Credit Reporting Agencies Act 2010.
                      </li>
                      <li>
                        Agree to examine the statement of account sent to me/us and notify the Bank of any errors,
                        irregularities and/or discrepancies in the said statement of account and also to notify the Bank
                        if I/we fail to receive such statement of account.
                      </li>
                      <li>
                        Agree that the nomination of authorised personnel made under "Authorised Signatory & Account
                        Operation Mandate" herein shall be binding on me/us and undertake that any changes in respect of
                        the authorised personnel shall be made in writing to the Bank.
                      </li>
                    </ol>

                    <p class="margin-top-xs">
                      <b>
                        b. By submitting this application, I/we hereby expressly and irrevocably consent and authorize
                        the Bank to:
                      </b>
                    </p>
                    <ul class="clause-unordered-list">
                      <li>
                        disclose my/our information to relevant authorities or sources to obtain and/or validate my/our
                        Tax Identification Number (TIN) from relevant tax authorities or sources for e-Invoicing
                        purposes; and
                      </li>
                      <li>
                        use my/our relevant information provided herein including the duly validated TIN number for
                        issuance of e-Invoice or related documentation for any applicable transaction in compliance with
                        any applicable tax laws and regulations.
                        <br />
                        <span class="text-muted font-italic">
                          For more information on LHDN e-Invoice requirements, please visit LHDN's website at
                          https://www.hasil.gov.my/e-invois/
                        </span>
                      </li>
                    </ul>

                    <p class="margin-top-xs">
                      <b>c.</b>
                      I/We irrevocably consent to and authorise the Bank to disclose to any credit bureaus, any credit
                      reference agencies, Bank Negara Malaysia, any authority/body having jurisdiction over the Bank
                      including but not limited to tax authorities, any security parties (including guarantors), the
                      Bank's auditors, lawyers and/or authorised agents or to such person(s) and or entity(ies) as
                      permitted by law, any required information relating to my/our affairs, banking accounts or
                      conducts thereof (including my/our credit standing). I/We hereby consent to such disclosure and
                      confirm that the Bank shall not, howsoever be liable to me/us for the furnishing of such
                      information.
                    </p>

                    <p class="margin-top-xs">
                      <b>d.</b>
                      I/We further expressly consent and authorise (i) BNM to disclose my/our credit information in
                      relation to any of my/our credit facility with the Bank to any other financial institutions,
                      credit reporting agencies, and such other persons as BNM may consider necessary, and (ii) such
                      other financial institutions, credit reporting agencies and such other persons as BNM may consider
                      necessary to use such credit information in relation to any of my/our credit facility with the
                      Bank for the purposes stipulated under section 47(2) of the Central Bank of Malaysia Act 2009,
                      including but not limited to assessing creditworthiness, providing credit reporting or
                      electronic-Know Your Customer (e-KYC) services, and offering financial advisory services.
                    </p>

                    <p class="margin-top-xs">
                      <b>e.</b>
                      I/We hereby declare and warrant that we have obtained and/or shall obtain consent from our
                      officers, employees, authorised signatories, directors, individual shareholders, individual
                      guarantors, individual security providers, supplier/vendors and/or related parties (if applicable)
                      to process their personal data for the purposes of this application.
                    </p>

                    <p class="margin-top-xs">
                      <b>f.</b>
                      I/We hereby agree to indemnify the Bank as the collecting banker against all losses, claims,
                      demands, proceedings, costs, expenses and other liabilities whatsoever and whensoever which the
                      Bank may incur on any cheque, bill, note, draft, dividend warrant or other instruments presented
                      by me/us for collection and such instruments shall be deemed to have been collected at my/our
                      expressed request in every case for the credit of my/our account.
                    </p>

                    <p class="margin-top-xs">
                      <b>g.</b>
                      I/We declare that we are in compliance and undertake to ensure compliance to the Foreign Exchange
                      Policy Notices ("FEP Notices") under the Financial Services Act 2013/Islamic Financial Services
                      Act 2013 including but not limited to obtain the necessary approvals from Bank Negara Malaysia or
                      any other authorities (as and when required).
                    </p>

                    <p class="margin-top-xs">
                      <b>h.</b>
                      I/We also authorise the Bank to make this information available to Bank Negara Malaysia in
                      compliance with Foreign Exchange Policy Notices ("FEP Notices").
                    </p>

                    <p class="margin-top-xs">
                      <b>i.</b>
                      We acknowledge that the Foreign Exchange Policy Notices ("FEP Notices") referred to herein is
                      applicable as at the date hereof and may be subject to changes as imposed by Bank Negara Malaysia
                      from time to time.
                    </p>

                    <p class="margin-top-xs">
                      <b>j.</b>
                      I/We undertake to notify the Bank immediately if there is a change in any information which we
                      have provided to the Bank.
                    </p>

                    <p class="margin-top-xs">
                      <b>k.</b>
                      I/We accept that unless otherwise specified herein, our fees exclude any current and future taxes
                      (if any) that may be imposed, under the relevant legislation. Upon the effective date of
                      implementation of any such taxes in the future and wherever applicable, the Bank shall be entitled
                      to recover such taxes from the Company.
                    </p>

                    <p class="margin-top-xs">
                      <b>l.</b>
                      I/We agree and accept that the Bank is at liberty to close my/our current account without further
                      notice to me/us in the event I/we fail to transfer a minimum deposit of RM500, being the initial
                      deposit required by the Bank, within thirty (30) days from the date of account opening.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td
                    colspan="12"
                    class="subheading font-weight-bold"
                  >
                    General Declaration (For Loan/Financing Application)
                  </td>
                </tr>
                <tr>
                  <td
                    colspan="12"
                    class="legal-clause-block small text-justify"
                  >
                    <p class="no-margin">
                      <b>a.</b>
                      I/We hereby declare that all information given in this form is true and complete.
                    </p>
                    <p class="no-margin margin-top-3xs">
                      <b>b.</b>
                      I/We have not committed any act of bankruptcy and/or been adjudged a bankrupt/winding-up.
                    </p>
                    <p class="no-margin margin-top-3xs">
                      <b>c.</b>
                      I/We hereby give consent to the Bank to contact by phone/visit and/or request for written opinion
                      from my major suppliers/buyers as stated in this application form for the purpose of credit checks
                      on me/my company/business.
                    </p>
                    <p class="no-margin margin-top-3xs">
                      <b>d.</b>
                      I/We agree that the Bank reserves the right to review the facility and such other facilities
                      granted to me/us from time to time and at any time.
                    </p>
                    <p class="no-margin margin-top-3xs">
                      <b>e.</b>
                      I/We agree that the Bank shall have the right to vary, reduce or terminate the facilities at any
                      time at the Bank's discretion and notice shall be given of any material variation/changes.
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="paper-footer">
            <b>
              For Alliance Bank’s Use Only and
              <span class="text-danger">Strictly</span>
              Private & Confidential
            </b>
            <br />
            (Universal Business Banking Form - Version 4.5)
          </div>
          <div class="page-number">9</div>
        </template>
      </Paper>

      <Paper
        :paper-orientation="controller.paperOrientation"
        :additional-css-class="controller.additionalCssClass"
        :show-page-number="false"
      >
        <template #paperContent>
          <div class="application-detail-section">
            <table class="alliance-application-table">
              <tbody>
                <tr>
                  <td
                    colspan="12"
                    class="legal-clause-block small text-justify"
                  >
                    <p class="no-margin">
                      <b>f.</b>
                      I/We hereby consent to and authorise the Bank to verify with and/or disclose to Bank Negara
                      Malaysia, the Central Credit Reference Information System of Bank Negara Malaysia, any statutory
                      bodies, any credit bureaus, any credit reference agencies, any authority/body having jurisdiction
                      over the Bank including but not limited to tax authorities on any information concerning or
                      relating to me/us whether financial or otherwise, as required for the purpose of processing this
                      application. I/We hereby consent to such disclosure and confirm that the Bank shall not howsoever
                      be liable to me/us for the furnishing of such information.
                    </p>
                    <p class="margin-top-xs">
                      <b>g.</b>
                      I/We irrevocably authorise and permit the Bank to provide any information concerning me/us, this
                      application, my/our accounts and facilities, products and/or services from/with the Bank to any
                      credit bureaus, any relevant authority(ies), body(ies), person(s) or agency(ies) as may be
                      authorised by law to obtain such information or established by Bank Negara Malaysia ("BNM"), to
                      facilitate the execution of instruction(s) given by me/us in respect of the credit facilities,
                      accounts, products and/or services from/with the Bank, security parties (including guarantors),
                      and the Bank's auditors, lawyers, and/or agents.
                    </p>
                    <p class="margin-top-xs">
                      <b>h.</b>
                      I/We hereby confirm and agree that any data/information (including personal data) relating to or
                      arising from or in connection with my/our application hereunder and also information pertaining to
                      my/or our affairs whether hereunder or otherwise on this application may be held, used and
                      disclosed by the Bank for the purpose of processing this application.
                    </p>
                    <p class="margin-top-xs">
                      <b>i.</b>
                      I/We hereby declare and warrant that we have obtained and/or shall obtain consent from our
                      officers, employees, authorised signatories, directors, individual shareholders, individual
                      guarantors, individual security providers, suppliers/vendors and/or related parties (if
                      applicable) to process their personal data for the purposes of this application.
                    </p>
                    <p class="margin-top-xs"><b>j. I/We hereby confirm and declare as follows:</b></p>
                    <p class="indent-sm">
                      <b>1) In the case of sole proprietor or partnership:</b>
                      Except as disclosed above, none of my spouse(s), parents, children, brothers, sisters, their
                      spouses and/or financial dependants and/or my agents and guarantors are in the employment of the
                      Bank or its subsidiaries and/or related to a director, officer, or employee of the Bank or its
                      subsidiaries.
                    </p>
                    <p class="indent-sm">
                      <b>2) In the case of a company, society or any body not covered under 1) above:</b>
                      Except as disclosed above, none of our directors, managers, controlling shareholders (whether
                      directly or indirectly interested) and/or agents and guarantors are in the employment of the Bank
                      or its subsidiaries and/or are related to any director, officer or employee of the Bank or its
                      subsidiaries, whether as parent, spouse, brother, sister or child and/or their financial
                      dependant.
                    </p>
                    <p class="margin-top-xs">
                      <b>k.</b>
                      I/We further undertake to inform the Bank immediately if any such relationship set out in Clause j
                      1) or 2) above is established/intended to be established.
                    </p>
                    <p class="margin-top-xs">
                      <b>l.</b>
                      I/We hereby submit to the Bank ALL documents required in the cover page together with this
                      application form. I/We hereby represent, declare and confirm that ALL documents submitted by me/us
                      are genuine and that the information therein is true and correct in all respects. Should the
                      documents submitted to the Bank be incomplete, the Bank reserves the right to put the application
                      on hold until the submission of all documents required.
                    </p>
                    <p class="margin-top-xs">
                      <b>m.</b>
                      I/We have read and understood the Terms and Conditions of the facilities together with the Product
                      Disclosure Sheet and hereby agree to be bound by those Terms and Conditions. I/We acknowledge that
                      a copy of each has been made available for my/our retention. I/We irrevocably agree that the Bank
                      may at its sole discretion reject the application or reduce the amount (i.e. offer me/us a lower
                      loan/facility(ies) amount than that applied for) without my/our consent or assigning any reason
                      therefor and the documents accompanying this application shall become and remain the Bank's
                      property. I/We understand and acknowledge that the actual amount of financing, tenure and interest
                      rate to be provided by the Bank are dependent upon credit evaluation and subject to the Bank's
                      absolute discretion and the transmission of the Product Disclosure Sheet to me/us does not create
                      any obligation on the Bank to grant me/us any facilities.
                    </p>
                    <p class="margin-top-xs">
                      <b>n.</b>
                      I/We accept that unless otherwise specified herein, our fees exclude any current and future taxes
                      (if any) that may be imposed, under the relevant legislation. Upon the effective date of
                      implementation of any such taxes in the future and wherever applicable, the Bank shall be entitled
                      to recover such taxes from the Company.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td
                    colspan="12"
                    class="subheading font-weight-bold"
                  >
                    For External Account Only
                  </td>
                </tr>
                <tr>
                  <td
                    colspan="12"
                    class="small text-justify"
                  >
                    <p class="no-margin">
                      <b>a.</b>
                      I/We declare that I/we have no designated resident account maintained with any financial
                      institution in Malaysia (Foreign Exchange Policy Notices (FEP Notices) - Notice 4). Any payment,
                      receipt or transfer into or from an external account are subject to the limit as follows:
                    </p>
                    <div class="indent-sm grid-two-columns margin-top-3xs layout-tight">
                      <div>i. Up to RM10,000 per cheque</div>
                      <div>ii. Up to RM10,000 per account per day through an automated teller machine; or</div>
                      <div>
                        iii. Up to RM10,000 per account per day through electronic means (Internet/Mobile Banking).
                      </div>
                      <div>iv. Up to RM10,000 per account per day in cash deposit.</div>
                    </div>
                    <p class="margin-top-xs no-margin">
                      <b>No limit</b>
                      shall apply for any amount of cash withdrawal over-the-counter from an external account.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td
                    colspan="12"
                    class="subheading font-weight-bold"
                  >
                    Foreign Account Tax Compliance Act (FATCA) & Common Reporting Standard (CRS)
                  </td>
                </tr>
                <tr>
                  <td
                    colspan="12"
                    class="small text-justify"
                  >
                    <p class="no-margin">
                      <b>FATCA:</b>
                      (a) Information provided is accurate. Term "U.S. person" means citizen or resident of US. (b) I/We
                      consent to the Bank reporting my/our data to regulatory tax authorities. (c) The bank may withhold
                      account funds under FATCA directives. (d) Failure to provide updates allows the Bank to classify
                      account as recalcitrant or terminate facilities. (e) Notify within 30 days of changes.
                    </p>
                    <p class="margin-top-xs no-margin">
                      <b>CRS:</b>
                      (a) Disclosures align to account conditions guidelines. (b) Account details can be shared with
                      foreign jurisdictions where I/We maintain tax residency status. (c) Undertake to advise Bank
                      within 30 days of any change altering tax residence indicators.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td
                    colspan="12"
                    class="subheading font-weight-bold"
                  >
                    Product-Specific Declarations
                    <small>(Current, Savings, Foreign Currency & PIDM Disclosures)</small>
                  </td>
                </tr>
                <tr>
                  <td
                    colspan="12"
                    class="small text-justify"
                  >
                    <p class="no-margin">
                      <b>Current/Savings:</b>
                      No account closures due to bounced/returned cheques in the last 6 months. Altered cheques will be
                      dishonoured. Minimum penalty fee of RM100.00 will be levied on each cheque dishonoured due to
                      insufficient funds.
                    </p>
                    <p class="margin-top-xs no-margin">
                      <b>Foreign Currency Account:</b>
                      Operated under specific Foreign Currency rules. Liberty to close without further notice if
                      compliance with Foreign Exchange Policy Notices or FSA/IFSA 2013 framework fails.
                    </p>
                    <p class="margin-top-xs no-margin">
                      <b>PIDM:</b>
                      I/We confirm receipt of the PIDM Deposit Insurance System (DIS) Brochure and acknowledge the
                      protective coverage up to RM250,000 per depositor allocation rules.
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="paper-footer">
            <b>
              For Alliance Bank’s Use Only and
              <span class="text-danger">Strictly</span>
              Private & Confidential
            </b>
            <br />
            (Universal Business Banking Form - Version 4.5)
          </div>
          <div class="page-number">10</div>
        </template>
      </Paper>

      <Paper
        :paper-orientation="controller.paperOrientation"
        :additional-css-class="controller.additionalCssClass"
        :show-page-number="false"
      >
        <template #paperContent>
          <div class="application-detail-section">
            <table class="alliance-application-table">
              <tbody>
                <tr>
                  <td
                    colspan="12"
                    class="legal-clause-block small text-justify"
                  >
                    <p class="no-margin">
                      <b>Cash Management, Online Banking and Biz-Xpress Card Services:</b>
                      (a) Authorised to act for the Entity. (b) Binding transactions executed via credentials. (c)
                      Debiting of annual card subscription parameters (RM8/card). (d) In layout conflict vs Board
                      Resolution, instructions on this form prevail.
                    </p>
                    <p class="margin-top-xs">
                      <b>Business Credit Card:</b>
                      Legal rights and corporate parameters empower director signing permissions under Memorandum and
                      Articles of Association resolution parameters. Authorisation to check records with VISA
                      International/MasterCard International framework databases.
                    </p>
                    <p class="margin-top-xs">
                      <b>Merchant Facility:</b>
                      Bank retains absolute right to accept/reject application without cause assignment. Submission
                      requires upfront usage payment of RM900.00.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td
                    colspan="12"
                    class="subheading font-weight-bold"
                  >
                    USE OF CUSTOMER DATA IN DIRECT MARKETING
                  </td>
                </tr>
                <tr>
                  <td
                    colspan="12"
                    class="small"
                  >
                    <p class="no-margin text-justify">
                      I/We hereby further give consent and authorise the Bank to disclose any information concerning
                      me/us, my/our affairs and/or facilities, accounts, products and/or services for the purposes of
                      strategic alliances, cross selling, marketing, and promotions, to other departments and/or units
                      within the Bank, other companies in the Alliance Bank and outsourced marketing agents. Consent
                      given herein shall supersede all prior/previous consent(s). Withdrawal of consent can be requested
                      at any time via 1300-80-3388 without contract performance degradation impact.
                    </p>
                    <div class="margin-top-xs font-weight-bold flex-row-fields">
                      <span>Please tick preference choice:</span>
                      <div class="form-check margin-left-lg">
                        <i class="fa-sharp fa-light fa-square"></i>
                        <span>YES</span>
                      </div>
                      <div class="form-check margin-left-lg">
                        <i class="fa-sharp fa-light fa-square"></i>
                        <span>NO</span>
                      </div>
                    </div>
                    <p class="x-small text-muted mt-1 no-margin">
                      <i>
                        *Alliance Bank herein refers to Alliance Bank Malaysia Berhad and its wholly-owned subsidiary,
                        Alliance Islamic Bank Berhad.
                      </i>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td
                    colspan="12"
                    class="subheading font-weight-bold"
                  >
                    DETAILS OF CONNECTED PARTIES
                    <small class="font-weight-normal">
                      (Connected with an employee/director/officer of AFGB/ABMB/AIS)
                    </small>
                  </td>
                </tr>
                <tr>
                  <td
                    colspan="12"
                    class="no-padding"
                  >
                    <table class="inner-grid-table flat-borders no-margin layout-fixed">
                      <thead>
                        <tr>
                          <th style="width: 5%">No</th>
                          <th style="width: 25%">Name of Your Director / Shareholder</th>
                          <th style="width: 25%">Name of Employee / Director / Officer</th>
                          <th style="width: 15%">Entity (AFGB/ABMB/AIS)</th>
                          <th style="width: 15%">NRIC No.</th>
                          <th style="width: 15%">Relationship</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1</td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="paper-footer">
            <b>
              For Alliance Bank’s Use Only and
              <span class="text-danger">Strictly</span>
              Private & Confidential
            </b>
            <br />
            (Universal Business Banking Form - Version 4.5)
          </div>
          <div class="page-number">11</div>
        </template>
      </Paper>

      <Paper
        :paper-orientation="controller.paperOrientation"
        :additional-css-class="controller.additionalCssClass"
        :show-page-number="false"
      >
        <template #paperContent>
          <div class="application-detail-section">
            <table class="alliance-application-table">
              <tbody>
                <tr>
                  <td
                    colspan="12"
                    class="subheading font-weight-bold"
                  >
                    DETAILS OF CONNECTED PARTIES
                    <small class="font-weight-normal">(Continued)</small>
                  </td>
                </tr>
                <tr>
                  <td
                    colspan="12"
                    class="no-padding"
                  >
                    <table class="inner-grid-table flat-borders no-margin layout-fixed">
                      <tbody>
                        <tr
                          v-for="idx in [2, 3, 4]"
                          :key="idx"
                        >
                          <td style="width: 5%">{{ idx }}</td>
                          <td style="width: 25%"></td>
                          <td style="width: 25%"></td>
                          <td style="width: 15%"></td>
                          <td style="width: 15%"></td>
                          <td style="width: 15%"></td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td
                    colspan="12"
                    class="subheading font-weight-bold"
                  >
                    DETAILS OF FOREIGN POLITICALLY EXPOSED PERSON (PEP) OR PERSON CLOSELY ASSOCIATED WITH A PEP
                  </td>
                </tr>
                <tr>
                  <td
                    colspan="12"
                    class="no-padding"
                  >
                    <table class="inner-grid-table flat-borders no-margin layout-fixed">
                      <thead>
                        <tr>
                          <th style="width: 5%">No</th>
                          <th style="width: 35%">Name of Your Authorised Signatory, Director / Shareholder</th>
                          <th style="width: 60%">
                            Describe the Authorised Signatory, Director/Shareholder's Function Office / Held and
                            Relationship To / Connection with the Public Official
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="pep in [1, 2, 3, 4, 5]"
                          :key="pep"
                        >
                          <td>{{ pep }}</td>
                          <td></td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="paper-footer">
            <b>
              For Alliance Bank’s Use Only and
              <span class="text-danger">Strictly</span>
              Private & Confidential
            </b>
            <br />
            (Universal Business Banking Form - Version 4.5)
          </div>
          <div class="page-number">12</div>
        </template>
      </Paper>

      <Paper
        :paper-orientation="controller.paperOrientation"
        :additional-css-class="controller.additionalCssClass"
        :show-page-number="false"
      >
        <template #paperContent>
          <div class="application-detail-section">
            <table class="alliance-application-table">
              <tbody>
                <tr>
                  <td colspan="12">
                    <p class="font-weight-bold small no-margin text-uppercase">
                      <i class="fa-regular fa-square-check"></i>
                      I/We Confirm That I Am/We Duly Authorised By the Company/Business to Sign This Application Form
                      For and On Its Behalf.
                    </p>
                    <p class="small text-justify margin-top-xs">
                      I/We hereby wish to apply for the products as indicated and acknowledge that the use of the
                      services is subject to the Bank's Terms & Conditions (T&C) and Fees & Charges (F&C). I/We have
                      read and agree to be bound by the said T&C and F&C of this application form and the T&C and F&C
                      made available at www.alliancebank.com.my (including any subsequent revisions, variations and/or
                      amendments as may be made from time to time).
                    </p>

                    <p class="font-weight-bold small text-underline margin-top-sm no-margin">General</p>
                    <p class="xs-small no-margin">
                      <b>a.</b>
                      Information declared is true and correct. Prompt updates required upon status changes.
                    </p>
                    <p class="xs-small no-margin">
                      <b>b.</b>
                      Confirm all documentation copies appended are genuine and clear.
                    </p>
                    <p class="xs-small no-margin">
                      <b>c.</b>
                      Acknowledge that current SSM Search and CTOS pull records extracted accurately mirror business
                      standing parameters.
                    </p>
                    <p class="xs-small no-margin">
                      <b>d.</b>
                      Inaccuracies allow the Bank complete termination liberties across active accounts and lines.
                    </p>

                    <p class="font-weight-bold small text-underline margin-top-sm no-margin">
                      For Current Account-i/Savings Account-i based on Murabahah via Tawarruq and Alliance Term
                      Deposit-i
                    </p>
                    <p class="xs-small text-justify no-margin">
                      <b>a.</b>
                      I/We agree to appoint the Bank as my/our agent to (a) purchase commodities from the commodity
                      trade service provider by accepting and executing the purchase transaction on my/our behalf, and
                      (b) sell the commodities to the Bank on my/our behalf.
                    </p>
                    <p class="xs-small text-justify no-margin">
                      <b>b.</b>
                      I/We further agree that this agency appointment as stipulated in the Islamic Deposit Terms and
                      Conditions shall remain valid for each subsequent deposit placement/renewal made by me/us and
                      shall only be terminated upon closure of my/our account.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td
                    colspan="12"
                    class="no-padding text-left"
                  >
                    <table
                      class="inner-grid-table explicit-signatures-layout no-margin flat-borders font-weight-bold small"
                    >
                      <tbody>
                        <tr>
                          <td>
                            Name 1:
                            <span class="bottom-dash line-fill"></span>
                            <br />
                            Designation:
                            <span class="bottom-dash line-fill"></span>
                            <br />
                            I.C No.:
                            <span class="bottom-dash line-fill"></span>
                            <br />
                            Date:
                            <span class="bottom-dash line-fill"></span>
                            <div class="sig-placeholder">Signature</div>
                          </td>
                          <td>
                            Name 2:
                            <span class="bottom-dash line-fill"></span>
                            <br />
                            Designation:
                            <span class="bottom-dash line-fill"></span>
                            <br />
                            I.C No.:
                            <span class="bottom-dash line-fill"></span>
                            <br />
                            Date:
                            <span class="bottom-dash line-fill"></span>
                            <div class="sig-placeholder">Signature</div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            Name 3:
                            <span class="bottom-dash line-fill"></span>
                            <br />
                            Designation:
                            <span class="bottom-dash line-fill"></span>
                            <br />
                            I.C No.:
                            <span class="bottom-dash line-fill"></span>
                            <br />
                            Date:
                            <span class="bottom-dash line-fill"></span>
                            <div class="sig-placeholder">Signature</div>
                          </td>
                          <td>
                            Name 4:
                            <span class="bottom-dash line-fill"></span>
                            <br />
                            Designation:
                            <span class="bottom-dash line-fill"></span>
                            <br />
                            I.C No.:
                            <span class="bottom-dash line-fill"></span>
                            <br />
                            Date:
                            <span class="bottom-dash line-fill"></span>
                            <div class="sig-placeholder">Signature</div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            Name 5:
                            <span class="bottom-dash line-fill"></span>
                            <br />
                            Designation:
                            <span class="bottom-dash line-fill"></span>
                            <br />
                            I.C No.:
                            <span class="bottom-dash line-fill"></span>
                            <br />
                            Date:
                            <span class="bottom-dash line-fill"></span>
                            <div class="sig-placeholder">Signature</div>
                          </td>
                          <td>
                            Name 6:
                            <span class="bottom-dash line-fill"></span>
                            <br />
                            Designation:
                            <span class="bottom-dash line-fill"></span>
                            <br />
                            I.C No.:
                            <span class="bottom-dash line-fill"></span>
                            <br />
                            Date:
                            <span class="bottom-dash line-fill"></span>
                            <div class="sig-placeholder">Signature</div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            Name 7:
                            <span class="bottom-dash line-fill"></span>
                            <br />
                            Designation:
                            <span class="bottom-dash line-fill"></span>
                            <br />
                            I.C No.:
                            <span class="bottom-dash line-fill"></span>
                            <br />
                            Date:
                            <span class="bottom-dash line-fill"></span>
                            <div class="sig-placeholder">Signature</div>
                          </td>
                          <td>
                            Name 8:
                            <span class="bottom-dash line-fill"></span>
                            <br />
                            Designation:
                            <span class="bottom-dash line-fill"></span>
                            <br />
                            I.C No.:
                            <span class="bottom-dash line-fill"></span>
                            <br />
                            Date:
                            <span class="bottom-dash line-fill"></span>
                            <div class="sig-placeholder">Signature</div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td
                    colspan="12"
                    class="padding-md text-center"
                  >
                    <div class="rubber-stamp-outline text-muted">Affix Company/Business Rubber Stamp (Optional)</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="paper-footer">
            <b>
              For Alliance Bank’s Use Only and
              <span class="text-danger">Strictly</span>
              Private & Confidential
            </b>
            <br />
            (Universal Business Banking Form - Version 4.5)
          </div>
          <div class="page-number">13</div>
        </template>
      </Paper>

      <Paper
        :paper-orientation="controller.paperOrientation"
        :additional-css-class="controller.additionalCssClass"
        :show-page-number="false"
      >
        <template #paperContent>
          <div class="application-detail-section bg-bank-use-section">
            <table class="alliance-application-table bank-internal-table">
              <thead>
                <tr>
                  <th colspan="12">
                    <div class="section-head text-dark">
                      <span>SECTION</span>
                      <span class="section-number">H</span>
                      <span>. FOR BANK USE ONLY</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    colspan="12"
                    class="small"
                  >
                    <p class="font-weight-bold no-margin text-uppercase">
                      FATCA - On-board of U.S. Person / Recalcitrant / category other than as declared in page 2 on
                      exception basis:
                    </p>
                    <p class="x-small font-italic no-margin text-muted">
                      Instruction: Please complete the "Approval Form-For On-Boarding New 'U.S Person/Recalcitrant
                      Customer" should the bank propose to on-board the following customers: A. Specified U.S Person |
                      B. Non specified U.S Person | V-X. Recalcitrant customer | 1-13. Category other than above.
                    </p>
                    <div class="form-check font-weight-bold margin-top-xs small text-justify">
                      <i class="fa-sharp fa-light fa-square"></i>
                      <span>
                        I confirm that the necessary documents have been completed according to the classification
                        declared by the customer above (Form W-8BEN-E, W-9 or Approval Form, whichever applicable) and
                        the customer's FATCA status has been entered into the system accordingly.
                      </span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td
                    colspan="12"
                    class="border-top-dash font-weight-bold small"
                  >
                    <p class="no-margin text-uppercase">
                      Common Reporting Standard (CRS) - Confirmation by Teller / Front Office Staff
                    </p>
                    <div class="form-check text-justify small no-margin margin-top-3xs">
                      <i class="fa-sharp fa-light fa-square"></i>
                      <span>
                        I confirm that based on the information obtained in connection with the opening of accounts,
                        including any documentation collected pursuant to the KYC/AML procedures, there is no reason to
                        know that the self-certification provided by the Customer/the Controlling Person (delete
                        whichever not applicable) is incorrect or unreliable.
                      </span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td
                    colspan="12"
                    class="no-padding"
                  >
                    <div class="grid-bank-routing-stamps small padding-xs font-weight-bold">
                      <div>
                        BU Code:
                        <span class="bottom-dash short"></span>
                      </div>
                      <div>
                        Preferred Branch:
                        <span class="bottom-dash short"></span>
                      </div>
                      <div>
                        Branch Name:
                        <span class="bottom-dash short"></span>
                      </div>
                      <div>
                        Armcode:
                        <span class="bottom-dash short"></span>
                      </div>
                    </div>
                    <div class="grid-triple-equal padding-xs font-weight-bold small border-top-dash">
                      <div>
                        Attended by:
                        <br />
                        <br />
                        Name:
                        <span class="bottom-dash line-fill"></span>
                        <br />
                        Designation:
                        <span class="bottom-dash line-fill"></span>
                      </div>
                      <div>
                        Verified & Approved by:
                        <br />
                        <br />
                        Name:
                        <span class="bottom-dash line-fill"></span>
                        <br />
                        Designation:
                        <span class="bottom-dash line-fill"></span>
                      </div>
                      <div class="stamp-box-square text-center">
                        <br />
                        Acknowledgement Receipt Stamp
                      </div>
                    </div>
                    <div class="grid-double-equal padding-xs font-weight-bold small border-top-dash">
                      <div>
                        Account Opened by:
                        <br />
                        Name:
                        <span class="bottom-dash line-fill"></span>
                        &nbsp;&nbsp; Designation:
                        <span class="bottom-dash line-fill"></span>
                      </div>
                      <div>
                        Activated by (Biz-Xpress Card ONLY):
                        <br />
                        Name:
                        <span class="bottom-dash line-fill"></span>
                        &nbsp;&nbsp; Designation:
                        <span class="bottom-dash line-fill"></span>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td
                    colspan="6"
                    class="vertical-align-top"
                  >
                    <p class="font-weight-bold small text-center bg-dark text-white no-margin padding-3xs">
                      Account Opening Checklist
                    </p>
                    <table class="inner-grid-table mini checklist-table no-margin">
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>Requirement Description</th>
                          <th>Tick</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1</td>
                          <td>
                            HDC Inquiry checked date:
                            <span class="bottom-dash short"></span>
                          </td>
                          <td><i class="fa-sharp fa-light fa-square"></i></td>
                        </tr>
                        <tr>
                          <td>2</td>
                          <td>
                            SSM or other relevant search date:
                            <span class="bottom-dash short"></span>
                          </td>
                          <td><i class="fa-sharp fa-light fa-square"></i></td>
                        </tr>
                        <tr>
                          <td>3</td>
                          <td>Photocopy of NRIC/Passport (If MyKad validation fails)</td>
                          <td><i class="fa-sharp fa-light fa-square"></i></td>
                        </tr>
                        <tr>
                          <td>4</td>
                          <td>Business unit code maintenance</td>
                          <td><i class="fa-sharp fa-light fa-square"></i></td>
                        </tr>
                        <tr>
                          <td>5</td>
                          <td>Scanning of signature (clerk to initial)</td>
                          <td><i class="fa-sharp fa-light fa-square"></i></td>
                        </tr>
                        <tr>
                          <td>6</td>
                          <td>Verification of scanned signature (officer to initial)</td>
                          <td><i class="fa-sharp fa-light fa-square"></i></td>
                        </tr>
                        <tr>
                          <td>7</td>
                          <td>Terms and Conditions - signed declaration column</td>
                          <td><i class="fa-sharp fa-light fa-square"></i></td>
                        </tr>
                        <tr>
                          <td>8</td>
                          <td>Ensure nature of business complies with Shariah principles</td>
                          <td><i class="fa-sharp fa-light fa-square"></i></td>
                        </tr>
                        <tr>
                          <td>9</td>
                          <td>Duly completed application form details verified</td>
                          <td><i class="fa-sharp fa-light fa-square"></i></td>
                        </tr>
                        <tr>
                          <td>10</td>
                          <td>Signatures align with Board Resolution mandate parameters</td>
                          <td><i class="fa-sharp fa-light fa-square"></i></td>
                        </tr>
                        <tr>
                          <td>11</td>
                          <td>Certified true copy of Board Resolution gathered</td>
                          <td><i class="fa-sharp fa-light fa-square"></i></td>
                        </tr>
                        <tr>
                          <td>12</td>
                          <td>
                            Special Campaigns - Code:
                            <span class="bottom-dash short"></span>
                          </td>
                          <td><i class="fa-sharp fa-light fa-square"></i></td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                  <td
                    colspan="6"
                    class="vertical-align-top"
                  >
                    <p class="font-weight-bold small text-center bg-dark text-white no-margin padding-3xs">
                      Alliance BizSmart SME Package Checklist
                    </p>
                    <table class="inner-grid-table mini checklist-table no-margin">
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>Requirement Description</th>
                          <th>Tick</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1</td>
                          <td>Customer is SME/Sole Proprietor (BU: 400, 401, 402, 403, 404)</td>
                          <td><i class="fa-sharp fa-light fa-square"></i></td>
                        </tr>
                        <tr>
                          <td>2</td>
                          <td>Customer signs up for Transactional Module package</td>
                          <td><i class="fa-sharp fa-light fa-square"></i></td>
                        </tr>
                      </tbody>
                    </table>
                    <div class="margin-top-md padding-sm font-weight-bold small">
                      Date Received:
                      <span class="bottom-dash line-fill"></span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="paper-footer">
            <b>
              For Alliance Bank’s Use Only and
              <span class="text-danger">Strictly</span>
              Private & Confidential
            </b>
            <br />
            (Universal Business Banking Form - Version 4.5)
          </div>
          <div class="page-number">14</div>
        </template>
      </Paper>

      <Paper
        :paper-orientation="controller.paperOrientation"
        :additional-css-class="controller.additionalCssClass"
        :show-page-number="false"
      >
        <template #paperContent>
          <div class="application-detail-section appendix-glossary-section">
            <h5 class="font-weight-bold text-center border-bottom-heavy padding-bottom-3xs">
              DEFINITIONS APPENDIX REFERENCE GLOSSARY
            </h5>

            <div class="glossary-category margin-top-sm">
              <p class="font-weight-bold text-uppercase label-heading">Definitions of Terms for CRS</p>
              <div class="definition-item small">
                <p class="no-margin">
                  <b>1) Malaysia tax resident entity:</b>
                  For full definition of Malaysia tax resident entity, please refer to the link:
                  (http://www.hasil.gov.my).
                </p>
              </div>
              <div class="definition-item small margin-top-3xs">
                <p class="no-margin">
                  <b>2) Investment Entity:</b>
                  Any entity that primarily conducts as a business of one or more of the following activities or
                  operations for and on behalf of their customer: (i) trading in money market instruments, derivatives,
                  forex, index instruments, transferable securities; (ii) individual and collective portfolio
                  management; (iii) managing Financial Assets on behalf of other entities. Managed indicators trigger if
                  asset authority rules sit inside discretionary control profiles.
                </p>
              </div>
              <div class="definition-item small margin-top-3xs">
                <p class="no-margin">
                  <b>3) Investment Entity located in a non-participating jurisdiction:</b>
                  An Investment Entity which is located in a non-participating jurisdiction. Refer to OECD platform
                  (https://www.oecd.org) for participating country data listings.
                </p>
              </div>
              <div class="definition-item small margin-top-3xs">
                <p class="no-margin">
                  <b>4) Controlling Persons:</b>
                  Natural person(s) who ultimately holds controlling ownership interest (exceeding a 25% threshold
                  stake). Senior management parameters trigger if ownership trails show zero natural individuals.
                </p>
              </div>
              <div class="definition-item small margin-top-3xs">
                <p class="no-margin">
                  <b>5) Taxpayer Identification Number (TIN):</b>
                  Functional equivalents issued by taxing authorities to capture entity reporting obligations. (In
                  Inland Revenue Board of Malaysia framework contexts, this constitutes the native registration tracking
                  index).
                </p>
              </div>
            </div>

            <div class="glossary-category margin-top-md border-top-dash padding-top-sm">
              <p class="font-weight-bold text-uppercase label-heading">Definitions of Terms for FATCA</p>
              <div class="definition-item small">
                <p class="no-margin">
                  <b>1) Financial Institutions:</b>
                  Entities accepting deposits via standard banking loops, asset custodial operations, investment funds,
                  specialized portfolio holding operations, insurance underwriters carrying cash-value distribution
                  limits.
                </p>
              </div>
              <div class="definition-item small margin-top-3xs">
                <p class="no-margin">
                  <b>2) U.S. person / United States person:</b>
                  Defined under Section 7701(a)(30) of Internal Revenue Code: US citizen or resident status, native
                  partnerships, native corporations, estates/trusts with primary domestic court oversight profiles.
                </p>
              </div>
              <div class="definition-item small margin-top-3xs">
                <p class="no-margin">
                  <b>3) Substantial United States owners:</b>
                  Foreign corporations, partnerships, or trust interests holding directly or indirectly more than a 10
                  percent (10%) threshold stake by votes or asset values assigned to a specified U.S. individual
                  profile.
                </p>
              </div>
            </div>
          </div>
          <div class="paper-footer">
            <b>
              For Alliance Bank’s Use Only and
              <span class="text-danger">Strictly</span>
              Private & Confidential
            </b>
            <br />
            (Universal Business Banking Form - Version 4.5)
          </div>
          <div class="page-number">15</div>
        </template>
      </Paper>

      <Paper
        :paper-orientation="controller.paperOrientation"
        :additional-css-class="controller.additionalCssClass"
        :show-page-number="false"
      >
        <template #paperContent>
          <div class="application-detail-section appendix-glossary-section">
            <div class="glossary-category">
              <p class="font-weight-bold text-uppercase label-heading">
                Definition for Domestic Ringgit Borrowing (DRB)
              </p>
              <div class="definition-item small text-justify">
                <p class="no-margin">
                  <b>Domestic Ringgit Borrowing/Financing refers to:</b>
                  Any utilised or unutilised Ringgit credit facility, financing line, trade facility, corporate bond or
                  Sukuk framework obtained by a Resident from another Resident,
                  <b>excluding</b>
                  :
                </p>
                <ol class="clause-ordered-list type-alpha indent-sm margin-top-3xs">
                  <li>
                    Trade credit terms extended directly by business vendors/suppliers for typical goods/services loops.
                  </li>
                  <li>
                    Forward Basis limits assigned by Licensed Onshore Banks (LOB), excluding currency swap elements.
                  </li>
                  <li>Financial Guarantees or Non-Financial Guarantees.</li>
                  <li>Operational leasing facilities.</li>
                  <li>Factoring facilities arranged without financial recourse.</li>
                  <li>
                    Credit card or charge card limits running retail consumption tracking loops for Resident
                    Individuals.
                  </li>
                  <li>Financing facility targeting one residential property and one vehicle allocation limits.</li>
                </ol>
                <p class="margin-top-xs no-margin">
                  <b>Resident Entity Status Parameters:</b>
                  Deemed carrying DRB constraints if corporate links with a Parent-Subsidiary network register active
                  lines. Intercompany loans inside parent loops or lines explicitly matching Sundry/Employee travel card
                  allocations are excluded from calculations. Sundry covers small non-frequent office support spends.
                </p>
              </div>
            </div>
          </div>
          <div class="paper-footer">
            <b>
              For Alliance Bank’s Use Only and
              <span class="text-danger">Strictly</span>
              Private & Confidential
            </b>
            <br />
            (Universal Business Banking Form - Version 4.5)
          </div>
          <div class="page-number">16</div>
        </template>
      </Paper>

      <Paper
        :paper-orientation="controller.paperOrientation"
        :additional-css-class="controller.additionalCssClass"
        :show-page-number="false"
      >
        <template #paperContent>
          <div class="application-detail-section">
            <p class="font-weight-bold small no-margin text-uppercase">
              FATCA Status Code Matrix
              <small class="text-muted font-weight-normal">
                (Sole Proprietor, Partnership, LLP, Private & Public Limited Companies Only)
              </small>
            </p>
            <table class="inner-grid-table compact layout-fixed mapping-code-table margin-top-xs">
              <thead>
                <tr>
                  <th style="width: 10%">Code</th>
                  <th style="width: 45%">Entity’s Classification Category</th>
                  <th style="width: 45%">Regulatory Guidance Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>A</td>
                  <td>Specified US person</td>
                  <td>Please refer to Form W-9</td>
                </tr>
                <tr>
                  <td>B</td>
                  <td>Non specified US person</td>
                  <td>Please refer to Form W-9</td>
                </tr>
                <tr>
                  <td>C</td>
                  <td>Non US government and Non US central bank</td>
                  <td>Standard Exception Profile</td>
                </tr>
                <tr>
                  <td>D</td>
                  <td>Public listed entity regularly traded on Bursa Malaysia or another global market exchange</td>
                  <td>Includes corporate subsidiary extensions</td>
                </tr>
                <tr>
                  <td>E</td>
                  <td>Non-reportable Passive NFFE</td>
                  <td>Meets investment tracking exclusions</td>
                </tr>
                <tr>
                  <td>F</td>
                  <td>Active NFFE</td>
                  <td>Core business operation profile</td>
                </tr>
                <tr>
                  <td>G - N</td>
                  <td>Nonparticipating FFI, Reporting Model 1/2 FFI, Deemed Compliant local bank frameworks</td>
                  <td>Refer to W-8BEN-E definitions. Code G triggers on non-submission.</td>
                </tr>
                <tr>
                  <td>P - X</td>
                  <td>Sponsored vehicles, Limited life assets, Recalcitrant asset profiles, Dormant lines</td>
                  <td>Triggers when reporting documentation compliance metrics are missing.</td>
                </tr>
                <tr>
                  <td>1-13</td>
                  <td>Category choices other than structural matrix bounds</td>
                  <td>Cross-reference Form W-8BEN-E index parameters</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="paper-footer">
            <b>
              For Alliance Bank’s Use Only and
              <span class="text-danger">Strictly</span>
              Private & Confidential
            </b>
            <br />
            (Universal Business Banking Form - Version 4.5)
          </div>
          <div class="page-number">17</div>
        </template>
      </Paper>

      <Paper
        :paper-orientation="controller.paperOrientation"
        :additional-css-class="controller.additionalCssClass"
        :show-page-number="false"
      >
        <template #paperContent>
          <div class="application-detail-section">
            <p class="font-weight-bold small no-margin text-uppercase">
              Appendix 1: Business Type Entity Codes
              <small class="text-muted font-weight-normal">(Part 1)</small>
            </p>
            <table class="inner-grid-table compact layout-fixed structural-codes-table margin-top-xs">
              <thead>
                <tr>
                  <th style="width: 8%">No</th>
                  <th style="width: 22%">Classification Category</th>
                  <th style="width: 8%">Code</th>
                  <th style="width: 62%">Regulatory Legal Definitions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Individual</td>
                  <td>11</td>
                  <td>Natural persons including joint non-business account loops. Excludes sole proprietors.</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Non-Individual</td>
                  <td>--</td>
                  <td>Any organizational asset framework outside the boundaries of an individual.</td>
                </tr>
                <tr>
                  <td>2.1</td>
                  <td>Monetary Authority</td>
                  <td>35</td>
                  <td>Central banks, currency boards, or state monetary reserve management setups.</td>
                </tr>
                <tr>
                  <td>2.2</td>
                  <td>International Organisation</td>
                  <td>51</td>
                  <td>Entities born from formal political treaties between global nations (e.g., UN organs).</td>
                </tr>
                <tr>
                  <td>2.3</td>
                  <td>Government</td>
                  <td>--</td>
                  <td>Federal, State, local authorities, statutory bodies, or sovereign embassy units.</td>
                </tr>
                <tr>
                  <td>2.3.1</td>
                  <td>Federal/Central Govt</td>
                  <td>31</td>
                  <td>Ministries, central executive offices, excluding commercial state-owned firms.</td>
                </tr>
                <tr>
                  <td>2.3.2</td>
                  <td>State Government</td>
                  <td>32</td>
                  <td>Regional administrative levels, state assemblies, district offices.</td>
                </tr>
                <tr>
                  <td>2.3.3</td>
                  <td>Local Government</td>
                  <td>33</td>
                  <td>City, town, and municipal councils (includes KL, Putrajaya, and Labuan federal units).</td>
                </tr>
                <tr>
                  <td>2.3.4</td>
                  <td>Statutory Agency</td>
                  <td>34</td>
                  <td>Bodies formed via explicit statutory acts, excluding banking hubs (BNM, AgroBank).</td>
                </tr>
                <tr>
                  <td>2.4</td>
                  <td>Corporation</td>
                  <td>12</td>
                  <td>Companies under Companies Act 1965 or relevant regional business codes.</td>
                </tr>
                <tr>
                  <td>2.4.1</td>
                  <td>Financial Institution</td>
                  <td>--</td>
                  <td>Licensed financial operators running under the Central Bank of Malaysia Act 2009.</td>
                </tr>
                <tr>
                  <td>2.4.1.1</td>
                  <td>Banking Institution</td>
                  <td>--</td>
                  <td>Commercial setups under Financial Services Act (FSA) or Shariah hubs (IFSA).</td>
                </tr>
                <tr>
                  <td>2.4.1.1.1</td>
                  <td>Commercial Bank</td>
                  <td>--</td>
                  <td>Standard banking houses licensed under the structural scope of the FSA.</td>
                </tr>
                <tr>
                  <td>2.4.1.1.2</td>
                  <td>Islamic Bank</td>
                  <td>13</td>
                  <td>Shariah-compliant commercial banking vehicles carrying licensing under the IFSA.</td>
                </tr>
                <tr>
                  <td>2.4.1.1.3</td>
                  <td>Investment Bank</td>
                  <td>14</td>
                  <td>Entities licensed to conduct underwriting and investment operations under FSA rules.</td>
                </tr>
                <tr>
                  <td>2.4.1.1.4</td>
                  <td>Int. Islamic Bank</td>
                  <td>15</td>
                  <td>Foreign cross-border Islamic banking platforms holding operational licenses under IFSA.</td>
                </tr>
                <tr>
                  <td>2.4.1.2</td>
                  <td>Non-Bank Fin. Institution</td>
                  <td>--</td>
                  <td>Finance houses operating lines outside explicit FSA or IFSA retail banking blocks.</td>
                </tr>
                <tr>
                  <td>2.4.1.2.1</td>
                  <td>Co-operative Society</td>
                  <td>42</td>
                  <td>Registered under Co-operative Societies Act 1993, Farmers/Fishermen unions.</td>
                </tr>
                <tr>
                  <td>2.4.1.2.2</td>
                  <td>Stock Broking Company</td>
                  <td>68</td>
                  <td>Member dealers running market execution platforms under Securities Industry Act 1983.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="paper-footer">
            <b>
              For Alliance Bank’s Use Only and
              <span class="text-danger">Strictly</span>
              Private & Confidential
            </b>
            <br />
            (Universal Business Banking Form - Version 4.5)
          </div>
          <div class="page-number">18</div>
        </template>
      </Paper>

      <Paper
        :paper-orientation="controller.paperOrientation"
        :additional-css-class="controller.additionalCssClass"
        :show-page-number="false"
      >
        <template #paperContent>
          <div class="application-detail-section">
            <p class="font-weight-bold small no-margin text-uppercase">
              Appendix 1: Business Type Entity Codes
              <small class="text-muted font-weight-normal">(Part 2)</small>
            </p>
            <table class="inner-grid-table compact layout-fixed structural-codes-table margin-top-xs">
              <thead>
                <tr>
                  <th style="width: 10%">No</th>
                  <th style="width: 25%">Classification Category</th>
                  <th style="width: 10%">Code</th>
                  <th style="width: 55%">Regulatory Legal Definitions / Included Options</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>2.4.1.2.3</td>
                  <td>Other Non-Bank Financial Institution</td>
                  <td>--</td>
                  <td>
                    Includes: (a) Insurance/Reinsurance setups; (b) Takaful operators; (c) Development Financial
                    Institutions (DFIs); (d) Brokers (Takaful/Insurance); (e) Card issuers & E-money operations; (f)
                    Remittance houses; (g) Payment Gateways; (h) Provident Funds; (i) Trust funds; (j) Leasing
                    operations; (k) Mortgage hubs; (l) Money Changers, Lenders, Venture capital and Pawn brokers.
                  </td>
                </tr>
                <tr>
                  <td>2.4.2</td>
                  <td>Non-Financial Institution</td>
                  <td>--</td>
                  <td>Commercial firms whose primary income loops run on non-financial product metrics.</td>
                </tr>
                <tr>
                  <td>2.4.2.1</td>
                  <td>Sole Proprietor</td>
                  <td>21</td>
                  <td>Unincorporated business managed by a single natural owner with zero corporate shield.</td>
                </tr>
                <tr>
                  <td>2.4.2.2</td>
                  <td>Partnership</td>
                  <td>22</td>
                  <td>Two or more persons running combined profit tracks under common commercial intents.</td>
                </tr>
                <tr>
                  <td>2.4.2.3</td>
                  <td>Company</td>
                  <td>24</td>
                  <td>Incorporated entities running commercial lines under Companies Act 1965 guidelines.</td>
                </tr>
                <tr>
                  <td>2.4.2.4</td>
                  <td>Limited Liability Partnership</td>
                  <td>26</td>
                  <td>LLP frameworks balancing partner flexibility alongside protection. Governed by LLP Act 2012.</td>
                </tr>
                <tr>
                  <td>2.5</td>
                  <td>Other Entities</td>
                  <td>--</td>
                  <td>Non-individual setups outside Government or corporate company parameters.</td>
                </tr>
                <tr>
                  <td>2.5.1</td>
                  <td>Professional Agency</td>
                  <td>23</td>
                  <td>Overlooking guilds (MICPA, Malaysian Bar) or clinics/firms with zero SSM registry files.</td>
                </tr>
                <tr>
                  <td>2.5.2</td>
                  <td>Trade Union</td>
                  <td>41</td>
                  <td>Independent labor collectives working under Trade Union Act 1959.</td>
                </tr>
                <tr>
                  <td>2.5.3</td>
                  <td>Society/Association</td>
                  <td>43</td>
                  <td>Formal community groups running structure configurations for shared non-profit scopes.</td>
                </tr>
                <tr>
                  <td>2.5.4</td>
                  <td>Others</td>
                  <td>91</td>
                  <td>Catch-all code category covering miscellaneous fringe operational frameworks.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="paper-footer">
            <b>
              For Alliance Bank’s Use Only and
              <span class="text-danger">Strictly</span>
              Private & Confidential
            </b>
            <br />
            (Universal Business Banking Form - Version 4.5)
          </div>
          <div class="page-number">19</div>
        </template>
      </Paper>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import Paper from "@/components/Papers/Paper.vue"
  import { AllianceBankApplicationFormController } from "~/scripts/components/legal-documents/AllianceBankApplicationFormController"
  import { CompanyBankAccountOpening } from "~/scripts/models/CompanyBankAccountOpening"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
    applicationId: {
      type: [String, null],
      default: null,
    },
    application: {
      type: [CompanyBankAccountOpening, null],
      default: null,
    },
    isInPreviewMode: {
      type: Boolean,
      default: true,
    },
    showWatermark: {
      type: Boolean,
      default: false,
    },
    watermarkText: {
      type: String,
      default: "DRAFT",
    },
  })

  const emit = defineEmits([])

  const controller = new AllianceBankApplicationFormController(
    props.companyId,
    props.applicationId,
    props.isInPreviewMode,
    emit
  )

  watch(
    () => props.applicationId,
    (newVal) => {
      if (newVal) {
        controller.setApplicationId(newVal)
      }
    }
  )

  watch(
    () => props.isInPreviewMode,
    (newVal) => {
      controller.setIsInPreviewMode(newVal)
    }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/LegalDocuments/AllianceBankApplicationForm" as *;
</style>
