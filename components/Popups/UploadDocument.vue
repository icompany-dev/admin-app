<template>
  <div id="popups-upload-document">
    <Popup
      ref="popupRef"
      v-bind="controller.popupProps"
    >
      <template #content>
        <div
          class="drop-zone"
          :class="{ collapsed: controller.anyFileAdded }"
          @click="controller.onUploadClicked()"
        >
          <i class="fa-regular fa-cloud-arrow-up icon"></i>
          <span v-html="controller.instructions" />
        </div>
        <input
          type="file"
          ref="fileInputRef"
          class="hidden"
          :accept="controller.fileToAccept"
          @change="controller.handleFileSelected($event)"
        />
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
  import { UploadDocumentController } from "~/scripts/components/popups/UploadDocumentController"
  import type { IPropsUploadDocument } from "~/scripts/props/PropsUploadDocument"

  const props = defineProps<IPropsUploadDocument>()

  const emit = defineEmits([])

  const popupRef = ref(null)
  const fileInputRef = ref(null)

  const controller = new UploadDocumentController(props, emit)

  watch(
    () => props,
    (newVal) => {
      controller.onPropsChange(newVal)
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

  watch(
    fileInputRef,
    (newVal) => {
      controller.setFileInputRef(newVal)
    },
    { immediate: true }
  )

  defineExpose({
    show: controller.show.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Popups/UploadDocument" as *;
</style>
