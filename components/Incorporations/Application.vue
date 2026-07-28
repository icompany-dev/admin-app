<template>
  <div id="incorporations-application">// do something here</div>
</template>

<script lang="ts" setup>
  import { ApplicationController } from "~/scripts/components/incorporations/ApplicationController"
  import type { IPropsIncorporationApplication } from "~/scripts/props/PropsIncorporationApplication"

  const props = defineProps<IPropsIncorporationApplication>()

  const emit = defineEmits(["back"])

  const controller = new ApplicationController(props, emit)

  watch(
    () => props,
    (newVal) => {
      controller.setDataFromProps(newVal)
    },
    { deep: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Incorporations/Application" as *;
</style>
