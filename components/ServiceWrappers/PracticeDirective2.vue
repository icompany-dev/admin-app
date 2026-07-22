<template>
  <div
    id="change-of-address"
    class="cosec-service-documents"
    :class="{ 'full-size': props.isDocumentEnlarged }"
  >
    <div
      class="documents-section"
      :class="{ invert: controller.showMcrFirst.value }"
      @click="emit('zoomIn')"
      :style="controller.getZoomStyle()"
    >
      <TransitionGroup
        name="flip"
        tag="div"
        class="document-transition-wrapper"
      >
        <PracticeDirective2
          ref="dcrRef"
          v-bind="controller.practiceDirective2Props"
        />
      </TransitionGroup>
    </div>
    <ActionTray :actions="controller.actionTrayElements.value" />
  </div>
</template>

<script setup lang="ts">
  import ActionTray from "@/components/ActionTrays/ActionTray.vue"
  import PracticeDirective2 from "../LegalDocuments/PracticeDirective2.vue"
  import { PracticeDirective2Controller } from "~/scripts/components/service-wrappers/PracticeDirective2Controller"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
    applicationId: {
      type: String,
      default: null,
    },
    isDocumentEnlarged: {
      type: Boolean,
      default: false,
    },
    isInPreviewMode: {
      type: Boolean,
      default: true,
    },
    showWatermarkText: {
      type: Boolean,
      default: true,
    },
    watermarkText: {
      type: String,
      default: "DRAFT",
    },
    targetType: {
      type: String,
      required: true,
    },
  })

  const emit = defineEmits(["zoomOut", "zoomIn", "back"])

  const dcrRef = ref(null)

  const controller = new PracticeDirective2Controller(props.companyId, props.targetType, emit, props.applicationId)

  watch(
    () => props.applicationId,
    (newVal) => {
      controller.applicationId = newVal
      controller.fetchApplication(newVal)
    }
  )

  watch(
    () => props.targetType,
    (newVal) => [controller.setTargetType(newVal)]
  )

  watch(
    dcrRef,
    (newVal) => {
      controller.setDcrRef(newVal)
    },
    { immediate: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Services/CosecServiceDocuments" as *;
</style>
