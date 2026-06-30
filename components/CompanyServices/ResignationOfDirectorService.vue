<template>
  <div
    id="company-service-resignation-director"
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
      @minimized="controller.setApplicationData($event)"
      @view-mode-changed="controller.onViewModeChanged($event)"
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
          <NoticeOfResignation
            ref="letterRef"
            :company-id="controller.companyId"
            :application-id="controller.companyDirectorResignation.value.id"
            :is-in-preview-mode="controller.isInPreviewMode.value"
            :show-watermark="controller.showWatermark()"
            :watermark-text="controller.watermarkText()"
            :director-id="controller.applicationDirectorId.value"
          />
          <DcrAcknowledgementOfResignation
            ref="dcrRef"
            v-if="controller.companyDirectorResignation.value.hasAcknowledgementDcr"
            v-bind="controller.resolutionDocumentProps"
          />
        </TransitionGroup>
      </template>
      <template #step-status>
        <b>{{ controller.statusPascaLabel() }}:</b>
        <br />
        {{ controller.statusDate() }}
      </template>
      <template #pasca-custom-confirmation>
        <b>
          <span v-html="controller.draftDcrLabel()" />
          ?
        </b>
        <br />
        <br />
        <div class="action-buttons">
          <button class="btn btn-sm btn-danger">
            {{ controller.noThanksLabel() }}
          </button>
          <button
            class="btn btn-sm btn-submit"
            @click="controller.onDraftDcrClick()"
          >
            {{ controller.proceedLabel() }}
          </button>
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
                {{ controller.slipCaseTitle() }}
              </div>
              <div class="content">
                <ol>
                  <li
                    v-for="(point, i) in controller.slipCaseContentPoints()"
                    :key="i"
                  >
                    <span v-html="point" />
                  </li>
                </ol>
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
  import NoticeOfResignation from "../LegalDocuments/NoticeOfResignation.vue"
  import CompanyServiceWrapper from "@/components/CompanyServices/CompanyServiceWrapper.vue"
  import DcrAcknowledgementOfResignation from "../Resolutions/DcrAcknowledgementOfResignation.vue"
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import { EmitMessages } from "~/scripts/constants/EmitMessages"
  import { ResignationOfDirectorServiceController } from "~/scripts/components/company-services/ResignationOfDirectorServiceController"

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
  const letterRef = ref(null)
  const wrapperRef = ref(null)

  const controller = new ResignationOfDirectorServiceController(props.companyId, props.viewType, emit)

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
    letterRef,
    (newVal) => {
      controller.setLetterRef(newVal)
    },
    { immediate: true }
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
  @use "~/assets/scss/components/CompanyServices/ResignationOfDirector" as *;
</style>
