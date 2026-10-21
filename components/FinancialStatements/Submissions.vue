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
        <div
          class="details"
          @click="controller.onFinancialPeriodClicked(financialPeriod)"
        >
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
        <Transition name="fade">
          <div
            class="statement-details"
            v-if="controller.isShowingDetails(financialPeriod)"
          >
            <template v-if="controller.hasUploadedManagementAccount(financialPeriod)">
              <PdfViewer
                :company-id="controller.companyId.value ?? ''"
                :pdf-url="controller.getManagementAccountUrl(financialPeriod)"
                :filename="'managementaccount.pdf'"
                :can-zoom="false"
                :zoom-level="0"
              />
              <div class="action-buttons">
                <button
                  class="btn btn-submit"
                  :class="{ 'is-loading': controller.getIsGeneratingUFS(financialPeriod) }"
                  :disabled="controller.isGeneratingUFS.value"
                  @click="controller.onGenerateUFSClicked(financialPeriod)"
                >
                  Generate UFS
                </button>
              </div>
            </template>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import PdfViewer from "../DocumentViewers/PdfViewer.vue"
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
