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
      <Transition name="slide-left">
        <PdfViewer
          v-if="controller.showPdfViewer"
          :company-id="controller.application.value.companyId"
          :pdf-url="controller.pdfUrl.value"
          :filename="'filename.pdf'"
        />
      </Transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import DocumentRequestApplication from "../Services/DocumentRequestApplication.vue"
  import PdfViewer from "@/components/DocumentViewers/PdfViewer.vue"
  import { DocumentRequestController } from "~/scripts/components/secretarial-services/DocumentRequestController"
  import type { IPropsSecretarialService } from "~/scripts/props/PropsSecretarialService"

  const props = defineProps<IPropsSecretarialService>()

  const emit = defineEmits(["company", "paymentOrderId"])

  const controller = new DocumentRequestController(props, emit)
</script>

<style lang="scss">
  @use "~/assets/scss/components/SecretarialServices/SecretarialService" as *;
  @use "~/assets/scss/components/SecretarialServices/DocumentRequest" as *;
</style>
