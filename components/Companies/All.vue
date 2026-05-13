<template>
  <div id="companies-all"></div>
</template>

<script lang="ts" setup>
  import { AllController } from "~/scripts/components/companies/AllController"

  const props = defineProps({})
  const emit = defineEmits([])

  const controller = new AllController(emit)
</script>

<style lang="scss">
  @use "~/assets/scss/components/Companies/All" as *;
</style>
