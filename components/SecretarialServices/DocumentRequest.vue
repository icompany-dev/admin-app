<template>
  <div
    id="secretarial-services-document-request"
    class="secretarial-service-application"
  >
    <div class="service-application">
      <DocumentRequestApplication
        v-bind="controller.applicationProps"
        @company="controller.onCompanyUpdated($event)"
        @paymentOrderId="controller.onPaymentOrderIdUpdated($event)"
        @documentSelected="controller.onDocumentTargetSelected($event)"
        @download="controller.onDownloadClicked()"
        @convertToForms="controller.onConvertToForms()"
        @show="controller.onShowPdf($event)"
      />
    </div>
    <div class="document-container">
      <TransitionGroup name="slide-left">
        <ReceiptInvoiceService
          v-if="controller.isShowReceipt"
          ref="documentRef"
          :company-id="controller.companyId.value"
          :view-type="'existing'"
          :application-id="controller.applicationId.value"
          :target-id="controller.paymentOrderId.value"
          :target-type="controller.target"
        />
        <PdfViewer
          v-if="controller.showPdfViewer"
          :company-id="controller.application.value.companyId"
          :pdf-url="controller.pdfUrl.value"
          :filename="'filename.pdf'"
          :can-zoom="false"
          @zoom="controller.onZoomPdf($event)"
        />
      </TransitionGroup>

      <Teleport to="body">
        <Transition name="fade">
          <div
            class="document-view show"
            v-if="controller.zoomLevel.value > 0"
            @click.self="controller.onMinimizePdf()"
          >
            <PdfViewer
              :company-id="controller.application.value.companyId"
              :pdf-url="controller.pdfUrl.value"
              :filename="'filename.pdf'"
              :can-zoom="false"
              :zoom-level="1"
              @zoom="controller.onMinimizePdf()"
            />
          </div>
        </Transition>
      </Teleport>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import DocumentRequestApplication from "../Services/DocumentRequestApplication.vue"
  import PdfViewer from "@/components/DocumentViewers/PdfViewer.vue"
  import ReceiptInvoiceService from "../CompanyServices/ReceiptInvoiceService.vue"
  import { DocumentRequestController } from "~/scripts/components/secretarial-services/DocumentRequestController"
  import type { IPropsSecretarialService } from "~/scripts/props/PropsSecretarialService"

  const props = defineProps<IPropsSecretarialService>()

  const emit = defineEmits(["company", "paymentOrderId"])

  const documentRef = ref(null)

  const controller = new DocumentRequestController(props, emit)

  watch(
    documentRef,
    (newVal) => {
      controller.setDocumentRef(newVal)
    },
    { immediate: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/SecretarialServices/SecretarialService" as *;
  @use "~/assets/scss/components/SecretarialServices/DocumentRequest" as *;
</style>
