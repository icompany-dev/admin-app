<template>
  <div
    class="service-wrapper"
    ref="serviceWrapperRef"
  >
    <div class="resolution-steps">
      <div
        v-if="controller.showResolution()"
        ref="resolutionRef"
        class="resolution-container"
        :style="controller.resolutionContainerStyle.value"
        @mouseenter="controller.setDocumentHover(true)"
        @mouseleave="controller.setDocumentHover(false)"
      >
        <div
          ref="overlayRef"
          class="overlay"
          :class="{
            hide: controller.isOverlayHidden(),
            'show-overlay-instruction': controller.isShowOverlayInstruction.value,
          }"
          :style="controller.getOverlayStyle()"
          @click.self="controller.handleDocumentClicked()"
        >
          <span
            class="click-to-preview"
            v-if="!controller.isShowOverlayInstruction.value && !controller.isSubmittingDocument.value"
            @click.self="controller.handleDocumentClicked()"
          >
            {{ controller.shroudLabel() }}
          </span>

          <div
            class="submitting-loader-container"
            v-if="controller.isSubmittingDocument.value"
          >
            <LoaderPrepare
              :label="controller.submittingDocumentLabel()"
              :sublabel="controller.submittingDocumentSublabel()"
            />
          </div>

          <span v-if="controller.isShowOverlayInstruction.value">
            {{ controller.shroudLabel() }}
          </span>

          <div
            v-if="!controller.isShowOverlayInstruction.value && !controller.isSubmittingDocument.value"
            class="learn-more-button"
          >
            <slot name="learnMoreButton" />
          </div>

          <div
            v-if="controller.isShowOverlayInstruction.value"
            class="overlay-button"
          >
            <slot name="cornerButton" />
          </div>
        </div>
        <div
          v-if="controller.isShowDocument()"
          ref="documentRef"
          class="document-container"
          :style="controller.getDocumentContainerStyle()"
          @click="controller.handleDocumentClicked()"
        >
          <div
            class="document-content"
            :style="controller.getDocumentContentStyle()"
          >
            <slot name="resolutions" />
          </div>
        </div>
        <div
          ref="documentSlipCaseRef"
          class="document-slip-case-container"
          :class="{ hide: controller.isOverlayHidden() }"
          :style="controller.getSlipCaseStyle()"
          v-if="!controller.isHideOtherElements()"
        >
          <DocumentSlipCase
            :title="props.documentSlipCaseProps.title"
            :back-button-label="props.documentSlipCaseProps.backButtonLabel"
            :proceed-button-label="props.documentSlipCaseProps.proceedButtonLabel"
            :is-loading="props.documentSlipCaseProps.isLoading"
            :hovered-proceed-button-label="props.documentSlipCaseProps.hoveredProceedButtonLabel"
            @back="emit('back')"
            @pay="emit('proceed')"
          >
            <template #slipCaseContent>
              <slot name="documentSlipCaseContent" />
            </template>
          </DocumentSlipCase>
        </div>
      </div>
      <div
        ref="serviceStepsRef"
        class="service-steps-container"
        v-if="props.showServiceSteps"
      >
        <ServiceSteps
          ref="serviceStepsCompomentRef"
          :application="props.serviceStepProps.application"
          :price="props.serviceStepProps.price"
          :target="props.serviceStepProps.target"
          :has-paid="props.serviceStepProps.hasPaid"
          :has-user-signed="props.serviceStepProps.hasUserSigned"
          :have-all-signed="props.serviceStepProps.haveAllSigned"
          :is-dcr="props.serviceStepProps.isDcr"
          :is-mcr="props.serviceStepProps.isMcr"
          :number-of-directors="props.serviceStepProps.numberOfDirectors"
          :number-of-shareholders="props.serviceStepProps.numberOfShareholders"
          :signature-date="props.serviceStepProps.signatureDate"
          :can-skip-to-confirmation="props.serviceStepProps.canSkipToConfirmation"
          :use-default-confirmation="props.serviceStepProps.useDefaultConfirmation"
          :has-majority-rule="props.serviceStepProps.hasMajorityRule"
          :has-custom-affirmation="props.serviceStepProps.hasCustomAffirmation"
          :is-pasca-in-pasca="props.serviceStepProps.isPascaInPasca"
          @revoke="emit('revoke')"
          @accept="controller.handleAccept()"
        >
          <template #customAffirmation>
            <slot name="pasca-custom-affirmation" />
          </template>
          <template #statusDetails>
            <slot name="step-status" />
          </template>
          <template #customConfirmation>
            <slot name="pasca-custom-confirmation" />
          </template>
        </ServiceSteps>
      </div>
      <div class="no-record-found">
        <NoRecord
          v-if="controller.isShowNoRecord()"
          :title="controller.noRecordFoundTitle()"
          :subtitle="controller.noRecordFoundSubtitle()"
        >
          <template #cta>
            <div class="action-buttons">
              <button
                class="btn btn-standard btn-submit"
                v-html="controller.noRecordFoundCtaLabel()"
                @click="emit(EmitMessages.GO_TO_NEW)"
              />
            </div>
          </template>
        </NoRecord>
      </div>
      <div
        class="past-records"
        v-if="controller.isShowPastApplications()"
      >
        <PastApplications
          v-bind="props.pastApplicationProps"
          @goToNew="emit(EmitMessages.GO_TO_NEW)"
        />
      </div>
    </div>

    <Teleport to="body">
      <DeleteApplication
        ref="deleteApplicationRef"
        :target-type="props.deleteApplicationProps.targetType"
        :target-id="props.deleteApplicationProps.targetId"
      />
      <div
        class="document-view"
        :class="{ show: controller.isDocumentEnlarged.value }"
        v-if="props.hasPaid"
      >
        <ServiceWrapper
          :company-id="props.companyId"
          :target="props.serviceWrapperProps.target"
          :target-id="props.serviceWrapperProps.targetId ?? ''"
          :is-in-preview-mode="props.serviceWrapperProps.isInPreviewMode"
          :is-showing="controller.isDocumentEnlarged.value"
          :paper-orientation="props.paperOrientation"
          :is-by-shareholder="props.serviceWrapperProps.isByShareholder"
          :financial-year-start-date="props.serviceWrapperProps.financialYearStartDate"
          :financial-year-end-date="props.serviceWrapperProps.financialYearEndDate"
          @minimize="controller.minimize($event)"
          @make-payment="controller.onMakePayment()"
          @applicationUpdated="controller.onApplicationUpdated($event)"
        />
      </div>
      <OngoingApplicationAlert
        ref="ongoingApplicationAlertRef"
        @back="emit('back')"
        @proceed="emit('goToExisting')"
      />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import NoRecord from "../Placeholders/NoRecord.vue"
  import PastApplications from "../PastApplications/PastApplications.vue"
  import ServiceWrapper from "@/components/Services/ServiceWrapper.vue"
  import ServiceSteps from "./ServiceSteps.vue"
  import DeleteApplication from "../Popups/DeleteApplication.vue"
  import DocumentSlipCase from "../DocumentCtas/DocumentSlipCase.vue"
  import OngoingApplicationAlert from "../Popups/OngoingApplicationAlert.vue"
  import { CompanyServiceWrapperController } from "~/scripts/components/company-services/CompanyServiceWrapperController"
  import type { IPropsCompanyServiceWrapper } from "~/scripts/props/PropsCompanyServiceWrapper"
  import { ViewMode } from "~/scripts/constants/ViewMode"
  import { EmitMessages } from "~/scripts/constants/EmitMessages"

  const props = defineProps<IPropsCompanyServiceWrapper>()

  const serviceWrapperRef = ref(null)
  const resolutionRef = ref(null)
  const documentWrapperRef = ref(null)
  const documentRef = ref(null)
  const overlayRef = ref(null)
  const helpButtonRef = ref(null)
  const deleteApplicationRef = ref(null)
  const serviceCtaRef = ref(null)
  const serviceStepsRef = ref(null)
  const documentSlipCaseRef = ref(null)
  const ongoingApplicationAlertRef = ref(null)
  const serviceStepsCompomentRef = ref(null)

  const emit = defineEmits([
    "proceed",
    "goToPage",
    "back",
    "pay",
    "refresh",
    "minimized",
    "doneLoading",
    "preview",
    "shrouded",
    "viewModeChanged",
    "applicationUpdated",
    "goToExisting",
    "revoke",
    "accept",
    EmitMessages.GO_TO_NEW,
  ])

  const controller = new CompanyServiceWrapperController(
    props.application,
    props.serviceWrapperProps,
    props.viewType,
    props.hasOngoingApplication,
    props.hasPastApplications,
    props.paperOrientation,
    emit
  )

  onMounted(() => {
    controller.onWindowResize()

    window.addEventListener("resize", controller.onWindowResize.bind(controller))
  })

  onBeforeUnmount(() => {
    window.removeEventListener("resize", controller.onWindowResize.bind(controller))
  })

  watch(
    () => props.application,
    (newVal) => {
      controller.setApplication(newVal)
    },
    { deep: true }
  )

  watch(
    () => props.serviceWrapperProps,
    (newVal) => {
      controller.setServiceWrapperConfig(newVal)
    },
    { deep: true }
  )

  watch(
    () => props.viewType,
    (newVal) => {
      controller.setViewType(newVal)
    }
  )

  watch(
    () => props.hasOngoingApplication,
    (newVal) => {
      controller.setHasOngoingApplication(newVal)
    }
  )

  watch(
    () => props.hasPastApplications,
    (newVal) => {
      controller.setHasPastApplications(newVal)
    }
  )

  watch(
    serviceWrapperRef,
    (newVal) => {
      controller.setServiceWrapperRef(newVal)
    },
    { immediate: true }
  )

  watch(
    () => props.paperOrientation,
    (newVal) => {
      controller.setPaperOrientation(newVal)
    }
  )

  watch(
    resolutionRef,
    (newVal) => {
      controller.setResolutionRef(newVal)
    },
    { immediate: true }
  )

  watch(
    documentWrapperRef,
    (newVal) => {
      controller.setDocumentWrapperRef(newVal)
    },
    { immediate: true }
  )

  watch(
    documentRef,
    (newVal) => {
      controller.setDocumentRef(newVal)
    },
    { immediate: true }
  )

  watch(
    overlayRef,
    (newVal) => {
      controller.setOverlayRef(newVal)
    },
    { immediate: true }
  )

  watch(
    helpButtonRef,
    (newVal) => {
      controller.setHelpButtonRef(newVal)
    },
    { immediate: true }
  )

  watch(deleteApplicationRef, (newVal) => {
    controller.setDeleteApplicationRef(newVal)
  })

  watch(serviceCtaRef, (newVal) => {
    controller.setServiceCtaRef(newVal)
  })

  watch(serviceStepsRef, (newVal) => {
    controller.setServiceStepsRef(newVal)
    controller.setServiceStepsPosition()
  })

  watch(
    documentSlipCaseRef,
    (newVal) => {
      controller.setDocumentSlipCaseRef(newVal)
    },
    { immediate: true }
  )

  watch(
    ongoingApplicationAlertRef,
    (newVal) => {
      if (newVal) {
        controller.setOngoingApplicationAlertRef(newVal)
      }
    },
    { immediate: true }
  )

  watch(
    serviceStepsCompomentRef,
    (newVal) => {
      controller.setServiceStepsComponentRef(newVal)
    },
    { immediate: true }
  )

  watch(
    () => controller.documentViewMode.value,
    (newVal) => {
      console.log("changed?", newVal)
      emit("viewModeChanged", newVal)
    }
  )

  defineExpose({
    enlarge: controller.enlarge.bind(controller),
    isDoneLoading: controller.isDoneLoading.bind(controller),
    handleDocumentClicked: controller.handleDocumentClicked.bind(controller),
    setCustomPaymentInstructions: controller.setCustomPaymentInstructions.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/CompanyServices/Service" as *;
</style>
