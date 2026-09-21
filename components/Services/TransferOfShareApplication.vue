<template>
  <div id="services-transfer-of-share-application">
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
            <div class="application-details"></div>
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
              :class="{ 'is-loading': controller.isStamping.value }"
              :disabled="controller.isStamping.value"
              @click="controller.onStampingClicked()"
            >
              {{ controller.submittedStampingLabel }}
            </button>
          </template>
        </ApplicationNode>
        <ApplicationNode
          v-if="controller.isDeliveryRequired"
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
              <span v-html="controller.deliveryAddress" />
              <CopyValue :value="controller.deliveryAddressToCopy" />
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
        <!-- <ApplicationNode
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
          </template>
          <template #nodeOptions>
            <button
              class="btn btn-pill btn-primary"
              @click="controller.onUploadDocumentClicked()"
            >
              {{ controller.uploadLabel }}
            </button>
            <span
              class="action-link download"
              v-if="controller.isRoaUploaded"
              @click="controller.onDownloadRoaClicked()"
            >
              <i class="fa-regular fa-cloud-arrow-down"></i>
              {{ controller.returnOfAllotmentLabel }}
            </span>
          </template>
          <template #nodeActions>
            <button
              class="btn btn-pill btn-submit"
              @click="controller.onCompleteClicked()"
            >
              {{ controller.markCompletedLabel }}
            </button>
          </template>
        </ApplicationNode> -->
      </template>
    </ServiceApplication>
    <PopupShipApplication
      v-bind="controller.shipApplicationProps"
      ref="shipApplicationRef"
      @proceed="controller.onProceedShipped()"
    />
    <PopupUploadDocument
      v-bind="controller.uploadDocumentProps"
      ref="uploadDocumentRef"
      @proceed="controller.onProceedPostUpload()"
    />
  </div>
</template>

<script lang="ts" setup>
  import ApplicationNode from "./ApplicationNode.vue"
  import PopupShipApplication from "@/components/Popups/ShipApplication.vue"
  import PopupUploadDocument from "@/components/Popups/UploadDocument.vue"
  import ServiceApplication from "./ServiceApplication.vue"
  import { TransferOfShareApplicationController } from "~/scripts/components/services/TransferOfShareApplicationController"
  import type { IPropsApplication } from "~/scripts/props/PropsApplication"
  import { EmitMessages } from "~/scripts/constants/EmitMessages"

  const props = defineProps<IPropsApplication>()

  const emit = defineEmits(EmitMessages.APPLICATION_SERVICES)

  const resolutionsRef = ref(null)
  const uploadDocumentRef = ref(null)
  const shipApplicationRef = ref(null)
  const serviceApplicationRef = ref(null)

  const controller = new TransferOfShareApplicationController(props, emit)

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
    uploadDocumentRef,
    (newVal) => {
      controller.setUploadDocumentRef(newVal)
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

  defineExpose({
    expand: controller.expand.bind(controller),
    collapse: controller.collapse.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Services/TransferOfShareApplication" as *;
</style>
