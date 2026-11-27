<template>
  <div id="popups-send-payment-notice">
    <Teleport to="body">
      <div
        class="drawer drawer-payment-notice"
        :class="{ show: controller.isShowDrawer.value }"
        @click.self="controller.hide()"
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
                <div class="payment-order-wrapper">
                  <div class="payment-order-details-wrapper">
                    <div
                      class="payment-order-details"
                      v-for="(pricing, i) in controller.selectedPricings.value"
                    >
                      <div class="service-pricing">
                        <span class="number"># {{ i + 1 }}</span>
                        <SearchableDropdown
                          v-if="!controller.isEditingPricing(i)"
                          :options="controller.pricingOptions"
                          :selectedItemName="controller.getSelectedPricingName(pricing)"
                          :placeholder="'Select One'"
                          :labelKey="'label'"
                          :valueKey="'value'"
                          :isSearchable="true"
                          @search="controller.onSearchPrice($event)"
                          @selected="controller.onSelectedPricingId($event, i)"
                        />
                        <input
                          v-if="controller.isEditingPricing(i)"
                          type="text"
                          class="form-control"
                          v-model="controller.newServicePricing.value.serviceName"
                          placeholder="Name"
                        />
                        <div class="action-icons">
                          <div
                            class="clickable edit"
                            v-if="!controller.isEditingPricing(i) && controller.indexOfPricingInEdit.value === null"
                            @click="controller.onEditSelectedPricingClicked(i)"
                          >
                            <i class="fa-regular fa-edit" />
                          </div>
                          <div
                            class="clickable cancel"
                            v-if="controller.isEditingPricing(i)"
                            @click="controller.onCancelEditClicked(i)"
                          >
                            <i class="fa-regular fa-xmark" />
                          </div>
                          <div
                            class="clickable save"
                            v-if="controller.isEditingPricing(i)"
                            @click="controller.onSaveEditClicked(i)"
                          >
                            <i class="fa-regular fa-check" />
                          </div>
                          <div
                            class="clickable remove"
                            v-if="!controller.isEditingPricing(i) && controller.canRemove"
                            @click="controller.onRemovePricing(i)"
                          >
                            <i class="fa-regular fa-trash-alt" />
                          </div>
                        </div>
                      </div>
                      <div class="service-pricing-details">
                        <div class="service-pricing-detail">
                          <div class="label">
                            <b>Item</b>
                          </div>
                          <div class="price"><b>RM</b></div>
                        </div>
                        <template v-if="!controller.isEditingPricing(i)">
                          <div
                            class="service-pricing-detail"
                            v-for="(breakdown, index) in controller.getSelectedBreakdowns(pricing)"
                          >
                            <div class="label">
                              <span>{{ breakdown.itemName }}</span>
                            </div>
                            <div class="price">{{ NumberUtil.currency(breakdown.price) }}</div>
                          </div>
                          <div
                            class="service-pricing-detail"
                            v-for="(mandatory, index) in controller.getSelectedMandatories(pricing)"
                          >
                            <div class="label">
                              <span>{{ mandatory.mandatoryServicePrice.serviceName }}</span>
                            </div>
                            <div class="price">{{ NumberUtil.currency(mandatory.basePrice ?? 0) }}</div>
                          </div>
                          <div class="service-pricing-detail config-row">
                            <div class="label">Cosec Service Fee</div>
                            <div class="price">
                              {{ NumberUtil.currency(pricing.config.cosecServiceFee) }}
                            </div>
                          </div>
                          <div class="service-pricing-detail config-row">
                            <div class="label">Digital Service Fee</div>
                            <div class="price">
                              {{ NumberUtil.currency(pricing.config.digitalServiceFee) }}
                            </div>
                          </div>
                          <div class="service-pricing-detail config-row">
                            <div class="label">Handling Fees</div>
                            <div class="price">
                              {{ NumberUtil.currency(pricing.config.handlingFees) }}
                            </div>
                          </div>
                        </template>
                        <template v-if="controller.isEditingPricing(i)">
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
                              Add Custom Items
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
                              Add Mandatory Requirements
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
                          <div class="label">Subtotal</div>
                          <div class="price">
                            {{ controller.getSubtotal(pricing) }}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="add-more-button">
                      <button
                        class="btn btn-primary"
                        @click="controller.onAddPricing()"
                      >
                        Add More
                      </button>
                    </div>
                  </div>
                  <div class="payment-order-footer">
                    <div class="grand-discount-row">
                      <div class="label">Discount</div>
                      <div class="price">
                        <input
                          type="number"
                          class="form-control"
                          v-model="controller.discountAmount.value"
                          placeholder="Discount Amount"
                        />
                      </div>
                    </div>
                    <div class="grand-total-row">
                      <div class="label">Grand Total</div>
                      <div class="price">
                        {{ controller.grandTotal }}
                      </div>
                    </div>
                    <div class="form-check">
                      <input
                        type="checkbox"
                        class="form-check-input"
                        v-model="controller.isNotify.value"
                        :disabled="!controller.canNotify"
                        :title="controller.canNotify ? 'Tiada Penerima ' : 'No Recipient to send Email to'"
                      />
                      <span>Notify via Email</span>
                    </div>
                  </div>
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
