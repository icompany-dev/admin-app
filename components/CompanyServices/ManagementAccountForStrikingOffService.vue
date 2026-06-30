<template>
  <div
    id="company-services-management-account-for-striking-off"
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
          <ManagementAccountForStrikingOff
            v-if="!controller.isLoading.value"
            ref="dcrRef"
            :company-id="controller.companyId"
            :financial-year-start-date="props.financialYearStartDate"
            :financial-year-end-date="props.financialYearEndDate"
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
  </div>
</template>

<script lang="ts" setup>
  import ActionTray from "@/components/ActionTrays/ActionTray.vue"
  import Alert from "@/components/Alerts/Alert.vue"
  import CompanyServiceWrapper from "@/components/CompanyServices/CompanyServiceWrapper.vue"
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import ManagementAccountForStrikingOff from "@/components/LegalDocuments/ManagementAccountForStrikingOff.vue"
  import { EmitMessages } from "~/scripts/constants/EmitMessages"
  import { ManagementAccountForStrikingOffServiceController } from "~/scripts/components/company-services/ManagementAccountForStrikingOffServiceController"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
    viewType: {
      type: String,
      required: true,
    },
    financialYearEndDate: {
      type: String,
      required: true,
    },
    financialYearStartDate: {
      type: String,
      required: true,
    },
  })

  const emit = defineEmits(EmitMessages.COMPANY_SERVICES)

  const dcrRef = ref(null)
  const wrapperRef = ref(null)
  const fileInput = ref(null)

  const controller = new ManagementAccountForStrikingOffServiceController(
    props.companyId,
    props.viewType,
    props.financialYearStartDate,
    props.financialYearEndDate,
    emit
  )

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
    () => props.financialYearStartDate,
    (newVal) => {
      controller.setFinancialYearStartDate(newVal)
    }
  )

  watch(
    () => props.financialYearEndDate,
    (newVal) => {
      controller.setFinancialYearEndDate(newVal)
    }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/CompanyServices/Service" as *;
  @use "~/assets/scss/components/CompanyServices/ManagementAccountForStrikingOffService" as *;
</style>
