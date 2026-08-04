<template>
  <div id="switches-application">
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
      <div class="switch-application-summary">
        <div class="company-name">
          {{ controller.application.value.companyName }}
          <span
            class="name-completed"
            v-if="controller.application.value.hasCompletedName()"
          >
            <i class="fa-solid fa-circle-check" />
          </span>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import ApplicationNode from "@/components/Services/ApplicationNode.vue"
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import ReceiptInvoiceService from "@/components/CompanyServices/ReceiptInvoiceService.vue"
  import ServiceApplication from "@/components/Services/ServiceApplication.vue"
  import UploadFile from "@/components/Popups/UploadFile.vue"
  import { ApplicationController } from "~/scripts/components/switches/ApplicationController"
  import type { IPropsSwitchApplication } from "~/scripts/props/PropsSwitchApplication"
  import { DocumentTargets } from "~/scripts/constants/DocumentTargets"

  const props = defineProps<IPropsSwitchApplication>()

  const emit = defineEmits([])

  const componentMap: Record<string, any> = {
    [DocumentTargets.TARGET_RECEIPT]: ReceiptInvoiceService,
  }

  const controller = new ApplicationController(props, emit)

  watch(
    () => props,
    (newVal) => {
      controller.setDataFromProps(newVal)
    }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Switches/Application" as *;
</style>
