<template>
  <div id="popups-add-tin-number">
  </div>
</template>

<script lang="ts" setup>
import { AddTinNumberController } from '~/scripts/components/popups/AddTinNumberController'

const props = defineProps({})
const emit = defineEmits([]) 

const controller = new AddTinNumberController(props, emit)
</script>

<style lang="scss">
@use '~/assets/scss/components/Popups/AddTinNumber' as *;
</style>
