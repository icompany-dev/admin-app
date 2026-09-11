<template>
  <div id="services-allot-new-share-application">
  </div>
</template>

<script lang="ts" setup>
import { AllotNewShareApplicationController } from '~/scripts/components/services/AllotNewShareApplicationController'

const props = defineProps({})
const emit = defineEmits([]) 

const controller = new AllotNewShareApplicationController(props, emit)
</script>

<style lang="scss">
@use '~/assets/scss/components/Services/AllotNewShareApplication' as *;
</style>
