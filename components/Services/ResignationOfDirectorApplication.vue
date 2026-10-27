<template>
  <div id="services-resignation-of-director-application">
  </div>
</template>

<script lang="ts" setup>
import { ResignationOfDirectorApplicationController } from '~/scripts/components/services/ResignationOfDirectorApplicationController'

const props = defineProps({})
const emit = defineEmits([]) 

const controller = new ResignationOfDirectorApplicationController(props, emit)
</script>

<style lang="scss">
@use '~/assets/scss/components/Services/ResignationOfDirectorApplication' as *;
</style>
