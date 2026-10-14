<template>
  <div
    id="loan-to-director"
    class="cosec-service-documents"
    :class="{ 'full-size': props.isDocumentEnlarged }"
  >
    <div
      class="documents-section"
      :class="{ invert: controller.isShowMcrFirst }"
      v-keyboard-click
      @click="emit('zoomIn')"
      :style="controller.getZoomStyle()"
    >
      <TransitionGroup
        name="flip"
        tag="div"
        class="document-transition-wrapper"
      >
        <DcrPaymentToDirector
          ref="dcrRef"
          v-bind="controller.resolutionDocumentProps"
          @signed="controller.onSigned($event)"
          @dataChanged="controller.onDcrApplicationUpdated()"
          @applicationUpdated="emit('applicationUpdated', $event)"
        />
        <McrPaymentToDirector
          ref="mcrRef"
          v-bind="controller.resolutionDocumentProps"
          @signed="controller.onSigned($event)"
          @dataChanged="controller.onMcrApplicationUpdated()"
          @applicationUpdated="emit('applicationUpdated', $event)"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
  import DcrPaymentToDirector from "../Resolutions/DcrPaymentToDirector.vue"
  import McrPaymentToDirector from "../Resolutions/McrPaymentToDirector.vue"
  import { PaymentToDirectorController } from "~/scripts/components/service-wrappers/PaymentToDirectorController"

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
    isByShareholder: {
      type: Boolean,
      default: false,
    },
    showWatermarkText: {
      type: Boolean,
      default: true,
    },
    watermarkText: {
      type: String,
      default: "DRAFT",
    },
  })

  const dcrRef = ref(null)
  const mcrRef = ref(null)

  const emit = defineEmits(["zoomOut", "zoomIn", "back", "applicationUpdated"])

  const controller = new PaymentToDirectorController(props.companyId, emit, props.applicationId)

  watch(
    dcrRef,
    (newVal) => {
      controller.setDcrRef(newVal)
    },
    { immediate: true }
  )

  watch(
    mcrRef,
    (newVal) => {
      controller.setMcrRef(newVal)
    },
    { immediate: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Services/CosecServiceDocuments" as *;
</style>
