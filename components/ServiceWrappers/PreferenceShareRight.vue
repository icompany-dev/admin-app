<template>
  <div
    id="change-of-name"
    class="cosec-service-documents"
    :class="{ 'full-size': props.isDocumentEnlarged }"
  >
    <div
      class="documents-section"
      :class="{ invert: controller.showMcrFirst.value }"
      @click="emit('zoomIn')"
      :style="controller.getZoomStyle()"
    >
      <TransitionGroup
        name="flip"
        tag="div"
        class="document-transition-wrapper"
      >
        <DcrPreferenceShareRight
          :company-id="props.companyId"
          :application-id="props.applicationId"
          :application="null"
          :show-watermark="props.showWatermarkText"
          :watermark-text="props.watermarkText"
          :is-in-preview-mode="props.isInPreviewMode"
          :is-by-shareholder="false"
          :financial-period-id="null"
          :bank-id="null"
          :year-to-lodge="null"
          :type="null"
          :name-reservations="controller.nameReservations.value"
          @name-changed="controller.onNamesSet($event)"
        />
        <McrPreferenceShareRight
          :company-id="props.companyId"
          :application-id="props.applicationId"
          :application="null"
          :show-watermark="props.showWatermarkText"
          :watermark-text="props.watermarkText"
          :is-in-preview-mode="props.isInPreviewMode"
          :is-by-shareholder="false"
          :financial-period-id="null"
          :bank-id="null"
          :year-to-lodge="null"
          :type="null"
          :name-reservations="controller.nameReservations.value"
          @name-changed="controller.onNamesSet($event)"
        />
      </TransitionGroup>
    </div>
    <DocumentToggler
      :can-zoom-in="controller.canZoomIn()"
      :can-zoom-out="controller.canZoomOut()"
      @back="emit('back')"
      @remove="controller.onRemove()"
      @zoom-in="controller.onZoomInClicked()"
      @zoom-out="controller.onZoomOutClicked()"
    >
      <template #help>
        <div class="help-title">
          {{ controller.helpTitle() }}
        </div>
        <div
          class="help-description"
          v-html="controller.helpDescription()"
        />
      </template>
      <template #option>
        <div class="more-option">
          <span
            class="label"
            :class="{ active: controller.showMcrFirst.value }"
          >
            By Type
          </span>
          <span>
            <Switch
              :boolean-value="controller.showMcrFirst.value"
              @switch-update="controller.onShowMcrFirstClicked()"
            />
          </span>
        </div>
      </template>
    </DocumentToggler>
  </div>
</template>

<script setup lang="ts">
  import DocumentToggler from "@/components/DocumentCtas/DocumentToggler.vue"
  import Switch from "../Forms/Switch.vue"
  import DcrPreferenceShareRight from "../Resolutions/DcrPreferenceShareRight.vue"
  import McrPreferenceShareRight from "../Resolutions/McrPreferenceShareRight.vue"
  import { ChangeOfNameController } from "~/scripts/components/service-wrappers/ChangeOfNameController"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
    applicationId: {
      type: String,
      default: null,
    },
    isDocumentEnlarged: {
      type: Boolean,
      default: false,
    },
    isInPreviewMode: {
      type: Boolean,
      default: true,
    },
    showWatermarkText: {
      type: Boolean,
      default: true,
    },
    watermarkText: {
      type: String,
      default: "DRAFT",
    },
  })

  const emit = defineEmits(["zoomOut", "zoomIn", "back", "makePayment"])

  const noticeRef = ref(null)

  const controller = new ChangeOfNameController(props.companyId, emit, props.applicationId)

  watch(
    noticeRef,
    (newVal) => {
      controller.setNoticeRef(newVal)
    },
    { immediate: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Services/CosecServiceDocuments" as *;
</style>
