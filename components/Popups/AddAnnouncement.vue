<template>
  <div id="popups-add-announcement">
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
            <label>{{ controller.typeLabel }}</label>
            <select
              class="form-control"
              v-model="controller.publicServiceAnnouncement.value.type"
            >
              <option></option>
              <option
                v-for="(type, i) in controller.typeOptions"
                :value="type.value"
              >
                {{ type.label }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>{{ controller.nameLabel }}</label>
            <input
              type="text"
              class="form-control"
              v-model="controller.publicServiceAnnouncement.value.name"
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
  import CompaniesDropdown from "../Forms/CompaniesDropdown.vue"
  import Popup from "./Popup.vue"
  import { AddAnnouncementController } from "~/scripts/components/popups/AddAnnouncementController"
  import { EmitMessages } from "~/scripts/constants/EmitMessages"

  const props = defineProps({})

  const emit = defineEmits(EmitMessages.POPUPS)

  const popupRef = ref(null)

  const controller = new AddAnnouncementController(emit)

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
  @use "~/assets/scss/components/Popups/AddAnnouncement" as *;
</style>
