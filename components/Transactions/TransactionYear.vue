<template>
  <div id="transaction-year">
    <div class="year-title">
      {{ controller.year.value }}
    </div>
    <div class="transaction-table">
      <table class="default-table">
        <thead>
          <tr>
            <th
              class="checkbox-marker clickable"
              v-keyboard-click
              @click="controller.onToggleSelectAll()"
            >
              <i :class="controller.getCheckboxClass()" />
            </th>
            <th
              class="clickable"
              v-keyboard-click
              @click="controller.onToggleSort(TransactionConstants.LABEL_REF_NO)"
            >
              {{ controller.referenceNumberLabel() }}
              <i
                v-if="controller.sortBy.value === TransactionConstants.LABEL_REF_NO"
                :class="controller.getArrowClass()"
              />
            </th>
            <th
              class="clickable"
              v-keyboard-click
              @click="controller.onToggleSort(TransactionConstants.LABEL_PAY_FOR)"
            >
              {{ controller.productOrServiceDescriptionLabel() }}
              <i
                v-if="controller.sortBy.value === TransactionConstants.LABEL_PAY_FOR"
                :class="controller.getArrowClass()"
              />
            </th>
            <th
              class="clickable"
              v-keyboard-click
              @click="controller.onToggleSort(TransactionConstants.LABEL_NAME)"
            >
              {{ controller.nameOfCompanyOrApplicantLabel() }}
              <i
                v-if="controller.sortBy.value === TransactionConstants.LABEL_NAME"
                :class="controller.getArrowClass()"
              />
            </th>
            <th
              class="clickable"
              v-keyboard-click
              @click="controller.onToggleSort(TransactionConstants.LABEL_PAY_DATE)"
            >
              {{ controller.paymentDateLabel() }}
              <i
                v-if="controller.sortBy.value === TransactionConstants.LABEL_PAY_DATE"
                :class="controller.getArrowClass()"
              />
            </th>
          </tr>
        </thead>
        <tbody v-if="controller.isNoSearchResultVisible() && !controller.isHidden.value">
          <tr class="alert-row no-record-alert-row">
            <td
              colspan="5"
              class="alert"
            >
              <div
                class="alert-heading"
                v-html="controller.getNoSearchResultAlert()"
              />
              <div
                class="alert-subheading"
                v-html="controller.getNoSearchResultSubalert()"
              />
            </td>
          </tr>
        </tbody>
        <tbody v-if="!controller.isHidden.value">
          <template
            v-for="(transaction, index) in controller.transactions.value"
            :key="index"
          >
            <Transaction
              :transaction="transaction"
              @selected="emit('selected')"
            />
          </template>
        </tbody>
        <tbody v-if="controller.isHidden.value">
          <tr class="alert-row">
            <td
              colspan="5"
              class="alert"
            >
              <div class="alert-heading">
                {{ controller.archivedDataAlert() }}
              </div>
              <div class="alert-subheading">
                {{ controller.archivedDataSubalert() }}
              </div>
              <div class="action-buttons">
                <button
                  class="btn btn-standard btn-submit"
                  v-keyboard-click
                  @click="controller.onGetAccessClicked()"
                >
                  {{ controller.archivedDataButtonLabel() }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <ReceiptInvoice
      ref="receiptRef"
      :payment-order="controller.paymentOrderForReceipt.value"
      :payment-order-id="controller.paymentOrderIdForReceipt.value ?? ''"
      @downloaded="controller.onReceiptDownloaded()"
    />
  </div>
</template>

<script setup lang="ts">
  import Transaction from "./Transaction.vue"
  import ReceiptInvoice from "@/components/Payments/ReceiptInvoice.vue"
  import { TransactionConstants } from "~/scripts/constants/Transactions"
  import { TransactionYearController } from "~/scripts/components/transactions/TransactionYearController"
  import { TransactionHistory } from "~/scripts/models/TransactionHistory"

  const props = defineProps({
    year: {
      type: Number,
      required: true,
    },
    transactionHistories: {
      type: Array<TransactionHistory>,
      required: true,
    },
    sortBy: {
      type: String,
      required: true,
    },
    orderBy: {
      type: String,
      required: true,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
    isYearEmpty: {
      type: Boolean,
      default: false,
    },
  })

  const receiptRef = ref(null)
  const cartRef = ref(null)

  const emit = defineEmits(["makePayment", "sort", "selected"])

  const controller = new TransactionYearController(
    props.year,
    props.transactionHistories,
    props.isHidden,
    props.isYearEmpty,
    props.sortBy,
    props.orderBy,
    emit
  )

  watch(
    () => props.year,
    (newVal) => {
      controller.setYear(newVal)
    }
  )

  watch(
    () => props.transactionHistories,
    (newVal) => {
      controller.setTransactionHistories(newVal)
    },
    { deep: true }
  )

  watch(
    () => props.isHidden,
    (newVal) => {
      controller.setIsHidden(newVal)
    }
  )

  watch(
    () => props.isYearEmpty,
    (newVal) => {
      controller.setIsYearEmpty(newVal)
    }
  )

  watch(
    () => props.sortBy,
    (newVal) => {
      controller.setSortBy(newVal)
    }
  )

  watch(
    () => props.orderBy,
    (newVal) => {
      controller.setOrderBy(newVal)
    }
  )

  watch(
    receiptRef,
    (newVal) => {
      if (newVal) {
        controller.setReceiptRef(newVal)
      }
    },
    { immediate: true }
  )

  watch(
    cartRef,
    (newVal) => {
      if (newVal) {
        controller.setCartRef(newVal)
      }
    },
    { immediate: true }
  )

  defineExpose({
    getSelectedTransactionHistories: controller.getSelectedTransactionHistories.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Transactions/TransactionYear" as *;
</style>
