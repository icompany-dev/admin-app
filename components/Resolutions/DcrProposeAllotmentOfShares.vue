<template>
  <div id="dcr-proposed-allotment-of-shares">
    <Resolution
      v-bind="controller.resolutionProps"
      @signed="emit('signed', $event)"
    >
      <!-- <template
        #paperMargins1
        v-if="controller.isDocumentEditable()"
      >
        <TransitionGroup name="fade">
          <div
            class="paper-tag point-right unsubscribed-shares-tag"
            v-if="controller.isShowExternalAllotToOptions"
          >
            Complete This
          </div>
        </TransitionGroup>
      </template> -->
      <!-- <template
        v-for="m in controller.additionalPageRanges"
        #[`paperMargins${m}`]
        :key="`margin${m}`"
      >
        <ClientOnly>
          <Teleport
            defer
            :to="`#tag-for-payment-status-${m}`"
          >
            <TransitionGroup name="fade">
              <div
                class="paper-tag point-left due-payable-tag"
                v-if="controller.isShowDueAndPayableTag"
              >
                <span>Complete This</span>
              </div>
            </TransitionGroup>
          </Teleport>
        </ClientOnly>
      </template> -->
      <template #page1>
        <p>
          <b>WHEREAS:</b>
          <br />
          THAT the Directors acknowledge that the members of the Company have approved and authorised the Directors
          pursuant to Section 75 of the Companies Act 2016 (“Act”) to allot and issue new shares in the Company.
        </p>
        <p>
          <b>AND WHEREAS:</b>
          <br />
          Section 76 of the Act authorises the Directors to determine and approve the terms, conditions, consideration,
          issue price, manner, timing, and persons to whom such shares are to be allotted in accordance with the
          authority granted by the members and the applicable laws.
        </p>
        <p><b>IT IS HEREBY RESOLVE:</b></p>
        <p>
          <b>1. PROPOSED ALLOTMENT OF SHARES</b>
          <br />
          THAT the Company be and is hereby authorised to allot and issue the following new shares:
        </p>
        <p>
          Number of Shares : {{ controller.companyShareholderAllotment.value.details.numberOfShares }}
          <br />
          Class of Shares : {{ controller.classOfShares }} Shares
          <br />
          Issue Price per Share : RM {{ controller.pricePerShare }}
          <br />
          Total Subscription Amount : RM {{ controller.totalSubscriptionAmount }}
          <br />
        </p>
        <p>
          <b>2. PURPOSE OF ALLOTMENT</b>
          <br />
          THAT the proposed allotment of shares is made for purposes including but not limited to
          <select
            v-if="controller.isDocumentEditable()"
            class="form-control in-resolution"
            v-model="controller.companyShareholderAllotment.value.details.purposeOfAllotment"
          >
            <option
              v-for="option in controller.purposeOfAllotmentOptions"
              :key="option.id"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
          <span
            v-if="!controller.isDocumentEditable()"
            :class="{ 'value-placeholder': controller.isInPreviewMode.value }"
          >
            {{ controller.purposeOfAllotment }}
          </span>
          and for such other purposes as determined by the Directors is in the best interest of the Company.
        </p>
        <p>
          <b>3. PRE-EMPTIVE RIGHTS</b>
          <br />
          THAT the Directors confirm that the existing shareholders were first offered the proposed shares in accordance
          with the applicable pre-emptive rights requirements under Section 85 of the Companies Act 2016{{
            controller.withConstitutionLine
          }}
        </p>
        <p>
          <b>4. UNSUBSCRIBED SHARES</b>
          <br />
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
            <b>5. BASIS OF ISSUE PRICE</b>
            <br />
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
              <b>5. BASIS OF ISSUE PRICE</b>
              <br />
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
              <b>6. PAYMENT STATUS</b>
              <br />
              THAT the allotted shares shall be issued on the following basis:
            </p>
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
