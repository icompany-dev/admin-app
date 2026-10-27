<template>
  <div id="financial-statements-unaudited-generator">
  </div>
</template>

<script lang="ts" setup>
import { UnauditedGeneratorController } from '~/scripts/components/financial-statements/UnauditedGeneratorController'

const props = defineProps({})
const emit = defineEmits([]) 

const controller = new UnauditedGeneratorController(props, emit)
</script>

<style lang="scss">
@use '~/assets/scss/components/FinancialStatements/UnauditedGenerator' as *;
</style>
