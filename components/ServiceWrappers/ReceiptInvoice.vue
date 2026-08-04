<template>
  <div
    id="service-wrappers-receipt-invoice"
    class="cosec-service-documents"
    :class="{ 'full-size': props.isDocumentEnlarged }"
  >
    <div
      class="documents-section"
      @click="emit('zoomIn')"
      :style="controller.getZoomStyle()"
    >
      <TransitionGroup
        name="flip"
        tag="div"
        class="document-transition-wrapper"
      >
        <ReceiptInvoice
          ref="documentRef"
          :payment-order-id="props.paymentOrderId"
        />
      </TransitionGroup>
    </div>
    <ActionTray :actions="controller.actionTrayElements.value" />
  </div>
</template>

<script lang="ts" setup>
  import ActionTray from "../ActionTrays/ActionTray.vue"
  import ReceiptInvoice from "../Payments/ReceiptInvoice.vue"
  import { ReceiptInvoiceController } from "~/scripts/components/service-wrappers/ReceiptInvoiceController"

  const props = defineProps({
    paymentOrderId: {
      type: String,
      required: true,
    },
    isDocumentEnlarged: {
      type: Boolean,
      default: false,
    },
  })

  const emit = defineEmits(["zoomOut", "zoomIn", "back"])

  const documentRef = ref(null)

  const controller = new ReceiptInvoiceController(props, emit)

  watch(
    documentRef,
    (newVal) => {
      controller.setDocumentRef(newVal)
    },
    { immediate: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Services/CosecServiceDocuments" as *;
  @use "~/assets/scss/components/ServiceWrappers/ReceiptInvoice" as *;
</style>
