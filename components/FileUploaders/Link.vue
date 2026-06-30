<template>
  <div class="file-uploader-link">
    <div
      class="file-link"
      @click="controller.onSelectFileClicked()"
    >
      <i
        class="fa-duotone fa-light"
        :class="controller.buttonIcon()"
      ></i>
      <div class="link-label">
        {{ controller.buttonCopywriting() }}
      </div>
      <div
        v-if="controller.isFileUploaded()"
        class="remove-file"
        @click="controller.onRemoveFileClicked()"
      >
        <i class="fa-solid fa-xmark" />
      </div>
    </div>

    <input
      type="file"
      ref="fileInput"
      class="hidden"
      accept="image/*, .pdf"
      @change="controller.handleDocumentUpload($event)"
    />
  </div>
</template>

<script setup lang="ts">
  import { FileUploaderLinkController } from "~/scripts/components/file-uploaders/FileUploaderLinkController"
  import { File } from "~/scripts/models/File"

  const props = defineProps({
    placeholder: {
      type: String,
      default: null,
    },
    existingFile: {
      type: File,
      default: null,
    },
  })

  const emit = defineEmits(["fileUploaded", "fileRemoved"])

  const fileInput = ref(null)

  const controller = new FileUploaderLinkController(props.placeholder, emit, props.existingFile)
  controller.setFileInput(fileInput)

  watch(
    () => props.existingFile,
    (newVal) => {
      if (!newVal) {
        return
      }

      controller.setFile(newVal)
    }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/FileUploaders/Link" as *;
</style>
