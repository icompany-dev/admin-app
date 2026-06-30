<template>
  <div
    id="company-services-striking-off-service"
    :class="{ 'service-unpaid': !controller.hasPaid() }"
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
    <template v-if="!controller.isLoading.value">
      <div
        id="striking-off-documents"
        class="company-services"
        :class="{
          'move-left': controller.isShowHiddenDocuments,
          'mask-document': controller.isShowingHiddenDocuments,
        }"
      >
        <CompanyServiceWrapper
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
              <StrikingOffChecklist :company-id="controller.companyId" />
            </TransitionGroup>
          </template>
          <template #pasca-custom-affirmation>
            <b>{{ controller.directorLabel }}:</b>
            <div class="signature-markers">
              <div
                class="signature-marker"
                v-for="(director, index) in controller.directorRanges"
                :key="index"
                :class="{ signed: index < controller.totalDirectorsSignature }"
              >
                <i class="fa-solid fa-user" />
              </div>
            </div>
            <b>{{ controller.shareholderLabel }}:</b>
            <div class="signature-markers">
              <div
                class="signature-marker"
                v-for="(shareholder, index) in controller.shareholderRanges"
                :key="index"
                :class="{ signed: index < controller.totalShareholdersSignature }"
              >
                <i class="fa-solid fa-user" />
              </div>
            </div>
            <br />
            <b>{{ controller.applicantLabel }}</b>
            <br />
            {{ controller.applicantName }}
          </template>
          <template #step-status>
            {{ controller.status }}
            <br />
            <br />
            <div v-if="controller.isPendingBankAccountClosures">
              <b>{{ controller.bankAccountClosureLabel }}</b>
              <br />
              <button
                class="btn btn-submit"
                @click="controller.onShowBankAccountClosureClicked()"
              >
                {{ controller.initiateBankAccountClosureLabel }}
              </button>
            </div>
            <br />
            <div v-if="controller.isManagementAccountRequired">
              <b>{{ controller.managementAccountLabel }}</b>
              <br />
              <button
                class="btn btn-submit"
                @click="controller.onShowManagementAccountClicked()"
              >
                {{ controller.managementAccountButtonLabel }}
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
          v-if="controller.showActionTray() && !controller.isShowBankAccountClosure.value"
          ref="actionTrayRef"
          :actions="controller.actionTrayElements.value"
        />
      </div>
      <TransitionGroup name="slide-left">
        <div
          class="hidden-documents"
          :class="{ show: controller.isShowHiddenDocuments }"
        >
          <CloseBankAccountForStrikingOffService
            v-if="controller.isShowBankAccountClosureDocument"
            :company-id="controller.companyId"
            :company-bank-id="''"
            :view-type="'new'"
            @back="controller.onCloseBankAccountClosureClicked()"
          />
          <ManagementAccountForStrikingOffService
            v-if="controller.isShowManagementAccountDocument"
            :company-id="controller.companyId"
            :view-type="'new'"
            :financial-year-start-date="controller.financialYearStartDate"
            :financial-year-end-date="controller.financialYearEndDate"
            @back="controller.onCloseManagementAccountClicked()"
          />
        </div>
      </TransitionGroup>
    </template>
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
      <PreparationStrikingOff
        ref="preparationStrikingOffRef"
        @proceed="controller.handleMakePayment($event)"
      />
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
  import ActionTray from "../ActionTrays/ActionTray.vue"
  import Alert from "../Alerts/Alert.vue"
  import CloseBankAccountForStrikingOffService from "./CloseBankAccountForStrikingOffService.vue"
  import CompanyServiceWrapper from "@/components/CompanyServices/CompanyServiceWrapper.vue"
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import ManagementAccountForStrikingOffService from "./ManagementAccountForStrikingOffService.vue"
  import StrikingOffChecklist from "@/components/LegalDocuments/StrikingOffChecklist.vue"
  import PreparationStrikingOff from "@/components/Popups/PreparationStrikingOff.vue"
  import { StrikingOffServiceController } from "~/scripts/components/company-services/StrikingOffServiceController"
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
  const preparationStrikingOffRef = ref(null)

  const controller = new StrikingOffServiceController(props.companyId, props.viewType, emit)

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
    preparationStrikingOffRef,
    (newVal) => {
      controller.setPreparationStrikingOffRef(newVal)
    },
    { immediate: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/CompanyServices/StrikingOffService" as *;
</style>
