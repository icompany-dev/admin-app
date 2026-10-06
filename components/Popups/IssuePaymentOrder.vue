<template>
  <div id="popups-issue-payment-order"></div>
</template>

<script lang="ts" setup>
  import { IssuePaymentOrderController } from "~/scripts/components/popups/IssuePaymentOrderController"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
  })
  const emit = defineEmits([])

  const controller = new IssuePaymentOrderController(props.companyId, emit)
</script>

<style lang="scss">
  @use "~/assets/scss/components/Popups/IssuePaymentOrder" as *;
</style>
