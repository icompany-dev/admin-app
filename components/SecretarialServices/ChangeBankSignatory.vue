<template>
  <div
    id="secretarial-services-change-bank-signatory"
    class="secretarial-service-application"
  >
    <div class="service-application">
      <ChangeBankSignatoryApplication
        v-bind="controller.applicationProps"
        @company="controller.onCompanyUpdated($event)"
        @paymentOrderId="controller.onPaymentOrderIdUpdated($event)"
        @documentSelected="controller.onDocumentTargetSelected($event)"
        @download="controller.onDownloadClicked()"
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
  import ChangeBankSignatoryApplication from "../Services/ChangeBankSignatoryApplication.vue"
  import ChangeBankSignatoriesService from "../CompanyServices/ChangeBankSignatoriesService.vue"
  import ReceiptInvoiceService from "../CompanyServices/ReceiptInvoiceService.vue"
  import { ChangeBankSignatoryController } from "~/scripts/components/secretarial-services/ChangeBankSignatoryController"
  import type { IPropsSecretarialService } from "~/scripts/props/PropsSecretarialService"
  import { DocumentTargets } from "~/scripts/constants/DocumentTargets"

  const props = defineProps<IPropsSecretarialService>()

  const emit = defineEmits(["company", "paymentOrderId"])

  const documentRef = ref(null)

  const controller = new ChangeBankSignatoryController(props, emit)

  const componentMap: Record<string, any> = {
    [DocumentTargets.TARGET_CHANGE_BANK_SIGNATORY_RESOLUTIONS]: ChangeBankSignatoriesService,
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
  @use "~/assets/scss/components/SecretarialServices/ChangeBankSignatory" as *;
</style>
