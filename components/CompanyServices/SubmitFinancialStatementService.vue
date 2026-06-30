<template>
  <div
    id="company-services-submit-financial-statement-service"
    :class="{ 'service-unpaid': !controller.hasPaid }"
  >
    <div
      v-if="controller.isLoading.value"
      class="loader-container"
    >
      <LoaderPrepare
        :label="controller.loaderLabel"
        :sublabel="controller.loaderSublabel"
      />
    </div>
    <template v-if="!controller.isLoading.value">
      <div
        id="submit-financial-statements-documents"
        class="company-services"
        :class="{
          'move-left': controller.isShowHiddenDocuments,
          'mask-document': controller.isShowingHiddenDocuments,
        }"
      >
        <CompanyServiceWrapper
          v-bind="controller.serviceWrapperProps"
          @view-mode-changed="controller.onViewModeChanged($event)"
          @back="controller.onBackButtonClicked()"
          @proceed="controller.onProceedClicked()"
        >
          <template #resolutions>
            <TransitionGroup
              name="fade"
              tag="div"
              class="documents"
            >
              <DcrAppointResponsiblePerson v-bind="controller.authorisedPersonDocumentProps" />
            </TransitionGroup>
          </template>
          <template #cornerButton>
            <button
              v-if="controller.showCornerButton"
              class="btn btn-standard btn-primary"
              @click="controller.onMoreInfoClicked()"
            >
              {{ controller.learnMoreLabel() }}
            </button>
            <button
              v-if="controller.showCornerButton"
              class="btn btn-standard btn-pay"
              @click="controller.onProceedClicked()"
            >
              {{ controller.proceedButtonLabel() }}
            </button>
          </template>
          <template #pasca-custom-affirmation>
            <template v-if="controller.isHideAffirmationDetails.value">
              <div class="step-content">
                <b>{{ controller.financialYearEnd }}</b>
                <div
                  class="step-date"
                  v-if="controller.hasSetFirstFYE"
                >
                  {{ controller.fyeDates }}
                </div>
              </div>
              <div class="step-content">
                <b>{{ controller.appointedAuditor }}</b>
                <div v-if="controller.compliance.value.hasAppointedAuditor">...</div>
                <div v-if="!controller.compliance.value.hasAppointedAuditor">
                  {{ controller.pendingLabel }}
                </div>
              </div>
              <div class="step-content">
                <b>{{ controller.authorisedPersonLabel }}</b>
                <div class="step-sub-content">
                  <span
                    class="action-link"
                    @click="controller.onAffirmationDetailsClicked()"
                  >
                    {{ controller.viewMoreLabel }}
                  </span>
                </div>
              </div>
            </template>
            <template v-if="!controller.isHideAffirmationDetails.value">
              <div class="step-content">
                <b>{{ controller.financialYearEnd }}</b>
                <div
                  class="step-date"
                  v-if="controller.hasSetFirstFYE"
                >
                  {{ controller.fyeDates }}
                </div>
                <div
                  class="step-buttons"
                  v-if="!controller.hasSetFirstFYE"
                >
                  <button
                    class="btn btn-submit"
                    @click="controller.onOpenSetFyeClicked()"
                  >
                    {{ controller.setFyeLabel }}
                  </button>
                </div>
              </div>
              <div class="step-content">
                <b>{{ controller.appointedAuditor }}</b>
                <div v-if="controller.compliance.value.hasAppointedAuditor">
                  {{ controller.auditorDetails }}
                </div>
                <div
                  v-if="!controller.compliance.value.hasAppointedAuditor"
                  class="step-buttons"
                >
                  <button
                    class="btn btn-submit"
                    @click="controller.onOpenAppointAuditorService()"
                  >
                    {{ controller.appointAuditorLabel }}
                  </button>
                </div>
              </div>
              <div class="step-content">
                <b>{{ controller.authorisedPersonLabel }}</b>
                <div class="step-sub-content">
                  <b>{{ controller.authorisedForSignatoryLabel }}</b>
                  <br />
                  {{ controller.authorisedForSignatory }}
                  <br />
                  <br />
                  <b>{{ controller.authorisedForReportsLabel }}</b>
                  <br />
                  <span v-html="controller.authorisedForReports" />
                </div>
                <div>
                  <small>{{ controller.directorsLabel }}</small>
                  <div class="signature-markers">
                    <div
                      class="signature-marker"
                      v-for="d in controller.authorisedPersonDirectorRange"
                      :key="`ap-${d}`"
                      :class="{ signed: d < controller.authorisedPersonNumberOfDirectorSignatures }"
                    >
                      <i class="fa-solid fa-user" />
                    </div>
                  </div>
                </div>
                <div>
                  <small>{{ controller.membersLabel }}</small>
                  <div class="signature-notes">
                    {{ controller.notRequiredLabel }}
                  </div>
                </div>
              </div>
              <div
                class="step-content"
                v-if="controller.canHideAffirmationStatusDetails"
              >
                <div class="step-sub-content">
                  <span
                    class="action-link"
                    @click="controller.onAffirmationDetailsClicked()"
                  >
                    {{ controller.viewLessLabel }}
                  </span>
                </div>
              </div>
            </template>
          </template>
          <template #step-status>
            <template v-if="controller.isHideStatusDetails.value">
              <div class="step-content">
                <b>{{ controller.circulationDeadlineLabel }}</b>
                <div class="step-dates">
                  {{ controller.circulationDeadline }}
                </div>
                <b>{{ controller.lodgementDeadlineLabel }}</b>
                <div class="step-deads">
                  {{ controller.lodgementDeadline }}
                </div>
              </div>
              <div
                class="step-content"
                v-if="controller.canHideAffirmationStatusDetails"
              >
                <span
                  class="action-link"
                  @click="controller.onStatusDetailsClicked()"
                >
                  {{ controller.viewMoreLabel }}
                </span>
              </div>
            </template>
            <template v-if="!controller.isHideStatusDetails.value">
              <div class="step-content">
                <b>{{ controller.circulationDeadlineLabel }}</b>
                <div class="step-dates">
                  {{ controller.circulationDeadline }}
                </div>
                <b>{{ controller.lodgementDeadlineLabel }}</b>
                <div class="step-deads">
                  {{ controller.lodgementDeadline }}
                </div>
              </div>
              <div class="step-content">
                <b>{{ controller.financialStatements }}</b>
                <div v-if="!controller.hasUploadedFinancialStatement">
                  <FileUploaderLink
                    :placeholder="controller.uploadFinancialStatementLabel"
                    :existing-file="controller.financialStatementFile"
                    @fileUploaded="controller.onUploadFinancialStatement($event)"
                  />
                  <button
                    v-if="controller.existingFinancialStatement.value"
                    class="btn btn-danger"
                    @click="controller.onCancelReuploadClicked()"
                  >
                    {{ controller.cancelLabel }}
                  </button>
                </div>
                <div
                  v-if="controller.hasUploadedFinancialStatement"
                  class="step-buttons"
                >
                  <button
                    class="btn btn-danger"
                    @click="controller.onReuploadClicked()"
                  >
                    {{ controller.reuploadLabel }}
                  </button>
                  <button
                    class="btn btn-submit"
                    :class="{ 'is-loading': controller.isDownloadingFinancialStatements.value }"
                    @click="controller.onDownloadFinancialStatements()"
                  >
                    {{ controller.downloadLabel }}
                  </button>
                </div>
              </div>
              <div class="step-content">
                <b>{{ controller.auditCirculationLabel }}</b>
                <div class="step-buttons">
                  <button
                    class="btn btn-submit"
                    @click="controller.onOpenAuditCirculationService()"
                  >
                    {{ controller.initiateCirculation }}
                  </button>
                </div>
              </div>
              <div class="step-content">
                <b>{{ controller.eotLabel }}</b>
                <div class="step-buttons">
                  <button
                    class="btn btn-primary"
                    @click="controller.onOpenExtensionOfTimeService()"
                  >
                    {{ controller.applyEotLabel }}
                  </button>
                </div>
              </div>
              <div
                class="step-content"
                v-if="controller.canHideAffirmationStatusDetails"
              >
                <span
                  class="action-link"
                  @click="controller.onStatusDetailsClicked()"
                >
                  {{ controller.viewLessLabel }}
                </span>
              </div>
            </template>
          </template>
        </CompanyServiceWrapper>
        <ActionTray
          v-if="controller.isShowActionTray && !controller.isShowHiddenDocuments"
          ref="actionTrayRef"
          :actions="controller.actionTrayElements.value"
        />
      </div>
      <div
        class="hidden-documents"
        :class="{ show: controller.isShowHiddenDocuments }"
      >
        <SetFinancialYearEndService
          v-if="controller.isShowSetFyeServiceDocument"
          :companyId="controller.companyId.value"
          :viewType="'new'"
        />
        <AppointAuditorForSubmissionService
          v-if="controller.isShowAppointAuditorService.value"
          :companyId="controller.companyId.value"
          :viewType="'new'"
          @back="controller.onCloseAppointAuditorService()"
        />
        <CirculateFinancialStatementService
          v-if="controller.isShowAuditCirculationService.value"
          :companyId="controller.companyId.value"
          :financial-period-id="controller.companyFinancialPeriod.value.id"
          :viewType="'existing'"
          @back="controller.onCloseAuditCirculationService()"
        />
        <ExtensionOfTimeService
          v-if="controller.isShowExtensionOfTimeService.value"
          :companyId="controller.companyId.value"
          :financial-period-id="controller.companyFinancialPeriod.value.id"
          :viewType="'existing'"
          @back="controller.onCloseExtensionOfTimeService()"
        />
      </div>
    </template>

    <Teleport to="body">
      <PaymentForFinancialStatements
        ref="paymentConfirmationRef"
        @unaudited="controller.onSubmitUnauditedFinancialStatements()"
        @audited="controller.onSubmitAuditedFinancialStatements()"
      />
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
  import ActionTray from "@/components/ActionTrays/ActionTray.vue"
  import CirculateFinancialStatementService from "@/components/CompanyServices/CirculateFinancialStatementService.vue"
  import CompanyServiceWrapper from "@/components/CompanyServices/CompanyServiceWrapper.vue"
  import DcrAppointResponsiblePerson from "@/components/Resolutions/DcrAppointResponsiblePerson.vue"
  import FileUploaderLink from "@/components/FileUploaders/Link.vue"
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import PaymentForFinancialStatements from "@/components/Popups/PaymentForFinancialStatements.vue"
  import AppointAuditorForSubmissionService from "@/components/CompanyServices/AppointAuditorForSubmissionService.vue"
  import ExtensionOfTimeService from "./ExtensionOfTimeService.vue"
  import SetFinancialYearEndService from "@/components/CompanyServices/SetFinancialYearEndService.vue"
  import { SubmitFinancialStatementServiceController } from "~/scripts/components/company-services/SubmitFinancialStatementServiceController"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
  })

  const emit = defineEmits([])

  const paymentConfirmationRef = ref(null)

  const controller = new SubmitFinancialStatementServiceController(props.companyId, emit)

  watch(
    () => props.companyId,
    (newVal) => {
      controller.setCompanyId(newVal)
    }
  )

  watch(
    paymentConfirmationRef,
    (newVal) => {
      controller.setPaymentConfirmationRef(newVal)
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
  @use "~/assets/scss/components/CompanyServices/SubmitFinancialStatementService" as *;
</style>
