<template>
  <div id="popups-name-reservation-rejected">
    <Popup
      ref="popupRef"
      v-bind="controller.popupProps"
    >
      <template #content>
        <div
          class="action"
          v-html="controller.content"
        />
        <div class="form-group">
          <span class="label">{{ controller.dateRejectedLabel }}</span>
          <input
            type="date"
            class="form-control"
            v-model="controller.dateRejected"
          />
        </div>
        <div class="form-group">
          <span class="label">{{ controller.reasonLabel }}</span>
          <textarea
            class="form-control"
            v-model="controller.reason.value"
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
          class="btn btn-proceed"
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
  import { NameReservationRejectedController } from "~/scripts/components/popups/NameReservationRejectedController"
  import type { IPropsNameReservationRejected } from "~/scripts/props/PropsNameReservationRejected"

  const props = defineProps<IPropsNameReservationRejected>()

  const emit = defineEmits(EmitMessages.POPUPS)

  const popupRef = ref(null)

  const controller = new NameReservationRejectedController(props, emit)

  watch(
    () => props,
    (newVal) => {
      controller.setValuesFromProps(newVal)
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
</script>

<style lang="scss">
  @use "~/assets/scss/components/Popups/NameReservationRejected" as *;
</style>
