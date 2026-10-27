<template>
  <div id="buttons-add-application">
    <div
      class="add-icon"
      @click="controller.onClick()"
    >
      <i class="fa-solid fa-circle-plus" />
    </div>
    <CreateNewApplication
      v-bind="props"
      ref="popupRef"
      @proceed="controller.onProceed()"
      @back="controller.onBackClicked()"
    />
  </div>
</template>

<script lang="ts" setup>
  import CreateNewApplication from "../Popups/CreateNewApplication.vue"
  import { AddApplicationController } from "~/scripts/components/buttons/AddApplicationController"
  import { EmitMessages } from "~/scripts/constants/EmitMessages"
  import type { IPropsCreateNewApplication } from "~/scripts/props/PropsCreateNewApplication"

  const props = defineProps<IPropsCreateNewApplication>()

  const emit = defineEmits(EmitMessages.POPUPS)

  const popupRef = ref(null)

  const controller = new AddApplicationController(props, emit)

  watch(
    popupRef,
    (newVal) => {
      controller.setPopupRef(newVal)
    },
    { immediate: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Buttons/AddApplication" as *;
</style>
