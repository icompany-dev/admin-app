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
        @unMinimize="pageController.onClearSelected()"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import BreadCrumb from "@/components/BreadCrumbs/Default.vue"
  import TableFilters from "@/components/TableData/TableFilters.vue"
  import { PageSwitchesOngoingController } from "~/scripts/pages/PageSwitchesOngoingController"

  const pageController = new PageSwitchesOngoingController()

  watch(
    () => pageController.route.params,
    (newVal) => {
      pageController.handleRoute()
    }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/pages/Incorporation" as *;
</style>
