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
    <Drafts
      v-if="pageController.showAll.value"
      v-bind="pageController.draftsProps"
    />
    <Application
      v-if="pageController.showSelected.value"
      v-bind="pageController.applicationProps"
    />
  </div>
</template>

<script setup lang="ts">
  import Application from "@/components/Incorporations/Application.vue"
  import BreadCrumb from "@/components/BreadCrumbs/Default.vue"
  import Drafts from "@/components/Incorporations/Drafts.vue"
  import TableFilters from "@/components/TableData/TableFilters.vue"
  import { PageIncorporationsDraftController } from "~/scripts/pages/PageIncorporationsDraftController"

  const pageController = new PageIncorporationsDraftController()

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
