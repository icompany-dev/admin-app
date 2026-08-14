<template>
  <div
    class="default-layout"
    :class="{
      'no-scroll': layoutController.isDisableScrolling(),
      'no-click': layoutController.eventManager.isDisablePage,
    }"
  >
    <div class="image-overlay"></div>
    <div class="color-overlay"></div>

    <Header :is-header-hidden="layoutController.isOverlap.value" />
    <Sidebar
      @collapsed="layoutController.onSidebarCollapsed()"
      @expanded="layoutController.onSidebarExpanded()"
    />

    <div
      ref="pageContentRef"
      class="page-content"
      :class="{ expand: layoutController.isSidebarCollapsed.value }"
      @touchstart="layoutController.startDrag"
      @touchmove="layoutController.onDrag"
      @touchend="layoutController.stopDrag"
    >
      <!-- <slot /> -->
      <NuxtPage />

      <Teleport to="body"></Teleport>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { LayoutController } from "~/scripts/layouts/LayoutController"
  import Header from "@/components/Headers/Default.vue"
  import Sidebar from "@/components/Sidebars/Default.vue"

  const pageContentRef = ref(null)
  const onboardingWelcomeRef = ref(null)

  const layoutController = new LayoutController()

  watch(
    pageContentRef,
    (newVal) => {
      layoutController.setPageContentRef(newVal)
    },
    { immediate: true }
  )

  watch(
    onboardingWelcomeRef,
    (newVal) => {
      layoutController.setOnboardingWelcomeRef(newVal)
    },
    { immediate: true }
  )

  watch(
    () => layoutController.eventManager.isShowWelcomeAfterEKYC,
    (newVal) => {
      layoutController.handleEventManagerChanges()
    },
    { deep: true, immediate: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/layouts/default" as *;
</style>
