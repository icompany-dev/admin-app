<template>
  <div
    id="appointment-of-director"
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
        <DcrAllotmentOfShares
          ref="dcrRef"
          v-bind="controller.resolutionDocumentProps"
          @signed="controller.onSigned($event)"
          @changed="controller.onDcrChanged()"
        />
        <McrAllotmentOfShares
          ref="mcrRef"
          v-bind="controller.resolutionDocumentProps"
          @signed="controller.onSigned($event)"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
  import DcrAllotmentOfShares from "../Resolutions/DcrAllotmentOfShares.vue"
  import McrAllotmentOfShares from "../Resolutions/McrAllotmentOfShares.vue"
  import { AllotmentOfSharesController } from "~/scripts/components/service-wrappers/AllotmentOfSharesController"

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
  })

  const dcrRef = ref(null)
  const mcrRef = ref(null)

  const emit = defineEmits(["zoomOut", "zoomIn", "back", "applicationUpdated"])

  const controller = new AllotmentOfSharesController(props.companyId, emit, props.applicationId)

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

  watch(
    () => props.applicationId,
    (newVal) => {
      if (newVal) {
        controller.fetchApplication(newVal)
      }
    }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Services/CosecServiceDocuments" as *;
</style>
