<template>
  <div id="companies-annual-return-lodgement">
  </div>
</template>

<script lang="ts" setup>
import { AnnualReturnLodgementController } from '~/scripts/components/companies/AnnualReturnLodgementController'

const props = defineProps({})
const emit = defineEmits([]) 

const controller = new AnnualReturnLodgementController(props, emit)
</script>

<style lang="scss">
@use '~/assets/scss/components/Companies/AnnualReturnLodgement' as *;
</style>
