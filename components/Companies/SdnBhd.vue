<template>
  <div class="company-sdn-bhd">
    <div
      class="logo"
      :class="{ 'no-logo': !controller.hasCompanyLogo }"
    >
      <img :src="controller.companyLogo" />
    </div>
    <div class="name-actions">
      <div
        class="company-name"
        @click="controller.onCompanyClicked()"
      >
        {{ controller.company.value.getFullName() }}
        <Transition name="fade">
          <span
            class="notification"
            v-if="controller.hasAnnualReturnDue"
            :title="controller.annualReturnDueYears"
          >
            <i class="fa-solid fa-bell" />
          </span>
        </Transition>
        <div class="details">
          <div class="registration-numbers">
            {{ controller.company.value.registrationNumberNew }} ({{ controller.company.value.registrationNumberOld }})
          </div>
        </div>
      </div>
      <div class="display-detail">
        {{ controller.company.value.businessDescription.toUpperCase() }}
        <CopyValue :value="controller.company.value.businessDescription.toUpperCase()" />
      </div>
      <div class="msic-codes">
        <ul>
          <li v-for="(msicCodeAssign, id) in controller.company.value.msicCodeAssigns">
            {{ msicCodeAssign.msicCode.code }} - {{ msicCodeAssign.msicCode.descriptionEn }}
            <CopyValue :value="msicCodeAssign.msicCode.code" />
          </li>
        </ul>
      </div>
      <div class="compliance-details">
        <div class="compliance">
          <div class="label">
            {{ controller.pastAnnualReturnLabel }}
          </div>
          <div v-if="!controller.hasPastAnnualReturn">-</div>
          <ul>
            <li v-for="(annualReturn, i) in controller.pastAnnualReturn">
              {{ annualReturn.date }}
              <span
                v-if="annualReturn.isOverdue"
                class="text-danger"
                :title="'Not Paid & Overdue'"
              >
                <i class="fa-solid fa-circle-exclamation" />
              </span>
              <span
                v-if="!annualReturn.isLodged && annualReturn.isPaid"
                class="text-warning"
                :title="'Pending Lodgement'"
              >
                <i class="fa-solid fa-circle-exclamation" />
              </span>
              <span
                v-if="annualReturn.isLodged"
                class="text-success"
                :title="'Lodged'"
              >
                <i class="fa-solid fa-circle-exclamation" />
              </span>
            </li>
          </ul>
        </div>
        <div class="compliance">
          <div class="label">
            {{ controller.currentAnnualReturnLabel }}
          </div>
          <div v-if="!controller.hasCurrentAnnualReturn">-</div>
          <ul>
            <li v-for="(annualReturn, i) in controller.currentAnnualReturn">
              {{ annualReturn.date }}
              <span
                v-if="annualReturn.isOverdue"
                class="text-danger"
                :title="'Not Paid & Overdue'"
              >
                <i class="fa-solid fa-circle-exclamation" />
              </span>
              <span
                v-if="!annualReturn.isLodged && annualReturn.isPaid"
                class="text-warning"
                :title="'Pending Lodgement'"
              >
                <i class="fa-solid fa-circle-exclamation" />
              </span>
              <span
                v-if="annualReturn.isLodged"
                class="text-success"
                :title="'Lodged'"
              >
                <i class="fa-solid fa-circle-exclamation" />
              </span>
            </li>
          </ul>
        </div>
        <div class="compliance">
          <div class="label">
            {{ controller.futureAnnualReturnLabel }}
          </div>
          <div v-if="!controller.hasFutureAnnualReturn">-</div>
          <ul>
            <li v-for="(annualReturn, i) in controller.futureAnnualReturn">
              {{ annualReturn.date }}
              <span
                v-if="annualReturn.isOverdue"
                class="text-danger"
                :title="'Not Paid & Overdue'"
              >
                <i class="fa-solid fa-circle-exclamation" />
              </span>
              <span
                v-if="!annualReturn.isLodged && annualReturn.isPaid"
                class="text-warning"
                :title="'Pending Lodgement'"
              >
                <i class="fa-solid fa-circle-exclamation" />
              </span>
              <span
                v-if="annualReturn.isLodged"
                class="text-success"
                :title="'Lodged'"
              >
                <i class="fa-solid fa-circle-exclamation" />
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div class="action-buttons">
        <button
          class="btn btn-pill btn-submit"
          @click="controller.onEditClicked()"
        >
          {{ controller.edit }}
        </button>
        <button
          class="btn btn-pill btn-submit"
          @click="controller.onStrikeOffClicked()"
        >
          {{ controller.strikeOff }}
        </button>
        <button
          class="btn btn-pill btn-submit"
          @click="controller.onSwitchOutClicked()"
        >
          {{ controller.switchOut }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import CopyValue from "../Buttons/CopyValue.vue"
  import { SdnBhdController } from "~/scripts/components/companies/SdnBhdController"
  import { Company } from "~/scripts/models/Company"

  const props = defineProps({
    company: {
      type: Company,
      required: true,
    },
  })
  const emit = defineEmits(["selected"])

  const controller = new SdnBhdController(props.company, emit)

  watch(
    () => props.company,
    (newVal) => {
      controller.setCompany(newVal)
    },
    { deep: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Companies/SdnBhd" as *;
</style>
