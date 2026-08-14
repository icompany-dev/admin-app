<template>
  <div
    id="change-of-name"
    class="cosec-service-documents"
    :class="{ 'full-size': props.isDocumentEnlarged }"
  >
    <div
      class="documents-section"
      @click="emit('zoomIn')"
      :style="controller.getZoomStyle()"
    >
      <TransitionGroup
        name="flip"
        tag="div"
        class="document-transition-wrapper"
      >
        <NoConstitutionDeclaration
          :company-id="props.companyId"
          :application-id="props.applicationId ?? ''"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
  import NoConstitutionDeclaration from "../LegalDocuments/NoConstitutionDeclaration.vue"
  import { NoConstitutionController } from "~/scripts/components/service-wrappers/NoConstitutionController"

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
  const emit = defineEmits(["zoomOut", "zoomIn", "back"])

  const controller = new NoConstitutionController(props.companyId, emit, props.applicationId)

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
