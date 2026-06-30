<template>
  <div id="name-reservations">
    <div
      v-for="(nameReservation, index) in controller.nameReservations.value"
      :key="nameReservation.id"
      class="name-reservation-container"
    >
      <NameReservationComponent
        :name-reservation="nameReservation"
        :is-disabled="props.isDisabled"
        :other-names-to-reserve="controller.otherNamesToReserve(index)"
        @nameChanged="controller.handleNameChanges($event)"
      />
      <div
        class="add-delete"
        v-if="controller.isLastItem(index) && !props.isDisabled && !props.isInPreviewMode"
      >
        <div
          class="add-more"
          v-if="controller.canAddMore()"
          @click="controller.onAddNameClicked()"
        >
          + Add Name
        </div>
        <div
          class="remove-name"
          v-if="controller.canRemove()"
          @click="controller.onRemoveNameClicked(nameReservation.id)"
        >
          - Remove
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { NameReservation } from "~/scripts/types/NameReservation"
  import NameReservationComponent from "./NameReservation.vue"
  import { NameReservationsController } from "~/scripts/components/name-reservations/NameReservationsController"

  const props = defineProps({
    nameReservations: {
      type: Array<NameReservation>,
      default: () => [],
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    isInPreviewMode: {
      type: Boolean,
      default: false,
    },
  })

  const emit = defineEmits(["addName", "removeName", "nameChanges"])

  const controller = new NameReservationsController(props.nameReservations, emit)

  watch(
    () => props.nameReservations,
    (newVal) => {
      controller.setNameReservations(newVal)
    }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/NameReservations/NameReservations" as *;
</style>
