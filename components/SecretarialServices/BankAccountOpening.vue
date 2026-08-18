<template>
  <div id="secretarial-services-bank-account-opening">
  </div>
</template>

<script lang="ts" setup>
import { BankAccountOpeningController } from '~/scripts/components/secretarial-services/BankAccountOpeningController'

const props = defineProps({})
const emit = defineEmits([]) 

const controller = new BankAccountOpeningController(props, emit)
</script>

<style lang="scss">
@use '~/assets/scss/components/SecretarialServices/BankAccountOpening' as *;
</style>
