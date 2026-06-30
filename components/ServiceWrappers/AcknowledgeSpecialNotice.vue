<template>
  <div
    id="services-acknowledge-special-notice"
    class="cosec-service-documents"
    :class="{ 'full-size': props.isDocumentEnlarged }"
  >
    <div
      class="documents-section"
      @click="emit('zoomIn')"
    >
      <TransitionGroup
        name="flip"
        tag="div"
        class="document-transition-wrapper"
      >
        <SpecialNoticeEgmAcknowledgement
          ref="documentRef"
          :meeting-id="controller.meetingId.value"
          :company-id="controller.companyId.value"
          @signed="controller.onSigned($event)"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import SpecialNoticeEgmAcknowledgement from "@/components/LegalDocuments/SpecialNoticeEgmAcknowledgement.vue"
  import { AcknowledgeSpecialNoticeController } from "~/scripts/components/service-wrappers/AcknowledgeSpecialNoticeController"

  const props = defineProps({
    meetingId: {
      type: String,
      required: true,
    },
    companyId: {
      type: String,
      required: true,
    },
    isDocumentEnlarged: {
      type: Boolean,
      default: false,
    },
  })

  const emit = defineEmits(["back", "zoomIn", "isUpdating", "isUpdated"])

  const documentRef = ref(null)

  const controller = new AcknowledgeSpecialNoticeController(props.meetingId, props.companyId, emit)

  watch(
    () => props.meetingId,
    (newVal) => {
      controller.setMeetingId(newVal)
    }
  )

  watch(
    () => props.companyId,
    (newVal) => {
      controller.setCompanyId(newVal)
    }
  )

  watch(
    documentRef,
    (newVal) => {
      controller.setDocumentRef(newVal)
    },
    { immediate: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Services/CosecServiceDocuments" as *;
</style>
