<template>
  <div id="placeholder-no-record">
    <div class="no-record-wrapper">
      <div
        class="title"
        v-html="controller.titleLabel()"
      />
      <div
        class="content"
        v-html="controller.subtitleLabel()"
      />
      <slot name="cta" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { NoRecordController } from "~/scripts/components/placeholders/NoRecordController"

  const props = defineProps({
    title: {
      type: String,
      default: "",
    },
    subtitle: {
      type: String,
      default: "",
    },
  })

  const controller = new NoRecordController(props.title, props.subtitle)

  watch(
    () => props.title,
    (newVal) => {
      controller.setTitle(newVal)
    }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Placeholders/NoRecord" as *;
</style>
