<template>
  <div
    id="secretarial-services-payment-to-director"
    class="secretarial-service-application"
  >
    <div class="service-application">
      <PaymentToDirectorApplication
        v-bind="controller.applicationProps"
        @company="controller.onCompanyUpdated($event)"
        @paymentOrderId="controller.onPaymentOrderIdUpdated($event)"
        @documentSelected="controller.onDocumentTargetSelected($event)"
        @download="controller.onDownloadClicked()"
        @generate="controller.onGenerateClicked($event)"
      />
    </div>
    <div class="document-container">
      <component
        ref="documentRef"
        :is="activeDocumentComponent"
        :company-id="controller.companyId.value"
        :view-type="'existing'"
        :application-id="controller.applicationId.value"
        :target-id="controller.paymentOrderId.value"
        :target-type="controller.target"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import ReceiptInvoiceService from "../CompanyServices/ReceiptInvoiceService.vue"
  import PaymentToDirectorApplication from "../Services/PaymentToDirectorApplication.vue"
  import PaymentToDirectorService from "../CompanyServices/PaymentToDirectorService.vue"
  import { PaymentToDirectorController } from "~/scripts/components/secretarial-services/PaymentToDirectorController"

  import type { IPropsSecretarialService } from "~/scripts/props/PropsSecretarialService"
  import { DocumentTargets } from "~/scripts/constants/DocumentTargets"

  const props = defineProps<IPropsSecretarialService>()

  const emit = defineEmits(["company", "paymentOrderId"])

  const documentRef = ref(null)

  const controller = new PaymentToDirectorController(props, emit)

  const componentMap: Record<string, any> = {
    [DocumentTargets.TARGET_DIRECTOR_PAYMENT_RESOLUTIONS]: PaymentToDirectorService,
    [DocumentTargets.TARGET_RECEIPT]: ReceiptInvoiceService,
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
  @use "~/assets/scss/components/SecretarialServices/PaymentToDirector" as *;
</style>
