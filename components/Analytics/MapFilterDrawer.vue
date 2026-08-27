<template>
  <div id="analytics-map-filter-drawer">
    <div class="header-search-bar">
      <div class="header">
        <span class="label">
          <i class="fa-regular fa-sliders-up"></i>
          Filters
        </span>
        <span class="reset">
          <i class="fa-regular fa-arrow-rotate-left"></i>
          Reset
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { MapFilterDrawerController } from "~/scripts/components/analytics/MapFilterDrawerController"
  import type { IPropsMapFilterDrawer } from "~/scripts/props/PropsMapFilterDrawer"

  const props = defineProps<IPropsMapFilterDrawer>()
  const emit = defineEmits(["filterChange", "flyToState", "resetFilters"])

  const controller = new MapFilterDrawerController(props, emit)

  watch(
    () => props,
    (newVal) => {
      controller.setDataFromProps(newVal)
    },
    { deep: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Analytics/MapFilterDrawer" as *;
</style>
