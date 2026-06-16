<template>
  <div
    id="company-service-lodge-annual-return"
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
      @preview="controller.onPreview()"
      @goToNew="emit(EmitMessages.GO_TO_NEW)"
      @goToExisting="emit(EmitMessages.GO_TO_EXISTING)"
      @shrouded="controller.onShrouded()"
      @view-mode-changed="controller.onViewModeChanged($event)"
      @application-updated="controller.onApplicationUpdated($event)"
    >
      <template #resolutions>
        <TransitionGroup
          name="flip"
          tag="div"
          class="documents"
        >
          <DcrLodgeAnnualReturn
            ref="dcrRef"
            v-if="controller.isShowingDcr.value"
            v-bind="controller.resolutionDocumentProps"
            @total-page-changed="controller.handleDoneLoading()"
          />
          <Section68
            v-if="!controller.isShowingDcr.value"
            :company-id="controller.companyId"
            :annual-return-year="controller.yearToLodge.value"
          />
        </TransitionGroup>
      </template>
      <template #step-status>
        <div v-if="controller.hasPaid()">
          <b>{{ controller.pascaStatus() }}</b>
          <div>
            {{ controller.submissionDate() }}
          </div>
          <div class="documents-options">
            <div
              class="option-button-dropdown"
              :class="{ 'dropdown-show': controller.isShowDocumentOptions.value }"
            >
              <div
                class="btn btn-option active"
                @click="controller.onDocumentOptionsClicked()"
              >
                <span class="option-label">
                  {{ controller.documentOptionsLabel() }}
                </span>
                <span
                  class="caret"
                  :class="{ hide: controller.isShowDocumentOptions.value }"
                >
                  <i class="fa-solid fa-caret-down" />
                </span>
              </div>
              <div
                class="btn btn-sub-option"
                :class="{ show: controller.isShowDocumentOptions.value }"
                @click="controller.onShowResolutionClicked()"
              >
                <span class="sub-option-label">
                  {{ controller.dcrName() }}
                </span>
              </div>
              <div
                class="btn btn-sub-option"
                :class="{ show: controller.isShowDocumentOptions.value }"
                @click="controller.onShowSection68Clicked()"
              >
                <span class="sub-option-label">
                  {{ controller.section68Label() }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #pasca-custom-confirmation>
        <div v-if="controller.hasPaid()">
          <b>{{ controller.confirmationLabel() }}</b>
          <div class="confirmation-sublabel">
            {{ controller.confirmationSublabel() }}
          </div>
        </div>
      </template>
      <template #learnMoreButton>
        <div
          class="learn-more"
          @click="controller.onMoreInfoClicked()"
        >
          {{ controller.learnMoreLabel() }}
        </div>
      </template>
      <template #cornerButton>
        <div class="action-buttons">
          <button
            class="btn btn-standard btn-primary"
            @click="controller.onMoreInfoClicked()"
          >
            {{ controller.learnMoreLabel() }}
          </button>
          <button
            v-if="controller.showCornerButton()"
            class="btn btn-standard btn-pay"
            @click="controller.onProceedClicked()"
          >
            {{ controller.payLabel() }}
          </button>
        </div>
      </template>
    </CompanyServiceWrapper>
    <Teleport to="body">
      <OutstandingAnnualReturnPayment
        ref="outstandingAnnualReturnPaymentRef"
        @back="controller.onSkipPayingForOutstandings()"
        @proceed="controller.onPayForOutstandings()"
      />
      <div
        class="alert-tray"
        :class="{ show: controller.isShowInfo.value }"
      >
        <Transition name="alert-appear">
          <Alert
            :is-dismissible="true"
            :type="'default'"
            :is-show="controller.isShowInfo.value"
            @hide="controller.onMoreInfoClicked()"
          >
            <template #alertContent>
              <div class="title">
                {{ controller.alertTitle() }}
              </div>
              <div
                class="content"
                v-html="controller.alertContent()"
                @click="controller.onGlossaryLinkClicked($event)"
              />
            </template>
          </Alert>
        </Transition>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
  import DcrLodgeAnnualReturn from "@/components/Resolutions/DcrLodgeAnnualReturn.vue"
  import CompanyServiceWrapper from "@/components/CompanyServices/CompanyServiceWrapper.vue"
  import OutstandingAnnualReturnPayment from "../Popups/OutstandingAnnualReturnPayment.vue"
  import Alert from "../Alerts/Alert.vue"
  import Section68 from "../LegalDocuments/Section68.vue"
  import { EmitMessages } from "~/scripts/constants/EmitMessages"
  import { LodgeAnnualReturnServiceController } from "~/scripts/components/company-services/LodgeAnnualReturnServiceController"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
    showOptionButtons: {
      type: Boolean,
      default: true,
    },
    yearToLodge: {
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
  const mcrRef = ref(null)
  const wrapperRef = ref(null)
  const outstandingAnnualReturnPaymentRef = ref(null)

  const controller = new LodgeAnnualReturnServiceController(props.companyId, props.yearToLodge, props.viewType, emit)

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
    () => props.yearToLodge,
    (newVal) => {
      controller.setYearToLodge(newVal)
    }
  )

  watch(
    () => controller.eventManager.isItemRemovedFromCart,
    (newVal) => {
      controller.handlePostDelete()
    }
  )

  watch(
    outstandingAnnualReturnPaymentRef,
    (newVal) => {
      if (newVal) {
        controller.setOutstandingAnnualReturnPaymentRef(newVal)
      }
    },
    { immediate: true }
  )

  defineExpose({
    isDoneLoading: controller.isDoneLoading.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/CompanyServices/Service" as *;
  @use "~/assets/scss/components/CompanyServices/LodgeAnnualReturn" as *;
</style>
