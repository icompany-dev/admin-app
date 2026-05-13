<template>
  <div id="pagination-table-pagination">
    <div
      v-if="controller.canPreviousPage"
      @click="controller.onPreviousClicked()"
      class="prev-next-label"
    >
      {{ controller.previousLabel }}
    </div>
    <div class="page-range-container">
      <div
        class="page-range"
        @click="controller.onPageClicked(page)"
        v-for="page in controller.pageRanges"
        :key="page"
        :class="{ selected: page === controller.filter.value.page }"
      >
        {{ page }}
      </div>
    </div>
    <div
      v-if="controller.canNextPage"
      @click="controller.onNextClicked()"
      class="prev-next-label"
    >
      {{ controller.nextLabel }}
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { TablePaginationController } from "~/scripts/components/paginations/TablePaginationController"
  import type { IPropsTablePagination } from "~/scripts/props/PropsTablePagination"

  const props = defineProps<IPropsTablePagination>()
  const emit = defineEmits(["goToPage"])

  const controller = new TablePaginationController(props, emit)

  watch(
    () => props.filter,
    (newVal) => {
      controller.setFilter(newVal)
    },
    { deep: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Paginations/TablePagination" as *;
</style>
