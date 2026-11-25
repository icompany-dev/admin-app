<template>
  <div id="services-document-request-application">
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
              <b>{{ controller.ctcRequiredLabel }}:</b>
              {{ controller.ctcType }}
              <br />
              <br />
              <b>{{ controller.documentsRequestLabel }}</b>
              <ol>
                <li v-for="(item, index) in controller.documents">
                  <span
                    :class="{ clickable: controller.canShowDocument(item) }"
                    @click="controller.onDocumentClicked(item)"
                  >
                    {{ item.documentName }}
                  </span>
                  <span v-if="item.isSsmPurchase">{{ controller.purchaseFrom }} MyData</span>
                  <span
                    v-if="!controller.canShowDocument(item)"
                    class="text-danger"
                  >
                    &nbsp;
                    <small>(Not in Available in Company Documents)</small>
                  </span>
                </li>
              </ol>
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
              @click="controller.onUploadClicked()"
            >
              {{ controller.uploadLabel }}
            </button>
          </template>
        </ApplicationNode>
        <ApplicationNode
          v-bind="controller.deliveryNodeProps"
          @click="controller.onApplicationDetailsClicked()"
        >
          <template #nodeContent>
            <div class="application-container">
              <div class="node-title">
                {{ controller.deliveryLabel }}
              </div>
              <div class="node-subtitle">
                {{ controller.deliverySublabel }}
              </div>
            </div>
            <div class="application-details">
              <b>{{ controller.deliverMethodLabel }}</b>
              <br />
              {{ controller.deliveryMethod }}
              <br />
              <br />
              <b>{{ controller.deliverToLabel }}</b>
              <br />
              <div class="delivery-details">
                <b>{{ controller.billingName }}</b>
                <CopyValue :value="controller.billingName" />
                <br />
                Recipient Name: {{ controller.recipientName }}
                <CopyValue :value="controller.recipientName" />
                <br />
                Email: {{ controller.recipientEmail }}
                <CopyValue :value="controller.recipientEmail" />
                <br />
                Phone: {{ controller.recipientPhone }}
                <CopyValue :value="controller.recipientPhone" />
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
            </div>
          </template>
          <!--This will be where the print slips be-->
          <template #nodeOptions></template>
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
    <PopupUploadDocument
      v-bind="controller.uploadDocumentProps"
      ref="uploadeDocumentRef"
      @proceed="controller.onPostUploadDocuments()"
    />
  </div>
</template>

<script lang="ts" setup>
  import ApplicationNode from "./ApplicationNode.vue"
  import CopyValue from "../Buttons/CopyValue.vue"
  import PopupShipApplication from "@/components/Popups/ShipApplication.vue"
  import PopupUploadDocument from "@/components/Popups/UploadDocument.vue"
  import ServiceApplication from "./ServiceApplication.vue"
  import { EmitMessages } from "~/scripts/constants/EmitMessages"
  import type { IPropsApplication } from "~/scripts/props/PropsApplication"
  import { DocumentRequestApplicationController } from "~/scripts/components/services/DocumentRequestApplicationController"

  const props = defineProps<IPropsApplication>()

  const resolutionsRef = ref(null)
  const shipApplicationRef = ref(null)
  const serviceApplicationRef = ref(null)
  const uploadeDocumentRef = ref(null)

  const emit = defineEmits(EmitMessages.APPLICATION_SERVICES)
  const controller = new DocumentRequestApplicationController(props, emit)

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
    uploadeDocumentRef,
    (newVal) => {
      controller.setUploadDocumentRef(newVal)
    },
    { immediate: true }
  )

  defineExpose({
    expand: controller.expand.bind(controller),
    collapse: controller.collapse.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Services/DocumentRequestApplication" as *;
</style>
