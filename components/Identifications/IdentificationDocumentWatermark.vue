<template>
  <div
    id="identifications-identification-document-watermark"
    ref="documentRef"
  >
    <Paper
      :paper-orientation="controller.paperOrientation.value"
      :paper-size="controller.paperSize.value"
      :show-ear-mark="false"
      :show-page-number="false"
      :show-watermark="false"
      :class="'identification-marker'"
    >
      <template #paperContent>
        <div class="image-containers">
          <div class="idenfication-image-container">
            <div class="marker">{{ controller.markerText.value }}</div>
            <img :src="controller.identificationFileUrl.value" />
          </div>

          <div
            class="idenfication-image-container"
            v-if="controller.hasAltIdentificationFile"
          >
            <div class="marker">{{ controller.markerText.value }}</div>
            <img :src="controller.identificationFileUrl.value" />
          </div>
        </div>
      </template>
    </Paper>
  </div>
</template>

<script lang="ts" setup>
  import Paper from "../Papers/Paper.vue"
  import { IdentificationDocumentWatermarkController } from "~/scripts/components/identifications/IdentificationDocumentWatermarkController"
  import type { IPropsIdentificationDocumentWatermark } from "~/scripts/props/PropsIdentificationDocumentWatermark"

  const props = defineProps<IPropsIdentificationDocumentWatermark>()

  const emit = defineEmits([])

  const documentRef = ref(null)

  const controller = new IdentificationDocumentWatermarkController(props, emit)

  watch(
    () => props,
    (newVal) => {
      controller.setDataFromProps(newVal)
    },
    { deep: true }
  )

  watch(
    documentRef,
    (newVal) => {
      controller.setDocumentRef(newVal)
    },
    { immediate: true }
  )

  defineExpose({
    getPdfPages: controller.getPdfPages.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Identifications/IdentificationDocumentWatermark" as *;
</style>
