<template>
  <div
    id="service-wrappers-section28"
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
        <Section28ChangeOfName
          ref="documentRef"
          :application-id="controller.applicationId ?? ''"
          :change-of-name="controller.applicationValue"
        />
      </TransitionGroup>
    </div>
    <ActionTray :actions="controller.actionTrayElements.value" />
  </div>
</template>

<script lang="ts" setup>
  import ActionTray from "@/components/ActionTrays/ActionTray.vue"
  import Section28ChangeOfName from "@/components/LegalDocuments/Section28ChangeOfName.vue"
  import { Section28Controller } from "~/scripts/components/service-wrappers/Section28Controller"

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
  const documentRef = ref(null)

  const controller = new Section28Controller(props.companyId, emit, props.applicationId)

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
    documentRef,
    (newVal) => {
      controller.setDocumentRef(newVal)
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
