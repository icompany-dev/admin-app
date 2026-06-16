<template>
  <div id="dcr-appointment-of-director">
    <Resolution
      v-bind="controller.resolutionProps"
      @signed="emit('signed', $event)"
    >
      <template #page1>
        <div
          ref="resolutionContent"
          class="resolution-content"
          v-html="controller.dcrResolutionContent.value"
        />
      </template>
    </Resolution>
  </div>
</template>

<script setup lang="ts">
  import Resolution from "./Resolution.vue"
  import { DcrAppointmentOfDirectorController } from "~/scripts/components/resolutions/DcrAppointmentOfDirectorController"
  import { CompanyDirectorAppointment } from "~/scripts/models/CompanyDirectorAppointment"
  import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

  const props = defineProps<IPropsResolutionDocument<CompanyDirectorAppointment>>()

  const resolutionContent = ref(null)

  const emit = defineEmits(["startLoading", "doneLoading", "totalPageChanged", "applicationUpdated", "signed"])

  const controller = new DcrAppointmentOfDirectorController(props, emit)

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
    () => controller.dcrResolutionContent.value,
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
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Resolutions/AppointmentOfDirector" as *;
</style>
