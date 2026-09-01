<template>
  <div id="resolutions-dcr-appointment-of-joint-company-secretary">
    <Resolution v-bind="controller.resolutionProps">
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
            SSM PC No. {{ controller.newCosecCertificate }}) as the Secretary of the Company be and is hereby accepted
            with immediate effect.
          </b>
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
  })

  const emit = defineEmits([])

  const controller = new DcrAppointmentOfJointCompanySecretaryController(props.companyId, emit)

  watch(
    () => props.companyId,
    (newVal) => {
      controller.setCompanyId(newVal)
    }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Resolutions/DcrAppointmentOfJointCompanySecretary" as *;
</style>
