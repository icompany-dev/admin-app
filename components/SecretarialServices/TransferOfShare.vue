<template>
  <div id="secretarial-services-transfer-of-share">
  </div>
</template>

<script lang="ts" setup>
import { TransferOfShareController } from '~/scripts/components/secretarial-services/TransferOfShareController'

const props = defineProps({})
const emit = defineEmits([]) 

const controller = new TransferOfShareController(props, emit)
</script>

<style lang="scss">
@use '~/assets/scss/components/SecretarialServices/TransferOfShare' as *;
</style>
