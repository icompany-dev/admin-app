<template>
  <div
    id="secretarial-services-change-of-registered-address"
    class="secretarial-service-application"
  >
    <div class="service-application">
      <ChangeOfRegisteredAddressApplication
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
  import ChangeOfRegisteredAddressApplication from "../Services/ChangeOfRegisteredAddressApplication.vue"
  import ReceiptInvoiceService from "../CompanyServices/ReceiptInvoiceService.vue"
  import ChangeOfRegisteredAddressService from "@/components/CompanyServices/ChangeOfRegisteredAddressService.vue"
  import { ChangeOfRegisteredAddressController } from "~/scripts/components/secretarial-services/ChangeOfRegisteredAddressController"

  import type { IPropsSecretarialService } from "~/scripts/props/PropsSecretarialService"
  import { DocumentTargets } from "~/scripts/constants/DocumentTargets"

  const props = defineProps<IPropsSecretarialService>()

  const emit = defineEmits(["company", "paymentOrderId"])

  const documentRef = ref(null)

  const controller = new ChangeOfRegisteredAddressController(props, emit)

  const componentMap: Record<string, any> = {
    [DocumentTargets.TARGET_AMENDMENT_REGISTERED_ADDRESS_RESOLUTIONS]: ChangeOfRegisteredAddressService,
    [DocumentTargets.TARGET_RECEIPT]: ReceiptInvoiceService,
  }

  const activeDocumentComponent = computed(() => {
    const target = controller.selectedDocumentTarget.value
    return target && componentMap[target] ? componentMap[target] : null
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/SecretarialServices/ChangeOfRegisteredAddress" as *;
</style>
