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
        <!-- <LetterChangeReassignCoSec
          ref="letterChangeReassignCoSecRef"
          v-if="controller.showReassignLetter()"
          v-bind="controller.letterChangeReassignCosecProps"
        /> -->
        <DcrAppointmentOfNewCompanySecretary
          ref="dcrRef"
          :is-on-preview="props.isInPreviewMode"
          :application="controller.applicationSwitch.value"
          :show-watermark="controller.showWatermark()"
          :watermark-text="controller.watermarkText()"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
  import LetterChangeReassignCoSec from "../LegalDocuments/LetterChangeReassignCoSec.vue"
  import DcrAppointmentOfNewCompanySecretary from "../Resolutions/DcrAppointmentOfNewCompanySecretary.vue"
  import { NewSwitchController } from "~/scripts/components/service-wrappers/NewSwitchController"

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

  const controller = new NewSwitchController(props.applicationId, emit)

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
