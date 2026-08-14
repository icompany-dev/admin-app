<template>
  <div id="payment-receipt-invoice">
    <Paper
      v-if="controller.isLoading.value"
      :is-loader="true"
      :paper-orientation="controller.paperOrientation"
    >
      <LoaderPrepare
        :label="controller.loaderLabel"
        :sublabel="controller.loaderSublabel"
      />
    </Paper>
    <div
      ref="documentRef"
      v-if="!controller.isLoading.value"
    >
      <Paper
        v-for="page in controller.pageRange.value"
        :key="page"
        :additionalCssClass="controller.additionalCssClass"
        :paperOrientation="controller.paperOrientation"
      >
        <template #paperContent>
          <div class="header-content">
            <div class="header">
              <div class="logo">
                <img
                  :src="controller.logoBase64.value"
                  crossOrigin="anonymous"
                  alt="Logo"
                />
              </div>
              <div class="document-name">
                {{ controller.receiptInvoiceTitle() }}
              </div>
            </div>
            <div
              v-if="page === 1"
              class="bill-to-details"
            >
              <div class="billing-details">
                <b>Bill to:</b>
                <div class="billing-name">
                  {{ controller.paymentOrder.value.billingInfo.name }}
                </div>
                <div
                  class="billing-address"
                  v-html="controller.paymentOrder.value.billingInfo.getAddressString()"
                />
                <table class="attention-to">
                  <tbody>
                    <tr>
                      <td>ATTN</td>
                      <td>:</td>
                      <td>{{ controller.payeeName.value }}</td>
                    </tr>
                    <tr>
                      <td>EMAIL</td>
                      <td>:</td>
                      <td>{{ controller.paymentOrder.value.billingInfo.email }}</td>
                    </tr>
                    <tr>
                      <td>PHONE</td>
                      <td>:</td>
                      <td>{{ controller.paymentOrder.value.billingInfo.phone }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="payment-details">
                <table class="payment-table">
                  <tbody>
                    <tr>
                      <td>Ref No</td>
                      <td>:</td>
                      <td>{{ controller.paymentOrder.value.referenceNumber }}</td>
                    </tr>
                    <tr>
                      <td>Date Paid</td>
                      <td>:</td>
                      <td>{{ controller.datePaid() }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="transaction-list">
              <div
                v-if="page > 1"
                class="continue-note"
              >
                (Continue from previous page)
              </div>
              <table class="transaction-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th class="quantity">Quantity</th>
                    <th class="price">Price (RM)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(row, index) in controller.getRowsOnPage(page)"
                    :class="row.rowClass"
                    :key="`row-${index}`"
                  >
                    <td
                      :class="row.item.cssClass"
                      :colspan="row.item.colspan"
                      v-if="row.item.showColumn"
                    >
                      <div v-html="row.item.value" />
                    </td>
                    <td
                      :class="row.quantity.cssClass"
                      :colspan="row.quantity.colspan"
                      v-if="row.quantity.showColumn"
                    >
                      {{ row.quantity.value }}
                    </td>
                    <td
                      :class="row.price.cssClass"
                      :colspan="row.price.colspan"
                      v-if="row.price.showColumn"
                    >
                      {{ row.price.value }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="receipt-footer">
            <div
              class="disclaimer"
              v-html="controller.footerDisclaimer()"
            />
            <div class="purple-container">
              <div class="left-content">
                © 2025 iCompany All rights reserved
                <br />
                All copyrights and trademarks
                <br />
                of iCompany belongs to
                <br />
                Cosec Tech Solutions Sdn Bhd
                <br />
                Company No: 202301032770 (1526693-W)
                <br />
                <br />
                For enquiries, email: accounts@icompany.my or contact: +603 33100896 D-1-6, Block D Sekitar26 Enterprise
                40400 Shah Alam
              </div>
              <div class="qr-code">
                <img
                  src="https://icompany-public.s3.ap-southeast-1.amazonaws.com/public/logo/icompany_qr_official.png"
                  crossOrigin="anonymous"
                  alt="Qr"
                />
                <div class="notes">iCompany Malaysia</div>
              </div>
            </div>
          </div>
        </template>
      </Paper>
    </div>
    <!-- <div
      class="paper-wrapper"
      ref="documentRef"
    >
      <div
        class="print paper receipt-paper"
        v-for="page in controller.pageRange.value"
        :key="page"
      >
        
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
  import Paper from "../Papers/Paper.vue"
  import { PaymentOrder } from "~/scripts/models/PaymentOrder"
  import { ReceiptInvoiceController } from "~/scripts/components/payments/ReceiptInvoiceController"

  const props = defineProps({
    paymentOrderId: {
      type: String,
      default: null,
    },
    paymentOrder: {
      type: PaymentOrder,
      default: null,
    },
  })

  const documentRef = ref(null)

  const emit = defineEmits(["downloaded"])

  const controller = new ReceiptInvoiceController(props.paymentOrderId, props.paymentOrder, emit)

  watch(
    () => props.paymentOrderId,
    (newVal) => {
      if (!newVal) {
        return
      }

      controller.setPaymentOrderId(newVal)
    }
  )

  watch(
    () => props.paymentOrder,
    (newVal) => {
      controller.setPaymentOrder(newVal)
    },
    { deep: true }
  )

  watch(
    documentRef,
    (newVal) => {
      controller.setDocumentRef(newVal)
    },
    { immediate: true }
  )

  defineExpose({
    downloadReceipt: controller.downloadReceipt.bind(controller),
    payeeName: controller.payeeName,
    getDocumentRef: controller.getDocumentRef.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Payments/ReceiptInvoice" as *;
</style>
