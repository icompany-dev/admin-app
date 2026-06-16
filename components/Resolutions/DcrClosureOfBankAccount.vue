<template>
  <div id="dcr-closure-of-bank-account">
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
  import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
  import { DcrClosureOfBankAccountController } from "~/scripts/components/resolutions/DcrClosureOfBankAccountController"
  import { CompanyBankAccountClosure } from "~/scripts/models/CompanyBankAccountClosure"

  const props = defineProps<IPropsResolutionDocument<CompanyBankAccountClosure>>()

  const resolutionContent = ref(null)

  const emit = defineEmits(["startLoading", "doneLoading", "signed"])

  const controller = new DcrClosureOfBankAccountController(props, emit)

  watch(
    () => props.applicationId,
    (newVal) => {
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
    () => props.companyBankId,
    (newVal) => {
      controller.setCompanyBankId(newVal)
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
    () => controller.resolutionContent.value,
    async () => {
      await nextTick()
      controller.attachEventListeners()
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
  @use "~/assets/scss/components/Resolutions/DcrClosureOfBankAccount" as *;
</style>
