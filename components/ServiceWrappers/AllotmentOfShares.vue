<template>
  <div
    id="allotment-of-shares"
    class="cosec-service-documents"
    :class="{ 'full-size': props.isDocumentEnlarged }"
  >
    <div
      class="documents-section"
      :class="{ invert: controller.isShowMcrFirst }"
      v-keyboard-click
      @click="emit('zoomIn')"
      :style="controller.getZoomStyle()"
    >
      <TransitionGroup
        name="flip"
        tag="div"
        class="document-transition-wrapper"
      >
        <Paper
          v-if="controller.isLoading.value"
          :is-loader="true"
          :show-page-number="false"
        >
          <template #paperContent>
            <LoaderPrepare
              :label="'Preparing Your'"
              :sublabel="'Resolutions'"
            />
          </template>
        </Paper>
        <template v-if="!controller.isLoading.value">
          <DcrProposeAllotmentOfShares
            ref="dcrRef"
            v-bind="controller.resolutionDocumentProps"
            @signed="controller.onSigned($event)"
          />
          <McrAuthorityToAllotShares
            ref="mcrRef"
            v-bind="controller.mcrResolutionDocumentProps"
            @signed="controller.onSignedMcr($event)"
          />
          <PreemptiveRightNotices
            ref="notice"
            :company-id="controller.companyId"
            :application-id="controller.issuanceId"
            :application="null"
            :is-in-preview-mode="controller.isInPreviewMode.value"
            :is-by-shareholder="false"
            :financial-period-id="null"
            :bank-id="null"
            :name-reservations="[]"
            :year-to-lodge="null"
            :type="null"
            :show-watermark="controller.isShowWatermark"
            :watermark-text="controller.watermarkText"
          />
        </template>
      </TransitionGroup>
    </div>
    <ActionTray :actions="controller.actionTrayElements.value" />
  </div>
</template>

<script setup lang="ts">
  import ActionTray from "@/components/ActionTrays/ActionTray.vue"
  import DcrProposeAllotmentOfShares from "@/components/Resolutions/DcrProposeAllotmentOfShares.vue"
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import McrAuthorityToAllotShares from "@/components/Resolutions/McrAuthorityToAllotShares.vue"
  import Paper from "@/components/Papers/Paper.vue"
  import PreemptiveRightNotices from "../Shareholders/AllotmentOfShares/PreemptiveRightNotices.vue"
  import { AllotmentOfSharesController } from "~/scripts/components/service-wrappers/AllotmentOfSharesController"

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

  const emit = defineEmits(["zoomOut", "zoomIn", "back", "applicationUpdated"])

  const controller = new AllotmentOfSharesController(props.companyId, emit, props.applicationId)

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
