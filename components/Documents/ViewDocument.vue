<template>
  <div
    id="documents-view-document"
    :class="{ show: controller.isShowing.value }"
    @click="controller.handleClick($event)"
  >
    <div
      class="canvas-container"
      ref="pdfCanvasRef"
    >
      <canvas
        v-for="page in controller.totalPages.value"
        :key="page"
        :ref="
          (el) => {
            return controller.setPageCanvas(page, el as HTMLCanvasElement | null)
          }
        "
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ViewDocumentController } from "~/scripts/components/documents/ViewDocumentController"

  const props = defineProps({
    pdfUrl: {
      type: String,
      required: true,
    },
  })

  const emit = defineEmits(["hide"])

  const pdfCanvasRef = ref(null)

  const controller = new ViewDocumentController(props.pdfUrl, emit)

  onMounted(() => {
    controller.addEventListeners()
  })

  onBeforeUnmount(() => {
    controller.removeEventListeners()
  })

  watch(
    () => props.pdfUrl,
    (newVal) => {
      controller.setPdfUrl(newVal)
    }
  )

  watch(
    pdfCanvasRef,
    (newVal) => {
      controller.setPdfCanvasRef(newVal)
    },
    { immediate: true }
  )

  defineExpose({
    show: controller.show.bind(controller),
    hide: controller.hide.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Documents/ViewDocument" as *;
</style>
