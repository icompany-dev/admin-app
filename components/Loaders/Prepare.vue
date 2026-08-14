<template>
  <div class="prepare-content-loader">
    <div class="loader-wrapper">
      <i class="fa-duotone fa-solid fa-loader fa-spin-pulse"></i>
    </div>
    <div class="loader-notice">
      <div class="loader-label">
        {{ props.label }}
      </div>
      <div class="loader-sublabel">
        {{ props.sublabel }}
      </div>
      <div class="loader-dots">
        <i class="fa-solid fa-circle-small"></i>
        <i class="fa-solid fa-circle-small"></i>
        <i class="fa-solid fa-circle-small"></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { PrepareController } from "~/scripts/components/loaders/PrepareController"

  const props = defineProps({
    label: {
      type: String,
      default: "",
    },
    sublabel: {
      type: String,
      default: "",
    },
  })

  const emit = defineEmits([])

  const controller = new PrepareController(props, emit)
</script>

<style lang="scss">
  @use "~/assets/scss/components/Loaders/Prepare" as *;
</style>
