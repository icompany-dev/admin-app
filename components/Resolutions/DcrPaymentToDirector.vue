<template>
  <div
    id="dcr-payment-to-director"
    ref="documentRef"
  >
    <Resolution
      v-bind="controller.resolutionProps"
      @signed="emit('signed', $event)"
    >
      <!-- <template
        #paperMargins1
        v-if="props.isShowTag"
      >
        <div class="paper-tag point-right info-required">Information Required</div>
      </template> -->
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

<script lang="ts" setup>
  import type { CompanyDirectorPayment } from "~/scripts/models/CompanyDirectorPayment"
  import Resolution from "./Resolution.vue"
  import { DcrPaymentToDirectorController } from "~/scripts/components/resolutions/DcrPaymentToDirectorController"
  import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
  import type { TypeOfPaymentToDirectors } from "~/scripts/constants/PaymentToDirectors"

  const props = defineProps<IPropsResolutionDocument<CompanyDirectorPayment>>()

  const emit = defineEmits(["startLoading", "doneLoading", "signed", "dataChanged"])

  const resolutionContent = ref(null)
  const documentRef = ref(null)

  const controller = new DcrPaymentToDirectorController(props, emit)

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
    () => props.type,
    (newVal) => {
      controller.setTypeOfPaymentToDirectors(newVal as TypeOfPaymentToDirectors)
    }
  )

  watch(
    () => controller.resolutionContent.value,
    (newVal) => {
      nextTick(() => {
        controller.attachEventListeners()
      })
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
  @use "~/assets/scss/components/Resolutions/DcrPaymentToDirector" as *;
</style>
