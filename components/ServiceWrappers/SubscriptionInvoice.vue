<template>
  <div
    id="subscription-invoice"
    class="cosec-service-documents"
    :class="{ 'full-size': props.isDocumentEnlarged }"
  >
    <div
      class="documents-section"
      @click="controller.onInvoiceClicked()"
      :style="controller.getZoomStyle()"
    >
      <ReceiptInvoice
        v-if="controller.paymentOrder.value && controller.paymentOrder.value.id"
        :payment-order="controller.paymentOrder.value"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import ReceiptInvoice from "../Payments/ReceiptInvoice.vue"
  import { SubscriptionInvoiceController } from "@/scripts/components/service-wrappers/SubscriptionInvoiceController"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
    applicationId: {
      type: String,
      required: true,
    },
    isDocumentEnlarged: {
      type: Boolean,
      default: false,
    },
  })

  const emit = defineEmits(["zoomOut", "zoomIn", "openCart"])

  const controller = new SubscriptionInvoiceController(props.companyId, props.applicationId, emit)

  watch(
    () => props.companyId,
    (newVal) => {
      controller.setCompanyId(newVal)
    }
  )

  watch(
    () => props.applicationId,
    (newVal) => {
      controller.setApplicationId(newVal)
    }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Services/CosecServiceDocuments" as *;
  @use "~/assets/scss/components/Services/SubscriptionInvoice" as *;
</style>
