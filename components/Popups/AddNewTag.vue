<template>
  <div id="popups-add-new-tag">
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
          <div class="tag-form-group">
            <select
              v-if="!controller.isAddNewType.value"
              class="form-control"
              v-model="controller.name.value"
              @change="controller.onSelectedValue()"
            >
              <option
                v-for="tag in controller.existingTags"
                :value="tag"
              >
                {{ tag }}
              </option>
            </select>
            <template v-if="controller.isAddNewType.value">
              <input
                type="text"
                class="form-control"
                v-model="controller.name.value"
              />
              <i
                class="fa-solid fa-xmark clickable"
                @click="controller.onClearCustomName()"
              />
            </template>
          </div>
        </div>
      </template>
      <template #actionButtons>
        <button
          class="btn btn-danger"
          :disabled="controller.isSubmitting.value"
          @click="controller.onCancelClicked()"
        >
          {{ controller.cancelLabel }}
        </button>
        <button
          class="btn btn-submit"
          :class="{ 'is-loading': controller.isSubmitting.value }"
          :disabled="controller.isSubmitting.value"
          @click="controller.onSave()"
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
  import { AddNewTagController } from "~/scripts/components/popups/AddNewTagController"
  import type { IPropsAddNewTag } from "~/scripts/props/PropsAddNewTag"

  const props = defineProps<IPropsAddNewTag>()

  const emit = defineEmits(EmitMessages.POPUPS)

  const popupRef = ref(null)

  const controller = new AddNewTagController(props, emit)

  watch(
    () => props,
    (newVal) => {
      controller.setDataFromProps(newVal)
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
    hide: controller.hide.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Popups/AddNewTag" as *;
</style>
