<template>
  <div
    id="company-service-bank-account-opening"
    class="company-services"
  >
    <div
      class="loader-container"
      v-if="controller.isLoading.value"
    >
      <LoaderPrepare
        :label="controller.loaderLabel()"
        :sublabel="controller.loaderSublabel()"
      />
    </div>

    <div
      class="no-record-found"
      v-if="controller.isShowNoRecord()"
    >
      <NoRecord
        :title="controller.noRecordFoundTitle()"
        :subtitle="controller.noRecordFoundSubtitle()"
      />
    </div>

    <div
      ref="companyDocumentsContainerRef"
      :class="{ show: controller.showResolution() }"
      class="company-documents-container show-full"
    >
      <div
        class="documents"
        :class="{ 'show-required': controller.isFilterRequiredAttention.value }"
        :style="controller.getStyleForDocumentWrapper()"
        @wheel.prevent="controller.onMouseScroll($event)"
        @mousedown="controller.onDragStart($event)"
        @mousemove.prevent="controller.onDragMove($event)"
        @mouseup.prevent="controller.onDragEnd()"
        @mouseleave.prevent="controller.onDragEnd()"
        @touchstart="controller.onDragStart($event)"
        @touchmove.prevent="controller.onDragMove($event)"
        @touchend="controller.onDragEnd()"
        @click="controller.onDocumentClicked()"
      >
        <div
          class="document"
          :style="controller.getStyle(0)"
        >
          <DcrBankAccountOpeningBankIslam v-bind="controller.resolutionDocumentProps" />
        </div>

        <div
          class="document not-required"
          v-for="(document, index) in controller.getStatutoryDocumentList()"
          :style="controller.getStyle(index + controller.getResolutionDocumentCount())"
          :key="index"
        >
          <canvas
            :ref="(el) => controller.setPdfCanvasRef(el)"
            class="canvas-content"
          />
        </div>
      </div>
    </div>

    <ActionTray
      v-if="controller.showResolution()"
      ref="actionTrayRef"
      :actions="controller.actionTrayElements.value"
    />

    <Teleport to="body">
      <div
        class="document-view"
        :class="{ show: controller.isDocumentZoomed.value }"
        @click.self="controller.closeZoom()"
      >
        <div class="wrapper">
          <DcrBankAccountOpeningBankIslam
            ref="dcrOnlineBankingRef"
            v-if="controller.zoomedDocumentIndex.value === 0"
            v-bind="controller.resolutionDocumentProps"
            @signed="controller.onSigned($event)"
          />

          <div
            class="statutory-form"
            :class="{ show: controller.isZoomStatutoryDocument() }"
          >
            <canvas ref="zoomStatutoryRef" />
          </div>
        </div>
      </div>

      <BankAccountOpeningChecklist
        v-if="controller.showChecklist()"
        ref="checklistRef"
        :bank-id="controller.bankId.value"
        :company-id="controller.companyId"
        :is-processing="controller.isShowProcessing()"
        :is-submitting="controller.isSubmitting.value"
        :has-paid="controller.hasPaid()"
        :is-checklist-visible="controller.isShowInfo.value"
        :application="controller.companyBankAccountOpening.value as CompanyBankAccountOpening"
        @close="controller.onCloseChecklist()"
        @back="controller.onBackButtonClicked()"
        @pay="controller.onProceedClicked()"
      />
    </Teleport>
    <UpdateApplicationNotice ref="updateApplicationNoticeRef" />
  </div>
</template>

<script setup lang="ts">
  import LoaderPrepare from "~/components/Loaders/Prepare.vue"
  import ActionTray from "~/components/ActionTrays/ActionTray.vue"
  import DcrBankAccountOpeningBankIslam from "../Resolutions/DcrBankAccountOpeningBankIslam.vue"
  import { BankAccountOpeningServiceController } from "~/scripts/components/company-services/BankAccountOpeningServiceController"
  import { EmitMessages } from "~/scripts/constants/EmitMessages"
  import BankAccountOpeningChecklist from "../Banks/BankAccountOpeningChecklist.vue"
  import UpdateApplicationNotice from "~/components/Popups/UpdateApplicationNotice.vue"
  import NoRecord from "../Placeholders/NoRecord.vue"
  import type { CompanyBankAccountOpening } from "~/scripts/models/CompanyBankAccountOpening"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
    showOptionButtons: {
      type: Boolean,
      default: true,
    },
    viewType: {
      type: String,
      required: true,
    },
    bankId: {
      type: String,
      required: true,
    },
  })

  const emit = defineEmits(EmitMessages.COMPANY_SERVICES)

  const companyDocumentsContainerRef = ref(null)
  const checklistRef = ref(null)
  const updateApplicationNoticeRef = ref(null)
  const actionTrayRef = ref(null)
  const zoomStatutoryRef = ref(null)

  const controller = new BankAccountOpeningServiceController(props.companyId, props.viewType, emit, props.bankId)

  onMounted(async () => {
    await nextTick()
    controller.setTotalPages()
    controller.handleDisplayedPage()
    window.addEventListener("scroll", controller.handleScroll.bind(controller))
  })

  onBeforeUnmount(() => {
    window.removeEventListener("scroll", controller.handleScroll.bind(controller))
  })

  watch(
    () => props.viewType,
    (newVal) => {
      controller.setViewType(newVal)
    }
  )

  watch(
    companyDocumentsContainerRef,
    (newVal) => {
      controller.setCompanyDocumentsContainerRef(newVal)
    },
    { immediate: true }
  )

  watch(
    checklistRef,
    (newVal) => {
      controller.setChecklistRef(newVal)
    },
    { immediate: true }
  )

  watch(
    updateApplicationNoticeRef,
    (newVal) => {
      controller.setUpdateApplicationNoticeRef(newVal)
    },
    { immediate: true }
  )

  watch(
    zoomStatutoryRef,
    (newVal) => {
      controller.setZoomStatutoryRef(newVal)
    },
    { immediate: true }
  )

  watch(
    actionTrayRef,
    (newVal) => {
      controller.setActionTrayRef(newVal)
    },
    { immediate: true }
  )

  defineExpose({
    isDoneLoading: controller.isDoneLoading.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/CompanyServices/BankAccountOpening" as *;
</style>
