<template>
  <div
    id="secretarial-services-allot-new-share"
    class="secretarial-service-application"
  >
    <div class="service-application">
      <AllotNewShareApplication
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
  import AllotNewShareApplication from "../Services/AllotNewShareApplication.vue"
  import IssueAndAllotShareService from "../CompanyServices/IssueAndAllotShareService.vue"
  import ReceiptInvoiceService from "../CompanyServices/ReceiptInvoiceService.vue"
  import { AllotNewShareController } from "~/scripts/components/secretarial-services/AllotNewShareController"
  import type { IPropsSecretarialService } from "~/scripts/props/PropsSecretarialService"
  import { DocumentTargets } from "~/scripts/constants/DocumentTargets"

  const props = defineProps<IPropsSecretarialService>()

  const emit = defineEmits(["company", "paymentOrderId"])

  const documentRef = ref(null)

  const controller = new AllotNewShareController(props, emit)

  const componentMap: Record<string, any> = {
    [DocumentTargets.TARGET_RECEIPT]: ReceiptInvoiceService,
    [DocumentTargets.TARGET_SHAREHOLDER_ALLOTMENT_OF_SHARES_RESOLUTIONS]: IssueAndAllotShareService,
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
  @use "~/assets/scss/components/SecretarialServices/AllotNewShare" as *;
</style>
