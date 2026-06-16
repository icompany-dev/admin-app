<template>
  <div
    id="services-management-account-for-striking-off"
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
        <ManagementAccountForStrikingOff
          ref="dcrRef"
          :company-id="controller.companyId"
          :financial-year-start-date="props.financialYearStartDate"
          :financial-year-end-date="props.financialYearEndDate"
          @signed="controller.onSigned($event)"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import DcrClosureOfBankAccount from "../Resolutions/DcrClosureOfBankAccount.vue"
  import ManagementAccountForStrikingOff from "@/components/LegalDocuments/ManagementAccountForStrikingOff.vue"
  import { ManagementAccountForStrikingOffController } from "~/scripts/components/service-wrappers/ManagementAccountForStrikingOffController"

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
      default: true,
    },
    financialYearEndDate: {
      type: String,
      required: true,
    },
    financialYearStartDate: {
      type: String,
      required: true,
    },
  })

  const dcrRef = ref(null)

  const emit = defineEmits(["zoomOut", "zoomIn", "back", "applicationUpdated"])

  const controller = new ManagementAccountForStrikingOffController(props.companyId, emit, props.applicationId)

  watch(
    dcrRef,
    (newVal) => {
      controller.setDcrRef(newVal)
    },
    { immediate: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Services/ManagementAccountForStrikingOff" as *;
</style>
