<template>
  <div
    id="register-transfer-of-shares"
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
        <DcrRegisterTransferOfShares
          ref="dcrRef"
          v-bind="controller.resolutionDocumentProps"
          @signed="controller.onSigned($event)"
        />
      </TransitionGroup>
    </div>
    <ActionTray :actions="controller.actionTrayElements.value" />
  </div>
</template>

<script setup lang="ts">
  import ActionTray from "../ActionTrays/ActionTray.vue"
  import DcrRegisterTransferOfShares from "../Resolutions/DcrRegisterTransferOfShares.vue"
  import { RegisterTransferOfSharesController } from "~/scripts/components/service-wrappers/RegisterTransferOfSharesController"

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
  })

  const dcrRef = ref(null)
  const mcrRef = ref(null)

  const emit = defineEmits(["zoomOut", "zoomIn", "back", "applicationUpdated"])

  const controller = new RegisterTransferOfSharesController(props.companyId, emit, props.applicationId)

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
