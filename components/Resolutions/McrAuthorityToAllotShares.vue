<template>
  <div
    id="mcr-share-authorization"
    ref="documentRef"
  >
    <Resolution
      v-bind="controller.resolutionProps"
      @signed="emit('signed', $event)"
    >
      <template
        #paperMargins1
        v-if="controller.isDocumentEditable()"
      >
        <div class="paper-tag point-right purpose-tag">Select Applicable</div>
      </template>
      <template
        #paperMargins2
        v-if="controller.isDocumentEditable()"
      >
        <div class="paper-tag point-right authorised-tag">Select Applicable</div>
        <div class="paper-tag point-right effective-date-tag">Complete This</div>
      </template>
      <template #page1>
        <div
          ref="resolutionContent"
          class="resolution-content"
          v-html="controller.resolutionContentPage1.value"
        />
      </template>
      <template #page2>
        <div
          ref="resolutionContent"
          class="resolution-content"
          v-html="controller.resolutionContentPage2.value"
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
  import { McrAuthorityToAllotSharesController } from "~/scripts/components/resolutions/McrAuthorityToAllotSharesController"
  import type { CompanyShareAuthorization } from "~/scripts/models/CompanyShareAuthorization"
  import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

  const props = defineProps<IPropsResolutionDocument<CompanyShareAuthorization>>()

  const resolutionContent = ref(null)
  const documentRef = ref(null)

  const emit = defineEmits(["startLoading", "doneLoading", "signed"])

  const controller = new McrAuthorityToAllotSharesController(props, emit)

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
    async (newVal) => {
      await nextTick()
      controller.attachEventListeners()
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
    isLoading: controller.isLoading.value,
    getPdfPages: controller.getPdfPages.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Resolutions/McrAuthorityToAllotShares" as *;
</style>
