<template>
  <div
    class="cosec-service-wrapper"
    :class="{ show: controller.isShowing.value }"
  >
    <Transition name="document-grow">
      <div v-if="controller.isShowing.value">
        <div
          v-if="!controller.hasDocumentToShow()"
          class="cosec-service-documents full-size"
        >
          <div class="documents-section">
            <div class="paper-wrapper">
              <div class="paper resolution">Showing empty div for test -- {{ controller.targetToShow.value }}</div>
            </div>
          </div>
        </div>
        <div
          class="service-wrapper-document"
          :class="props.paperOrientation"
          v-if="activeDocumentComponent"
        >
          <component
            :is="activeDocumentComponent"
            :company-id="props.companyId"
            :application-id="props.targetId"
            :transfer-id="props.targetId"
            :notice-id="props.targetId"
            :meeting-id="props.targetId"
            :is-document-enlarged="true"
            :is-in-preview-mode="props.isInPreviewMode"
            :show-watermark="props.showWatermarkText"
            :watermark-text="props.watermarkText"
            :annual-return-year="props.yearToLodge"
            :is-by-shareholder="props.isByShareholder"
            :is-show-all-documents="props.isShowing"
            :is-showing="props.isShowing"
            :financial-year-start-date="props.financialYearStartDate"
            :financial-year-end-date="props.financialYearEndDate"
            @back="controller.onMinimizeDocument($event)"
            @make-payment="controller.onMakePayment()"
            @applicationUpdated="controller.onApplicationUpdated($event)"
            @updateNonBO="emit('updateNonBO', $event)"
            @openCart="emit('openCart')"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
  import AcknowledgeSpecialNotice from "./AcknowledgeSpecialNotice.vue"
  import AdoptCommonSeal from "./AdoptCommonSeal.vue"
  import AllotmentOfShares from "./AllotmentOfShares.vue"
  import AppointChairman from "./AppointChairman.vue"
  import AppointManager from "./AppointManager.vue"
  import AppointmentOfDirector from "./AppointmentOfDirector.vue"
  import AppointmentOfAuditor from "./AppointmentOfAuditor.vue"
  import AppointResponsiblePersonForFinancialStatement from "./AppointResponsiblePersonForFinancialStatement.vue"
  import AuditCirculation from "./AuditCirculation.vue"
  import AuditExtensionOfTime from "./AuditExtensionOfTime.vue"
  import BankAccountOpening from "./BankAccountOpening.vue"
  import BODeclaration from "./BODeclaration.vue"
  import ChangeOfName from "./ChangeOfName.vue"
  import ChangeOfAddress from "./ChangeOfAddress.vue"
  import ChangeOfBranch from "./ChangeOfBranch.vue"
  import ChangeOfConstitution from "./ChangeOfConstitution.vue"
  import ChangeOfDescription from "./ChangeOfDescription.vue"
  import ChangeOfRegisteredAddress from "./ChangeOfRegisteredAddress.vue"
  import CloseBankAccount from "./CloseBankAccount.vue"
  import DelegationOfAuthority from "./DelegationOfAuthority.vue"
  import DividendDeclaration from "./DividendDeclaration.vue"
  import EnterContract from "./EnterContract.vue"
  import LoanToDirector from "./LoanToDirector.vue"
  import LodgeAnnualReturn from "./LodgeAnnualReturn.vue"
  import ManagementAccountForStrikingOff from "./ManagementAccountForStrikingOff.vue"
  import NewIncorporation from "./NewIncorporation.vue"
  import NewSwitch from "./NewSwitch.vue"
  import NoticeTransferOfShares from "./NoticeTransferOfShares.vue"
  import NoConstitution from "./NoConstitution.vue"
  import NotifyBankChangeOfCompanyName from "./NotifyBankChangeOfCompanyName.vue"
  import PreferenceShareRight from "./PreferenceShareRight.vue"
  import RegisterTransferOfShares from "./RegisterTransferOfShares.vue"
  import RemoveDirector from "./RemoveDirector.vue"
  import ReplaceCommonSeal from "./ReplaceCommonSeal.vue"
  import ResignationOfDirector from "./ResignationOfDirector.vue"
  import Section47 from "./Section47.vue"
  import SetFinancialYearEnd from "./SetFinancialYearEnd.vue"
  import ShareIssuance from "./ShareIssuance.vue"
  import DocumentToggler from "../DocumentCtas/DocumentToggler.vue"
  import Section201 from "./Section201.vue"
  import NameReservation from "./NameReservation.vue"
  import Section219And221 from "./Section219And221.vue"
  import StrikingOff from "./StrikingOff.vue"
  import SubscribeBusinessAddress from "./SubscribeBusinessAddress.vue"
  import TekunApplication from "./TekunApplication.vue"
  import TermOfReference from "./TermOfReference.vue"
  import ThirdSchedule from "./ThirdSchedule.vue"
  import UseCommonSealAbroad from "./UseCommonSealAbroad.vue"
  import { CompanyConstants } from "~/scripts/constants/Company"
  import { ServiceWrapperController } from "~/scripts/components/service-wrappers/ServiceWrapperController"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
    target: {
      type: String,
      required: true,
    },
    targetId: {
      type: String,
      default: null,
    },
    isShowing: {
      type: Boolean,
      default: false,
    },
    isInPreviewMode: {
      type: Boolean,
      default: false,
    },
    showWatermarkText: {
      type: Boolean,
      default: true,
    },
    watermarkText: {
      type: String,
      default: "DRAFT",
    },
    yearToLodge: {
      type: String,
      default: "",
    },
    paperOrientation: {
      type: String,
      default: "portrait",
    },
    isByShareholder: {
      type: Boolean,
      default: false,
    },
    financialYearEndDate: {
      type: String,
      default: "",
    },
    financialYearStartDate: {
      type: String,
      default: "",
    },
  })

  const emit = defineEmits(["minimize", "makePayment", "applicationUpdated", "updateNonBO", "openCart"])

  const controller = new ServiceWrapperController(props.target, emit)

  //NOTE: This cannot be moved into controller as it maps the component itself
  const componentMap: Record<string, any> = {
    [CompanyConstants.TARGET_AMENDMENT_ADDRESS]: ChangeOfAddress,
    [CompanyConstants.TARGET_AMENDMENT_BRANCH]: ChangeOfBranch,
    [CompanyConstants.TARGET_AMENDMENT_CONSTITUTION]: ChangeOfConstitution,
    [CompanyConstants.TARGET_AMENDMENT_DESCRIPTION]: ChangeOfDescription,
    [CompanyConstants.TARGET_AMENDMENT_NAME]: ChangeOfName,
    [CompanyConstants.TARGET_AMENDMENT_REGISTERED_ADDRESS]: ChangeOfRegisteredAddress,
    [CompanyConstants.TARGET_APPLICATION_INCORPORATE]: NewIncorporation,
    [CompanyConstants.TARGET_AUDITOR_APPOINTMENT]: AppointmentOfAuditor,
    [CompanyConstants.TARGET_APPLICATION_SWITCH]: NewSwitch,
    [CompanyConstants.TARGET_AUDIT_CIRCULATION]: AuditCirculation,
    [CompanyConstants.TARGET_AUDIT_EXTENSION_OF_TIME]: AuditExtensionOfTime,
    [CompanyConstants.TARGET_BO_DECLARATION]: BODeclaration,
    [CompanyConstants.TARGET_CLOSE_BANK_ACCOUNT]: CloseBankAccount,
    [CompanyConstants.TARGET_COMMON_SEAL]: AdoptCommonSeal,
    [CompanyConstants.TARGET_COMMON_SEAL_REPLACEMENT]: ReplaceCommonSeal,
    [CompanyConstants.TARGET_CONTRACT_ENTER]: EnterContract,
    [CompanyConstants.TARGET_DELEGATION_OF_AUTHORITY]: DelegationOfAuthority,
    [CompanyConstants.TARGET_DIRECTOR_APPOINTMENT]: AppointmentOfDirector,
    [CompanyConstants.TARGET_DIRECTOR_DECLARATION_CONFLICT_OF_INTEREST]: Section219And221,
    [CompanyConstants.TARGET_DIRECTOR_INVITATION]: Section201,
    [CompanyConstants.TARGET_DIRECTOR_LOAN]: LoanToDirector,
    [CompanyConstants.TARGET_DIRECTOR_CHAIRMAN_APPOINTMENT]: AppointChairman,
    [CompanyConstants.TARGET_DIRECTOR_MANAGER_APPOINTMENT]: AppointManager,
    [CompanyConstants.TARGET_DIRECTOR_RESIGNATION]: ResignationOfDirector,
    [CompanyConstants.TARGET_DIVIDEND_DECLARATION]: DividendDeclaration,
    [CompanyConstants.TARGET_FINANCIAL_STATEMENT_AUTHORISED_PERSON]: AppointResponsiblePersonForFinancialStatement,
    [CompanyConstants.TARGET_LOAN_APPLICATION]: TekunApplication,
    [CompanyConstants.TARGET_LODGE_ANNUAL_RETURN]: LodgeAnnualReturn,
    [CompanyConstants.TARGET_MANAGEMENT_ACCOUNT]: ManagementAccountForStrikingOff,
    [CompanyConstants.TARGET_OPEN_BANK_ACCOUNT]: BankAccountOpening,
    [CompanyConstants.TARGET_OFFICIAL_SEAL]: UseCommonSealAbroad,
    [CompanyConstants.TARGET_NO_CONSTITUTION]: NoConstitution,
    [CompanyConstants.TARGET_NOTICE_ACKNOWLEDGEMENT]: AcknowledgeSpecialNotice,
    [CompanyConstants.TARGET_NOTIFY_CHANGE_OF_NAME]: NotifyBankChangeOfCompanyName,
    [CompanyConstants.TARGET_PREFERENCE_SHARE_RIGHT]: PreferenceShareRight,
    [CompanyConstants.TARGET_REMOVAL_OF_DIRECTOR]: RemoveDirector,
    [CompanyConstants.TARGET_SET_FINANCIAL_YEAR_END]: SetFinancialYearEnd,
    [CompanyConstants.TARGET_SHAREHOLDER_PROPOSE_ALLOTMENT]: ShareIssuance,
    [CompanyConstants.TARGET_SHAREHOLDER_ALLOTMENT_OF_SHARES]: AllotmentOfShares,
    [CompanyConstants.TARGET_SHAREHOLDER_PROPOSE_TRANSFER]: NoticeTransferOfShares,
    [CompanyConstants.TARGET_SHAREHOLDER_POST_SHARE_TRANSFER]: RegisterTransferOfShares,
    [CompanyConstants.TARGET_SECTION_47]: Section47,
    [CompanyConstants.TARGET_SHAREHOLDER_TRANSFER_OF_SHARES]: NoticeTransferOfShares,
    [CompanyConstants.TARGET_STRIKING_OFF_RESOLUTION]: StrikingOff,
    [CompanyConstants.TARGET_SUBSCRIBE_BUSINESS_ADDRESS]: SubscribeBusinessAddress,
    [CompanyConstants.TARGET_THIRD_SCHEDULE]: ThirdSchedule,
    [CompanyConstants.TARGET_TERMS_OF_REFERENCE]: TermOfReference,
  }

  const activeDocumentComponent = computed(() => {
    const target = controller.targetToShow.value
    return target && componentMap[target] ? componentMap[target] : null
  })
  //

  watch(
    () => props.target,
    (newVal) => {
      controller.targetToShow.value = newVal
    }
  )

  watch(
    () => props.isShowing,
    (newVal) => {
      if (newVal) {
        controller.onShow()
      }
    }
  )

  onMounted(() => {
    window.addEventListener("click", controller.handleMouseClick.bind(controller))
    window.addEventListener("keydown", controller.handleKeydown.bind(controller))
  })

  onBeforeMount(() => {
    window.removeEventListener("click", controller.handleMouseClick.bind(controller))
    window.removeEventListener("keydown", controller.handleKeydown.bind(controller))
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Services/CosecServiceWrapper" as *;
</style>
