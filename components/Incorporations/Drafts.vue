<template>
  <div id="incorporations-drafts">
  </div>
</template>

<script lang="ts" setup>
import { DraftsController } from '~/scripts/components/incorporations/DraftsController'

const props = defineProps({})
const emit = defineEmits([]) 

const controller = new DraftsController(props, emit)
</script>

<style lang="scss">
@use '~/assets/scss/components/Incorporations/Drafts' as *;
</style>
