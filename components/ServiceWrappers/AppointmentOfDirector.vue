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
        <DcrAppointmentOfDirector
          ref="dcrRef"
          v-bind="controller.resolutionDocumentProps"
          @signed="controller.onSigned($event)"
          @applicationUpdated="emit('applicationUpdated', $event)"
        />
        <McrAppointmentOfDirector
          ref="mcrRef"
          v-if="props.isByShareholder"
          v-bind="controller.resolutionDocumentProps"
          @signed="controller.onSigned($event)"
          @applicationUpdated="emit('applicationUpdated', $event)"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
  import DcrAppointmentOfDirector from "../Resolutions/DcrAppointmentOfDirector.vue"
  import McrAppointmentOfDirector from "../Resolutions/McrAppointmentOfDirector.vue"
  import { AppointmentOfDirectorController } from "~/scripts/components/service-wrappers/AppointmentOfDirectorController"

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
  })

  const dcrRef = ref(null)
  const mcrRef = ref(null)

  const emit = defineEmits(["zoomOut", "zoomIn", "back", "applicationUpdated"])

  const controller = new AppointmentOfDirectorController(
    props.companyId,
    emit,
    props.isByShareholder,
    props.applicationId
  )

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
