<template>
  <div id="dcr-convene-remove-director-meeting">
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
  import { DcrConveneRemoveDirectorMeetingController } from "~/scripts/components/resolutions/DcrConveneRemoveDirectorMeetingController"
  import Resolution from "./Resolution.vue"
  import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
  import type { CompanyDirectorRemoval } from "~/scripts/models/CompanyDirectorRemoval"

  const props = defineProps<IPropsResolutionDocument<CompanyDirectorRemoval>>()

  const resolutionContent = ref(null)

  const emit = defineEmits(["startLoading", "doneLoading", "signed"])

  const controller = new DcrConveneRemoveDirectorMeetingController(props, emit)

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
    async (newVal) => {
      console.log(controller.application.value?.egmVenue)
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
