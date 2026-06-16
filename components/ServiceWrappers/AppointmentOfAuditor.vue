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
        <DcrAppointmentOfAuditor
          ref="dcrRef"
          v-bind="controller.resolutionDocumentProps"
          @signed="controller.onSigned($event)"
          @partnerSelected="controller.onPartnerSelected($event)"
        />
        <NominationOfAuditor
          ref="nominationRef"
          :company-id="controller.companyId"
          :application-id="controller.applicationId ?? ''"
          :is-in-preview-mode="controller.isInPreviewMode.value"
          @signed="controller.onNominationLetterSigned($event)"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
  import DcrAppointmentOfAuditor from "../Resolutions/DcrAppointmentOfAuditor.vue"
  import NominationOfAuditor from "../LegalDocuments/NominationOfAuditor.vue"
  import { AppointmentOfAuditorController } from "~/scripts/components/service-wrappers/AppointmentOfAuditorController"

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
  })

  const dcrRef = ref(null)
  const nominationRef = ref(null)

  const emit = defineEmits(["zoomOut", "zoomIn", "makePayment", "back", "applicationUpdated"])

  const controller = new AppointmentOfAuditorController(props.companyId, emit, props.applicationId)

  watch(
    dcrRef,
    (newVal) => {
      controller.setDcrRef(newVal)
    },
    { immediate: true }
  )
  watch(
    nominationRef,
    (newVal) => {
      controller.setNominationRef(newVal)
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
