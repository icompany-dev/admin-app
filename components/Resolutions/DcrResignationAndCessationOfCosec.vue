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
          <b>
            {{ props.resigningSecretaryName }}
            <template v-if="!StringUtil.isNullOrEmpty(props.resigningSecretaryIdentification.trim())">
              {{ " NRIC NO. " + props.resigningSecretaryIdentification.trim() }}
            </template>
            <template v-if="!StringUtil.isNullOrEmpty(props.resigningSecretaryPractisingCertificateNumber.trim())">
              {{ " " }}
              <span class="secretary-pc-number">
                {{ `(SSM PC NO. ${props.resigningSecretaryPractisingCertificateNumber.trim()})` }}
              </span>
            </template>
          </b>
          as the Secretary of the Company, who no longer intends to continue practising, be and is hereby accepted with
          immediate effect.
        </p>

        <p>
          <b><u>APPOINTMENT AS REPLACEMENT</u></b>
        </p>

        <p>
          <b>THAT</b>
          the appointment of:
        </p>

        <p>
          <b>
            {{ props.replacementSecretaryName }}
            <template v-if="!StringUtil.isNullOrEmpty(props.replacementSecretaryIdentification.trim())">
              {{ " NRIC NO. " + props.replacementSecretaryIdentification.trim() }}
            </template>
            <template v-if="!StringUtil.isNullOrEmpty(props.replacementSecretaryPractisingCertificateNumber.trim())">
              {{ " " }}
              <span class="secretary-pc-number">
                {{ `(SSM PC NO. ${props.replacementSecretaryPractisingCertificateNumber.trim()})` }}
              </span>
            </template>
          </b>
        </p>

        <p>
          as Secretary of the Company in place of the resigning Secretary be and is hereby approved with immediate
          effect.
        </p>

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
  import { StringUtil } from "~/scripts/utils/String.js"
  import Resolution from "./Resolution.vue"
  import type { PropType } from "vue"
  import type { Director } from "~/scripts/models/Director"
  import { DcrResignationAndCessationOfCosecController } from "~/scripts/components/resolutions/DcrResignationAndCessationOfCosecController"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
    directors: {
      type: Array as PropType<Director[]>,
      default: () => [],
    },
    directorIds: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    resigningSecretaryName: {
      type: String,
      required: true,
    },
    resigningSecretaryIdentification: {
      type: String,
      default: "",
    },
    resigningSecretaryPractisingCertificateNumber: {
      type: String,
      default: "",
    },
    replacementSecretaryName: {
      type: String,
      required: true,
    },
    replacementSecretaryIdentification: {
      type: String,
      default: "",
    },
    replacementSecretaryPractisingCertificateNumber: {
      type: String,
      default: "",
    },
  })

  const documentRef = ref<HTMLElement | null>(null)
  const controller = new DcrResignationAndCessationOfCosecController()

  watch(
    () => props.companyId,
    (companyId) => {
      void controller.load(companyId)
    },
    { immediate: true }
  )

  watch(
    () => [props.directors, props.directorIds] as const,
    ([directors, directorIds]) => {
      controller.setSelectedDirectors(directors, directorIds)
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

<style scoped>
  .secretary-pc-number {
    white-space: nowrap;
  }
</style>
