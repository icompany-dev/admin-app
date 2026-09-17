<template>
  <div id="company-services-change-bank-signatories-service">
  </div>
</template>

<script lang="ts" setup>
import { ChangeBankSignatoriesServiceController } from '~/scripts/components/company-services/ChangeBankSignatoriesServiceController'

const props = defineProps({})
const emit = defineEmits([]) 

const controller = new ChangeBankSignatoriesServiceController(props, emit)
</script>

<style lang="scss">
@use '~/assets/scss/components/CompanyServices/ChangeBankSignatoriesService' as *;
</style>
