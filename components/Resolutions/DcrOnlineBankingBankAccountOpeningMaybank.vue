<template>
  <div id="dcr-online-banking-bank-account-opening-maybank">
    <Resolution
      v-bind="controller.resolutionProps"
      @signed="emit('signed', $event)"
    >
      <template
        #paperMargins1
        v-if="controller.isDocumentEditable()"
      >
        <div class="paper-tag checker-maker-table"><span>Insert Information</span></div>
      </template>
      <template #page1>
        <div
          ref="resolutionContent"
          class="resolution-content"
          v-html="controller.resolutionContent.value"
        />
      </template>
    </Resolution>
  </div>
</template>

<script setup lang="ts">
  import Resolution from "./Resolution.vue"
  import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
  import { DcrOnlineBankingBankAccountOpeningMaybankController } from "~/scripts/components/resolutions/DcrOnlineBankingBankAccountOpeningMaybankController"
  import type { CompanyBankAccountOpening } from "~/scripts/models/CompanyBankAccountOpening"

  const props = defineProps<IPropsResolutionDocument<CompanyBankAccountOpening>>()

  const resolutionContent = ref(null)

  const emit = defineEmits(["startLoading", "doneLoading", "signed", "updated"])

  const controller = new DcrOnlineBankingBankAccountOpeningMaybankController(
    props.companyId,
    props.applicationId,
    props.application,
    props.isInPreviewMode,
    props.showWatermark,
    props.watermarkText,
    emit,
    props.bankId ?? ""
  )

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
    resolutionContent,
    (newVal) => {
      if (newVal) {
        controller.setResolutionContentRef(newVal)
      }
    },
    { immediate: true }
  )

  watch(
    () => controller.resolutionContent.value,
    async () => {
      await nextTick()
      controller.attachEventListeners()
    },
    { immediate: true }
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
    () => props.application,
    (newVal) => {
      if (!newVal) {
        return
      }

      controller.updateApplicationContent(newVal)
    },
    { deep: true }
  )

  defineExpose({
    totalPages: controller.totalPages.bind(controller),
    getApplication: controller.getApplication.bind(controller),
    updateApplicationContent: controller.updateApplicationContent.bind(controller),
    isLoading: controller.isLoading.value,
    getAuthorisedPersonsForOnlineBanking: controller.getAuthorisedPersonsForOnlineBanking.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Resolutions/BankAccountOpening" as *;
</style>
