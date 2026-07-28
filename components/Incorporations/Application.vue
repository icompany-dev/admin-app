<template>
  <div id="incorporations-application">
    <div
      class="loader-container"
      v-if="controller.isLoading.value"
    >
      <LoaderPrepare
        :label="controller.loaderLabel"
        :sublabel="controller.loaderSublabel"
      />
    </div>
    <template v-if="!controller.isLoading.value">
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
        <div class="summary-item">{{ controller.otherProposedNameLabel }}: {{ controller.otherProposedName }}</div>
        <div class="summary-item">
          <div class="summary-item-title">
            {{ controller.applicantLabel }}
          </div>
          <div class="summary-item-content human-details">
            <span class="human-detail">
              <b>{{ controller.applicantName }}</b>
            </span>
            <span class="human-detail">
              <i class="fa-regular fa-envelope" />
              {{ controller.applicantEmail }}
            </span>
            <span class="human-detail">
              <i class="fa-brands fa-whatsapp" />
              {{ controller.applicantPhone }}
            </span>
          </div>
        </div>
      </div>
      <div class="application-details">
        <ServiceApplication v-bind="controller.serviceApplicationProps">
          <template #application>//</template>
        </ServiceApplication>
        <div class="document-display">
          <component
            ref="documentRef"
            :is="activeDocumentComponent"
            :application-id="controller.applicationId.value"
            :target-id="controller.paymentOrderId.value"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import ReceiptInvoiceService from "@/components/CompanyServices/ReceiptInvoiceService.vue"
  import ServiceApplication from "@/components/Services/ServiceApplication.vue"
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
