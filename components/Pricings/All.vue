<template>
  <div id="pricings-all">
  </div>
</template>

<script lang="ts" setup>
import { AllController } from '~/scripts/components/pricings/AllController'

const props = defineProps({})
const emit = defineEmits([]) 

const controller = new AllController(props, emit)
</script>

<style lang="scss">
@use '~/assets/scss/components/Pricings/All' as *;
</style>
