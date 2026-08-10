<template>
  <div id="command-centres-deliveries">
    <div class="deliveries-title">
      <div class="deliveries-status-selection">
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
      </span>
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
          <span class="delivery-for">{{ delivery.paymentFor }}</span>
          <span class="amount">{{ delivery.amountPaid }}</span>
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
  import { DeliveriesController } from "~/scripts/components/command-centres/DeliveriesController"
  import { StringUtil } from "~/scripts/utils/String"

  const props = defineProps({})
  const emit = defineEmits([])

  const controller = new DeliveriesController(emit)
</script>

<style lang="scss">
  @use "~/assets/scss/components/CommandCentres/Deliveries" as *;
</style>
