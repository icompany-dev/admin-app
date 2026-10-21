<template>
  <div id="financial-statements-submissions">
    <div
      v-if="controller.isLoading.value"
      class="loader-container"
    >
      <LoaderPrepare
        :label="controller.loaderLabel"
        :sublabel="controller.loaderSublabel"
      />
    </div>
    <div
      v-if="!controller.isLoading.value"
      class="submissions"
    >
      <div
        v-for="(financialPeriod, index) in controller.companyFinancialPeriods.value"
        class="submission"
      >
        <div class="company-name">{{ controller.getCompanyName(financialPeriod) }}</div>
        <div class="details">
          <b>Start Date:</b>
          {{ controller.getStartDate(financialPeriod) }}
          <br />
          <b>End Date:</b>
          {{ controller.getEndDate(financialPeriod) }}
          <br />
          <b>Type of Submission:</b>
          {{ controller.getTypeOfSubmission(financialPeriod) }}
          <br />
          <b>Status:</b>
          {{ controller.getStatusOfSubmission(financialPeriod) }}
          <br />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import { SubmissionsController } from "~/scripts/components/financial-statements/SubmissionsController"
  import type { IPropsFinancialStatementSubmissions } from "~/scripts/props/PropsFinancialStatementSubmissions"

  const props = defineProps<IPropsFinancialStatementSubmissions>()

  const emit = defineEmits([])

  const controller = new SubmissionsController(props, emit)

  watch(
    () => props,
    (newVal) => {
      controller.setDataFromProps(newVal)
    },
    { deep: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/FinancialStatements/Submissions" as *;
</style>
