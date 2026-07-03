<template>
  <div
    id="company-services-receipt-invoice"
    class="company-services"
  >
    <CompanyServiceWrapper v-bind="controller.serviceWrapperProps">
      <template #resolutions>
        <TransitionGroup
          name="flip"
          tag="div"
          class="documents"
        >
          <ReceiptInvoice :payment-order-id="controller.paymentOrderId.value" />
        </TransitionGroup>
      </template>
    </CompanyServiceWrapper>
  </div>
</template>

<script lang="ts" setup>
  import CompanyServiceWrapper from "./CompanyServiceWrapper.vue"
  import ReceiptInvoice from "@/components/Payments/ReceiptInvoice.vue"
  import { ReceiptInvoiceServiceController } from "~/scripts/components/company-services/ReceiptInvoiceController"
  import type { IPropsDocumentService } from "~/scripts/props/PropsDocumentService"

  const props = defineProps<IPropsDocumentService>()

  const emit = defineEmits([])

  const controller = new ReceiptInvoiceServiceController(props, emit)

  watch(
    () => props,
    (newVal) => {
      controller.setValuesProps(newVal)
    },
    { deep: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/CompanyServices/Service" as *;
</style>
