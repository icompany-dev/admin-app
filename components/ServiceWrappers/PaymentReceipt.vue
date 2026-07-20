<template>
  <div id="service-wrappers-payment-receipt">
  </div>
</template>

<script lang="ts" setup>
import { PaymentReceiptController } from '~/scripts/components/service-wrappers/PaymentReceiptController'

const props = defineProps({})
const emit = defineEmits([]) 

const controller = new PaymentReceiptController(props, emit)
</script>

<style lang="scss">
@use '~/assets/scss/components/ServiceWrappers/PaymentReceipt' as *;
</style>
