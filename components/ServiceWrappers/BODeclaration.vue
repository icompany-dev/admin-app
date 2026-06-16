<template>
  <div
    id="appointment-of-director"
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
        <BeneficialOwnership
          ref="dcrRef"
          v-if="!controller.isShowCompletedDisclosure.value"
          :company-id="props.companyId"
          :application-id="props.applicationId"
          :shareholder-id="controller.shareholderId.value ?? ''"
          :is-in-preview-mode="props.isInPreviewMode"
          @signed="controller.onSigned($event)"
          @applicationUpdated="emit('applicationUpdated', $event)"
          @updateNonBO="controller.onUpdateNonBO($event)"
        />
        <NotificationOfBeneficialOwnership
          v-if="controller.isShowCompletedDisclosure.value"
          :declaration-id="props.applicationId"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
  import BeneficialOwnership from "@/components/LegalDocuments/BeneficialOwnership.vue"
  import NotificationOfBeneficialOwnership from "../LegalDocuments/NotificationOfBeneficialOwnership.vue"
  import { BODeclarationController } from "~/scripts/components/service-wrappers/BODeclarationController"

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
      default: false,
    },
  })

  const dcrRef = ref(null)

  const emit = defineEmits(["zoomOut", "zoomIn", "back", "applicationUpdated", "updateNonBO"])

  const controller = new BODeclarationController(props.companyId, emit, props.applicationId)

  watch(
    dcrRef,
    (newVal) => {
      controller.setDcrRef(newVal)
    },
    { immediate: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Services/CosecServiceDocuments" as *;
</style>
