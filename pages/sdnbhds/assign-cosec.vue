<template>
  <div id="page-all-sdn-bhd">
    <div class="page-header">
      <BreadCrumb v-bind="pageController.breadCrumbProps" />
      <TableFilters
        v-bind="pageController.tableFilterProps"
        @search="pageController.onSearchInput($event)"
        @order="pageController.onSortOrderChanged($event)"
        @clearSearch="pageController.onSearchInput('')"
        @unMinimize="pageController.onSdnBhdUnselected()"
      />
    </div>
    <AssignCosec
      :search-text="pageController.searchText.value"
      :sort-order="pageController.sortOrder.value"
      :is-include-demo="pageController.isIncludeDemo.value"
      :is-unselect-sdn-bhd="!pageController.isSdnBhdSelected.value"
      @sdnbhd-selected="pageController.onSdnBhdSelected()"
    />
  </div>
</template>

<script setup lang="ts">
  import BreadCrumb from "@/components/BreadCrumbs/Default.vue"
  import AssignCosec from "@/components/Companies/AssignCosec.vue"
  import TableFilters from "~/components/TableData/TableFilters.vue"
  import { PageAllSdnBhdController } from "~/scripts/pages/PageAllSdnBhdController"

  const props = defineProps({})
  const emit = defineEmits([])

  const pageController = new PageAllSdnBhdController()
</script>

<style lang="scss">
  @use "~/assets/scss/pages/SdnBhd" as *;
</style>
