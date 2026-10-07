<template>
  <div
    class="company-documents-document"
    :class="{ enlarged: props.isShowEnlarged, 'is-stacked': props.isStacked, 'is-selected': props.isSelected }"
  >
    <div class="checkbox">
      <input
        type="checkbox"
        v-model="controller.companyDocument.value.isSelected"
        class="form-check-input"
        :disabled="controller.companyDocument.value.isDisabled"
        v-keyboard-click
        @click="controller.onIsSelectedClicked()"
      />
    </div>
    <div
      class="pdf-canvas"
      v-keyboard-click
      @click="controller.onDocumentClicked()"
    >
      <canvas
        :ref="(el) => setCanvasRef(el)"
        v-if="controller.companyDocument.value.fileUrl"
      />
      <div
        class="placeholder"
        v-if="controller.isPreviewNotAvailable()"
        :class="{ purchase: controller.companyDocument.value.isFromMyData }"
      >
        {{ controller.previewNotAvailable() }}
      </div>
    </div>
    <div
      class="name"
      v-if="props.isShowName"
    >
      {{ controller.companyDocument.value.documentName }}
      <!-- <br />
      <span
        v-if="props.isShowDate"
        class="document-date"
      >
        {{ controller.documentDate() }}
      </span> -->
    </div>
  </div>
</template>

<script setup lang="ts">
  import { CompanyDocumentController } from "~/scripts/components/documents/CompanyDocumentController"
  import type { IPropsDocument } from "~/scripts/props/PropsDocument"

  const props = defineProps<IPropsDocument>()

  const emit = defineEmits(["isSelectedChanged", "isViewingDocument"])
  const pdfCanvasRef = ref(null)

  const controller = new CompanyDocumentController(props, emit)

  watch(
    () => props.id,
    (newVal) => {
      controller.setId(newVal)
    }
  )

  watch(
    () => props.isSelected,
    (newVal) => {
      controller.setIsSelected(newVal)
    }
  )

  watch(
    () => props.documentName,
    (newVal) => {
      controller.setDocumentName(newVal)
    }
  )

  watch(
    () => props.fileUrl,
    (newVal) => {
      controller.setFileUrl(newVal)
    }
  )

  watch(
    () => props.isFromMyData,
    (newVal) => {
      controller.setIsFromMyData(newVal)
    }
  )

  watch(
    () => props.documentDate,
    (newVal) => {
      controller.setDocumentDate(newVal)
    }
  )

  watch(
    () => props.isDisabled,
    (newVal) => {
      controller.setIsDisabled(newVal)
    }
  )

  watch(
    () => props.isShowEnlarged,
    (newVal) => {
      controller.setIsEnlarged(newVal)
    }
  )

  watch(
    () => props.canvasScale,
    (newVal) => {
      controller.setCanvasScale(newVal)
    }
  )

  const setCanvasRef = (el: any) => {
    if (el) {
      controller.setPdfCanvasRef(el)
    }
  }

  onUnmounted(() => {
    controller.destroy()
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Documents/CompanyDocument" as *;
</style>
