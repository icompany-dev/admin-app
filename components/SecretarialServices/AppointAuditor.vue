<template>
  <div id="secretarial-services-appoint-auditor">
  </div>
</template>

<script lang="ts" setup>
import { AppointAuditorController } from '~/scripts/components/secretarial-services/AppointAuditorController'

const props = defineProps({})
const emit = defineEmits([]) 

const controller = new AppointAuditorController(props, emit)
</script>

<style lang="scss">
@use '~/assets/scss/components/SecretarialServices/AppointAuditor' as *;
</style>
