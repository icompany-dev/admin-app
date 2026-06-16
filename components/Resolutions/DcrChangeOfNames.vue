<template>
  <div
    id="dcr-change-of-names"
    ref="documentRef"
  >
    <Resolution
      v-bind="controller.resolutionProps"
      @total-page-changed="emit('totalPageChanged')"
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
  import { DcrChangeOfNamesController } from "~/scripts/components/resolutions/DcrChangeOfNamesController"
  import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
  import type { CompanyAmendmentName } from "~/scripts/models/CompanyAmendmentName"

  const props = defineProps<IPropsResolutionDocument<CompanyAmendmentName>>()

  const emit = defineEmits(["startLoading", "doneLoading", "totalPageChanged", "nameChanged", "signed"])

  const documentRef = ref(null)

  const controller = new DcrChangeOfNamesController(props, emit)

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
    }
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
    documentRef,
    (newVal) => {
      controller.setDocumentRef(newVal)
    },
    { immediate: true }
  )

  defineExpose({
    totalPages: controller.totalPages.bind(controller),
    getApplication: controller.getApplication.bind(controller),
    updateApplicationContent: controller.updateApplicationContent.bind(controller),
    getPdfPages: controller.getPdfPages.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Resolutions/ChangeOfNames" as *;
</style>
