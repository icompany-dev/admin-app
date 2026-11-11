<template>
  <div id="transaction-history">
    <div
      v-for="year in controller.years.value"
      :key="year"
    >
      <TransactionYear
        :year="year"
        :transaction-histories="controller.getTransactionHistories(year)"
        :sort-by="controller.sortBy.value"
        :order-by="controller.orderBy.value"
        :is-hidden="controller.isHidden(year)"
        :is-year-empty="controller.isYearEmpty(year)"
        @make-payment="emit('makePayment')"
        @sort="controller.onSortBy($event)"
        @selected="controller.onTransactionYearSelected()"
        ref="transactionYearRefs"
      />
    </div>

    <div
      class="loader-container"
      v-if="controller.isLoading.value"
    >
      <LoaderPrepare
        :label="controller.loaderLabel()"
        :sublabel="controller.loaderSublabel()"
      />
    </div>

    <Teleport to="body">
      <ActionTray
        ref="actionTrayRef"
        :actions="controller.actionTray"
        @on-close-search="controller.onSearchTransactionHistory()"
      />
      <div class="transaction-page-receipt-container">
        <ReceiptInvoice
          ref="receiptRef"
          :payment-order="controller.paymentOrderForReceipt.value"
          :payment-order-id="controller.paymentOrderIdForReceipt.value ?? ''"
        />
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import ReceiptInvoice from "@/components/Payments/ReceiptInvoice.vue"
  import ActionTray from "@/components/ActionTrays/ActionTray.vue"
  import TransactionYear from "~/components/Transactions/TransactionYear.vue"
  import { TransactionHistoryController } from "~/scripts/components/transactions/TransactionHistoryController"

  const emit = defineEmits(["makePayment"])

  const transactionYearRefs = ref<any[]>([])
  const actionTrayRef: any = ref(null)
  const receiptRef = ref(null)

  const controller: TransactionHistoryController = new TransactionHistoryController()

  watch(
    transactionYearRefs,
    (newVal) => {
      controller.setTransactionYearRefs(newVal)
    },
    { immediate: true, deep: true }
  )

  watch(
    actionTrayRef,
    (newVal) => {
      controller.setActionTrayRef(newVal)
    },
    { immediate: true }
  )

  watch(
    receiptRef,
    (newVal) => {
      if (newVal) {
        controller.setReceiptRef(newVal)
      }
    },
    { immediate: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Transactions/TransactionHistory" as *;
</style>
