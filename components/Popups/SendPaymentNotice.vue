<template>
  <div id="popups-send-payment-notice">
    <Popup
      ref="popupRef"
      v-bind="controller.popupProps"
    >
      <template #content>
        <div class="action">
          {{ controller.pricingLabel }}
        </div>
        <div class="form-group">
          <select
            class="form-control"
            v-model="controller.selectedPricingId.value"
            @change="controller.onServicePricingSelected()"
          >
            <option disabled>Select One</option>
            <option
              v-for="(option, index) in controller.pricingOptions"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
      </template>
      <template #actionButtons>
        <button
          class="btn btn-danger"
          @click="controller.onCancelClicked()"
        >
          {{ controller.cancelLabel }}
        </button>
        <button
          class="btn btn-submit"
          :disabled="!controller.canProceed"
          :class="{ 'is-loading': controller.isSubmitting.value }"
          @click="controller.onProceedClicked()"
        >
          {{ controller.proceedLabel }}
        </button>
      </template>
    </Popup>
  </div>
</template>

<script lang="ts" setup>
  import Popup from "./Popup.vue"
  import { SendPaymentNoticeController } from "~/scripts/components/popups/SendPaymentNoticeController"
  import type { IPropsSendPaymentNotice } from "~/scripts/props/PropsSendPaymentNotice"

  const props = defineProps<IPropsSendPaymentNotice>()

  const emit = defineEmits(["proceed"])

  const popupRef = ref(null)

  const controller = new SendPaymentNoticeController(props, emit)

  watch(
    () => props,
    (newVal) => {
      controller.setDataFromProps(newVal)
    },
    { deep: true }
  )

  watch(
    popupRef,
    (newVal) => {
      controller.setPopupRef(newVal)
    },
    { immediate: true }
  )

  defineExpose({
    show: controller.show.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Popups/SendPaymentNotice" as *;
</style>
