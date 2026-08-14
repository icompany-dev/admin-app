<template>
  <div id="dcr-change-of-registered-addresses">
    <Resolution
      v-bind="controller.resolutionProps"
      @signed="emit('signed', $event)"
    >
      <template #page1>
        <p>
          <b>RESOLVED:</b>
          <br />
          <b>CHANGE OF REGISTERED ADDRESS</b>
        </p>
        <p>
          WHEREAS pursuant to Section 46(1) of the Companies Act 2016, the registered office of the Company be and is
          hereby changed from:
        </p>
        <div
          v-html="controller.getOldAddress()"
          class="address"
        />
        <p>to</p>
        <div v-if="controller.isDocumentEditable()">
          <AddressInput
            :is-disabled="props.isInPreviewMode"
            @update-address-line1="controller.handleAddressLine1Change($event)"
            @update-address-line2="controller.handleAddressLine2Change($event)"
            @update-postcode="controller.handlePostcodeChange($event)"
            @update-city="controller.handleCityChange($event)"
            @update-state="controller.handleStateChange($event)"
            @update-country="controller.handleCountryChange($event)"
          />
        </div>
        <div
          v-if="!controller.isDocumentEditable()"
          v-html="controller.getNewAddress()"
          class="address"
          :class="{ placeholder: controller.isInPreviewMode.value }"
        />
        <p>
          with effect from
          <span v-html="controller.signatureDate()" />
          .
        </p>
        <FurtherResolved />
      </template>
    </Resolution>
  </div>
</template>

<script setup lang="ts">
  import type { CompanyAmendmentRegisteredAddress } from "~/scripts/models/CompanyAmendmentRegisteredAddress"
  import AddressInput from "../Forms/AddressInput.vue"
  import FurtherResolved from "./FurtherResolved.vue"
  import Resolution from "./Resolution.vue"
  import { DcrChangeOfRegisteredAddressesController } from "~/scripts/components/resolutions/DcrChangeOfRegisteredAddressesController"
  import { StringUtil } from "~/scripts/utils/String"
  import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

  const props = defineProps<IPropsResolutionDocument<CompanyAmendmentRegisteredAddress>>()

  const emit = defineEmits(["startLoading", "doneLoading", "signed"])

  const controller = new DcrChangeOfRegisteredAddressesController(props, emit)

  watch(
    () => props.applicationId,
    (newVal) => {
      if (!StringUtil.isNullOrEmpty(newVal)) {
        controller.fetchApplication(newVal ?? "")
      }
    }
  )

  watch(
    () => props.isInPreviewMode,
    (newVal) => {
      controller.setIsInPreviewMode(newVal)
    }
  )

  watch(
    () => props.showWatermark,
    (newVal) => {
      controller.setShowWatermark(newVal)
    }
  )

  watch(
    () => props.watermarkText,
    (newVal) => {
      controller.setWatermarkText(newVal)
    }
  )

  defineExpose({
    totalPages: controller.totalPages.bind(controller),
    getApplication: controller.getApplication.bind(controller),
    updateApplicationContent: controller.updateApplicationContent.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Resolutions/ChangeOfRegisteredAddresses" as *;
</style>
