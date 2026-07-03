<template>
  <div id="page-all-sdn-bhd">
    <div class="page-header">
      <BreadCrumb v-bind="pageController.breadCrumbProps" />
      <TableFilters
        v-bind="pageController.tableFilterProps"
        @unMinimize="pageController.onBackClicked()"
      />
    </div>
    <div class="selected-company">
      <SelectedSdnBhd :company-id="pageController.companyId.value" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import BreadCrumb from "@/components/BreadCrumbs/Default.vue"
  import SelectedSdnBhd from "~/components/Companies/SelectedSdnBhd.vue"
  import TableFilters from "~/components/TableData/TableFilters.vue"
  import { PageSdnBhdController } from "~/scripts/pages/PageSdnBhdController"

  const props = defineProps({})
  const emit = defineEmits([])

  const pageController = new PageSdnBhdController()

  watch(
    () => pageController.route.params,
    (newVal) => {
      pageController.handleRoute()
    }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/pages/SdnBhd" as *;
</style>
