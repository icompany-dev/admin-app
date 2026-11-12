<template>
  <div id="age-control-panel-pricings">
    <div class="page-header">
      <BreadCrumb v-bind="pageController.breadCrumbProps" />
      <TableFilters
        v-bind="pageController.tableFilterProps"
        @search="pageController.onSearchInput($event)"
        @order="pageController.onSortOrderChanged($event)"
        @clearSearch="pageController.onSearchInput('')"
      />
    </div>
    <All
      :search-text="pageController.searchText.value"
      :sort-order="pageController.sortOrder.value"
    />
  </div>
</template>

<script setup lang="ts">
  import BreadCrumb from "@/components/BreadCrumbs/Default.vue"
  import All from "@/components/Pricings/All.vue"
  import TableFilters from "~/components/TableData/TableFilters.vue"
  import { PageControlPanelPricingsController } from "~/scripts/pages/PageControlPanelPricingsController"

  const props = defineProps({})
  const emit = defineEmits([])

  const pageController = new PageControlPanelPricingsController()
</script>

<style lang="scss">
  @use "~/assets/scss/pages/control-panels/Pricings" as *;
</style>
