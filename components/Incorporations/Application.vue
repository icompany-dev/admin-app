<template>
  <div id="incorporations-application">
    <div
      class="loader-container"
      v-if="controller.isLoading.value"
    >
      <LoaderPrepare
        :label="controller.loaderLabel"
        :sublabel="controller.loaderSublabel"
      />
    </div>
    <template v-if="!controller.isLoading.value">
      <div class="incorp-application-summary">
        <div class="proposed-name">
          {{ controller.application.value.getName() }}
          <span
            class="name-approved"
            v-if="controller.isNameApproved"
          >
            <i class="fa-solid fa-circle-check" />
          </span>
        </div>
        <div class="summary-items">
          <div class="summary-item">
            <div class="summary-item-title">
              {{ controller.applicantLabel }}
            </div>
            <div class="summary-item-content human-details">
              <span class="human-detail">
                <b>{{ controller.applicantName }}</b>
              </span>
              <span class="human-detail">
                <i class="fa-regular fa-envelope" />
                {{ controller.applicantEmail }}
              </span>
              <span class="human-detail">
                <i class="fa-brands fa-whatsapp" />
                {{ controller.applicantPhone }}
              </span>
            </div>
          </div>
          <div class="summary-item">
            <div class="summary-item-title">
              {{ controller.directorLabel }}
            </div>
            <div
              class="summary-item-content"
              v-for="(director, index) in controller.directorDetails"
              :key="`director-${index}`"
            >
              <Director
                v-bind="controller.getPropsInvitationDetail(director)"
                @showDocument="controller.onOpenSection201Clicked(director)"
              />
            </div>
          </div>
          <div class="summary-item">
            <div class="summary-item-title">
              {{ controller.shareholderLabel }}
            </div>
            <div
              class="summary-item-content human-details"
              v-for="(shareholder, index) in controller.shareholderDetails"
            >
              <span class="human-detail">
                <b>{{ shareholder.name }}</b>
              </span>
              <span class="human-detail">
                <i class="fa-regular fa-envelope" />
                {{ shareholder.email }}
              </span>
              <span class="human-detail">
                <i class="fa-brands fa-whatsapp" />
                {{ shareholder.user.phone }}
              </span>
              <span class="human-detail">{{ controller.totalSharesLabel }}: {{ shareholder.totalShares }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="incorp-application-summary">
        <div class="application-items">
          <div class="application-item">
            <div class="application-item-title">
              {{ controller.businessNatureLabel }}
              <div class="action-icons">
                <i
                  v-if="controller.isEditingDescription.value && !controller.isUpdatingDescription.value"
                  class="fa-regular fa-xmark clickable cancel"
                  @click="controller.onCancelEditBusinessDescriptionClicked()"
                />
                <i
                  v-if="controller.isEditingDescription.value && !controller.isUpdatingDescription.value"
                  class="fa-regular fa-save clickable save"
                  @click="controller.onSaveBusinessDescriptionClicked()"
                />
                <i
                  v-if="!controller.isEditingDescription.value"
                  class="fa-regular fa-edit clickable edit"
                  @click="controller.onEditBusinessDescriptionClicked()"
                />
                <i
                  v-if="controller.isUpdatingDescription.value"
                  class="fa-regular fa-spin fa-spinner edit"
                />
              </div>
            </div>
            <div class="application-item-content">
              <template v-if="controller.isEditingDescription.value">
                <textarea
                  class="form-control"
                  v-model="controller.application.value.businessDescription"
                />
              </template>
              <template v-if="!controller.isEditingDescription.value">
                {{ controller.application.value.businessDescription }}
              </template>
            </div>
            <div class="application-item-title">
              {{ controller.msicCodeLabel }}
            </div>
            <div class="application-item-content">
              <template v-if="controller.isEditingDescription.value">
                <SearchableDropdown
                  :is-searchable="true"
                  :options="controller.firstMsicCodeOptions"
                  :selected-item-name="controller.firstSelectedMsicCodeName"
                  :label-key="'label'"
                  :value-key="'id'"
                  @search="controller.onMsicCodeSearched($event, 0)"
                  @selected="controller.onMsicCodeSelected($event, 0)"
                />
                <SearchableDropdown
                  :is-searchable="true"
                  :options="controller.secondMsicCodeOptions"
                  :selected-item-name="controller.secondSelectedMsicCodeName"
                  :label-key="'label'"
                  :value-key="'id'"
                  @search="controller.onMsicCodeSearched($event, 1)"
                  @selected="controller.onMsicCodeSelected($event, 1)"
                />
                <SearchableDropdown
                  :is-searchable="true"
                  :options="controller.thirdMsicCodeOptions"
                  :selected-item-name="controller.thirdSelectedMsicCodeName"
                  :label-key="'label'"
                  :value-key="'id'"
                  @search="controller.onMsicCodeSearched($event, 2)"
                  @selected="controller.onMsicCodeSelected($event, 2)"
                />
              </template>
              <span
                v-if="!controller.isEditingDescription.value"
                v-html="controller.msicCodesList"
              />
            </div>
          </div>
          <div class="application-item">
            <div class="application-item-title">
              {{ controller.businessAddressLabel }}
            </div>
            <div
              class="application-item-content"
              v-html="controller.businessAddress"
            />
          </div>
        </div>
      </div>
      <div class="incorp-application-details">
        <ServiceApplication
          v-bind="controller.serviceApplicationProps"
          @paymentNodeSelected="controller.onPaymentStepClicked()"
        >
          <template #application>
            <ApplicationNode
              v-bind="controller.nameReservationNodeProps"
              @click="controller.onNameReservationStepClicked()"
            >
              <template #nodeContent>
                <div class="application-container">
                  <div class="node-title">{{ controller.nameReservationLabel }}</div>
                  <div class="node-subtitle">({{ controller.nameReservationSublabel }})</div>
                  <div class="application-details">
                    <span class="application-label">
                      {{ controller.proposedNamesLabel }}
                    </span>
                    <div class="actions-button-options">
                      <div
                        class="btn btn-primary selected"
                        @click="controller.onProposedNamesClicked()"
                      >
                        <span class="label">{{ controller.selectedProposedNameForDisplay }}</span>
                        <i
                          class="fa-solid fa-caret-down"
                          :class="{ rotate: controller.isShowProposedNames.value }"
                        ></i>
                      </div>
                      <div
                        class="options"
                        :class="{ show: controller.isShowProposedNames.value }"
                      >
                        <button
                          v-for="(name, index) in controller.nameOptions"
                          :key="index"
                          class="btn btn-primary name-option"
                          @click="controller.onProposedNamesSelected(name)"
                        >
                          {{ name }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <template #nodeOptions>
                <button
                  class="btn btn-pill btn-primary"
                  :class="{ 'is-loading': controller.isUploadingSection27.value }"
                  @click="controller.onUploadDocumentClicked('notification_of_name_reservation')"
                >
                  {{ controller.uploadSection27Label }}
                </button>
                <span
                  class="action-link download"
                  v-if="controller.isSection27Uploaded"
                  @click="controller.onDownloadSection27Clicked()"
                >
                  <i class="fa-regular fa-cloud-arrow-down"></i>
                  {{ controller.downloadDocumentSection27Label }}
                </span>
              </template>
              <template #nodeActions>
                <div class="actions-button-options">
                  <div
                    class="btn btn-pill btn-submit selected"
                    :class="{
                      'is-loading': controller.isUpdatingSection27.value,
                      single: !controller.hasNextStepsForSection27,
                    }"
                    @click="controller.onShowSection27ActionClicked()"
                  >
                    <span class="label">{{ controller.section27ActionLabel }}</span>
                    <i
                      v-if="controller.hasNextStepsForSection27"
                      class="fa-solid fa-caret-down"
                      :class="{ rotate: controller.isShowSection27Actions.value }"
                    ></i>
                  </div>
                  <div
                    class="options"
                    :class="{ show: controller.isShowSection27Actions.value }"
                  >
                    <button
                      class="btn btn-pill btn-submit"
                      :disabled="!controller.canSubmitSection27"
                      @click="controller.onSubmitNameReservation()"
                    >
                      {{ controller.submitSection27ApplicationLabel }}
                    </button>
                    <button
                      class="btn btn-pill btn-submit"
                      :disabled="!controller.canUpdateSection27"
                      @click="controller.onQueryNameReservation()"
                    >
                      {{ controller.querySection27ApplicationLabel }}
                    </button>
                    <button
                      class="btn btn-pill btn-submit"
                      :disabled="!controller.canResubmitSection27"
                      @click="controller.onSubmitNameReservation()"
                    >
                      {{ controller.resubmitSection27ApplicationLabel }}
                    </button>
                    <button
                      class="btn btn-pill btn-submit"
                      :disabled="!controller.canUpdateSection27"
                      @click="controller.onApproveNameReservation()"
                    >
                      {{ controller.approvedSection27Label }}
                    </button>
                    <button
                      class="btn btn-pill btn-submit"
                      :disabled="!controller.canUpdateSection27"
                      @click="controller.onNameReservationRejectedClicked()"
                    >
                      {{ controller.rejectedSection27Label }}
                    </button>
                  </div>
                </div>
              </template>
            </ApplicationNode>
            <ApplicationNode
              v-bind="controller.registrationNodeProps"
              @click="controller.onRegistrationOfIncorporationClicked()"
            >
              <template #nodeContent>
                <div class="application-container">
                  <div class="node-title">{{ controller.registrationLabel }}</div>
                  <div class="node-subtitle">({{ controller.registrationSublabel }})</div>
                </div>
              </template>
              <template #nodeOptions>
                <button
                  class="btn btn-pill btn-primary"
                  :class="{ 'is-loading': controller.isUploadingRegistration.value }"
                  @click="controller.onUploadDocumentClicked('superform')"
                >
                  {{ controller.uploadSuperformLabel }}
                </button>
                <span
                  class="action-link download"
                  v-if="controller.isSuperformUploaded"
                  @click="controller.onDownloadSuperformClicked()"
                >
                  <i class="fa-regular fa-cloud-arrow-down"></i>
                  {{ controller.downloadSuperformLabel }}
                </span>
              </template>
              <template #nodeActions>
                <div class="actions-button-options">
                  <div
                    class="btn btn-pill btn-submit selected"
                    :class="{
                      'is-loading': controller.isUpdatingRegistration.value,
                      single: !controller.hasNextStepsForRegistration,
                    }"
                    @click="controller.onShowRegistrationActionsClicked()"
                  >
                    <span class="label">{{ controller.registrationActionLabel }}</span>
                    <i
                      v-if="controller.hasNextStepsForRegistration"
                      class="fa-solid fa-caret-down"
                      :class="{ rotate: controller.isShowRegistrationActions.value }"
                    ></i>
                  </div>
                  <div
                    class="options"
                    :class="{ show: controller.isShowRegistrationActions.value }"
                  >
                    <button
                      class="btn btn-pill btn-submit"
                      :disabled="controller.isIncorporationApproved"
                      @click="controller.onIncorporationApproved()"
                    >
                      {{ controller.approvedRegistrationLabel }}
                    </button>
                  </div>
                </div>
              </template>
            </ApplicationNode>
            <ApplicationNode
              v-bind="controller.completionnNodeProps"
              @click.capture="controller.onCompletionOfIncorporationClicked()"
            >
              <template #nodeContent>
                <div class="application-container">
                  <div class="node-title">{{ controller.completionOfIncorporationLabel }}</div>
                  <div class="node-subtitle">({{ controller.completionOfIncorporationSublabel }})</div>
                  <div class="application-details">
                    <span class="application-label">
                      {{ controller.documentsToGenerateLabel }}
                    </span>
                    <ol>
                      <li>
                        <span class="document-label">
                          {{ controller.viewSection201Label }}
                        </span>
                        <ul>
                          <li
                            v-for="(director, i) in controller.directorDetails"
                            :key="i"
                          >
                            <span
                              class="document-label"
                              @click="controller.onViewSection201Clicked(director)"
                            >
                              {{ director.name }}
                            </span>
                            <i
                              class="fa-solid fa-circle-check document-icon success"
                              v-if="controller.hasGeneratedSection201For(director)"
                            />
                            <i
                              class="fa-solid fa-download document-icon info"
                              v-if="!controller.hasGeneratedSection201For(director)"
                              @click="controller.generatedSection201For(director)"
                            />
                          </li>
                        </ul>
                      </li>
                      <li>
                        <span
                          class="document-label"
                          @click="controller.onSection236Clicked()"
                        >
                          {{ controller.generateSection236Label }}
                        </span>
                        <i
                          class="fa-solid fa-circle-check document-icon success"
                          v-if="controller.hasGeneratedSection236"
                        />
                        <i
                          class="fa-solid fa-download document-icon info"
                          v-if="!controller.hasGeneratedSection236"
                          @click="controller.onGenerate236Clicked()"
                        />
                      </li>
                      <li>
                        <span class="document-label">
                          {{ controller.corporateProfileLabel }}
                        </span>
                        <i
                          class="fa-solid fa-circle-check document-icon success"
                          v-if="controller.hasPurchasedCorporateProfile"
                          @click="controller.onDownloadCorporateProfile()"
                        />
                        <i
                          class="fa-solid fa-circle-dollar document-icon info"
                          v-if="!controller.hasPurchasedCorporateProfile"
                          @click="controller.onPurchaseCorporateProfile()"
                        />
                      </li>
                    </ol>
                  </div>
                </div>
              </template>
              <template #nodeOptions>
                <button
                  class="btn btn-pill btn-primary"
                  :class="{ 'is-loading': controller.isUploadingCompletion.value }"
                  @click="controller.onUploadDocumentClicked('coi')"
                >
                  {{ controller.uploadlCOILabel }}
                </button>
                <span
                  class="action-link download"
                  v-if="controller.isCOIUploaded"
                  @click="controller.onDownloadCOIClicked()"
                >
                  <i class="fa-regular fa-cloud-arrow-down"></i>
                  {{ controller.downloadCOILabel }}
                </span>
              </template>
              <template #nodeActions>
                <div class="actions-button-options">
                  <div
                    class="btn btn-pill btn-submit selected"
                    :class="{
                      'is-loading': controller.isUpdatingCompletion.value,
                      single: !controller.hasNextStepsForCompletion,
                    }"
                    @click="controller.onShowCompletionActionsClicked()"
                  >
                    <span class="label">{{ controller.completionActionLabel }}</span>
                    <i
                      v-if="controller.hasNextStepsForCompletion"
                      class="fa-solid fa-caret-down"
                      :class="{ rotate: controller.isShowCompletionActions.value }"
                    ></i>
                  </div>
                  <div
                    class="options"
                    :class="{ show: controller.isShowCompletionActions.value }"
                  >
                    <button
                      class="btn btn-pill btn-submit"
                      :disabled="!controller.areDocumentsReadyToConvert"
                      @click="controller.onCompleteIncorporation()"
                    >
                      {{ controller.convertLabel }}
                    </button>
                  </div>
                </div>
              </template>
            </ApplicationNode>
          </template>
        </ServiceApplication>
        <div class="document-display">
          <component
            ref="documentRef"
            :is="activeDocumentComponent"
            :application-id="controller.serviceApplicationId"
            :target-id="controller.paymentOrderId.value"
            :application-name-reservation-id="controller.latestSection27Application?.id ?? ''"
            :company-name="controller.companyToConvert.getFullName()"
            :registration-number-new="controller.companyToConvert.registrationNumberNew"
            :registration-number-old="controller.companyToConvert.registrationNumberOld"
          />
        </div>
      </div>
    </template>
    <ReservedNameForNewSdnBhd
      ref="nameReservedPopup"
      :application="controller.applicationNameReservation.value"
      @proceed="controller.onProceedSubmitNameReservation($event)"
    />
    <ReservedNameForNewSdnBhdQueried
      ref="nameReservedQueriedPopup"
      :application="controller.applicationNameReservation.value"
      @proceed="controller.onProceedQueryNameReservation($event)"
    />
    <CompletionOfIncorporation
      ref="completionOfIncorporationPopup"
      :company-name="controller.application.value.getName()"
      @proceed="controller.onProceedIncorporationApproved($event)"
    />
    <UploadFile
      ref="uploadFilePopup"
      v-bind="controller.uploadDocumentProps"
      @uploaded="controller.onDocumentUploaded($event)"
    />
  </div>
</template>

<script lang="ts" setup>
  import ApplicationNode from "@/components/Services/ApplicationNode.vue"
  import CompletionOfIncorporation from "@/components/Popups/CompletionOfIncorporation.vue"
  import Director from "@/components/Invitations/Director.vue"
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import ReservedNameForNewSdnBhd from "@/components/Popups/ReservedNameForNewSdnBhd.vue"
  import ReservedNameForNewSdnBhdQueried from "@/components/Popups/ReservedNameForNewSdnBhdQueried.vue"
  import ReceiptInvoiceService from "@/components/CompanyServices/ReceiptInvoiceService.vue"
  import SearchableDropdown from "@/components/Forms/SearchableDropdown.vue"
  import Section201Service from "@/components/CompanyServices/Section201Service.vue"
  import Section236ThreeService from "@/components/CompanyServices/Section236ThreeService.vue"
  import Section27OneFourService from "@/components/CompanyServices/Section27OneFourService.vue"
  import ServiceApplication from "@/components/Services/ServiceApplication.vue"
  import UploadFile from "@/components/Popups/UploadFile.vue"
  import { ApplicationController } from "~/scripts/components/incorporations/ApplicationController"
  import type { IPropsIncorporationApplication } from "~/scripts/props/PropsIncorporationApplication"
  import { DocumentTargets } from "~/scripts/constants/DocumentTargets"

  const props = defineProps<IPropsIncorporationApplication>()

  const emit = defineEmits(["back"])

  const componentMap: Record<string, any> = {
    [DocumentTargets.TARGET_RECEIPT]: ReceiptInvoiceService,
    [DocumentTargets.TARGET_SECTION_201]: Section201Service,
    [DocumentTargets.TARGET_INCORP_SECTION_27]: Section27OneFourService,
    [DocumentTargets.TARGET_SECTION_236]: Section236ThreeService,
  }

  const documentRef = ref(null)

  const nameReservedPopup = ref(null)
  const nameReservedQueriedPopup = ref(null)
  const completionOfIncorporationPopup = ref(null)
  const uploadFilePopup = ref(null)

  const controller = new ApplicationController(props, emit)

  const activeDocumentComponent = computed(() => {
    const target = controller.selectedDocumentTarget.value
    return target && componentMap[target] ? componentMap[target] : null
  })

  watch(
    () => props,
    (newVal) => {
      controller.setDataFromProps(newVal)
    },
    { deep: true }
  )

  watch(
    nameReservedPopup,
    (newVal) => {
      controller.setNameReservedPopup(newVal)
    },
    { immediate: true }
  )

  watch(
    nameReservedQueriedPopup,
    (newVal) => {
      controller.setNameReservedQueriedPopup(newVal)
    },
    { immediate: true }
  )

  watch(
    completionOfIncorporationPopup,
    (newVal) => {
      controller.setCompletionOfIncorporationPopup(newVal)
    },
    { immediate: true }
  )

  watch(
    uploadFilePopup,
    (newVal) => {
      controller.setUploadFilePopup(newVal)
    },
    { immediate: true }
  )

  watch(
    documentRef,
    (newVal) => {
      controller.setDocumentRef(newVal)
    },
    { immediate: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Incorporations/Application" as *;
</style>
