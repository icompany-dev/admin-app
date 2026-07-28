<template>
  <div id="incorporations-application">
    <div
      class="loader-container"
      v-if="controller.isLoading.value"
    >
      <LoaderPrepare
        :label="controller.loaderLabel"
        :sublabel="controller.loaderSublabel"
      />
    </div>
    <template v-if="!controller.isLoading.value">
      <div class="incorp-application-summary">
        <div class="proposed-name">
          {{ controller.application.value.getName() }}
          <span
            class="name-approved"
            v-if="controller.isNameApproved"
          >
            <i class="fa-solid fa-circle-check" />
          </span>
        </div>
        <div class="summary-item">
          <div class="summary-item-title">
            {{ controller.applicantLabel }}
          </div>
          <div class="summary-item-content human-details">
            <span class="human-detail">
              <b>{{ controller.applicantName }}</b>
            </span>
            <span class="human-detail">
              <i class="fa-regular fa-envelope" />
              {{ controller.applicantEmail }}
            </span>
            <span class="human-detail">
              <i class="fa-brands fa-whatsapp" />
              {{ controller.applicantPhone }}
            </span>
          </div>
        </div>
      </div>
      <div class="incorp-application-details">
        <ServiceApplication
          v-bind="controller.serviceApplicationProps"
          @paymentNodeSelected="controller.onPaymentStepClicked()"
        >
          <template #application>
            <ApplicationNode
              v-bind="controller.nameReservationNodeProps"
              @click="controller.onNameReservationStepClicked()"
            >
              <template #nodeContent>
                <div class="application-container">
                  <div class="node-title">{{ controller.nameReservationLabel }}</div>
                  <div class="node-subtitle">({{ controller.nameReservationSublabel }})</div>
                  <div class="application-details">
                    <span class="application-label">
                      {{ controller.proposedNamesLabel }}
                    </span>
                    <div class="actions-button-options">
                      <div
                        class="btn btn-primary selected"
                        @click="controller.onProposedNamesClicked()"
                      >
                        <span class="label">{{ controller.selectedProposedNameForDisplay }}</span>
                        <i
                          class="fa-solid fa-caret-down"
                          :class="{ rotate: controller.isShowProposedNames.value }"
                        ></i>
                      </div>
                      <div
                        class="options"
                        :class="{ show: controller.isShowProposedNames.value }"
                      >
                        <button
                          v-for="(name, index) in controller.nameOptions"
                          :key="index"
                          class="btn btn-primary name-option"
                          @click="controller.onProposedNamesSelected(name)"
                        >
                          {{ name }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <template #nodeOptions>
                <button
                  class="btn btn-pill btn-primary"
                  :class="{ 'is-loading': controller.isUploadingSection27.value }"
                  @click="controller.onUploadDocumentClicked()"
                >
                  {{ controller.uploadSection27Label }}
                </button>
                <span
                  class="action-link download"
                  v-if="controller.isSection27Uploaded"
                  @click="controller.onDownloadSection27Clicked()"
                >
                  <i class="fa-regular fa-cloud-arrow-down"></i>
                  {{ controller.downloadDocumentSection27Label }}
                </span>
              </template>
              <template #nodeActions>
                <div class="actions-button-options">
                  <div
                    class="btn btn-pill btn-submit selected"
                    :class="{
                      'is-loading': controller.isUpdatingSection27.value,
                      single: !controller.hasNextStepsForSection27,
                    }"
                    @click="controller.onShowSection27ActionClicked()"
                  >
                    <span class="label">{{ controller.section27ActionLabel }}</span>
                    <i
                      v-if="controller.hasNextStepsForSection27"
                      class="fa-solid fa-caret-down"
                      :class="{ rotate: controller.isShowSection27Actions.value }"
                    ></i>
                  </div>
                  <div
                    class="options"
                    :class="{ show: controller.isShowSection27Actions.value }"
                  >
                    <button
                      class="btn btn-pill btn-submit"
                      :disabled="!controller.canSubmitSection27"
                      @click="controller.onSubmitNameReservation()"
                    >
                      {{ controller.submitSection27ApplicationLabel }}
                    </button>
                    <button
                      class="btn btn-pill btn-submit"
                      :disabled="!controller.canUpdateSection27"
                      @click="controller.onQueryNameReservation()"
                    >
                      {{ controller.querySection27ApplicationLabel }}
                    </button>
                    <button
                      class="btn btn-pill btn-submit"
                      :disabled="!controller.canResubmitSection27"
                      @click="controller.onSubmitNameReservation()"
                    >
                      {{ controller.resubmitSection27ApplicationLabel }}
                    </button>
                    <button
                      class="btn btn-pill btn-submit"
                      :disabled="!controller.canUpdateSection27"
                      @click="controller.onApproveNameReservation()"
                    >
                      {{ controller.approvedSection27Label }}
                    </button>
                    <button
                      class="btn btn-pill btn-submit"
                      :disabled="!controller.canUpdateSection27"
                      @click="controller.onNameReservationRejectedClicked()"
                    >
                      {{ controller.rejectedSection27Label }}
                    </button>
                  </div>
                </div>
              </template>
            </ApplicationNode>
          </template>
        </ServiceApplication>
        <div class="document-display">
          <component
            ref="documentRef"
            :is="activeDocumentComponent"
            :application-id="controller.applicationId.value"
            :target-id="controller.paymentOrderId.value"
          />
        </div>
      </div>
    </template>
    <ReservedNameForNewSdnBhd
      ref="nameReservedPopup"
      :application="controller.applicationNameReservation.value"
      @proceed="controller.onProceedSubmitNameReservation($event)"
    />
    <ReservedNameForNewSdnBhdQueried
      ref="nameReservedQueriedPopup"
      :application="controller.applicationNameReservation.value"
      @proceed="controller.onProceedQueryNameReservation($event)"
    />
  </div>
</template>

<script lang="ts" setup>
  import ApplicationNode from "@/components/Services/ApplicationNode.vue"
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import ReservedNameForNewSdnBhd from "@/components/Popups/ReservedNameForNewSdnBhd.vue"
  import ReservedNameForNewSdnBhdQueried from "@/components/Popups/ReservedNameForNewSdnBhdQueried.vue"
  import ReceiptInvoiceService from "@/components/CompanyServices/ReceiptInvoiceService.vue"
  import ServiceApplication from "@/components/Services/ServiceApplication.vue"
  import { ApplicationController } from "~/scripts/components/incorporations/ApplicationController"
  import type { IPropsIncorporationApplication } from "~/scripts/props/PropsIncorporationApplication"
  import { DocumentTargets } from "~/scripts/constants/DocumentTargets"

  const props = defineProps<IPropsIncorporationApplication>()

  const emit = defineEmits(["back"])

  const componentMap: Record<string, any> = {
    [DocumentTargets.TARGET_RECEIPT]: ReceiptInvoiceService,
  }

  const nameReservedPopup = ref(null)
  const nameReservedQueriedPopup = ref(null)

  const controller = new ApplicationController(props, emit)

  const activeDocumentComponent = computed(() => {
    const target = controller.selectedDocumentTarget.value
    return target && componentMap[target] ? componentMap[target] : null
  })

  watch(
    () => props,
    (newVal) => {
      controller.setDataFromProps(newVal)
    },
    { deep: true }
  )

  watch(
    nameReservedPopup,
    (newVal) => {
      controller.setNameReservedPopup(newVal)
    },
    { immediate: true }
  )

  watch(
    nameReservedQueriedPopup,
    (newVal) => {
      controller.setNameReservedQueriedPopup(newVal)
    },
    { immediate: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Incorporations/Application" as *;
</style>
