<template>
  <div id="page-all-sdn-bhd">
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
      :is-include-demo="pageController.isIncludeDemo.value"
    />
  </div>
</template>

<script lang="ts" setup>
  import BreadCrumb from "@/components/BreadCrumbs/Default.vue"
  import All from "@/components/Companies/All.vue"
  import TableFilters from "~/components/TableData/TableFilters.vue"
  import { PageAllSdnBhdController } from "~/scripts/pages/PageAllSdnBhdController"

  const props = defineProps({})
  const emit = defineEmits([])

  const pageController = new PageAllSdnBhdController()
</script>

<style lang="scss">
  @use "~/assets/scss/pages/SdnBhd" as *;
</style>
