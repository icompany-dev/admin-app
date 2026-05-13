<template>
  <div
    id="color-mode-toggler"
    class="page-tool"
    @click="controller.onToggleClicked()"
  >
    <i class="icon fa-solid fa-masks-theater" />
    <div class="page-tool-tooltip">{{ controller.getModeColor() }}</div>
    <div class="mobile-label">
      {{ controller.getMobileLabel() }}:
      <span
        :class="controller.getMobileClass()"
        class="mobile-label"
      >
        {{ controller.getModeColor() }}
      </span>
      <i class="caret-icon fa-solid fa-caret-down"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ColorModeTogglerController } from "~/scripts/components/headers/ColorModeTogglerController"

  const controller = new ColorModeTogglerController()

  watch(
    () => controller.eventManager.hasColorModeChanged,
    (hasChanged) => {
      if (hasChanged) {
        controller.onColorModeChanged()
      }
    }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Headers/PageTool" as *;
</style>
