<template>
  <div
    id="service-wrappers-letter-of-cosec-resign"
    class="cosec-service-documents"
    :class="{ 'full-size': props.isDocumentEnlarged }"
  >
    <div
      class="documents-section"
      :class="{ invert: controller.showMcrFirst.value }"
      v-keyboard-click
      @click="emit('zoomIn')"
      :style="controller.getZoomStyle()"
    >
      <TransitionGroup
        name="flip"
        tag="div"
        class="document-transition-wrapper"
      >
        <LetterResignationSecretary
          ref="letterRef"
          :company-id="controller.companyId"
        />
      </TransitionGroup>
    </div>
    <ActionTray :actions="controller.actionTrayElements.value" />
  </div>
</template>

<script lang="ts" setup>
  import { LetterOfCosecResignController } from "~/scripts/components/service-wrappers/LetterOfCosecResignController"
  import ActionTray from "@/components/ActionTrays/ActionTray.vue"
  import DcrChangeOfCompanySecretary from "../Resolutions/DcrChangeOfCompanySecretary.vue"
  import LetterResignationSecretary from "../LegalDocuments/LetterResignationSecretary.vue"
  import SwitchOutLetter from "@/components/LegalDocuments/SwitchOutLetter.vue"
  import SwitchOutHandoverDocument from "@/components/LegalDocuments/SwitchOutHandoverDocument.vue"

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
  })

  const dcrRef = ref(null)
  const mcrRef = ref(null)
  const letterRef = ref(null)

  const emit = defineEmits(["zoomOut", "zoomIn", "back", "applicationUpdated"])

  const controller = new LetterOfCosecResignController(
    props.companyId,
    props.isInPreviewMode,
    emit,
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

  watch(
    letterRef,
    (newVal) => {
      controller.setLetterRef(newVal)
    },
    { immediate: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Services/CosecServiceDocuments" as *;
  @use "~/assets/scss/components/ServiceWrappers/LetterOfCosecResign" as *;
</style>
