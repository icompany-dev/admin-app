<template>
  <div
    id="sidebar-default"
    :class="{ hide: controller.isCollapsed.value }"
  >
    <div
      class="panel-collapse-button"
      @click="controller.onBurgerClicked()"
    >
      <i
        class="fa-solid fa-caret-left"
        :class="{ rotate: controller.isCollapsed.value }"
      ></i>
    </div>
    <div class="sidebar-container">
      <div
        v-for="(group, index) in controller.sidebarGroups.value"
        class="sidebar-group"
        :key="index"
      >
        <div
          class="sidebar-group-title"
          @click="controller.onGroupClicked(group)"
        >
          {{ group.labelEn }}
        </div>
        <TransitionGroup name="fade">
          <template v-if="group.isShowChildren">
            <div
              class="sidebar-item"
              v-for="(item, i) in group.items"
              :key="i"
              @click="item.onClick()"
              :class="{ selected: item.isShowing, disabled: item.isDisabled }"
            >
              {{ item.labelEn }}
            </div>
          </template>
        </TransitionGroup>
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
