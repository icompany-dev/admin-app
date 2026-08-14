<template>
  <div
    id="change-of-name"
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
        <ThirdSchedule />
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
  import ThirdSchedule from "@/components/LegalDocuments/ThirdSchedule.vue"
  import { ThirdScheduleDocumentController } from "~/scripts/components/service-wrappers/ThirdScheduleDocumentController"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
    isDocumentEnlarged: {
      type: Boolean,
      default: false,
    },
  })

  const emit = defineEmits(["zoomIn"])

  const controller = new ThirdScheduleDocumentController(props.companyId, emit)
</script>

<style lang="scss">
  @use "~/assets/scss/components/Services/CosecServiceDocuments" as *;
</style>
