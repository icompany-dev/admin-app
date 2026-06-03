<template>
  <div id="table-data-table-filters">
    <div
      class="search-container"
      v-if="props.isSearchable"
    >
      <i class="fa-solid fa-magnifying-glass"></i>
      <input
        type="text"
        placeholder="Search by keyword"
        class="form-control"
        v-model="controller.searchText"
        @change="emit('search', controller.searchText)"
      />
    </div>
    <div
      class="sort-container"
      v-if="props.hasOrderBy"
    >
      <div
        class="checkbox-toggle"
        v-for="(orderBy, index) in props.orderBys"
        :key="index"
      >
        <label class="switch switch-sm">
          <input
            type="checkbox"
            :id="`order-by-${index}`"
            :value="orderBy.orderColumn"
            v-model="orderBy.sortOrder"
            @change="emit('order', orderBy)"
          />
          <span class="slider round" />
        </label>
        <label
          class="switch-label"
          :for="`order-by-${index}`"
        >
          {{ orderBy.orderColumn }}
        </label>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { TableFiltersController } from "~/scripts/components/table-data/TableFiltersController"
  import type { IPropsTableFilter } from "~/scripts/props/PropsTableFilter"

  const props = defineProps<IPropsTableFilter>()

  const emit = defineEmits(["search", "order", "filter"])

  const controller = new TableFiltersController(props, emit)

  watch(
    () => props,
    (newVal) => {
      controller.setValuesFromProps(newVal)
    },
    { deep: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/TableData/TableFilters" as *;
</style>
