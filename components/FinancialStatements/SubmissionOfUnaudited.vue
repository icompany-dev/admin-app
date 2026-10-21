<template>
  <div id="financial-statements-submission-of-unaudited">
  </div>
</template>

<script lang="ts" setup>
import { SubmissionOfUnauditedController } from '~/scripts/components/financial-statements/SubmissionOfUnauditedController'

const props = defineProps({})
const emit = defineEmits([]) 

const controller = new SubmissionOfUnauditedController(props, emit)
</script>

<style lang="scss">
@use '~/assets/scss/components/FinancialStatements/SubmissionOfUnaudited' as *;
</style>
