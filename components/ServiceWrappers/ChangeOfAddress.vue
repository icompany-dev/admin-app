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
        <DcrChangeOfAddress
          ref="dcrRef"
          v-bind="controller.resolutionDocumentProps"
        />
      </TransitionGroup>
    </div>
    <ActionTray :actions="controller.actionTrayElements.value" />
  </div>
</template>

<script setup lang="ts">
  import ActionTray from "@/components/ActionTrays/ActionTray.vue"
  import DcrChangeOfAddress from "../Resolutions/DcrChangeOfAddress.vue"
  import { ChangeOfAddressController } from "~/scripts/components/service-wrappers/ChangeOfAddressController"

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

  const emit = defineEmits(["zoomOut", "zoomIn", "back"])

  const dcrRef = ref(null)

  const controller = new ChangeOfAddressController(props.companyId, emit, props.applicationId)

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
