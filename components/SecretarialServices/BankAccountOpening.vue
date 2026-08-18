<template>
  <div
    id="secretarial-services-bank-account-opening"
    class="secretarial-service-application"
  >
    <BankAccountOpening
      v-bind="controller.applicationProps"
      @company="controller.onCompanyUpdated($event)"
      @paymentOrderId="controller.onPaymentOrderIdUpdated($event)"
      @documentSelected="controller.onDocumentTargetSelected($event)"
    />
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
  import BankAccountOpeningService from "../CompanyServices/BankAccountOpeningService.vue"
  import ReceiptInvoiceService from "../CompanyServices/ReceiptInvoiceService.vue"
  import BankAccountOpening from "../Services/BankAccountOpening.vue"
  import { BankAccountOpeningController } from "~/scripts/components/secretarial-services/BankAccountOpeningController"
  import type { IPropsSecretarialService } from "~/scripts/props/PropsSecretarialService"
  import { DocumentTargets } from "~/scripts/constants/DocumentTargets"

  const props = defineProps<IPropsSecretarialService>()

  const emit = defineEmits(["company", "paymentOrderId"])

  const documentRef = ref(null)

  const controller = new BankAccountOpeningController(props, emit)

  const componentMap: Record<string, any> = {
    [DocumentTargets.TARGET_OPEN_BANK_ACCOUNT_RESOLUTIONS]: BankAccountOpeningService,
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
  @use "~/assets/scss/components/SecretarialServices/BankAccountOpening" as *;
</style>
