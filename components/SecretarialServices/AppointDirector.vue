<template>
  <div id="secretarial-services-appoint-director">
  </div>
</template>

<script lang="ts" setup>
import { AppointDirectorController } from '~/scripts/components/secretarial-services/AppointDirectorController'

const props = defineProps({})
const emit = defineEmits([]) 

const controller = new AppointDirectorController(props, emit)
</script>

<style lang="scss">
@use '~/assets/scss/components/SecretarialServices/AppointDirector' as *;
</style>
