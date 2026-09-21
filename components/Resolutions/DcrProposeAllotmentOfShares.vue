<template>
  <div
    id="dcr-proposed-allotment-of-shares"
    ref="documentRef"
  >
    <Resolution
      v-bind="controller.resolutionProps"
      @signed="emit('signed', $event)"
    >
      <template #page1>
        <p>
          <b>WHEREAS:</b>
          <br />
          <br />
          The Directors have considered the proposed increase in the issued share capital of the Company by way of an
          allotment of new ordinary shares in the Company.
        </p>
        <p>
          The Directors noted that pursuant to
          <b>Section 75(1) of the Companies Act 2016</b>
          , the Directors shall not exercise the power to allot shares unless prior approval by way of resolution of the
          Company has been obtained, except where otherwise permitted under the Act.
        </p>
        <p>
          The Directors further noted that such approval may, pursuant to
          <b>Section 76(1) of the Companies Act 2016</b>
          , be confined to a particular exercise of the power to allot shares and may be subject to such conditions as
          may be approved by the Members.
        </p>
        <p><b>IT IS HEREBY RESOLVED:</b></p>
        <p>
          <b><u>1.&nbsp;&nbsp;PROPOSED ALLOTMENT OF SHARES</u></b>
        </p>
        <p>
          The proposed allotment of up to
          <b>{{ NumberUtil.thousandSeparator(controller.companyShareholderAllotment.value.details.numberOfShares) }}</b>
          new {{ controller.classOfShares }} shares in the Company at an issue price of
          <b>RM{{ controller.pricePerShare }} per share</b>
          , for an aggregate consideration of up to
          <b>RM{{ controller.totalSubscriptionAmount }}</b>
          , be and is hereby proposed.
        </p>
        <p>
          The proposed allotment is intended to be made for the purpose of
          <input
            v-if="controller.isDocumentEditable()"
            class="form-control in-resolution"
            v-model="controller.companyShareholderAllotment.value.details.purposeOfAllotment"
            list="purposeOfAllotmentList"
          />
          <datalist id="purposeOfAllotmentList">
            <option value="working capital" />
            <option value="business expansion" />
            <option value="capital injection" />
            <option value="investment" />
            <option value="other purpose" />
          </datalist>
          <span v-if="!controller.isDocumentEditable()">
            {{ controller.companyShareholderAllotment.value.details.purposeOfAllotment }}.
          </span>
        </p>
        <p>
          <b><u>2.&nbsp;&nbsp;MEMBERS' APPROVAL</u></b>
        </p>
        <p>
          The proposed allotment be submitted to the Members of the Company for their prior approval pursuant to
          <b>Sections 75(1) and 76(1) of the Companies Act 2016</b>
          .
        </p>
        <p>
          The approval shall be proposed as a
          <b>Written Ordinary Resolution</b>
          of the Members pursuant to
          <b>Sections 290, 291 and 297 of the Companies Act 2016</b>
          .
        </p>
        <p>
          <b><u>3.&nbsp;&nbsp;PRE-EMPTIVE RIGHTS</u></b>
        </p>
        <p>
          Upon obtaining the Members’ approval, and where applicable, the new
          {{ controller.classOfShares }} shares shall first be offered to the existing shareholders of the Company in
          accordance with
          <b>Section 85 of the Companies Act 2016{{ controller.withConstitutionLine }}</b>
          .
        </p>
        <p>
          <b><u>4.&nbsp;&nbsp;UNSUBSCRIBED SHARES</u></b>
        </p>
        <p>
          THAT where any existing shareholder declines, fails, or refuses to subscribe for the proposed shares within
          the stipulated period, the remaining unsubscribed shares shall remain unissued and shall have no further
          effect.
          <span v-if="!controller.isDocumentEditable()">
            {{ controller.selectedOptionForUnsubscribed }}
          </span>
          <SearchableDropdown
            v-if="controller.isDocumentEditable()"
            :options="controller.optionsForUnsubscribed"
            :selected-item-name="controller.selectedOptionForUnsubscribed"
            :placeholder="''"
            :label-key="'label'"
            :is-searchable="false"
            @selected="controller.onSelectedActionUnsubscribed($event)"
          />
        </p>
        <ol
          class="lower-alpha"
          v-if="controller.isShowExternalAllotToOptions"
        >
          <li
            v-for="(allotTo, index) in controller.getAllotteesOnPage(1)"
            :key="`p-1-${index}`"
          >
            <div class="new-allottee">
              <div
                v-if="controller.isDocumentEditable()"
                class="allottee-type-select"
              >
                <SearchableDropdown
                  :options="controller.allotteeTypes"
                  :selectedItemName="allotTo.shareholdingTypeName"
                  :value-key="'id'"
                  :label-key="'label'"
                  :is-searchable="false"
                  @selected="allotTo.shareholdingType = $event"
                />
                <span
                  class="action-link remove"
                  v-if="controller.canRemoveAllottee"
                  @click="controller.onRemoveAllotteeClicked(index)"
                >
                  <i class="fa-regular fa-trash-alt" />
                </span>
              </div>
              <table class="new-allottee-details">
                <tbody>
                  <tr>
                    <td>{{ controller.isArtificialPerson(allotTo) ? "Entity " : "" }}Name</td>
                    <td>:</td>
                    <td>
                      <input
                        v-if="controller.isDocumentEditable()"
                        type="text"
                        class="form-control in-resolution"
                        v-model="allotTo.name"
                      />
                      <span
                        v-if="!controller.isDocumentEditable()"
                        :class="{ 'value-placeholder': controller.isInPreviewMode.value }"
                      >
                        {{ controller.getAllotteeName(allotTo) }}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {{ controller.isArtificialPerson(allotTo) ? "Registration Number" : "NRIC / Passport No." }}
                    </td>
                    <td>:</td>
                    <td>
                      <input
                        v-if="controller.isDocumentEditable()"
                        type="text"
                        class="form-control in-resolution"
                        v-model="allotTo.identificationNumber"
                        :placeholder="controller.isArtificialPerson(allotTo) ? 'Company Registration Number' : ''"
                      />
                      <span
                        v-if="!controller.isDocumentEditable()"
                        :class="{ 'value-placeholder': controller.isInPreviewMode.value }"
                      >
                        {{ controller.getAllotteeIdentification(allotTo) }}
                      </span>
                    </td>
                  </tr>
                  <tr v-if="controller.isArtificialPerson(allotTo)">
                    <td></td>
                    <td></td>
                    <td>
                      <input
                        v-if="controller.isDocumentEditable()"
                        type="text"
                        class="form-control in-resolution"
                        v-model="allotTo.identificationNumberAlt"
                        placeholder="Other Registration Number"
                      />
                      <span
                        v-if="!controller.isDocumentEditable()"
                        :class="{ 'value-placeholder': controller.isInPreviewMode.value }"
                      >
                        {{ controller.getAllotteeIdentificationAlt(allotTo) }}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>Number of Shares</td>
                    <td>:</td>
                    <td>
                      <input
                        v-if="controller.isDocumentEditable()"
                        type="text"
                        class="form-control in-resolution"
                        v-model="allotTo.numberOfShares"
                      />
                      <span
                        v-if="!controller.isDocumentEditable()"
                        :class="{ 'value-placeholder': controller.isInPreviewMode.value }"
                      >
                        {{ controller.getAllotteeNumberOfShares(allotTo) }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </li>
          <li
            class="no-number"
            v-if="controller.showAddMoreOnPageOne"
          >
            <div
              class="action-link add-more"
              @click="controller.onAddAllotteeClicked()"
            >
              + Add More
            </div>
          </li>
        </ol>
        <TransitionGroup name="fade">
          <p v-if="controller.isOnlyOneAllottee">
            <b><u>5.&nbsp;&nbsp;BASIS OF ISSUE PRICE</u></b>
          </p>
          <p>
            THAT the Directors confirm that the issue price of the shares was determined based on the commercial and
            financial considerations of the Company including but not limited to:
          </p>
          <ul v-if="controller.isOnlyOneAllottee">
            <li>funding requirements;</li>
            <li>current shareholding structure;</li>
            <li v-if="!controller.isShowExternalAllotToOptions">agreed investment value;</li>
            <li v-if="!controller.isShowExternalAllotToOptions">internal valuation;</li>
            <li v-if="!controller.isShowExternalAllotToOptions">strategic participation; and/or</li>
            <li v-if="!controller.isShowExternalAllotToOptions">such other basis as determined by the Directors.</li>
          </ul>
        </TransitionGroup>
      </template>
      <template
        v-for="page in controller.additionalPageRanges"
        #[`page${page}`]
        :key="page"
      >
        <TransitionGroup name="fade">
          <ol
            v-if="controller.isShowAllotteeOfPageTwo"
            :start="controller.maxAllotteeOnPageOne + 1"
            class="lower-alpha"
          >
            <li
              v-for="(allotTo, index) in controller.getAllotteesOnPage(page)"
              :key="`p-${page}-${index}`"
            >
              <div class="new-allottee">
                <div
                  v-if="controller.isDocumentEditable()"
                  class="allottee-type-select"
                >
                  <SearchableDropdown
                    :options="controller.allotteeTypes"
                    :selectedItemName="allotTo.shareholdingTypeName"
                    :value-key="'id'"
                    :label-key="'label'"
                    :is-searchable="false"
                    @selected="allotTo.shareholdingType = $event"
                  />
                  <span
                    class="action-link remove"
                    v-if="controller.canRemoveAllottee"
                    @click="controller.onRemoveAllotteeClicked(index)"
                  >
                    <i class="fa-regular fa-trash-alt" />
                  </span>
                </div>
                <span
                  v-if="!controller.isDocumentEditable()"
                  :class="{ 'value-placeholder': controller.isInPreviewMode.value }"
                >
                  {{ controller.getAllotteeType(allotTo) }}
                </span>
                <table class="new-allottee-details">
                  <tbody>
                    <tr>
                      <td>{{ controller.isArtificialPerson(allotTo) ? "Entity " : "" }}Name</td>
                      <td>:</td>
                      <td>
                        <input
                          v-if="controller.isDocumentEditable()"
                          type="text"
                          class="form-control in-resolution"
                          v-model="allotTo.name"
                        />
                        <span
                          v-if="!controller.isDocumentEditable()"
                          :class="{ 'value-placeholder': controller.isInPreviewMode.value }"
                        >
                          {{ controller.getAllotteeName(allotTo) }}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        {{ controller.isArtificialPerson(allotTo) ? "Registration Number" : "NRIC / Passport No." }}
                      </td>
                      <td>:</td>
                      <td>
                        <input
                          v-if="controller.isDocumentEditable()"
                          type="text"
                          class="form-control in-resolution"
                          v-model="allotTo.identificationNumber"
                          :placeholder="controller.isArtificialPerson(allotTo) ? 'Company Registration Number' : ''"
                        />
                        <span
                          v-if="!controller.isDocumentEditable()"
                          :class="{ 'value-placeholder': controller.isInPreviewMode.value }"
                        >
                          {{ controller.getAllotteeIdentification(allotTo) }}
                        </span>
                      </td>
                    </tr>
                    <tr v-if="controller.isArtificialPerson(allotTo)">
                      <td></td>
                      <td></td>
                      <td>
                        <input
                          v-if="controller.isDocumentEditable()"
                          type="text"
                          class="form-control in-resolution"
                          v-model="allotTo.identificationNumberAlt"
                          placeholder="Other Registration Number"
                        />
                        <span
                          v-if="!controller.isDocumentEditable()"
                          :class="{ 'value-placeholder': controller.isInPreviewMode.value }"
                        >
                          {{ controller.getAllotteeIdentificationAlt(allotTo) }}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>Number of Shares</td>
                      <td>:</td>
                      <td>
                        <input
                          v-if="controller.isDocumentEditable()"
                          type="text"
                          class="form-control in-resolution"
                          v-model="allotTo.numberOfShares"
                        />
                        <span
                          v-if="!controller.isDocumentEditable()"
                          :class="{ 'value-placeholder': controller.isInPreviewMode.value }"
                        >
                          {{ controller.getAllotteeNumberOfShares(allotTo) }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </li>
            <li
              class="no-number"
              v-if="controller.canAddMoreOnPage(page)"
            >
              <div
                class="action-link add-more"
                @click="controller.onAddAllotteeClicked()"
              >
                + Add More
              </div>
            </li>
          </ol>
          <template v-if="controller.isShowBasisIssuePriceOnPage(page)">
            <p v-if="!controller.isOnlyOneAllottee">
              <b><u>5.&nbsp;&nbsp;BASIS OF ISSUE PRICE</u></b>
            </p>
            <p>
              THAT the Directors confirm that the issue price of the shares was determined based on the commercial and
              financial considerations of the Company including but not limited to:
            </p>
            <ul>
              <li v-if="!controller.isOnlyOneAllottee">funding requirements;</li>
              <li v-if="!controller.isOnlyOneAllottee">current shareholding structure;</li>
              <li v-if="controller.isShowExternalAllotToOptions">agreed investment value;</li>
              <li v-if="controller.isShowExternalAllotToOptions">internal valuation;</li>
              <li v-if="controller.isShowExternalAllotToOptions">strategic participation; and/or</li>
              <li v-if="controller.isShowExternalAllotToOptions">such other basis as determined by the Directors.</li>
            </ul>
          </template>
          <template v-if="controller.isShowPaymentStatusOnPage(page)">
            <p>
              <b><u>6.&nbsp;&nbsp;PAYMENT STATUS</u></b>
            </p>
            <p>THAT the allotted shares shall be issued on the following basis:</p>
            <table class="border-less">
              <tbody>
                <tr>
                  <td colspan="3">
                    <span :class="{ 'value-placeholder': controller.isInPreviewMode.value }">
                      {{ controller.considerationType }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Total Subscription Amount</td>
                  <td>:</td>
                  <td>
                    RM
                    <span :class="{ 'value-placeholder': controller.isInPreviewMode.value }">
                      {{ controller.totalSubscriptionAmount }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Amount Paid</td>
                  <td>:</td>
                  <td>
                    RM
                    <span :class="{ 'value-placeholder': controller.isInPreviewMode.value }">
                      {{ controller.amountPaid }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Outstanding Amount</td>
                  <td>:</td>
                  <td>
                    RM
                    <span :class="{ 'value-placeholder': controller.isInPreviewMode.value }">
                      {{ controller.outstandingAmount }}
                    </span>
                  </td>
                </tr>
                <tr v-if="controller.hasDueAndPayable">
                  <td>Due and Payable</td>
                  <td>:</td>
                  <td>
                    <div
                      class="due-payable-tag-container"
                      :id="`tag-for-payment-status-${page}`"
                    ></div>
                    <div
                      class="due-and-payable-select"
                      v-if="controller.isDocumentEditable()"
                    >
                      <SearchableDropdown
                        :options="controller.dueAndPayableOption"
                        :value-key="'value'"
                        :label-key="'label'"
                        :is-searchable="false"
                        :selected-item-name="controller.selectedDueAndPayable"
                        @selected="controller.onDuePayableClicked($event)"
                      />
                      <Transition class="fade">
                        <input
                          type="date"
                          class="form-control in-resolution"
                          v-if="!controller.companyShareholderAllotment.value.details.isPayableUponCall"
                          v-model="controller.companyShareholderAllotment.value.details.paymentDueDate"
                        />
                      </Transition>
                    </div>
                    <span
                      v-if="!controller.isDocumentEditable()"
                      :class="{ 'value-placeholder': controller.isInPreviewMode.value }"
                    >
                      {{ controller.dueAndPayable }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              THAT any unpaid amount shall remain due and owing by the allottee subject to the applicable terms and
              future calls by the Directors where applicable.
            </p>
          </template>
          <FurtherResolved v-if="controller.isShowFurtherResolvedOnPage(page)" />
        </TransitionGroup>
      </template>
    </Resolution>
  </div>
</template>

<script lang="ts" setup>
  import FurtherResolved from "./FurtherResolved.vue"
  import Resolution from "./Resolution.vue"
  import SearchableDropdown from "../Forms/SearchableDropdown.vue"
  import { CompanyShareholderAllotment } from "~/scripts/models/CompanyShareholderAllotment"
  import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
  import { DcrProposedAllotmentOfSharesController } from "~/scripts/components/resolutions/DcrProposeAllotmentOfSharesController"
  import { NumberUtil } from "~/scripts/utils/Number"

  const props = defineProps<IPropsResolutionDocument<CompanyShareholderAllotment>>()

  const emit = defineEmits(["signed", "doneLoading"])

  const documentRef = ref(null)

  const controller = new DcrProposedAllotmentOfSharesController(props, emit)

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
      controller.setContent()
    }
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
    documentRef,
    (newVal) => {
      controller.setDocumentRef(newVal)
    },
    { immediate: true }
  )

  defineExpose({
    totalPages: controller.totalPages.bind(controller),
    getApplication: controller.getApplication.bind(controller),
    updateApplicationContent: controller.updateApplicationContent.bind(controller),
    isLoading: controller.isLoading.value,
    getPdfPages: controller.getPdfPages.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Resolutions/DcrProposedAllotmentOfShares" as *;
</style>
