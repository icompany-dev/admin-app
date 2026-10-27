<template>
  <div id="command-centres-deliveries">
    <div class="deliveries-title">
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
          {{ delivery.paymentFor }}
          <span class="amount">RM {{ delivery.amountPaid }}</span>
        </div>
        <div class="delivery-info">
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
        </div>
      </div>
    </div>
    <TablePagination
      v-if="controller.filter.value.totalPages > 1"
      v-bind="controller.tablePaginationProps"
      @goToPage="controller.goToPage($event)"
    />
  </div>
</template>

<script lang="ts" setup>
  import TablePagination from "@/components/Paginations/TablePagination.vue"
  import { DeliveriesController } from "~/scripts/components/command-centres/DeliveriesController"

  const props = defineProps({})
  const emit = defineEmits([])

  const controller = new DeliveriesController(emit)
</script>

<style lang="scss">
  @use "~/assets/scss/components/CommandCentres/Deliveries" as *;
</style>
