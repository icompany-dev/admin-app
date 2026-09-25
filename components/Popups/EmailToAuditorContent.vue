<template>
  <div id="popups-email-to-auditor-content">
  </div>
</template>

<script lang="ts" setup>
import { EmailToAuditorContentController } from '~/scripts/components/popups/EmailToAuditorContentController'

const props = defineProps({})
const emit = defineEmits([]) 

const controller = new EmailToAuditorContentController(props, emit)
</script>

<style lang="scss">
@use '~/assets/scss/components/Popups/EmailToAuditorContent' as *;
</style>
