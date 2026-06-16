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
        <DcrAdoptionOfConstitution
          v-if="controller.isShowAdoptResolution()"
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
        />
        <McrAdoptionOfConstitution
          v-if="controller.isShowAdoptResolution()"
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
        />
        <DcrAmendmentOfConstitution
          v-if="controller.isShowAmendResolution()"
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
        />
        <McrAmendmentOfConstitution
          v-if="controller.isShowAmendResolution()"
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
        />
        <DcrAbolishmentOfConstitution
          v-if="controller.isShowAbolishResolution()"
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
        />
        <McrAbolishmentOfConstitution
          v-if="controller.isShowAbolishResolution()"
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
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
  import DcrAdoptionOfConstitution from "../Resolutions/DcrAdoptionOfConstitution.vue"
  import McrAdoptionOfConstitution from "../Resolutions/McrAdoptionOfConstitution.vue"
  import DcrAmendmentOfConstitution from "../Resolutions/DcrAmendmentOfConstitution.vue"
  import McrAmendmentOfConstitution from "../Resolutions/McrAmendmentOfConstitution.vue"
  import DcrAbolishmentOfConstitution from "../Resolutions/DcrAbolishmentOfConstitution.vue"
  import McrAbolishmentOfConstitution from "../Resolutions/McrAbolishmentOfConstitution.vue"
  import { ChangeOfConstitutionController } from "~/scripts/components/service-wrappers/ChangeOfConstitutionController"
  import { ConstitutionAmendmentTypes } from "~/scripts/constants/AmendmentTypes"

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

  const controller = new ChangeOfConstitutionController(props.companyId, props.applicationId)
</script>

<style lang="scss">
  @use "~/assets/scss/components/Services/CosecServiceDocuments" as *;
</style>
