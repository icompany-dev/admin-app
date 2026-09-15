<template>
  <div
    id="company-services-issue-and-allot-shares-service"
    class="company-services"
  >
    <div
      v-if="controller.isLoading.value"
      class="loader-container"
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
          <DcrProposeAllotmentOfShares
            ref="dcrRef"
            v-bind="controller.resolutionDocumentProps"
            @doneLoading="controller.handleDisplayedPage()"
          />
          <McrAuthorityToAllotShares
            ref="mcrRef"
            v-bind="controller.mcrResolutionDocumentProps"
            @doneLoading="controller.handleDisplayedPage()"
          />
          <!-- <PreemptiveRightNotices
            ref="noticeRef"
            :company-id="controller.companyId"
            :application-id="controller.issuanceId"
            :application="null"
            :is-in-preview-mode="controller.isInPreviewMode.value"
            :is-by-shareholder="false"
            :financial-period-id="null"
            :bank-id="null"
            :name-reservations="[]"
            :year-to-lodge="null"
            :type="null"
            :show-watermark="controller.showWatermark()"
            :watermark-text="controller.watermarkText()"
          /> -->
        </TransitionGroup>
      </template>
    </CompanyServiceWrapper>
  </div>
</template>

<script lang="ts" setup>
  import CompanyServiceWrapper from "@/components/CompanyServices/CompanyServiceWrapper.vue"
  import DcrProposeAllotmentOfShares from "../Resolutions/DcrProposeAllotmentOfShares.vue"
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import McrAuthorityToAllotShares from "@/components/Resolutions/McrAuthorityToAllotShares.vue"
  import PreemptiveRightNotices from "../Shareholders/AllotmentOfShares/PreemptiveRightNotices.vue"
  import { IssueAndAllotSharesServiceController } from "~/scripts/components/company-services/IssueAndAllotShareServiceController"
  import { EmitMessages } from "~/scripts/constants/EmitMessages"
  import { File } from "~/scripts/models/File"

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
  const mcrRef = ref(null)
  const wrapperRef = ref(null)
  const doNotLieAlertRef = ref(null)
  const fileUploaderLinkRef = ref(null)
  const noticePrnExpiryRef = ref(null)
  const noticeRef = ref(null)

  const prepaymentRef = ref(null)

  const controller = new IssueAndAllotSharesServiceController(props.companyId, props.viewType, emit)

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
    prepaymentRef,
    (newVal) => {
      controller.setPrepaymentRef(newVal)
    },
    { immediate: true }
  )

  watch(
    doNotLieAlertRef,
    (newVal) => {
      controller.setDoNotLieAlertRef(newVal)
    },
    { immediate: true }
  )

  watch(
    fileUploaderLinkRef,
    (newVal) => {
      controller.setFileUploaderLinkRef(newVal)
    },
    { immediate: true }
  )

  watch(
    noticePrnExpiryRef,
    (newVal) => {
      controller.setNoticePrnExpiryRef(newVal)
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

  defineExpose({
    onDownloadClicked: controller.onDownloadClicked.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/CompanyServices/Service" as *;
  @use "~/assets/scss/components/CompanyServices/IssueAndAllotShareService" as *;
</style>
