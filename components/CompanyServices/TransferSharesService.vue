<template>
  <div
    id="company-service-transfer-shares-service"
    :class="{ 'service-unpaid': !controller.hasPaid }"
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
    <template v-if="!controller.isLoading.value">
      <div
        id="transfer-of-shares-documents"
        class="company-services"
        :class="{
          'move-left': controller.isShowHiddenDocuments,
          'mask-document': controller.isShowingHiddenDocuments,
        }"
      >
        <CompanyServiceWrapper
          v-if="!controller.isLoading.value"
          ref="wrapperRef"
          v-bind="controller.serviceWrapperProps"
          @back="controller.onBackButtonClicked()"
          @proceed="controller.onProceedClicked()"
          @pay="emit('pay', $event)"
          @refresh="controller.initializeData()"
          @minimized="controller.onWrapperMinimized($event)"
          @go-to-page="controller.goToPage($event)"
          @shrouded="controller.onShrouded()"
          @goToNew="emit(EmitMessages.GO_TO_NEW)"
          @goToExisting="emit(EmitMessages.GO_TO_EXISTING)"
          @application-updated="controller.onApplicationUpdated($event)"
        >
          <template #resolutions>
            <TransitionGroup
              name="flip"
              tag="div"
              class="documents"
            >
              <NoticeTransferOfShareProposal
                v-for="(shareholder, index) in controller.shareholders.value"
                :key="index"
                :transfer-id="controller.companyShareholderTransfer.value.id"
                :shareholder-id="shareholder.id"
                :company-id="controller.companyId"
                :show-watermark="controller.showWatermark()"
                :watermark-text="controller.watermarkText()"
                :is-in-preview-mode="controller.isInPreviewMode.value"
                @total-page-changed="controller.handleDoneLoading()"
              />
            </TransitionGroup>
          </template>
          <template #pasca-custom-affirmation>
            <div class="step-content">
              <b>{{ controller.noticeResponseLabel }}</b>
              <div class="signature-markers">
                <div
                  v-for="shareholder in controller.shareholderRanges"
                  class="signature-marker"
                  :class="{ signed: shareholder < controller.numberOfResponses }"
                >
                  <i class="fa-solid fa-user" />
                </div>
              </div>
            </div>
            <div class="step-content">
              <b>{{ controller.section105Label }}</b>
              <div
                class="step-sub-content"
                v-html="controller.section105Status"
              />
              <div
                class="step-buttons"
                v-if="controller.hasTransferDetails"
              >
                <button
                  class="btn btn-submit"
                  @click="controller.onViewSection105Clicked()"
                >
                  {{ controller.viewLabel }}
                </button>
              </div>
            </div>
          </template>
          <template #step-status>
            <div class="step-content">
              <b>{{ controller.registerTransfer }}</b>
              <div v-if="!controller.haveAllSigned()">
                {{ controller.pendingRegisterLabel }}
              </div>
              <div
                class="step-buttons"
                v-if="controller.haveAllSigned()"
              >
                <button
                  class="btn btn-submit"
                  @click="controller.onViewRegisterClicked()"
                >
                  {{ controller.registerLabel }}
                </button>
              </div>
            </div>
          </template>
          <template #pasca-custom-confirmation>
            <b>{{ controller.confirmationLabel }}</b>
            <div class="step-buttons">
              <button class="btn btn-submit">
                {{ controller.downloadROM }}
              </button>
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
      </div>
      <div
        class="hidden-documents"
        :class="{ show: controller.isShowHiddenDocuments }"
      >
        <Section105Service
          v-if="controller.isShowSection105Container"
          :companyId="controller.companyId"
          :viewType="controller.viewType.value"
          @back="controller.onCloseSection105()"
        />
        <RegisterTransferOfSharesService
          v-if="controller.isShowRegister.value"
          :companyId="controller.companyId"
          :viewType="controller.viewType.value"
          @back="controller.onCloseRegister()"
        />
      </div>
    </template>

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
  import ActionTray from "../ActionTrays/ActionTray.vue"
  import Alert from "../Alerts/Alert.vue"
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import CompanyServiceWrapper from "@/components/CompanyServices/CompanyServiceWrapper.vue"
  import NoticeTransferOfShareProposal from "../LegalDocuments/NoticeTransferOfShareProposal.vue"
  import RegisterTransferOfSharesService from "./RegisterTransferOfSharesService.vue"
  import Section105Service from "./Section105Service.vue"
  import { EmitMessages } from "~/scripts/constants/EmitMessages"
  import { TransferSharesServiceController } from "~/scripts/components/company-services/TransferSharesServiceController"

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

  const controller = new TransferSharesServiceController(props.companyId, props.viewType, emit)

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
  @use "~/assets/scss/components/CompanyServices/TransferSharesService" as *;
</style>
