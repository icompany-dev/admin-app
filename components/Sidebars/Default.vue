<template>
  <div id="sidebar-default">
    <div class="sidebar-container">
      <div
        v-for="(group, index) in controller.sidebarGroups"
        class="sidebar-group"
        :key="index"
      >
        <div class="sidebar-group-title">
          {{ group.labelEn }}
        </div>
        <div
          class="sidebar-item"
          v-for="(item, i) in group.items"
          :key="i"
          @click="item.onClick()"
          :class="{ selected: item.isShowing, disabled: item.isDisabled }"
        >
          {{ item.labelEn }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { DefaultController } from "~/scripts/components/sidebars/DefaultController"

  const props = defineProps({})
  const emit = defineEmits([])

  const controller = new DefaultController(emit)
</script>

<style lang="scss">
  @use "~/assets/scss/components/Sidebars/Default" as *;
</style>
