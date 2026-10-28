<template>
  <div
    id="appointment-of-tax-agent"
    class="cosec-service-documents"
    :class="{ 'full-size': props.isDocumentEnlarged }"
  >
    <div
      class="documents-section"
      v-keyboard-click
      @click="emit('zoomIn')"
      :style="controller.getZoomStyle()"
    >
      <TransitionGroup
        name="flip"
        tag="div"
        class="document-transition-wrapper"
      >
        <DcrAppointmentOfTaxAgent
          ref="dcrRef"
          v-bind="controller.resolutionDocumentProps"
          @updated="controller.onDataUpdated()"
          @signed="(controller.onSigned($event), emit('signed', $event))"
        />
      </TransitionGroup>
    </div>

    <ActionTray :actions="controller.actionTrayElements.value" />
    <Teleport to="body">
      <Transition name="slide-left">
        <div
          class="document-auto-saved"
          v-if="controller.isUpdating.value"
        >
          <i
            class="fa-regular fa-spin fa-spinner"
            v-if="!controller.isUpdated.value"
          ></i>
          <div class="label-details">
            <div class="label">{{ controller.updatingLabel }}</div>
            <div class="sublabel">{{ controller.updatingSublabel }}</div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
  import ActionTray from "@/components/ActionTrays/ActionTray.vue"
  import { CompanyAppointmentOfTaxAgent } from "~/scripts/models/CompanyAppointmentOfTaxAgent.js"
  import DcrAppointmentOfTaxAgent from "../Resolutions/DcrAppointmentOfTaxAgent.vue"
  import { AppointmentOfTaxAgentController } from "~/scripts/components/service-wrappers/AppointmentOfTaxAgentController"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
    applicationId: {
      type: String,
      default: null,
    },
    application: {
      type: CompanyAppointmentOfTaxAgent,
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
    isAcknowledgeService: {
      type: Boolean,
      default: false,
    },
    isPhysicalSignature: {
      type: Boolean,
      default: false,
    },
    isElectronicSignature: {
      type: Boolean,
      default: false,
    },
  })

  const dcrRef = ref(null)
  const emit = defineEmits(["zoomOut", "zoomIn", "back", "signed", "documentReady", "applicationUpdated"])

  const controller = new AppointmentOfTaxAgentController(props, emit)

  watch(
    dcrRef,
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
      } else {
        controller.setApplication(props.companyId)
      }
    }
  )

  watch(
    () => props.isInPreviewMode,
    (newVal) => {
      controller.isInPreviewMode.value = newVal
    }
  )

  defineExpose({
    setApplicationStatus: controller.setApplicationStatus.bind(controller),
    lockDocumentEdit: controller.lockDocumentEdit.bind(controller),
    downloadPdf: controller.onDownloadClicked.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Services/CosecServiceDocuments" as *;
</style>
