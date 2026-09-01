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
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<script lang="ts" setup>
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
</script>

<style lang="scss">
  @use "~/assets/scss/components/ServiceWrappers/AppointJointCompanySecretary" as *;
</style>
