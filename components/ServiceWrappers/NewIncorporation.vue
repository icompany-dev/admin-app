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
          v-if="controller.showSection14.value"
          :application="controller.applicationIncorporate.value"
          :is-document-enlarged="props.isDocumentEnlarged"
          :is-in-preview-mode="props.isInPreviewMode"
        />
        <Section201
          v-if="controller.showSection201.value"
          :application-id="controller.directorInvitationId.value"
          :is-document-enlarged="props.isDocumentEnlarged"
          :is-in-preview-mode="props.isInPreviewMode"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
  import Section14 from "./Section14.vue"
  import Section201 from "./Section201.vue"
  import { NewIncorporationController } from "~/scripts/components/service-wrappers/NewIncorporationController"

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

  const controller = new NewIncorporationController(props.applicationId, emit)

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
