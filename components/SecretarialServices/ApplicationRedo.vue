<template>
  <div id="secretarial-services-application-redo">
  </div>
</template>

<script lang="ts" setup>
import { ApplicationRedoController } from '~/scripts/components/secretarial-services/ApplicationRedoController'

const props = defineProps({})
const emit = defineEmits([]) 

const controller = new ApplicationRedoController(props, emit)
</script>

<style lang="scss">
@use '~/assets/scss/components/SecretarialServices/ApplicationRedo' as *;
</style>
