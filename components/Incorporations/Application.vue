<template>
  <div id="incorporations-application">
    <div class="application-summary">
      <div class="proposed-name">
        {{ controller.application.value.getName() }}
        <span
          class="name-approved"
          v-if="controller.isNameApproved"
        >
          <i class="fa-solid fa-circle-check" />
        </span>
      </div>
      <div class="applicant-details">
        <div class="applicant-name">//</div>
      </div>
    </div>
    <div class="application-details">
      <ServiceApplication v-bind="controller.serviceApplicationProps" />
      <div class="document-display">
        <component
          ref="documentRef"
          :is="activeDocumentComponent"
          :application-id="controller.applicationId.value"
          :target-id="controller.paymentOrderId.value"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import ServiceApplication from "@/components/Services/ServiceApplication.vue"
  import ReceiptInvoiceService from "@/components/CompanyServices/ReceiptInvoiceService.vue"
  import { ApplicationController } from "~/scripts/components/incorporations/ApplicationController"
  import type { IPropsIncorporationApplication } from "~/scripts/props/PropsIncorporationApplication"
  import { DocumentTargets } from "~/scripts/constants/DocumentTargets"

  const props = defineProps<IPropsIncorporationApplication>()

  const emit = defineEmits(["back"])

  const componentMap: Record<string, any> = {
    [DocumentTargets.TARGET_RECEIPT]: ReceiptInvoiceService,
  }

  const controller = new ApplicationController(props, emit)

  const activeDocumentComponent = computed(() => {
    const target = controller.selectedDocumentTarget.value
    return target && componentMap[target] ? componentMap[target] : null
  })

  watch(
    () => props,
    (newVal) => {
      controller.setDataFromProps(newVal)
    },
    { deep: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Incorporations/Application" as *;
</style>
