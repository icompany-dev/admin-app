<template>
  <div id="page-secretarial-services">
    <div class="page-header">
      <BreadCrumb v-bind="pageController.breadCrumbProps" />
      <TableFilters
        v-bind="pageController.tableFilterProps"
        @search="pageController.onSearchInput($event)"
        @order="pageController.onSortOrderChanged($event)"
        @clearSearch="pageController.onSearchInput('')"
      />
    </div>
    <All />
  </div>
</template>

<script setup lang="ts">
  import All from "@/components/AnnualReturns/All.vue"
  import BreadCrumb from "@/components/BreadCrumbs/Default.vue"
  import TableFilters from "@/components/TableData/TableFilters.vue"
  import { PageSdnBhdAnnualReturnsController } from "~/scripts/pages/PageSdnBhdAnnualReturnsController"

  const pageController = new PageSdnBhdAnnualReturnsController()
</script>

<style lang="scss">
  @use "~/assets/scss/pages/SdnBhdSecretarialServices" as *;
</style>
