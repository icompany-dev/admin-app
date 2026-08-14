<template>
  <div id="dcr-set-financial-year-end">
    <Resolution
      v-bind="controller.resolutionProps"
      @signed="controller.onSigned($event)"
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
  import { DcrSetFinancialYearEndController } from "~/scripts/components/resolutions/DcrSetFinancialYearEndController"
  import type { CompanySetFinancialYearEnd } from "~/scripts/models/CompanySetFinancialYearEnd"
  import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

  const props = defineProps<IPropsResolutionDocument<CompanySetFinancialYearEnd>>()

  const resolutionContent = ref(null)

  const emit = defineEmits(["startLoading", "doneLoading", "signed"])

  const controller = new DcrSetFinancialYearEndController(props, emit)

  watch(
    () => props.applicationId,
    (newVal) => {
      controller.setApplicationId(newVal)
    }
  )

  watch(
    () => props.type,
    (newVal) => {
      controller.setApplicationType(newVal ?? "")
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
  @use "~/assets/scss/components/Resolutions/SetFinancialYearEnd" as *;
</style>
