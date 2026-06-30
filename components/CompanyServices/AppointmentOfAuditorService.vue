<template>
  <div
    id="company-service-appoint-auditor"
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
          <DcrAppointmentOfAuditor
            ref="dcrRef"
            v-bind="controller.resolutionDocumentProps"
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
        <!-- <button
          v-if="controller.showCornerButton()"
          class="btn btn-standard btn-primary"
          @click="controller.onMoreInfoClicked()"
        >
          {{ controller.learnMoreLabel() }}
        </button> -->
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
      v-if="controller.showActionTray()"
      ref="actionTrayRef"
      :actions="controller.actionTrayElements.value"
    />
    <Teleport to="body">
      <AuditorPartners
        ref="auditorPartnerRef"
        :company-id="controller.companyId"
        @back="controller.onCancelAuditorPartnerSelection()"
        @proceed="controller.onAuditorPartnerSelected($event)"
      />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
  import DcrAppointmentOfAuditor from "../Resolutions/DcrAppointmentOfAuditor.vue"
  import CompanyServiceWrapper from "@/components/CompanyServices/CompanyServiceWrapper.vue"
  import ActionTray from "../ActionTrays/ActionTray.vue"
  import AuditorPartners from "../Popups/AuditorPartners.vue"
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import { AppointmentOfAuditorServiceController } from "~/scripts/components/company-services/AppointmentOfAuditorServiceController"
  import { EmitMessages } from "~/scripts/constants/EmitMessages"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
    viewType: {
      type: String,
      required: true,
    },
  })
  const emit = defineEmits(EmitMessages.COMPANY_SERVICES)

  const dcrRef = ref(null)
  const wrapperRef = ref(null)
  const actionTrayRef = ref(null)
  const auditorPartnerRef = ref(null)

  const controller = new AppointmentOfAuditorServiceController(props.companyId, props.viewType, emit)

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
    wrapperRef,
    (newVal) => {
      controller.setWrapperRef(newVal)
    },
    { immediate: true }
  )

  // watch(
  //   actionTrayRef,
  //   (newVal) => {
  //     controller.setActionTrayRef(newVal)
  //   },
  //   { immediate: true }
  // )
  watch(
    auditorPartnerRef,
    (newVal) => {
      controller.setAuditorPartnerRef(newVal)
    },
    { immediate: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/CompanyServices/Service" as *;
</style>
