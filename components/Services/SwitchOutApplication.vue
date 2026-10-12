<template>
  <div id="services-switch-out-application">
  </div>
</template>

<script lang="ts" setup>
import { SwitchOutApplicationController } from '~/scripts/components/services/SwitchOutApplicationController'

const props = defineProps({})
const emit = defineEmits([]) 

const controller = new SwitchOutApplicationController(props, emit)
</script>

<style lang="scss">
@use '~/assets/scss/components/Services/SwitchOutApplication' as *;
</style>
