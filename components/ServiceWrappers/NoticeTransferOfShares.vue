<template>
  <div
    id="notice-transfer-of-shares"
    class="cosec-service-documents"
    :class="{ 'full-size': props.isDocumentEnlarged }"
  >
    <div
      v-if="controller.isLoading.value"
      class="paper-wrapper"
    >
      <div class="paper">
        <LoaderPrepare
          :label="controller.loaderLabel()"
          :sublabel="controller.loaderSublabel()"
        />
      </div>
    </div>
    <div
      v-if="!controller.isLoading.value"
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
        <NoticeTransferOfShareProposal
          v-for="(shareholder, index) in controller.shareholders.value"
          :ref="
            (el) => {
              return controller.setProposalRef(el, index)
            }
          "
          :key="index"
          :transfer-id="controller.application.id"
          :shareholder-id="shareholder.id"
          :company-id="controller.companyId"
          :show-watermark="controller.showWatermark()"
          :watermark-text="controller.watermarkText()"
          :is-in-preview-mode="controller.isInPreviewMode.value"
          :is-read-only="controller.isDocumentReadOnly(index)"
          @transfer-details-updated="controller.onDataUpdated($event, index)"
          @signed="controller.onApplicationUpdated($event)"
        />
        <template v-if="controller.hasInitiatorSigned">
          <Section105
            v-for="(transferDetail, index) in controller.transferDetails.value"
            :key="index"
            :company-shareholder-transfer="controller.application"
            :shareholder-id="controller.shareholderId.value ?? ''"
            :company-share-transfer-detail="transferDetail"
            :company-id="controller.companyId"
            :show-watermark="controller.showWatermark()"
            :watermark-text="controller.watermarkText()"
            :is-in-preview-mode="controller.isInPreviewMode.value"
            @transferorSigned="controller.onTransferorSigned($event)"
            @transferorRepSigned="controller.onTransferorRepSigned($event)"
            @transfereeSigned="controller.onTransfereeSigned($event)"
            @transfereeRepSigned="controller.onTransfereeRepSigned($event)"
          />
        </template>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import NoticeTransferOfShareProposal from "../LegalDocuments/NoticeTransferOfShareProposal.vue"
  import Section105 from "../LegalDocuments/Section105.vue"
  import { NoticeTransferOfSharesController } from "~/scripts/components/service-wrappers/NoticeTransferOfSharesController"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
    applicationId: {
      type: String,
      default: null,
    },
    noticeId: {
      type: String,
      default: null,
    },
    isDocumentEnlarged: {
      type: Boolean,
      default: false,
    },
  })

  const dcrRef = ref(null)
  const mcrRef = ref(null)

  const emit = defineEmits(["zoomOut", "zoomIn", "back", "applicationUpdated"])

  const controller = new NoticeTransferOfSharesController(props.companyId, emit, props.applicationId, props.noticeId)

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
