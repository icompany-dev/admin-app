<template>
  <div
    id="company-service-issuance-of-shares"
    class="company-services"
  >
    <CompanyServiceWrapper
      v-if="!controller.isLoading.value"
      ref="wrapperRef"
      v-bind="controller.serviceWrapperProps"
      @go-to-page="controller.goToPage($event)"
      @back="controller.onBackButtonClicked()"
      @proceed="controller.onProceedClicked()"
      @pay="emit('pay', $event)"
      @refresh="controller.initializeData()"
      @minimized="controller.onWrapperMinimized($event)"
      @preview="controller.onPreview()"
      @goToNew="emit(EmitMessages.GO_TO_NEW)"
      @goToExisting="emit(EmitMessages.GO_TO_EXISTING)"
      @shrouded="controller.onShrouded()"
    >
      <template #resolutions>
        <TransitionGroup
          name="flip"
          tag="div"
          class="documents"
        >
          <Section105
            :company-shareholder-transfer="controller.getShareTransfer()"
            :shareholder-id="controller.shareholderId.value"
            :company-share-transfer-detail="controller.getFirstTransferDetail()"
            :company-id="controller.companyId"
            :show-watermark="controller.showWatermark()"
            :watermark-text="controller.watermarkText()"
            :is-in-preview-mode="controller.isInPreviewMode.value"
            @total-page-changed="controller.handleDoneLoading()"
          />
        </TransitionGroup>
      </template>
      <template #pasca-custom-affirmation>
        <div
          v-for="(transferDetail, index) in controller.companyShareholderTransfer.value.transferDetails"
          :key="index"
          class="step-content"
        >
          <b>From:</b>
          <br />
          {{ transferDetail.transferFromName.toUpperCase() }}
          <i
            class="fa-solid fa-circle-check"
            v-if="transferDetail.fromSignatureId"
          />
          <br />
          <b>To:</b>
          <br />
          {{ transferDetail.transferToName?.toUpperCase() }}
          <i
            class="fa-solid fa-circle-check"
            v-if="transferDetail.toSignatureId"
          />
        </div>
      </template>
      <template #step-status>
        <div v-if="controller.isProcessingTransfer">
          {{ controller.processingLabel() }}
          <i class="fa-solid fa-loader fa-spin"></i>
        </div>
        <div v-if="controller.isSubmittedToSSM()">
          <b>{{ controller.submittedToSsmLabel() }}:</b>
          <div class="step-date">
            {{ controller.getSubmissionDate() }}
            <i class="check-icon fa-solid fa-circle-check"></i>
          </div>
        </div>
      </template>
      <template #cornerButton>
        <button
          v-if="controller.showCornerButton()"
          class="btn btn-standard btn-pay"
          @click="controller.onProceedClicked()"
        >
          {{ controller.payLabel() }}
        </button>
      </template>
    </CompanyServiceWrapper>
    <ActionTray
      v-if="!controller.isLoading.value"
      :actions="controller.actionTrayElements.value"
    />
  </div>
</template>

<script setup lang="ts">
  import ActionTray from "../ActionTrays/ActionTray.vue"
  import Section105 from "../LegalDocuments/Section105.vue"
  import CompanyServiceWrapper from "@/components/CompanyServices/CompanyServiceWrapper.vue"
  import { Section105ServiceController } from "~/scripts/components/company-services/Section105ServiceController"
  import { EmitMessages } from "~/scripts/constants/EmitMessages"

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
  })

  const emit = defineEmits(EmitMessages.COMPANY_SERVICES)

  const dcrRef = ref(null)
  const mcrRef = ref(null)
  const wrapperRef = ref(null)

  const controller = new Section105ServiceController(props.companyId, props.viewType, emit)

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
    dcrRef,
    (newVal) => {
      controller.setDcrRef(newVal)
    },
    { immediate: true }
  )

  watch(
    mcrRef,
    (newVal) => {
      controller.setMcrRef(newVal)
    },
    { immediate: true }
  )

  watch(
    wrapperRef,
    (newVal) => {
      controller.setWrapperRef(newVal)
    },
    { immediate: true }
  )

  watch(
    () => controller.eventManager.isItemRemovedFromCart,
    (newVal) => {
      controller.handlePostDelete()
    }
  )

  defineExpose({
    isDoneLoading: controller.isDoneLoading.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/CompanyServices/Service" as *;
</style>
