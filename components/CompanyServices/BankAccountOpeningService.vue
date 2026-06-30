<template>
  <div
    id="company-service-bank-account-opening"
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
      ref="wrapperRef"
      v-if="!controller.isLoading.value"
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
      @applicationUpdated="controller.onApplicationUpdated($event)"
    >
      <template #resolutions>
        <TransitionGroup
          name="flip"
          tag="div"
          class="documents"
        >
          <component
            :is="activeDocumentComponent"
            :company-id="controller.companyId"
            :resolution-document="controller.resolutionDocumentProps"
          />
        </TransitionGroup>
      </template>
      <template #pasca-custom-affirmation>
        <div class="affirmation-details">
          <b>{{ controller.currentState() }}</b>
          <br />
          {{ controller.currentStateSubnote() }}
        </div>
        <div
          class="affirmation-details"
          v-if="controller.showSignatories()"
        >
          {{ controller.signatoriesLabel() }}
          <div class="authorised-names">
            <i
              v-for="(name, index) in controller.signatories()"
              class="fa-solid fa-user"
              :title="name"
              :key="index"
            />
          </div>
        </div>
        <div
          class="affirmation-details"
          v-if="controller.showOnlineBanking()"
        >
          {{ controller.onlineBankingAccessLabel() }}
          <div class="authorised-names">
            <i
              v-for="(name, index) in controller.onlineBanking()"
              class="fa-solid fa-user"
              :title="name"
              :key="index"
            />
          </div>
        </div>

        <div v-if="controller.isShowReadyToSubmit">
          <b>{{ controller.readyToSubmitLabel }}</b>
          <br />
          <span v-html="controller.readyToSubmitSublabel" />
          <br />
          <div
            class="step-buttons"
            v-if="!controller.isDocumentLocked"
          >
            <button
              class="btn btn-submit"
              :class="{ 'is-loading': controller.isUpdatingStatus.value }"
              @click="controller.onSubmitAllInformation()"
            >
              {{ controller.submitLabel }}
            </button>
          </div>
        </div>
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
        <div
          class="bank-account"
          v-if="!controller.isComplete"
        >
          {{ controller.bankAccountNoLabel }}
          <br />
          <input
            type="text"
            class="form-control in-resolution"
            v-model="controller.bankAccountNumber.value"
            :placeholder="controller.bankAccountNoLabel"
          />
        </div>
        <div class="step-buttons">
          <button
            class="btn btn-submit"
            :class="{ 'is-loading': controller.isUpdatingStatus.value }"
            @click="controller.onCompleteServiceClicked()"
          >
            {{ controller.completedLabel }}
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

    <BankAccountOpeningChecklist
      ref="checklistRef"
      :bank-id="controller.bankId.value"
      :company-id="controller.companyId"
      :is-processing="controller.isShowProcessing()"
      :is-submitting="controller.isSubmitting.value"
      :has-paid="controller.hasPaid()"
      :is-checklist-visible="controller.isShowInfo.value"
      :application="controller.applicationValue"
      @close="controller.onCloseChecklist()"
      @back="controller.onBackButtonClicked()"
      @pay="controller.onProceedClicked()"
      @hide="controller.onMoreInfoClicked()"
    />

    <Teleport to="body">
      <AddOnOpenBankAccount
        ref="addOnOpenBankAccountRef"
        @proceed="controller.onProceedToPayment($event)"
      />
      <BankReview ref="bankReviewRef" />
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
  import LoaderPrepare from "~/components/Loaders/Prepare.vue"
  import CompanyServiceWrapper from "./CompanyServiceWrapper.vue"
  import { BankAccountOpeningServiceController } from "~/scripts/components/company-services/BankAccountOpeningServiceController"
  import { EmitMessages } from "~/scripts/constants/EmitMessages"
  import BankAccountOpeningChecklist from "../Banks/BankAccountOpeningChecklist.vue"
  import BankDocuments from "@/components/Banks/Documents/BankDocuments.vue"
  import HongLeongBankDocuments from "@/components/Banks/Documents/HongLeongBankDocuments.vue"
  import MaybankDocuments from "@/components//Banks/Documents/MaybankDocuments.vue"
  import BankIslamDocuments from "../Banks/Documents/BankIslamDocuments.vue"
  import AllianceBankDocuments from "../Banks/Documents/AllianceBankDocuments.vue"
  import AffinBankDocuments from "../Banks/Documents/AffinBankDocuments.vue"
  import AddOnOpenBankAccount from "../Popups/AddOnOpenBankAccount.vue"
  import BankReview from "../Popups/BankReview.vue"
  import { BankConstants } from "~/scripts/constants/Banks"

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
    bankId: {
      type: String,
      required: true,
    },
  })

  const componentMap: Record<string, any> = {
    [BankConstants.MAYBANK_DETAIL.id]: MaybankDocuments,
    [BankConstants.OCBC_BANK_DETAIL.id]: BankDocuments,
    [BankConstants.UOB_DETAIL.id]: BankDocuments,
    [BankConstants.CIMB_DETAIL.id]: BankDocuments,
    [BankConstants.AFFIN_BANK_DETAIL.id]: AffinBankDocuments,
    [BankConstants.PUBLIC_BANK_DETAIL.id]: BankDocuments,
    [BankConstants.MUAMALAT_DETAIL.id]: BankDocuments,
    [BankConstants.RHB_BANK_DETAIL.id]: BankDocuments,
    [BankConstants.HONG_LEONG_BANK_DETAIL.id]: HongLeongBankDocuments,
    [BankConstants.STANDARD_CHARTERED_DETAIL.id]: BankDocuments,
    [BankConstants.AMBANK_DETAIL.id]: BankDocuments,
    [BankConstants.AGROBANK_DETAIL.id]: BankDocuments,
    [BankConstants.ALLIANCE_BANK_DETAIL.id]: AllianceBankDocuments,
    [BankConstants.BANK_ISLAM_DETAIL.id]: BankIslamDocuments,
    [BankConstants.HSBC_DETAIL.id]: BankDocuments,
    [BankConstants.MBSB_DETAIL.id]: BankDocuments,
    [BankConstants.BANK_RAKYAT_DETAIL.id]: BankDocuments,
    [BankConstants.CDS_TRADING_DETAIL.id]: BankDocuments,
    [""]: BankDocuments,
  }

  const emit = defineEmits(EmitMessages.COMPANY_SERVICES)

  const deleteApplicationRef = ref(null)
  const dcrRef = ref(null)
  const addOnOpenBankAccountRef = ref(null)
  const bankReviewRef = ref(null)

  const companyDocumentsContainerRef = ref(null)
  const checklistRef = ref(null)
  const updateApplicationNoticeRef = ref(null)
  const actionTrayRef = ref(null)
  const zoomStatutoryRef = ref(null)

  const controller = new BankAccountOpeningServiceController(props.companyId, props.viewType, emit, props.bankId)

  const activeDocumentComponent = computed(() => {
    const target = controller.bankId.value
    return target && componentMap[target] ? componentMap[target] : null
  })

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

  // watch(
  //   deleteApplicationRef,
  //   (newVal) => {
  //     controller.setDeleteApplicationRef(newVal)
  //   },
  //   { immediate: true }
  // )

  watch(
    companyDocumentsContainerRef,
    (newVal) => {
      controller.setCompanyDocumentsContainerRef(newVal)
    },
    { immediate: true }
  )

  watch(
    checklistRef,
    (newVal) => {
      controller.setChecklistRef(newVal)
    },
    { immediate: true }
  )

  watch(
    updateApplicationNoticeRef,
    (newVal) => {
      controller.setUpdateApplicationNoticeRef(newVal)
    },
    { immediate: true }
  )

  watch(
    zoomStatutoryRef,
    (newVal) => {
      controller.setZoomStatutoryRef(newVal)
    },
    { immediate: true }
  )

  watch(
    actionTrayRef,
    (newVal) => {
      controller.setActionTrayRef(newVal)
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
    addOnOpenBankAccountRef,
    (newVal) => {
      controller.setAddOnOpenBankAccountRef(newVal)
    },
    { immediate: true }
  )

  watch(
    bankReviewRef,
    (newVal) => {
      controller.setBankReviewRef(newVal)
    },
    { immediate: true }
  )

  watch(
    () => controller.eventManager.isItemRemovedFromCart,
    (newVal) => {
      controller.handlePostDelete()
    },
    { immediate: true }
  )

  defineExpose({
    isDoneLoading: controller.isDoneLoading.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/CompanyServices/BankAccountOpening" as *;
</style>
