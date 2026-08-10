<template>
  <div id="command-centres-deliveries">
    <div class="deliveries-title">
      <!-- <div class="deliveries-status-selection">
        <i
          class="fa-solid fa-circle-sort"
          @click="controller.onPeriodSelectionClicked()"
        ></i>
        <div
          class="deliveries-status-options"
          :class="{ show: controller.isShowPeriodOptions.value }"
        >
          <div
            class="deliveries-status-option"
            @click="controller.onPeriodSelected(status)"
            v-for="(status, index) in controller.periodOptions"
            :key="index"
          >
            {{ StringUtil.capitalize(status) }}
          </div>
        </div>
      </div>
      <span class="deliveries-status">
        {{ StringUtil.capitalize(controller.selectedPeriod.value) }}
      </span> -->
      <span class="deliveries-name">
        {{ controller.title }}
      </span>
    </div>
    <div class="deliveries-details">
      <div
        class="delivery-detail"
        v-for="(delivery, index) in controller.deliveriesOnPage"
        :key="index"
      >
        <div class="payee">{{ delivery.name }}</div>
        <div class="delivery-for-amount">
          <span class="delivery-info">
            {{ delivery.paymentFor }}
            <br />
            Paid at: {{ controller.formatPaidAt(delivery) }}
            <br />
            Delivery By: {{ controller.deliveryMethod(delivery) }}
            <div
              class="deliver-to"
              v-if="controller.hasDeliveryAddress(delivery)"
              v-html="controller.deliveryTo(delivery)"
            />
            <span v-if="delivery.mandatoryItems.length > 0 || delivery.additionalItems.length > 0">Items:</span>
            <ul>
              <li v-for="(mandatory, i) in delivery.mandatoryItems">
                {{ mandatory }}
              </li>
              <li v-for="(additional, i) in delivery.additionalItems">
                {{ additional }}
              </li>
            </ul>
          </span>
          <span class="amount">RM {{ delivery.amountPaid }}</span>
        </div>
      </div>
    </div>
    <TablePagination
      v-bind="controller.tablePaginationProps"
      @goToPage="controller.goToPage($event)"
    />
  </div>
</template>

<script lang="ts" setup>
  import TablePagination from "@/components/Paginations/TablePagination.vue"
  import { de } from "zod/v4/locales"
  import { DeliveriesController } from "~/scripts/components/command-centres/DeliveriesController"
  import { StringUtil } from "~/scripts/utils/String"

  const props = defineProps({})
  const emit = defineEmits([])

  const controller = new DeliveriesController(emit)
</script>

<style lang="scss">
  @use "~/assets/scss/components/CommandCentres/Deliveries" as *;
</style>
