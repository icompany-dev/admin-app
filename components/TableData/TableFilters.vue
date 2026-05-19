<template>
  <div id="table-data-table-filters">
  </div>
</template>

<script lang="ts" setup>
import { TableFiltersController } from '~/scripts/components/table-data/TableFiltersController'

const props = defineProps({})
const emit = defineEmits([]) 

const controller = new TableFiltersController(props, emit)
</script>

<style lang="scss">
@use '~/assets/scss/components/TableData/TableFilters' as *;
</style>
