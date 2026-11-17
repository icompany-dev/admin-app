<template>
  <div
    id="resolutions-dcr-resignation-of-cosec"
    ref="documentRef"
  >
    <Resolution
      v-bind="controller.resolutionProps"
      @resolutionDate="controller.onDocumentDateUpdated($event)"
    >
      <template #page1>
        <p>
          <b>RESOLVED:</b>
        </p>

        <p>
          <b><u>RESIGNATION</u></b>
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
          as the Secretary of the Company be and is hereby accepted with immediate effect.
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

<script lang="ts" setup>
  import { StringUtil } from "~/scripts/utils/String.js"
  import Resolution from "./Resolution.vue"
  import { DcrResignationOfCosecController } from "~/scripts/components/resolutions/DcrResignationOfCosecController"

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
      default: "",
    },
    resigningSecretaryPractisingCertificateNumber: {
      type: String,
      default: "",
    },
  })

  const emit = defineEmits([])

  const documentRef = ref<HTMLElement | null>(null)

  const controller = new DcrResignationOfCosecController()

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

<style lang="scss">
  @use "~/assets/scss/components/Resolutions/DcrResignationOfCosec" as *;
</style>
