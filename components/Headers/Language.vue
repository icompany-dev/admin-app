<template>
  <div
    id="language-toggler"
    class="page-tool language-button"
    @click="controller.onToggleClicked()"
  >
    <span class="language-marker">
      {{ controller.languageCopywriting() }}
    </span>
    <div class="page-tool-tooltip">{{ controller.getLabel() }}</div>
    <div class="mobile-label">
      {{ controller.getLabel() }}:
      <span class="mobile-label">{{ controller.languageCopywriting() }}</span>
      <i class="caret-icon fa-solid fa-caret-down"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { LanguageController } from "~/scripts/components/headers/LanguageController"
  const controller = new LanguageController()
</script>

<style lang="scss">
  @use "~/assets/scss/components/Headers/PageTool" as *;
</style>
