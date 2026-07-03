<template>
  <div id="services-change-of-address-application">
  </div>
</template>

<script lang="ts" setup>
import { ChangeOfAddressApplicationController } from '~/scripts/components/services/ChangeOfAddressApplicationController'

const props = defineProps({})
const emit = defineEmits([]) 

const controller = new ChangeOfAddressApplicationController(props, emit)
</script>

<style lang="scss">
@use '~/assets/scss/components/Services/ChangeOfAddressApplication' as *;
</style>
