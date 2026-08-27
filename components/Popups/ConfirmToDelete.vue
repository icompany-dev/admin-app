<template>
  <div id="popups-confirm-to-delete">
    <Popup
      ref="popupRef"
      v-bind="controller.popupProps"
    >
      <template #content>
        <div
          class="action"
          v-html="controller.content"
        />
      </template>
      <template #actionButtons>
        <button
          class="btn btn-danger"
          @click="controller.onCancelClicked()"
        >
          {{ controller.cancelLabel }}
        </button>
        <button
          class="btn btn-submit"
          @click="controller.onProceedClicked()"
        >
          {{ controller.proceedLabel }}
        </button>
      </template>
    </Popup>
  </div>
</template>

<script lang="ts" setup>
  import Popup from "./Popup.vue"
  import { EmitMessages } from "~/scripts/constants/EmitMessages"
  import { ConfirmToDeleteController } from "~/scripts/components/popups/ConfirmToDeleteController"

  const props = defineProps({
    removeItemName: {
      type: String,
      required: true,
    },
  })

  const emit = defineEmits(EmitMessages.POPUPS)

  const popupRef = ref(null)

  const controller = new ConfirmToDeleteController(props.removeItemName, emit)

  watch(
    () => props.removeItemName,
    (newVal) => {
      controller.setRemoveItemName(newVal)
    }
  )

  watch(
    popupRef,
    (newVal) => {
      controller.setPopupRef(newVal)
    },
    { immediate: true }
  )

  defineExpose({
    show: controller.show.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Popups/ConfirmToDelete" as *;
</style>
