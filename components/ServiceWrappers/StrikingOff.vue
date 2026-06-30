<template>
  <div
    id="adopt-common-seal"
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
        <DcrStrikingOff
          ref="dcrRef"
          v-bind="controller.resolutionDocumentProps"
          @signed="controller.onDcrSigned($event)"
        />
        <McrStrikingOff
          ref="mcrRef"
          v-bind="controller.resolutionDocumentProps"
          @signed="controller.onMcrSigned($event)"
        />
        <Section550
          ref="section550Ref"
          :company-id="controller.companyId"
          @signed="controller.onSection550Signed($event)"
        />
        <StrikingOffChecklist
          ref="checklistRef"
          :company-id="controller.companyId"
          @signed="controller.onChecklistSigned($event)"
        />
        <StrikingOffClearanceLetter
          ref="clearanceLetterRef"
          :company-id="controller.companyId"
          @signed="controller.onClearanceLetterSigned($event)"
        />
        <StrikingOffSupportingLetter
          ref="supportingLetterRef"
          :company-id="controller.companyId"
          @signed="controller.onSupportingLetterSigned($event)"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
  import DcrStrikingOff from "~/components/Resolutions/DcrStrikingOff.vue"
  import McrStrikingOff from "~/components/Resolutions/McrStrikingOff.vue"
  import Section550 from "../LegalDocuments/Section550.vue"
  import StrikingOffChecklist from "~/components/LegalDocuments/StrikingOffChecklist.vue"
  import StrikingOffClearanceLetter from "~/components/LegalDocuments/StrikingOffClearanceLetter.vue"
  import StrikingOffSupportingLetter from "~/components/LegalDocuments/StrikingOffSupportingLetter.vue"
  import { StrikingOffController } from "~/scripts/components/service-wrappers/StrikingOffController"

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
  const section550Ref = ref(null)
  const checklistRef = ref(null)
  const clearanceLetterRef = ref(null)
  const supportingLetterRef = ref(null)
  const signAllPopupRef = ref(null)

  const emit = defineEmits(["zoomOut", "zoomIn", "back", "applicationUpdated"])

  const controller = new StrikingOffController(props.companyId, emit, props.applicationId)

  watch(
    () => props.isInPreviewMode,
    (newVal) => {
      controller.isInPreviewMode.value = newVal
    },
    { immediate: true }
  )

  watch(
    () => props.applicationId,
    (newVal) => {
      controller.setApplicationId(newVal)
    }
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

  watch(
    section550Ref,
    (newVal) => {
      controller.setSection550Ref(newVal)
    },
    { immediate: true }
  )

  watch(
    checklistRef,
    (newVal) => {
      controller.setChecklistRef(newVal)
    },
    { immediate: true }
  )

  watch(
    clearanceLetterRef,
    (newVal) => {
      controller.setClearanceLetterRef(newVal)
    },
    { immediate: true }
  )

  watch(
    supportingLetterRef,
    (newVal) => {
      controller.setSupportingLetterRef(newVal)
    },
    { immediate: true }
  )

  watch(
    signAllPopupRef,
    (newVal) => {
      controller.setSignAllPopupRef(newVal)
    },
    { immediate: true }
  )

  watch(
    () => controller.eventManager.documentToView,
    (newVal) => {
      nextTick(() => {
        controller.onScrollToDocumentName()
      })
    },
    { immediate: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Services/CosecServiceDocuments" as *;
</style>
