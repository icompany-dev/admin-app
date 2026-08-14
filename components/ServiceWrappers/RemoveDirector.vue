<template>
  <div
    id="remove-director"
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
        <NoticeRemovalOfDirector
          ref="noticeRef"
          :company-id="props.companyId"
          :is-in-preview-mode="props.isInPreviewMode"
          :application-id="props.applicationId"
          :show-watermark="props.showWatermarkText"
          :watermark-text="props.watermarkText"
          @signed="controller.onNoticeSigned($event)"
        />
        <DcrConveneRemoveDirectorMeeting
          ref="dcrRef"
          v-bind="controller.resolutionDocumentProps"
          @signed="controller.onDcrConveneSigned($event)"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import NoticeRemovalOfDirector from "@/components/LegalDocuments/NoticeRemovalOfDirector.vue"
  import DcrConveneRemoveDirectorMeeting from "../Resolutions/DcrConveneRemoveDirectorMeeting.vue"
  import { RemoveDirectorController } from "~/scripts/components/service-wrappers/RemoveDirectorController"

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

  const dcrRef = ref(null)
  const mcrRef = ref(null)
  const noticeRef = ref(null)

  const emit = defineEmits(["zoomOut", "zoomIn", "back", "applicationUpdated"])

  const controller = new RemoveDirectorController(props.companyId, emit, props.applicationId)

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

  watch(
    noticeRef,
    (newVal) => {
      controller.setNoticeRef(newVal)
    },
    { immediate: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Services/CosecServiceDocuments" as *;
</style>
