<template>
  <div
    id="dcr-resignation-and-cessation-of-cosec"
    ref="documentRef"
  >
    <div
      v-if="controller.errorMessage.value"
      class="alert alert-danger"
    >
      {{ controller.errorMessage.value }}
    </div>

    <Resolution
      v-else
      v-bind="controller.resolutionProps"
      @resolutionDate="controller.onDocumentDateUpdated($event)"
    >
      <template #page1>
        <p>
          <b>RESOLVED:</b>
        </p>
        <p>
          <b><u>RESIGNATION &amp; CESSATION</u></b>
        </p>

        <p>
          <b>THAT</b>
          the resignation of
          <b>{{ props.resigningSecretaryName }} (NRIC NO. {{ props.resigningSecretaryIdentification }})</b>
          as the Secretary of the Company, who no longer intends to continue practising, be and is hereby accepted with
          immediate effect.
        </p>

        <p>
          <b><u>APPOINTMENT AS REPLACEMENT</u></b>
        </p>

        <p>
          <b>THAT</b>
          the appointment as replacement, addition and instead of her as the Secretary of the Company be:
        </p>

        <p>
          <b>
            {{ props.replacementSecretaryName }} (NRIC NO. {{ props.replacementSecretaryIdentification }}) (SSM PC NO.
            {{ props.replacementSecretaryPractisingCertificateNumber }})
          </b>
        </p>

        <p>be accepted with immediate effect.</p>

        <p>
          <b>FURTHER RESOLVED THAT</b>
          the Company Secretary be and is hereby authorised to file the relevant documents and take all necessary steps
          to give effect to this Resolution.
        </p>
      </template>
    </Resolution>
  </div>
</template>

<script setup lang="ts">
  import Resolution from "./Resolution.vue"
  import { DcrResignationAndCessationOfCosecController } from "~/scripts/components/resolutions/DcrResignationAndCessationOfCosecController"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
    directorId: {
      type: String,
      default: "",
    },
    resigningSecretaryName: {
      type: String,
      required: true,
    },
    resigningSecretaryIdentification: {
      type: String,
      required: true,
    },
    replacementSecretaryName: {
      type: String,
      required: true,
    },
    replacementSecretaryIdentification: {
      type: String,
      required: true,
    },
    replacementSecretaryPractisingCertificateNumber: {
      type: String,
      required: true,
    },
  })

  const documentRef = ref<HTMLElement | null>(null)
  const controller = new DcrResignationAndCessationOfCosecController()

  watch(
    () => [props.companyId, props.directorId] as const,
    ([companyId, directorId]) => {
      controller.load(companyId, directorId)
    },
    { immediate: true }
  )

  watch(
    documentRef,
    (newVal) => {
      controller.setDocumentRef(newVal)
    },
    { immediate: true }
  )

  defineExpose({
    getPdfPages: controller.getPdfPages.bind(controller),
    isLoading: controller.isLoading,
    errorMessage: controller.errorMessage,
  })
</script>
