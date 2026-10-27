<template>
  <div id="services-bank-account-opening">
    <ServiceApplication
      ref="serviceApplicationRef"
      v-bind="controller.serviceApplicationProps"
      @paymentNodeSelected="controller.onPaymentStepClicked()"
      @show="controller.onShowPanel()"
      @hide="emit('hide')"
      @download="emit('download', $event)"
    >
      <template #application>
        <ApplicationNode
          v-bind="controller.applicationDetailsNodeProps"
          @click="controller.onApplicationDetailsClicked()"
        >
          <template #nodeContent>
            <div class="application-container">
              <div class="node-title">
                {{ controller.applicationDetailsLabel }}
              </div>
              <div class="node-subtitle">
                {{ controller.applicationDetailsSublabel }}
              </div>
            </div>
            <div class="application-details">
              <b>{{ controller.bankLabel }}</b>
              : {{ controller.bankName }}
              <br />
              <b>{{ controller.branchLabel }}</b>
              :
              {{ controller.branchName }}
              <br />
              {{ controller.branchAddress }}
              <br />
              <br />
              <b>{{ controller.itemsToPrepareLabel }}</b>
              <ol>
                <li
                  v-for="(item, i) in controller.itemsToPrepare"
                  :key="i"
                >
                  {{ item }}
                </li>
              </ol>
              <b>{{ controller.deliverToLabel }}</b>
              <br />
              <div v-if="!controller.isDeliveryRequired">
                {{ controller.noDeliveryRequired }}
              </div>
              <div
                class="delivery-details"
                v-if="controller.isDeliveryRequired"
              >
                <b>{{ controller.billingName }}</b>
                <CopyValue :value="controller.billingName" />
                <br />
                Recipient Name: {{ controller.recipientName }}
                <CopyValue :value="controller.recipientName" />
                <br />
                Email: {{ controller.recipientEmail }}
                <CopyValue :value="controller.recipientEmail" />
                <br />
                <br />
                <div>
                  {{ controller.deliveryAddressLine1 }}
                  <CopyValue :value="controller.deliveryAddressLine1" />
                </div>
                <div v-if="controller.deliveryAddressLine2.length > 0">
                  {{ controller.deliveryAddressLine2 }}
                  <CopyValue :value="controller.deliveryAddressLine2" />
                </div>
                <div v-if="controller.deliveryAddressLine3.length > 0">
                  {{ controller.deliveryAddressLine3 }}
                  <CopyValue :value="controller.deliveryAddressLine3" />
                </div>
                <div>
                  {{ controller.deliveryAddressPostcode }}
                  <CopyValue :value="controller.deliveryAddressPostcode" />
                </div>
                <div>
                  {{ controller.deliveryAddressCity }}
                  <CopyValue :value="controller.deliveryAddressCity" />
                </div>
                <div>
                  {{ controller.deliveryAddressState }}
                  <CopyValue :value="controller.deliveryAddressState" />
                </div>
                <div>
                  {{ controller.deliveryAddressCountry }}
                  <CopyValue :value="controller.deliveryAddressCountry" />
                </div>
              </div>
              <!-- <span v-html="controller.deliveryAddress" />
              <CopyValue :value="controller.deliveryAddressToCopy" /> -->
            </div>
          </template>
          <template #nodeOptions>
            <button
              class="btn btn-pill btn-primary"
              @click="controller.onDownloadClicked()"
            >
              {{ controller.downloadLabel }}
            </button>
          </template>
          <template #nodeActions>
            <button
              class="btn btn-pill btn-submit"
              @click="controller.onShippedClicked()"
            >
              {{ controller.shipLabel }}
            </button>
          </template>
        </ApplicationNode>
        <ApplicationNode
          v-bind="controller.completedNodeProps"
          @click="controller.onApplicationDetailsClicked()"
        >
          <template #nodeContent>
            <div class="application-container">
              <div class="node-title">
                {{ controller.applicationCompletedLabel }}
              </div>
              <div class="node-subtitle">
                {{ controller.completedSublabel }}
              </div>
            </div>
            <div class="application-details">
              {{ controller.completedStatus }}
            </div>
          </template>
          <template #nodeOptions></template>
          <template #nodeActions>
            <button
              class="btn btn-pill btn-submit"
              @click="controller.onCompleteClicked()"
            >
              {{ controller.markCompletedLabel }}
            </button>
          </template>
        </ApplicationNode>
      </template>
    </ServiceApplication>
    <PopupShipApplication
      v-bind="controller.shipApplicationProps"
      ref="shipApplicationRef"
      @proceed="controller.onProceedShipped()"
    />
    <AddBankAccount
      ref="addBankAccountRef"
      :company-bank-account-opening-id="controller.applicationId.value ?? ''"
      @proceed="controller.onProceedCompleted()"
    />
  </div>
</template>

<script lang="ts" setup>
  import ApplicationNode from "./ApplicationNode.vue"
  import CopyValue from "../Buttons/CopyValue.vue"
  import PopupShipApplication from "@/components/Popups/ShipApplication.vue"
  import PopupUploadDocument from "@/components/Popups/UploadDocument.vue"
  import AddBankAccount from "../Popups/AddBankAccount.vue"
  import ServiceApplication from "./ServiceApplication.vue"
  import { BankAccountOpeningApplicationController } from "~/scripts/components/services/BankAccountOpeningApplicationController"
  import { EmitMessages } from "~/scripts/constants/EmitMessages"
  import type { IPropsApplication } from "~/scripts/props/PropsApplication"

  const props = defineProps<IPropsApplication>()

  const resolutionsRef = ref(null)
  const shipApplicationRef = ref(null)
  const serviceApplicationRef = ref(null)
  const addBankAccountRef = ref(null)

  const emit = defineEmits(EmitMessages.APPLICATION_SERVICES)

  const controller = new BankAccountOpeningApplicationController(props, emit)

  watch(
    () => props.companyId,
    (newVal) => {
      controller.setCompanyId(newVal)
    }
  )

  watch(
    resolutionsRef,
    (newVal) => {
      controller.setResolutionsRef(newVal)
    },
    { immediate: true }
  )

  watch(
    shipApplicationRef,
    (newVal) => {
      controller.setShipApplicationRef(newVal)
    },
    { immediate: true }
  )

  watch(
    serviceApplicationRef,
    (newVal) => {
      controller.setServiceApplicationRef(newVal)
    },
    { immediate: true }
  )

  watch(
    addBankAccountRef,
    (newVal) => {
      controller.setAddBankAccountRef(newVal)
    },
    { immediate: true }
  )

  defineExpose({
    expand: controller.expand.bind(controller),
    collapse: controller.collapse.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Services/BankAccountOpeningApplication" as *;
</style>
