<template>
  <div id="quick-generate-letter-to-vacate">
  </div>
</template>

<script lang="ts" setup>
import { LetterToVacateController } from '~/scripts/components/quick-generate/LetterToVacateController'

const props = defineProps({})
const emit = defineEmits([]) 

const controller = new LetterToVacateController(props, emit)
</script>

<style lang="scss">
@use '~/assets/scss/components/QuickGenerate/LetterToVacate' as *;
</style>
