<template>
  <div
    ref="popup"
    class="popup"
    :class="{
      show: controller.isShowing.value,
      compliance: props.isCompliance,
      hide: controller.eventManager.isSearchOpen,
    }"
    @click.self="controller.handleClickOutside()"
  >
    <div class="popup-content">
      <slot name="beforeTitle" />
      <div
        class="title"
        v-html="props.title"
      />
      <div class="popup-details">
        <div
          class="heading"
          v-html="props.heading"
        />
        <div class="body">
          <slot name="content" />
        </div>
        <div
          v-if="props.hasCta"
          class="cta-notice"
          v-html="props.cta"
        />
        <div
          class="action-buttons"
          v-if="props.hasActionButtons"
        >
          <slot name="actionButtons" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { PopupController } from "~/scripts/components/popups/PopupController"
  import { usePopupStack } from "~/composables/usePopupStack"
  import type { IPropsPopup } from "~/scripts/props/PropsPopup"

  const props = defineProps<IPropsPopup>()

  const instanceId = useId()
  const { addToStack, removeFromStack, isTop } = usePopupStack()

  const controller = new PopupController()

  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === "Escape" && isTop(instanceId)) {
      controller.hide()
    }
  }

  watch(controller.isShowing, (isVisible) => {
    if (isVisible) {
      addToStack(instanceId)
      window.addEventListener("keyup", handleKeyUp)
    } else {
      removeFromStack(instanceId)
      window.removeEventListener("keyup", handleKeyUp)
    }
  })

  onUnmounted(() => {
    removeFromStack(instanceId)
    window.removeEventListener("keyup", handleKeyUp)
  })

  defineExpose({
    show: controller.show.bind(controller),
    hide: controller.hide.bind(controller),
    getIsShowing: controller.getIsShowing.bind(controller),
  })
</script>
