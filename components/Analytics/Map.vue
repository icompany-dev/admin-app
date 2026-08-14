<template>
  <div
    id="analytics-map"
    class="map-wrapper"
  >
    <ClientOnly>
      <div
        ref="mapContainerRef"
        class="map-container"
      />
    </ClientOnly>
  </div>
</template>

<script lang="ts" setup>
  import { MapController } from "~/scripts/components/analytics/MapController"
  import type { IPropsMap } from "~/scripts/props/PropsMap"

  const props = defineProps<IPropsMap>()

  const emit = defineEmits(["updateOfficePosition", "selectUser", "selectCompany"])

  const mapContainerRef = ref<HTMLDivElement | null>(null)

  const controller = new MapController(props, emit)

  const handleWindowResize = () => {
    controller.renderLayers()
  }

  onMounted(() => {
    window.addEventListener("resize", handleWindowResize)
  })

  onBeforeUnmount(() => {
    window.removeEventListener("resize", handleWindowResize)

    if (controller.mapInstance) {
      controller.mapInstance.remove()
      controller.mapInstance = null
    }
  })

  watch(
    () => props,
    (newVal, oldVal) => {
      controller.setDatafromProps(newVal, oldVal)

      controller.renderLayers()
    },
    { deep: true }
  )

  watch(
    mapContainerRef,
    async (newVal) => {
      controller.setMapContainerRef(newVal)

      if (newVal) {
        await controller.initMap()
      }
    },
    { immediate: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Analytics/Map" as *;
</style>
