<template>
  <div
    id="company-service-appointment-of-tax-agent"
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
      ref="wrapperRef"
      v-if="!controller.isLoading.value"
      v-bind="controller.serviceWrapperProps"
      @go-to-page="controller.goToPage($event)"
      @back="controller.onBackButtonClicked()"
      @pay="emit('pay', $event)"
      @refresh="controller.initializeData()"
      @minimized="controller.onWrapperMinimized($event)"
      @preview="controller.onPreview()"
      @shrouded="controller.onShrouded()"
      @view-mode-changed="controller.onViewModeChanged($event)"
      @goToNew="emit(EmitMessages.GO_TO_NEW)"
      @goToExisting="emit(EmitMessages.GO_TO_EXISTING)"
    >
      <template #resolutions>
        <TransitionGroup
          name="flip"
          tag="div"
          class="documents"
        >
          <DcrAppointmentOfTaxAgent
            ref="dcrRef"
            v-bind="controller.resolutionDocumentProps"
            @total-page-changed="controller.handleDoneLoading()"
          />
        </TransitionGroup>
      </template>
    </CompanyServiceWrapper>
  </div>
</template>

<script setup lang="ts">
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import CompanyServiceWrapper from "@/components/CompanyServices/CompanyServiceWrapper.vue"
  import { EmitMessages } from "~/scripts/constants/EmitMessages"
  import { AppointmentOfTaxAgentServiceController } from "~/scripts/components/company-services/AppointmentOfTaxAgentServiceController"
  import DcrAppointmentOfTaxAgent from "../Resolutions/DcrAppointmentOfTaxAgent.vue"

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

  const wrapperRef = ref(null)
  const actionTrayRef = ref(null)
  const dcrRef = ref(null)
  const resolutionDateConfirmationPopupRef = ref(null)

  const controller = new AppointmentOfTaxAgentServiceController(props.companyId, props.viewType, emit)

  const handleScroll = controller.handleScroll.bind(controller)

  onMounted(async () => {
    await nextTick()
    controller.setTotalPages()
    controller.handleDisplayedPage()
    window.addEventListener("scroll", handleScroll)
  })

  onBeforeUnmount(() => {
    window.removeEventListener("scroll", handleScroll)
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
    resolutionDateConfirmationPopupRef,
    (newVal) => {
      controller.setResolutionDateConfirmationPopupRef(newVal)
    },
    { immediate: true }
  )

  defineExpose({
    onDownloadClicked: controller.onDownloadClicked.bind(controller),
    onGenerateBlob: controller.onGenerateBlob.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/CompanyServices/Service" as *;
</style>
