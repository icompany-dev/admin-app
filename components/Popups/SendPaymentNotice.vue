<template>
  <div id="popups-send-payment-notice">
    <Teleport to="body">
      <div
        class="drawer drawer-payment-notice"
        :class="{ show: controller.isShowDrawer.value }"
      >
        <Transition name="slide-left-leave-right">
          <div
            class="drawer-wrapper"
            v-if="controller.isShowDrawer.value"
          >
            <div class="drawer-title">{{ controller.heading }}</div>
            <div class="drawer-content">
              <div class="payment-order">
                <div class="payment-order-title">
                  <div class="title">Payment Order</div>
                  <div class="subtitle">for {{ controller.entityName.value }}</div>
                </div>
                <div class="payment-order-details">
                  <div class="service-pricing">
                    <Transition name="fade">
                      <SearchableDropdown
                        v-if="!controller.isCustomPricing.value"
                        :options="controller.pricingOptions"
                        :selectedItemName="controller.selectedPricingName"
                        :placeholder="'Select One'"
                        :labelKey="'label'"
                        :valueKey="'value'"
                        :isSearchable="true"
                        @search="controller.onSearchPrice($event)"
                        @selected="controller.onServicePricingSelected($event)"
                      />
                    </Transition>
                    <Transition name="fade">
                      <input
                        v-if="controller.isCustomPricing.value"
                        type="text"
                        class="form-control"
                        v-model="controller.newServicePricing.value.serviceName"
                        placeholder="Name"
                      />
                    </Transition>
                    <div class="form-check">
                      <input
                        type="checkbox"
                        class="form-check-input"
                        v-model="controller.isCustomPricing.value"
                        @change="controller.onSetCustomPricingChanged()"
                      />
                      <span>Set Custom Pricing</span>
                    </div>
                  </div>
                  <div class="service-pricing-details">
                    <div class="service-pricing-detail">
                      <div class="label">
                        <b>Item</b>
                      </div>
                      <div class="price"><b>RM</b></div>
                    </div>
                    <template v-if="!controller.isCustomPricing.value">
                      <div
                        class="service-pricing-detail"
                        v-for="(breakdown, index) in controller.selectedServicePricingBreakdowns"
                      >
                        <div class="label">
                          <span>{{ breakdown.itemName }}</span>
                        </div>
                        <div class="price">{{ NumberUtil.currency(breakdown.price) }}</div>
                      </div>
                      <div
                        class="service-pricing-detail"
                        v-for="(mandatory, index) in controller.selectedServicePricingMandatories"
                      >
                        <div class="label">
                          <span>{{ mandatory.mandatoryServicePrice.serviceName }}</span>
                        </div>
                        <div class="price">{{ NumberUtil.currency(mandatory.basePrice ?? 0) }}</div>
                      </div>
                      <div class="service-pricing-detail config-row">
                        <div class="label">Cosec Service Fee</div>
                        <div class="price">
                          {{ NumberUtil.currency(controller.selectedServicePricing.value.config.cosecServiceFee) }}
                        </div>
                      </div>
                      <div class="service-pricing-detail config-row">
                        <div class="label">Digital Service Fee</div>
                        <div class="price">
                          {{ NumberUtil.currency(controller.selectedServicePricing.value.config.digitalServiceFee) }}
                        </div>
                      </div>
                      <div class="service-pricing-detail config-row">
                        <div class="label">Handling Fees</div>
                        <div class="price">
                          {{ NumberUtil.currency(controller.selectedServicePricing.value.config.handlingFees) }}
                        </div>
                      </div>
                    </template>
                    <template v-if="controller.isCustomPricing.value">
                      <div
                        class="service-pricing-detail"
                        v-for="(breakdown, index) in controller.newServicePricing.value.breakdowns"
                      >
                        <div class="label">
                          <input
                            type="text"
                            class="form-control"
                            v-model="breakdown.itemName"
                            placeholder="Item Name"
                          />
                        </div>
                        <span
                          class="clickable remove"
                          @click="controller.onRemoveBreakdown(index)"
                        >
                          <i
                            class="fa-regular fa-trash-alt"
                            v-if="index > 0"
                          ></i>
                        </span>
                        <div class="price">
                          <input
                            type="number"
                            class="form-control"
                            v-model="breakdown.price"
                            @change="controller.onPriceChange(breakdown.price)"
                          />
                        </div>
                      </div>
                      <div class="item-detail-button">
                        <button
                          class="btn btn-submit invert"
                          @click="controller.onAddBreakdown()"
                        >
                          Add Items
                        </button>
                      </div>
                      <div class="divider"></div>
                      <div
                        class="service-pricing-detail"
                        v-for="(mandatory, index) in controller.newServicePricing.value.mandatoryServices"
                      >
                        <div class="label">
                          <SearchableDropdown
                            :options="controller.getMandatoryPricingOptions(index)"
                            :selectedItemName="controller.getMandatoryPricingName(index)"
                            :placeholder="'Select One'"
                            :labelKey="'label'"
                            :valueKey="'value'"
                            :isSearchable="true"
                            @search="controller.onSearchMandatory($event, index)"
                            @selected="controller.onMandatoryPricingSelected($event, index)"
                          />
                        </div>
                        <span
                          class="clickable remove"
                          @click="controller.onRemoveMandatory(index)"
                        >
                          <i class="fa-regular fa-trash-alt"></i>
                        </span>
                        <div class="price">
                          <input
                            type="number"
                            class="form-control"
                            v-model="mandatory.basePrice"
                            @change="controller.onPriceChange(mandatory.basePrice ?? 0)"
                          />
                        </div>
                      </div>
                      <div class="item-detail-button">
                        <button
                          class="btn btn-submit invert"
                          @click="controller.onAddMandatory()"
                        >
                          Add Existing Service
                        </button>
                      </div>
                      <div class="service-pricing-detail config-row">
                        <div class="label">Cosec Service Fee</div>
                        <div class="price">
                          <input
                            type="number"
                            class="form-control"
                            v-model="controller.newServicePricing.value.config.cosecServiceFee"
                            @change="controller.onCosecServiceFeeChanged()"
                          />
                        </div>
                      </div>
                      <div class="service-pricing-detail config-row">
                        <div class="label">Digital Service Fee</div>
                        <div class="price">
                          <input
                            type="number"
                            class="form-control"
                            v-model="controller.newServicePricing.value.config.digitalServiceFee"
                            @change="controller.onDigitalServiceFeeChanged()"
                          />
                        </div>
                      </div>
                      <div class="service-pricing-detail config-row">
                        <div class="label">Handling Fees</div>
                        <div class="price">
                          <input
                            type="number"
                            class="form-control"
                            v-model="controller.newServicePricing.value.config.handlingFees"
                            @change="controller.onHandlingFeesChanged()"
                          />
                        </div>
                      </div>
                    </template>
                    <div class="service-pricing-detail total-row">
                      <div class="label">Total</div>
                      <div class="price">
                        {{ controller.paymentOrderTotal }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-check">
                  <input
                    type="checkbox"
                    class="form-check-input"
                    v-model="controller.isNotify.value"
                  />
                  <span>Notify via Email and WhatsApp</span>
                </div>
              </div>
              <div class="drawer-footer">
                <div class="cta">
                  {{ controller.cta }}
                </div>
                <div class="action-buttons">
                  <button
                    class="btn btn-danger"
                    @click="controller.onCancelClicked()"
                  >
                    {{ controller.cancelLabel }}
                  </button>
                  <button
                    class="btn btn-submit"
                    :class="{ 'is-loading': controller.isSubmitting.value }"
                    :disabled="!controller.canProceed"
                    @click="controller.onProceedClicked()"
                  >
                    {{ controller.proceedLabel }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
  import Popup from "./Popup.vue"
  import SearchableDropdown from "../Forms/SearchableDropdown.vue"
  import { SendPaymentNoticeController } from "~/scripts/components/popups/SendPaymentNoticeController"
  import type { IPropsSendPaymentNotice } from "~/scripts/props/PropsSendPaymentNotice"
  import { NumberUtil } from "~/scripts/utils/Number"

  const props = defineProps<IPropsSendPaymentNotice>()

  const emit = defineEmits(["proceed"])

  const popupRef = ref(null)

  const controller = new SendPaymentNoticeController(props, emit)

  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      controller.hide()
    }
  }

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

  watch(
    () => controller.isShowDrawer.value,
    (isVisible) => {
      if (isVisible) {
        window.addEventListener("keyup", handleKeyUp)
      } else {
        window.removeEventListener("keyup", handleKeyUp)
      }
    }
  )

  onUnmounted(() => {
    window.removeEventListener("keyup", handleKeyUp)
  })

  defineExpose({
    show: controller.show.bind(controller),
    hide: controller.hide.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Popups/SendPaymentNotice" as *;
</style>
