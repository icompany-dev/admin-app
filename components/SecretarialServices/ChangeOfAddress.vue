<template>
  <div
    id="secretarial-services-change-of-address"
    class="secretarial-service-application"
  >
    <div class="service-application">
      <ChangeOfAddressApplication
        v-bind="controller.applicationProps"
        @company="controller.onCompanyUpdated($event)"
        @paymentOrderId="controller.onPaymentOrderIdUpdated($event)"
        @documentSelected="controller.onDocumentTargetSelected($event)"
        @download="controller.onDownloadClicked()"
        @convertToForms="controller.onConvertToForms()"
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
  import ChangeOfAddressApplication from "../Services/ChangeOfAddressApplication.vue"
  import ReceiptInvoiceService from "../CompanyServices/ReceiptInvoiceService.vue"
  import ChangeOfAddressService from "@/components/CompanyServices/ChangeOfBusinessAddressService.vue"
  import { ChangeOfAddressController } from "~/scripts/components/secretarial-services/ChangeOfAddressController"
  import type { IPropsSecretarialService } from "~/scripts/props/PropsSecretarialService"
  import { DocumentTargets } from "~/scripts/constants/DocumentTargets"

  const props = defineProps<IPropsSecretarialService>()

  const emit = defineEmits(["company", "paymentOrderId"])

  const documentRef = ref(null)

  const controller = new ChangeOfAddressController(props, emit)

  const componentMap: Record<string, any> = {
    [DocumentTargets.TARGET_AMENDMENT_ADDRESS_RESOLUTIONS]: ChangeOfAddressService,
    [DocumentTargets.TARGET_RECEIPT]: ReceiptInvoiceService,
  }

  const activeDocumentComponent = computed(() => {
    const target = controller.selectedDocumentTarget.value
    return target && componentMap[target] ? componentMap[target] : null
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/SecretarialServices/SecretarialService" as *;
  @use "~/assets/scss/components/SecretarialServices/ChangeOfAddress" as *;
</style>
