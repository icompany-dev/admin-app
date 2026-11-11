<template>
  <div
    id="resolutions-dcr-appointment-of-joint-company-secretary"
    ref="documentRef"
  >
    <Resolution
      v-bind="controller.resolutionProps"
      @resolutionDate="controller.onResolutionDateChanged($event)"
    >
      <template #page1>
        <p>
          <b>RESOLVED:</b>
        </p>
        <p>
          <b>APPOINTMENT OF JOINT COMPANY SECRETARY</b>
        </p>
        <p>
          THAT the appointment of
          <b>
            {{ controller.newCosecName }} (NRIC No. {{ controller.newCosecNric }}) ({{ controller.newCosecLicense }} /
            <br />
            SSM PC No. {{ controller.newCosecCertificate }})
          </b>
          as the Secretary of the Company be and is hereby accepted with immediate effect.
        </p>
      </template>
    </Resolution>
  </div>
</template>

<script lang="ts" setup>
  import Resolution from "./Resolution.vue"
  import { DcrAppointmentOfJointCompanySecretaryController } from "~/scripts/components/resolutions/DcrAppointmentOfJointCompanySecretaryController"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
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

  const emit = defineEmits([])

  const documentRef = ref(null)

  const controller = new DcrAppointmentOfJointCompanySecretaryController(props.companyId, emit)

  watch(
    () => props.companyId,
    (newVal) => {
      controller.setCompanyId(newVal)
    }
  )

  watch(
    documentRef,
    (newVal) => {
      controller.setDocumentRef(newVal)
    },
    { immediate: true }
  )

  watch(
    () => props.selectedDirectorId,
    (newVal) => {
      controller.setSelectedDirectorId(newVal)
    },
    { immediate: true }
  )

  watch(
    () => props.secretaryName,
    (newVal) => {
      controller.setSecretaryName(newVal)
    },
    { immediate: true }
  )

  watch(
    () => props.secretaryIc,
    (newVal) => {
      controller.setSecretaryIc(newVal)
    },
    { immediate: true }
  )

  watch(
    () => props.secretaryLicense,
    (newVal) => {
      controller.setSecretaryLicense(newVal)
    },
    { immediate: true }
  )

  watch(
    () => props.secretaryCertificate,
    (newVal) => {
      controller.setSecretaryCertificate(newVal)
    },
    { immediate: true }
  )

  defineExpose({
    getPdfPages: controller.getPdfPages.bind(controller),
    totalPages: controller.totalPages.bind(controller),
    isPageReady: controller.isPageReady.bind(controller),
    waitForReady: controller.waitForReady.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Resolutions/DcrAppointmentOfJointCompanySecretary" as *;
</style>
