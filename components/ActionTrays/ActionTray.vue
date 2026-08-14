<template>
  <div
    id="action-tray"
    :class="{
      'is-hidden': controller.isHidden(),
      'is-sidebar-open': controller.isSideBarOpen(),
    }"
  >
    <div class="action-list-container">
      <ActionElement
        v-for="action in controller.actions.value"
        :key="action.id"
        :action="action"
        @open-search="controller.onOpenSearch()"
        @close-search="controller.onCloseSearch()"
        :class="{
          'is-hidden': !action.isVisibleOnSearch && controller.isSearchOpen.value,
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import ActionElement from "./ActionTrayElement.vue"
  import { ActionTrayElement } from "~/scripts/types/action-trays/ActionTrayElement"
  import { ActionTrayController } from "@/scripts/components/action-trays/ActionTrayController"

  const props = defineProps({
    isLockPosition: {
      type: Boolean,
      default: false,
    },
    actions: {
      type: Array<ActionTrayElement>,
      required: true,
    },
  })

  const emit = defineEmits(["onCloseSearch"])

  const controller = new ActionTrayController(props.actions, props.isLockPosition, emit)

  onMounted(() => {
    window.addEventListener("scroll", () => controller.onScrolling())
  })

  onUnmounted(() => {
    window.removeEventListener("scroll", () => controller.onScrolling())
    if (controller.scrollTimeout) {
      clearTimeout(controller.scrollTimeout)
    }
  })

  watch(
    () => props.actions,
    (newVal) => {
      controller.setActions(newVal)
    }
  )

  watch(
    () => props.isLockPosition,
    (newVal) => {
      controller.setIsLockPosition(newVal)
    }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/ActionTrays/ActionTray" as *;
</style>
