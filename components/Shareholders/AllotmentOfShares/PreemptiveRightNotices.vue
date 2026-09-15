<template>
  <div id="preemptive-right-notices">
    <div class="preemptive-right-notice-container">
      <TransitionGroup
        name="fade"
        tag="div"
        class="documents"
      >
        <div
          class="submission-overlay"
          v-if="controller.isSubmitting.value"
        >
          <LoaderPrepare
            :label="controller.submittingDocumentLabel"
            :sublabel="controller.submittingDocumentSublabel"
          />
        </div>
        <Paper
          v-if="controller.isLoading.value"
          :is-loader="true"
        >
          <template #paperContent>
            <LoaderPrepare
              :label="controller.loaderLabel"
              :sublabel="controller.loaderSublabel"
            />
          </template>
        </Paper>
        <Section85PreemptiveRightNotice
          v-if="!controller.isLoading.value"
          :company-id="controller.companyId.value"
          :initiator-signature-item="controller.initiatorSignatureItem.value"
          :notice-response="controller.noticeResponseInFocus.value"
          :response-signature-item="controller.signatureItemInFocus.value"
          :notification-date="controller.notificationDate()"
          :expiry-date="controller.expiryDate()"
          :show-watermark="props.showWatermark"
          :watermark-text="props.watermarkText"
          :is-in-preview-mode="props.isInPreviewMode"
          @initiatorSigned="controller.onInitiatorSigned($event)"
          @responded="controller.onResponded($event)"
          @responseSigned="controller.onResponseSigned($event)"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
  import LoaderPrepare from "~/components/Loaders/Prepare.vue"
  import Paper from "~/components/Papers/Paper.vue"
  import Section85PreemptiveRightNotice from "~/components/LegalDocuments/Section85PreemptiveRightNotice.vue"
  import { PreemptiveRightNoticesController } from "~/scripts/components/shareholders/allotment-of-shares/PreemptiveRightNoticesController"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
    applicationId: {
      type: String,
      default: "",
    },
    showWatermark: {
      type: Boolean,
      default: false,
    },
    watermarkText: {
      type: String,
      default: "DRAFT",
    },
    isInPreviewMode: {
      type: Boolean,
      default: false,
    },
  })

  const emit = defineEmits(["responded", "signed"])

  const controller = new PreemptiveRightNoticesController(
    props.companyId,
    props.applicationId,
    props.isInPreviewMode,
    emit
  )

  watch(
    () => props.companyId,
    (newVal) => {
      controller.setCompanyId(newVal)
    }
  )

  watch(
    () => props.applicationId,
    (newVal) => {
      controller.setApplicationId(newVal)
    }
  )

  watch(
    () => props.isInPreviewMode,
    (newVal) => {
      controller.setIsInPreviewMode(newVal)
    }
  )

  defineExpose({
    totalPages: controller.totalPages.bind(controller),
    refreshData: controller.refreshData.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Shareholders/AllotmentOfShares/PreemptiveRightNotices" as *;
</style>
