<template>
  <div id="analytics-data-distribution-map">
    <Map
      v-bind="controller.mapProps"
      @selectUser="controller.onSelectedUser($event)"
      @selectCompany="controller.onSelectedCompany($event)"
    />
    <!-- <MapFilterDrawer v-bind="controller.mapFilterDrawerProps" /> -->
    <MapDetailDrawer
      v-bind="controller.mapDetailDrawerProps"
      @close="controller.onCloseDetailDrawer()"
      @selectUser="controller.onSelectedUser($event)"
      @selectCompany="controller.onSelectedCompany($event)"
      @flyTo="controller.onFlyTo($event)"
    />
  </div>
</template>

<script lang="ts" setup>
  import Map from "./Map.vue"
  import MapDetailDrawer from "./MapDetailDrawer.vue"
  import MapFilterDrawer from "./MapFilterDrawer.vue"
  import { DataDistributionMapController } from "~/scripts/components/analytics/DataDistributionMapController"

  const props = defineProps({})
  const emit = defineEmits([])

  const controller = new DataDistributionMapController(props, emit)
</script>

<style lang="scss">
  @use "~/assets/scss/components/Analytics/DataDistributionMap" as *;
</style>
