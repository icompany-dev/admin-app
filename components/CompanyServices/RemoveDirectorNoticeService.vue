<template>
  <div
    id="company-service-remove-director-notice-service"
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
      @goToExisting="emit(EmitMessages.GO_TO_EXISTING)"
      @minimized="controller.setApplicationData($event)"
      @view-mode-changed="controller.onViewModeChanged($event)"
      @application-updated="controller.onApplicationUpdated($event)"
    >
      <template #resolutions>
        <TransitionGroup
          name="flip"
          tag="div"
          class="documents"
        >
          <NoticeRemovalOfDirector
            ref="noticeRef"
            :company-id="controller.companyId"
            :application-id="controller.companyDirectorRemoval.value.id"
            :is-in-preview-mode="controller.isInPreviewMode.value"
            :show-watermark="controller.showWatermark()"
            :watermark-text="controller.watermarkText()"
          />
          <DcrConveneRemoveDirectorMeeting
            ref="dcrRef"
            v-bind="controller.resolutionDocumentProps"
          />
        </TransitionGroup>
      </template>
      <template #pasca-custom-affirmation>
        <b>{{ controller.specialNoticeLabel }}</b>
        <div
          class="signature-markers"
          v-if="!controller.isSpecialNoticeCompleted"
        >
          <div
            class="signature-marker"
            v-for="(s, index) in controller.shareholderRange"
            :key="index"
            :class="{ signed: index < controller.signaturesForSpecialNotice.length }"
          >
            <i class="fa-solid fa-user" />
          </div>
        </div>
        <div v-if="controller.isSpecialNoticeCompleted">
          <b>{{ controller.completedLabel }} :</b>
          <span class="step-date">
            {{ controller.specialNoticeDateOfCompletion }}
            <i class="check-icon fa-solid fa-circle-check"></i>
          </span>
        </div>
        <br />
        <b>{{ controller.dcrConveneLabel }}</b>
        <div
          class="signature-markers"
          v-if="!controller.isDcrToConveneCompleted"
        >
          <div
            class="signature-marker"
            v-for="(s, index) in controller.directorRange"
            :key="index"
            :class="{ signed: index < controller.signaturesForDcrConvene.length }"
          >
            <i class="fa-solid fa-user" />
          </div>
        </div>
        <div v-if="controller.isDcrToConveneCompleted">
          <b>{{ controller.completedLabel }} :</b>
          <span class="step-date">
            {{ controller.dcrConveneDateOfCompletion }}
            <i class="check-icon fa-solid fa-circle-check"></i>
          </span>
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
        @click.self="controller.onMoreInfoClicked()"
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

<script lang="ts" setup>
  import ActionTray from "../ActionTrays/ActionTray.vue"
  import Alert from "../Alerts/Alert.vue"
  import CompanyServiceWrapper from "@/components/CompanyServices/CompanyServiceWrapper.vue"
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import NoticeRemovalOfDirector from "@/components/LegalDocuments/NoticeRemovalOfDirector.vue"
  import DcrConveneRemoveDirectorMeeting from "../Resolutions/DcrConveneRemoveDirectorMeeting.vue"
  import { RemoveDirectorNoticeServiceController } from "~/scripts/components/company-services/RemoveDirectorNoticeServiceController"
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
  const noticeRef = ref(null)

  const controller = new RemoveDirectorNoticeServiceController(props.companyId, props.viewType, emit)

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
      // controller.setViewType(newVal)
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
    noticeRef,
    (newVal) => {
      controller.setNoticeRef(newVal)
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
  @use "~/assets/scss/components/CompanyServices/RemoveDirectorNoticeService" as *;
</style>
