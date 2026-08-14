<template>
  <div
    id="section-201-service"
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
        <Section201
          ref="dcrRef"
          :company-name="controller.name.value"
          :registration-number="controller.registrationNumber.value"
          :signature-item="controller.signatureItem.value"
          :has-signed="controller.hasSigned()"
          :signature-date="controller.signatureDate()"
          @signed="controller.onSigned($event)"
          @applicationUpdated="emit('applicationUpdated', $event)"
        />
      </TransitionGroup>
    </div>
    <ActionTray :actions="controller.actionTrayElements.value" />
  </div>
</template>

<script setup lang="ts">
  import ActionTray from "@/components/ActionTrays/ActionTray.vue"
  import Section201 from "../LegalDocuments/Section201.vue"
  import { Section201Controller } from "~/scripts/components/service-wrappers/Section201Controller"

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

  const controller = new Section201Controller(props.applicationId, emit)

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
