<template>
  <div id="dcr-appoint-Chairman">
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
  import { DcrAppointChairmanController } from "~/scripts/components/resolutions/DcrAppointChairmanController"
  import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
  import type { CompanyDirectorManagerAppointment } from "~/scripts/models/CompanyDirectorManagerAppointment"

  const props = defineProps<IPropsResolutionDocument<CompanyDirectorManagerAppointment>>()

  const emit = defineEmits(["startLoading", "doneLoading", "signed"])

  const resolutionContent = ref(null)

  const controller = new DcrAppointChairmanController(props, emit)

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
    () => controller.resolutionContent.value,
    async () => {
      await nextTick()
      controller.attachEventListeners()
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
  @use "~/assets/scss/components/Resolutions/DcrAppointChairman" as *;
</style>
