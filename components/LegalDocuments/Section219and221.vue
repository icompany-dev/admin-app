<template>
  <div
    id="legal-documents-section-219-221"
    ref="documentRef"
  >
    <div
      class="paper-wrapper"
      :class="controller.paperOrientation"
    >
      <div
        class="paper print legal-document"
        :class="controller.paperOrientation"
      >
        <div class="title">
          {{ controller.legalDocumentName.value }}
        </div>
        <div class="company-details align-center">
          <div class="name">
            {{ controller.companyName() }}
          </div>
          <div class="registration-number">
            {{ controller.registrationNumber() }}
          </div>
        </div>
        <div>
          I am Director of the above Company, and pursuant to Section 219 of the Companies Act, 2016, I hereby submit
          the following for inclusion in the Company's Register of Directors' shareholdings, etc. and Register of
          Directors, Managers and Secretaries:-
        </div>
        <div class="section">
          <div class="header">A.&nbsp;&nbsp;&nbsp;&nbsp;REGISTER OF DIRECTORS (SECTION 57)</div>
          <table class="section219-221-table">
            <tbody>
              <tr>
                <td>1.</td>
                <td>Name :</td>
                <td>
                  {{ controller.name() }}
                </td>
                <td>2.</td>
                <td>Nationality/Race :</td>
                <td>{{ controller.nationalityRace().toUpperCase() }}</td>
              </tr>
              <tr>
                <td>3.</td>
                <td>Usual Residential Address :</td>
                <td
                  class="span-4"
                  colspan="4"
                >
                  <input
                    type="text"
                    class="form-control in-resolution"
                    v-model="controller.application.value.residentialAddress"
                    v-if="controller.isDocumentEditable()"
                  />
                  <span v-if="!controller.isDocumentEditable()">
                    {{ controller.residentialAddress() }}
                  </span>
                </td>
              </tr>
              <tr>
                <td>4.</td>
                <td>
                  <span :class="{ strikedthrough: !controller.isIdentificationTypeNRIC() }">I/C</span>
                  /
                  <span :class="{ strikedthrough: controller.isIdentificationTypeNRIC() }">Passport No.</span>
                  :
                </td>
                <td>{{ controller.identificationNumber() }}</td>
                <td>5.</td>
                <td>Date of Birth :</td>
                <td>
                  <input
                    type="date"
                    class="form-control in-resolution"
                    v-model="controller.application.value.dateOfBirth"
                    v-if="controller.isDocumentEditable()"
                  />
                  <span v-if="!controller.isDocumentEditable()">
                    {{ controller.dateOfBirth() }}
                  </span>
                </td>
              </tr>
              <tr>
                <td>6.</td>
                <td>Expiry Date (Passport) :</td>
                <td>
                  <input
                    type="date"
                    class="form-control in-resolution"
                    v-model="controller.application.value.passportExpiryDate"
                    v-if="controller.isDocumentEditable() && controller.isIdentificationTypeNRIC()"
                  />
                  <span v-if="!controller.isDocumentEditable()">
                    {{ controller.passportExpiryDate() }}
                  </span>
                </td>
                <td>7.</td>
                <td>Business Occupation :</td>
                <td>{{ controller.businessOccupation() }}</td>
              </tr>
              <tr>
                <td>8.</td>
                <td>Service/Business Address :</td>
                <td>
                  <div v-html="controller.businessAddress()" />
                </td>
                <td>9.</td>
                <td>Email Address :</td>
                <td>{{ controller.emailAddress() }}</td>
              </tr>
              <tr>
                <td>*10.</td>
                <td
                  class="span-5"
                  colspan="5"
                >
                  Particulars of any other directorships of public companies or subsidiaries of public companies :-
                  <br />
                  <i>
                    (Note :Directorships in related corporations need not be shown provided the name of holding company
                    is followed by the word “Group”)
                  </i>
                </td>
              </tr>
              <tr class="no-border">
                <td></td>
                <td colspan="5">
                  <div class="empty-fields">
                    <div class="empty-field">
                      <div class="number">(i)</div>
                      <div class="field">
                        <input
                          v-if="controller.isDocumentEditable()"
                          type="text"
                          class="form-control in-resolution"
                          v-model="controller.application.value.directorshipsInOtherCompanies[0]"
                        />
                        <span v-if="!controller.isDocumentEditable()">
                          {{ controller.application.value.directorshipsInOtherCompanies[0] }}
                        </span>
                      </div>
                    </div>
                    <div class="empty-field">
                      <div class="number">(iii)</div>
                      <div class="field">
                        <input
                          v-if="controller.isDocumentEditable()"
                          type="text"
                          class="form-control in-resolution"
                          v-model="controller.application.value.directorshipsInOtherCompanies[2]"
                        />
                        <span v-if="!controller.isDocumentEditable()">
                          {{ controller.application.value.directorshipsInOtherCompanies[2] }}
                        </span>
                      </div>
                    </div>
                    <div class="empty-field">
                      <div class="number">(ii)</div>
                      <div class="field">
                        <input
                          v-if="controller.isDocumentEditable()"
                          type="text"
                          class="form-control in-resolution"
                          v-model="controller.application.value.directorshipsInOtherCompanies[1]"
                        />
                        <span v-if="!controller.isDocumentEditable()">
                          {{ controller.application.value.directorshipsInOtherCompanies[1] }}
                        </span>
                      </div>
                    </div>
                    <div class="empty-field">
                      <div class="number">(iv)</div>
                      <div class="field">
                        <input
                          v-if="controller.isDocumentEditable()"
                          type="text"
                          class="form-control in-resolution"
                          v-model="controller.application.value.directorshipsInOtherCompanies[3]"
                        />
                        <span v-if="!controller.isDocumentEditable()">
                          {{ controller.application.value.directorshipsInOtherCompanies[3] }}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div>* Applicable only to Directors of Public Company</div>
        </div>
      </div>
    </div>
    <div
      class="paper-wrapper"
      :class="controller.paperOrientation"
    >
      <div
        class="paper print legal-document"
        :class="controller.paperOrientation"
      >
        <div class="paper-page-number top">2</div>
        <div class="company-details">
          <div class="name">
            {{ controller.companyName() }}
          </div>
          <div class="registration-number">
            {{ controller.registrationNumber() }}
          </div>
        </div>
        <div class="section">
          <div class="header">B.&nbsp;&nbsp;&nbsp;&nbsp;REGISTER OF DIRECTORS’ SHAREHOLDINGS, ETC (SECTION 59)</div>
          <div>
            Particulars relating to shares, debentures, participatory interests, rights, options or contracts in the
            company or in a related corporation and any change therein :-
            <br />
            <i>
              (Note: you are regarded as having an interest in shares, etc if the shares, etc are held by a body
              corporate which is controlled by you or acts in accordance with your instructions or you, with or without
              or through associates, control not less than 20% of the voting shares in that body corporate (Section
              8(4)(c) of the Companies Act, 2016). It also includes shares, etc. held jointly with other persons)
            </i>
          </div>
          <div class="sub-header">(a)&nbsp;&nbsp;&nbsp;&nbsp;As at date of appointment:-</div>
          <table class="section-59-table">
            <tbody>
              <tr class="header-row">
                <td rowspan="3"></td>
                <td
                  class="span-4"
                  colspan="4"
                >
                  No. of shares, debentures, etc held
                </td>
              </tr>
              <tr class="header-row">
                <td
                  class="span-2"
                  colspan="2"
                >
                  As beneficial owner
                </td>
                <td></td>
                <td></td>
              </tr>
              <tr class="header-row">
                <td>Registered in your own name</td>
                <td>
                  Registered in other's name
                  <br />
                  <i>(State the name)</i>
                </td>
                <td>
                  As a nominee
                  <br />
                  <i>(State the beneficiary's name)</i>
                </td>
                <td>
                  Held by a corporation
                  <br />
                  <i>(State the corporation's name)</i>
                </td>
              </tr>
              <tr>
                <td>In the Company</td>
                <td>
                  {{ controller.sharesRegisteredAsBeneficialOwner() }}
                </td>
                <td>
                  <input
                    type="text"
                    class="form-control in-resolution"
                    v-if="controller.isDocumentEditable()"
                    placeholder="No. of Shares"
                    v-model="controller.application.value.shareholdingInCompanyAtAppointment.noSharesAsBoUnderOthers"
                  />
                  <input
                    type="text"
                    class="form-control in-resolution"
                    v-if="controller.isDocumentEditable()"
                    placeholder="Name"
                    v-model="
                      controller.application.value.shareholdingInCompanyAtAppointment.nameOfSharesAsBoUnderOthers
                    "
                  />
                  <span
                    v-if="!controller.isDocumentEditable()"
                    v-html="controller.sharesRegisteredAsBeneficialOwnerOthers()"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    class="form-control in-resolution"
                    v-if="controller.isDocumentEditable()"
                    placeholder="No. of Shares"
                    v-model="controller.application.value.shareholdingInCompanyAtAppointment.noOfSharesAsNominee"
                  />
                  <input
                    type="text"
                    class="form-control in-resolution"
                    v-if="controller.isDocumentEditable()"
                    placeholder="Name"
                    v-model="controller.application.value.shareholdingInCompanyAtAppointment.nameOfSharesAsNominee"
                  />
                  <span
                    v-if="!controller.isDocumentEditable()"
                    v-html="controller.sharesRegisteredAsNominee()"
                  />
                </td>
                <td>
                  {{ controller.sharesHeldByCorporation() }}
                  <span v-html="controller.nameOfCorporation()" />
                </td>
              </tr>
              <tr>
                <td>
                  In related corporation
                  <br />
                  <i>(state the corporation's name)</i>
                </td>
                <td>
                  <input
                    type="text"
                    class="form-control in-resolution"
                    v-if="controller.isDocumentEditable()"
                    placeholder="No of Shares"
                    v-model="
                      controller.application.value.shareholdingInRelatedCompanyAtAppointment.noSharesAsBoUnderName
                    "
                  />
                  <span
                    v-if="!controller.isDocumentEditable()"
                    v-html="controller.sharesInRelatedCompanyAsBO()"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    class="form-control in-resolution"
                    v-if="controller.isDocumentEditable()"
                    placeholder="No. of Shares"
                    v-model="
                      controller.application.value.shareholdingInRelatedCompanyAtAppointment.noSharesAsBoUnderOthers
                    "
                  />
                  <input
                    type="text"
                    class="form-control in-resolution"
                    v-if="controller.isDocumentEditable()"
                    placeholder="Name"
                    v-model="
                      controller.application.value.shareholdingInRelatedCompanyAtAppointment.nameOfSharesAsBoUnderOthers
                    "
                  />
                  <span
                    v-if="!controller.isDocumentEditable()"
                    v-html="controller.sharesInRelatedCompanyAsBOOthers()"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    class="form-control in-resolution"
                    v-if="controller.isDocumentEditable()"
                    placeholder="No. of Shares"
                    v-model="controller.application.value.shareholdingInRelatedCompanyAtAppointment.noOfSharesAsNominee"
                  />
                  <input
                    type="text"
                    class="form-control in-resolution"
                    v-if="controller.isDocumentEditable()"
                    placeholder="Name"
                    v-model="
                      controller.application.value.shareholdingInRelatedCompanyAtAppointment.nameOfSharesAsNominee
                    "
                  />
                  <span
                    v-if="!controller.isDocumentEditable()"
                    v-html="controller.sharesInRelatedCompanyAsNominee()"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    class="form-control in-resolution"
                    v-if="controller.isDocumentEditable()"
                    placeholder="No. of Shares"
                    v-model="
                      controller.application.value.shareholdingInRelatedCompanyAtAppointment.noOfSharesByCorporation
                    "
                  />
                  <input
                    type="text"
                    class="form-control in-resolution"
                    v-if="controller.isDocumentEditable()"
                    placeholder="Name"
                    v-model="
                      controller.application.value.shareholdingInRelatedCompanyAtAppointment.nameOfSharesByCorporation
                    "
                  />
                  <span
                    v-if="!controller.isDocumentEditable()"
                    v-html="controller.sharesInRelatedCompanyHeldByCorporation()"
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div class="sub-header">(b)&nbsp;&nbsp;&nbsp;&nbsp;Particulars of changes</div>
          <div class="sub-header">(i)&nbsp;&nbsp;&nbsp;&nbsp;Further Acquisition</div>
          <table class="section-59-table small-columns">
            <tbody>
              <tr class="header-row">
                <td rowspan="3"></td>
                <td
                  class="span-6"
                  colspan="6"
                >
                  No. of shares, debentures, etc held
                </td>
              </tr>
              <tr class="header-row">
                <td></td>
                <td></td>
                <td
                  class="span-2"
                  colspan="2"
                >
                  As beneficial owner
                </td>
                <td></td>
                <td></td>
              </tr>
              <tr class="header-row">
                <td>Date of Transaction</td>
                <td>
                  Price or other consideration
                  <br />
                  (RM)
                </td>
                <td>Registered in your own name</td>
                <td>
                  Registered in other's name
                  <br />
                  <i>(State the name)</i>
                </td>
                <td>
                  As a nominee
                  <br />
                  <i>(State the beneficiary's name)</i>
                </td>
                <td>
                  Held by a corporation
                  <br />
                  <i>(State the corporation's name)</i>
                </td>
              </tr>
              <tr>
                <td>In the Company</td>
                <td>
                  <input
                    type="date"
                    class="form-control in-resolution"
                    v-if="controller.isDocumentEditable()"
                    placeholder="Date of Transaction"
                    v-model="controller.application.value.shareholdingInCompanyFurtherAcquired.dateOfTransaction"
                  />
                  <span
                    v-if="!controller.isDocumentEditable()"
                    v-html="controller.dateOfTransactionForSharesInCompanyFurtherAcquired()"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    class="form-control in-resolution"
                    v-if="controller.isDocumentEditable()"
                    placeholder="Price or Other Consideration"
                    v-model="
                      controller.application.value.shareholdingInCompanyFurtherAcquired.priceOrOtherConsideration
                    "
                  />
                  <span
                    v-if="!controller.isDocumentEditable()"
                    v-html="controller.priceOrOtherConsiderationForSharesInCompanyFurtherAcquired()"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    class="form-control in-resolution"
                    v-if="controller.isDocumentEditable()"
                    placeholder="No. of Shares"
                    v-model="controller.application.value.shareholdingInCompanyFurtherAcquired.noSharesAsBoUnderName"
                  />
                  <span
                    v-if="!controller.isDocumentEditable()"
                    v-html="controller.sharesInCompanyFurtherAcquiredAsBO()"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    class="form-control in-resolution"
                    v-if="controller.isDocumentEditable()"
                    placeholder="No. of Shares"
                    v-model="controller.application.value.shareholdingInCompanyFurtherAcquired.noSharesAsBoUnderOthers"
                  />
                  <input
                    type="text"
                    class="form-control in-resolution"
                    v-if="controller.isDocumentEditable()"
                    placeholder="Name"
                    v-model="
                      controller.application.value.shareholdingInCompanyFurtherAcquired.nameOfSharesAsBoUnderOthers
                    "
                  />
                  <span
                    v-if="!controller.isDocumentEditable()"
                    v-html="controller.sharesInCompanyFurtherAcquiredAsBOOthers()"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    class="form-control in-resolution"
                    v-if="controller.isDocumentEditable()"
                    placeholder="No. of Shares"
                    v-model="controller.application.value.shareholdingInCompanyFurtherAcquired.noOfSharesAsNominee"
                  />
                  <input
                    type="text"
                    class="form-control in-resolution"
                    v-if="controller.isDocumentEditable()"
                    placeholder="Name"
                    v-model="controller.application.value.shareholdingInCompanyFurtherAcquired.nameOfSharesAsNominee"
                  />
                  <span
                    v-if="!controller.isDocumentEditable()"
                    v-html="controller.sharesInCompanyFurtherAcquiredAsNominee()"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    class="form-control in-resolution"
                    v-if="controller.isDocumentEditable()"
                    placeholder="No. of Shares"
                    v-model="controller.application.value.shareholdingInCompanyFurtherAcquired.noOfSharesByCorporation"
                  />
                  <input
                    type="text"
                    class="form-control in-resolution"
                    v-if="controller.isDocumentEditable()"
                    placeholder="Name"
                    v-model="
                      controller.application.value.shareholdingInCompanyFurtherAcquired.nameOfSharesByCorporation
                    "
                  />
                  <span
                    v-if="!controller.isDocumentEditable()"
                    v-html="controller.sharesInCompanyFurtherAcquiredHeldByCorporation()"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  In related corporation
                  <br />
                  <i>(state the corporation's name)</i>
                </td>
                <td>
                  <input
                    type="date"
                    class="form-control in-resolution"
                    v-if="controller.isDocumentEditable()"
                    placeholder="Date of Transaction"
                    v-model="controller.application.value.shareholdingInRelatedCompanyFurtherAcquired.dateOfTransaction"
                  />
                  <span
                    v-if="!controller.isDocumentEditable()"
                    v-html="controller.dateOfTransactionForSharesInRelatedCompanyFurtherAcquired()"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    class="form-control in-resolution"
                    v-if="controller.isDocumentEditable()"
                    placeholder="Price or Other Consideration"
                    v-model="
                      controller.application.value.shareholdingInRelatedCompanyFurtherAcquired.priceOrOtherConsideration
                    "
                  />
                  <span
                    v-if="!controller.isDocumentEditable()"
                    v-html="controller.priceOrOtherConsiderationForSharesInRelatedCompanyFurtherAcquired()"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    class="form-control in-resolution"
                    v-if="controller.isDocumentEditable()"
                    placeholder="No. of Shares"
                    v-model="
                      controller.application.value.shareholdingInRelatedCompanyFurtherAcquired.noSharesAsBoUnderName
                    "
                  />
                  <span
                    v-if="!controller.isDocumentEditable()"
                    v-html="controller.sharesInRelatedCompanyFurtherAcquiredAsBO()"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    class="form-control in-resolution"
                    v-if="controller.isDocumentEditable()"
                    placeholder="No. of Shares"
                    v-model="
                      controller.application.value.shareholdingInRelatedCompanyFurtherAcquired.noSharesAsBoUnderOthers
                    "
                  />
                  <input
                    type="text"
                    class="form-control in-resolution"
                    v-if="controller.isDocumentEditable()"
                    placeholder="Name"
                    v-model="
                      controller.application.value.shareholdingInRelatedCompanyFurtherAcquired
                        .nameOfSharesAsBoUnderOthers
                    "
                  />
                  <span
                    v-if="!controller.isDocumentEditable()"
                    v-html="controller.sharesInRelatedCompanyFurtherAcquiredAsBOOthers()"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    class="form-control in-resolution"
                    v-if="controller.isDocumentEditable()"
                    placeholder="No. of Shares"
                    v-model="
                      controller.application.value.shareholdingInRelatedCompanyFurtherAcquired.noOfSharesAsNominee
                    "
                  />
                  <input
                    type="text"
                    class="form-control in-resolution"
                    v-if="controller.isDocumentEditable()"
                    placeholder="Name"
                    v-model="
                      controller.application.value.shareholdingInRelatedCompanyFurtherAcquired.nameOfSharesAsNominee
                    "
                  />
                  <span
                    v-if="!controller.isDocumentEditable()"
                    v-html="controller.sharesInRelatedCompanyFurtherAcquiredAsNominee()"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    class="form-control in-resolution"
                    v-if="controller.isDocumentEditable()"
                    placeholder="No. of Shares"
                    v-model="
                      controller.application.value.shareholdingInRelatedCompanyFurtherAcquired.noOfSharesByCorporation
                    "
                  />
                  <input
                    type="text"
                    class="form-control in-resolution"
                    v-if="controller.isDocumentEditable()"
                    placeholder="Name"
                    v-model="
                      controller.application.value.shareholdingInRelatedCompanyFurtherAcquired.nameOfSharesByCorporation
                    "
                  />
                  <span
                    v-if="!controller.isDocumentEditable()"
                    v-html="controller.sharesInRelatedCompanyFurtherAcquiredHeldByCorporation()"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div
      class="paper-wrapper"
      :class="controller.paperOrientation"
    >
      <div
        class="paper print legal-document"
        :class="controller.paperOrientation"
      >
        <div class="paper-page-number top">3</div>
        <div class="company-details">
          <div class="name">
            {{ controller.companyName() }}
          </div>
          <div class="registration-number">
            {{ controller.registrationNumber() }}
          </div>
        </div>
        <div class="section">
          <div class="sub-header">(ii)&nbsp;&nbsp;&nbsp;&nbsp;Disposal</div>
          <table class="section-59-table small-columns">
            <tbody>
              <tr class="header-row">
                <td rowspan="3"></td>
                <td
                  class="span-6"
                  colspan="6"
                >
                  No. of shares, debentures, etc held
                </td>
              </tr>
              <tr class="header-row">
                <td></td>
                <td></td>
                <td
                  class="span-2"
                  colspan="2"
                >
                  As beneficial owner
                </td>
                <td></td>
                <td></td>
              </tr>
              <tr class="header-row">
                <td>Date of Transaction</td>
                <td>
                  Price or other consideration
                  <br />
                  (RM)
                </td>
                <td>Registered in your own name</td>
                <td>
                  Registered in other's name
                  <br />
                  <i>(State the name)</i>
                </td>
                <td>
                  As a nominee
                  <br />
                  <i>(State the beneficiary's name)</i>
                </td>
                <td>
                  Held by a corporation
                  <br />
                  <i>(State the corporation's name)</i>
                </td>
              </tr>
              <tr>
                <td>In the Company</td>
                <td>
                  <input
                    type="date"
                    class="form-control in-resolution"
                    v-if="controller.isDocumentEditable()"
                    placeholder="Date of Transaction"
                    v-model="controller.application.value.shareholdingInCompanyDisposed.dateOfTransaction"
                  />
                  <span
                    v-if="!controller.isDocumentEditable()"
                    v-html="controller.dateOfTransactionForSharesInCompanyDisposed()"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    class="form-control in-resolution"
                    v-if="controller.isDocumentEditable()"
                    placeholder="Price or Other Consideration"
                    v-model="controller.application.value.shareholdingInCompanyDisposed.priceOrOtherConsideration"
                  />
                  <span
                    v-if="!controller.isDocumentEditable()"
                    v-html="controller.priceOrOtherConsiderationForSharesInCompanyDisposed()"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    class="form-control in-resolution"
                    v-if="controller.isDocumentEditable()"
                    placeholder="No. of Shares"
                    v-model="controller.application.value.shareholdingInCompanyDisposed.noSharesAsBoUnderName"
                  />
                  <span
                    v-if="!controller.isDocumentEditable()"
                    v-html="controller.sharesInCompanyDisposedAsBO()"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    class="form-control in-resolution"
                    v-if="controller.isDocumentEditable()"
                    placeholder="No. of Shares"
                    v-model="controller.application.value.shareholdingInCompanyDisposed.noSharesAsBoUnderOthers"
                  />
                  <input
                    type="text"
                    class="form-control in-resolution"
                    v-if="controller.isDocumentEditable()"
                    placeholder="Name"
                    v-model="controller.application.value.shareholdingInCompanyDisposed.nameOfSharesAsBoUnderOthers"
                  />
                  <span
                    v-if="!controller.isDocumentEditable()"
                    v-html="controller.sharesInCompanyDisposedAsBOOthers()"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    class="form-control in-resolution"
                    v-if="controller.isDocumentEditable()"
                    placeholder="No. of Shares"
                    v-model="controller.application.value.shareholdingInCompanyDisposed.noOfSharesAsNominee"
                  />
                  <input
                    type="text"
                    class="form-control in-resolution"
                    v-if="controller.isDocumentEditable()"
                    placeholder="Name"
                    v-model="controller.application.value.shareholdingInCompanyDisposed.nameOfSharesAsNominee"
                  />
                  <span
                    v-if="!controller.isDocumentEditable()"
                    v-html="controller.sharesInCompanyDisposedAsNominee()"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    class="form-control in-resolution"
                    v-if="controller.isDocumentEditable()"
                    placeholder="No. of Shares"
                    v-model="controller.application.value.shareholdingInCompanyDisposed.noOfSharesByCorporation"
                  />
                  <input
                    type="text"
                    class="form-control in-resolution"
                    v-if="controller.isDocumentEditable()"
                    placeholder="Name"
                    v-model="controller.application.value.shareholdingInCompanyDisposed.nameOfSharesByCorporation"
                  />
                  <span
                    v-if="!controller.isDocumentEditable()"
                    v-html="controller.sharesInCompanyDisposedHeldByCorporation()"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  In related corporation
                  <br />
                  <i>(state the corporation's name)</i>
                </td>
                <td>
                  <input
                    type="date"
                    class="form-control in-resolution"
                    v-if="controller.isDocumentEditable()"
                    placeholder="Date of Transaction"
                    v-model="controller.application.value.shareholdingInRelatedCompanyDisposed.dateOfTransaction"
                  />
                  <span
                    v-if="!controller.isDocumentEditable()"
                    v-html="controller.dateOfTransactionForSharesInRelatedCompanyDisposed()"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    class="form-control in-resolution"
                    v-if="controller.isDocumentEditable()"
                    placeholder="Price or Other Consideration"
                    v-model="
                      controller.application.value.shareholdingInRelatedCompanyDisposed.priceOrOtherConsideration
                    "
                  />
                  <span
                    v-if="!controller.isDocumentEditable()"
                    v-html="controller.priceOrOtherConsiderationForSharesInRelatedCompanyDisposed()"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    class="form-control in-resolution"
                    v-if="controller.isDocumentEditable()"
                    placeholder="No. of Shares"
                    v-model="controller.application.value.shareholdingInRelatedCompanyDisposed.noSharesAsBoUnderName"
                  />
                  <span
                    v-if="!controller.isDocumentEditable()"
                    v-html="controller.sharesInRelatedCompanyDisposedAsBO()"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    class="form-control in-resolution"
                    v-if="controller.isDocumentEditable()"
                    placeholder="No. of Shares"
                    v-model="controller.application.value.shareholdingInRelatedCompanyDisposed.noSharesAsBoUnderOthers"
                  />
                  <input
                    type="text"
                    class="form-control in-resolution"
                    v-if="controller.isDocumentEditable()"
                    placeholder="Name"
                    v-model="
                      controller.application.value.shareholdingInRelatedCompanyDisposed.nameOfSharesAsBoUnderOthers
                    "
                  />
                  <span
                    v-if="!controller.isDocumentEditable()"
                    v-html="controller.sharesInRelatedCompanyDisposedAsBOOthers()"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    class="form-control in-resolution"
                    v-if="controller.isDocumentEditable()"
                    placeholder="No. of Shares"
                    v-model="controller.application.value.shareholdingInRelatedCompanyDisposed.noOfSharesAsNominee"
                  />
                  <input
                    type="text"
                    class="form-control in-resolution"
                    v-if="controller.isDocumentEditable()"
                    placeholder="Name"
                    v-model="controller.application.value.shareholdingInRelatedCompanyDisposed.nameOfSharesAsNominee"
                  />
                  <span
                    v-if="!controller.isDocumentEditable()"
                    v-html="controller.sharesInRelatedCompanyDisposedAsNominee()"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    class="form-control in-resolution"
                    v-if="controller.isDocumentEditable()"
                    placeholder="No. of Shares"
                    v-model="controller.application.value.shareholdingInRelatedCompanyDisposed.noOfSharesByCorporation"
                  />
                  <input
                    type="text"
                    class="form-control in-resolution"
                    v-if="controller.isDocumentEditable()"
                    placeholder="Name"
                    v-model="
                      controller.application.value.shareholdingInRelatedCompanyDisposed.nameOfSharesByCorporation
                    "
                  />
                  <span
                    v-if="!controller.isDocumentEditable()"
                    v-html="controller.sharesInRelatedCompanyDisposedHeldByCorporation()"
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div class="header">
            C.&nbsp;&nbsp;&nbsp;&nbsp;DISCLOSURE OF INTERESTS IN CONTRACTS, PROPERTY, OFFICES, ETC (SECTION 221)
          </div>
          <div>
            Pursuant to Section 221 of the Companies Act, 2016, I hereby give general notice that I am an officer and/or
            member of the following corporations or firms and that I am to be regarded as interested in any contract
            which may, after the date of this notice, I made or proposed to be made with any of the following
            corporations or firms and I shall continue to abstain from all deliberations and voting in respect of such
            contract or any matter arising thereof :-
          </div>
          <table class="section-221-table">
            <tbody>
              <tr class="header-row">
                <td
                  rowspan="2"
                  class="text-left"
                >
                  Name of corporation/firm
                </td>
                <td colspan="2">Nature of interest</td>
              </tr>
              <tr class="header-row">
                <td>Office held</td>
                <td>Shares held</td>
              </tr>
              <tr
                v-for="(disclosure, index) in controller.application.value.disclosureOfInterests"
                :key="index"
              >
                <td>
                  <input
                    v-if="controller.isDocumentEditable()"
                    v-model="disclosure.nameOfCorporation"
                    type="text"
                    class="form-control in-resolution"
                  />
                  <span
                    v-if="controller.canRemoveDisclosure(index)"
                    class="action-link remove"
                    @click="controller.removeDisclosure()"
                  >
                    - Remove
                  </span>
                  <span v-if="!controller.isDocumentEditable()">
                    {{ disclosure.nameOfCorporation === "" ? "-" : disclosure.nameOfCorporation }}
                  </span>
                </td>
                <td>
                  <input
                    v-if="controller.isDocumentEditable()"
                    v-model="disclosure.officeHeld"
                    type="text"
                    class="form-control in-resolution"
                  />
                  <span v-if="!controller.isDocumentEditable()">
                    {{ disclosure.officeHeld === "" ? "-" : disclosure.officeHeld }}
                  </span>
                </td>
                <td>
                  <input
                    v-if="controller.isDocumentEditable()"
                    v-model="disclosure.noOfSharesHeld"
                    type="number"
                    class="form-control in-resolution"
                  />
                  <span v-if="!controller.isDocumentEditable()">
                    {{ disclosure.noOfSharesHeld === 0 ? "-" : disclosure.noOfSharesHeld }}
                  </span>
                </td>
              </tr>
              <tr v-if="controller.isDocumentEditable()">
                <td colspan="3">
                  <span
                    class="action-link"
                    @click="controller.addDisclosure()"
                  >
                    + Add
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div
      class="paper-wrapper"
      :class="controller.paperOrientation"
    >
      <div
        class="paper print legal-document"
        :class="controller.paperOrientation"
      >
        <div class="paper-page-number top">4</div>
        <div class="company-details">
          <div class="name">
            {{ controller.companyName() }}
          </div>
          <div class="registration-number">
            {{ controller.registrationNumber() }}
          </div>
        </div>
        <div class="section">
          <div>
            In accordance with Section 221 of the Companies Act, 2016, I hereby declare that, I hold the office as
            disclosed above and possess the property set out hereunder whereby whether directly or indirectly duties or
            interests might be created in conflict with my duties or interests as the director of the Company and I
            declare this act and the nature, character and extent of the conflict in accordance with the provisions of
            Section 221(4) to Section 221(7) of the Companies Act, 2016 :-
          </div>
          <table class="property-declaration-table">
            <tbody>
              <tr class="header-row">
                <td>No.</td>
                <td>Particulars of Property</td>
              </tr>
              <tr
                v-for="(property, index) in controller.application.value.propertiesPossessed"
                :key="index"
              >
                <td>
                  <span v-if="controller.isDocumentEditable()">{{ index + 1 }}.</span>
                  <span v-if="!controller.isDocumentEditable()">{{ property.number }}.</span>
                </td>
                <td>
                  <input
                    type="text"
                    v-if="controller.isDocumentEditable()"
                    v-model="property.particulars"
                    class="form-control in-resolution"
                  />
                  <span
                    v-if="controller.canRemoveProperties(index)"
                    class="action-link remove"
                    @click="controller.removeProperties()"
                  >
                    - Remove
                  </span>
                  <span v-if="!controller.isDocumentEditable()">
                    {{ property.particulars }}
                  </span>
                </td>
              </tr>
              <tr v-if="controller.isDocumentEditable()">
                <td colspan="2">
                  <span
                    class="action-link"
                    @click="controller.addProperties()"
                  >
                    + Add
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          <div>Date: {{ controller.dateOfAppointment() }}</div>
          <div class="signature-section">
            <Signature
              :signature-item="controller.signatureItem.value"
              @signed="emit('signed', $event)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import Signature from "../Signatures/Signature.vue"
  import { Section219and221Controller } from "~/scripts/components/legal-documents/Section219and221Controller"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
    directorId: {
      type: String,
      required: true,
    },
    applicationId: {
      type: String,
      default: null,
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

  const emit = defineEmits(["signed"])

  const documentRef = ref(null)

  const controller = new Section219and221Controller(props.companyId, props.directorId, props.applicationId)

  watch(
    documentRef,
    (newVal) => {
      controller.setDocumentRef(newVal)
    },
    { immediate: true }
  )

  watch(
    () => props.companyId,
    (newVal) => {
      controller.setCompanyId(newVal)
      controller.fetchShareholders()
    }
  )

  watch(
    () => props.directorId,
    (newVal) => {
      controller.setDirectorId(newVal)
    }
  )

  watch(
    () => props.applicationId,
    (newVal) => {
      controller.setApplicationId(newVal)
    }
  )

  watch(
    () => props.isInPreviewMode,
    (newVal) => {
      controller.setIsInPreviewMode(newVal)
    },
    { immediate: true }
  )

  defineExpose({
    getPdfElements: controller.getPdfElements.bind(controller),
    getApplicationData: controller.getApplicationData.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/LegalDocuments/Section219and221" as *;
</style>
