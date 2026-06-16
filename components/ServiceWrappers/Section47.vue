<template>
  <div
    id="section-47"
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
        <DcrSection47
          ref="dcr"
          :company-id="props.companyId"
          :application-id="props.applicationId"
          @signed="controller.onSigned($event)"
        />
      </TransitionGroup>
    </div>
    <!-- <DocumentToggler :can-zoom-in="controller.canZoomIn()" :can-zoom-out="controller.canZoomOut()" @back="controller.onBackClicked()"
      @remove="controller.onRemove()" @zoom-in="controller.onZoomInClicked()" @zoom-out="controller.onZoomOutClicked()">
      <template #help>
        <div class="help-title">
          {{ controller.helpTitle() }}
        </div>
        <div class="help-description" v-html="controller.helpDescription()" />
      </template>
    </DocumentToggler> -->
    <!-- <ServiceCta class="enlarged" @back="controller.onBackClicked()" @proceed="controller.onSubmitClicked()" /> -->
  </div>
</template>

<script setup lang="ts">
  import DocumentToggler from "@/components/DocumentCtas/DocumentToggler.vue"
  import ServiceCta from "../DocumentCtas/ServiceCta.vue"
  import DcrSection47 from "../Resolutions/DcrSection47.vue"
  import { Section47Controller } from "~/scripts/components/service-wrappers/Section47Controller"

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
  })

  const dcr = ref(null)
  const emit = defineEmits(["zoomOut", "zoomIn", "makePayment", "back"])

  const controller = new Section47Controller(props.companyId, emit, props.applicationId)

  watch(
    dcr,
    (newVal) => {
      controller.setDcrRef(newVal)
    },
    { immediate: true }
  )

  watch(
    () => props.applicationId,
    (newVal) => {
      if (newVal) {
        controller.fetchApplication(newVal)
      }
    }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Services/CosecServiceDocuments" as *;
</style>
