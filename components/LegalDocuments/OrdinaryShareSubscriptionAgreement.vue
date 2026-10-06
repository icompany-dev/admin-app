<template>
  <div
    id="legal-documents-ordinary-share-subscription-agreement"
    ref="docuemntRef"
  >
    <div
      class="loader-container"
      v-if="controller.isLoading"
    >
      <Paper
        :additional-css-class="controller.additionalCssClass"
        :paper-orientation="controller.paperOrientation"
        :is-loader="true"
      >
        <template #paperContent>
          <LoaderPrepare
            :label="controller.loaderLabel"
            :sublabel="controller.loaderSublabel"
          />
        </template>
      </Paper>
    </div>
    <template v-if="!controller.isLoading">
      <Paper
        :additional-css-class="controller.additionalCssClass"
        :paper-orientation="controller.paperOrientation"
        :show-page-number="false"
      >
        <template #paperContent>
          <div class="cover-page">
            <div class="top-part">
              <div class="top-part-item">BETWEEN</div>
              <div class="top-part-item">
                <b>
                  THE PARTY OR PARTIES MORE PARTICULARLY DESCRIBED OF SCHEDULE 2
                  <br />
                  ("{{ controller.subscribersLabel }}")
                </b>
              </div>
              <div class="top-part-item"><b>AND</b></div>
              <div class="top-part-item">
                <b>{{ controller.companyName() }}</b>
                <br />
                [{{ controller.registrationNumberNew() }} ({{ controller.registrationNumberOld() }})]
                <br />
                <b>("Company")</b>
              </div>
            </div>
            <div class="bottom-part">
              <div class="document-title">SHARE SUBSCRIPTION AGREEMENT</div>
              <div class="document-subtitle">
                for the Allotment and Issuance of Shares subject to
                <br />
                Outstanding Subscription Consideration
              </div>
            </div>
          </div>
        </template>
      </Paper>
      <Paper
        :additional-css-class="controller.additionalCssClass"
        :paper-orientation="controller.paperOrientation"
        :show-page-number="true"
        :page-number="2"
        :total-pages="controller.totalPages"
      >
        <template #paperContent>
          <p>
            <b>THIS SUBSCRIPTION AGREEMENT</b>
            is made on
            <input
              type="date"
              class="form-control in-resolution"
              v-model="controller.dateOfAgreement.value"
            />
          </p>
          <p>
            <b>BETWEEN</b>
          </p>
          <p>
            <b>THE PARTY OR PARTIES MORE PARTICULARLY DESCRIBED IN SCHEDULE 2 ("{{ controller.subscribersLabel }}")</b>
            , of the first part;
          </p>
          <p>
            <b>AND</b>
          </p>
          <p>
            <b>
              {{ controller.companyName() }} [Company No: {{ controller.registrationNumberNew() }} ({{
                controller.registrationNumberOld()
              }})]
            </b>
            a company incorporated in Malaysia, having its business address at {{ controller.companyAddress() }} ("
            <b>Company</b>
            " or "
            <b>Issuer</b>
            ") of the final part.
          </p>
          <p>
            (collectively referred to as
            <b>"Parties"</b>
            or each a "
            <b>Party</b>
            ").
          </p>
          <p>
            <b>WHEREAS:</b>
          </p>
          <ol class="upper-alpha">
            <li>
              Subject to the fulfilment of the Conditions Precedent and Conditions Subsequent (where applicable) as set
              out in
              <b>Schedule 1</b>
              of this Agreement, the Company has agreed to allot and issue, and the {{ controller.subscribersLabel }}
              {{ controller.subscriberHasLabel }}
              agreed to subscribe for the Subscription Shares at the Subscription Price.
            </li>
            <li>
              The Parties further acknowledge that the allotment and issuance of the Subscription Shares are intended to
              support the funding, capitalisation, operational requirements, investment arrangements, or financial
              position of the Company.
            </li>
            <li>
              The Parties acknowledge that the Subscription Shares may be issued on a fully paid or partially paid basis
              subject to the terms stated in this Agreement and
              <b>Schedule 1</b>
              .
            </li>
            <li>
              The Parties further acknowledge that this Agreement records and formalises the contractual obligations
              relating to the subscription, payment, and allotment of the Subscription Shares.
            </li>
          </ol>
          <p>
            <b>NOW THEREFORE IN CONSIDERATION HEREOF, EACH PARTY HEREBY AGREES:</b>
          </p>
          <ol class="pointer-decimal">
            <li>
              SUBSCRIPTION CONSIDERATION
              <ol class="sub-pointer-decimal">
                <li>
                  The aggregate Subscription Consideration shall be in the manner and as calculated in accordance with
                  <b>Schedule 1</b>
                  .
                </li>
                <li>
                  The Subscriber acknowledges and agrees that the Subscription Shares are issued on the basis of an
                  outstanding Subscription Consideration.
                </li>
                <li>
                  The Subscriber irrevocably undertake and guarantee that the outstanding Subscription Consideration
                  shall remain a continuing contractual obligation and debt due and owing by the Subscriber to the
                  Company unless otherwise waived or discharged by the Company in writing.
                </li>
                <li>
                  The Subscriber shall hereby undertake and guarantee to pay or cause to pay the outstanding
                  Subscription Consideration owed to the Company on or before the payment date stipulated in
                  <b>Schedule 1</b>
                  or upon any lawful call made by the Directors of the Company via a Board Resolution in the form and
                  manner as may be agreed and determined by the Directors.
                </li>
                <li>
                  The allotment or issuance of the Subscription Shares shall not by itself constitute evidence that the
                  Subscription Consideration has been fully paid.
                </li>
              </ol>
            </li>
          </ol>
        </template>
      </Paper>
      <Paper
        :additional-css-class="controller.additionalCssClass"
        :paper-orientation="controller.paperOrientation"
        :show-page-number="true"
        :page-number="3"
        :total-pages="controller.totalPages"
      >
        <template #paperContent>
          <ol
            class="pointer-decimal"
            start="2"
            style="--start: 2"
          >
            <li>
              COMPLETION DATE AND PAYMENT
              <ol class="sub-pointer-decimal">
                <li>
                  The Completion Date shall be such date as agreed by the Parties following receipt (or deemed receipt)
                  by the Company of the aggregate Subscription Consideration or such portion thereof as agreed as
                  provided in
                  <b>Schedule 1</b>
                  .
                </li>
                <li>
                  On or as soon as practicable after the Completion Date or at such a period that is deemed to be in the
                  best interest of the Company, the Directors of the Company shall:
                  <ol class="lower-alpha-bracket">
                    <li>update the Register of Members;</li>
                    <li>issue Share Certificate(s), where applicable; and</li>
                    <li>lodge the necessary statutory filings in accordance with the Act.</li>
                  </ol>
                </li>
                <li>
                  In the event the Subscriber fails, neglects, or refuses to pay the outstanding Subscription
                  Consideration within the stipulated timeline or upon any lawful call or written demand made by the
                  Company, the Company shall be entitled, subject to the Companies Act 2016,{{
                    controller.hasConstitution ? " the Constitution of the Company," : ""
                  }}
                  and any applicable resolutions of the Company, to exercise one or more of the following rights:
                  <ol class="lower-alpha-bracket">
                    <li>
                      recover the outstanding Subscription Consideration as a debt due and owing to the Company; or
                    </li>
                    <li>
                      suspend, restrict, or limit any rights, entitlements, benefits, distributions, voting rights, or
                      privileges attaching to the Subscription Shares until full payment is received; or
                    </li>
                    <li>
                      enter into any settlement, restructuring, extension of time, deferred payment, or compromise
                      arrangement with the Subscriber; or
                    </li>
                    <li>
                      waive, reduce, compromise, capitalise, restructure, or otherwise deal with the outstanding
                      Subscription Consideration pursuant to approval of the Directors and subject to the applicable
                      accounting treatment, corporate approvals, and governing laws; and/or
                    </li>
                    <li>
                      take such other lawful action, remedy, or enforcement measure as the Company deems necessary or
                      expedient in the circumstances.
                    </li>
                  </ol>
                </li>
              </ol>
            </li>
            <li>
              RIGHTS ATTACHING TO THE SUBSCRIPTION SHARES
              <ol class="sub-pointer-decimal">
                <li>
                  The rights, preferences, restrictions, obligations, and conditions attaching to the Subscription
                  Shares shall be exclusively as set out in
                  <b>Schedule 1</b>
                  .
                </li>
                <li>
                  Unless otherwise restricted by applicable law,
                  {{ controller.hasConstitution ? "the Constitution of the Company," : "" }} or the terms of this
                  Agreement, the Subscription Shares shall rank pari passu with the existing shares of the same class
                  notwithstanding that the shares may remain unpaid or partially paid.
                </li>
                <li>
                  In the event of any inconsistency between this Agreement and Schedule 1, Schedule 1 shall prevail in
                  respect of matters relating to the Subscription Shares.
                </li>
              </ol>
            </li>
            <li>
              WARRANTIES AND UNDERTAKINGS
              <ol class="sub-pointer-decimal">
                <li>
                  The Company warrants and undertakes that:
                  <ol class="lower-alpha-bracket">
                    <li>the Company is duly incorporated and validly existing under the laws of Malaysia;</li>
                    <li>the Company has full power and authority to enter into and perform this Agreement;</li>
                  </ol>
                </li>
              </ol>
            </li>
          </ol>
        </template>
      </Paper>
      <Paper
        :additional-css-class="controller.additionalCssClass"
        :paper-orientation="controller.paperOrientation"
        :show-page-number="true"
        :page-number="4"
        :total-pages="controller.totalPages"
      >
        <template #paperContent>
          <ol
            class="pointer-decimal"
            start="4"
          >
            <li class="no-number">
              <ol class="sub-pointer-decimal">
                <li class="no-number">
                  <ol
                    class="lower-alpha-bracket"
                    start="3"
                  >
                    <li>
                      all necessary corporate approvals relating to the issuance of the Subscription Shares have been or
                      will be duly obtained;
                    </li>
                    <li>
                      no winding-up, judicial management, liquidation or similar proceedings have been commenced against
                      the Company which has not been disclosed to the Subscriber;
                    </li>
                    <li>
                      all information provided by the Company relating to the Subscription Shares is not knowingly false
                      or misleading in any material respect.
                    </li>
                  </ol>
                </li>
                <li>
                  The Subscriber warrants and undertakes that:
                  <ol class="lower-alpha-bracket">
                    <li>the Subscriber has full legal capacity and authority to enter into this Agreement;</li>
                    <li>
                      the Subscriber is subscribing for the Subscription Shares on its own behalf unless otherwise
                      disclosed;
                    </li>
                    <li>the source of funds or consideration for the subscription is lawful;</li>
                    <li>
                      the Subscriber understands the obligations relating to unpaid or partially paid shares where
                      applicable; and
                    </li>
                    <li>
                      all information and documents provided by the Subscriber are true, complete, and not misleading.
                    </li>
                  </ol>
                </li>
              </ol>
            </li>
            <li>
              GENERAL INDEMNITY
              <ol class="sub-pointer-decimal">
                <li>
                  The Company (including its Directors) hereby jointly and severally agree and undertake with each and
                  every Subscriber, to indemnify and keep indemnified and hold harmless each and every Subscriber, from
                  and against all losses, liabilities, obligations, damages, claims, demands, proceedings, costs and
                  expenses suffered, incurred or sustained by each and every Subscriber directly as a result of or
                  arising directly out of:
                  <ol class="lower-alpha-bracket">
                    <li>a breach or breaches of the Warranties; and/or</li>
                    <li>any breach of any term or condition under this Agreement.</li>
                  </ol>
                </li>
              </ol>
            </li>
            <li>
              GENERAL PROVISIONS
              <ol class="sub-pointer-decimal">
                <li>
                  Governing law and jurisdiction
                  <br />
                  <br />
                  This Agreement is governed by and is to be construed in accordance with the laws of Malaysia. Each
                  Party irrevocably and unconditionally submits to the exclusive jurisdiction of the courts of Malaysia
                  and waives any right to object to proceedings being brought in those courts.
                </li>
                <li>
                  Further assurance
                  <br />
                  <br />
                  The Parties covenant with each other that they will respectively sign, execute and do and procure all
                  other persons or companies, if necessary, to execute and do all such further deeds, assurance, acts
                  and things as may be necessary to give valid effect to the terms and conditions of this Agreement.
                </li>
              </ol>
            </li>
          </ol>
        </template>
      </Paper>
      <Paper
        :additional-css-class="controller.additionalCssClass"
        :paper-orientation="controller.paperOrientation"
        :show-page-number="true"
        :page-number="5"
        :total-pages="controller.totalPages"
      >
        <template #paperContent>
          <ol
            class="pointer-decimal"
            start="6"
          >
            <li class="no-number">
              <ol
                class="sub-pointer-decimal"
                start="3"
              >
                <li>
                  Illegality and severability
                  <br />
                  <br />
                  If any provision of this Agreement is determined by a court of competent jurisdiction or other
                  competent authority to be illegal, invalid, void, voidable, unlawful, or unenforceable, such provision
                  shall, to the maximum extent permissible under applicable law, be construed, interpreted, and modified
                  so as to give effect as nearly as possible to the original intent and commercial purpose of the
                  Parties while preserving its validity and enforceability. To the extent such provision cannot be so
                  modified, it shall be deemed severed only to the extent necessary without affecting the validity,
                  legality, or enforceability of the remaining provisions of this Agreement, which shall continue in
                  full force and effect.
                </li>
                <li>
                  Entire Agreement
                  <br />
                  <br />
                  This Agreement constitutes the entire agreement between the Parties and supersedes all prior
                  agreements or understandings, whether written or oral, and may be amended only in writing signed by
                  all Parties.
                </li>
                <li>
                  Counterparts
                  <br />
                  <br />
                  This Agreement may be executed in counterparts, each of which shall be an original, but all
                  counterparts together shall constitute one agreement.
                </li>
              </ol>
            </li>
          </ol>
          <div class="end-of-agreement">[END OF THE TERMS OF THIS AGREEMENT]</div>
        </template>
      </Paper>
      <Paper
        :additional-css-class="controller.additionalCssClass"
        :paper-orientation="controller.paperOrientation"
        :show-page-number="true"
        :page-number="6"
        :total-pages="controller.totalPages"
      >
        <template #paperContent>
          <p>
            <b>IN WITNESS WHEREOF</b>
            the parties have hereunto set their hands the day and the year first abovementioned.
          </p>
          <div class="signature-sections">
            <div
              class="signature-section-wrapper"
              v-for="(allotTo, index) in controller.subscribers"
            >
              <div class="signature-section">
                <div class="left-side">
                  <div class="left-side-item">Signed by</div>
                  <div
                    class="left-side-item"
                    v-if="allotTo.isAllotToCompany"
                  >
                    for and behalf of
                  </div>
                  <div class="left-side-item">
                    <span
                      class="value-placeholder"
                      v-if="allotTo.name === ''"
                    >
                      FULL NAME OF SUBSCRIBER
                    </span>
                    <span v-if="allotTo.name !== ''">
                      <b>{{ allotTo.name }}</b>
                    </span>
                  </div>
                  <div class="left-side-item">
                    <b>("Subscriber")</b>
                  </div>
                  <div class="left-side-item">in the presence of:-</div>
                </div>
                <div class="right-side"></div>
              </div>
              <div class="witness-sections">
                <div class="witness-row">
                  <div class="witness-label">Name</div>
                  <div class="colon">:</div>
                  <div class="placeholder">to be completed by iCompany Systems</div>
                </div>
                <div class="witness-row">
                  <div class="witness-label">Designation</div>
                  <div class="colon">:</div>
                  <div class="placeholder">to be completed by iCompany Systems</div>
                </div>
              </div>
            </div>
            <div class="signature-section-wrapper">
              <div class="signature-section">
                <div class="left-side">
                  <div class="left-side-item">Signed by</div>
                  <div class="left-side-item">for and behalf of</div>
                  <div class="left-side-item">
                    <b>{{ controller.companyName() }}</b>
                  </div>
                  <div class="left-side-item">
                    <b>("Company")</b>
                  </div>
                  <div class="left-side-item">in the presence of:-</div>
                </div>
                <div class="right-side"></div>
              </div>
              <div class="witness-sections">
                <div class="witness-row">
                  <div class="witness-label">Name</div>
                  <div class="colon">:</div>
                  <div class="placeholder">to be completed by iCompany Systems</div>
                </div>
                <div class="witness-row">
                  <div class="witness-label">Designation</div>
                  <div class="colon">:</div>
                  <div class="placeholder">to be completed by iCompany Systems</div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Paper>
      <Paper
        :additional-css-class="controller.additionalCssClass"
        :paper-orientation="controller.paperOrientation"
        :show-page-number="true"
        :page-number="7"
        :total-pages="controller.totalPages"
      >
        <template #paperContent>
          <div class="schedule-1">
            <div class="document-header">
              <b>SCHEDULE 1</b>
              <br />
              SHARE SUBSCRIPTION DETAILS
              <br />
              (This Schedule forms an integral and inseparable part and shall be read together with the terms and
              conditions of this Agreement)
            </div>
            <div class="subscription-details">
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Type of Shares</td>
                    <td>{{ controller.typeOfShares }}</td>
                  </tr>
                  <tr>
                    <td>Number of Shares</td>
                    <td>{{ controller.numberOfShares }}</td>
                  </tr>
                  <tr>
                    <td>Issue Price Per Share</td>
                    <td>RM{{ controller.issuePricePerShare }}</td>
                  </tr>
                  <tr>
                    <td>Total Subscription Amount</td>
                    <td>RM{{ controller.totalSubscription }}</td>
                  </tr>
                  <tr>
                    <td>Amount Paid Upon Subscription</td>
                    <td>RM{{ controller.totalPaid }}</td>
                  </tr>
                  <tr>
                    <td>Outstanding Amount</td>
                    <td>RM{{ controller.outstandingAmount }}</td>
                  </tr>
                  <tr>
                    <td>Payment Due Date</td>
                    <td>{{ controller.paymentDueDate }}</td>
                  </tr>
                  <tr>
                    <td>Completion Date</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Basis of Issue</td>
                    <td>{{ controller.basisOfIssue }}</td>
                  </tr>
                  <tr>
                    <td>Nature of Shares</td>
                    <td>{{ controller.natureOfShares }}</td>
                  </tr>
                  <tr>
                    <td>Rights Attaching to Shares</td>
                    <td>{{ controller.rightsAttachingToShares }}</td>
                  </tr>
                  <tr>
                    <td>Conditions Precedent</td>
                    <td>{{ controller.conditionsPrecedent }}</td>
                  </tr>
                  <tr>
                    <td>Conditions Subsequent</td>
                    <td>{{ controller.conditionsSubsequent }}</td>
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
        :show-page-number="true"
        :page-number="8"
        :total-pages="controller.totalPages"
      >
        <template #paperContent>
          <div class="schedule-2">
            <div class="document-header">
              <b>SCHEDULE 2</b>
              <br />
              SUBSCRIBER DETAILS
              <br />
              (This Schedule forms an integral and inseparable part and shall be read together with the terms and
              conditions of this Agreement)
            </div>
            <div class="subscriber-details">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>MYKAD / Passport / Registration No.</th>
                    <th>Address</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(allotTo, index) in controller.subscribers">
                    <td>
                      <span :class="allotTo.name === '' ? 'value-placeholder' : ''">
                        {{ allotTo.name === "" ? "SUBSCRIBER NAME" : allotTo.name }}
                      </span>
                    </td>
                    <td>
                      <span :class="allotTo.identification === '' ? 'value-placeholder' : ''">
                        {{ allotTo.identification === "" ? "SUBSCRIBER IDENTIFICATION" : allotTo.identification }}
                      </span>
                    </td>
                    <td>
                      <span :class="allotTo.address === '' ? 'value-placeholder' : ''">
                        {{ allotTo.address === "" ? "ADDRESS" : allotTo.address }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
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
  import { OrdinaryShareSubscriptionAgreementController } from "~/scripts/components/legal-documents/OrdinaryShareSubscriptionAgreementController"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
    applicationId: {
      type: [String, null],
      default: null,
    },
    isInPreviewMode: {
      type: Boolean,
      default: true,
    },
  })

  const emit = defineEmits([])

  const documentRef = ref(null)

  const controller = new OrdinaryShareSubscriptionAgreementController(
    props.companyId,
    props.applicationId,
    props.isInPreviewMode,
    emit
  )

  watch(
    () => props.companyId,
    (newVal) => {
      controller.setCompanyId(newVal)
    }
  )

  watch(
    () => props.applicationId,
    (newVal) => {
      controller.setApplicationId(newVal ?? "")
    }
  )

  watch(
    () => props.isInPreviewMode,
    (newVal) => {
      controller.setIsInPreviewMode(newVal)
    }
  )

  watch(
    documentRef,
    (newVal) => {
      controller.setDocumentRef(newVal)
    },
    { immediate: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/LegalDocuments/OrdinaryShareSubscriptionAgreement" as *;
</style>
