<template>
  <div id="legal-documents-section68">
    <Paper
      :paper-orientation="controller.paperOrientation"
      :additional-css-class="controller.additionalCssClass"
      :page-number="1"
      :total-pages="controller.totalPages"
    >
      <template #paperContent>
        <div class="company-no-header">Company No : {{ controller.registrationNumberNew() }}</div>
        <div class="document-title-section">
          <div class="document-title">COMPANIES ACT 2016</div>
          <div class="section-name">Section 68</div>
          <div class="document-name">AR1 - ANNUAL RETURN OF A COMPANY HAVING A SHARE CAPITAL</div>
        </div>
        <div class="section68-info">
          <table class="section68-table">
            <thead>
              <tr>
                <td colspan="2">FILING INFORMATION</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>New Company registration number</td>
                <td>{{ controller.registrationNumberNew() }}</td>
              </tr>
              <tr>
                <td>Company registration number</td>
                <td>{{ controller.registrationNumberOld() }}</td>
              </tr>
              <tr>
                <td>Name of company</td>
                <td>{{ controller.companyName() }}</td>
              </tr>
              <tr>
                <td>Former name of the company</td>
                <td></td>
              </tr>
              <tr>
                <td>Goods and service tax number</td>
                <td></td>
              </tr>
              <tr>
                <td>Calendar year of annual return</td>
                <td>{{ controller.annualReturnYear.value }}</td>
              </tr>
              <tr>
                <td>Date of annual return</td>
                <td>{{ controller.dateOfAnnualReturn() }}</td>
              </tr>
              <tr>
                <td>Origin of company</td>
                <td>INCORPORATED IN MALAYSIA</td>
              </tr>
              <tr>
                <td>Status of company</td>
                <td>PRIVATE COMPANY</td>
              </tr>
              <tr>
                <td>Type of company</td>
                <td>COMPANY LIMITED BY SHARES</td>
              </tr>
              <tr>
                <td>Application of submission</td>
                <td>ORDINARY FILING</td>
              </tr>
              <tr>
                <td>Statutory Declaration for rectification</td>
                <td></td>
              </tr>
              <tr>
                <td>Court Order reference number</td>
                <td></td>
              </tr>
              <tr>
                <td>Type of submission</td>
                <td>AR1 | ANNUAL RETURN OF A COMPANY HAVING SHARE CAPITAL</td>
              </tr>
              <tr>
                <td>Disclosure whether company if preparing annual return for first time since incorporation</td>
                <td>{{ controller.firstAnnualReturnDisclosure() }}</td>
              </tr>
              <tr>
                <td>Disclosure whether shares of company are quoted on stock exchange in Malaysia</td>
                <td></td>
              </tr>
              <tr>
                <td>Disclosure on number of members of company</td>
                <td>COMPANY WITH EQUAL TO OR LESS THAN FIVE HUNDRED MEMBERS</td>
              </tr>
              <tr>
                <td>Taxonomy version</td>
                <td>SSMXT_2022V1.0</td>
              </tr>
              <tr>
                <td>Name and version of software used to generate XBRL file</td>
                <td>MBRS_PREPARATION_TOOL V2.1</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </Paper>
    <Paper
      :paper-orientation="controller.paperOrientation"
      :additional-css-class="controller.additionalCssClass"
      :page-number="2"
      :total-pages="controller.totalPages"
    >
      <template #paperContent>
        <div class="company-no-header">Company No : {{ controller.registrationNumberNew() }}</div>
        <div class="section68-info">
          <table class="section68-table">
            <thead>
              <tr>
                <td colspan="2">SECTION A: PARTICULARS OF COMPANY</td>
              </tr>
              <tr>
                <td colspan="2">Address of registered office</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Address line 1</td>
                <td>{{ controller.registeredOfficeLine1() }}</td>
              </tr>
              <tr>
                <td>Address line 2</td>
                <td>{{ controller.registeredOfficeLine2() }}</td>
              </tr>
              <tr>
                <td>Address line 3</td>
                <td></td>
              </tr>
              <tr>
                <td>Postcode</td>
                <td>{{ controller.registeredOfficePostcode() }}</td>
              </tr>
              <tr>
                <td>Town</td>
                <td>{{ controller.registeredOfficeTown() }}</td>
              </tr>
              <tr>
                <td>State</td>
                <td>{{ controller.registeredOfficeState() }}</td>
              </tr>
              <tr>
                <td>Country</td>
                <td>{{ controller.registeredOfficeCountry() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="section68-info">
          <table class="section68-table">
            <thead>
              <tr>
                <td colspan="2">Address of register of members is kept</td>
              </tr>
              <tr>
                <td>No</td>
                <td>Address</td>
              </tr>
            </thead>
          </table>
        </div>
        <div class="section68-info">
          <table class="section68-table">
            <thead>
              <tr>
                <td colspan="2">Address of financial records are kept</td>
              </tr>
              <tr>
                <td>No</td>
                <td>Address</td>
              </tr>
            </thead>
          </table>
        </div>
        <div class="section68-info">
          <table class="section68-table">
            <thead>
              <tr>
                <td colspan="6">Address place of business</td>
              </tr>
              <tr>
                <td>No</td>
                <td>Address</td>
                <td>Telephone number</td>
                <td>Fax number</td>
                <td>Email</td>
                <td>Website</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>0001</td>
                <td>{{ controller.businessAddress() }}</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </Paper>
    <Paper
      :paper-orientation="controller.paperOrientation"
      :additional-css-class="controller.additionalCssClass"
      :page-number="3"
      :total-pages="controller.totalPages"
    >
      <template #paperContent>
        <div class="company-no-header">Company No : {{ controller.registrationNumberNew() }}</div>
        <div class="section68-info">
          <table class="section68-table">
            <thead>
              <tr>
                <td>Nature of business</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {{ controller.natureOfBusiness() }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="section68-info">
          <table class="section68-table">
            <thead>
              <tr>
                <td>No.</td>
                <td>MSIC Code</td>
                <td>Description of Business</td>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(msicCode, index) in controller.msicCodes()"
                :key="index"
              >
                <td>{{ index + 1 }}</td>
                <td>{{ msicCode.code }}</td>
                <td>{{ msicCode.descriptionEn.toUpperCase() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </Paper>
    <Paper
      :paper-orientation="controller.paperOrientation"
      :additional-css-class="controller.additionalCssClass"
      :page-number="4"
      :total-pages="controller.totalPages"
    >
      <template #paperContent>
        <div class="company-no-header">Company No : {{ controller.registrationNumberNew() }}</div>
        <div class="section68-info">
          <table class="section68-table">
            <thead>
              <tr>
                <td colspan="6">Brances and places of business</td>
              </tr>
              <tr>
                <td>No</td>
                <td>Address</td>
                <td>Telephone number</td>
                <td>Fax number</td>
                <td>Email</td>
                <td>Website</td>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(branchAddress, index) in controller.branchAddresses()"
                :key="index"
              >
                <td>{{ index + 1 }}</td>
                <td>{{ branchAddress }}</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </Paper>
    <Paper
      :paper-orientation="controller.paperOrientation"
      :additional-css-class="controller.additionalCssClass"
      :page-number="5"
      :total-pages="controller.totalPages"
    >
      <template #paperContent>
        <div class="company-no-header">Company No : {{ controller.registrationNumberNew() }}</div>
        <div class="section68-info">
          <table class="section68-table">
            <thead>
              <tr>
                <td colspan="2">SECTION B: PARTICULARS OF SHAREHOLDING STRUCTURE</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Type of currency of amount of shares</td>
                <td class="text-right">MYR</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="section68-info">
          <table class="section68-table">
            <thead>
              <tr>
                <td colspan="5">Summary of shareholding structure</td>
              </tr>
              <tr>
                <td>Types of shares</td>
                <td>Ordinary shares</td>
                <td>Preference shares</td>
                <td>Other kinds of shares</td>
                <td>Total shares</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Number of shares subject to payments wholly in cash</td>
                <td class="text-right">{{ controller.ordinaryShares() }}</td>
                <td class="text-right">{{ controller.preferenceShares() }}</td>
                <td class="text-right">0</td>
                <td class="text-right">{{ controller.totalShares() }}</td>
              </tr>
              <tr>
                <td>Number of shares subject to payments otherwise than cash</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
              </tr>
              <tr class="columns-bold">
                <td>Total number of shares issued</td>
                <td class="text-right">{{ controller.ordinaryShares() }}</td>
                <td class="text-right">{{ controller.preferenceShares() }}</td>
                <td class="text-right">0</td>
                <td class="text-right">{{ controller.totalShares() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="section68-info">
          <table class="section68-table">
            <thead>
              <tr>
                <td colspan="5">Other details on share capital</td>
              </tr>
              <tr>
                <td>Types of shares</td>
                <td>Ordinary shares</td>
                <td>Preference shares</td>
                <td>Other kinds of shares</td>
                <td>Total shares</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Total number of shares forfeited</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
              </tr>
              <tr class="columns-bold">
                <td>Total number of shares forfeited</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="section68-info">
          <table class="section68-table">
            <thead>
              <tr>
                <td colspan="5">Details of amount of share capital</td>
              </tr>
              <tr>
                <td>Amount of Share Capital</td>
                <td>Ordinary shares</td>
                <td>Preference shares</td>
                <td>Other kinds of shares</td>
                <td>Total shares</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Total amount of shares issued as fully paid</td>
                <td class="text-right">{{ controller.ordinaryShares() }}</td>
                <td class="text-right">{{ controller.preferenceShares() }}</td>
                <td class="text-right">0</td>
                <td class="text-right">{{ controller.totalShares() }}</td>
              </tr>
              <tr>
                <td>Total amount of shares issued as partly unpaid</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
              </tr>
              <tr class="columns-bold">
                <td>Total amount of issued share capital</td>
                <td class="text-right">{{ controller.ordinaryShares() }}</td>
                <td class="text-right">{{ controller.preferenceShares() }}</td>
                <td class="text-right">0</td>
                <td class="text-right">{{ controller.totalShares() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </Paper>
    <Paper
      :paper-orientation="controller.paperOrientation"
      :additional-css-class="controller.additionalCssClass"
      :page-number="6"
      :total-pages="controller.totalPages"
    >
      <template #paperContent>
        <div class="company-no-header">Company No : {{ controller.registrationNumberNew() }}</div>
        <div class="section68-info">
          <table class="section68-table">
            <thead>
              <tr>
                <td colspan="5">Other details of amount of share capital</td>
              </tr>
              <tr>
                <td>Types of shares</td>
                <td>Ordinary shares</td>
                <td>Preference shares</td>
                <td>Other kinds of shares</td>
                <td>Total shares</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Total amount of shares has been called up</td>
                <td class="text-right">{{ controller.ordinaryShares() }}</td>
                <td class="text-right">{{ controller.preferenceShares() }}</td>
                <td class="text-right">0</td>
                <td class="text-right">{{ controller.totalShares() }}</td>
              </tr>
              <tr>
                <td>Total amount of calls received including payment on application and allotment</td>
                <td class="text-right">{{ controller.ordinaryShares() }}</td>
                <td class="text-right">{{ controller.preferenceShares() }}</td>
                <td class="text-right">0</td>
                <td class="text-right">{{ controller.totalShares() }}</td>
              </tr>
              <tr>
                <td>
                  Total amount, if any, agreed to be considered as paid on shares which have been issued as fully paid
                  up otherwise than in cash
                </td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
              </tr>
              <tr>
                <td>
                  Total amount, if any, agreed to be considered as paid on shares which have been issued as partly paid
                  up otherwise than in cash
                </td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
              </tr>
              <tr>
                <td>Total amount of calls unpaid</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
              </tr>
              <tr>
                <td>Total amount paid, if any, on shares forfeited</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
                <td class="text-right">0</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="section68-info">
          <table class="section68-table">
            <thead>
              <tr>
                <td colspan="2">Disclosure of shares or debentures</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  Total amount of sums, if any, paid by way of commission in respect of any shares or debentures since
                  the date of last return
                </td>
                <td></td>
              </tr>
              <tr>
                <td>
                  Total amount of sums, if any, allowed by way of discount in respect of any debentures since the date
                  of last return
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="section68-info">
          <table class="section68-table">
            <thead>
              <tr>
                <td colspan="2">Explanatory on shares and debentures</td>
              </tr>
              <tr>
                <td colspan="2">Explanatory notes on shares, if any</td>
              </tr>
            </thead>
          </table>
        </div>
        <div class="section68-info">
          <table class="section68-table">
            <thead>
              <tr>
                <td colspan="2">Explanatory notes on shares, if any</td>
              </tr>
            </thead>
          </table>
        </div>
      </template>
    </Paper>
    <Paper
      :paper-orientation="controller.paperOrientation"
      :additional-css-class="controller.additionalCssClass"
      :page-number="7"
      :total-pages="controller.totalPages"
    >
      <template #paperContent>
        <div class="company-no-header">Company No : {{ controller.registrationNumberNew() }}</div>
        <div class="section68-info">
          <table class="section68-table">
            <thead>
              <tr>
                <td colspan="5">SECTION C: PARTICULARS OF INDEBTEDNESS</td>
              </tr>
              <tr>
                <td colspan="5">
                  The particulars of indebtedness of the company in respect of all charges which are required to be
                  registered with the Registrar of Companies
                </td>
              </tr>
              <tr>
                <td>No.</td>
                <td>Registered No.</td>
                <td>Total Amount of the indebtedness in MYR (Including MYR and Other currencies)</td>
                <td>Amount of indebtedness in MYR</td>
                <td>Equivalent amount of the indebtedness of foreign currency in MYR</td>
              </tr>
            </thead>
            <tbody>
              <tr class="columns-bold">
                <td>Total</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="section68-info">
          <table class="section68-table">
            <thead>
              <tr>
                <td>No.</td>
                <td>Registered No.</td>
                <td>Currency</td>
                <td>Amount of indebtedness in MYR</td>
                <td>Equivalent amount of the indebtedness of foreign currency in MYR</td>
              </tr>
            </thead>
          </table>
        </div>
        <div class="section68-info">
          <table class="section68-table">
            <thead>
              <tr>
                <td>No.</td>
                <td>Registered No.</td>
                <td>Date of registration</td>
                <td>Nature of charge</td>
                <td>Name of charges</td>
              </tr>
            </thead>
          </table>
        </div>
        <div class="section68-info">
          <table class="section68-table">
            <thead>
              <tr>
                <td>Explanatory notes on indebtedness</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </Paper>
    <Paper
      :paper-orientation="PaperOrientation.Landscape"
      :additional-css-class="`${controller.additionalCssClass} directors-details`"
      :page-number="8"
      :total-pages="controller.totalPages"
    >
      <template #paperContent>
        <div class="company-no-header">Company No : {{ controller.registrationNumberNew() }}</div>
        <div class="section68-info">
          <table class="section68-table">
            <thead>
              <tr>
                <td colspan="12">SECTION D: PARTICULARS OF DIRECTORS, MANAGERS, SECRETARIES AND AUDITORS</td>
              </tr>
              <tr>
                <td colspan="12">Particulars of Directors</td>
              </tr>
              <tr>
                <td>No.</td>
                <td>Title/Name</td>
                <td>Designation/ Alternate to (if any)</td>
                <td>Type/ Identification number</td>
                <td>Passport expiry date</td>
                <td>Nationality /Race</td>
                <td>Gender</td>
                <td>Date of Birth</td>
                <td>Residential Address</td>
                <td>Service address/ email</td>
                <td>Business occupation</td>
                <td>Other directorship details</td>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(directorUser, index) in controller.directorUsers.value"
                :key="index"
              >
                <td>{{ index + 1 }}</td>
                <td>{{ directorUser.name.toUpperCase() }}</td>
                <td>Director</td>
                <td>
                  <span v-html="controller.userIdentification(directorUser)" />
                </td>
                <td></td>
                <td><span v-html="controller.userNationality(directorUser)" /></td>
                <td><span v-html="controller.userGender(directorUser)" /></td>
                <td><span v-html="controller.userDateOfBirth(directorUser)" /></td>
                <td><span v-html="controller.userAddress(directorUser)" /></td>
                <td>{{ directorUser.email }}</td>
                <td>COMPANY DIRECTOR</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </Paper>
    <Paper
      :paper-orientation="PaperOrientation.Landscape"
      :additional-css-class="`${controller.additionalCssClass} directors-details`"
      :page-number="9"
      :total-pages="controller.totalPages"
    >
      <template #paperContent>
        <div class="company-no-header">Company No : {{ controller.registrationNumberNew() }}</div>
        <div class="section68-info">
          <table class="section68-table">
            <thead>
              <tr>
                <td colspan="12">Particulars of Managers</td>
              </tr>
              <tr>
                <td>No.</td>
                <td>Title/Name</td>
                <td>Designation/ Alternate to (if any)</td>
                <td>Type/ Identification number</td>
                <td>Passport expiry date</td>
                <td>Nationality /Race</td>
                <td>Gender</td>
                <td>Date of Birth</td>
                <td>Residential Address</td>
                <td>Service address/ email</td>
                <td>Business occupation</td>
                <td>Other directorship details</td>
              </tr>
            </thead>
          </table>
        </div>
        <div class="section68-info">
          <table class="section68-table">
            <thead>
              <tr>
                <td colspan="11">Particulars of Secretaries</td>
              </tr>
              <tr>
                <td>No.</td>
                <td>Title/Name</td>
                <td>Type/ Identification number</td>
                <td>Passport expiry date</td>
                <td>Nationality /Race</td>
                <td>Gender</td>
                <td>Date of Birth</td>
                <td>Residential Address</td>
                <td>Service address/ email</td>
                <td>Business occupation</td>
                <td>Other directorship details</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>0001</td>
                <td>ICOMPANY</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="section68-info">
          <table class="section68-table">
            <thead>
              <tr>
                <td colspan="4">Particulars of Auditors</td>
              </tr>
              <tr>
                <td>No.</td>
                <td>Audit Firm Number</td>
                <td>Name of audit firm</td>
                <td>Address of audit firm</td>
              </tr>
            </thead>
          </table>
        </div>
      </template>
    </Paper>
    <Paper
      :paper-orientation="PaperOrientation.Landscape"
      :additional-css-class="`${controller.additionalCssClass} shareholders-details`"
      :page-number="10"
      :total-pages="controller.totalPages"
    >
      <template #paperContent>
        <div class="company-no-header">Company No : {{ controller.registrationNumberNew() }}</div>
        <div class="section68-info">
          <table class="section68-table">
            <thead>
              <tr>
                <td colspan="12">
                  SECTION D: PARTICULARS OF MEMBERS,FOR COMPANY WITH EQUAL TO OR LESS THAN FIVE HUNDRED MEMBERS
                </td>
              </tr>
              <tr>
                <td>Particulars of members</td>
                <td>Reference number</td>
                <td>Type of member/ Type of trustee</td>
                <td>Title/ Name</td>
                <td>Type/ Identification number</td>
                <td>Passport expiry date</td>
                <td>Nationality/ Place of incorporation or origin/ Race</td>
                <td>Gender</td>
                <td>Date of birth</td>
                <td>Address</td>
                <td>Number of shares held by members /Types of shares</td>
                <td>Analysis of shareholdings</td>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(shareholder, index) in controller.shareholders.value"
                :key="index"
              >
                <td>{{ index + 1 }}</td>
                <td>{{ index + 1 }}</td>
                <td>{{ controller.typeOfShareholder(shareholder) }}</td>
                <td>{{ shareholder.fullName() }}</td>
                <td>
                  <span v-html="controller.shareholderIdentification(shareholder)" />
                </td>
                <td></td>
                <td><span v-html="controller.shareholderNationality(shareholder)" /></td>
                <td><span v-html="controller.shareholderGender(shareholder)" /></td>
                <td><span v-html="controller.shareholderDateOfBirth(shareholder)" /></td>
                <td><span v-html="controller.shareholderAddress(shareholder)" /></td>
                <td>{{ shareholder.ordinaryShares }} ORDINARY SHARES</td>
                <td></td>
              </tr>
              <tr class="columns-bold">
                <td colspan="10">TOTAL NUMBER OF SHARES</td>
                <td colspan="2">
                  {{ controller.totalShares() }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="section68-info">
          <table class="section68-table">
            <thead>
              <tr>
                <td>Sub-classification of member count</td>
                <td>Reference number</td>
                <td>Type of member</td>
                <td>Title/ Name</td>
                <td>Type/ Identification number</td>
                <td>Passport expiry date</td>
                <td>Nationality/ Place of incorporation or origin/ Race</td>
                <td>Gender</td>
                <td>Date of birth</td>
                <td>Address</td>
              </tr>
            </thead>
          </table>
        </div>
      </template>
    </Paper>
    <Paper
      :paper-orientation="controller.paperOrientation"
      :additional-css-class="controller.additionalCssClass"
      :page-number="11"
      :total-pages="controller.totalPages"
    >
      <template #paperContent>
        <div class="company-no-header">Company No : {{ controller.registrationNumberNew() }}</div>
        <div class="section68-info">
          <table class="section68-table">
            <thead>
              <tr>
                <td colspan="3">SECTION F: PARTICULARS OF SHAREHOLDING ANALYSIS</td>
              </tr>
              <tr>
                <td>Particulars of shareholding analysis</td>
                <td>Number of shares held by member</td>
                <td>Percentage of shareholder held by member(%)</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Citizens who are Malays and natives</td>
                <td class="text-right">{{ controller.sharesHeldByMalays() }}</td>
                <td class="text-right"></td>
              </tr>
              <tr>
                <td>Citizens who are non-Malays and non-natives</td>
                <td class="text-right">{{ controller.sharesHeldByNonMalays() }}</td>
                <td class="text-right"></td>
              </tr>
              <tr>
                <td>Non-citizens</td>
                <td class="text-right"></td>
                <td class="text-right"></td>
              </tr>
              <tr>
                <td>Bodies corporate controlled by citizens who are Malays and natives</td>
                <td class="text-right"></td>
                <td class="text-right"></td>
              </tr>
              <tr>
                <td>Bodies corporate controlled by citizens who are non-Malays and non-natives</td>
                <td class="text-right"></td>
                <td class="text-right"></td>
              </tr>
              <tr>
                <td>Bodies corporate controlled by non-citizens</td>
                <td class="text-right"></td>
                <td class="text-right"></td>
              </tr>
              <tr class="columns-bold">
                <td>Total number of shares held by members</td>
                <td class="text-right">{{ controller.totalShares() }}</td>
                <td class="text-right">100.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </Paper>
    <Paper
      :paper-orientation="controller.paperOrientation"
      :additional-css-class="controller.additionalCssClass"
      :page-number="12"
      :total-pages="controller.totalPages"
    >
      <template #paperContent>
        <div class="company-no-header">Company No : {{ controller.registrationNumberNew() }}</div>
        <div class="section68-info">
          <table class="section68-table">
            <thead>
              <tr>
                <td colspan="2">SECTION G: CERTIFICATE TO BE GIVEN BY ALL COMPANIES</td>
              </tr>
              <tr>
                <td colspan="2">
                  Particulars of certificate by director and/or secretary after having made due inquiries certify
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  (a) that the provisions of the Unclaimed Moneys Act 1965, YES relating to the unclaimed moneys have
                  been complied with in relation to the company;
                </td>
                <td>YES</td>
              </tr>
              <tr>
                <td>
                  (b) having made an inspection of the share register, that NO transfers have been registered since date
                  of the last annual return;
                </td>
                <td>NO</td>
              </tr>
              <tr>
                <td>
                  (c) that the company has not since the date of the last annual return issued any invitation to the
                  public to subscribe for any shares in or debentures of the company or to deposit moneys for fixed
                  periods or payable at call;
                </td>
                <td>YES</td>
              </tr>
              <tr>
                <td>
                  (d) that the excess of members of the company above fifty (counting joint holders of shares as one
                  person) consists only of persons who are in the employment of the company or of its subsidiary or
                  persons who while previously in the employment of the company or of its subsidiary were and thereafter
                  have continued to be members of the company;
                </td>
                <td>NO</td>
              </tr>
              <tr>
                <td>
                  (e) that the company is a public company which has more than five hundred members and the company
                  provides reasonable opportunities and facilities for a person to inspect and take copies of its list
                  of members and its particulars of shares transferred;
                </td>
                <td>NO</td>
              </tr>
              <tr>
                <td>(f) that the status relating to the beneficial owner(s) of the company is as follows:</td>
                <td>COMPANY HAS BENEFICIAL OWNER(S)</td>
              </tr>
              <tr class="columns-bold">
                <td>(g) Category of Company Exempted from beneficial owner reporting</td>
                <td>NOT APPLICABLE</td>
              </tr>
              <tr class="columns-bold">
                <td>(h) The company has the following status relating to its director</td>
                <td>NONE OF THE DIRECTOR(S) OF THE COMPANY IS A NOMINEE DIRECTOR</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </Paper>
    <Paper
      :paper-orientation="controller.paperOrientation"
      :additional-css-class="controller.additionalCssClass"
      :page-number="13"
      :total-pages="controller.totalPages"
    >
      <template #paperContent>
        <div class="company-no-header">Company No : {{ controller.registrationNumberNew() }}</div>
        <div class="section68-info">
          <table class="section68-table">
            <thead>
              <tr>
                <td colspan="2">DECLARATION</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colspan="2">
                  I CONFIRM THAT THE FACTS AND INFORMATION STATED IN THIS DOCUMENT ARE TRUE AND TO THE BEST OF MY
                  KNOWLEDGE.
                </td>
              </tr>
              <tr>
                <td>Name</td>
                <td></td>
              </tr>
              <tr>
                <td>Submission Date</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="section68-info">
          <table class="section68-table">
            <thead>
              <tr>
                <td colspan="2">LODGER INFORMATION</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Name</td>
                <td></td>
              </tr>
              <tr>
                <td>Lodgement Reference No.</td>
                <td></td>
              </tr>
              <tr>
                <td>Date of Lodgement</td>
                <td></td>
              </tr>
              <tr>
                <td>Time of Lodgement</td>
                <td></td>
              </tr>
              <tr>
                <td>Digitally signed by</td>
                <td></td>
              </tr>
              <tr>
                <td>Signed on</td>
                <td></td>
              </tr>
              <tr>
                <td>Identification No</td>
                <td></td>
              </tr>
              <tr>
                <td>Type of Identification</td>
                <td></td>
              </tr>
              <tr>
                <td>Practicing Certificate Number</td>
                <td></td>
              </tr>
              <tr>
                <td>Address</td>
                <td></td>
              </tr>
              <tr>
                <td>Phone No</td>
                <td></td>
              </tr>
              <tr>
                <td>Email</td>
                <td>connect@icompany.my</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </Paper>
  </div>
</template>

<script setup lang="ts">
  import { PaperOrientation } from "~/scripts/constants/Paper"
  import Paper from "../Papers/Paper.vue"
  import { Section68Controller } from "~/scripts/components/legal-documents/Section68Controller"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
    annualReturnYear: {
      type: String,
      required: true,
    },
  })

  const emit = defineEmits([])

  const controller = new Section68Controller(props.companyId, props.annualReturnYear, emit)

  watch(
    () => props.companyId,
    (newVal) => {
      controller.setCompanyId(newVal)
      controller.setData()
    }
  )

  watch(
    () => props.annualReturnYear,
    (newVal) => {
      controller.setAnnualReturnYear(newVal)
    }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/LegalDocuments/Section68" as *;
</style>
