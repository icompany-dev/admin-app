<template>
  <div id="popups-send-payment-notice">
    <Popup
      ref="popupRef"
      v-bind="controller.popupProps"
    >
      <template #content>
        <div
          class="action"
          v-html="controller.content"
        />
        <br />
        <div class="form-group">
          <SearchableDropdown
            :options="controller.pricingOptions"
            :selectedItemName="controller.selectedPricingName"
            :placeholder="'Select One'"
            :labelKey="'label'"
            :valueKey="'value'"
            :isSearchable="true"
            @search="controller.onSearchPrice($event)"
            @selected="controller.onServicePricingSelected($event)"
          />
        </div>
        <div class="form-check">
          <input
            type="checkbox"
            class="form-check-input"
            v-model="controller.isNotify.value"
          />
          <label>Notify via email and WhatsApp</label>
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
  import SearchableDropdown from "../Forms/SearchableDropdown.vue"
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
