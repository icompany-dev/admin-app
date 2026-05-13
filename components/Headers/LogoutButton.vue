<template>
  <div
    id="logout-button"
    class="page-tool"
    @click="controller.onLogoutButtonClicked()"
  >
    <i class="icon fa-solid fa-person-to-door" />
    <div class="page-tool-tooltip">{{ controller.getLabel() }}</div>
    <div class="mobile-label">{{ controller.getLabel() }}</div>
  </div>
</template>

<script setup lang="ts">
  import { LogoutButtonController } from "~/scripts/components/headers/LogoutButtonController"

  const controller = new LogoutButtonController()
</script>

<style lang="scss">
  @use "~/assets/scss/components/Headers/PageTool" as *;
</style>
