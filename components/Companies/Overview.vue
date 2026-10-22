<template>
  <div id="companies-overview">
    <div class="company-overview-section">
      <div class="overview-title">{{ controller.businessDetailsLabel }}</div>
      <table class="overview-table">
        <tbody>
          <tr>
            <td>{{ controller.incorporatedAtLabel }}</td>
            <td>:</td>
            <td>
              {{ controller.incorporatedAtDate }}
              <div
                class="annual-returs-due"
                v-if="controller.hasAnnualReturnDue"
              >
                {{ controller.annualReturnDues }}
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="editable-column">
                {{ controller.businessAddressLabel }}
                <Transition name="fade">
                  <div
                    v-if="!controller.isEditingAddress.value"
                    class="action-icons"
                  >
                    <i
                      v-if="controller.isEditingAddress.value && !controller.isUpdatingAddress.value"
                      class="fa-regular fa-xmark clickable cancel"
                      @click="controller.onCancelEditBusinessAddressClicked()"
                    />
                    <i
                      v-if="controller.isEditingAddress.value && !controller.isUpdatingAddress.value"
                      class="fa-regular fa-save clickable save"
                      @click="controller.onSaveBusinessAddressClicked()"
                    />
                    <i
                      v-if="!controller.isEditingAddress.value"
                      class="fa-regular fa-edit clickable edit"
                      @click="controller.onEditBusinessAddressClicked()"
                    />
                    <i
                      v-if="controller.isUpdatingAddress.value"
                      class="fa-regular fa-spin fa-spinner edit"
                    />
                  </div>
                </Transition>
              </div>
            </td>
            <td>:</td>
            <td>
              <Transition name="fade">
                <div
                  v-if="controller.isEditingAddress.value"
                  class="action-icons is-editing"
                >
                  <i
                    v-if="controller.isEditingAddress.value && !controller.isUpdatingAddress.value"
                    class="fa-regular fa-xmark clickable cancel"
                    @click="controller.onCancelEditBusinessAddressClicked()"
                  />
                  <i
                    v-if="controller.isEditingAddress.value && !controller.isUpdatingAddress.value"
                    class="fa-regular fa-save clickable save"
                    @click="controller.onSaveBusinessAddressClicked()"
                  />
                  <i
                    v-if="!controller.isEditingAddress.value"
                    class="fa-regular fa-edit clickable edit"
                    @click="controller.onEditBusinessAddressClicked()"
                  />
                  <i
                    v-if="controller.isUpdatingAddress.value"
                    class="fa-regular fa-spin fa-spinner edit"
                  />
                </div>
              </Transition>
              <AddressInput
                v-if="controller.isEditingAddress.value"
                :location="controller.addressLocation.value"
                :is-disabled="!controller.isEditingAddress.value"
                @updateAddressLine1="controller.onUpdateAddressLine1($event)"
                @updateAddressLine2="controller.onUpdateAddressLine2($event)"
                @updateAddressLine3="controller.onUpdateAddressLine3($event)"
                @updateState="controller.onUpdateState($event)"
                @updateCity="controller.onUpdateCity($event)"
                @updatePostcode="controller.onUpdatePostcode($event)"
                @updateCountry="controller.onUpdateCountry($event)"
              />
              <span
                v-if="!controller.isEditingAddress.value"
                class="address-span"
                v-html="controller.businessAddress"
              />
            </td>
          </tr>
          <tr>
            <td>
              <div class="editable-column">
                {{ controller.registeredAddressLabel }}
                <Transition name="fade">
                  <div
                    v-if="!controller.isEditingRegisteredAddress.value"
                    class="action-icons"
                  >
                    <i
                      v-if="
                        controller.isEditingRegisteredAddress.value && !controller.isUpdatingRegisteredAddress.value
                      "
                      class="fa-regular fa-xmark clickable cancel"
                      @click="controller.onCancelEditRegisteredAddressClicked()"
                    />
                    <i
                      v-if="
                        controller.isEditingRegisteredAddress.value && !controller.isUpdatingRegisteredAddress.value
                      "
                      class="fa-regular fa-save clickable save"
                      @click="controller.onSaveRegisteredAddressClicked()"
                    />
                    <i
                      v-if="!controller.isEditingRegisteredAddress.value"
                      class="fa-regular fa-edit clickable edit"
                      @click="controller.onEditRegisteredAddressClicked()"
                    />
                    <i
                      v-if="controller.isUpdatingRegisteredAddress.value"
                      class="fa-regular fa-spin fa-spinner edit"
                    />
                  </div>
                </Transition>
              </div>
            </td>
            <td>:</td>
            <td>
              <Transition name="fade">
                <div
                  v-if="controller.isEditingRegisteredAddress.value"
                  class="action-icons"
                >
                  <i
                    v-if="controller.isEditingRegisteredAddress.value && !controller.isUpdatingRegisteredAddress.value"
                    class="fa-regular fa-xmark clickable cancel"
                    @click="controller.onCancelEditRegisteredAddressClicked()"
                  />
                  <i
                    v-if="controller.isEditingRegisteredAddress.value && !controller.isUpdatingRegisteredAddress.value"
                    class="fa-regular fa-save clickable save"
                    @click="controller.onSaveRegisteredAddressClicked()"
                  />
                  <i
                    v-if="!controller.isEditingRegisteredAddress.value"
                    class="fa-regular fa-edit clickable edit"
                    @click="controller.onEditRegisteredAddressClicked()"
                  />
                  <i
                    v-if="controller.isUpdatingRegisteredAddress.value"
                    class="fa-regular fa-spin fa-spinner edit"
                  />
                </div>
              </Transition>
              <AddressInput
                v-if="controller.isEditingRegisteredAddress.value"
                :location="controller.registeredAddressLocation.value"
                :is-disabled="!controller.isEditingRegisteredAddress.value"
                @updateAddressLine1="controller.onUpdateRegisteredAddressLine1($event)"
                @updateAddressLine2="controller.onUpdateRegisteredAddressLine2($event)"
                @updateAddressLine3="controller.onUpdateRegisteredAddressLine3($event)"
                @updateState="controller.onUpdateRegisteredState($event)"
                @updateCity="controller.onUpdateRegisteredCity($event)"
                @updatePostcode="controller.onUpdateRegisteredPostcode($event)"
                @updateCountry="controller.onUpdateRegisteredCountry($event)"
              />
              <span
                v-if="!controller.isEditingRegisteredAddress.value"
                class="address-span"
                v-html="controller.registeredAddress"
              />
            </td>
          </tr>
          <tr>
            <td>{{ controller.businessBranchesLabel }}</td>
            <td>:</td>
            <td>
              <span v-if="controller.branchAddresses.length <= 0">{{ controller.noneText }}</span>
              <ol>
                <li v-for="(branch, i) in controller.companyBranches">
                  <Branch
                    :company-id="controller.companyId.value"
                    :company-branch="branch"
                  />
                  <!-- <span
                    class="address-span"
                    v-html="branchAddress"
                  /> -->
                </li>
              </ol>
            </td>
          </tr>
          <tr>
            <td>{{ controller.bankDetailLabel }}</td>
            <td>:</td>
            <td>
              <span v-if="controller.bankDetails.length <= 0">{{ controller.noneText }}</span>
              <ol
                class="bank-details"
                v-if="controller.bankDetails.length > 0"
              >
                <li
                  v-for="(companyBank, i) in controller.bankDetails"
                  :key="i"
                >
                  <div class="bank-account-detail">
                    <div class="name">
                      <b>{{ companyBank.bank.name }}</b>
                    </div>
                    <div class="branch-details">
                      {{ companyBank.bankBranch.name }}
                      <br />
                      {{ companyBank.bankBranch.address }}
                    </div>
                    <div class="account-number">
                      {{ controller.accountNumberLabel }}: {{ companyBank.accountNumber }}
                    </div>
                  </div>
                </li>
              </ol>
            </td>
          </tr>
          <tr>
            <td>
              {{ controller.incomeTaxLabel }}
            </td>
            <td>:</td>
            <td>
              <template v-if="!controller.isEditTaxNumber.value">
                <CopyValue :value="controller.incomeTaxNumber" />
                {{ controller.incomeTaxNumber }}
                <span
                  class="action-link"
                  @click="controller.onEditTaxClicked()"
                >
                  <i class="fa-regular fa-edit"></i>
                </span>
              </template>
              <template v-if="controller.isEditTaxNumber.value">
                C
                <input
                  type="text"
                  class="form-control"
                  v-model="controller.newIncomeTaxNumber.value"
                />
                <span
                  class="action-link"
                  @click="controller.onSaveTaxNumberClicked()"
                >
                  <i
                    class="fa-regular"
                    :class="controller.isUpdatingTaxNumber.value ? 'fa-spin fa-spinner' : 'fa-save'"
                  ></i>
                </span>
                <span
                  v-if="!controller.isUpdatingTaxNumber.value"
                  class="action-link remove"
                  @click="controller.onCancelEditTaxClicked()"
                >
                  <i class="fa-solid fa-xmark"></i>
                </span>
              </template>
            </td>
          </tr>
          <tr>
            <td>
              {{ controller.employerTaxLabel }}
            </td>
            <td>:</td>
            <td>
              <template v-if="!controller.isEditTaxNumber.value">
                <CopyValue :value="controller.employerTaxNumber" />
                {{ controller.employerTaxNumber }}

                <span
                  class="action-link"
                  @click="controller.onEditTaxClicked()"
                >
                  <i class="fa-regular fa-edit"></i>
                </span>
              </template>
              <template v-if="controller.isEditTaxNumber.value">
                E
                <input
                  type="text"
                  class="form-control"
                  v-model="controller.newEmployerTaxNumber.value"
                />
                <span
                  class="action-link"
                  @click="controller.onSaveTaxNumberClicked()"
                >
                  <i
                    class="fa-regular"
                    :class="controller.isUpdatingTaxNumber.value ? 'fa-spin fa-spinner' : 'fa-save'"
                  ></i>
                </span>
                <span
                  v-if="!controller.isUpdatingTaxNumber.value"
                  class="action-link remove"
                  @click="controller.onCancelEditTaxClicked()"
                >
                  <i class="fa-solid fa-xmark"></i>
                </span>
              </template>
            </td>
          </tr>
          <tr>
            <td>
              {{ controller.financialYearEndLabel }}
            </td>
            <td>:</td>
            <td>
              <template v-if="!controller.isEditFYE.value">
                <b>Previous FYE:</b>
                <br />
                {{ controller.previousFYE }}
                <br />
                <br />
                <b>Current FYE:</b>
                <br />
                {{ controller.currentFYE }}
                <span
                  class="action-link"
                  @click="controller.onEditFyeClicked()"
                >
                  <i class="fa-regular fa-edit"></i>
                </span>
              </template>
              <template v-if="controller.isEditFYE.value">
                <input
                  type="date"
                  class="form-control"
                  v-model="controller.fyeStartDate.value"
                />
                <i class="fa-solid fa-minus" />
                <input
                  type="date"
                  class="form-control"
                  v-model="controller.fyeEndDate.value"
                />
                <span
                  class="action-link"
                  @click="controller.onSaveFYEDatesClicked()"
                >
                  <i
                    class="fa-regular"
                    :class="controller.isEditingFYE.value ? 'fa-spin fa-spinner' : 'fa-save'"
                  ></i>
                </span>
                <span
                  v-if="!controller.isEditingFYE.value"
                  class="action-link remove"
                  @click="controller.onCancelEditFyeClicked()"
                >
                  <i class="fa-solid fa-xmark"></i>
                </span>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="company-overview-section">
      <div class="company-overview-section-split">
        <div class="split-section-item">
          <div class="overview-title">{{ controller.directorsLabel }}</div>
          <ol>
            <li
              v-for="(director, i) in controller.directorsDetails"
              :key="i"
            >
              <UserDetail v-bind="controller.getPropsUserDetail(director)" />
            </li>
          </ol>
        </div>
        <div class="split-section-item">
          <div class="overview-title">
            {{ controller.shareholdersLabel }}
          </div>
          <ol v-if="!controller.isShowShareDistribution.value">
            <li
              v-for="(shareholder, i) in controller.shareholdersDetails"
              :key="i"
            >
              <UserDetail v-bind="controller.getPropsUserDetail(shareholder)" />
            </li>
          </ol>
          <button
            class="btn btn-pill btn-submit"
            @click="controller.onGenerateBOAnnexureTxtClicked()"
          >
            Generate BO Annexure
          </button>
        </div>
      </div>
    </div>
    <div class="company-overview-section">
      <div class="company-overview-section-split">
        <div class="split-section-item">
          <div class="overview-title">Auditor</div>
          <ol>
            <li
              v-for="(auditor, i) in controller.auditors.value"
              :key="i"
            >
              <div class="human-details">
                <div class="name">{{ auditor.auditorCompanyName }}</div>
                <div class="human-detail">
                  <i class="fa-regular fa-envelope"></i>
                  <span class="email">{{ auditor.auditorEmail }}</span>
                </div>
                <div class="human-detail">
                  <i class="fa-brands fa-whatsapp" />
                  <span class="phone">{{ auditor.auditorPhone }}</span>
                </div>
              </div>
              <button
                class="btn btn-pill btn-primary"
                @click="controller.onEditCompanyAuditor(auditor)"
              >
                Edit
              </button>
            </li>
            <li>
              <button
                class="btn btn-pill btn-submit"
                @click="controller.onAddCompanyAuditorClicked()"
              >
                {{ controller.addAuditorLabel }}
              </button>
            </li>
          </ol>
        </div>
      </div>
    </div>
    <div class="company-overview-section">
      Order Chop
      <br />
      <br />
      <button
        class="btn btn-submit"
        :class="{ 'is-loading': controller.isOrderingChop.value }"
        :disabled="controller.isOrderingChop.value || !controller.latestPaymentOrderItemForChop"
        @click="controller.onOrderChopClicked()"
      >
        Order Chop
      </button>
    </div>
    <AddCompanyAuditor
      ref="addCompanyAuditorRef"
      v-bind="controller.addCompanyAuditorProps"
      @proceed="controller.fetchCompanyAuditors()"
    />
  </div>
</template>

<script lang="ts" setup>
  import AddCompanyAuditor from "../Popups/AddCompanyAuditor.vue"
  import AddressInput from "@/components/Forms/AddressInput.vue"
  import Branch from "./Branch.vue"
  import CopyValue from "../Buttons/CopyValue.vue"
  import UserDetail from "../Users/UserDetail.vue"
  import { Pie } from "vue-chartjs"
  import { OverviewController } from "~/scripts/components/companies/OverviewController"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
  })

  const emit = defineEmits([])

  const addCompanyAuditorRef = ref(null)

  const controller = new OverviewController(props.companyId, emit)

  watch(
    () => props.companyId,
    (newVal) => {
      controller.setCompanyId(newVal)
    }
  )

  watch(
    addCompanyAuditorRef,
    (newVal) => {
      controller.setAddCompanyAuditorRef(newVal)
    },
    { immediate: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Companies/Overview" as *;
</style>
