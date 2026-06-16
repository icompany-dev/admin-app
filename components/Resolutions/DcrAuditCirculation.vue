<template>
  <div id="dcr-appointment-of-auditor">
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
  import { StringUtil } from "~/scripts/utils/String"
  import Resolution from "./Resolution.vue"
  import { DcrAuditCirculationController } from "@/scripts/components/resolutions/DcrAuditCirculationController"
  import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
  import { CompanyAuditCirculation } from "~/scripts/models/CompanyAuditCirculation"

  const props = defineProps<IPropsResolutionDocument<CompanyAuditCirculation>>()

  const resolutionContent = ref(null)

  const emit = defineEmits(["startLoading", "doneLoading", "signed"])

  const controller = new DcrAuditCirculationController(props, emit)

  watch(
    () => props.applicationId,
    async (newVal) => {
      controller.setApplicationId(newVal)
      controller.setContent()
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

  defineExpose({
    totalPages: controller.totalPages.bind(controller),
    getApplication: controller.getApplication.bind(controller),
    updateApplicationContent: controller.updateApplicationContent.bind(controller),
    isLoading: controller.isLoading.value,
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Resolutions/AppointmentOfAuditor" as *;
</style>
