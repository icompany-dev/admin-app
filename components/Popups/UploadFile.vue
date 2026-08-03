<template>
  <div id="popups-upload-file">
    <Popup
      ref="popupRef"
      v-bind="controller.popupProps"
    >
      <template #content>
        <div
          ref="dropZoneRef"
          class="drop-zone"
          :class="{ collapsed: controller.anyFileAdded, 'drag-enter': controller.isDragEnter.value }"
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
          multiple="true"
          @change="controller.handleFileSelected($event)"
        />
        <Transition name="fade">
          <div
            class="selected-values"
            v-if="controller.anyFileAdded"
          >
            <table class="files-to-upload">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Document Name</th>
                  <th>Document Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(form, i) in controller.forms.value"
                  :key="`form-${i}`"
                >
                  <td>{{ i + 1 }}.</td>
                  <td>
                    <div class="uploaded-file-details">
                      <input
                        type="text"
                        class="form-control"
                        :value="controller.documentNameFor(i)"
                        @change="controller.onDocumentNameInput(i, $event)"
                      />
                      <span class="uploaded-file-name">
                        <b>{{ controller.uploadedFilenameLabel }}:</b>
                        <span
                          class="original-name"
                          :title="controller.filenameFor(i)"
                        >
                          {{ controller.filenameFor(i) }}
                        </span>
                      </span>
                    </div>
                  </td>
                  <td>
                    <input
                      type="date"
                      class="form-control"
                      v-model="form.documentDate"
                    />
                  </td>
                  <td>
                    <i
                      class="fa-solid fa-xmark action-link remove"
                      @click="controller.onRemove(i)"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Transition>
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
          :disabled="!controller.anyFileAdded"
          :class="{ 'is-loading': controller.isUploading.value }"
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
  import { UploadFileController } from "~/scripts/components/popups/UploadFileController"
  import { EmitMessages } from "~/scripts/constants/EmitMessages"
  import type { IPropsUploadDocument } from "~/scripts/props/PropsUploadDocument"

  const props = defineProps<IPropsUploadDocument>()

  const emit = defineEmits(EmitMessages.POPUPS)

  const popupRef = ref(null)
  const fileInputRef = ref(null)
  const dropZoneRef = ref(null)

  const controller = new UploadFileController(props, emit)

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

  watch(
    dropZoneRef,
    (newVal) => {
      controller.setDropZoneRef(newVal)
    },
    { immediate: true }
  )

  onMounted(() => {
    controller.addEventListeners()
  })

  onUnmounted(() => {
    controller.removeEventListeners()
  })

  defineExpose({
    show: controller.show.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Popups/UploadFile" as *;
</style>
