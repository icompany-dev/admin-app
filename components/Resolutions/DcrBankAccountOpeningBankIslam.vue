<template>
  <div id="dcr-bank-account-opening-bank-islam">
    <Resolution
      v-bind="controller.resolutionPropsForBank"
      @signed="emit('signed', $event)"
    >
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
  import { DcrBankAccountOpeningBankIslamController } from "~/scripts/components/resolutions/DcrBankAccountOpeningBankIslamController"
  import type { CompanyBankAccountOpening } from "~/scripts/models/CompanyBankAccountOpening"
  import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
  import { StringUtil } from "~/scripts/utils/String"

  const props = defineProps<IPropsResolutionDocument<CompanyBankAccountOpening>>()

  const resolutionContent = ref(null)

  const emit = defineEmits(["startLoading", "doneLoading", "signed", "updated"])

  const controller = new DcrBankAccountOpeningBankIslamController(props, emit)

  watch(
    () => props.applicationId,
    (newVal) => {
      if (!StringUtil.isNullOrEmpty(newVal)) {
        controller.fetchApplication(newVal ?? "")
      }
    }
  )

  watch(
    () => props.isInPreviewMode,
    (newVal) => {
      console.log(newVal)
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
    getSignatoryType: controller.getSignatoryType.bind(controller),
    getSignatories: controller.getSignatories.bind(controller),
    getBranchId: controller.getBranchId.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Resolutions/BankAccountOpening" as *;
</style>
