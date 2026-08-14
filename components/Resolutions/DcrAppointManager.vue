<template>
  <div id="dcr-appoint-manager">
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

<script lang="ts" setup>
  import Resolution from "./Resolution.vue"
  import { DcrAppointManagerController } from "~/scripts/components/resolutions/DcrAppointManagerController"
  import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
  import type { CompanyDirectorManagerAppointment } from "~/scripts/models/CompanyDirectorManagerAppointment"

  const props = defineProps<IPropsResolutionDocument<CompanyDirectorManagerAppointment>>()

  const emit = defineEmits(["startLoading", "doneLoading", "signed"])

  const resolutionContent = ref(null)

  const controller = new DcrAppointManagerController(props, emit)

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

  defineExpose({
    totalPages: controller.totalPages.bind(controller),
    getApplication: controller.getApplication.bind(controller),
    updateApplicationContent: controller.updateApplicationContent.bind(controller),
    isLoading: controller.isLoading.value,
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Resolutions/DcrAppointManager" as *;
</style>
