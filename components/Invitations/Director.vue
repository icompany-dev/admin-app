<template>
  <div id="invitations-director">
  </div>
</template>

<script lang="ts" setup>
import { DirectorController } from '~/scripts/components/invitations/DirectorController'

const props = defineProps({})
const emit = defineEmits([]) 

const controller = new DirectorController(props, emit)
</script>

<style lang="scss">
@use '~/assets/scss/components/Invitations/Director' as *;
</style>
