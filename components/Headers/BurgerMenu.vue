<template>
  <div
    id="burger-menu"
    :class="{ 'is-open': controller.isOpen.value }"
    @click="controller.onClick()"
  >
    <span class="bar" />
    <span class="bar" />
    <span class="bar" />
  </div>
</template>

<script setup lang="ts">
  import { BurgerMenuController } from "~/scripts/components/headers/BurgerMenuController"
  const emit = defineEmits(["onClick"])
  const props = defineProps({
    isOpen: {
      type: Boolean,
      default: false,
    },
  })

  const controller = new BurgerMenuController(props.isOpen, emit)

  watch(
    () => props.isOpen,
    (newVal) => {
      controller.setIsOpen(newVal)
    }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Headers/BurgerMenu" as *;
</style>
