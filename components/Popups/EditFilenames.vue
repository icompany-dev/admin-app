<template>
  <div id="popups-edit-filenames">
    <Popup
      ref="popupRef"
      v-bind="controller.popupProps"
      @back="emit(EmitMessages.BACK)"
    >
      <template #content>
        <!-- <div
          class="action"
          v-html="controller.content"
        /> -->
        <div class="action">
          <table class="table-edit-filenames">
            <thead>
              <tr>
                <th>{{ controller.oldName }}</th>
                <th>{{ controller.newName }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(file, i) in controller.files.value">
                <td>
                  {{ controller.getOriginalFileName(file.id) }}
                </td>
                <td>
                  <input
                    type="text"
                    class="form-control"
                    v-model="file.name"
                    :disabled="controller.isUpdating.value"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
      <template #actionButtons>
        <button
          class="btn btn-danger"
          :disabled="controller.isUpdating.value"
          @click="controller.onCancelClicked()"
        >
          {{ controller.cancelLabel }}
        </button>
        <button
          class="btn btn-submit"
          :class="{ 'is-loading': controller.isUpdating.value }"
          :disabled="controller.isUpdating.value"
          @click="controller.onUpdate()"
        >
          {{ controller.proceedLabel }}
        </button>
      </template>
    </Popup>
  </div>
</template>

<script lang="ts" setup>
  import Popup from "./Popup.vue"
  import { EditFilenamesController } from "~/scripts/components/popups/EditFilenamesController"
  import { EmitMessages } from "~/scripts/constants/EmitMessages"
  import type { IPropsEditFilenames } from "~/scripts/props/PropsEditFilenames"

  const props = defineProps<IPropsEditFilenames>()

  const emit = defineEmits(EmitMessages.POPUPS)

  const popupRef = ref(null)

  const controller = new EditFilenamesController(props, emit)

  watch(
    () => props,
    (newVal) => {
      controller.setDataFromProps(newVal)
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
    hide: controller.hide.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Popups/EditFilenames" as *;
</style>
