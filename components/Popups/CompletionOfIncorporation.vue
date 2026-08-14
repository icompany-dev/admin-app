<template>
  <div id="popups-completion-of-incorporation">
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
          <span class="label">{{ controller.incorporatedAtLabel }}</span>
          <input
            type="date"
            class="form-control"
            v-model="controller.dateValue.value"
          />
        </div>
        <div class="form-group">
          <span class="label">{{ controller.registrationNumberNewLabel }}</span>
          <input
            type="text"
            class="form-control"
            v-model="controller.registrationNumberNew.value"
          />
        </div>
        <div class="form-group">
          <span class="label">{{ controller.registrationNumberOldLabel }}</span>
          <input
            type="text"
            class="form-control"
            v-model="controller.registrationNumberOld.value"
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
  import { CompletionOfIncorporationController } from "~/scripts/components/popups/CompletionOfIncorporationController"

  const props = defineProps({
    companyName: {
      type: String,
      required: true,
    },
  })

  const emit = defineEmits(EmitMessages.POPUPS)

  const popupRef = ref(null)

  const controller = new CompletionOfIncorporationController(props.companyName, emit)

  watch(
    () => props.companyName,
    (newVal) => {
      controller.setCompanyName(newVal)
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
  @use "~/assets/scss/components/Popups/CompletionOfIncorporation" as *;
</style>
