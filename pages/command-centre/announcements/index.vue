<template>
  <div id="page-announcements-all">
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
  import All from "@/components/Announcements/All.vue"
  import TableFilters from "~/components/TableData/TableFilters.vue"
  import { PageAnnouncementsController } from "~/scripts/pages/PageAnnouncementsController"

  const props = defineProps({})
  const emit = defineEmits([])

  const pageController = new PageAnnouncementsController()
</script>

<style lang="scss">
  @use "~/assets/scss/pages/Announcements" as *;
</style>
