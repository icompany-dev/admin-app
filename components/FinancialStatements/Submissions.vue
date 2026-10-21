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
              <div class="submission-documents">
                <div class="management-account">
                  <Teleport
                    to="body"
                    :disabled="!controller.getIsManagementAccountEnlarged(financialPeriod)"
                  >
                    <div
                      :class="{ 'document-view show': controller.getIsManagementAccountEnlarged(financialPeriod) }"
                      @click="controller.onManagementAccountClicked()"
                    >
                      <PdfViewer
                        :company-id="controller.companyId.value ?? ''"
                        :pdf-url="controller.getManagementAccountUrl(financialPeriod)"
                        :filename="'managementaccount.pdf'"
                        :can-zoom="false"
                        :zoom-level="controller.getIsManagementAccountEnlarged(financialPeriod) ? 1 : 0"
                      />
                    </div>
                  </Teleport>
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
                </div>
                <div
                  class="financial-statement"
                  v-if="controller.getIsShowUFS(financialPeriod)"
                  @click="controller.onFinancialStatementClicked()"
                >
                  <Teleport
                    to="body"
                    :disabled="!controller.getIsFinancialStatementEnlarged(financialPeriod)"
                  >
                    <div
                      :class="{
                        'document-view show': controller.getIsFinancialStatementEnlarged(financialPeriod),
                        'financial-statement-document': !controller.getIsFinancialStatementEnlarged(financialPeriod),
                      }"
                      @click.self="controller.onFinancialStatementClicked()"
                    >
                      <UnauditedFinancialStatement
                        :ref="
                          (el) => {
                            if (controller.getIsFinancialStatementEnlarged(financialPeriod)) {
                              controller.setUfsRef(el)
                            }
                          }
                        "
                        v-bind="controller.getPropsForFinancialStatement(financialPeriod)"
                      />
                      <ActionTray
                        v-if="controller.getIsFinancialStatementEnlarged(financialPeriod)"
                        :actions="controller.actionTrayElementForUFS"
                      />
                    </div>
                  </Teleport>
                </div>
              </div>
            </template>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import ActionTray from "../ActionTrays/ActionTray.vue"
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import PdfViewer from "../DocumentViewers/PdfViewer.vue"
  import UnauditedFinancialStatement from "@/components/LegalDocuments/UnauditedFinancialStatement.vue"
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
