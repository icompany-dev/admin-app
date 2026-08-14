<template>
  <div id="command-centres-payments-received">
    <div class="payments-title">
      <div class="payments-status-selection">
        <i
          class="fa-solid fa-circle-sort"
          @click="controller.onPeriodSelectionClicked()"
        ></i>
        <div
          class="payments-status-options"
          :class="{ show: controller.isShowPeriodOptions.value }"
        >
          <div
            class="payments-status-option"
            @click="controller.onPeriodSelected(status)"
            v-for="(status, index) in controller.periodOptions"
            :key="index"
          >
            {{ StringUtil.capitalize(status) }}
          </div>
        </div>
      </div>
      <span class="payments-status">
        {{ StringUtil.capitalize(controller.selectedPeriod.value) }}
      </span>
      <span class="payments-name">
        {{ controller.title }}
      </span>
    </div>
    <div class="payments-details">
      <div
        class="payment-detail"
        v-for="(payment, index) in controller.paymentsOnPage"
        :key="index"
      >
        <div class="payee">{{ payment.payee }}</div>
        <div class="payment-for-amount">
          <span class="payment-for">{{ payment.paymentFor }}</span>
          <span class="amount">{{ payment.amount }}</span>
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
  import { PaymentsReceivedController } from "~/scripts/components/command-centres/PaymentsReceivedController"
  import { StringUtil } from "~/scripts/utils/String"

  const props = defineProps({})
  const emit = defineEmits([])

  const controller = new PaymentsReceivedController(emit)
</script>

<style lang="scss">
  @use "~/assets/scss/components/CommandCentres/PaymentsReceived" as *;
</style>
