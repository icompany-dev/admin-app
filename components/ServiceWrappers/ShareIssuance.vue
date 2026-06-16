<template>
  <div
    id="change-of-name"
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
        <DcrProposeAllotmentOfShares
          ref="dcr"
          :company-id="props.companyId"
          :application-id="props.applicationId"
          :application="null"
          :is-in-preview-mode="props.isInPreviewMode"
          :is-by-shareholder="false"
          :financial-period-id="null"
          :bank-id="null"
          :name-reservations="[]"
          :year-to-lodge="null"
          :type="null"
          :show-watermark="controller.showWatermark()"
          :watermark-text="controller.watermarkText()"
          @signed="controller.onSigned($event)"
          @preferenceShareSelected="controller.onPreferenceShareSelected()"
        />
        <PreemptiveRightNotices
          ref="notice"
          :company-id="props.companyId"
          :application-id="props.applicationId"
          :application="null"
          :is-in-preview-mode="props.isInPreviewMode"
          :is-by-shareholder="false"
          :financial-period-id="null"
          :bank-id="null"
          :name-reservations="[]"
          :year-to-lodge="null"
          :type="null"
          :show-watermark="controller.showWatermark()"
          :watermark-text="controller.watermarkText()"
          @responded="controller.onResponded()"
        />
      </TransitionGroup>
    </div>
    <Teleport to="body">
      <PreferenceShareAlertPopup
        ref="preferenceSharePopup"
        :has-constitution="controller.hasConstitution()"
        :has-terms-of-rights="false"
        @cancel="controller.onCancelPreferenceShares()"
        @proceed="controller.onGoToConstitution()"
      />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
  import DcrProposeAllotmentOfShares from "../Resolutions/DcrProposeAllotmentOfShares.vue"
  import PreemptiveRightNotices from "../Shareholders/AllotmentOfShares/PreemptiveRightNotices.vue"
  import PreferenceShareAlertPopup from "../Popups/PreferenceShareAlertPopup.vue"
  import { ShareIssuanceController } from "~/scripts/components/service-wrappers/ShareIssuanceController"

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

  const dcr = ref(null)
  const preferenceSharePopup = ref(null)
  const emit = defineEmits([
    "zoomOut",
    "zoomIn",
    "back",
    "cancelPreferenceShares",
    "goToConstitution",
    "applicationUpdated",
  ])

  const controller = new ShareIssuanceController(props.companyId, emit, props.applicationId)

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

  watch(
    preferenceSharePopup,
    (newVal) => {
      controller.setPreferenceSharePopupRef(newVal)
    },
    { immediate: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Services/CosecServiceDocuments" as *;
</style>
