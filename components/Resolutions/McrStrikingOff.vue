<template>
  <div id="mcr-striking-off">
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
      <template
        #accompanying-document
        v-if="controller.hasAccompanyingDocument.value"
      >
        <div v-html="controller.accompanyingDocumentContent.value" />
      </template>
    </Resolution>
  </div>
</template>

<script setup lang="ts">
  import Resolution from "./Resolution.vue"
  import { McrStrikingOffController } from "~/scripts/components/resolutions/McrStrikingOffController"
  import { CompanyStrikingOffResolution } from "~/scripts/models/CompanyStrikingOffResolution"
  import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
  import { StringUtil } from "~/scripts/utils/String"

  const props = defineProps<IPropsResolutionDocument<CompanyStrikingOffResolution>>()

  const resolutionContent = ref(null)

  const emit = defineEmits(["startLoading", "doneLoading", "signed"])

  const controller = new McrStrikingOffController(props, emit)

  watch(
    () => props.applicationId,
    (newVal) => {
      controller.setApplicationId(newVal ?? "")
    }
  )

  watch(
    () => props.isInPreviewMode,
    (newVal) => {
      controller.setIsInPreviewMode(newVal)
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

  defineExpose({
    totalPages: controller.totalPages.bind(controller),
    getApplication: controller.getApplication.bind(controller),
    updateApplicationContent: controller.updateApplicationContent.bind(controller),
    isLoading: controller.isLoading.value,
    refreshData: controller.refreshData.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Resolutions/StrikingOff" as *;
</style>
