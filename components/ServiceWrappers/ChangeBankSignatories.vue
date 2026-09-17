<template>
  <div
    id="adopt-common-seal"
    class="cosec-service-documents"
    :class="{ 'full-size': props.isDocumentEnlarged }"
  >
    <div
      class="documents-section"
      :class="{ invert: controller.showMcrFirst.value }"
      v-keyboard-click
      @click="emit('zoomIn')"
      :style="controller.getZoomStyle()"
    >
      <TransitionGroup
        name="flip"
        tag="div"
        class="document-transition-wrapper"
      >
        <DcrChangeBankSignatories
          ref="dcrRef"
          v-bind="controller.resolutionDocumentProps"
          @signed="controller.onSigned($event)"
          @dataUpdated="controller.onDataUpdated($event)"
        />
      </TransitionGroup>
    </div>
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
    <ActionTray :actions="controller.actionTrayElements.value" />
  </div>
</template>

<script setup lang="ts">
  import ActionTray from "@/components/ActionTrays/ActionTray.vue"
  import DcrChangeBankSignatories from "../Resolutions/DcrChangeBankSignatories.vue"
  import { ChangeBankSignatoriesController } from "~/scripts/components/service-wrappers/ChangeBankSignatoriesController"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
    companyBankId: {
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

  const controller = new ChangeBankSignatoriesController(
    props.companyId,
    props.companyBankId,
    emit,
    props.applicationId
  )

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

  watch(
    () => props.companyBankId,
    (newVal) => {
      controller.setCompanyBankId(newVal)
    }
  )

  // watch(
  //   () => props.isInPreviewMode,
  //   (newVal) => {
  //     controller.setIsInPreviewMode(newVal)
  //   }
  // )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Services/CosecServiceDocuments" as *;
</style>
