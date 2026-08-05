<template>
  <div id="analytics-distribution-map">
    <div
      class="loader-container"
      v-if="controller.isLoading.value"
    >
      <LoaderPrepare
        :label="controller.loaderLabel"
        :sublabel="controller.loaderSublabel"
      />
    </div>
    <div
      class="map-container"
      v-if="!controller.isLoading.value"
    >
      <GoogleMap
        :api-key="controller.googleMapApiKey"
        style="width: 100%; height: 70dvh"
        :center="controller.center.getJSON()"
        :zoom="controller.zoom"
      >
        <Marker :options="{ position: controller.center.getJSON() }" />
        <Marker
          v-for="(user, i) in controller.users"
          :key="`user-${i}`"
          :options="{
            position: user.coordinate.getJson(),
            title: `${user.name}`,
            icon: controller.getUserMarkerIcon(user.gender),
          }"
        >
          <InfoWindow>//</InfoWindow>
        </Marker>
      </GoogleMap>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import { DistributionMapController } from "~/scripts/components/analytics/DistributionMapController"

  const props = defineProps({})
  const emit = defineEmits([])

  const controller = new DistributionMapController(props, emit)
</script>

<style lang="scss">
  @use "~/assets/scss/components/Analytics/DistributionMap" as *;
</style>
