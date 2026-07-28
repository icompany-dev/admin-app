<template>
  <div
    id="page-incorporation-drafts"
    class="page-incorporation"
  >
    <div class="page-header">
      <BreadCrumb v-bind="pageController.breadCrumbProps" />
      <TableFilters
        v-bind="pageController.tableFilterProps"
        @search="pageController.onSearchInput($event)"
        @order="pageController.onSortOrderChanged($event)"
        @clearSearch="pageController.onSearchInput('')"
        @unMinimize="pageController.onShowAllClicked()"
      />
    </div>
    <Drafts v-bind="pageController.draftsProps" />
  </div>
</template>

<script setup lang="ts">
  import BreadCrumb from "@/components/BreadCrumbs/Default.vue"
  import Drafts from "@/components/Incorporations/Drafts.vue"
  import TableFilters from "@/components/TableData/TableFilters.vue"
  import { PageIncorporationsDraftController } from "~/scripts/pages/PageIncorporationsDraftController"

  const pageController = new PageIncorporationsDraftController()
</script>

<style lang="scss">
  @use "~/assets/scss/pages/Incorporation" as *;
</style>
