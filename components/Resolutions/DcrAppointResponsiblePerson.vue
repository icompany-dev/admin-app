<template>
  <div id="dcr-appoint-authorised-person">
    <Resolution
      v-bind="controller.resolutionProps"
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
  import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
  import { CompanyFinancialStatementAuthorisedPerson } from "~/scripts/models/CompanyFinancialStatementAuthorisedPerson"
  import Resolution from "./Resolution.vue"
  import { DcrAppointResponsiblePersonController } from "~/scripts/components/resolutions/DcrAppointResponsiblePersonController"

  const props = defineProps<IPropsResolutionDocument<CompanyFinancialStatementAuthorisedPerson>>()

  const resolutionContent = ref(null)

  const emit = defineEmits(["startLoading", "doneLoading", "signed"])

  const controller = new DcrAppointResponsiblePersonController(props, emit)

  watch(
    () => props.applicationId,
    (newVal) => {
      controller.setApplicationId(newVal)
    }
  )

  watch(
    () => props.financialPeriodId,
    (newVal) => {
      controller.setFinancialPeriodId(newVal ?? "")
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
    () => controller.resolutionContent.value,
    async () => {
      await nextTick()
      controller.attachEventListeners()
    },
    { immediate: true }
  )

  defineExpose({
    totalPages: controller.totalPages.bind(controller),
    getApplication: controller.getApplication.bind(controller),
    updateApplicationContent: controller.updateApplicationContent.bind(controller),
    isLoading: controller.isLoading.value,
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Resolutions/AppointAuthorisedPerson" as *;
</style>
