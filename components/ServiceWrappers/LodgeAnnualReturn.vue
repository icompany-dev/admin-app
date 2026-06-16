<template>
  <div
    id="lodge-annual-return"
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
        <DcrLodgeAnnualReturn
          ref="dcr"
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
          :year-to-lodge="controller.yearToLodge.value"
          :type="null"
          @signed="controller.onSigned($event)"
          @abstain="controller.onAbstained()"
        />
        <Section68
          v-if="controller.hasPaid.value"
          :company-id="props.companyId"
          :annual-return-year="controller.yearToLodge.value"
        />
      </TransitionGroup>
    </div>

    <Teleport to="body">
      <ComplianceAlertAnnualReturnLodgement
        ref="popupAnnualReturnLodgementRef"
        @back="emit('back')"
      />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
  import ComplianceAlertAnnualReturnLodgement from "~/components/Popups/ComplianceAlertAnnualReturnLodgement.vue"
  import DcrLodgeAnnualReturn from "../Resolutions/DcrLodgeAnnualReturn.vue"
  import Section68 from "../LegalDocuments/Section68.vue"
  import { LodgeAnnualReturnController } from "~/scripts/components/service-wrappers/LodgeAnnualReturnController"

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

  const dcr = ref(null)
  const popupAnnualReturnLodgementRef = ref(null)

  const emit = defineEmits(["zoomOut", "zoomIn", "back"])

  const controller = new LodgeAnnualReturnController(props.companyId, emit, props.applicationId)

  watch(
    dcr,
    (newVal) => {
      controller.setDcrRef(newVal)
    },
    { immediate: true }
  )

  watch(
    popupAnnualReturnLodgementRef,
    (newVal) => {
      controller.setPopupAnnualReturnLodgementRef(newVal)
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
  @use "~/assets/scss/components/Services/LodgeAnnualReturn" as *;
</style>
