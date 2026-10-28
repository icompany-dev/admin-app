<template>
  <div
    id="secretarial-services-appoint-tax-agent"
    class="secretarial-service-application"
  >
    <div class="service-application">
      <AppointNewTaxAgentApplication
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
  import AppointNewTaxAgentApplication from "@/components/Services/AppointNewTaxAgentApplication.vue"
  import AppointmentOfTaxAgentService from "../CompanyServices/AppointmentOfTaxAgentService.vue"
  import ReceiptInvoiceService from "../CompanyServices/ReceiptInvoiceService.vue"
  import { AppointTaxAgentController } from "~/scripts/components/secretarial-services/AppointTaxAgentController"
  import type { IPropsSecretarialService } from "~/scripts/props/PropsSecretarialService"
  import { DocumentTargets } from "~/scripts/constants/DocumentTargets"

  const props = defineProps<IPropsSecretarialService>()

  const emit = defineEmits(["company", "paymentOrderId"])

  const documentRef = ref(null)

  const controller = new AppointTaxAgentController(props, emit)

  const componentMap: Record<string, any> = {
    [DocumentTargets.TARGET_TAX_AGENT_APPOINTMENT_RESOLUTIONS]: AppointmentOfTaxAgentService,
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
  @use "~/assets/scss/components/SecretarialServices/AppointTaxAgent" as *;
</style>
