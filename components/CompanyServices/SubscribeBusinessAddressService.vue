<template>
  <div
    id="company-service-change-of-business-branch"
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
      @minimized="controller.onWrapperMinimized($event)"
      @preview="controller.onPreview()"
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
          <DcrSubscribeBusinessAddress
            ref="dcrRef"
            v-bind="controller.resolutionDocumentProps"
            @total-page-changed="controller.handleDoneLoading()"
          />
        </TransitionGroup>
      </template>
      <template #step-status>
        <div v-if="controller.isStepStatusVisible()">
          {{ controller.completedLabel() }}
        </div>
      </template>
      <template #pasca-custom-confirmation>
        <div v-if="controller.isStepStatusVisible()">
          <b>{{ controller.deemedAcceptedLabel() }}</b>
          <br />
          {{ controller.firstSignatureDate() }}
        </div>
      </template>
      <template #cornerButton>
        <button
          v-if="controller.showCornerButton()"
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
      </template>
      <template #learnMoreButton>
        <div
          class="learn-more"
          @click="controller.onMoreInfoClicked()"
        >
          {{ controller.learnMoreLabel() }}
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
  import ActionTray from "../ActionTrays/ActionTray.vue"
  import Alert from "../Alerts/Alert.vue"
  import CompanyServiceWrapper from "@/components/CompanyServices/CompanyServiceWrapper.vue"
  import DcrSubscribeBusinessAddress from "../Resolutions/DcrSubscribeBusinessAddress.vue"
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import { SubscribeBusinessAddressServiceController } from "~/scripts/components/company-services/SubscribeBusinessAddressServiceController"
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

  const controller = new SubscribeBusinessAddressServiceController(props.companyId, props.viewType, emit)

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
