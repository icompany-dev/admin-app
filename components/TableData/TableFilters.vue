<template>
  <TransitionGroup
    id="table-data-table-filters"
    name="slide-left-leave-right"
    tag="div"
  >
    <div
      class="search-container"
      v-if="props.isSearchable"
    >
      <i class="fa-solid fa-magnifying-glass"></i>
      <input
        type="text"
        placeholder="Press 'Enter' to Search"
        class="form-control"
        v-model="controller.searchText"
        @change="emit('search', controller.searchText)"
      />
      <i
        v-if="controller.searchText.length > 0"
        class="fa-solid fa-xmark reset"
        @click="emit('clearSearch')"
      ></i>
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
    <div
      v-if="props.isMinimizedDisplay"
      class="back-button"
      @click="emit('unMinimize')"
    >
      <i class="fa-solid fa-circle-arrow-left" />
    </div>
  </TransitionGroup>
</template>

<script lang="ts" setup>
  import { TableFiltersController } from "~/scripts/components/table-data/TableFiltersController"
  import type { IPropsTableFilter } from "~/scripts/props/PropsTableFilter"

  const props = defineProps<IPropsTableFilter>()

  const emit = defineEmits(["search", "order", "filter", "clearSearch", "unMinimize"])

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
