<template>
  <div id="mcr-loan-to-director">
    <Resolution
      v-bind="controller.resolutionProps"
      @signed="emit('signed', $event)"
    >
      <template #page1>
        <div
          ref="resolutionContent"
          class="resolution-content"
          v-html="controller.mcrResolutionContent.value"
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
``
<script setup lang="ts">
  import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
  import Resolution from "./Resolution.vue"
  import { McrLoanToDirectorController } from "~/scripts/components/resolutions/McrLoanToDirectorController"
  import type { CompanyDirectorLoan } from "~/scripts/models/CompanyDirectorLoan"

  const props = defineProps<IPropsResolutionDocument<CompanyDirectorLoan>>()

  const resolutionContent = ref(null)

  const emit = defineEmits([
    "startLoading",
    "doneLoading",
    "totalPageChanged",
    "applicationUpdated",
    "signed",
    "dataChanged",
  ])

  const controller = new McrLoanToDirectorController(props, emit)

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
    () => controller.application.value,
    (newVal) => {
      if (newVal) {
        emit("applicationUpdated", newVal)
      }
    },
    { deep: true }
  )

  watch(
    () => controller.mcrResolutionContent.value,
    async () => {
      await nextTick()
      controller.attachEventListeners()
    },
    { immediate: true }
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

  defineExpose({
    totalPages: controller.totalPages.bind(controller),
    getApplication: controller.getApplication.bind(controller),
    updateApplicationContent: controller.updateApplicationContent.bind(controller),
    onDataChanged: controller.onDataChanged.bind(controller),
  })
</script>
