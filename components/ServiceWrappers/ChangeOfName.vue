<template>
  <div
    id="change-of-name"
    class="cosec-service-documents"
  >
    <div
      class="documents-section"
      :class="{ invert: controller.showMcrFirst.value }"
    >
      <TransitionGroup
        name="flip"
        tag="div"
        class="document-transition-wrapper"
      >
        <DcrChangeOfNames
          ref="dcrRef"
          v-bind="controller.resolutionDocumentProps"
        />
        <McrChangeOfNames
          ref="mcrRef"
          v-bind="controller.resolutionDocumentProps"
        />
      </TransitionGroup>
    </div>
    <ActionTray :actions="controller.actionTrayElements.value" />
  </div>
</template>

<script setup lang="ts">
  import ActionTray from "@/components/ActionTrays/ActionTray.vue"
  import DcrChangeOfNames from "../Resolutions/DcrChangeOfNames.vue"
  import McrChangeOfNames from "../Resolutions/McrChangeOfNames.vue"
  import { ChangeOfNameController } from "~/scripts/components/service-wrappers/ChangeOfNameController"

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

  const emit = defineEmits(["zoomOut", "zoomIn", "back", "makePayment", "applicationUpdated"])

  const dcrRef = ref(null)
  const mcrRef = ref(null)
  const noticeRef = ref(null)

  const controller = new ChangeOfNameController(props.companyId, emit, props.applicationId)

  onBeforeUnmount(() => {
    controller.handleSubmitReProposeName()
  })

  watch(
    () => props.applicationId,
    (newVal) => {
      controller.fetchApplication(newVal)
    }
  )

  watch(
    noticeRef,
    (newVal) => {
      controller.setNoticeRef(newVal)
    },
    { immediate: true }
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
