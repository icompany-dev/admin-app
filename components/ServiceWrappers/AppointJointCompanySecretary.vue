<template>
  <div
    id="service-wrappers-appoint-joint-company-secretary"
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
        <DcrAppointmentOfJointCompanySecretary
          ref="dcrRef"
          :company-id="controller.companyId"
          :selectedDirectorId="props.selectedDirectorId"
          :secretaryName="props.secretaryName"
          :secretaryIc="props.secretaryIc"
          :secretaryLicense="props.secretaryLicense"
          :secretaryCertificate="props.secretaryCertificate"
        />
      </TransitionGroup>
    </div>
    <ActionTray
      :actions="controller.actionTrayElements.value"
      v-if="props.isShowActionTray"
    />
  </div>
</template>

<script lang="ts" setup>
  import ActionTray from "../ActionTrays/ActionTray.vue"
  import DcrAppointmentOfJointCompanySecretary from "../Resolutions/DcrAppointmentOfJointCompanySecretary.vue"
  import { AppointJointCompanySecretaryController } from "~/scripts/components/service-wrappers/AppointJointCompanySecretaryController"

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
    isShowActionTray: {
      type: Boolean,
      default: true,
    },
    selectedDirectorId: {
      type: String,
      default: "",
    },
    secretaryName: {
      type: String,
      default: "",
    },
    secretaryIc: {
      type: String,
      default: "",
    },
    secretaryLicense: {
      type: String,
      default: "",
    },
    secretaryCertificate: {
      type: String,
      default: "",
    },
  })

  const emit = defineEmits(["zoomOut", "zoomIn", "makePayment", "back", "applicationUpdated"])

  const dcrRef = ref(null)

  const controller = new AppointJointCompanySecretaryController(props.companyId, emit, props.applicationId)

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
      }
    }
  )

  defineExpose({
    getPdfPages: controller.getPdfPages.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/ServiceWrappers/AppointJointCompanySecretary" as *;
</style>
