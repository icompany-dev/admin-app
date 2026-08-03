<template>
  <div id="popups-reserved-name-for-new-sdn-bhd-queried">
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
          <span class="label">{{ controller.nameLabel }}</span>
          <input
            type="text"
            class="form-control"
            v-model="controller.applicationNameReservation.value.name"
            readonly
          />
        </div>
        <div class="form-group">
          <span class="label">{{ controller.queryEnLabel }}</span>
          <textarea
            class="form-control"
            v-model="controller.applicationNameReservation.value.ssmQueryEn"
          />
        </div>
        <div class="form-group">
          <span class="label">{{ controller.queryBmLabel }}</span>
          <textarea
            class="form-control"
            v-model="controller.applicationNameReservation.value.ssmQueryBm"
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
  import { ReservedNameForNewSdnBhdQueriedController } from "~/scripts/components/popups/ReservedNameForNewSdnBhdQueriedController"
  import { ApplicationNameReservation } from "~/scripts/models/ApplicationNameReservation"

  const props = defineProps({
    application: {
      type: ApplicationNameReservation,
      required: true,
    },
  })

  const emit = defineEmits(EmitMessages.POPUPS)

  const popupRef = ref(null)

  const controller = new ReservedNameForNewSdnBhdQueriedController(props.application, emit)

  watch(
    () => props.application,
    (newVal) => {
      controller.setApplicationNameReservation(newVal)
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
  @use "~/assets/scss/components/Popups/ReservedNameForNewSdnBhdQueried" as *;
</style>
