<template>
  <div id="dcr-lodge-annual-return">
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
  import Resolution from "./Resolution.vue"
  import { DcrAcknowledgementOfResignationController } from "~/scripts/components/resolutions/DcrAcknowledgementOfResignationController"
  import type { CompanyDirectorResignation } from "~/scripts/models/CompanyDirectorResignation"
  import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

  const props = defineProps<IPropsResolutionDocument<CompanyDirectorResignation>>()

  const resolutionContent = ref(null)

  const emit = defineEmits(["startLoading", "doneLoading", "signed"])

  const controller = new DcrAcknowledgementOfResignationController(props, emit)

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

  defineExpose({
    totalPages: controller.totalPages.bind(controller),
    getApplication: controller.getApplication.bind(controller),
    updateApplicationContent: controller.updateApplicationContent.bind(controller),
    isLoading: controller.isLoading.value,
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Resolutions/LodgeAnnualReturn" as *;
</style>
