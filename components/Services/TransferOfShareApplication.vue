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
            <div class="application-details">
              <div
                class="transfer"
                v-for="(transferDetail, index) in controller.application.value?.transferDetails"
              >
                <div class="transfer-detail">
                  <UserDetail v-bind="controller.getTransferorPropsUserDetail(transferDetail)" />
                  <i class="fa-solid fa-arrow-right"></i>
                  <UserDetail v-bind="controller.getTransfereePropsUserDetail(transferDetail)" />
                </div>
                <div class="amount">
                  <b>{{ controller.amountToTransferLabel }}</b>
                  : {{ NumberUtil.thousandSeparator(transferDetail.unitsOfShare) }}
                  <CopyValue :value="transferDetail.unitsOfShare.toString()" />
                </div>
                <!-- <div class="amount">
                  <b>{{ controller.considerationAmountLabel }}</b>
                  : {{ NumberUtil.thousandSeparator(controller.application.value?.sharesAlloted) }}
                  <CopyValue :value="transferDetail.unitsOfShare.toString()" />
                </div> -->
              </div>
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
              :class="{ 'is-loading': controller.isStamping.value }"
              :disabled="controller.isStamping.value"
              @click="controller.onStampingClicked()"
            >
              {{ controller.submittedStampingLabel }}
            </button>
          </template>
        </ApplicationNode>
        <ApplicationNode
          v-bind="controller.stampingProgressNode"
          @click="controller.onStampingDetailsClicked()"
        >
          <template #nodeContent>
            <div class="application-container">
              <div class="node-title">
                {{ controller.stampingLabel }}
              </div>
              <div class="node-subtitle">
                {{ controller.stampingSublabel }}
              </div>
            </div>
            <div class="application-details"></div>
          </template>
          <template #nodeOptions>
            <button
              class="btn btn-pill btn-primary"
              :class="{ 'is-loading': controller.isFetchingDocuments }"
              @click="controller.onUploadClicked()"
            >
              {{ controller.uploadSijilLabel }}
            </button>
            <span
              class="action-link download"
              v-if="controller.isSijilSetemUploaded"
              @click="controller.onDownloadSijilSetemClicked()"
            >
              <i class="fa-regular fa-cloud-arrow-down"></i>
              {{ controller.sijilSetemLabel }}
            </span>
          </template>
          <template #nodeActions></template>
        </ApplicationNode>
        <ApplicationNode
          v-bind="controller.registerNode"
          @click="controller.onRegisterDetailsClicked()"
        >
          <template #nodeContent>
            <div class="application-container">
              <div class="node-title">
                {{ controller.registerLabel }}
              </div>
              <div class="node-subtitle">
                {{ controller.registerSublabel }}
              </div>
            </div>
            <div
              class="application-details"
              v-html="controller.registerDetails"
            />
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
              :class="{ 'is-loading': controller.isSubmitting.value }"
              :disabled="controller.isSubmitting.value"
              @click="controller.onSubmitClicked()"
            >
              {{ controller.registerButtonLabel }}
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
        <ApplicationNode
          v-bind="controller.completedNodeProps"
          @click="controller.onCompletedDetailsClicked()"
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
              @click="controller.onUploadClicked()"
            >
              {{ controller.uploadLabel }}
            </button>
            <span
              class="action-link download"
              v-if="controller.isSection51Uploaded"
              @click="controller.onDownloadSection51Clicked()"
            >
              <i class="fa-regular fa-cloud-arrow-down"></i>
              {{ controller.section51Label }}
            </span>
          </template>
          <template #nodeActions>
            <button
              class="btn btn-pill btn-submit"
              :disabled="controller.isCompleting.value"
              :class="{ 'is-loading': controller.isCompleting.value }"
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
      ref="uploadDocumentRef"
      @proceed="controller.onProceedPostUpload()"
    />
  </div>
</template>

<script lang="ts" setup>
  import ApplicationNode from "./ApplicationNode.vue"
  import CopyValue from "../Buttons/CopyValue.vue"
  import PopupShipApplication from "@/components/Popups/ShipApplication.vue"
  import PopupUploadDocument from "@/components/Popups/UploadDocument.vue"
  import ServiceApplication from "./ServiceApplication.vue"
  import UserDetail from "../Users/UserDetail.vue"
  import { TransferOfShareApplicationController } from "~/scripts/components/services/TransferOfShareApplicationController"
  import type { IPropsApplication } from "~/scripts/props/PropsApplication"
  import { EmitMessages } from "~/scripts/constants/EmitMessages"
  import { NumberUtil } from "~/scripts/utils/Number"

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
    () => props.canCompleteService,
    (newVal, oldVal) => {
      console.log("here", newVal, oldVal)
      if (!oldVal && newVal) {
        controller.onProceedPostCompleted()
      }
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
