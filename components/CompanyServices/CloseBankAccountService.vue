<template>
  <div
    id="company-services-close-bank-account-service"
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
          <DcrClosureOfBankAccount
            ref="dcrRef"
            v-bind="controller.resolutionDocumentProps"
            @total-page-changed="controller.handleDoneLoading()"
          />
        </TransitionGroup>
      </template>
      <template #step-status>
        <b>{{ controller.status }}</b>
        <br />
        {{ controller.statusSubnote }}
        <br />
        <div
          class="step-buttons"
          v-if="!controller.isDelivered"
        >
          <button
            class="btn btn-submit"
            :class="{ 'is-loading': controller.isUpdatingStatus.value }"
            @click="controller.onDeliveredClicked()"
          >
            {{ controller.deliveryLabel }}
          </button>
        </div>
      </template>
      <template #pasca-custom-confirmation>
        <b>{{ controller.confirmation }}</b>
        <br />
        {{ controller.confirmationSubnote }}

        <div class="step-buttons">
          <button
            class="btn btn-submit"
            :class="{ 'is-loading': controller.isUpdatingStatus.value }"
            @click="controller.onCompleteServiceClicked()"
          >
            {{ controller.completedLabel }}
          </button>
          <input
            type="file"
            ref="fileInput"
            class="hidden"
            accept=".pdf"
            @change="controller.uploadAndComplete($event)"
          />
        </div>
      </template>
      <template #cornerButton>
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
    <!-- <Teleport to="body">
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
    </Teleport> -->
  </div>
</template>

<script lang="ts" setup>
  import ActionTray from "@/components/ActionTrays/ActionTray.vue"
  import Alert from "@/components/Alerts/Alert.vue"
  import DcrClosureOfBankAccount from "@/components/Resolutions/DcrClosureOfBankAccount.vue"
  import CompanyServiceWrapper from "@/components/CompanyServices/CompanyServiceWrapper.vue"
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import { EmitMessages } from "~/scripts/constants/EmitMessages"
  import { CloseBankAccountServiceController } from "~/scripts/components/company-services/CloseBankAccountServiceController"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
    companyBankId: {
      type: [String, null],
      default: null,
    },
    viewType: {
      type: String,
      required: true,
    },
  })

  const emit = defineEmits(EmitMessages.COMPANY_SERVICES)

  const dcrRef = ref(null)
  const wrapperRef = ref(null)
  const fileInput = ref(null)

  const controller = new CloseBankAccountServiceController(props.companyId, props.companyBankId, props.viewType, emit)

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
    fileInput,
    (newVal) => {
      controller.setFileInput(newVal)
    },
    { immediate: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/CompanyServices/Service" as *;
  @use "~/assets/scss/components/CompanyServices/CloseBankAccountService" as *;
</style>
