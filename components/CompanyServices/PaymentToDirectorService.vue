<template>
  <div
    id="company-service-payment-to-director"
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
    <CompanyServiceWrapper
      v-if="!controller.isLoading.value"
      ref="wrapperRef"
      v-bind="controller.serviceWrapperProps"
      :slip-case-title="controller.slipCaseTitle()"
      @go-to-page="controller.goToPage($event)"
      @back="controller.onBackButtonClicked()"
      @proceed="controller.onProceedClicked()"
      @pay="emit('pay')"
      @refresh="controller.initializeData()"
      @preview="controller.onPreview()"
      @shrouded="controller.onShrouded()"
      @view-mode-changed="controller.onViewModeChanged($event)"
      @minimized="controller.setApplicationData($event)"
      @application-updated="controller.onApplicationUpdated($event)"
      @goToNew="emit(EmitMessages.GO_TO_NEW)"
      @go-to-existing="emit(EmitMessages.GO_TO_EXISTING)"
    >
      <template #resolutions>
        <TransitionGroup
          name="flip"
          tag="div"
          class="documents"
        >
          <!-- <PaymentToDirector
            :company-id="controller.companyId"
            :application-id="controller.companyDirectorPayment.value.id"
            :is-in-preview-mode="controller.isInPreviewMode.value"
            :show-watermark-text="controller.showWatermark()"
            :watermark-text="controller.watermarkText()"
            @back="controller.onUpdatingDocument()"
            @applicationUpdated="controller.onDocumentUpdated()"
          /> -->
          <DcrPaymentToDirector
            v-if="!controller.isShowMcrFirst"
            ref="dcrRef"
            v-bind="controller.resolutionDocumentProps"
            @total-page-changed="controller.handleDoneLoading()"
          />
          <McrPaymentToDirector
            v-if="controller.isShowMcrFirst"
            ref="mcrRef"
            v-bind="controller.resolutionDocumentProps"
            @total-page-changed="controller.handleDoneLoading()"
          />
        </TransitionGroup>
      </template>
    </CompanyServiceWrapper>
  </div>
</template>

<script setup lang="ts">
  import ActionTray from "../ActionTrays/ActionTray.vue"
  import PaymentToDirector from "../ServiceWrappers/PaymentToDirector.vue"
  import DcrPaymentToDirector from "../Resolutions/DcrPaymentToDirector.vue"
  import McrPaymentToDirector from "../Resolutions/McrPaymentToDirector.vue"
  import CompanyServiceWrapper from "@/components/CompanyServices/CompanyServiceWrapper.vue"
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import { PaymentToDirectorServiceController } from "~/scripts/components/company-services/PaymentToDirectorServiceController"
  import { EmitMessages } from "~/scripts/constants/EmitMessages"
  import { TypeOfPaymentToDirectors } from "~/scripts/constants/PaymentToDirectors"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
    viewType: {
      type: String,
      required: true,
    },
    typeOfPayment: {
      type: String,
      required: true,
    },
  })

  const emit = defineEmits(EmitMessages.COMPANY_SERVICES)

  const dcrRef = ref(null)
  const wrapperRef = ref(null)

  const controller = new PaymentToDirectorServiceController(
    props.companyId,
    props.viewType,
    props.typeOfPayment as TypeOfPaymentToDirectors,
    emit
  )

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
    () => props.typeOfPayment,
    (newVal) => {
      controller.setTypeOfPayment(newVal as TypeOfPaymentToDirectors)
    }
  )

  watch(
    dcrRef,
    (newVal) => {
      controller.setDcrRef(newVal)
    },
    { immediate: true }
  )

  defineExpose({
    onDownloadClicked: controller.onDownloadClicked.bind(controller),
    onGenerateBlob: controller.onGenerateBlob.bind(controller),
    onMoveToForms: controller.onMoveToForms.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/CompanyServices/Service" as *;
</style>
