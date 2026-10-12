<template>
  <div id="users-user-viewer">
    <div class="user-content">
      <slot />
    </div>

    <div class="user-viewer-action-container">
      <div class="action-options">
        <div class="btn btn-circle">
          <i class="fa-solid fa-user"></i>
        </div>
        <div
          class="btn btn-circle"
          @click="controller.onNricClicked()"
        >
          <i class="fa-solid fa-address-card"></i>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="user-nric-window">
        <div
          v-if="controller.isShowNric.value"
          class="user-nric-window"
          :style="{
            left: `${controller.windowPosition.x}px`,
            top: `${controller.windowPosition.y}px`,
          }"
        >
          <div
            class="user-nric-window-header"
            @pointerdown="controller.onDragStart($event)"
          >
            <span>Identification Document</span>

            <div
              class="btn btn-circle"
              @pointerdown.stop
              @click="controller.closeNric()"
            >
              <i class="fa-solid fa-xmark"></i>
            </div>
          </div>

          <div style="width: calc(100% - 20px); padding: 15px 10px; box-shadow: var(--box-shadow)">
            <div style="display: flex; justify-content: space-between">
              <div style="display: flex; align-items: center; gap: 10px">
                <div>Usage:</div>
                <div>
                  <input
                    type="text"
                    class="form-control"
                    v-model="controller.purpose.value"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="user-nric-window-content">
            <IdentificationDocumentWatermark
              v-bind="controller.getIdentificationDocumentWatermarkProps()"
              ref="identification"
            />
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
  import IdentificationDocumentWatermark from "~/components/Identifications/IdentificationDocumentWatermark.vue"
  import { UserViewerController } from "~/scripts/components/users/UserViewerController"

  const props = defineProps({
    userId: {
      type: [String, null],
      default: "",
    },
    email: {
      type: [String, null],
      default: "",
    },
  })
  const emit = defineEmits([])

  const controller = new UserViewerController(props, emit)

  watch(
    () => props.email,
    (newVal) => {
      controller.setEmail(newVal)
    }
  )

  watch(
    () => props.userId,
    (newVal) => {
      controller.setUserId(newVal)
    }
  )

  onBeforeUnmount(() => {
    controller.destroy()
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Users/UserViewer" as *;
</style>
