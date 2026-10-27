<template>
  <div id="annual-returns-calendar">
  </div>
</template>

<script lang="ts" setup>
import { CalendarController } from '~/scripts/components/annual-returns/CalendarController'

const props = defineProps({})
const emit = defineEmits([]) 

const controller = new CalendarController(props, emit)
</script>

<style lang="scss">
@use '~/assets/scss/components/AnnualReturns/Calendar' as *;
</style>
