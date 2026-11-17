<template>
  <div id="page-control-panel-pricings">
    <div class="page-header">
      <BreadCrumb v-bind="pageController.breadCrumbProps" />
      <div class="items">
        <TableFilters
          v-bind="pageController.tableFilterProps"
          @search="pageController.onSearchInput($event)"
          @order="pageController.onSortOrderChanged($event)"
          @clearSearch="pageController.onSearchInput('')"
        />
        <div
          class="add-icon"
          @click="pageController.onAddNewClicked()"
        >
          <i class="fa-solid fa-circle-plus" />
        </div>
      </div>
    </div>
    <All
      ref="allRef"
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

  const allRef = ref(null)

  const pageController = new PageControlPanelPricingsController()

  watch(
    allRef,
    (newVal) => {
      pageController.setAllRef(newVal)
    },
    { immediate: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/pages/ControlPanels/Pricings" as *;
</style>
