<template>
  <div
    id="services-tekun-application"
    class="cosec-service-documents"
    :class="{ 'full-size': props.isDocumentEnlarged }"
  >
    <div
      class="documents-section"
      :class="{ invert: controller.showMcrFirst.value }"
      @click="emit('zoomIn')"
      :style="controller.getZoomStyle()"
      @click.stop
    >
      <TransitionGroup
        name="flip"
        tag="div"
        class="document-transition-wrapper"
      >
        <McrTekunApplication
          ref="mcrRef"
          v-bind="controller.resolutionDocumentProps"
          @complete-application="controller.onApplicationUpdated($event)"
        />
        <div class="document pdf-file">
          <div
            class="overlay"
            v-for="(page, index) in controller.numberOfPagesForApplicationForm.value"
            :key="page"
          >
            <span
              class="click-to-preview"
              v-html="controller.completeInWetInk"
            />
          </div>
          <canvas
            v-for="(page, index) in controller.numberOfPagesForApplicationForm.value"
            :key="page"
            :ref="
              (el) => {
                return controller.setPageCanvasesForApplicationForm(page, el as HTMLCanvasElement | null)
              }
            "
          />
        </div>
        <div
          class="document pdf-file"
          :class="{
            'no-document-display': !controller.isSsmCorporateProfileAvailable,
          }"
        >
          <div
            class="overlay"
            v-if="!controller.isSsmCorporateProfileAvailable"
          >
            <span
              class="click-to-preview"
              v-html="controller.ssmCorporateProfileNotAvailable"
            />
          </div>
          <canvas
            v-for="(page, index) in controller.numberOfPagesForCorporateProfile.value"
            :key="page"
            :class="{ hidden: index > 0 }"
            :ref="
              (el) => {
                return controller.setPageCanvasesForCorporateProfile(page, el as HTMLCanvasElement | null)
              }
            "
          />
        </div>
        <div
          class="document pdf-file"
          :class="{ 'no-document-display': !controller.isCoiAvailable }"
        >
          <div
            class="overlay"
            v-if="!controller.isCoiAvailable"
          >
            <span
              class="click-to-preview"
              v-html="controller.coiNotAvailable"
            />
          </div>
          <canvas
            v-for="(page, index) in controller.numberOfPagesForCOI.value"
            :key="page"
            :class="{ hidden: index > 0 }"
            :ref="
              (el) => {
                return controller.setPageCanvasesForCOI(page, el as HTMLCanvasElement | null)
              }
            "
          />
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
  import McrTekunApplication from "../Resolutions/McrTekunApplication.vue"
  import { TekunApplicationController } from "~/scripts/components/service-wrappers/TekunApplicationController"

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
  })

  const dcrRef = ref(null)
  const mcrRef = ref(null)

  const emit = defineEmits(["zoomOut", "zoomIn", "back", "applicationUpdated"])

  const controller = new TekunApplicationController(props.companyId, emit, props.applicationId)

  watch(
    dcrRef,
    (newVal) => {
      controller.setDcrRef(newVal)
    },
    { immediate: true }
  )

  watch(
    mcrRef,
    (newVal) => {
      controller.setMcrRef(newVal)
    },
    { immediate: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Services/CosecServiceDocuments" as *;
  @use "~/assets/scss/components/Services/TekunApplication" as *;
</style>
