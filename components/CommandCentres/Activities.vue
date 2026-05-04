<template>
  <div id="command-centres-activities">
    <div class="activities-table">//</div>
    <TablePagination
      v-bind="controller.tablePaginationProps"
      @goToPage="controller.goToPage($event)"
    />
  </div>
</template>

<script lang="ts" setup>
  import TablePagination from "@/components/Paginations/TablePagination.vue"
  import { ActivitiesController } from "~/scripts/components/command-centres/ActivitiesController"

  const props = defineProps({})
  const emit = defineEmits([])

  const controller = new ActivitiesController(props, emit)
</script>

<style lang="scss">
  @use "~/assets/scss/components/CommandCentres/Activities" as *;
</style>
