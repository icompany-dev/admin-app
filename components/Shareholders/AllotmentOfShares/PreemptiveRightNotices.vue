<template>
  <div
    id="preemptive-right-notices"
    ref="documentRef"
  >
    <div class="preemptive-right-notice-container">
      <TransitionGroup
        name="fade"
        tag="div"
      >
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
        <template v-if="!controller.isLoading.value">
          <Section85PreemptiveRightNotice
            v-for="(response, index) in controller.noticeResponses.value"
            :company-id="controller.companyId.value"
            :initiator-signature-item="controller.initiatorSignatureItem.value"
            :notice-response="response"
            :response-signature-item="controller.getSignatureForResponse(response)"
            :notification-date="controller.notificationDate()"
            :expiry-date="controller.expiryDate()"
            :show-watermark="props.showWatermark"
            :watermark-text="props.watermarkText"
            :is-in-preview-mode="props.isInPreviewMode"
          />
        </template>
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

  const documentRef = ref(null)

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

  watch(
    documentRef,
    (newVal) => {
      controller.setDocumentRef(newVal)
    },
    { immediate: true }
  )

  defineExpose({
    totalPages: controller.totalPages.bind(controller),
    refreshData: controller.refreshData.bind(controller),
    getPdfPages: controller.getPdfPages.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Shareholders/AllotmentOfShares/PreemptiveRightNotices" as *;
</style>
