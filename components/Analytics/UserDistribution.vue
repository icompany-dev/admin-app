<template>
  <div id="analytics-user-distribution">
  </div>
</template>

<script lang="ts" setup>
import { UserDistributionController } from '~/scripts/components/analytics/UserDistributionController'

const props = defineProps({})
const emit = defineEmits([]) 

const controller = new UserDistributionController(props, emit)
</script>

<style lang="scss">
@use '~/assets/scss/components/Analytics/UserDistribution' as *;
</style>
