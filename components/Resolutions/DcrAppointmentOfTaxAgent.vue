<template>
  <div
    id="dcr-appointment-of-tax-agent"
    ref="documentRef"
  >
    <Resolution
      v-bind="controller.resolutionProps"
      @signed="emit('signed', $event)"
      :additional-css-class="'dcr-appointment-of-tax-agent'"
    >
      <template #page1>
        <div
          ref="resolutionContent"
          class="resolution-content"
          v-html="controller.resolutionContent.value"
          @change="controller.onTaxAgentInformationChanged($event)"
        />
      </template>
    </Resolution>
  </div>
</template>

<script setup lang="ts">
  import Resolution from "./Resolution.vue"
  import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
  import { CompanyAppointmentOfTaxAgent } from "~/scripts/models/CompanyAppointmentOfTaxAgent"
  import { DcrAppointmentOfTaxAgentController } from "~/scripts/components/resolutions/DcrAppointmentOfTaxAgentController"

  const props = defineProps<IPropsResolutionDocument<CompanyAppointmentOfTaxAgent>>()

  const resolutionContent = ref(null)
  const documentRef = ref(null)

  const emit = defineEmits(["startLoading", "doneLoading", "signed", "updated"])

  const controller = new DcrAppointmentOfTaxAgentController(props, emit)

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
    documentRef,
    (newVal) => {
      controller.setDocumentRef(newVal)
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
    lockDocumentEdit: controller.lockDocumentEdit.bind(controller),
    totalPages: controller.totalPages.bind(controller),
    getPdfPages: controller.getPdfPages.bind(controller),
    getApplication: controller.getApplication.bind(controller),
    updateApplicationContent: controller.updateApplicationContent.bind(controller),
    isLoading: controller.isLoading.value,
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Resolutions/AppointmentOfTaxAgent" as *;
</style>
