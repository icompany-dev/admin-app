<template>
  <div id="page-transactions">
    <div class="page-header">
      <BreadCrumb v-bind="pageController.breadCrumbProps" />
      <!-- <TableFilters
        v-bind="pageController.tableFilterProps"
        @search="pageController.onSearchInput($event)"
        @order="pageController.onSortOrderChanged($event)"
        @clearSearch="pageController.onSearchInput('')"
      /> -->
    </div>

    <div class="all-transactions">
      <TransactionHistory />
    </div>
  </div>
</template>

<script setup lang="ts">
  import BreadCrumb from "@/components/BreadCrumbs/Default.vue"
  import TableFilters from "@/components/TableData/TableFilters.vue"
  import TransactionHistory from "@/components/Transactions/TransactionHistory.vue"
  import { PageTransactionsController } from "~/scripts/pages/PageTransactionsController"

  const pageController = new PageTransactionsController()
</script>

<style lang="scss">
  @use "~/assets/scss/pages/Transactions" as *;
</style>
