<template>
  <div id="pricings-grouped">// show the pricings?</div>
</template>

<script lang="ts" setup>
  import { GroupedController } from "~/scripts/components/pricings/GroupedController"
  import type { IPropsGroupedServicePricing } from "~/scripts/props/PropsGroupedServicePricing"

  const props = defineProps<IPropsGroupedServicePricing>()
  const emit = defineEmits([])

  const controller = new GroupedController(props, emit)

  watch(
    () => props,
    (newVal) => {
      controller.setDataFromProps(newVal)
    },
    { deep: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Pricings/Grouped" as *;
</style>
