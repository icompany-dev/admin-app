<template>
  <div
    id="secretarialservices-change-of-name"
    class="secretarial-service-application"
  >
    <div class="service-application">
      <ChangeOfNameApplication
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
  import ChangeOfNameService from "../CompanyServices/ChangeOfNameService.vue"
  import ChangeOfNameApplication from "../Services/ChangeOfNameApplication.vue"
  import ReceiptInvoiceService from "../CompanyServices/ReceiptInvoiceService.vue"
  import Section27Service from "@/components/CompanyServices/Section27Service.vue"
  import Section28Service from "@/components/CompanyServices/Section28Service.vue"
  import { ChangeOfNameController } from "~/scripts/components/secretarial-services/ChangeOfNameController"
  import type { IPropsSecretarialService } from "~/scripts/props/PropsSecretarialService"
  import { DocumentTargets } from "~/scripts/constants/DocumentTargets"

  const props = defineProps<IPropsSecretarialService>()

  const emit = defineEmits(["company", "paymentOrderId"])

  const documentRef = ref(null)

  const controller = new ChangeOfNameController(props, emit)

  const componentMap: Record<string, any> = {
    [DocumentTargets.TARGET_AMENDMENT_NAME_RESOLUTIONS]: ChangeOfNameService,
    [DocumentTargets.TARGET_AMENDMENT_NAME_SECTION27]: Section27Service,
    [DocumentTargets.TARGET_AMENDMENT_NAME_SECTION28]: Section28Service,
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
  @use "~/assets/scss/components/Secretarialservices/ChangeOfName" as *;
</style>
