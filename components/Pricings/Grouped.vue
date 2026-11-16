<template>
  <div id="pricings-grouped">
    <Teleport to="body">
      <div
        class="drawer drawer-pricings-grouped"
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
              <div class="grouped-pricing">
                <div class="label-name">
                  <input
                    type="text"
                    class="form-control"
                    v-model="controller.label.value.name"
                  />
                </div>
                <div class="group-items">
                  <div class="group-item">
                    <div class="remove"></div>
                    <div class="name"><b>Items</b></div>
                    <div class="price"><b>RM</b></div>
                  </div>
                  <div
                    class="group-item"
                    v-for="(labelItem, x) in controller.existingLabelItems.value"
                  >
                    <div class="remove">
                      <span
                        class="clickable"
                        @click="controller.onRemoveLabelItem(labelItem)"
                      >
                        <i class="fa-regular fa-trash-alt" />
                      </span>
                    </div>
                    <div class="name">
                      <Pricing
                        :service-pricing="controller.getServicePricing(labelItem)"
                        :is-show-service-name="true"
                      />
                    </div>
                    <div class="price">
                      {{ controller.getServicePricingPrice(labelItem) }}
                    </div>
                  </div>
                  <template v-for="(newLabelItem, i) in controller.labelItems.value">
                    <div class="group-item">
                      <div class="remove">
                        <span
                          class="clickable"
                          @click="controller.onRemoveFromAddToTheme(i)"
                        >
                          <i class="fa-regular fa-trash-alt" />
                        </span>
                      </div>
                      <div class="name">
                        <SearchableDropdown
                          :options="controller.getPricingOptions(i)"
                          :selected-item-name="controller.getSelectedServicePricingName(i)"
                          :label-key="'label'"
                          :value-key="'value'"
                          @selected="controller.onSelectedPricingId($event, i)"
                          @search="controller.onSearch($event, i)"
                        />

                        <template v-if="controller.getSelectedPricingFor(i)">
                          <Pricing v-bind="controller.getPropsPricingFor(i)" />
                        </template>
                      </div>
                      <div class="price">
                        {{ controller.getSelectedServicePricingPrice(i) }}
                      </div>
                    </div>
                  </template>
                </div>
                <div class="add-items">
                  <button
                    class="btn btn-submit invert"
                    @click="controller.onAddPricingClicked()"
                  >
                    + Add Item
                  </button>
                  <button
                    class="btn btn-submit invert"
                    @click="controller.onAddNew()"
                  >
                    Create New Pricing
                  </button>
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
                    :class="{ 'is-loading': controller.isSubmittingNewItemsToLabel.value }"
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
    <ConfirmToDelete
      ref="confirmToDeleteRef"
      :remove-item-name="controller.itemRemoveName"
      @proceed="controller.onProceedToRemoveLabelItem()"
    />
  </div>
</template>

<script lang="ts" setup>
  import ConfirmToDelete from "../Popups/ConfirmToDelete.vue"
  import Pricing from "./Pricing.vue"
  import SearchableDropdown from "../Forms/SearchableDropdown.vue"
  import { GroupedController } from "~/scripts/components/pricings/GroupedController"
  import type { IPropsGroupedServicePricing } from "~/scripts/props/PropsGroupedServicePricing"

  const props = defineProps<IPropsGroupedServicePricing>()

  const emit = defineEmits(["add-pricing", "hide", "labelUpdated"])

  const confirmToDeleteRef = ref(null)

  const controller = new GroupedController(props, emit)

  watch(
    () => props,
    (newVal) => {
      controller.setDataFromProps(newVal)
    },
    { deep: true }
  )

  watch(
    confirmToDeleteRef,
    (newVal) => {
      controller.setConfirmToDeleteRef(newVal)
    },
    { immediate: true }
  )

  defineExpose({
    show: controller.show.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Pricings/Grouped" as *;
</style>
