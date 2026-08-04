<template>
  <div id="service-wrappers-receipt-invoice">
  </div>
</template>

<script lang="ts" setup>
import { ReceiptInvoiceController } from '~/scripts/components/service-wrappers/ReceiptInvoiceController'

const props = defineProps({})
const emit = defineEmits([]) 

const controller = new ReceiptInvoiceController(props, emit)
</script>

<style lang="scss">
@use '~/assets/scss/components/ServiceWrappers/ReceiptInvoice' as *;
</style>
