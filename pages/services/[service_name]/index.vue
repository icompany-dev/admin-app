<template>
  <div id="page-secretarial-services">
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
    <Applications v-bind="pageController.secretarialServicesProps" />
  </div>
</template>

<script setup lang="ts">
  import BreadCrumb from "@/components/BreadCrumbs/Default.vue"
  import TableFilters from "@/components/TableData/TableFilters.vue"
  import Applications from "@/components/SecretarialServices/Applications.vue"
  import { PageSdnBhdSecretarialServicesController } from "~/scripts/pages/PageSdnBhdSecretarialServicesController"

  const pageController = new PageSdnBhdSecretarialServicesController()

  watch(
    () => pageController.route.params,
    (newVal) => {
      pageController.setTitleDescription()
    }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/pages/SdnBhdSecretarialServices" as *;
</style>
