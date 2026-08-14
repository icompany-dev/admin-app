<template>
  <div
    class="services-application-node"
    :class="{
      'is-selected': props.isInFocused,
      'is-completed': props.isCompleted,
      'is-showing-document': props.isShowDocument,
      'is-last-node': props.isLastNode,
    }"
  >
    <div class="node-container">
      <div class="node" />
    </div>
    <div class="node-content-action-options">
      <div class="node-content">
        <slot name="nodeContent" />
      </div>
      <div class="node-options">
        <slot name="nodeOptions" />
      </div>
      <div class="node-actions">
        <slot name="nodeActions" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { IPropsServiceApplicationNode } from "~/scripts/props/PropsServiceApplicationNode"
  import { ApplicationNodeController } from "~/scripts/components/services/ApplicationNodeController"

  const props = defineProps<IPropsServiceApplicationNode>()

  const emit = defineEmits([])

  const controller = new ApplicationNodeController(props, emit)
</script>

<style lang="scss">
  @use "~/assets/scss/components/Services/ApplicationNode" as *;
</style>
