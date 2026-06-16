<template>
  <div
    id="change-of-address"
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
        <DcrDelegationOfAuthority
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
          :year-to-lodge="null"
          :type="null"
          @signed="controller.onSigned($event)"
        />
      </TransitionGroup>
    </div>
    <<<<<<< HEAD
    <!-- <DocumentToggler :can-zoom-in="controller.canZoomIn()" :can-zoom-out="controller.canZoomOut()" @back="controller.onBackClicked()"
      @remove="controller.onRemove()" @zoom-in="controller.onZoomInClicked()" @zoom-out="controller.onZoomOutClicked()">
=======
    <DocumentToggler
      :can-zoom-in="controller.canZoomIn()"
      :can-zoom-out="controller.canZoomOut()"
      @back="controller.onBackClicked()"
      @remove="controller.onRemove()"
      @zoom-in="controller.onZoomInClicked()"
      @zoom-out="controller.onZoomOutClicked()"
    >
>>>>>>> develop
      <template #help>
        <div class="help-title">
          {{ controller.helpTitle() }}
        </div>
        <div
          class="help-description"
          v-html="controller.helpDescription()"
        />
      </template>
    </DocumentToggler> -->
    <!-- <ServiceCta class="enlarged" @back="controller.onBackClicked()" @proceed="controller.onSubmitClicked()" /> -->
  </div>
</template>

<script setup lang="ts">
  import DcrDelegationOfAuthority from "../Resolutions/DcrDelegationOfAuthority.vue"
  import { ChangeOfBranchController } from "~/scripts/components/service-wrappers/ChangeOfBranchController"

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

  const emit = defineEmits(["zoomOut", "zoomIn", "makePayment", "back"])

  const controller = new ChangeOfBranchController(props.companyId, emit, props.applicationId)

  watch(
    dcr,
    (newVal) => {
      controller.setDcrRef(newVal)
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
</style>
