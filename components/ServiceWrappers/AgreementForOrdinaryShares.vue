<template>
  <div
    id="service-wrappers-agreement-for-ordinary-shares"
    class="cosec-service-documents"
    :class="{ 'full-size': props.isDocumentEnlarged }"
  >
    <div
      class="documents-section"
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
          <OrdinaryShareSubscriptionAgreement
            ref="dcrRef"
            v-bind="controller.resolutionDocumentProps"
            @signed="controller.onSigned($event)"
          />
        </template>
      </TransitionGroup>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import OrdinaryShareSubscriptionAgreement from "../LegalDocuments/OrdinaryShareSubscriptionAgreement.vue"
  import Paper from "@/components/Papers/Paper.vue"
  import { AgreementForOrdinarySharesController } from "~/scripts/components/service-wrappers/AgreementForOrdinarySharesController"

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

  const emit = defineEmits(["zoomOut", "zoomIn", "back", "applicationUpdated"])

  const controller = new AgreementForOrdinarySharesController(props.companyId, emit, props.applicationId)
</script>

<style lang="scss">
  @use "~/assets/scss/components/Services/CosecServiceDocuments" as *;
  @use "~/assets/scss/components/ServiceWrappers/AgreementForOrdinaryShares" as *;
</style>
