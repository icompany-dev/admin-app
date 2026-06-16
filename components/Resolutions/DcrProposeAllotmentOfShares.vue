<template>
  <div id="dcr-propose-allotment-of-shares">
    <Resolution
      v-bind="controller.resolutionProps"
      @signed="emit('signed', $event)"
    >
      <template #page1>
        <div
          ref="resolutionContent"
          class="resolution-content"
          v-html="controller.resolutionContent.value"
          @input="controller.setDataInput($event)"
        />
      </template>
    </Resolution>
  </div>
</template>

<script setup lang="ts">
  import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
  import Resolution from "./Resolution.vue"
  import { DcrProposeAllotmentOfSharesController } from "~/scripts/components/resolutions/DcrProposeAllotmentOfSharesController"
  import type { CompanyShareIssuance } from "~/scripts/models/CompanyShareIssuance"

  const props = defineProps<IPropsResolutionDocument<CompanyShareIssuance>>()

  const resolutionContent = ref(null)

  const emit = defineEmits(["startLoading", "doneLoading", "signed", "preferenceShareSelected"])

  const controller = new DcrProposeAllotmentOfSharesController(props, emit)

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

  defineExpose({
    totalPages: controller.totalPages.bind(controller),
    getApplication: controller.getApplication.bind(controller),
    updateApplicationContent: controller.updateApplicationContent.bind(controller),
    isLoading: controller.isLoading.value,
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Resolutions/ProposeAllotmentOfShares" as *;
</style>
