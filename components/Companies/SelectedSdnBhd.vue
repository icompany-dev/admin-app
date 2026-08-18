<template>
  <div
    id="company-selected-sdn-bhd"
    :class="{ 'is-showing-documents': controller.showDocument }"
  >
    <template v-if="controller.isLoading.value">
      <LoaderPrepare
        :label="controller.loaderLabel"
        :sublabel="controller.loaderSublabel"
      />
    </template>
    <template v-if="!controller.isLoading.value">
      <div class="company-details">
        <div class="name-logo">
          <div
            class="logo"
            :class="{ 'no-logo': !controller.hasCompanyLogo }"
          >
            <img :src="controller.companyLogo" />
          </div>
          <div class="name-registration-numbers-actions">
            <div class="name-registration-number">
              <div class="company-name">{{ controller.company.value.getFullName() }}</div>
              <div class="registraiton-numbers">
                {{ controller.company.value.registrationNumberNew }}
                ({{ controller.company.value.registrationNumberOld }})
              </div>
            </div>
            <div class="actions-button-options">
              <div
                class="btn btn-pill btn-submit selected"
                @click="controller.onOptionsClicked()"
              >
                <span class="label">{{ controller.more }}</span>
                <i
                  class="fa-solid fa-caret-down"
                  :class="{ rotate: controller.isShowOptions.value }"
                ></i>
              </div>
              <div
                class="options"
                :class="{ show: controller.isShowOptions.value }"
              >
                <button
                  class="btn btn-pill btn-submit"
                  :class="{ 'is-loading': controller.isPrintingSpine.value }"
                  :disabled="controller.isPrintingSpine.value"
                  @click="controller.onPrintSpineClicked()"
                >
                  {{ controller.printSpine }}
                </button>
                <button
                  class="btn btn-pill btn-submit"
                  @click="controller.onEditClicked()"
                >
                  {{ controller.edit }}
                </button>
                <button
                  class="btn btn-pill btn-submit"
                  @click="controller.onStrikeOffClicked()"
                >
                  {{ controller.strikeOff }}
                </button>
                <button
                  class="btn btn-pill btn-submit"
                  @click="controller.onSwitchOutClicked()"
                >
                  {{ controller.switchOut }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <TransitionGroup
          class="page-tabs"
          name="slide-left"
          tag="div"
        >
          <div
            class="page-tab"
            :class="{ selected: controller.isOverview.value }"
            @click="controller.onOverviewClicked()"
          >
            {{ controller.overview }}
          </div>
          <div
            class="page-tab"
            :class="{ selected: controller.isBusiness.value }"
            @click="controller.onBusinessClicked()"
          >
            {{ controller.business }}
          </div>
          <div
            class="page-tab"
            :class="{ selected: controller.isDirectors.value }"
            @click="controller.onDirectorsClicked()"
          >
            {{ controller.directors }}
          </div>
          <div
            class="page-tab"
            :class="{ selected: controller.isDocuments.value }"
            @click="controller.onDocumentsClicked()"
          >
            {{ controller.documents }}
          </div>
          <div
            class="page-tab"
            :class="{ selected: controller.isShareholders.value }"
            @click="controller.onShareholdersClicked()"
          >
            {{ controller.shareholders }}
          </div>
          <div
            class="page-tab"
            :class="{ selected: controller.isAccounting.value }"
            @click="controller.onAccountingClicked()"
          >
            {{ controller.accounting }}
          </div>
        </TransitionGroup>
        <TransitionGroup name="slide-left">
          <div
            class="application-contents"
            v-if="controller.isOverview.value"
          >
            <Overview :company-id="controller.companyId.value" />
          </div>
          <div
            class="application-contents"
            v-if="controller.isBusiness.value"
          >
            <ChangeOfNameApplication
              :ref="(el) => controller.setApplicationRefs(0, el)"
              v-bind="controller.applicationProps"
              @applicationId="controller.onApplicationIdUpdated($event)"
              @paymentOrderId="controller.onPaymentOrderIdUpdated($event)"
              @documentSelected="controller.onDocumentTargetSelected($event, CompanyConstants.TARGET_AMENDMENT_NAME)"
              @download="controller.onDownloadClicked()"
              @show="controller.onPanelShow(0)"
            />
            <ChangeOfAddressApplication
              :ref="(el) => controller.setApplicationRefs(1, el)"
              v-bind="controller.applicationProps"
              @applicationId="controller.onApplicationIdUpdated($event)"
              @paymentOrderId="controller.onPaymentOrderIdUpdated($event)"
              @documentSelected="controller.onDocumentTargetSelected($event, CompanyConstants.TARGET_AMENDMENT_ADDRESS)"
              @download="controller.onDownloadClicked()"
              @show="controller.onPanelShow(1)"
            />
            <ChangeOfBranchApplication
              :ref="(el) => controller.setApplicationRefs(2, el)"
              v-bind="controller.applicationProps"
              @applicationId="controller.onApplicationIdUpdated($event)"
              @paymentOrderId="controller.onPaymentOrderIdUpdated($event)"
              @documentSelected="controller.onDocumentTargetSelected($event, CompanyConstants.TARGET_AMENDMENT_BRANCH)"
              @download="controller.onDownloadClicked()"
              @show="controller.onPanelShow(2)"
            />
            <BankAccountOpeningApplication
              :ref="(el) => controller.setApplicationRefs(3, el)"
              v-bind="controller.applicationProps"
              @applicationId="controller.onApplicationIdUpdated($event)"
              @paymentOrderId="controller.onPaymentOrderIdUpdated($event)"
              @documentSelected="controller.onDocumentTargetSelected($event, CompanyConstants.TARGET_OPEN_BANK_ACCOUNT)"
              @download="controller.onDownloadClicked()"
              @show="controller.onPanelShow(3)"
            />
          </div>
        </TransitionGroup>
      </div>
      <TransitionGroup name="slide-left-leave-right">
        <div
          class="application-document-container"
          v-if="controller.showDocument"
        >
          <component
            ref="documentRef"
            :is="activeDocumentComponent"
            :company-id="controller.companyId.value"
            :view-type="'existing'"
            :application-id="controller.selectedApplicationId.value"
            :target-id="controller.selectedPaymentOrderId.value"
            :target-type="controller.selectedApplicationName.value"
          />
        </div>
      </TransitionGroup>
      <Teleport to="body">
        <SdnBhdSpine
          ref="spineRef"
          :company-id="controller.companyId.value"
        />
      </Teleport>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import BankAccountOpeningApplication from "@/components/Services/BankAccountOpeningApplication.vue"
  import ChangeOfNameApplication from "@/components/Services/ChangeOfNameApplication.vue"
  import ChangeOfAddressApplication from "@/components/Services/ChangeOfAddressApplication.vue"
  import ChangeOfBranchApplication from "@/components/Services/ChangeOfBranchApplication.vue"
  import BankAccountOpeningService from "@/components/CompanyServices/BankAccountOpeningService.vue"
  import ChangeOfAddressService from "@/components/CompanyServices/ChangeOfBusinessAddressService.vue"
  import ChangeOfBusinessBranchService from "@/components/CompanyServices/ChangeOfBusinessBranchService.vue"
  import ChangeOfNameService from "@/components/CompanyServices/ChangeOfNameService.vue"
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import Overview from "@/components/Companies/Overview.vue"
  import PracticeDirective2Service from "@/components/CompanyServices/PracticeDirective2Service.vue"
  import ReceiptInvoiceService from "@/components/CompanyServices/ReceiptInvoiceService.vue"
  import SdnBhdSpine from "@/components/LegalDocuments/SdnBhdSpine.vue"
  import Section27Service from "@/components/CompanyServices/Section27Service.vue"
  import Section28Service from "@/components/CompanyServices/Section28Service.vue"
  import { SelectedSdnBhdController } from "~/scripts/components/companies/SelectedSdnBhdController"
  import { CompanyConstants } from "~/scripts/constants/Company"
  import { DocumentTargets } from "~/scripts/constants/DocumentTargets"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
  })

  const emit = defineEmits([])

  const documentRef = ref(null)
  const spineRef = ref(null)

  const controller = new SelectedSdnBhdController(props.companyId, emit)

  const componentMap: Record<string, any> = {
    [DocumentTargets.TARGET_AMENDMENT_NAME_RESOLUTIONS]: ChangeOfNameService,
    [DocumentTargets.TARGET_AMENDMENT_NAME_SECTION27]: Section27Service,
    [DocumentTargets.TARGET_AMENDMENT_NAME_SECTION28]: Section28Service,
    [DocumentTargets.TARGET_AMENDMENT_ADDRESS_RESOLUTIONS]: ChangeOfAddressService,
    [DocumentTargets.TARGET_AMENDMENT_BRANCH_RESOLUTIONS]: ChangeOfBusinessBranchService,
    [DocumentTargets.TARGET_OPEN_BANK_ACCOUNT_RESOLUTIONS]: BankAccountOpeningService,
    [DocumentTargets.TARGET_PD2]: PracticeDirective2Service,
    [DocumentTargets.TARGET_RECEIPT]: ReceiptInvoiceService,
  }

  const activeDocumentComponent = computed(() => {
    const target = controller.selectedDocumentTarget.value
    return target && componentMap[target] ? componentMap[target] : null
  })

  watch(
    () => props.companyId,
    (newVal) => {
      controller.setCompanyId(newVal)
    }
  )

  watch(
    documentRef,
    (newVal) => {
      controller.setDocumentRef(newVal)
    },
    { immediate: true }
  )

  watch(
    spineRef,
    (newVal) => {
      controller.setSpineRef(newVal)
    },
    { immediate: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Companies/SelectedSdnBhd" as *;
</style>
