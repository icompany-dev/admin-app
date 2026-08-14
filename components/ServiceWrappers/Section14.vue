<template>
  <div
    id="appointment-of-director"
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
        <Section14
          ref="dcrRef"
          :application="controller.applicationIncorporate.value"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
  import Section14 from "../LegalDocuments/Section14.vue"
  import { Section14Controller } from "~/scripts/components/service-wrappers/Section14Controller"

  const props = defineProps({
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
      default: false,
    },
  })

  const dcrRef = ref(null)

  const emit = defineEmits(["zoomOut", "zoomIn", "back", "applicationUpdated"])

  const controller = new Section14Controller(props.applicationId, emit)

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
