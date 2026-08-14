<template>
  <div
    id="company-service-issuance-of-shares"
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
      @pay="emit('pay', $event)"
      @refresh="controller.initializeData()"
      @minimized="controller.onWrapperMinimized($event)"
      @preview="controller.onPreview()"
      @goToNew="emit(EmitMessages.GO_TO_NEW)"
      @goToExisting="emit(EmitMessages.GO_TO_EXISTING)"
      @shrouded="controller.onShrouded()"
      @applicationUpdated="controller.onApplicationUpdated($event)"
      @viewModeChanged="controller.onViewModeChanged($event)"
    >
      <template #resolutions>
        <TransitionGroup
          name="flip"
          tag="div"
          class="documents"
        >
          <DcrProposeAllotmentOfShares
            ref="dcrRef"
            v-if="controller.isShowingDcr.value"
            v-bind="controller.resolutionDocumentProps"
            @total-page-changed="controller.handleDoneLoading()"
          />
          <PreemptiveRightNotices
            v-if="!controller.isShowingDcr.value"
            :company-id="controller.companyId"
            :application-id="controller.companyShareIssuance.value.id"
            :show-watermark="controller.showWatermark()"
            :watermark-text="controller.watermarkText()"
            :is-in-preview-mode="controller.isInPreviewMode.value"
            @total-page-changed="controller.handleDoneLoading()"
          />
        </TransitionGroup>
      </template>
      <template #step-status>
        <div v-if="controller.isStepStatusVisible()">
          <b>{{ controller.noticeStatus() }}</b>
          <div class="notice-sublabel">
            {{ controller.noticeStatusSublabel() }}
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
                @click="controller.onShowPrnClicked()"
              >
                <span class="sub-option-label">
                  {{ controller.prnLabel() }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #pasca-custom-confirmation>
        <div v-if="controller.isMajorityReached()">
          <div
            class="confirmation-step-notes"
            v-html="controller.confirmationCopywriting()"
          />
          <div
            v-if="controller.isConfirmationRequired"
            class="step-buttons"
          >
            <button
              class="btn btn-danger"
              @click="emit('revoke')"
            >
              {{ controller.confirmationButtonRevokeLabel() }}
            </button>
            <button
              class="btn btn-submit"
              @click="controller.onIssuanceClicked()"
            >
              {{ controller.confirmationButtonAcceptLabel() }}
            </button>
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
    <ActionTray
      v-if="controller.showActionTray()"
      ref="actionTrayRef"
      :actions="controller.actionTrayElements.value"
    />
    <Teleport to="body">
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
              <div class="content">
                <ul>
                  <li
                    v-for="(point, i) in controller.alertContentPoints()"
                    :key="i"
                  >
                    <span v-html="point" />
                  </li>
                </ul>
              </div>
            </template>
          </Alert>
        </Transition>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import ActionTray from "../ActionTrays/ActionTray.vue"
  import Alert from "@/components/Alerts/Alert.vue"
  import DcrProposeAllotmentOfShares from "../Resolutions/DcrProposeAllotmentOfShares.vue"
  import PreemptiveRightNotices from "../Shareholders/AllotmentOfShares/PreemptiveRightNotices.vue"
  import CompanyServiceWrapper from "@/components/CompanyServices/CompanyServiceWrapper.vue"
  import { ShareIssuanceServiceController } from "~/scripts/components/company-services/ShareIssuanceServiceController"
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

  const controller = new ShareIssuanceServiceController(props.companyId, props.viewType, emit)

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
  @use "~/assets/scss/components/CompanyServices/ShareIssuance" as *;
</style>
