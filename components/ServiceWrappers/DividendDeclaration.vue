<template>
  <div
    id="dividend-declaration"
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
        <DcrDeclarationOfSolvencyDividend
          ref="dcrRef"
          :company-id="props.companyId"
          :application-id="props.applicationId"
          :application="null"
          :show-watermark="props.showWatermarkText"
          :watermark-text="props.watermarkText"
          :is-in-preview-mode="props.isInPreviewMode"
          :is-by-shareholder="false"
          :financial-period-id="null"
          :bank-id="null"
          :name-reservations="[]"
          :year-to-lodge="null"
          :type="null"
          @signed="controller.onSigned($event)"
        />
        <Section132
          :company-id="props.companyId"
          :is-in-preview-mode="props.isInPreviewMode"
          :start-page-number="3"
          :application-id="props.applicationId"
          @signed="controller.onSigned($event)"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
  import DcrDeclarationOfSolvencyDividend from "~/components/Resolutions/DcrDeclarationOfSolvencyDividend.vue"
  import Section132 from "~/components/LegalDocuments/Section132.vue"
  import { DividendDeclarationController } from "~/scripts/components/service-wrappers/DividendDeclarationController"

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

  const emit = defineEmits(["zoomOut", "zoomIn", "back", "makePayment"])

  const dcrRef = ref(null)

  const controller = new DividendDeclarationController(props.companyId, emit, props.applicationId)

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
