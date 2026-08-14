<template>
  <div
    id="home-button"
    class="page-tool home-button"
    @click="controller.onHomeButtonClick()"
  >
    <i class="icon fa-duotone fa-home" />
    <div class="page-tool-tooltip">{{ controller.getLabel() }}</div>
    <div class="mobile-label">{{ controller.getLabel() }}</div>
  </div>
</template>

<script setup lang="ts">
  import { HomeButtonController } from "~/scripts/components/headers/HomeButtonController"

  const controller = new HomeButtonController()
</script>

<style lang="scss">
  @use "~/assets/scss/components/Headers/PageTool" as *;
</style>
