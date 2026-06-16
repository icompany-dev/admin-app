<template>
  <div
    id="change-of-name"
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
        <DcrChangeOfNames
          ref="dcrRef"
          v-bind="controller.resolutionDocumentProps"
          @name-changed="controller.onNamesSet($event)"
          @signed="controller.onSigned($event)"
        />
        <McrChangeOfNames
          ref="mcrRef"
          v-bind="controller.resolutionDocumentProps"
          @name-changed="controller.onNamesSet($event)"
          @signed="controller.onSigned($event)"
        />
      </TransitionGroup>
    </div>
    <PopupProceedChangeOfName
      ref="noticeRef"
      :price="controller.price.value"
      :proposed-name1="controller.proposedName1.value ?? ''"
      :proposed-name2="controller.proposedName2.value ?? ''"
      :proposed-name3="controller.proposedName3.value ?? ''"
      @cancel="emit('back')"
      @proceed="controller.onProceedClicked()"
    />
  </div>
</template>

<script setup lang="ts">
  import PopupProceedChangeOfName from "@/components/Popups/ProceedChangeOfName.vue"
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
