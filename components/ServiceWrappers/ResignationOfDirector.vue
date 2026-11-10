<template>
  <div
    id="resignation-of-director"
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
        <NoticeOfResignation
          ref="noticeRef"
          :company-id="props.companyId"
          :director-id="controller.application.directorId"
          :is-in-preview-mode="props.isInPreviewMode"
          :application-id="props.applicationId"
          @signed="controller.onSigned($event)"
        />
      </TransitionGroup>
    </div>
    <ActionTray :actions="controller.actionTrayElements.value" />
  </div>
</template>

<script setup lang="ts">
  import ActionTray from "../ActionTrays/ActionTray.vue"
  import DcrAcknowledgementOfResignation from "../Resolutions/DcrAcknowledgementOfResignation.vue"
  import NoticeOfResignation from "../LegalDocuments/NoticeOfResignation.vue"
  import { ResignationOfDirectorController } from "~/scripts/components/service-wrappers/ResignationOfDirectorController"

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
    showWatermarkText: {
      type: Boolean,
      default: true,
    },
    watermarkText: {
      type: String,
      default: "DRAFT",
    },
  })

  const noticeRef = ref(null)
  const dcrRef = ref(null)
  const emit = defineEmits(["zoomOut", "zoomIn", "back", "applicationUpdated"])

  const controller = new ResignationOfDirectorController(props.companyId, emit, props.applicationId)

  watch(noticeRef, (newVal) => {
    controller.setNoticeRef(newVal)
  })

  watch(dcrRef, (newVal) => {
    controller.setDcrRef(newVal)
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Services/CosecServiceDocuments" as *;
</style>
