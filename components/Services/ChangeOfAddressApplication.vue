<template>
  <div id="services-change-of-address-application">
    <ServiceApplication
      ref="serviceApplicationRef"
      v-bind="controller.serviceApplicationProps"
      @paymentNodeSelected="controller.onPaymentStepClicked()"
      @show="controller.onShowPanel()"
      @hide="emit('hide')"
    >
      <template #application>
        <ApplicationNode
          v-bind="controller.approvalApplicationNodeProps"
          @click="controller.onApprovalStepClicked()"
        >
          <template #nodeContent>
            <div class="approval-container">
              <span class="node-title">{{ controller.approvalLabel }}</span>
            </div>
            <div class="approval-dates">
              <div>
                <b>{{ controller.completedLabel }} :</b>
                {{ controller.approvalDate }}
              </div>
              <div>
                <b>{{ controller.latestSignatureLabel }} :</b>
                {{ controller.lastSignatureDate }}
              </div>
            </div>
          </template>
          <template #nodeOptions>
            <button
              class="btn btn-pill btn-primary"
              :class="{ 'is-loading': controller.isDownloading.value }"
              @click="controller.onDownloadClicked()"
            >
              Download
            </button>
          </template>
          <template #nodeActions>
            <div class="actions-button-options">
              <div
                class="btn btn-pill btn-submit selected"
                @click="controller.onShowApprovalActionClicked()"
              >
                <span class="label">{{ controller.approvalActionLabel }}</span>
                <i
                  class="fa-solid fa-caret-down"
                  :class="{ rotate: controller.isShowApprovalAction.value }"
                ></i>
              </div>
              <div
                class="options"
                :class="{ show: controller.isShowApprovalAction.value }"
              >
                <button
                  class="btn btn-pill btn-submit"
                  disabled
                >
                  {{ controller.concluded }}
                </button>
                <button
                  class="btn btn-pill btn-submit"
                  :disabled="controller.isShareholderSignatureCompleted"
                  @click="controller.onRejectApplicationClicked()"
                >
                  {{ controller.reject }}
                </button>
              </div>
            </div>
          </template>
        </ApplicationNode>
        <ApplicationNode
          v-bind="controller.registrationOfAddressChangeProps"
          @click="controller.onRegistrationOfAddressChangedClicked()"
        >
          <template #nodeContent>
            <div class="application-container">
              <div class="node-title">{{ controller.pd2Label }}</div>
              <div class="node-subtitle">({{ controller.pd2Sublabel }})</div>
            </div>
          </template>
          <template #nodeOptions>
            <button
              class="btn btn-pill btn-primary"
              :class="{ 'is-loading': controller.isDownloadingSection28.value }"
              @click="controller.onDownloadClicked()"
            >
              Download
            </button>
          </template>
          <template #nodeActions>
            <div class="actions-button-options">
              <div
                class="btn btn-pill btn-submit selected"
                :class="{ 'is-loading': controller.isUpdatingSection28.value }"
                @click="controller.onShowRegistrationActions()"
              >
                <span class="label">{{ controller.section28ActionLabel }}</span>
                <i
                  class="fa-solid fa-caret-down"
                  :class="{ rotate: controller.isShowSection28Actions.value }"
                ></i>
              </div>
              <div
                class="options"
                :class="{ show: controller.isShowSection28Actions.value }"
              >
                <button
                  class="btn btn-pill btn-submit"
                  :disabled="!controller.canSubmitToSSM"
                  @click="controller.onSubmitToSSMClicked()"
                >
                  {{ controller.registrationOfAddressButtonLabel }}
                </button>
              </div>
            </div>
          </template>
        </ApplicationNode>
        <ApplicationNode
          v-bind="controller.completeApplicationProps"
          @click="controller.onCompleteAddressChangeClicked()"
        >
          <template #nodeContent>
            <div class="application-container">
              <div class="node-title">{{ controller.completeLabel }}</div>
            </div>
          </template>
          <template #nodeActions>
            <div class="actions-button-options">
              <div
                class="btn btn-pill btn-submit selected single"
                @click="controller.onCompleteAddressChangeClicked()"
              >
                <span class="label">{{ controller.completeActionLabel }}</span>
              </div>
            </div>
          </template>
        </ApplicationNode>
      </template>
    </ServiceApplication>
    <PopupUploadDocument
      v-bind="controller.uploadDocumentProps"
      ref="uploadDocumentPopup"
    />
    <PopupShipApplication
      v-bind="controller.shipApplicationProps"
      ref="shipApplicationRef"
      @proceed="controller.onProceedShipped()"
    />
  </div>
</template>

<script lang="ts" setup>
  import ApplicationNode from "./ApplicationNode.vue"
  import PopupShipApplication from "@/components/Popups/ShipApplication.vue"
  import PopupUploadDocument from "@/components/Popups/UploadDocument.vue"
  import ServiceApplication from "./ServiceApplication.vue"
  import { ChangeOfAddressApplicationController } from "~/scripts/components/services/ChangeOfAddressApplicationController"
  import type { IPropsApplication } from "~/scripts/props/PropsApplication"

  const props = defineProps<IPropsApplication>()

  const emit = defineEmits(["applicationId", "paymentOrderId", "pa", "documentSelected", "download", "show", "hide"])

  const resolutionsRef = ref(null)
  const addressReservationRejectedPopup = ref(null)
  const uploadDocumentPopup = ref(null)
  const shipApplicationRef = ref(null)
  const serviceApplicationRef = ref(null)

  const controller = new ChangeOfAddressApplicationController(props, emit)

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
    addressReservationRejectedPopup,
    (newVal) => {
      controller.setAddressReservationRejectedPopup(newVal)
    },
    { immediate: true }
  )

  watch(
    uploadDocumentPopup,
    (newVal) => {
      controller.setUploadDocumentPopup(newVal)
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
  @use "~/assets/scss/components/Services/ChangeOfAddressApplication" as *;
</style>
