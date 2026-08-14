<template>
  <div id="dcr-lodge-annual-return">
    <Resolution
      v-bind="controller.resolutionProps"
      @signed="emit('signed', $event)"
      @abstain="emit('abstain')"
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
  import Resolution from "@/components/Resolutions/Resolution.vue"
  import { DcrLodgeAnnualReturnController } from "~/scripts/components/resolutions/DcrLodgeAnnualReturnController"
  import type { CompanyAnnualReturnRequest } from "~/scripts/models/CompanyAnnualReturnRequest"
  import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
  import { StringUtil } from "~/scripts/utils/String"

  const props = defineProps<IPropsResolutionDocument<CompanyAnnualReturnRequest>>()

  const resolutionContent = ref(null)

  const emit = defineEmits(["startLoading", "doneLoading", "signed", "abstain"])

  const controller = new DcrLodgeAnnualReturnController(props, emit)

  watch(
    () => props.applicationId,
    (newVal) => {
      if (!StringUtil.isNullOrEmpty(newVal)) {
        controller.setApplicationId(newVal)
      }
    }
  )

  watch(
    () => props.yearToLodge,
    (newVal) => {
      controller.setYearToLodge(newVal ?? "")
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
  @use "~/assets/scss/components/Resolutions/LodgeAnnualReturn" as *;
</style>
