<template>
  <div id="analytics-user-distribution"></div>
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
