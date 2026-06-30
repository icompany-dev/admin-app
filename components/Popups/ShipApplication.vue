<template>
  <div id="popups-ship-application">
    <Popup
      ref="popupRef"
      v-bind="controller.popupProps"
    >
      <template #content>
        <div class="action">
          {{ controller.instructions }}
        </div>
        <div class="form-group">
          <span class="label">{{ controller.trackingNumberLabel }}</span>
          <input
            type="text"
            class="form-control"
            v-model="controller.trackingNumber.value"
          />
        </div>
        <div class="form-group">
          <span class="label">{{ controller.trackingUrlLabel }}</span>
          <input
            type="text"
            class="form-control"
            v-model="controller.trackingUrl.value"
          />
        </div>
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
          :disabled="!controller.canProceed"
          :class="{ 'is-loading': controller.isUpdating.value }"
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
  import { ShipApplicationController } from "~/scripts/components/popups/ShipApplicationController"
  import type { IPropsShipApplication } from "~/scripts/props/PropsShipApplication"

  const props = defineProps<IPropsShipApplication>()

  const emit = defineEmits([])

  const popupRef = ref(null)

  const controller = new ShipApplicationController(props, emit)

  watch(
    () => props,
    (newVal) => {
      controller.onPropsChanged(newVal)
    },
    { deep: true }
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
  @use "~/assets/scss/components/Popups/ShipApplication" as *;
</style>
