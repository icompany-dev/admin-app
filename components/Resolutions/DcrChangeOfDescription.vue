<template>
  <div id="dcr-change-of-descriptions">
    <Resolution
      v-bind="controller.resolutionProps"
      @signed="emit('signed', $event)"
    >
      <template #page1>
        <p>
          <b>RESOLVED:</b>
          <br />
          <b>CHANGE OF BUSINESS NATURE</b>
        </p>
        <p>
          THAT the change of business nature of the Company to:
          <br v-if="!controller.isDocumentEditable()" />
          <br v-if="!controller.isDocumentEditable()" />
          <span
            v-if="!controller.isDocumentEditable()"
            v-html="controller.businessDescription()"
            class="business-description"
            :class="{ placeholder: controller.isInPreviewMode.value }"
          />
        </p>
        <div v-if="controller.isDocumentEditable()">
          <textarea
            v-model="controller.businessDescriptionValue.value"
            class="in-resolution"
            @change="controller.onDescriptionChanged()"
            rows="4"
          />
        </div>
        <p>is hereby accepted and confirmed.</p>
        <FurtherResolved />
      </template>
    </Resolution>
  </div>
</template>

<script setup lang="ts">
  import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
  import FurtherResolved from "./FurtherResolved.vue"
  import Resolution from "./Resolution.vue"
  import { DcrChangeOfDescriptionsController } from "~/scripts/components/resolutions/DcrChangeOfDescriptionsController"
  import type { CompanyAmendmentDescription } from "~/scripts/models/CompanyAmendmentDescription"

  const props = defineProps<IPropsResolutionDocument<CompanyAmendmentDescription>>()

  const emit = defineEmits(["startLoading", "doneLoading", "signed"])

  const controller = new DcrChangeOfDescriptionsController(props, emit)

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
    }
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
  @use "~/assets/scss/components/Resolutions/ChangeOfDescriptions" as *;
</style>
