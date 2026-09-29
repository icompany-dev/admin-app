<template>
  <div
    id="secretarial-services-transfer-of-share"
    class="secretarial-service-application"
  >
    <div class="service-application">
      <TransferOfShareApplication
        v-bind="controller.applicationProps"
        @company="controller.onCompanyUpdated($event)"
        @paymentOrderId="controller.onPaymentOrderIdUpdated($event)"
        @documentSelected="controller.onDocumentTargetSelected($event)"
        @download="controller.onDownloadClicked()"
        @convertToForms="controller.onMoveToDocuments()"
        @show="controller.onShowPdf($event)"
      />
    </div>
    <div class="document-container">
      <component
        v-if="!controller.showPdfViewer"
        ref="documentRef"
        :is="activeDocumentComponent"
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
    </div>
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
</template>

<script lang="ts" setup>
  import PdfViewer from "@/components/DocumentViewers/PdfViewer.vue"
  import ReceiptInvoiceService from "../CompanyServices/ReceiptInvoiceService.vue"
  import RegisterTransferOfSharesService from "../CompanyServices/RegisterTransferOfSharesService.vue"
  import Section105Service from "../CompanyServices/Section105Service.vue"
  import TransferOfShareApplication from "../Services/TransferOfShareApplication.vue"
  import TransferSharesService from "../CompanyServices/TransferSharesService.vue"
  import { TransferOfShareController } from "~/scripts/components/secretarial-services/TransferOfShareController"
  import type { IPropsSecretarialService } from "~/scripts/props/PropsSecretarialService"
  import { DocumentTargets } from "~/scripts/constants/DocumentTargets"

  const props = defineProps<IPropsSecretarialService>()

  const emit = defineEmits(["company", "paymentOrderId"])

  const documentRef = ref(null)

  const controller = new TransferOfShareController(props, emit)

  const componentMap: Record<string, any> = {
    [DocumentTargets.TARGET_RECEIPT]: ReceiptInvoiceService,
    [DocumentTargets.TARGET_SECTION105]: Section105Service,
    [DocumentTargets.TARGET_SHAREHOLDER_TRANSFER_OF_SHARES]: TransferSharesService,
    [DocumentTargets.TARGET_SHAREHOLDER_POST_SHARE_TRANSFER]: RegisterTransferOfSharesService,
  }

  const activeDocumentComponent = computed(() => {
    const target = controller.selectedDocumentTarget.value
    return target && componentMap[target] ? componentMap[target] : null
  })

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
  @use "~/assets/scss/components/SecretarialServices/TransferOfShare" as *;
</style>
