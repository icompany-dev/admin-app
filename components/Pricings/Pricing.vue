<template>
  <div id="pricings-pricing">
    <div
      class="service-name"
      v-if="props.isShowServiceName"
    >
      {{ controller.servicePricing.value.serviceName }}
    </div>
    <div class="service-pricing-details">
      <div
        class="service-price-details"
        v-if="controller.hasBreakdowns"
      >
        <div
          class="service-price-detail"
          v-if="props.isShowServiceName"
        >
          <div class="item"></div>
          <div class="price"><b>RM</b></div>
        </div>
        <div
          class="service-price-detail"
          v-for="(detail, index) in controller.pricingDetails"
        >
          <div class="item">{{ detail.name }}</div>
          <div class="price">{{ detail.formattedPrice }}</div>
        </div>
        <div
          class="optional-title"
          v-if="controller.hasOptionals"
        >
          <b>Other Requirements / Optionals</b>
        </div>
        <div
          class="service-price-detail optional"
          v-for="(detail, index) in controller.pricingOptionalDetails"
        >
          <div class="item">{{ detail.name }}</div>
          <div class="price">{{ detail.formattedPrice }}</div>
        </div>
        <div
          class="service-price-configuration"
          v-for="(detail, index) in controller.configurationDetails"
          :class="{ first: index === 0 && controller.pricingDetails.length > 0 }"
        >
          <div class="item">{{ detail.name }}</div>
          <div class="price">{{ detail.formattedPrice }}</div>
        </div>
        <!-- <div class="service-price-total">
          <div class="item">TOTAL</div>
          <div class="price">{{ controller.grandTotal }}</div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { PricingController } from "~/scripts/components/pricings/PricingController"
  import type { IPropsPricing } from "~/scripts/props/PropsPricing"

  const props = defineProps<IPropsPricing>()

  const emit = defineEmits([])

  const controller = new PricingController(props, emit)

  watch(
    () => props,
    (newVal) => {
      controller.setDataFromProps(newVal)
    },
    { deep: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Pricings/Pricing" as *;
</style>
