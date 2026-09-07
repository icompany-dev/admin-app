<template>
  <div
    id="secretarial-services-appoint-director"
    class="secretarial-service-application"
  >
    <div class="service-application">
      <AppointNewDirectorApplication
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
  import AppointNewDirectorApplication from "../Services/AppointNewDirectorApplication.vue"
  import AppointNewDirectorService from "../CompanyServices/AppointNewDirectorService.vue"
  import ReceiptInvoiceService from "../CompanyServices/ReceiptInvoiceService.vue"
  import { AppointDirectorController } from "~/scripts/components/secretarial-services/AppointDirectorController"
  import type { IPropsSecretarialService } from "~/scripts/props/PropsSecretarialService"
  import { DocumentTargets } from "~/scripts/constants/DocumentTargets"

  const props = defineProps<IPropsSecretarialService>()

  const emit = defineEmits(["company", "paymentOrderId"])

  const documentRef = ref(null)

  const controller = new AppointDirectorController(props, emit)

  const componentMap: Record<string, any> = {
    [DocumentTargets.TARGET_DIRECTOR_APPOINTMENT_RESOLUTIONS]: AppointNewDirectorService,
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
  @use "~/assets/scss/components/SecretarialServices/AppointDirector" as *;
</style>
