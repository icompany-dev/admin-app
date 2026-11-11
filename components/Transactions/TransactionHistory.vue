<template>
  <div id="transactions-transaction-history">
  </div>
</template>

<script lang="ts" setup>
import { TransactionHistoryController } from '~/scripts/components/transactions/TransactionHistoryController'

const props = defineProps({})
const emit = defineEmits([]) 

const controller = new TransactionHistoryController(props, emit)
</script>

<style lang="scss">
@use '~/assets/scss/components/Transactions/TransactionHistory' as *;
</style>
