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
          <ReceiptInvoice
            ref="documentRef"
            :payment-order-id="controller.paymentOrderId.value"
          />
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

  const documentRef = ref(null)

  const controller = new ReceiptInvoiceServiceController(props, emit)

  watch(
    () => props,
    (newVal) => {
      controller.setValuesProps(newVal)
    },
    { deep: true }
  )

  watch(
    documentRef,
    (newVal) => {
      controller.setDocumentRef(newVal)
    },
    { immediate: true }
  )

  defineExpose({
    onDownloadClicked: controller.onDownloadClicked.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/CompanyServices/Service" as *;
</style>
