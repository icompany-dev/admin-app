<template>
  <div
    id="dcr-change-of-company-secretary"
    ref="documentRef"
  >
    <Resolution
      v-bind="controller.resolutionProps"
      @signed="emit('signed', $event)"
    >
      <!-- <template #paperMargins1>
        <TransitionGroup name="fade">
          <div
            class="paper-tag point-right cosec-names"
            v-if="controller.isShowCosecNameTag"
          >
            Complete This
          </div>
          <div
            class="paper-tag point-right new-cosec-names"
            v-if="controller.isShowNewCosecNameTag"
          >
            Complete This
          </div>
          <div
            class="paper-tag point-left resignation-date"
            v-if="controller.isShowResignationDateTag"
          >
            Complete This
          </div>
          <div
            class="paper-tag point-left appointment-date"
            v-if="controller.isShowAppointmentDateTag"
          >
            Complete This
          </div>
        </TransitionGroup>
      </template> -->
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
  import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
  import Resolution from "./Resolution.vue"
  import { DcrChangeOfCompanySecretaryController } from "~/scripts/components/resolutions/DcrChangeOfCompanySecretaryController"
  import type { CompanySwitchOut } from "~/scripts/models/CompanySwitchOut"

  const props = defineProps<IPropsResolutionDocument<CompanySwitchOut>>()

  const resolutionContent = ref(null)

  const documentRef = ref(null)

  const emit = defineEmits(["startLoading", "doneLoading", "signed"])

  const controller = new DcrChangeOfCompanySecretaryController(props, emit)

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
    },
    { immediate: true }
  )

  watch(documentRef, (newVal) => {
    controller.setDocumentRef(newVal)
  })

  defineExpose({
    totalPages: controller.totalPages.bind(controller),
    getApplication: controller.getApplication.bind(controller),
    updateApplicationContent: controller.updateApplicationContent.bind(controller),
    isLoading: controller.isLoading.value,
    getPdfPages: controller.getPdfPages.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Resolutions/DcrChangeOfCompanySecretary" as *;
</style>
