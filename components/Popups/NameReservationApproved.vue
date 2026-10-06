<template>
  <div id="popups-name-reservation-approved">
    <Popup
      ref="popupRef"
      v-bind="controller.popupProps"
    >
      <template #content>
        <div
          class="action"
          v-html="controller.content"
        />
        <div class="action">
          <div class="form-group">
            <label>Name:</label>
            <input
              type="text"
              class="form-control"
              v-model="controller.nameReservation.value.name"
            />
          </div>
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
  import { NameReservationApprovedController } from "~/scripts/components/popups/NameReservationApprovedController"
  import { NameReservationVariant } from "~/scripts/models/NameReservationVariant"

  const props = defineProps({
    nameReservation: {
      type: NameReservationVariant,
      required: true,
    },
  })

  const emit = defineEmits(EmitMessages.POPUPS)

  const popupRef = ref(null)

  const controller = new NameReservationApprovedController(props.nameReservation, emit)

  watch(
    () => props.nameReservation,
    (newVal) => {
      controller.setNameReservation(newVal)
    },
    { immediate: true }
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
  @use "~/assets/scss/components/Popups/NameReservationApproved" as *;
</style>
