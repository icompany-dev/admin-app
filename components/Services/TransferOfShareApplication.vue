<template>
  <div id="services-transfer-of-share-application">
  </div>
</template>

<script lang="ts" setup>
import { TransferOfShareApplicationController } from '~/scripts/components/services/TransferOfShareApplicationController'

const props = defineProps({})
const emit = defineEmits([]) 

const controller = new TransferOfShareApplicationController(props, emit)
</script>

<style lang="scss">
@use '~/assets/scss/components/Services/TransferOfShareApplication' as *;
</style>
