<template>
  <div id="pricings-editor">
    <Teleport to="body">
      <div
        class="drawer drawer-pricing-editor"
        :class="{ show: controller.isShowing.value }"
        @click.self="controller.hide()"
      >
        <Transition name="slide-left-leave-right">
          <div
            class="drawer-wrapper"
            v-if="controller.isShowing.value"
          >
            <div class="drawer-title">{{ controller.heading }}</div>
            <div class="drawer-content">
              <div class="pricing-editor">
                <div class="service-name">
                  <input
                    type="text"
                    class="form-control"
                    v-model="controller.servicePricing.value.serviceName"
                  />
                </div>
                <div class="service-pricing-details">
                  <div class="service-pricing-detail">
                    <div class="label">
                      <b>Item</b>
                    </div>
                    <div class="price"><b>RM</b></div>
                  </div>
                  <div
                    class="service-pricing-detail"
                    v-for="(breakdown, index) in controller.servicePricing.value.breakdowns"
                  >
                    <div class="label">
                      <input
                        type="text"
                        class="form-control"
                        v-model="breakdown.itemName"
                        placeholder="Item Name"
                      />
                    </div>
                    <div class="price">
                      <input
                        type="number"
                        class="form-control"
                        v-model="breakdown.price"
                        @change="controller.onBreakdownPriceChanged(index)"
                      />
                    </div>
                  </div>
                  <div
                    class="service-pricing-detail"
                    v-for="(mandatory, index) in controller.servicePricing.value.mandatoryServices"
                  >
                    <div class="label">
                      <SearchableDropdown
                        :options="controller.getMandatoryPricingOptions(index)"
                        :selectedItemName="controller.getSelectedMandatoryItemName(mandatory)"
                        :placeholder="'Select One'"
                        :labelKey="'label'"
                        :valueKey="'value'"
                        :isSearchable="true"
                        @search="controller.onSeearchMandatory($event, index)"
                        @selected="controller.onMandatoryPricingSelected($event, index)"
                      />
                    </div>
                    <span
                      class="clickable remove"
                      @click="controller.removeMandatory(mandatory, index)"
                    >
                      <i class="fa-regular fa-trash-alt"></i>
                    </span>
                    <div class="price">
                      {{ NumberUtil.currency(mandatory.basePrice ?? 0) }}
                    </div>
                  </div>
                  <div class="item-detail-button">
                    <button
                      class="btn btn-submit invert"
                      @click="controller.addMandatory()"
                    >
                      Add Existing Service
                    </button>
                  </div>
                  <div class="other-requirement-title">Other Requirements (Optional)</div>
                  <div
                    class="service-pricing-detail other-requirement"
                    :class="{ 'last-child': index === controller.servicePricing.value.optionals.length - 1 }"
                    v-for="(optional, index) in controller.servicePricing.value.optionals"
                  >
                    <div class="label">
                      <SearchableDropdown
                        :options="controller.getOptionalPricingOptions(index)"
                        :selectedItemName="controller.getSelectedOptionalItemName(optional)"
                        :placeholder="'Select One'"
                        :labelKey="'label'"
                        :valueKey="'value'"
                        :isSearchable="true"
                        @search="controller.onSeearchOptional($event, index)"
                        @selected="controller.onOptionalPricingSelected($event, index)"
                      />
                    </div>
                    <span
                      class="clickable remove"
                      @click="controller.removeOptional(optional, index)"
                    >
                      <i class="fa-regular fa-trash-alt"></i>
                    </span>
                    <div class="price">
                      {{ controller.getOptionalBasePrice(optional) }}
                    </div>
                  </div>
                  <div class="item-detail-button">
                    <button
                      class="btn btn-submit invert"
                      @click="controller.addMandatory()"
                    >
                      Add Other Requirements
                    </button>
                  </div>
                  <div class="service-pricing-detail config-row">
                    <div class="label">Cosec Service Fee</div>
                    <div class="price">
                      <input
                        type="number"
                        class="form-control"
                        v-model="controller.servicePricing.value.config.cosecServiceFee"
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
                        v-model="controller.servicePricing.value.config.digitalServiceFee"
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
                        v-model="controller.servicePricing.value.config.handlingFees"
                        @change="controller.onHandlingFeesChanged()"
                      />
                    </div>
                  </div>
                  <div class="service-pricing-detail total-row">
                    <div class="label">Total</div>
                    <div class="price">
                      {{ controller.pricingTotal }}
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
                    @click="controller.onSubmitClicked()"
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
  import SearchableDropdown from "../Forms/SearchableDropdown.vue"
  import { EditorController } from "~/scripts/components/pricings/EditorController"
  import { ServicePricing } from "~/scripts/models/ServicePricing"
  import type { IPropsServicePricingEditor } from "~/scripts/props/PropsServicePricingEditor"
  import { NumberUtil } from "~/scripts/utils/Number"

  const props = defineProps<IPropsServicePricingEditor>()

  const emit = defineEmits(["updated"])

  const controller = new EditorController(props.servicePricing, emit)

  watch(
    () => props.servicePricing,
    (newVal) => {
      controller.setServicePricing(newVal)
    },
    { deep: true }
  )

  defineExpose({
    show: controller.show.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Pricings/Editor" as *;
</style>
