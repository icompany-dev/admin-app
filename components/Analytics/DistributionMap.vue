<template>
  <div id="analytics-user-distribution">
    <div class="map-container">
      <GoogleMap
        :api-key="controller.googleMapApiKey"
        style="width: 100%; height: 500px"
        :center="controller.center.getJSON()"
        :zoom="controller.zoom"
      >
        <Marker :options="{ position: controller.center.getJSON() }" />
      </GoogleMap>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { DistributionMapController } from "~/scripts/components/analytics/DistributionMapController"

  const props = defineProps({})
  const emit = defineEmits([])

  const controller = new DistributionMapController(props, emit)
</script>

<style lang="scss">
  @use "~/assets/scss/components/Analytics/UserDistribution" as *;
</style>
