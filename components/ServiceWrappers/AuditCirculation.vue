<template>
  <div
    id="audit-circulation"
    class="cosec-service-documents"
    :class="{ 'full-size': props.isDocumentEnlarged }"
  >
    <div
      class="documents-section"
      @click="emit('zoomIn')"
      :style="controller.getZoomStyle()"
    >
      <TransitionGroup
        name="flip"
        tag="div"
        class="document-transition-wrapper"
      >
        <DcrAuditCirculation
          ref="dcr"
          v-bind="controller.resolutionDocumentProps"
          @signed="controller.onSigned($event)"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
  import DcrAuditCirculation from "../Resolutions/DcrAuditCirculation.vue"
  import { AuditCirculationController } from "~/scripts/components/service-wrappers/AuditCirculationController"

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

  const dcr = ref(null)
  const emit = defineEmits(["zoomOut", "zoomIn", "back"])

  const controller = new AuditCirculationController(props.companyId, emit, props.applicationId)

  watch(
    dcr,
    (newVal) => {
      controller.setDcrRef(newVal)
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
