<template>
  <div id="analytics-data-distribution-map">
    <Map v-bind="controller.mapProps" />
  </div>
</template>

<script lang="ts" setup>
  import Map from "./Map.vue"
  import { DataDistributionMapController } from "~/scripts/components/analytics/DataDistributionMapController"

  const props = defineProps({})
  const emit = defineEmits([])

  const controller = new DataDistributionMapController(props, emit)
</script>

<style lang="scss">
  @use "~/assets/scss/components/Analytics/DataDistributionMap" as *;
</style>
