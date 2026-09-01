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
        <div class="registration-numbers">
          {{ controller.company.value.registrationNumberNew }} ({{ controller.company.value.registrationNumberOld }})
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
