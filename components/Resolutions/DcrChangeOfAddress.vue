<template>
  <div id="dcr-change-of-addresses" ref="documentRef">
    <Resolution v-bind="controller.resolutionProps"
      @signed="emit('signed', $event)">
      <template #page1>
        <div class="change-of-address">
          <p>
          <b>RESOLVED:</b>
          <br>
          <b>CHANGE OF BUSINESS ADDRESS</b>
        </p>

        <p v-if="controller.hasPreviousAddress()">
          THAT the change of business address of the Company from:
        </p>

        <p v-if="!controller.hasPreviousAddress()">
          THAT the change of the business address of the Company to:
        </p>

        <p v-if="controller.hasPreviousAddress()">
          <div v-html="controller.getOldAddress()" />
        </p>

        <p v-if="controller.hasPreviousAddress()">
          to:
        </p>

        <div v-if="controller.isDocumentEditable()">
          <AddressInput :is-preview-mode="props.isInPreviewMode" :is-show-labels="false" :location="controller.location"
            @update-address-line1="controller.handleAddressLine1Change($event)"
            @update-address-line2="controller.handleAddressLine2Change($event)"
            @update-postcode="controller.handlePostcodeChange($event)"
            @update-city="controller.handleCityChange($event)"
            @update-state="controller.handleStateChange($event)"
            @update-country="controller.handleCountryChange($event)" />
        </div>
        <div v-if="!controller.isDocumentEditable()" v-html="controller.getNewAddress()" class="address"
          :class="{ 'placeholder': controller.isInPreviewMode.value }" />
        <p>
          is hereby accepted and confirmed.
        </p>
        <FurtherResolved />
        </div>
      </template>
    </Resolution>
  </div>
</template>

<script setup lang="ts">
import type { IPropsResolutionDocument } from '~/scripts/props/PropsResolutionDocument'
import AddressInput from '../Forms/AddressInput.vue'
import FurtherResolved from './FurtherResolved.vue'
import Resolution from './Resolution.vue'
import { DcrChangeOfAddressesController } from '~/scripts/components/resolutions/DcrChangeOfAddressesController'
import type { CompanyAmendmentAddress } from '~/scripts/models/CompanyAmendmentAddress'

const props = defineProps<IPropsResolutionDocument<CompanyAmendmentAddress>>()

const emit = defineEmits(['startLoading', 'doneLoading', "pay", "signed"])

const documentRef = ref(null)

const controller = new DcrChangeOfAddressesController(
  props,
  emit
)

watch(() => props.applicationId, (newVal) => {
  controller.setApplicationId(newVal)
})

watch(() => props.isInPreviewMode, (newVal) => {
  controller.setIsInPreviewMode(newVal)
})

watch(() => props.showWatermark, (newVal) => {
  controller.setShowWatermark(newVal)
})

watch(() => props.watermarkText, (newVal) => {
  controller.setWatermarkText(newVal)
})

watch(
    documentRef,
    (newVal) => {
      controller.setDocumentRef(newVal)
    },
    { immediate: true }
  )

defineExpose({
  totalPages: controller.totalPages.bind(controller),
  getApplication: controller.getApplication.bind(controller),
  updateApplicationContent: controller.updateApplicationContent.bind(controller),
  getPdfPages: controller.getPdfPages.bind(controller),
})
</script>

<style lang="scss">
@use '~/assets/scss/components/Resolutions/ChangeOfAddresses' as *;
</style>
