<template>
  <div
    id="company-service-change-of-name"
    class="company-services"
  >
    <CompanyServiceWrapper
      ref="wrapperRef"
      v-bind="controller.serviceWrapperProps"
      @go-to-page="controller.goToPage($event)"
      @back="controller.onBackButtonClicked()"
      @proceed="controller.onProceedClicked()"
      @pay="emit('pay', $event)"
      @refresh="controller.initializeData()"
      @minimized="controller.onWrapperMinimized($event)"
      @goToExisting="emit(EmitMessages.GO_TO_EXISTING)"
      @view-mode-changed="controller.onViewModeChanged($event)"
    >
      <template #resolutions>
        <TransitionGroup
          name="flip"
          tag="div"
          class="documents"
        >
          <DcrSetFinancialYearEnd
            v-if="controller.showSetFYE.value"
            ref="setFyeRef"
            :company-id="controller.companyId"
            :application-id="controller.companySetFinancialYearEnd.value.id"
            :type="controller.companySetFinancialYearEnd.value.type"
            :is-in-preview-mode="controller.isInPreviewMode.value"
            :show-watermark="controller.showWatermark()"
            :watermark-text="controller.watermarkText()"
            @total-page-changed="controller.handleDoneLoading()"
          />
          <DcrAppointResponsiblePerson
            v-if="controller.showAppointResponsiblePerson.value"
            ref="appointResponsiblePersonRef"
            :company-id="controller.companyId"
            :application-id="controller.companyFinancialStatementAuthorisedPerson.value.id"
            :financial-period-id="controller.companyFinancialStatementAuthorisedPerson.value.financialPeriodId ?? ''"
            :is-in-preview-mode="controller.isInPreviewMode.value"
            :show-watermark="controller.showWatermark()"
            :watermark-text="controller.watermarkText()"
            @total-page-changed="controller.handleDoneLoading()"
          />
        </TransitionGroup>
      </template>
      <template #step-status>
        <div v-if="controller.isStepStatusVisible()">
          <div v-if="!controller.isSubmittedToSSM()">
            {{ controller.processingLabel() }}
            <i class="fa-solid fa-loader fa-spin"></i>
          </div>

          <div v-if="controller.isSubmittedToSSM()">
            <b>{{ controller.submittedToSsmLabel() }}:</b>
            <div class="step-date">
              {{ controller.getSubmissionDate() }}
              <i class="check-icon fa-solid fa-circle-check"></i>
            </div>

            <div class="step-buttons">
              <button
                class="btn btn-submit"
                @click="controller.onPayForAccess()"
              >
                {{ controller.payForAccessLabel() }}
              </button>
            </div>
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
  </div>
</template>

<script setup lang="ts">
  import DcrSetFinancialYearEnd from "../Resolutions/DcrSetFinancialYearEnd.vue"
  import DcrAppointResponsiblePerson from "../Resolutions/DcrAppointResponsiblePerson.vue"
  import CompanyServiceWrapper from "@/components/CompanyServices/CompanyServiceWrapper.vue"
  import { PrepareFinancialStatementServiceController } from "~/scripts/components/company-services/PrepareFinancialStatementsServiceController"
  import { EmitMessages } from "~/scripts/constants/EmitMessages"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
    showSetFYE: {
      type: Boolean,
      default: false,
    },
    showAppointResponsiblePerson: {
      type: Boolean,
      default: false,
    },
    showAppointAuditor: {
      type: Boolean,
      default: false,
    },
    isPartOfBundle: {
      type: Boolean,
      default: false,
    },
    hasMoreThanOneDirector: {
      type: Boolean,
      default: false,
    },
    viewType: {
      type: String,
      required: true,
    },
  })

  const emit = defineEmits(EmitMessages.COMPANY_SERVICES)

  const setFyeRef = ref(null)
  const appointResponsiblePersonRef = ref(null)
  const appointAuditorRef = ref(null)
  const wrapperRef = ref(null)

  const controller = new PrepareFinancialStatementServiceController(
    props.companyId,
    props.showSetFYE,
    props.showAppointResponsiblePerson,
    props.showAppointAuditor,
    props.isPartOfBundle,
    props.hasMoreThanOneDirector,
    props.viewType,
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
    () => props.isPartOfBundle,
    (newVal) => {
      controller.setIsPartOfBundle(newVal)
    }
  )

  watch(
    () => props.hasMoreThanOneDirector,
    (newVal) => {
      controller.setHasMoreThanOneDirector(newVal)
    }
  )

  watch(
    wrapperRef,
    (newVal) => {
      controller.setWrapperRef(newVal)
    },
    { immediate: true }
  )

  watch(
    setFyeRef,
    (newVal) => {
      controller.setSetFyeRef(newVal)
    },
    { immediate: true }
  )

  watch(
    appointResponsiblePersonRef,
    (newVal) => {
      controller.setAppointResponsiblePersonRef(newVal)
    },
    { immediate: true }
  )

  watch(
    appointAuditorRef,
    (newVal) => {
      controller.setAppointAuditorRef(newVal)
    },
    { immediate: true }
  )

  watch(
    () => controller.eventManager.isItemRemovedFromCart,
    (newVal) => {
      controller.handlePostDelete()
    }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/CompanyServices/Service" as *;
</style>
