<template>
  <div id="legal-documents-switch-out-letter">
  </div>
</template>

<script lang="ts" setup>
import { SwitchOutLetterController } from '~/scripts/components/legal-documents/SwitchOutLetterController'

const props = defineProps({})
const emit = defineEmits([]) 

const controller = new SwitchOutLetterController(props, emit)
</script>

<style lang="scss">
@use '~/assets/scss/components/LegalDocuments/SwitchOutLetter' as *;
</style>
