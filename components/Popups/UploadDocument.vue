<template>
  <div id="popups-upload-document">
  </div>
</template>

<script lang="ts" setup>
import { UploadDocumentController } from '~/scripts/components/popups/UploadDocumentController'

const props = defineProps({})
const emit = defineEmits([]) 

const controller = new UploadDocumentController(props, emit)
</script>

<style lang="scss">
@use '~/assets/scss/components/Popups/UploadDocument' as *;
</style>
